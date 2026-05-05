"""Recommendation engine: multi-channel stretch / match / safety tiers."""
from __future__ import annotations

from backend.db.connection import query
from backend.services.school_assembler import assemble_school_list


def _prob(school_score: float, user_score: float, kind: str) -> int:
    gap = school_score - user_score
    if kind == "stretch":
        return max(15, min(40, round(35 - gap * 3)))
    if kind == "match":
        return max(55, min(85, round(75 - gap * 4)))
    if kind == "safety":
        return max(85, min(98, round(92 - gap * 1.5)))
    return 50


def _best_channel(school: dict, user_score: float) -> dict:
    """Find the best admission channel for this student at this school."""
    channels = []
    for batch, score_key in [
        ("统招", "score2025"),
        ("名额到区", "mingeDistrict"),
        ("名额到校", "mingeSchool"),
        ("自主招生", "zizhao"),
    ]:
        sc = school.get(score_key)
        if sc is not None:
            gap = sc - user_score
            channels.append({"batch": batch, "score": sc, "gap": round(gap, 1)})

    if not channels:
        return {"batch": "统招", "score": None, "gap": 0}

    channels.sort(key=lambda c: c["gap"])
    return channels[0]


def generate_recommendations(
    score: float,
    district: str = "",
    district_rank: int = 0,
    risk: str = "balanced",
    preferences: dict | None = None,
) -> dict:
    prefs = preferences or {}
    offsets = {"conservative": -3, "balanced": 0, "aggressive": 3}
    offset = offsets.get(risk, 0)
    target = score + offset

    result = assemble_school_list(limit=500)
    all_schools = result["schools"]

    stretch = []
    match = []
    safety = []

    for s in all_schools:
        scores = [
            s.get("score2025"),
            s.get("mingeDistrict"),
            s.get("mingeSchool"),
        ]
        valid_scores = [sc for sc in scores if sc is not None]
        if not valid_scores:
            continue

        min_entry = min(valid_scores)
        max_entry = max(valid_scores)
        tongzhao = s.get("score2025") or max_entry

        best = _best_channel(s, score)

        entry = {
            **s,
            "bestChannel": best["batch"],
            "bestChannelScore": best["score"],
            "bestChannelGap": best["gap"],
        }

        best_score = best["score"] or tongzhao
        best_gap = best_score - target

        if best_gap > 0 and best_gap <= 12:
            stretch.append(entry)
        elif best_gap >= -5 and best_gap <= 3:
            match.append(entry)
        elif best_gap < -2 and best_gap >= -20:
            safety.append(entry)

    if prefs.get("prefer_nearby") and district:
        for lst in [stretch, match, safety]:
            lst.sort(key=lambda x: (0 if x["district"] == district else 1, abs(x.get("bestChannelGap", 0))))
    else:
        stretch.sort(key=lambda x: x.get("score2025") or 0)
        match.sort(key=lambda x: abs(x.get("bestChannelGap", 0)))
        safety.sort(key=lambda x: x.get("score2025") or 0, reverse=True)

    def annotate(schools, kind, limit=4):
        out = []
        seen = set()
        for s in schools:
            if s["id"] in seen:
                continue
            seen.add(s["id"])
            ref_score = s.get("bestChannelScore") or s.get("score2025") or 0
            out.append({
                **s,
                "kind_label": {"stretch": "冲刺", "match": "匹配", "safety": "保底"}[kind],
                "prob": _prob(ref_score, score, kind),
                "gap": round(ref_score - score, 1),
            })
            if len(out) >= limit:
                break
        return out

    tier_label = (
        "四校级" if score >= 700
        else "强八大级" if score >= 690
        else "八大级" if score >= 680
        else "强市重点" if score >= 670
        else "市重点" if score >= 660
        else "区重点" if score >= 640
        else "普通高中"
    )

    batch_stats = {}
    rows = query("SELECT batch, COUNT(*) as cnt, AVG(min_score) as avg_score FROM admissions WHERE year = 2025 GROUP BY batch")
    for r in rows:
        batch_stats[r["batch"]] = {"count": r["cnt"], "avgScore": round(r["avg_score"], 1)}

    return {
        "score": score,
        "district": district,
        "districtRank": district_rank,
        "risk": risk,
        "tierLabel": tier_label,
        "batchStats": batch_stats,
        "stretch": annotate(stretch, "stretch", 3),
        "match": annotate(match, "match", 5),
        "safety": annotate(safety, "safety", 3),
    }
