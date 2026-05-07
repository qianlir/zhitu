"""QMD 理论搜索管线 — BM25 + TF-IDF向量 + RRF融合 + 重排序。

参考 QMD 架构:
1. 查询扩展（同义词映射，无需LLM）
2. BM25(FTS5) + TF-IDF向量 双路搜索
3. Reciprocal Rank Fusion (RRF, k=60)
4. 精确度重排序（关键词覆盖率打分）
5. 位置感知混合
"""
from __future__ import annotations

import math
import re
from collections import Counter

_INDEX: dict | None = None

# ============================================================
# 1. 查询扩展 — 同义词映射（替代 LLM 查询扩展）
# ============================================================

SYNONYMS = {
    "数学": ["数学竞赛", "数学奥赛", "CMO", "IMO", "高联"],
    "物理": ["物理竞赛", "物理奥赛", "PhO"],
    "化学": ["化学竞赛", "化学奥赛"],
    "生物": ["生物竞赛", "生物奥赛"],
    "信息": ["信息学", "信息学奥赛", "NOIP", "NOI"],
    "竞赛": ["学科竞赛", "奥赛", "奥林匹克"],
    "理科": ["理科强", "理科见长", "理工科"],
    "文科": ["文科强", "人文", "文理并重"],
    "寄宿": ["寄宿制", "全寄宿", "住宿"],
    "国际": ["国际课程", "IB", "AP", "双语"],
    "四校": ["上中", "华二", "复附", "交附"],
    "八大": ["七宝", "南模", "建平", "控江", "大同", "复兴", "延安", "市西"],
    "篮球": ["篮球特色", "校园篮球"],
    "足球": ["足球特色", "校园足球"],
    "艺术": ["艺术教育", "艺术特色", "美育"],
    "音乐": ["音乐教育", "音乐特色"],
    "外语": ["外语特色", "英语强", "德语", "法语", "日语"],
}


def expand_query(q: str) -> list[str]:
    """生成查询变体（原始 + 同义词扩展）。"""
    variants = [q]
    for key, syns in SYNONYMS.items():
        if key in q:
            for syn in syns[:2]:  # 最多2个扩展
                if syn != q and syn not in q:
                    variants.append(q.replace(key, syn) if key in q else q + " " + syn)
    return variants[:3]  # 最多3个变体


# ============================================================
# 2. TF-IDF 向量索引
# ============================================================

def _tokenize(text: str) -> list[str]:
    text = re.sub(r'[^\u4e00-\u9fff\w]', ' ', text.lower())
    words = text.split()
    tokens = []
    for w in words:
        if len(w) <= 1:
            continue
        tokens.append(w)
        if re.match(r'^[\u4e00-\u9fff]+$', w):
            for i in range(len(w) - 1):
                tokens.append(w[i:i+2])
    return tokens


def _build_index():
    global _INDEX
    from backend.db.connection import query as db_query
    rows = db_query("""
        SELECT s.school_id, s.name, COALESCE(s.short_name,'') as short_name,
               s.district, COALESCE(s.tags,'[]') as tags,
               COALESCE(s.intro_text,'') as intro
        FROM schools s
    """)

    docs = {}
    raw_texts = {}
    for r in rows:
        sid = r['school_id']
        text = f"{r['name']} {r['short_name']} {r['district']} {r['tags']} {r['intro']}"
        docs[sid] = _tokenize(text)
        raw_texts[sid] = text

    N = len(docs)
    df = Counter()
    for tokens in docs.values():
        for t in set(tokens):
            df[t] += 1

    idf = {t: math.log(N / (1 + freq)) for t, freq in df.items()}

    vectors = {}
    for sid, tokens in docs.items():
        tf = Counter(tokens)
        vec = {}
        norm = 0
        for t, count in tf.items():
            w = (1 + math.log(count)) * idf.get(t, 0)
            vec[t] = w
            norm += w * w
        norm = math.sqrt(norm) if norm > 0 else 1
        vectors[sid] = {t: w / norm for t, w in vec.items()}

    _INDEX = {"vectors": vectors, "idf": idf, "raw_texts": raw_texts}


def _vector_search(query_text: str, limit: int = 30) -> list[tuple[str, float]]:
    """向量搜索：返回 [(school_id, score)] 按相似度排序。"""
    global _INDEX
    if _INDEX is None:
        _build_index()

    tokens = _tokenize(query_text)
    if not tokens:
        return []

    tf = Counter(tokens)
    qvec = {}
    norm = 0
    for t, count in tf.items():
        w = (1 + math.log(count)) * _INDEX["idf"].get(t, 0)
        qvec[t] = w
        norm += w * w
    norm = math.sqrt(norm) if norm > 0 else 1
    qvec = {t: w / norm for t, w in qvec.items()}

    scores = []
    for sid, dvec in _INDEX["vectors"].items():
        score = sum(qvec.get(t, 0) * dvec.get(t, 0) for t in qvec)
        if score > 0.01:
            scores.append((sid, score))

    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:limit]


# ============================================================
# 3. RRF 融合 (Reciprocal Rank Fusion)
# ============================================================

def _rrf_merge(ranked_lists: list[list[str]], k: int = 60) -> list[tuple[str, float]]:
    """RRF 融合多个排序列表。k=60 是标准值。"""
    scores = {}
    for ranked in ranked_lists:
        for rank, sid in enumerate(ranked):
            scores[sid] = scores.get(sid, 0) + 1.0 / (k + rank + 1)

    result = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return result


# ============================================================
# 4. 重排序 — 多模型 Reranker（DashScope / 智谱 / 关键词兜底）
# ============================================================

async def _rerank_batch(candidates: list[tuple[str, float]], q: str) -> list[tuple[str, float]]:
    """对 RRF 候选集做重排。自动选择最优可用模型（异步）。"""
    global _INDEX
    if _INDEX is None:
        _build_index()

    from backend.services.reranker import rerank_documents

    docs = []
    for sid, _ in candidates:
        text = _INDEX.get("raw_texts", {}).get(sid, "")
        docs.append((sid, text))

    return await rerank_documents(q, docs, top_n=len(docs))


# ============================================================
# 5. 完整搜索管线
# ============================================================

async def hybrid_search(q: str, limit: int = 30) -> list[str]:
    """QMD 理论搜索管线：扩展 → 多路搜索 → RRF → 多模型重排（异步）。"""
    if not q:
        return []

    # Step 1: 查询扩展（同步，纯 CPU）
    variants = expand_query(q)

    # Step 2: 多路搜索（同步，FTS5 + TF-IDF 纯 CPU）
    ranked_lists = []

    from backend.services.school_assembler import _fts_search
    for variant in variants:
        fts_ids = _fts_search(variant)
        if fts_ids:
            ranked_lists.append(fts_ids)

        vec_results = _vector_search(variant, limit=30)
        if vec_results:
            ranked_lists.append([sid for sid, _ in vec_results])

    if not ranked_lists:
        return []

    # Step 3: RRF 融合（同步，纯数学）
    rrf_results = _rrf_merge(ranked_lists, k=60)

    # Step 4: Reranker 重排序（异步，外部 API 调用）
    top_candidates = rrf_results[:50]
    reranked = await _rerank_batch(top_candidates, q)

    # Step 5: RRF + Reranker 混合（位置感知）
    rrf_map = {sid: score for sid, score in top_candidates}
    rerank_map = {sid: score for sid, score in reranked}

    # 归一化 reranker 分数到 0-1，并过滤低相关结果
    rerank_scores = [s for _, s in reranked]
    if rerank_scores:
        r_min, r_max = min(rerank_scores), max(rerank_scores)
        r_range = r_max - r_min if r_max > r_min else 1.0
        rerank_norm = {sid: (score - r_min) / r_range for sid, score in reranked}
    else:
        rerank_norm = {}

    # 排序策略：reranker 分数 × 关键词覆盖率加权
    # 不依赖绝对阈值（不同模型分数范围不同），用相对排序 + 关键词验证
    q_words = [q[i:i+2] for i in range(0, len(q)-1, 2)] if len(q) >= 4 else [q]

    scored = []
    for sid, rerank_score in rerank_norm.items():
        text = _INDEX.get("raw_texts", {}).get(sid, "")
        kw_hits = sum(1 for w in q_words if w in text)
        kw_ratio = kw_hits / len(q_words) if q_words else 0

        # 混合：reranker 70% + 关键词 30%（关键词作为硬约束补充）
        blend = 0.7 * rerank_score + 0.3 * kw_ratio
        scored.append((sid, blend))

    scored.sort(key=lambda x: x[1], reverse=True)

    # 相对过滤：只保留分数 >= 最高分 30% 的结果（至少保留 top-5）
    final = []
    top_score = scored[0][1] if scored else 0
    for sid, blend in scored:
        if blend < top_score * 0.3 and len(final) >= 5:
            continue

        final.append((sid, blend))

    final.sort(key=lambda x: x[1], reverse=True)
    return [sid for sid, _ in final[:limit]]


def invalidate_index():
    global _INDEX
    _INDEX = None
