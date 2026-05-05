#!/usr/bin/env python3
"""扫 data/schools_md/ 下所有 md，解析 YAML frontmatter，入库 SQLite。

幂等：用 INSERT OR REPLACE / UPSERT，重跑等同覆盖。

使用：
    python scripts/md_to_db.py
    python scripts/md_to_db.py --db /tmp/test.db --md-dir /tmp/schools_md
    python scripts/md_to_db.py --dry-run    # 只扫描不入库
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import sqlite3
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    sys.stderr.write("ERROR: pip install pyyaml\n")
    sys.exit(1)

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_DB = REPO_ROOT / "data" / "schools.db"
DEFAULT_MD_DIR = REPO_ROOT / "data" / "schools_md"


# ============================================================
# Frontmatter 解析
# ============================================================

def parse_frontmatter(md_text: str) -> tuple[dict[str, Any], str]:
    """切出 YAML frontmatter 和正文。无 frontmatter 返回 ({}, md_text)。"""
    if not md_text.startswith("---\n"):
        return {}, md_text
    end = md_text.find("\n---\n", 4)
    if end == -1:
        return {}, md_text
    yaml_block = md_text[4:end]
    body = md_text[end + 5 :]
    try:
        data = yaml.safe_load(yaml_block) or {}
    except yaml.YAMLError as e:
        raise ValueError(f"YAML parse error: {e}") from e
    return data, body


def hash_content(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def to_iso(value: Any) -> Any:
    """YAML 自动把 ISO 字符串解析成 datetime；SQLite 3.12+ 不再支持 datetime adapter，
    统一转 ISO 字符串再写库。其他类型透传。"""
    if isinstance(value, (dt.datetime, dt.date)):
        return value.isoformat()
    return value


# ============================================================
# 入库逻辑
# ============================================================

class Loader:
    def __init__(self, db_path: Path, md_dir: Path, dry_run: bool = False):
        self.db_path = db_path
        self.md_dir = md_dir
        self.dry_run = dry_run
        self.conn: sqlite3.Connection | None = None
        self.stats = {"files": 0, "schools": 0, "admissions": 0, "gaokao": 0, "evals": 0, "errors": 0}

    def __enter__(self):
        if not self.dry_run:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.execute("PRAGMA foreign_keys = ON")
        return self

    def __exit__(self, *exc):
        if self.conn:
            self.conn.commit()
            self.conn.close()

    # ---------- per-doc handlers ----------

    def _extract_section(self, body: str, heading: str) -> str:
        """从 markdown body 中提取 ## heading 后的正文。"""
        marker = f"## {heading}"
        if marker not in body:
            return ""
        text = body.split(marker, 1)[1].strip()
        # 截取到下一个 ## 标题或文件末尾
        next_h2 = text.find("\n## ")
        if next_h2 > 0:
            text = text[:next_h2]
        return text.strip()

    def upsert_school(self, fm: dict, file_path: Path, body: str = "") -> None:
        """从任意 doc 的 frontmatter 抽出学校字段，UPSERT schools 表。
        readme/basic 含完整字段；其他 doc 仅含 school_id，跳过。
        """
        sid = fm.get("school_id")
        if not sid:
            return
        if fm.get("doc_type") not in ("readme", "basic"):
            return

        md_dir_rel = str(file_path.parent.relative_to(REPO_ROOT))
        tags_json = json.dumps(fm.get("tags", []), ensure_ascii=False)
        intro_text = self._extract_section(body, "简介") if fm.get("doc_type") == "basic" else ""

        if self.dry_run:
            return

        self.conn.execute(
            """
            INSERT INTO schools (
                school_id, name, short_name, district, tier, type, ownership,
                address, phone, website, tags, intro_text, md_dir, updated_at
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
            ON CONFLICT(school_id) DO UPDATE SET
                name = COALESCE(excluded.name, schools.name),
                short_name = COALESCE(excluded.short_name, schools.short_name),
                district = COALESCE(excluded.district, schools.district),
                tier = COALESCE(excluded.tier, schools.tier),
                type = COALESCE(excluded.type, schools.type),
                ownership = COALESCE(excluded.ownership, schools.ownership),
                address = COALESCE(excluded.address, schools.address),
                phone = COALESCE(excluded.phone, schools.phone),
                website = COALESCE(excluded.website, schools.website),
                tags = COALESCE(excluded.tags, schools.tags),
                intro_text = CASE WHEN excluded.intro_text != '' THEN excluded.intro_text ELSE schools.intro_text END,
                md_dir = excluded.md_dir,
                updated_at = CURRENT_TIMESTAMP
            """,
            (
                sid, fm.get("name"), fm.get("short_name"), fm.get("district"),
                fm.get("tier"), fm.get("type"), fm.get("ownership"),
                fm.get("address"), fm.get("phone"), fm.get("website"),
                tags_json, intro_text, md_dir_rel,
            ),
        )
        if fm.get("doc_type") == "basic":
            self.stats["schools"] += 1

    def insert_admissions(self, fm: dict, file_path: Path) -> None:
        sid = fm.get("school_id")
        rows = fm.get("admissions") or []
        src_md = str(file_path.relative_to(REPO_ROOT))
        for r in rows:
            if self.dry_run:
                self.stats["admissions"] += 1
                continue
            self.conn.execute(
                """
                INSERT INTO admissions (
                    school_id, year, batch, min_score, avg_score, max_score,
                    quota, control_line, source, source_url, source_md, notes
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(school_id, year, batch) DO UPDATE SET
                    min_score = excluded.min_score,
                    avg_score = COALESCE(excluded.avg_score, admissions.avg_score),
                    max_score = COALESCE(excluded.max_score, admissions.max_score),
                    quota = excluded.quota,
                    control_line = excluded.control_line,
                    source = excluded.source,
                    source_url = COALESCE(excluded.source_url, admissions.source_url),
                    source_md = excluded.source_md
                """,
                (
                    sid, r.get("year"), r.get("batch"),
                    r.get("min_score"), r.get("avg_score"), r.get("max_score"),
                    r.get("quota"), r.get("control_line"),
                    fm.get("source"), fm.get("source_url"), src_md, r.get("notes"),
                ),
            )
            self.stats["admissions"] += 1

    def insert_gaokao(self, fm: dict, file_path: Path) -> None:
        sid = fm.get("school_id")
        rows = fm.get("gaokao_results") or []
        src_md = str(file_path.relative_to(REPO_ROOT))
        for r in rows:
            if self.dry_run:
                self.stats["gaokao"] += 1
                continue
            self.conn.execute(
                """
                INSERT INTO gaokao_results (
                    school_id, year, one_ben_rate, prestigious_rate,
                    qingbei_count, fudan_jiaoda_count, c9_count, avg_score,
                    source, source_url, source_md, notes
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(school_id, year) DO UPDATE SET
                    one_ben_rate = excluded.one_ben_rate,
                    prestigious_rate = excluded.prestigious_rate,
                    qingbei_count = excluded.qingbei_count,
                    fudan_jiaoda_count = excluded.fudan_jiaoda_count,
                    c9_count = COALESCE(excluded.c9_count, gaokao_results.c9_count),
                    avg_score = COALESCE(excluded.avg_score, gaokao_results.avg_score),
                    source = excluded.source,
                    source_md = excluded.source_md
                """,
                (
                    sid, r.get("year"), r.get("one_ben_rate"), r.get("prestigious_rate"),
                    r.get("qingbei_count"), r.get("fudan_jiaoda_count"),
                    r.get("c9_count"), r.get("avg_score"),
                    fm.get("source"), fm.get("source_url"), src_md, r.get("notes"),
                ),
            )
            self.stats["gaokao"] += 1

    def upsert_evaluation(self, fm: dict, file_path: Path, body: str = "") -> None:
        sid = fm.get("school_id")
        if not sid:
            return
        src_md = str(file_path.relative_to(REPO_ROOT))
        llm_summary = fm.get("llm_summary") or self._extract_section(body, "综合评价")
        if self.dry_run:
            self.stats["evals"] += 1
            return
        self.conn.execute(
            """
            INSERT INTO evaluations (
                school_id, overall_score, academic, college_placement,
                management, extracurricular, location,
                llm_summary, evaluator, evaluated_at, source_md
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(school_id) DO UPDATE SET
                overall_score = excluded.overall_score,
                academic = excluded.academic,
                college_placement = excluded.college_placement,
                management = excluded.management,
                extracurricular = excluded.extracurricular,
                location = excluded.location,
                llm_summary = excluded.llm_summary,
                evaluator = excluded.evaluator,
                evaluated_at = excluded.evaluated_at,
                source_md = excluded.source_md
            """,
            (
                sid, fm.get("overall_score"), fm.get("academic"), fm.get("college_placement"),
                fm.get("management"), fm.get("extracurricular"), fm.get("location"),
                llm_summary, fm.get("evaluator"), to_iso(fm.get("evaluated_at")), src_md,
            ),
        )
        self.stats["evals"] += 1

    def insert_document(self, fm: dict, file_path: Path, body: str) -> None:
        sid = fm.get("school_id")
        if not sid:
            return
        rel_path = str(file_path.relative_to(REPO_ROOT))
        if self.dry_run:
            return
        self.conn.execute(
            """
            INSERT INTO documents (
                school_id, doc_type, file_path, source, source_url,
                scraped_at, content_hash
            ) VALUES (?,?,?,?,?,?,?)
            ON CONFLICT(file_path) DO UPDATE SET
                doc_type = excluded.doc_type,
                source = excluded.source,
                source_url = excluded.source_url,
                scraped_at = excluded.scraped_at,
                content_hash = excluded.content_hash
            """,
            (
                sid, fm.get("doc_type", "unknown"), rel_path,
                fm.get("source"), fm.get("source_url"),
                to_iso(fm.get("scraped_at")), hash_content(body),
            ),
        )

    # ---------- 主流程 ----------

    def process_file(self, file_path: Path) -> None:
        text = file_path.read_text(encoding="utf-8")
        try:
            fm, body = parse_frontmatter(text)
        except ValueError as e:
            print(f"  [skip] {file_path.relative_to(self.md_dir)}: {e}")
            self.stats["errors"] += 1
            return

        if not fm or not fm.get("school_id"):
            return  # 索引页之类的，跳过

        self.stats["files"] += 1

        self.upsert_school(fm, file_path, body)

        doc_type = fm.get("doc_type")
        if doc_type == "admission":
            self.insert_admissions(fm, file_path)
        elif doc_type == "gaokao":
            self.insert_gaokao(fm, file_path)
        elif doc_type == "evaluation":
            self.upsert_evaluation(fm, file_path, body)

        self.insert_document(fm, file_path, body)

    def rebuild_fts(self) -> None:
        """重建 FTS5 全文索引。"""
        if self.dry_run:
            return
        self.conn.execute("DELETE FROM schools_fts")
        self.conn.execute("""
            INSERT INTO schools_fts (school_id, name, short_name, district, tags_text, address, intro_text, eval_summary)
            SELECT
                s.school_id,
                COALESCE(s.name, ''),
                COALESCE(s.short_name, ''),
                COALESCE(s.district, ''),
                COALESCE(REPLACE(REPLACE(REPLACE(s.tags, '[', ''), ']', ''), '"', ''), ''),
                COALESCE(s.address, ''),
                COALESCE(s.intro_text, ''),
                COALESCE(e.llm_summary, '')
            FROM schools s
            LEFT JOIN evaluations e ON s.school_id = e.school_id
        """)
        fts_count = self.conn.execute("SELECT COUNT(*) FROM schools_fts").fetchone()[0]
        print(f"[fts] rebuilt schools_fts: {fts_count} rows")

    def run(self) -> None:
        if not self.md_dir.exists():
            print(f"[err] md_dir not found: {self.md_dir}")
            return

        for md_file in sorted(self.md_dir.rglob("*.md")):
            self.process_file(md_file)

        if not self.dry_run:
            self.rebuild_fts()
            self.conn.execute(
                "INSERT INTO load_runs (finished_at, schools_loaded, files_scanned, errors) VALUES (CURRENT_TIMESTAMP, ?, ?, ?)",
                (self.stats["schools"], self.stats["files"], self.stats["errors"]),
            )

        print(f"[ok] files: {self.stats['files']}, schools: {self.stats['schools']}, "
              f"admissions: {self.stats['admissions']}, gaokao: {self.stats['gaokao']}, "
              f"evals: {self.stats['evals']}, errors: {self.stats['errors']}")


def main() -> None:
    p = argparse.ArgumentParser(description="Load md frontmatter into SQLite")
    p.add_argument("--db", type=Path, default=DEFAULT_DB)
    p.add_argument("--md-dir", type=Path, default=DEFAULT_MD_DIR)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args()

    print(f"[load] db={args.db} md_dir={args.md_dir} dry_run={args.dry_run}")
    with Loader(args.db, args.md_dir, args.dry_run) as ldr:
        ldr.run()


if __name__ == "__main__":
    main()
