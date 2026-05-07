"""关键词覆盖率 Reranker — 永远可用的兜底方案。"""
from __future__ import annotations

from backend.services.reranker.base import RerankerBase


class KeywordReranker(RerankerBase):
    name = "keyword"

    async def rerank(self, query: str, documents: list[tuple[str, str]], top_n: int = 30) -> list[tuple[str, float]]:
        if not documents or not query:
            return [(sid, 0.0) for sid, _ in documents]

        q_words = []
        if len(query) >= 4:
            q_words = [query[i:i+2] for i in range(0, len(query) - 1, 2)]
        elif len(query) >= 2:
            q_words = [query[i:i+2] for i in range(len(query) - 1)]
        else:
            q_words = list(query)

        results = []
        for sid, text in documents:
            if query in text:
                score = 1.0
            elif q_words:
                score = sum(1 for w in q_words if w in text) / len(q_words)
            else:
                score = 0.0
            results.append((sid, score))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_n]
