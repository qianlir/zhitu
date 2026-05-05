-- 上海中考志愿助手 - SQLite Schema v1
-- 双轨数据：md 文件是 source of truth，DB 是 derived（API 查询用）
-- 入库脚本：scripts/md_to_db.py

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- ============================================================
-- 学校主表
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  school_id    TEXT PRIMARY KEY,        -- slug, e.g. 'shanghai-zhongxue'
  name         TEXT NOT NULL,           -- 中文全名 '上海中学'
  short_name   TEXT,                    -- 简称 '上中'
  district     TEXT NOT NULL,           -- 徐汇/浦东/...
  tier         TEXT NOT NULL,           -- four_schools/eight_greats/city_key/district_key/regular
  type         TEXT NOT NULL,           -- 委属市重点/市实验示范/区实验示范/普通高中
  ownership    TEXT,                    -- 公办/民办
  address      TEXT,
  phone        TEXT,
  website      TEXT,
  tags         TEXT,                    -- JSON array
  intro_text   TEXT,                    -- 学校简介正文（从 basic-info.md ## 简介 提取）
  md_dir       TEXT NOT NULL,           -- relative path: 'data/schools_md/<slug>'
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schools_district ON schools(district);
CREATE INDEX IF NOT EXISTS idx_schools_tier ON schools(tier);
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);

-- ============================================================
-- 历年录取数据（一行 = 一校一年一批次）
-- ============================================================
CREATE TABLE IF NOT EXISTS admissions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id     TEXT NOT NULL,
  year          INTEGER NOT NULL,
  batch         TEXT NOT NULL,          -- 统招/名额到区/名额到校/自主招生/零志愿
  min_score     REAL,
  avg_score     REAL,
  max_score     REAL,
  quota         INTEGER,                -- 招生名额
  control_line  REAL,                   -- 当年控制分数线
  source        TEXT,                   -- official / zhongkao_com / llm_seed
  source_url    TEXT,
  source_md     TEXT,                   -- 对应 md 文件相对路径
  notes         TEXT,
  FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
  UNIQUE (school_id, year, batch)
);

CREATE INDEX IF NOT EXISTS idx_admissions_school_year ON admissions(school_id, year);
CREATE INDEX IF NOT EXISTS idx_admissions_year_score ON admissions(year, min_score);

-- ============================================================
-- 高考成绩（一行 = 一校一年）
-- ============================================================
CREATE TABLE IF NOT EXISTS gaokao_results (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id           TEXT NOT NULL,
  year                INTEGER NOT NULL,
  one_ben_rate        REAL,             -- 一本率 0-1
  prestigious_rate    REAL,             -- 985/211 率 0-1
  qingbei_count       INTEGER,          -- 清北人数
  fudan_jiaoda_count  INTEGER,          -- 复交人数
  c9_count            INTEGER,          -- C9 人数
  avg_score           REAL,
  source              TEXT,
  source_url          TEXT,
  source_md           TEXT,
  notes               TEXT,
  FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
  UNIQUE (school_id, year)
);

CREATE INDEX IF NOT EXISTS idx_gaokao_school_year ON gaokao_results(school_id, year);

-- ============================================================
-- 综合评估（每校一行，最新评估覆盖旧评估）
-- ============================================================
CREATE TABLE IF NOT EXISTS evaluations (
  school_id          TEXT PRIMARY KEY,
  overall_score      REAL,              -- 1-10
  academic           REAL,              -- 学业水平
  college_placement  REAL,              -- 升学质量
  management         REAL,              -- 学校管理
  extracurricular    REAL,              -- 课外活动
  location           REAL,              -- 地理位置
  llm_summary        TEXT,
  evaluator          TEXT,              -- 'claude-sonnet-4-6' 等
  evaluated_at       TIMESTAMP,
  source_md          TEXT,
  FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE
);

-- ============================================================
-- 文档索引（md 文件元数据，便于追溯）
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  school_id     TEXT NOT NULL,
  doc_type      TEXT NOT NULL,          -- basic/admission/gaokao/evaluation/raw
  file_path     TEXT NOT NULL,          -- relative to repo root
  source        TEXT,                   -- llm_seed/zhongkao_com/official_site/...
  source_url    TEXT,
  scraped_at    TIMESTAMP,
  content_hash  TEXT,
  FOREIGN KEY (school_id) REFERENCES schools(school_id) ON DELETE CASCADE,
  UNIQUE (file_path)
);

CREATE INDEX IF NOT EXISTS idx_documents_school ON documents(school_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(doc_type);

-- ============================================================
-- 数据加载日志（追踪每次 md_to_db 运行）
-- ============================================================
CREATE TABLE IF NOT EXISTS load_runs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at     TIMESTAMP,
  schools_loaded  INTEGER,
  files_scanned   INTEGER,
  errors          INTEGER,
  notes           TEXT
);

-- ============================================================
-- 全文检索（FTS5）— 支持按学校名/标签/简介/地址等任意文本搜索
-- ============================================================
CREATE VIRTUAL TABLE IF NOT EXISTS schools_fts USING fts5(
  school_id UNINDEXED,
  name,
  short_name,
  district,
  tags_text,
  address,
  intro_text,
  eval_summary,
  tokenize = 'unicode61'
);
