"""Meta endpoints: districts, types, aggregate stats."""
from __future__ import annotations

from fastapi import APIRouter

from backend.db.connection import query, query_one

router = APIRouter()


@router.get("/districts")
def districts() -> list[str]:
    rows = query("SELECT DISTINCT district FROM schools ORDER BY district")
    return [r["district"] for r in rows]


@router.get("/types")
def types() -> list[str]:
    rows = query("SELECT DISTINCT type FROM schools ORDER BY type")
    return [r["type"] for r in rows]


@router.get("/stats")
def stats() -> dict:
    row = query_one("""
        SELECT
            (SELECT COUNT(*) FROM schools) AS school_count,
            (SELECT COUNT(DISTINCT year) FROM admissions) AS year_count,
            (SELECT MAX(year) FROM admissions) AS latest_year
    """)
    return {
        "school_count": row["school_count"] if row else 0,
        "year_count": row["year_count"] if row else 0,
        "latest_year": row["latest_year"] if row else 2025,
    }
