#!/usr/bin/env python3
"""search — FTS5 关键词精确匹配（快速，亚秒级）。

用于列表场景：筛选、对比、浏览。只做关键词匹配，不做语义理解。
语义检索请用 query 命令。

示例:
  python -m cli.search "七宝中学"
  python -m cli.search "浦东" --district 浦东
  python -m cli.search "竞赛" --limit 10
  python -m cli.search "四校" --json
"""
from __future__ import annotations

import argparse
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.db.connection import query as db_query
from backend.services.school_assembler import _fts_search, assemble_school


def main():
    parser = argparse.ArgumentParser(
        description='关键词搜索 — FTS5 精确匹配（快速）。语义搜索请用 query 命令',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''示例:
  %(prog)s "七宝中学"                  # 校名搜索
  %(prog)s "浦东" --district 浦东      # + 区域筛选
  %(prog)s "竞赛" --limit 10           # 限定结果数
  %(prog)s "四校" --json               # JSON 输出''')

    parser.add_argument('query', help='搜索关键词')
    parser.add_argument('--district', help='区域筛选')
    parser.add_argument('--limit', type=int, default=20, help='最大结果数（默认 20）')
    parser.add_argument('--json', dest='json_output', action='store_true', help='JSON 输出')
    parser.add_argument('--count', action='store_true', help='只输出件数')
    args = parser.parse_args()

    # FTS5 关键词搜索
    school_ids = _fts_search(args.query)

    if not school_ids:
        print("无结果。", file=sys.stderr)
        sys.exit(3)

    # 组装结果
    results = []
    for sid in school_ids[:args.limit * 2]:  # 多取一些以便筛选
        school = assemble_school(sid)
        if not school:
            continue
        if args.district and school['district'] != args.district:
            continue
        results.append(school)
        if len(results) >= args.limit:
            break

    if args.count:
        print(len(results))
        return

    if not results:
        print("无结果（筛选后为空）。", file=sys.stderr)
        sys.exit(3)

    if args.json_output:
        print(json.dumps(results, ensure_ascii=False, indent=2))
    else:
        print(f"{len(results)} 条结果", file=sys.stderr)
        print(f"{'学校':<20} {'区域':<6} {'分数':<8} {'一本率':<6} {'类型':<8}")
        print("-" * 60)
        for s in results:
            name = s['name'][:18]
            score = s.get('score2025') or '—'
            bben = f"{s.get('bbenRate', 0)}%" if s.get('bbenRate') else '—'
            print(f"{name:<20} {s['district']:<6} {str(score):<8} {bben:<6} {s['kind']:<8}")


if __name__ == '__main__':
    main()
