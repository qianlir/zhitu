# CLAUDE.md — 上海中考志愿助手 runbook

## 项目是什么

数据驱动的上海中考志愿助手。两个核心抽象：

1. **md 文件库**（`data/schools_md/<slug>/*.md`）— 一所学校一目录，每文件带 YAML frontmatter，是 source of truth + QMD 检索目标。
2. **SQLite 数据库**（`data/schools.db`）— 从 md 派生，API 查询用。

数据流：

```
[爬虫 / 种子]
  → data/schools_md/<slug>/*.md (含 frontmatter)
  ↓
[md_to_db.py 入库]
  ↓
data/schools.db  ← FastAPI / 前端
  +
[QMD 索引 sh-schools]  ← LLM 检索
```

## 目录约定

| 路径 | 用途 |
|---|---|
| `backend/db/schema.sql` | SQLite schema（6 张表） |
| `backend/db/connection.py` | SQLite 连接（WAL + busy_timeout） |
| `backend/main.py` | FastAPI 入口（挂载路由 + 静态文件） |
| `backend/routers/` | API 路由（meta / schools / compare / recommend + recommend/analyze） |
| `backend/services/school_assembler.py` | 归一化 DB → 前端 flat shape 组装（含 mingeSchool） |
| `backend/services/recommender.py` | 多通道推荐引擎（按最优录取通道分类冲/匹/保） |
| `backend/services/llm_analyzer.py` | GLM API LLM 分析（流式输出个性化志愿建议） |
| `data/schools.db` | 派生数据库（git 忽略，可重生成） |
| `data/schools_md/<slug>/` | 一校一目录（README + basic-info + admission-history + gaokao-results + evaluation + raw/） |
| `data/cache/zhongkao/` | 爬虫 HTML 缓存 + 状态（git 忽略） |
| `frontend/index.html` | React 18 SPA 入口（Babel standalone） |
| `frontend/css/tokens.css` | 千里设计系统 CSS tokens |
| `frontend/js/api.js` | API client（fetch wrapper） |
| `frontend/js/util.js` | 工具函数（tierClass/fmtScore/SH_DISTRICTS） |
| `frontend/js/components.jsx` | 共享组件（Header/SchoolCard/ScoreChip/Loading/ErrorBox） |
| `frontend/js/pages/` | 6 个页面组件（Home/Schools/SchoolDetail/Compare/Recommend/About） |
| `scripts/init_db.py` | 幂等建库 |
| `scripts/seed_top12.py` | 四校八大种子 md 生成（12 所） |
| `scripts/seed_all.py` | 全量种子 md 生成（56 所，含��批次录取数据） |
| `scripts/md_to_db.py` | md → SQLite 入库 |
| `scripts/crawl_zhongkao.py` | 中考网爬虫（list / detail / inspect） |
| `scripts/_crawler_base.py` | 节流 + 缓存 + 重试 + 断点 |
| `scripts/_slug.py` | 中文校名 → slug |
| `scripts/_seed_data.py` | 12 所四校八大种子数据 |
| `scripts/_seed_data_extended.py` | 44 所扩展种子数据（含浦东补充 9 所，自动生成多批次） |

## Runbook

### 0. 安装依赖

```bash
pip install -r requirements.txt
```

### 1. 初始化数据库 + 种子

```bash
python scripts/init_db.py --reset       # 建/重建 6 张表
python scripts/seed_all.py              # 生成 47 所学校 md（235 文件）
python scripts/md_to_db.py              # 入库
```

预期输出：`files: 235, schools: 47, admissions: 141, gaokao: 94, evals: 47, errors: 0`

### 2. 启动服务

```bash
uvicorn backend.main:app --reload --port 8000
```

访问：
- http://localhost:8000/ — 前端首页
- http://localhost:8000/docs — OpenAPI 文档
- http://localhost:8000/api/health — 健康检查

### 3. 验证

```bash
sqlite3 data/schools.db "SELECT short_name, district, type FROM schools ORDER BY tier"
sqlite3 data/schools.db "SELECT school_id, year, min_score FROM admissions WHERE year = 2025 ORDER BY min_score DESC"
curl http://localhost:8000/api/meta/stats
```

### 3. 爬虫（中考网）

⚠️ 选择器（CSS）需首轮跑后调整 — 见 `scripts/crawl_zhongkao.py` 顶部 TODO。

```bash
# 调试单页：dump 结构辅助定位选择器
python scripts/crawl_zhongkao.py inspect "https://shanghai.zhongkao.com/school/"

# 干跑：解析列表页（不写盘）
python scripts/crawl_zhongkao.py list --pages 1 --dry-run

# 抓 5 页学校列表（约 100 所）
python scripts/crawl_zhongkao.py list --pages 5

# 抓 10 所详情（验证流程）
python scripts/crawl_zhongkao.py detail --limit 10

# 全量
python scripts/crawl_zhongkao.py detail
```

爬虫产出：`data/schools_md/<slug>/raw/zhongkao-com.md`。
后续需写 `parse_zhongkao.py` 把 raw md 转换为结构化的 admission-history / gaokao-results。

### 4. QMD 集成

> 按 `~/work/new_gtm/qmd/CLAUDE.md` 约束：**绝不自动跑** `qmd collection add` / `qmd embed` / `qmd update`。
> 以下命令请用户手动执行。

```bash
# 创建 QMD 集合（一次性）
qmd collection add /Users/cmwang/work/middle-school/data/schools_md --name sh-schools --mask '**/*.md'
qmd context add qmd://sh-schools/ "上海高中数据库 - 一校一目录，含基本信息/历年录取/高考成绩/综合评估"

# 增量更新（爬虫/种子刷新后）
qmd update

# 生成向量嵌入（提升检索质量）
qmd embed

# 查询示例
qmd query "七宝中学 2024 录取分数线"
qmd query "浦东 寄宿制 市重点"
qmd get sh-schools/shanghai-zhongxue/admission-history.md
```

### 6. 重新加载数据（幂等）

```bash
python scripts/init_db.py --reset
python scripts/seed_all.py              # 重新生成所有 md
python scripts/md_to_db.py              # 扫所有 md 入库
```

## 数据约定

### Frontmatter 字段

每个 md 顶部 YAML 必含：

| 字段 | 说明 |
|---|---|
| `school_id` | slug（唯一标识） |
| `doc_type` | readme / basic / admission / gaokao / evaluation / raw |
| `source` | llm_seed / llm_seed_approximate / llm_estimated / zhongkao_com / official / ... |
| `scraped_at` | ISO 8601 时间戳 |

`admission` 类的 `admissions:` 是数组，每条含 `year/batch/min_score/quota/control_line`。

### 数据来源标签

| source | 含义 | 可信度 |
|---|---|---|
| `official` | 官方教育考试院 | 高 |
| `zhongkao_com` | 中考网爬取 | 中 |
| `llm_seed` | 我（Claude）用知识生成 | 中（结构性字段） |
| `llm_seed_approximate` | 同上但是近似数值 | 低（仅占位） |
| `llm_estimated` | LLM 综合评估打分 | 低（参考） |

入库后查询 `WHERE source IN ('official', 'zhongkao_com')` 过滤"可信"数据。

## 已完成 (M0 + M1 + M2)

- ✅ Schema (6 张表) + init_db.py
- ✅ 56 所学校种子 md（四校 4 + 八大 8 + 市重点 28 + 区重点 12 + 普通 6）
- ✅ 全 16 区覆盖，浦东 15 所，分数段 620-706.5
- ✅ 多批次录取数据：统招 + 名额到区 + 名额到校 + 自主招生（537 条录取记录）
- ✅ md → DB loader（幂等 UPSERT）
- ✅ 爬虫框架（list / detail / inspect 三子命令，含节流 + 缓存 + 断点）
- ✅ FastAPI 后端（5 路由 + LLM 分析端点：meta / schools / compare / recommend / recommend/analyze / health）
- ✅ SQLite WAL mode + busy_timeout 并发优化
- ✅ school_assembler：归一化 DB → 前端 flat shape（含 mingeSchool 名额到校）
- ✅ 多通道推荐引擎：按最优录取通道（统招/名额到区/名额到校）分类冲/匹/保
- ✅ LLM 智能分析：GLM API (Anthropic-compatible) 流式输出个性化志愿分析
- ✅ 用户偏好系统：距离偏好/寄宿偏好/心仪学校/自定义需求
- ✅ 千里设计系统前端（React 18 + Babel standalone SPA）
- ✅ 6 页面：首页 / 学校查询 / 学校详情 / 多校对比 / 志愿推荐(多通道+AI) / 关于
- ✅ 学校详情 4 tabs：基本信息 / 历年分数线(含4通道) / 高考成绩 / 综合评估(雷达图)
- ✅ 推荐页：多通道 ChannelBadge + 偏好面板 + AI 智能分析流式面板

## 待办 (M3+)

- 写 `parse_zhongkao.py`：raw md → 结构化 admission-history.md
- 爬虫选择器需首轮 `inspect` 后调整
- 添加更多学校（目标 100+，目前 56 所）
- 名额到区分区差异化分数线（当前用统一 delta，实际各区不同）
- 移动端响应式优化
- 搜索支持拼音模糊匹配
- LLM 分析历史保存 + 对话式追问

## 设计决策

- **md 是 source of truth**：人可读、LLM 可检索、git 可 diff；DB 是派生品（可重建）
- **Slug 用拼音**：URL 友好，目录可读；已知 12 所手工映射保证一致性
- **数据来源标签**：每行都带 source，避免 LLM 估计值污染官方数据
- **多通道推荐**：按最优录取通道分类，名额到校分数最低，是核心机会
- **LLM 分析用 GLM API**：Anthropic-compatible SDK，流式输出，支持个性化偏好
- **爬虫 5 并发 + 500ms 节流**：尊重源站，遵守 robots.txt
- **分阶段断点**：list / detail 各有缓存 + 状态文件，Ctrl+C 安全续传
- **SQLite WAL + busy_timeout=5000**：支持并发读，写冲突自动重试
- **school_assembler 抽象**：归一化 DB 表 → 前端 flat JSON，解耦 schema 与前端
- **千里设计系统**：统一 CSS tokens (colors/spacing/shadows)，tier-based 分色
- **前端无构建**：React 18 + Babel standalone，零工具链复杂度，适合快速迭代
