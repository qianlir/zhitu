"""Reranker 管理器 — 多模型优先级 + 熔断 + 自动恢复。"""
from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from threading import Lock

from backend.services.reranker.base import RerankerBase
from backend.services.reranker.dashscope_reranker import DashScopeReranker
from backend.services.reranker.zhipu_reranker import ZhipuReranker
from backend.services.reranker.keyword_reranker import KeywordReranker

logger = logging.getLogger(__name__)

CONFIG_PATH = Path(__file__).resolve().parent.parent.parent.parent / "data" / "config" / "reranker.json"

# 熔断状态
_circuit_breaker: dict[str, float] = {}  # model_name → 恢复时间戳
_cb_lock = Lock()
COOLDOWN_SECONDS = 300  # 熔断冷却 5 分钟


def _is_available(name: str) -> bool:
    with _cb_lock:
        recovery_time = _circuit_breaker.get(name)
        if recovery_time is None:
            return True
        if time.time() >= recovery_time:
            del _circuit_breaker[name]
            logger.info("Reranker %s recovered from circuit breaker", name)
            return True
        return False


def _trip(name: str):
    with _cb_lock:
        _circuit_breaker[name] = time.time() + COOLDOWN_SECONDS
        logger.warning("Reranker %s tripped, will retry after %ds", name, COOLDOWN_SECONDS)


def _load_config() -> list[dict]:
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, encoding="utf-8") as f:
            return json.load(f).get("models", [])
    return []


def _build_rerankers() -> list[RerankerBase]:
    """从配置文件构建 reranker 列表（按 priority 排序）。"""
    config = _load_config()
    rerankers: list[RerankerBase] = []

    for cfg in sorted(config, key=lambda x: x.get("priority", 99)):
        if not cfg.get("enabled", True):
            continue

        provider = cfg.get("provider", "")
        c = cfg.get("config", {})

        try:
            if provider == "dashscope":
                import os
                key = os.environ.get(c.get("api_key_env", ""), c.get("api_key", ""))
                rerankers.append(DashScopeReranker(
                    model=c.get("model", "gte-rerank"),
                    api_key=key,
                    timeout=c.get("timeout", 5),
                ))
            elif provider == "zhipu":
                import os
                key = os.environ.get(c.get("api_key_env", ""), c.get("api_key", ""))
                rerankers.append(ZhipuReranker(
                    api_key=key,
                    timeout=c.get("timeout", 5),
                ))
            elif provider == "builtin":
                rerankers.append(KeywordReranker())
        except Exception as e:
            logger.warning("Failed to init reranker %s: %s", cfg.get("name"), e)

    # 确保 keyword 兜底始终存在
    if not any(isinstance(r, KeywordReranker) for r in rerankers):
        rerankers.append(KeywordReranker())

    return rerankers


# 单例
_rerankers: list[RerankerBase] | None = None


def get_reranker() -> "RerankerManager":
    return RerankerManager()


class RerankerManager:
    def __init__(self):
        global _rerankers
        if _rerankers is None:
            _rerankers = _build_rerankers()
            names = [r.name for r in _rerankers]
            logger.info("Reranker models loaded: %s", names)

    def rerank(self, query: str, documents: list[tuple[str, str]], top_n: int = 30) -> list[tuple[str, float]]:
        for r in _rerankers:
            if not _is_available(r.name):
                continue
            try:
                result = r.rerank(query, documents, top_n)
                logger.debug("Reranked by %s", r.name)
                return result
            except Exception as e:
                logger.warning("Reranker %s failed: %s", r.name, e)
                _trip(r.name)
                continue

        # 全部失败，直接返回原序
        return [(sid, 0.0) for sid, _ in documents[:top_n]]


def rerank_documents(query: str, documents: list[tuple[str, str]], top_n: int = 30) -> list[tuple[str, float]]:
    """便捷函数。"""
    return RerankerManager().rerank(query, documents, top_n)
