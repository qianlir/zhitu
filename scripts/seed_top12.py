#!/usr/bin/env python3
"""生成四校八大种子 md 文件到 data/schools_md/<slug>/。

每所学校产出 5 个 md：
  README.md / basic-info.md / admission-history.md / gaokao-results.md / evaluation.md

每个 md 含 YAML frontmatter，被 scripts/md_to_db.py 解析入库。

幂等：覆盖式写入。
"""
from __future__ import annotations

import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _seed_data import SCHOOLS, ADMISSIONS, GAOKAO, EVALUATIONS  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHOOLS_MD_DIR = REPO_ROOT / "data" / "schools_md"
TZ_SH = timezone(timedelta(hours=8))


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
source: llm_seed
scraped_at: {now_iso()}
---

# {school["name"]} ({school["short_name"]})

> {school["intro"]}

## 文档索引

- [基本信息](basic-info.md)
- [历年录取分数线](admission-history.md)
- [高考成绩](gaokao-results.md)
- [综合评估](evaluation.md)
- 原始爬虫数据：`raw/`（待爬虫填充）

## 关键标签

{" ".join(f"`{t}`" for t in school["tags"])}

## 数据状态

- ✅ 基本信息（种子）
- ✅ 2023-2025 统招分数线（种子，近似值）
- ✅ 2023-2024 高考成绩（种子，近似值）
- ✅ 综合评估（LLM 估计）
- ⏳ 历年完整数据（待爬虫覆盖）
"""
    (school_dir / "README.md").write_text(md, encoding="utf-8")


def write_basic(school: dict, school_dir: Path) -> None:
    sid = school["school_id"]
    md = f"""---
school_id: {sid}
name: {school["name"]}
short_name: {school["short_name"]}
district: {school["district"]}
tier: {school["tier"]}
type: {school["type"]}
ownership: {school["ownership"]}
address: "{school["address"]}"
phone: "{school["phone"]}"
website: {school["website"]}
tags: {yaml_list(school["tags"])}
doc_type: basic
source: llm_seed
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
| 校区地址 | {school["address"]} |
| 联系电话 | {school["phone"]} |
| 官方网站 | <{school["website"]}> |
| 标签 | {", ".join(school["tags"])} |

## 简介

{school["intro"]}
"""
    (school_dir / "basic-info.md").write_text(md, encoding="utf-8")


def write_admissions(school: dict, school_dir: Path) -> None:
    sid = school["school_id"]
    rows = ADMISSIONS.get(sid, [])

    yaml_rows = "\n".join(
        f"  - year: {y}\n"
        f"    batch: {b}\n"
        f"    min_score: {ms}\n"
        f"    quota: {q}\n"
        f"    control_line: {cl}"
        for y, b, ms, q, cl in rows
    )

    table_rows = "\n".join(
        f"| {y} | {b} | {ms} | {q} | {cl} |"
        for y, b, ms, q, cl in rows
    )

    md = f"""---
school_id: {sid}
doc_type: admission
source: llm_seed_approximate
scraped_at: {now_iso()}
admissions:
{yaml_rows}
---

# {school["name"]} 历年录取分数线

> ⚠️ 以下数据为基于公开报道的近似值，最终以上海市教育考试院官方公布为准。

| 年份 | 批次 | 最低分 | 招生名额 | 当年控制线 |
|---|---|---|---|---|
{table_rows}

## 数据来源

- 公开媒体报道汇总（家长帮 / 中考网 / 各类志愿手册）
- 待爬虫从中考网（shanghai.zhongkao.com）覆盖更新

## 备注

- 上海中考自 2024 年起恢复 750 分制
- "名额到区/到校"批次数据待补充
- "自主招生"批次数据待补充
"""
    (school_dir / "admission-history.md").write_text(md, encoding="utf-8")


def write_gaokao(school: dict, school_dir: Path) -> None:
    sid = school["school_id"]
    rows = GAOKAO.get(sid, [])

    yaml_rows = "\n".join(
        f"  - year: {y}\n"
        f"    one_ben_rate: {ob}\n"
        f"    prestigious_rate: {pr}\n"
        f"    qingbei_count: {qb}\n"
        f"    fudan_jiaoda_count: {fj}"
        for y, ob, pr, qb, fj in rows
    )

    table_rows = "\n".join(
        f"| {y} | {ob*100:.0f}% | {pr*100:.0f}% | {qb} | {fj} |"
        for y, ob, pr, qb, fj in rows
    )

    md = f"""---
school_id: {sid}
doc_type: gaokao
source: llm_seed_approximate
scraped_at: {now_iso()}
gaokao_results:
{yaml_rows}
---

# {school["name"]} 高考成绩

> ⚠️ 以下数据为公开报道近似值，部分学校官方未公布完整数据。

| 年份 | 一本率 | 985/211率 | 清北人数 | 复交人数 |
|---|---|---|---|---|
{table_rows}

## 说明

- "一本率"指特殊类型招生控制线以上比例
- 清北 = 清华 + 北大
- 复交 = 复旦 + 交大
- 数据来源：各校官网年度新闻、媒体报道
"""
    (school_dir / "gaokao-results.md").write_text(md, encoding="utf-8")


def write_evaluation(school: dict, school_dir: Path) -> None:
    sid = school["school_id"]
    overall, academic, college, mgmt, extra, loc = EVALUATIONS.get(sid, (0,)*6)

    summary = f"""{school["short_name"]}作为{school["tier"].replace("_", " ")}梯队学校，
{school["intro"]}
综合学业水平、升学质量、学校管理、课外活动、地理位置五个维度评估，总分 {overall}/10。"""

    md = f"""---
school_id: {sid}
doc_type: evaluation
source: llm_estimated
evaluator: claude-opus-4-7
evaluated_at: {now_iso()}
overall_score: {overall}
academic: {academic}
college_placement: {college}
management: {mgmt}
extracurricular: {extra}
location: {loc}
---

# {school["name"]} 综合评估

> ✨ AI 生成评估，仅供参考。

## 总分：{overall} / 10

| 维度 | 分数 |
|---|---|
| 学业水平 | {academic} |
| 升学质量 | {college} |
| 学校管理 | {mgmt} |
| 课外活动 | {extra} |
| 地理位置 | {loc} |

## 综合评价

{summary}

## 评估说明

- 评估基于公开资料的 LLM 综合判断，非定量调研结果
- 五维度权重默认相等，可在 API 层按用户偏好重新加权
- 数据将随爬虫数据回流持续校准
"""
    (school_dir / "evaluation.md").write_text(md, encoding="utf-8")


def write_index() -> None:
    """生成 data/schools_md/README.md 顶层索引。"""
    lines = [
        "# 上海高中数据库（schools_md）",
        "",
        "> 一所学校一目录，每个目录含 5 个 md 文件 + raw/ 爬虫原始数据。",
        "> 此目录是 QMD 集合 `sh-schools` 的索引目标，详见根 CLAUDE.md。",
        "",
        "## 学校列表",
        "",
        "| 简称 | 全名 | 区 | 层级 | 目录 |",
        "|---|---|---|---|---|",
    ]
    for s in sorted(SCHOOLS, key=lambda x: x["tier"] + x["school_id"]):
        sid = s["school_id"]
        lines.append(f"| {s['short_name']} | {s['name']} | {s['district']} | {s['type']} | [`{sid}/`]({sid}/) |")

    lines += [
        "",
        "## 文件约定",
        "",
        "每个学校目录下：",
        "- `README.md` — 学校总览 + 文档索引",
        "- `basic-info.md` — 基本信息（地址、电话、官网）",
        "- `admission-history.md` — 历年录取分数线",
        "- `gaokao-results.md` — 高考成绩",
        "- `evaluation.md` — LLM 综合评估",
        "- `raw/` — 爬虫原始数据（zhongkao-com.md 等）",
        "",
        "## YAML Frontmatter",
        "",
        "每个 md 顶部的 YAML 块是结构化字段，被 `scripts/md_to_db.py` 解析入库。",
        "文档体（YAML 之后的 Markdown）是人类阅读 + LLM 检索用。",
    ]
    (SCHOOLS_MD_DIR / "README.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    SCHOOLS_MD_DIR.mkdir(parents=True, exist_ok=True)

    for school in SCHOOLS:
        school_dir = SCHOOLS_MD_DIR / school["school_id"]
        school_dir.mkdir(parents=True, exist_ok=True)
        (school_dir / "raw").mkdir(exist_ok=True)

        write_readme(school, school_dir)
        write_basic(school, school_dir)
        write_admissions(school, school_dir)
        write_gaokao(school, school_dir)
        write_evaluation(school, school_dir)

        print(f"[ok] {school['short_name']:6s} → {school_dir.relative_to(REPO_ROOT)}")

    write_index()
    print(f"\n[ok] {len(SCHOOLS)} schools seeded → {SCHOOLS_MD_DIR.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
