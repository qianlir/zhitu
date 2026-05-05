"""Recommend endpoints: stretch / match / safety tiers + LLM analysis."""
from __future__ import annotations

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from backend.services.recommender import generate_recommendations
from backend.services.rate_limiter import check_rate_limit, record_usage

router = APIRouter()


class RecommendRequest(BaseModel):
    score: float
    district: str = ""
    district_rank: int = 0
    risk: str = "balanced"
    preferences: dict | None = None


class AnalyzeRequest(BaseModel):
    score: float
    district: str = ""
    district_rank: int = 0
    risk: str = "balanced"
    preferences: dict | None = None


@router.post("")
def recommend(req: RecommendRequest) -> dict:
    return generate_recommendations(
        score=req.score,
        district=req.district,
        district_rank=req.district_rank,
        risk=req.risk,
        preferences=req.preferences,
    )


@router.post("/analyze")
def analyze(req: AnalyzeRequest, request: Request):
    client_ip = request.headers.get("x-real-ip") or request.client.host

    limit = check_rate_limit(client_ip)
    if not limit["allowed"]:
        return JSONResponse(
            status_code=429,
            content={"error": limit["message"], "detail": limit},
        )

    record_usage(client_ip)

    recommendations = generate_recommendations(
        score=req.score,
        district=req.district,
        district_rank=req.district_rank,
        risk=req.risk,
        preferences=req.preferences,
    )

    from backend.services.llm_analyzer import analyze_stream

    remaining = limit.get("remaining", 0) - 1

    def event_stream():
        yield f"data: [剩余 {remaining} 次 AI 分析]\n\n"
        with analyze_stream(
            score=req.score,
            district=req.district,
            district_rank=req.district_rank,
            risk=req.risk,
            preferences=req.preferences or {},
            recommendations=recommendations,
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {text}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
