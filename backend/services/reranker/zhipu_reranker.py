"""智谱 GLM Reranker — rerank 模型 (return_raw_scores=true)。"""
from __future__ import annotations

import logging
import os

import httpx

from backend.services.reranker.base import RerankerBase

logger = logging.getLogger(__name__)

ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/rerank"


class ZhipuReranker(RerankerBase):
    def __init__(self, api_key: str | None = None, timeout: int = 5):
        self.name = "zhipu:rerank"
        self.api_key = api_key or os.environ.get("ZHIPU_RERANK_API_KEY", "")
        self.timeout = timeout

    async def rerank(self, query: str, documents: list[tuple[str, str]], top_n: int = 30) -> list[tuple[str, float]]:
        if not self.api_key:
            raise RuntimeError("ZHIPU_RERANK_API_KEY not set")

        texts = [text for _, text in documents]
        async with httpx.AsyncClient() as client:
            r = await client.post(ENDPOINT,
                headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                json={"model": "rerank", "query": query, "documents": texts,
                      "top": top_n, "return_raw_scores": True},
                timeout=self.timeout)

        if r.status_code != 200:
            raise RuntimeError(f"Zhipu rerank error: {r.status_code} {r.text[:200]}")

        results = r.json().get("results", [])
        return [(documents[item["index"]][0], item["relevance_score"]) for item in results]
