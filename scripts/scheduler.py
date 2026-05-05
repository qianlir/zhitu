#!/usr/bin/env python3
"""定时爬取 + 数据更新调度器。

支持三种数据源：
1. 百度百科 — 学校基本信息（地址/电话/简介/特色）
2. 上海教育考试院 — 分数线 PDF（年度更新）
3. 各校官网 — 招生公告、最新动态

调度模式：
- 手动: python scripts/scheduler.py run --source baike --limit 5
- 定时: python scripts/scheduler.py daemon --interval 24h
- 检查: python scripts/scheduler.py status

设计原则：
- 所有爬取结果写入 data/schools_md/<slug>/raw/ 目录
- 变更日志写入 data/cache/update_log.json
- 增量更新：只爬取有变化的数据，跳过未变内容
- 尊重源站：5 并发 + 1s 节流
"""
from __future__ import annotations

import argparse
import asyncio
import json
import re
import sqlite3
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _crawler_base import HtmlCache, open_client, fetch_with_cache  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "schools.db"
MD_DIR = REPO_ROOT / "data" / "schools_md"
CACHE_DIR = REPO_ROOT / "data" / "cache" / "scheduler"
LOG_FILE = REPO_ROOT / "data" / "cache" / "update_log.json"

TZ_SH = timezone(timedelta(hours=8))


def now_iso() -> str:
    return datetime.now(TZ_SH).isoformat(timespec="seconds")


def load_log() -> list[dict]:
    if LOG_FILE.exists():
        return json.loads(LOG_FILE.read_text(encoding="utf-8"))
    return []


def save_log(entries: list[dict]) -> None:
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    LOG_FILE.write_text(json.dumps(entries[-500:], ensure_ascii=False, indent=2), encoding="utf-8")


def get_schools() -> list[dict]:
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    rows = db.execute("SELECT school_id, name, short_name, website FROM schools ORDER BY tier, school_id").fetchall()
    db.close()
    return [dict(r) for r in rows]


# ============================================================
# Source: 百度百科
# ============================================================

async def crawl_baike(client, cache, schools, limit=0):
    """从百度百科抓取学校基本信息。"""
    results = []
    count = 0
    for s in schools:
        if limit and count >= limit:
            break
        name = s["name"]
        url = f"https://baike.baidu.com/item/{name}"
        html = await fetch_with_cache(client, cache, url)
        if not html:
            print(f"  [skip] {name}: fetch failed")
            continue

        info = _parse_baike(html, name)
        if info:
            raw_path = MD_DIR / s["school_id"] / "raw" / "baike.md"
            _write_raw_md(raw_path, s["school_id"], "baike", url, info)
            results.append({"school_id": s["school_id"], "source": "baike", "fields": list(info.keys())})
            print(f"  [ok] {s['short_name'] or name}: {len(info)} fields from baike")
        count += 1

    return results


def _parse_baike(html: str, name: str) -> dict:
    """从百度百科 HTML 提取关键信息。"""
    info = {}
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "lxml")

        summary = soup.select_one(".lemma-summary, .J-summary")
        if summary:
            info["summary"] = summary.get_text(strip=True)[:500]

        for row in soup.select(".basicInfo-item, .basic-info tr"):
            label_el = row.select_one(".basicInfo-item-name, dt, th")
            value_el = row.select_one(".basicInfo-item-value, dd, td")
            if label_el and value_el:
                label = label_el.get_text(strip=True).rstrip("：:")
                value = value_el.get_text(strip=True)
                if "地址" in label or "校址" in label:
                    info["address"] = value
                elif "电话" in label:
                    info["phone"] = value
                elif "网址" in label or "官网" in label:
                    info["website"] = value
                elif "创办" in label or "建校" in label:
                    info["founded"] = value
                elif "校训" in label:
                    info["motto"] = value
                elif "占地" in label:
                    info["campus_area"] = value
                elif "师" in label and "资" in label:
                    info["faculty"] = value
    except Exception as e:
        print(f"  [parse-err] {name}: {e}")

    return info


# ============================================================
# Source: 学校官网
# ============================================================

async def crawl_official(client, cache, schools, limit=0):
    """抓取学校官网首页，提取招生公告等。"""
    results = []
    count = 0
    for s in schools:
        if limit and count >= limit:
            break
        website = s.get("website")
        if not website:
            continue

        html = await fetch_with_cache(client, cache, website)
        if not html:
            print(f"  [skip] {s['short_name']}: official site unreachable")
            count += 1
            continue

        info = {"title": "", "accessible": True, "fetched_at": now_iso()}
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, "lxml")
            title = soup.find("title")
            if title:
                info["title"] = title.get_text(strip=True)
        except Exception:
            pass

        raw_path = MD_DIR / s["school_id"] / "raw" / "official-home.md"
        _write_raw_md(raw_path, s["school_id"], "official_site", website, info)
        results.append({"school_id": s["school_id"], "source": "official", "accessible": True})
        print(f"  [ok] {s['short_name']}: official site accessible")
        count += 1

    return results


# ============================================================
# 写 raw markdown
# ============================================================

def _write_raw_md(path: Path, school_id: str, source: str, url: str, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [
        "---",
        f"school_id: {school_id}",
        f"doc_type: raw",
        f"source: {source}",
        f"source_url: \"{url}\"",
        f"scraped_at: {now_iso()}",
        "---",
        "",
    ]
    for k, v in data.items():
        lines.append(f"## {k}")
        lines.append("")
        lines.append(str(v))
        lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")


# ============================================================
# 更新数据库
# ============================================================

def reload_db():
    """重新运行 md_to_db.py 入库。"""
    import subprocess
    print("\n[reload] Running md_to_db.py...")
    result = subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / "md_to_db.py")],
        capture_output=True, text=True,
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"[error] md_to_db failed: {result.stderr}")


# ============================================================
# 主调度
# ============================================================

async def run_crawl(source: str, limit: int = 0, reload: bool = True):
    schools = get_schools()
    print(f"[scheduler] {len(schools)} schools, source={source}, limit={limit or 'all'}")

    cache = HtmlCache(CACHE_DIR / source)
    log_entries = load_log()

    async with open_client(concurrency=3, throttle_ms=1000) as client:
        if source == "baike":
            results = await crawl_baike(client, cache, schools, limit)
        elif source == "official":
            results = await crawl_official(client, cache, schools, limit)
        else:
            print(f"[error] Unknown source: {source}")
            return

    log_entries.append({
        "timestamp": now_iso(),
        "source": source,
        "schools_processed": len(results),
        "results": results[:20],
    })
    save_log(log_entries)
    print(f"\n[done] {len(results)} schools updated from {source}")

    if reload and results:
        reload_db()


async def daemon_loop(interval_hours: float, sources: list[str]):
    """定时循环爬取。"""
    print(f"[daemon] Starting scheduler, interval={interval_hours}h, sources={sources}")
    while True:
        for source in sources:
            try:
                await run_crawl(source, limit=0, reload=False)
            except Exception as e:
                print(f"[error] {source}: {e}")

        reload_db()

        next_run = datetime.now(TZ_SH) + timedelta(hours=interval_hours)
        print(f"\n[sleep] Next run at {next_run.strftime('%Y-%m-%d %H:%M')}")
        await asyncio.sleep(interval_hours * 3600)


def show_status():
    """显示爬取状态。"""
    log = load_log()
    schools = get_schools()

    print(f"学校总数: {len(schools)}")
    print(f"更新日志: {len(log)} 条")

    if log:
        last = log[-1]
        print(f"\n最近一次更新:")
        print(f"  时间: {last['timestamp']}")
        print(f"  数据源: {last['source']}")
        print(f"  更新学校数: {last['schools_processed']}")

    with_website = sum(1 for s in schools if s.get("website"))
    print(f"\n数据完整度:")
    print(f"  有官网: {with_website}/{len(schools)} ({with_website/len(schools)*100:.0f}%)")

    cache_sources = []
    for d in (CACHE_DIR).iterdir() if CACHE_DIR.exists() else []:
        if d.is_dir():
            count = len(list(d.glob("*.html")))
            cache_sources.append(f"  {d.name}: {count} cached pages")
    if cache_sources:
        print(f"\n缓存:")
        for c in cache_sources:
            print(c)


def main():
    p = argparse.ArgumentParser(description="定时爬取 + 数据更新调度器")
    sub = p.add_subparsers(dest="command")

    run_p = sub.add_parser("run", help="手动执行一次爬取")
    run_p.add_argument("--source", choices=["baike", "official"], default="baike")
    run_p.add_argument("--limit", type=int, default=0, help="限制爬取学校数（0=全部）")
    run_p.add_argument("--no-reload", action="store_true", help="不重新入库")

    daemon_p = sub.add_parser("daemon", help="启动定时爬取守护进程")
    daemon_p.add_argument("--interval", type=float, default=24, help="爬取间隔（小时）")
    daemon_p.add_argument("--sources", nargs="+", default=["baike", "official"])

    sub.add_parser("status", help="显示爬取状态")

    args = p.parse_args()

    if args.command == "run":
        asyncio.run(run_crawl(args.source, args.limit, not args.no_reload))
    elif args.command == "daemon":
        asyncio.run(daemon_loop(args.interval, args.sources))
    elif args.command == "status":
        show_status()
    else:
        p.print_help()


if __name__ == "__main__":
    main()
