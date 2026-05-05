"""LLM API 限流 — 基于 SQLite，无需 Redis。

限制策略：
- 单 IP: 10 次/天
- 全站: 200 次/天
"""
from __future__ import annotations

import sqlite3
import time
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "schools.db"

IP_DAILY_LIMIT = 10


def _get_today() -> str:
    return time.strftime("%Y-%m-%d")


def _ensure_table(conn: sqlite3.Connection) -> None:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS llm_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            day TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_llm_usage_day ON llm_usage(day)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_llm_usage_ip_day ON llm_usage(ip, day)")


def check_rate_limit(ip: str) -> dict:
    """检查是否允许调用。返回 {allowed, ip_used, ip_limit, global_used, global_limit, message}"""
    today = _get_today()
    conn = sqlite3.connect(DB_PATH, timeout=5)
    try:
        _ensure_table(conn)

        ip_count = conn.execute(
            "SELECT COUNT(*) FROM llm_usage WHERE ip = ? AND day = ?", (ip, today)
        ).fetchone()[0]

        if ip_count >= IP_DAILY_LIMIT:
            return {
                "allowed": False,
                "ip_used": ip_count, "ip_limit": IP_DAILY_LIMIT,
                "message": f"今日 AI 分析次数已用完（{ip_count}/{IP_DAILY_LIMIT}），明天再试",
            }

        return {
            "allowed": True,
            "ip_used": ip_count, "ip_limit": IP_DAILY_LIMIT,
            "remaining": IP_DAILY_LIMIT - ip_count,
        }
    finally:
        conn.close()


def record_usage(ip: str) -> None:
    """记录一次使用。"""
    today = _get_today()
    conn = sqlite3.connect(DB_PATH, timeout=5)
    try:
        _ensure_table(conn)
        conn.execute("INSERT INTO llm_usage (ip, day) VALUES (?, ?)", (ip, today))
        conn.commit()
    finally:
        conn.close()
