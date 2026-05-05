#!/usr/bin/env python3
"""幂等建库：执行 backend/db/schema.sql 在 data/schools.db 上。

使用：
    python scripts/init_db.py              # 默认 data/schools.db
    python scripts/init_db.py --db /tmp/test.db
    python scripts/init_db.py --reset      # 删库重建
"""
from __future__ import annotations

import argparse
import sqlite3
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_FILE = REPO_ROOT / "backend" / "db" / "schema.sql"
DEFAULT_DB = REPO_ROOT / "data" / "schools.db"


def init_db(db_path: Path, reset: bool = False) -> None:
    if reset and db_path.exists():
        print(f"[reset] removing {db_path}")
        db_path.unlink()
        for ext in ("-wal", "-shm"):
            sidecar = db_path.with_name(db_path.name + ext)
            if sidecar.exists():
                sidecar.unlink()

    db_path.parent.mkdir(parents=True, exist_ok=True)
    schema_sql = SCHEMA_FILE.read_text(encoding="utf-8")

    conn = sqlite3.connect(db_path)
    try:
        conn.executescript(schema_sql)
        conn.commit()

        cur = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        )
        tables = [row[0] for row in cur.fetchall()]
        print(f"[ok] {db_path}")
        print(f"[ok] {len(tables)} tables: {', '.join(tables)}")
    finally:
        conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize SQLite DB from schema.sql")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB, help=f"DB path (default: {DEFAULT_DB})")
    parser.add_argument("--reset", action="store_true", help="Delete existing DB before creating")
    args = parser.parse_args()
    init_db(args.db, reset=args.reset)


if __name__ == "__main__":
    main()
