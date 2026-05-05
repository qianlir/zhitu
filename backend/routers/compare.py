"""Compare endpoint: multi-school side-by-side."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.services.school_assembler import assemble_school

router = APIRouter()


class CompareRequest(BaseModel):
    ids: list[str]


@router.post("")
def compare(req: CompareRequest) -> list[dict]:
    if len(req.ids) < 2 or len(req.ids) > 5:
        raise HTTPException(400, "ids must contain 2-5 school_ids")
    results = []
    for sid in req.ids:
        s = assemble_school(sid)
        if s:
            results.append(s)
    return results
