"""本地语义重排序器 — 基于 sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)。

参考 QMD 架构的 reranker 层，使用本地小模型计算 query-document 语义相似度。
模型已缓存在 ~/.cache/huggingface/hub/，离线加载无需网络。

混合策略：semantic_score * alpha + keyword_score * (1-alpha)
"""
from __future__ import annotations

import os
import logging

logger = logging.getLogger(__name__)

# 强制离线，防止任何 HuggingFace 网络请求
os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

_MODEL = None
_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# 环境变量 RERANKER_DISABLE=1 可强制禁用模型（内存不足的服务器用）
_DISABLED = os.environ.get("RERANKER_DISABLE", "0") == "1"


def _check_memory(min_mb: int = 600) -> bool:
    """检查可用内存（RAM + swap free）是否足够加载模型。"""
    try:
        available_kb = 0
        swap_free_kb = 0
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemAvailable:"):
                    available_kb = int(line.split()[1])
                elif line.startswith("SwapFree:"):
                    swap_free_kb = int(line.split()[1])
        total_available = available_kb + swap_free_kb
        return total_available > min_mb * 1024
    except (FileNotFoundError, ValueError):
        return True  # macOS 等不支持 /proc 的系统默认允许
    return False


def _ensure_model():
    """懒加载模型（首次调用约 1-2 秒）。内存不足时自动降级。"""
    global _MODEL
    if _MODEL is not None:
        return _MODEL

    if _DISABLED:
        logger.info("Reranker disabled via RERANKER_DISABLE=1. Using keyword-only.")
        _MODEL = False
        return _MODEL

    # 内存预检：模型约需 500MB，低于 600MB 可用时跳过
    if not _check_memory(600):
        logger.warning("Available memory < 600MB, skipping model load. Using keyword-only reranking.")
        _MODEL = False
        return _MODEL

    try:
        from sentence_transformers import SentenceTransformer
        _MODEL = SentenceTransformer(_MODEL_NAME)
        logger.info("Local reranker model loaded: %s", _MODEL_NAME)
    except Exception as e:
        logger.warning("Failed to load reranker model: %s. Falling back to keyword-only.", e)
        _MODEL = False  # sentinel: don't retry
    return _MODEL


def _keyword_score(q: str, text: str) -> float:
    """关键词精确覆盖率（与原 _rerank_score 相同逻辑）。"""
    if not text or not q:
        return 0.0
    if q in text:
        return 1.0

    words = []
    if len(q) >= 4:
        words = [q[i:i+2] for i in range(0, len(q) - 1, 2)]
    elif len(q) >= 2:
        words = [q[i:i+2] for i in range(len(q) - 1)]
    else:
        words = list(q)

    if not words:
        return 0.0
    hits = sum(1 for w in words if w in text)
    return hits / len(words)


def rerank_documents(query: str, documents: list[tuple[str, str]], alpha: float = 0.5) -> list[tuple[str, float]]:
    """对 RRF 候选集做混合重排序。

    Args:
        query: 用户查询
        documents: [(school_id, text), ...] 候选文档
        alpha: 语义权重 (0-1)，1-alpha 为关键词权重

    Returns:
        [(school_id, score), ...] 按混合分排序
    """
    if not documents or not query:
        return [(sid, 0.0) for sid, _ in documents]

    model = _ensure_model()

    # 关键词分数（始终计算）
    kw_scores = [_keyword_score(query, text) for _, text in documents]

    # 语义分数（模型可用时）
    if model and model is not False:
        try:
            from sentence_transformers import util
            q_emb = model.encode([query], convert_to_tensor=True)
            d_texts = [text for _, text in documents]
            d_embs = model.encode(d_texts, convert_to_tensor=True)
            sem_scores = util.cos_sim(q_emb, d_embs)[0].tolist()
        except Exception as e:
            logger.warning("Semantic reranking failed: %s. Using keyword only.", e)
            sem_scores = [0.0] * len(documents)
    else:
        sem_scores = [0.0] * len(documents)
        alpha = 0.0  # fallback: keyword only

    # 混合
    results = []
    for i, (sid, _) in enumerate(documents):
        score = alpha * sem_scores[i] + (1 - alpha) * kw_scores[i]
        results.append((sid, score))

    results.sort(key=lambda x: x[1], reverse=True)
    return results
