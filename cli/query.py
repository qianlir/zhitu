#!/usr/bin/env python3
"""query — QMD 理论混合检索（查询扩展 + 多路搜索 + RRF + 本地模型重排）。

用于语义检索场景：理解用户意图，返回最相关结果。
精确匹配请用 search 命令。

搜索管线（参考 QMD 架构）:
  1. 查询扩展（同义词映射）
  2. 多路搜索（BM25/FTS5 + TF-IDF 向量）
  3. RRF 融合（k=60）
  4. 本地模型重排（MiniLM-L12-v2 语义 + 关键词覆盖混合）
  5. 位置感知混合

示例:
  python -m cli.query "物理竞赛强校"
  python -m cli.query "浦东 寄宿制 市重点"
  python -m cli.query "数学特色" --limit 5
  python -m cli.query "国际课程" --json
  python -m cli.query "竞赛" --explain
"""
from __future__ import annotations

import argparse
import json
import sys
import os
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")

from backend.services.school_assembler import assemble_school_list
from backend.services.vector_search import expand_query, hybrid_search


def main():
    parser = argparse.ArgumentParser(
        description='语义检索 — QMD 理论混合搜索（智能，支持自然语言查询）。精确匹配请用 search 命令',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''示例:
  %(prog)s "物理竞赛强校"              # 语义检索
  %(prog)s "浦东 寄宿制 市重点"        # 多条件
  %(prog)s "数学特色" --limit 5        # 限定结果数
  %(prog)s "国际课程" --json           # JSON 输出
  %(prog)s "竞赛" --explain            # 显示管线细节''')

    parser.add_argument('query', help='搜索内容（自然语言或关键词）')
    parser.add_argument('--district', help='区域筛选')
    parser.add_argument('--limit', type=int, default=20, help='最大结果数（默认 20）')
    parser.add_argument('--json', dest='json_output', action='store_true', help='JSON 输出')
    parser.add_argument('--count', action='store_true', help='只输出件数')
    parser.add_argument('--explain', action='store_true', help='显示搜索管线细节（查询扩展/重排等）')
    args = parser.parse_args()

    t0 = time.time()

    if args.explain:
        # 显示查询扩展
        variants = expand_query(args.query)
        print(f"查询扩展: {variants}", file=sys.stderr)

    # 使用 assemble_school_list 走完整管线
    districts = [args.district] if args.district else None
    result = assemble_school_list(
        q=args.query,
        districts=districts,
        limit=args.limit,
    )

    elapsed = time.time() - t0

    if args.explain:
        print(f"耗时: {elapsed:.2f}s", file=sys.stderr)
        print(f"管线: 查询扩展 → BM25+TF-IDF → RRF(k=60) → MiniLM重排", file=sys.stderr)

    schools = result['schools']

    if args.count:
        print(result['total'])
        return

    if not schools:
        print("无结果。", file=sys.stderr)
        sys.exit(3)

    if args.json_output:
        print(json.dumps(schools, ensure_ascii=False, indent=2))
    else:
        print(f"{result['total']} 条结果 ({elapsed:.2f}s)", file=sys.stderr)
        print(f"{'学校':<20} {'区域':<6} {'分数':<8} {'一本率':<6} {'匹配理由'}")
        print("-" * 70)
        for s in schools:
            name = s['name'][:18]
            score = s.get('score2025') or '—'
            bben = f"{s.get('bbenRate', 0)}%" if s.get('bbenRate') else '—'
            reason = s.get('matchReason', '')[:25]
            print(f"{name:<20} {s['district']:<6} {str(score):<8} {bben:<6} {reason}")


if __name__ == '__main__':
    main()
