#!/usr/bin/env python3
"""从 data/seed/*.json 生成学校 md 文件。

数据与代码分离：
- data/seed/schools.json   — 学校基本信息
- data/seed/admissions.json — 录取分数线
- data/seed/gaokao.json    — 高考成绩

用法：
    python scripts/seed_all.py
"""
from __future__ import annotations

import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SEED_DIR = REPO_ROOT / "data" / "seed"
SCHOOLS_MD_DIR = REPO_ROOT / "data" / "schools_md"
TZ_SH = timezone(timedelta(hours=8))


def load_json(name: str) -> dict | list:
    path = SEED_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Seed data not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def now_iso() -> str:
    return datetime.now(TZ_SH).isoformat(timespec="seconds")


def yaml_list(items: list[str]) -> str:
    return "[" + ", ".join(f'"{x}"' for x in items) + "]"


def write_readme(school: dict, school_dir: Path) -> None:
    sid = school["school_id"]
    md = f"""---
school_id: {sid}
name: {school["name"]}
short_name: {school["short_name"]}
district: {school["district"]}
tier: {school["tier"]}
type: {school["type"]}
ownership: {school["ownership"]}
doc_type: readme
source: seed_json
scraped_at: {now_iso()}
---

# {school["name"]} ({school["short_name"]})

> {school["intro"]}

## 文档索引

- [基本信息](basic-info.md)
- [历年录取分数线](admission-history.md)
- [高考成绩](gaokao-results.md)

## 关键标签

{" ".join(f"`{t}`" for t in school.get("tags", []))}
"""
    (school_dir / "README.md").write_text(md, encoding="utf-8")


def write_basic(school: dict, school_dir: Path) -> None:
    sid = school["school_id"]
    website_line = f"website: {school['website']}" if school.get("website") else 'website: ""'
    md = f"""---
school_id: {sid}
name: {school["name"]}
short_name: {school["short_name"]}
district: {school["district"]}
tier: {school["tier"]}
type: {school["type"]}
ownership: {school["ownership"]}
address: "{school.get("address", "")}"
phone: "{school.get("phone", "")}"
{website_line}
tags: {yaml_list(school.get("tags", []))}
doc_type: basic
source: seed_json
scraped_at: {now_iso()}
---

# {school["name"]} 基本信息

| 字段 | 值 |
|---|---|
| 学校全名 | {school["name"]} |
| 简称 | {school["short_name"]} |
| 所在区 | {school["district"]} |
| 学校层级 | {school["type"]} |
| 办学性质 | {school["ownership"]} |
| 校区地址 | {school.get("address", "")} |
| 联系电话 | {school.get("phone", "")} |
| 官方网站 | {school.get("website") or "暂无"} |
| 标签 | {", ".join(school.get("tags", []))} |

## 简介

{school["intro"]}
"""
    (school_dir / "basic-info.md").write_text(md, encoding="utf-8")


def write_admissions(school: dict, admissions: list[dict], school_dir: Path) -> None:
    sid = school["school_id"]

    yaml_rows = "\n".join(
        f"  - year: {r['year']}\n"
        f"    batch: {r['batch']}\n"
        f"    min_score: {r['min_score']}\n"
        f"    quota: {r['quota']}\n"
        f"    control_line: {r['control_line']}"
        for r in admissions
    )

    table_rows = "\n".join(
        f"| {r['year']} | {r['batch']} | {r['min_score']} | {r['quota']} | {r['control_line']} |"
        for r in admissions
    )

    source = "official_2024" if any(r["year"] == 2024 for r in admissions) else "seed_approximate"

    md = f"""---
school_id: {sid}
doc_type: admission
source: {source}
scraped_at: {now_iso()}
admissions:
{yaml_rows}
---

# {school["name"]} 历年录取分数线

> 数据来源：上海市教育考试院、浦东新区政府官网等公开渠道。

| 年份 | 批次 | 最低分 | 招生名额 | 当年控制线 |
|---|---|---|---|---|
{table_rows}
"""
    (school_dir / "admission-history.md").write_text(md, encoding="utf-8")


def write_gaokao(school: dict, gaokao: list[dict], school_dir: Path) -> None:
    sid = school["school_id"]

    yaml_rows = "\n".join(
        f"  - year: {r['year']}\n"
        f"    one_ben_rate: {r['one_ben_rate']}\n"
        f"    prestigious_rate: {r['prestigious_rate']}\n"
        f"    qingbei_count: {r['qingbei_count']}\n"
        f"    fudan_jiaoda_count: {r['fudan_jiaoda_count']}"
        for r in gaokao
    )

    table_rows = "\n".join(
        f"| {r['year']} | {r['one_ben_rate']*100:.0f}% | {r['prestigious_rate']*100:.0f}% | {r['qingbei_count']} | {r['fudan_jiaoda_count']} |"
        for r in gaokao
    )

    md = f"""---
school_id: {sid}
doc_type: gaokao
source: seed_approximate
scraped_at: {now_iso()}
gaokao_results:
{yaml_rows}
---

# {school["name"]} 高考成绩

> 数据为公开报道近似值，部分学校未公布完整数据。

| 年份 | 一本率 | 985/211率 | 清北人数 | 复交人数 |
|---|---|---|---|---|
{table_rows}
"""
    (school_dir / "gaokao-results.md").write_text(md, encoding="utf-8")


def write_index(all_schools: list[dict]) -> None:
    lines = [
        "# 上海高中数据库（schools_md）",
        "",
        "> 一所学校一目录。数据来源：data/seed/*.json",
        "",
        "## 学校列表",
        "",
        "| 简称 | 全名 | 区 | 层级 | 目录 |",
        "|---|---|---|---|---|",
    ]
    for s in sorted(all_schools, key=lambda x: x["tier"] + x["school_id"]):
        sid = s["school_id"]
        lines.append(f"| {s['short_name']} | {s['name']} | {s['district']} | {s['type']} | [`{sid}/`]({sid}/) |")
    (SCHOOLS_MD_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    all_schools = load_json("schools.json")
    all_admissions = load_json("admissions.json")
    all_gaokao = load_json("gaokao.json")

    SCHOOLS_MD_DIR.mkdir(parents=True, exist_ok=True)

    for school in all_schools:
        sid = school["school_id"]
        school_dir = SCHOOLS_MD_DIR / sid
        school_dir.mkdir(parents=True, exist_ok=True)
        (school_dir / "raw").mkdir(exist_ok=True)

        write_readme(school, school_dir)
        write_basic(school, school_dir)

        admissions = all_admissions.get(sid, [])
        if admissions:
            write_admissions(school, admissions, school_dir)

        gaokao = all_gaokao.get(sid, [])
        if gaokao:
            write_gaokao(school, gaokao, school_dir)

        print(f"[ok] {school['short_name']:10s} → {school_dir.relative_to(REPO_ROOT)}")

    write_index(all_schools)
    print(f"\n[ok] {len(all_schools)} schools seeded → {SCHOOLS_MD_DIR.relative_to(REPO_ROOT)}")
    print(f"     NOTE: evaluation scores removed (were fabricated)")


if __name__ == "__main__":
    main()
