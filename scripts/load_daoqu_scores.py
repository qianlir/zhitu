#!/usr/bin/env python3
"""将各区名额到区分数线 JSON 导入 daoqu_district_scores 表。

使用：
    python scripts/load_daoqu_scores.py
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = REPO_ROOT / "data" / "schools.db"
SCORES_FILE = REPO_ROOT / "data" / "seed" / "official_daoqu_scores_2025.json"

# 学校中文名 → school_id 映射
SCHOOL_ID_MAP = {
    "上海中学": "shanghai-zhongxue",
    "华师大二附中": "huashida-erfu",
    "交大附中": "jiaoda-fuzhong",
    "复旦附中": "fudan-fuzhong",
    "七宝中学": "qibao-zhongxue",
    "南洋模范": "nanyang-mofan",
    "建平中学": "jianping-zhongxue",
    "大同中学": "datong-zhongxue",
    "格致中学": "gezhi-zhongxue",
    "延安中学": "yanan-zhongxue",
    "控江中学": "kongjiang-zhongxue",
    "复兴高级": "fuxing-gaoji",
}


def main():
    with open(SCORES_FILE, encoding="utf-8") as f:
        data = json.load(f)

    year = data["year"]
    source_url = data["source_url"]

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA journal_mode=WAL")

    # 建表（如果不存在）
    conn.execute("""
        CREATE TABLE IF NOT EXISTS daoqu_district_scores (
          id            INTEGER PRIMARY KEY AUTOINCREMENT,
          school_id     TEXT NOT NULL,
          year          INTEGER NOT NULL,
          district      TEXT NOT NULL,
          min_score     REAL NOT NULL,
          score_type    TEXT DEFAULT '800',
          source        TEXT,
          source_url    TEXT,
          UNIQUE (school_id, year, district)
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_daoqu_school_year ON daoqu_district_scores(school_id, year)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_daoqu_district ON daoqu_district_scores(district)")

    inserted = 0
    skipped = 0
    for school_name, districts in data["schools"].items():
        school_id = SCHOOL_ID_MAP.get(school_name)
        if not school_id:
            print(f"  [skip] unknown school: {school_name}")
            skipped += 1
            continue

        # 验证 school_id 存在
        row = conn.execute("SELECT 1 FROM schools WHERE school_id = ?", (school_id,)).fetchone()
        if not row:
            print(f"  [skip] school_id not in DB: {school_id} ({school_name})")
            skipped += 1
            continue

        for district, score in districts.items():
            conn.execute("""
                INSERT OR REPLACE INTO daoqu_district_scores
                (school_id, year, district, min_score, score_type, source, source_url)
                VALUES (?, ?, ?, ?, '800', 'official', ?)
            """, (school_id, year, district, score, source_url))
            inserted += 1

    conn.commit()

    total = conn.execute("SELECT COUNT(*) FROM daoqu_district_scores").fetchone()[0]
    conn.close()

    print(f"[ok] inserted/updated: {inserted}, skipped: {skipped}, total in DB: {total}")


if __name__ == "__main__":
    main()
