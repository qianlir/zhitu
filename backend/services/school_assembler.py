"""Assemble flat school objects from normalized DB tables.

The frontend expects a flat shape like:
  { id, name, district, tier, kind, funding, website,
    score2025, score2024, score2023, mingeDistrict, zizhao, ctrl, intake,
    bbenRate, top985, qbfd,
    admissions: [...], gaokao: [...], evaluation: {...} }
"""
from __future__ import annotations

import json
from pathlib import Path

from backend.db.connection import query, query_one

REPO_ROOT = Path(__file__).resolve().parent.parent.parent

TIER_LABELS = {
    "four_schools": "四校",
    "eight_greats": "八大",
    "city_key": "市重点",
    "district_key": "区重点",
    "regular": "普通高中",
}


def _tier_label(tier: str) -> str:
    return TIER_LABELS.get(tier, tier)


def _build_flat(school: dict, admissions: list[dict], gaokao: list[dict], evaluation: dict | None) -> dict:
    latest_year = 2025
    score_by_year = {}
    minge = None
    minge_school = None
    zizhao = None
    ctrl = None
    intake = 0

    batch_set = set()
    for a in admissions:
        yr = a["year"]
        batch = a["batch"]
        if yr == latest_year:
            intake += a.get("quota") or 0
            batch_set.add(batch)
        if batch == "统招":
            score_by_year[yr] = a["min_score"]
            if yr == latest_year:
                ctrl = a["control_line"]
        elif batch == "名额到区" and yr == latest_year:
            minge = a["min_score"]
        elif batch == "名额到校" and yr == latest_year:
            minge_school = a["min_score"]
        elif batch == "自主招生" and yr == latest_year:
            zizhao = a["min_score"]

    intake_note = "统招+到区+到校+自招" if len(batch_set) > 1 else "仅统招批次"

    latest_gk = None
    for g in gaokao:
        if latest_gk is None or g["year"] > latest_gk["year"]:
            latest_gk = g

    bben_rate = round((latest_gk["one_ben_rate"] or 0) * 100) if latest_gk else 0
    top985 = round((latest_gk["prestigious_rate"] or 0) * 100) if latest_gk else 0
    qbfd = ((latest_gk.get("qingbei_count") or 0) + (latest_gk.get("fudan_jiaoda_count") or 0)) if latest_gk else 0

    eval_data = None
    if evaluation:
        eval_data = {
            "overall": evaluation.get("overall_score"),
            "academic": evaluation.get("academic"),
            "college": evaluation.get("college_placement"),
            "management": evaluation.get("management"),
            "extra": evaluation.get("extracurricular"),
            "location": evaluation.get("location"),
            "summary": evaluation.get("llm_summary"),
        }

    intro = ""
    md_path = REPO_ROOT / school.get("md_dir", "") / "basic-info.md"
    if md_path.exists():
        text = md_path.read_text(encoding="utf-8")
        if "## 简介" in text:
            intro = text.split("## 简介")[-1].strip().split("\n---")[0].strip()

    return {
        "id": school["school_id"],
        "name": school["name"],
        "shortName": school.get("short_name") or "",
        "district": school["district"],
        "tier": _tier_label(school["tier"]),
        "kind": school["type"],
        "funding": school.get("ownership") or "公办",
        "website": school.get("website") or "",
        "address": school.get("address") or "",
        "phone": school.get("phone") or "",
        "intro": intro,
        "tags": json.loads(school.get("tags") or "[]") if isinstance(school.get("tags"), str) else (school.get("tags") or []),
        "score2025": score_by_year.get(2025),
        "score2024": score_by_year.get(2024),
        "score2023": score_by_year.get(2023),
        "mingeDistrict": minge,
        "mingeSchool": minge_school,
        "zizhao": zizhao,
        "ctrl": ctrl,
        "intake": intake,
        "intakeNote": intake_note,
        "bbenRate": bben_rate,
        "top985": top985,
        "qbfd": qbfd,
        "admissions": admissions,
        "gaokao": [
            {
                "year": g["year"],
                "oneBenRate": round((g["one_ben_rate"] or 0) * 100),
                "top985": round((g["prestigious_rate"] or 0) * 100),
                "qingbei": g.get("qingbei_count") or 0,
                "fudanJiaoda": g.get("fudan_jiaoda_count") or 0,
            }
            for g in gaokao
        ],
        "evaluation": eval_data,
    }


def assemble_school(school_id: str) -> dict | None:
    school = query_one("SELECT * FROM schools WHERE school_id = ?", (school_id,))
    if not school:
        return None
    admissions = query(
        "SELECT * FROM admissions WHERE school_id = ? ORDER BY year DESC, batch",
        (school_id,),
    )
    gaokao = query(
        "SELECT * FROM gaokao_results WHERE school_id = ? ORDER BY year DESC",
        (school_id,),
    )
    evaluation = query_one(
        "SELECT * FROM evaluations WHERE school_id = ?",
        (school_id,),
    )
    return _build_flat(school, admissions, gaokao, evaluation)


def _fts_search(q: str) -> list[str]:
    safe_q = q.replace('"', '').replace("'", '').strip()
    if not safe_q:
        return []
    terms = safe_q.split()
    if not terms:
        terms = [safe_q]
    fts_q = " AND ".join(f'"{t}"*' for t in terms)
    try:
        rows = query(
            "SELECT school_id FROM schools_fts WHERE schools_fts MATCH ? ORDER BY bm25(schools_fts)",
            (fts_q,),
        )
        return [r["school_id"] for r in rows]
    except Exception:
        return []


def _extract_snippet(text: str, q: str, max_len: int = 40) -> str:
    """从 text 中提取与查询最相关的句子片段。优先完整匹配，次优多词匹配。"""
    import re
    if not text or not q:
        return ""

    sentences = [s.strip() for s in re.split(r'[。，,\n；、]', text) if len(s.strip()) > 3]

    # 1. 完整匹配（最高优先）
    for s in sentences:
        if q in s:
            return s[:max_len]

    # 2. 拆成2字词，要求至少一半以上子词命中同一句
    sub_words = []
    if len(q) >= 4:
        sub_words = [q[:2], q[2:]]  # 如"物理竞赛"→["物理","竞赛"]
    elif len(q) >= 2:
        for i in range(len(q) - 1):
            sub_words.append(q[i:i+2])
    if not sub_words:
        sub_words = list(q)

    best_s, best_n = "", 0
    threshold = max(2, len(sub_words) // 2 + 1)  # 至少一半子词命中
    for s in sentences:
        n = sum(1 for w in sub_words if w in s)
        if n > best_n:
            best_s, best_n = s, n

    if best_n >= threshold:
        return best_s[:max_len]

    return ""


def _match_reason(school_row: dict, q: str) -> str:
    """生成匹配理由。校名匹配返回空，语义匹配返回 snippet。"""
    if not q:
        return ""
    name = school_row.get("name", "") + (school_row.get("short_name") or "")
    if q in name:
        return ""

    tags = school_row.get("tags") or ""
    intro = school_row.get("intro_text") or ""

    # 先查 tags（短且精准）
    snippet = _extract_snippet(tags, q, 30)
    if snippet:
        return snippet
    # 再查 intro
    snippet = _extract_snippet(intro, q, 40)
    if snippet:
        return snippet
    return ""


def _hybrid_search(q: str) -> list[str]:
    """QMD 理论搜索管线：查询扩展 → 多路搜索 → RRF → 重排。"""
    from backend.services.vector_search import hybrid_search
    return hybrid_search(q, limit=30)


def assemble_school_list(
    q: str = "",
    districts: list[str] | None = None,
    types: list[str] | None = None,
    funding: str | None = None,
    score_min: float = 0,
    score_max: float = 999,
    bben_min: float = 0,
    sort: str = "score_desc",
    limit: int = 200,
    offset: int = 0,
) -> dict:
    if q:
        all_ids = _hybrid_search(q)
        # Pre-fetch school rows for match reason
        _reason_cache = {}
        for sid in all_ids:
            row = query_one("SELECT name, short_name, tags, intro_text FROM schools WHERE school_id = ?", (sid,))
            if row:
                _reason_cache[sid] = row
    else:
        all_ids = [r["school_id"] for r in query("SELECT school_id FROM schools")]
        _reason_cache = {}

    results = []
    for sid in all_ids:
        s = assemble_school(sid)
        if not s:
            continue
        if q and sid in _reason_cache:
            s["matchReason"] = _match_reason(_reason_cache[sid], q)
        if districts and s["district"] not in districts:
            continue
        if types and s["kind"] not in types:
            continue
        if funding and s["funding"] != funding:
            continue

        score = s.get("score2025") or 0
        if score < score_min or score > score_max:
            continue

        bben = (s.get("bbenRate") or 0) / 100
        if bben < bben_min:
            continue

        results.append(s)

    if sort == "score_desc":
        results.sort(key=lambda x: x.get("score2025") or 0, reverse=True)
    elif sort == "score_asc":
        results.sort(key=lambda x: x.get("score2025") or 0)
    elif sort == "bben_desc":
        results.sort(key=lambda x: x.get("bbenRate") or 0, reverse=True)
    elif sort == "intake_desc":
        results.sort(key=lambda x: x.get("intake") or 0, reverse=True)

    total = len(results)
    page = results[offset : offset + limit]

    return {"total": total, "schools": page}
