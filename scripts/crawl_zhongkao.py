#!/usr/bin/env python3
"""中考网（shanghai.zhongkao.com）爬虫。

数据流：
    1. 抓"学校列表"页 → 解析出每所学校的 (name, district, detail_url)
    2. 逐校抓详情 → HTML 转 markdown
    3. 写到 data/schools_md/<slug>/raw/zhongkao-com.md
       含 frontmatter（school_id, doc_type=raw, source=zhongkao_com, scraped_at, source_url）
    4. 后续 parse_zhongkao.py 从 raw md 生成结构化的 admission-history.md 等

⚠️ 选择器（CSS/XPath）需首轮跑后根据实际页面结构调整：
    - LIST_SELECTOR / DETAIL_NAME_SELECTOR / DETAIL_DISTRICT_SELECTOR 标记 TODO
    - 用 --inspect <url> 子命令打印 HTML 结构辅助定位

使用：
    # 干跑（仅打印 list 页解析结果）
    python scripts/crawl_zhongkao.py list --pages 1 --dry-run

    # 抓 5 页学校列表（约 100 所）
    python scripts/crawl_zhongkao.py list --pages 5

    # 抓所有已知学校的详情页
    python scripts/crawl_zhongkao.py detail --limit 10   # 先 10 所验证

    # 全量
    python scripts/crawl_zhongkao.py detail

    # 调试：dump 单页 HTML 结构
    python scripts/crawl_zhongkao.py inspect "https://shanghai.zhongkao.com/school/xxx.shtml"
"""
from __future__ import annotations

import argparse
import asyncio
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urljoin
from urllib.robotparser import RobotFileParser

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _crawler_base import HtmlCache, ThrottledClient, fetch_with_cache, open_client  # noqa: E402
from _slug import slugify  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHOOLS_MD_DIR = REPO_ROOT / "data" / "schools_md"
CACHE_DIR = REPO_ROOT / "data" / "cache" / "zhongkao"
INDEX_FILE = REPO_ROOT / "data" / "cache" / "zhongkao_index.json"

TZ_SH = timezone(timedelta(hours=8))

# ============================================================
# 站点常量 — 首轮跑后请按实际页面验证调整
# ============================================================

BASE = "https://shanghai.zhongkao.com"
ROBOTS_URL = f"{BASE}/robots.txt"

# 学校列表分页 URL 模式（如 /school/list_p2.shtml）— TODO 验证
LIST_URL_TMPL = f"{BASE}/school/list_p{{page}}.shtml"

# CSS 选择器 — TODO 首轮 inspect 后修正
LIST_SCHOOL_LINK = "div.school-item a, ul.school-list li a, a.school-name"
LIST_DISTRICT = "span.district, span.area"

# 详情页选择器
DETAIL_TITLE = "h1, div.school-title, .name"
DETAIL_INFO_BLOCK = "div.school-info, div.info, table.info-table"


# ============================================================
# robots.txt 检查
# ============================================================

async def check_robots(client: ThrottledClient, path: str) -> bool:
    """简单 robots.txt 检查，被禁止则返回 False。"""
    rp = RobotFileParser()
    try:
        r = await client.get(ROBOTS_URL)
        if r is None:
            print("[warn] robots.txt 不可达，按允许处理（你需自行确认合规）")
            return True
        rp.parse(r.text.splitlines())
        allowed = rp.can_fetch("*", urljoin(BASE, path))
        if not allowed:
            print(f"[robots] 禁止抓取 {path}")
        return allowed
    except Exception as e:
        print(f"[warn] robots.txt 解析失败：{e}，按允许处理")
        return True


# ============================================================
# Phase 1: 抓学校列表
# ============================================================

def parse_list_page(html: str) -> list[dict]:
    """解析列表页 → [{name, district, detail_url}, ...]。

    实际选择器需首轮跑后调整。当前用宽松匹配兜底。
    """
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "lxml")
    items: list[dict] = []
    seen: set[str] = set()

    for a in soup.select(LIST_SCHOOL_LINK):
        name = a.get_text(strip=True)
        href = a.get("href", "")
        if not name or not href or len(name) < 3:
            continue
        # 必须含"中学"/"高级中学" 才视为高中
        if not any(k in name for k in ("中学", "高级中学", "高中")):
            continue
        url = urljoin(BASE, href)
        if url in seen:
            continue
        seen.add(url)

        # 同一行可能有 district
        parent = a.find_parent(["li", "div", "tr"])
        district = ""
        if parent:
            d = parent.select_one(LIST_DISTRICT)
            if d:
                district = d.get_text(strip=True)

        items.append({"name": name, "district": district, "detail_url": url})
    return items


async def crawl_list(pages: int, dry_run: bool = False) -> list[dict]:
    """爬学校列表页，合并去重。"""
    all_schools: dict[str, dict] = {}
    cache = HtmlCache(CACHE_DIR / "list")

    async with open_client() as client:
        if not await check_robots(client, "/school/"):
            return []

        for page in range(1, pages + 1):
            url = LIST_URL_TMPL.format(page=page)
            print(f"[list] page {page}/{pages}: {url}")
            html = await fetch_with_cache(client, cache, url)
            if html is None:
                print(f"  [skip] failed to fetch page {page}")
                continue
            items = parse_list_page(html)
            print(f"  [parsed] {len(items)} schools on page {page}")
            for it in items:
                all_schools[it["detail_url"]] = it

    schools = list(all_schools.values())
    print(f"\n[done] total unique schools: {len(schools)}")

    if dry_run:
        for s in schools[:20]:
            print(f"  {s['name']:20s} {s['district']:6s} {s['detail_url']}")
        if len(schools) > 20:
            print(f"  ... 共 {len(schools)} 所")
    else:
        INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)
        INDEX_FILE.write_text(
            json.dumps(schools, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"[saved] {INDEX_FILE.relative_to(REPO_ROOT)}")
    return schools


# ============================================================
# Phase 2: 抓学校详情
# ============================================================

def html_to_md(html: str, source_url: str) -> str:
    """详情页 HTML → 简化 markdown，保留主要文本结构。"""
    try:
        from markdownify import markdownify
    except ImportError:
        # 退化方案：BeautifulSoup 提取纯文本
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "lxml")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        return soup.get_text("\n\n", strip=True)

    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
        tag.decompose()
    return markdownify(str(soup), heading_style="ATX")


def write_raw_md(school: dict, md_text: str) -> Path:
    """写到 data/schools_md/<slug>/raw/zhongkao-com.md。"""
    slug = slugify(school["name"])
    school_dir = SCHOOLS_MD_DIR / slug / "raw"
    school_dir.mkdir(parents=True, exist_ok=True)
    out = school_dir / "zhongkao-com.md"

    fm = (
        "---\n"
        f"school_id: {slug}\n"
        f"name: {school['name']}\n"
        f"district: {school.get('district', '')}\n"
        "doc_type: raw\n"
        "source: zhongkao_com\n"
        f"source_url: {school['detail_url']}\n"
        f"scraped_at: {datetime.now(TZ_SH).isoformat(timespec='seconds')}\n"
        "---\n\n"
        f"# {school['name']} (中考网原始抓取)\n\n"
        f"> 来源: <{school['detail_url']}>\n\n"
        f"{md_text}\n"
    )
    out.write_text(fm, encoding="utf-8")
    return out


async def crawl_detail(limit: int | None = None) -> None:
    if not INDEX_FILE.exists():
        print(f"[err] {INDEX_FILE} 不存在。请先跑 `crawl_zhongkao.py list`")
        return

    schools = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    if limit:
        schools = schools[:limit]
    print(f"[detail] crawl {len(schools)} schools")

    cache = HtmlCache(CACHE_DIR / "detail")
    state_file = CACHE_DIR / "detail_state.json"
    done: set[str] = set()
    if state_file.exists():
        done = set(json.loads(state_file.read_text(encoding="utf-8")))

    async with open_client() as client:
        for i, sch in enumerate(schools, 1):
            url = sch["detail_url"]
            if url in done:
                continue
            html = await fetch_with_cache(client, cache, url)
            if html is None:
                continue
            md = html_to_md(html, url)
            out = write_raw_md(sch, md)
            done.add(url)
            state_file.write_text(json.dumps(sorted(done), ensure_ascii=False), encoding="utf-8")
            print(f"  [{i}/{len(schools)}] {sch['name']:20s} → {out.relative_to(REPO_ROOT)}")


# ============================================================
# 调试：dump 单页结构
# ============================================================

async def inspect(url: str) -> None:
    async with open_client() as client:
        r = await client.get(url)
        if r is None:
            print(f"[err] failed to fetch {url}")
            return
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(r.text, "lxml")
        for tag in soup(["script", "style"]):
            tag.decompose()
        print(f"# {url}\n")
        print("## <title>")
        print(soup.title.get_text(strip=True) if soup.title else "<none>")
        print("\n## h1/h2 headings")
        for h in soup.find_all(["h1", "h2"])[:20]:
            print(f"  {h.name}: {h.get_text(strip=True)[:80]}")
        print("\n## 链接候选 (含 中学/高中)")
        for a in soup.find_all("a"):
            txt = a.get_text(strip=True)
            href = a.get("href", "")
            if any(k in txt for k in ("中学", "高中")) and href:
                print(f"  {txt[:30]:30s} → {href}")
                if len([x for x in soup.find_all("a") if any(k in x.get_text(strip=True) for k in ("中学", "高中"))]) > 30:
                    print(f"  ... 截断")
                    break


# ============================================================
# CLI
# ============================================================

def main() -> None:
    p = argparse.ArgumentParser(description="中考网（上海）爬虫")
    sub = p.add_subparsers(dest="cmd", required=True)

    pl = sub.add_parser("list", help="抓学校列表")
    pl.add_argument("--pages", type=int, default=1, help="抓多少页（默认 1）")
    pl.add_argument("--dry-run", action="store_true")

    pd = sub.add_parser("detail", help="抓学校详情页")
    pd.add_argument("--limit", type=int, default=None)

    pi = sub.add_parser("inspect", help="dump 单页 HTML 结构辅助调试选择器")
    pi.add_argument("url")

    args = p.parse_args()

    if args.cmd == "list":
        asyncio.run(crawl_list(pages=args.pages, dry_run=args.dry_run))
    elif args.cmd == "detail":
        asyncio.run(crawl_detail(limit=args.limit))
    elif args.cmd == "inspect":
        asyncio.run(inspect(args.url))


if __name__ == "__main__":
    main()
