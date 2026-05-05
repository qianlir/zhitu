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
# 4. 重排序 — 本地小模型语义重排 + 关键词覆盖混合
#    参考 QMD 的 qwen3-reranker 策略，使用 MiniLM 替代
# ============================================================

def _rerank_batch(candidates: list[tuple[str, float]], q: str) -> list[tuple[str, float]]:
    """对 RRF 候选集做本地模型重排。返回 [(sid, blended_score)]。"""
    global _INDEX
    if _INDEX is None:
        _build_index()

    from backend.services.local_reranker import rerank_documents

    # 准备文档文本
    docs = []
    for sid, _ in candidates:
        text = _INDEX.get("raw_texts", {}).get(sid, "")
        docs.append((sid, text))

    # 混合重排（alpha=0.5: 语义 50% + 关键词 50%）
    reranked = rerank_documents(q, docs, alpha=0.5)
    return reranked


# ============================================================
# 5. 完整搜索管线
# ============================================================

def hybrid_search(q: str, limit: int = 30) -> list[str]:
    """QMD 理论搜索管线：扩展 → 多路搜索 → RRF → 本地模型重排。"""
    if not q:
        return []

    # Step 1: 查询扩展
    variants = expand_query(q)

    # Step 2: 多路搜索（每个变体 × BM25 + 向量 = 最多6路）
    ranked_lists = []

    from backend.services.school_assembler import _fts_search
    for variant in variants:
        # BM25 (FTS5)
        fts_ids = _fts_search(variant)
        if fts_ids:
            ranked_lists.append(fts_ids)

        # 向量搜索
        vec_results = _vector_search(variant, limit=30)
        if vec_results:
            ranked_lists.append([sid for sid, _ in vec_results])

    if not ranked_lists:
        return []

    # Step 3: RRF 融合
    rrf_results = _rrf_merge(ranked_lists, k=60)

    # Step 4: 本地模型重排序（语义 + 关键词混合）
    # 取 top-50 候选送入 reranker（参考 QMD：reranker 只处理粗排后的短列表）
    top_candidates = rrf_results[:50]

    # 位置感知混合（QMD 策略）：RRF 分数 + reranker 分数
    reranked = _rerank_batch(top_candidates, q)

    # 最终混合：RRF 提供召回排序信号，reranker 提供精确度信号
    rrf_map = {sid: score for sid, score in top_candidates}
    rerank_map = {sid: score for sid, score in reranked}

    final = []
    for sid in rrf_map:
        rrf_score = rrf_map[sid]
        rerank_score = rerank_map.get(sid, 0.0)

        # 位置感知（按 RRF 原始排名）
        rank_idx = len(final)
        if rank_idx < 3:
            blend = 0.65 * rrf_score + 0.35 * rerank_score  # top-3: 偏向检索
        elif rank_idx < 10:
            blend = 0.50 * rrf_score + 0.50 * rerank_score  # 4-10: 平衡
        else:
            blend = 0.35 * rrf_score + 0.65 * rerank_score  # 11+: 偏向精确度

        final.append((sid, blend))

    final.sort(key=lambda x: x[1], reverse=True)
    return [sid for sid, _ in final[:limit]]


def invalidate_index():
    global _INDEX
    _INDEX = None
