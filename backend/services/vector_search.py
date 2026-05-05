"""轻量级向量搜索 — 基于 TF-IDF + 余弦相似度。

不依赖外部模型或服务，纯 Python 实现。
支持中文分词（按字符 bigram）。
启动时构建索引，搜索 <1ms。
"""
from __future__ import annotations

import math
import re
from collections import Counter
from pathlib import Path

_INDEX: dict | None = None


def _tokenize(text: str) -> list[str]:
    """中文分词：字符 bigram + 单字 + 去停用词。"""
    text = re.sub(r'[^\u4e00-\u9fff\w]', ' ', text.lower())
    words = text.split()
    tokens = []
    for w in words:
        if len(w) <= 1:
            continue
        tokens.append(w)
        # Add bigrams for Chinese
        if re.match(r'^[\u4e00-\u9fff]+$', w):
            for i in range(len(w) - 1):
                tokens.append(w[i:i+2])
    return tokens


def _build_index():
    """构建 TF-IDF 索引。"""
    global _INDEX

    from backend.db.connection import query as db_query
    rows = db_query("""
        SELECT s.school_id, s.name, COALESCE(s.short_name,'') as short_name,
               s.district, COALESCE(s.tags,'[]') as tags,
               COALESCE(s.intro_text,'') as intro
        FROM schools s
    """)

    docs = {}
    for r in rows:
        sid = r['school_id']
        text = f"{r['name']} {r['short_name']} {r['district']} {r['tags']} {r['intro']}"
        docs[sid] = _tokenize(text)

    # IDF
    N = len(docs)
    df = Counter()
    for tokens in docs.values():
        for t in set(tokens):
            df[t] += 1

    idf = {t: math.log(N / (1 + freq)) for t, freq in df.items()}

    # TF-IDF vectors (sparse)
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

    _INDEX = {"vectors": vectors, "idf": idf}


def vector_search(query_text: str, limit: int = 20) -> list[dict]:
    """向量搜索：返回 [{school_id, score}] 按相似度排序。"""
    global _INDEX
    if _INDEX is None:
        _build_index()

    tokens = _tokenize(query_text)
    if not tokens:
        return []

    # Query vector
    tf = Counter(tokens)
    qvec = {}
    norm = 0
    for t, count in tf.items():
        w = (1 + math.log(count)) * _INDEX["idf"].get(t, 0)
        qvec[t] = w
        norm += w * w
    norm = math.sqrt(norm) if norm > 0 else 1
    qvec = {t: w / norm for t, w in qvec.items()}

    # Cosine similarity
    scores = []
    for sid, dvec in _INDEX["vectors"].items():
        score = sum(qvec.get(t, 0) * dvec.get(t, 0) for t in qvec)
        if score > 0.01:
            scores.append({"school_id": sid, "score": round(score, 4)})

    scores.sort(key=lambda x: x["score"], reverse=True)
    return scores[:limit]


def invalidate_index():
    """数据更新后调用，清除缓存强制重建。"""
    global _INDEX
    _INDEX = None
