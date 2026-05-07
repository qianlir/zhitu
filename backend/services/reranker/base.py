"""Reranker 抽象基类。"""
from __future__ import annotations

import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class RerankerBase(ABC):
    name: str = "base"

    @abstractmethod
    async def rerank(self, query: str, documents: list[tuple[str, str]], top_n: int = 30) -> list[tuple[str, float]]:
        """
        Args:
            query: 用户查询
            documents: [(school_id, text), ...]
            top_n: 返回前N个
        Returns:
            [(school_id, score), ...] 按分数降序
        """
        ...
