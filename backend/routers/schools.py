"""School list + detail endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.db.connection import query, query_one
from backend.services.school_assembler import assemble_school, assemble_school_list

router = APIRouter()


@router.get("")
def list_schools(
    q: str = "",
    districts: str = Query("", description="comma-separated district names"),
    types: str = Query("", description="comma-separated school types"),
    funding: str = Query("", description="公办 or 民办"),
    score_min: float = 0,
    score_max: float = 999,
    bben_min: float = 0,
    sort: str = "score_desc",
    limit: int = 200,
    offset: int = 0,
) -> dict:
    return assemble_school_list(
        q=q,
        districts=[d.strip() for d in districts.split(",") if d.strip()],
        types=[t.strip() for t in types.split(",") if t.strip()],
        funding=funding or None,
        score_min=score_min,
        score_max=score_max,
        bben_min=bben_min / 100 if bben_min > 1 else bben_min,
        sort=sort,
        limit=limit,
        offset=offset,
    )


@router.get("/{school_id}")
def get_school(school_id: str) -> dict:
    result = assemble_school(school_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"School not found: {school_id}")
    return result
