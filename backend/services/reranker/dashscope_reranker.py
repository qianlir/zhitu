"""DashScope Reranker — gte-rerank / qwen3-rerank (阿里百炼)。"""
from __future__ import annotations

import logging
import os

import requests

from backend.services.reranker.base import RerankerBase

logger = logging.getLogger(__name__)

ENDPOINT = "https://dashscope.aliyuncs.com/api/v1/services/rerank/text-rerank/text-rerank"


class DashScopeReranker(RerankerBase):
    def __init__(self, model: str = "gte-rerank", api_key: str | None = None, timeout: int = 5):
        self.name = f"dashscope:{model}"
        self.model = model
        self.api_key = api_key or os.environ.get("DASHSCOPE_API_KEY", "")
        self.timeout = timeout

    def rerank(self, query: str, documents: list[tuple[str, str]], top_n: int = 30) -> list[tuple[str, float]]:
        if not self.api_key:
            raise RuntimeError("DASHSCOPE_API_KEY not set")

        texts = [text for _, text in documents]
        r = requests.post(ENDPOINT,
            headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
            json={"model": self.model, "input": {"query": query, "documents": texts}, "parameters": {"top_n": top_n}},
            timeout=self.timeout)

        if r.status_code != 200:
            raise RuntimeError(f"DashScope {self.model} error: {r.status_code} {r.text[:200]}")

        results = r.json().get("output", {}).get("results", [])
        return [(documents[item["index"]][0], item["relevance_score"]) for item in results]
