"""SQLite connection pool with WAL mode for concurrent reads."""
from __future__ import annotations

import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB = REPO_ROOT / "data" / "schools.db"

_local = threading.local()


def _dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


def _get_conn(db_path: Path, readonly: bool = True) -> sqlite3.Connection:
    mode = "ro" if readonly else "rw"
    conn = sqlite3.connect(f"file:{db_path}?mode={mode}", uri=True, check_same_thread=False)
    conn.row_factory = _dict_factory
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=5000")
    return conn


@contextmanager
def connect(db_path: Path = DEFAULT_DB, readonly: bool = True):
    if not db_path.exists():
        raise FileNotFoundError(f"DB not found: {db_path}. Run: python scripts/init_db.py && python scripts/md_to_db.py")
    conn = _get_conn(db_path, readonly)
    try:
        yield conn
    finally:
        conn.close()


def query(sql: str, params: tuple | dict = (), db_path: Path = DEFAULT_DB) -> list[dict]:
    with connect(db_path) as conn:
        return conn.execute(sql, params).fetchall()


def query_one(sql: str, params: tuple | dict = (), db_path: Path = DEFAULT_DB) -> dict | None:
    with connect(db_path) as conn:
        return conn.execute(sql, params).fetchone()
