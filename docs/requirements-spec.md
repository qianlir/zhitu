# 上海中考志愿助手 — 需求规格书 v1.0

**日期**: 2026-05-02 | **版本**: v1.0 | **作者**: GEI gei-discover

---

## 1. 产品定位

**产品名称**: 上海中考志愿助手（SH-Gaokao Advisor）  
**目标用户**: 上海初三毕业生及家长  
**核心价值**: 用数据替代焦虑，让志愿填报有据可依

---

## 2. 需求整理（用户原始输入 → 结构化）

| 用户原话 | 整理后需求 | 优先级 |
|---------|-----------|-------|
| 上海高中信息爬取（历年录取成绩、高考成绩） | 数据采集 Pipeline | P0 |
| 学校综合评估（网络资料 + LLM 打分） | 学校评价引擎 | P0 |
| 输入估分/地址/偏好，推荐如何报名 | 志愿推荐功能 | P1 |
| 输入学校名，通过 QMD 查单校/多校信息 | 学校查询功能 | P1 |
| 学校各维度比较 | 多校对比功能 | P1 |
| 第一版 web 在线查询 | Web 应用 | P0 |
| 后续微信小程序 | 预留 API 接口 | P2 |

---

## 3. 功能模块

### Module 0: 数据基础（最重要，P0）

**数据源**:
- 上海市教育考试院（官方录取分数线）
- 各学校官网（基本信息）
- 第三方教育平台（综合排名、高考升学率）

**数据项**:
```
学校基本信息:
  - school_id, name, district（区）, address
  - type（普通高中/实验性示范性/市重点/区重点）
  - phone, website, tags

历年录取数据:
  - year（2020-2025）, school_id
  - batch（第一批/第二批/零志愿/自主招生）
  - min_score, avg_score, max_score, quota（招生名额）
  - control_line（该年控制分数线）

高考数据:
  - year, school_id
  - one_ben_rate（一本率）, prestigious_rate（985/211率）
  - avg_score（高考均分，部分学校公开）

学校评估:
  - overall_score（综合分 1-10）
  - academic（学业）, environment（环境）, management（管理）
  - extracurricular（课外活动）, college_placement（升学）
  - llm_summary（LLM 综合评价）
  - source（数据来源，如网络公开资料/LLM估计）
```

### Module 1: 学校查询（P1）

- 输入：自然语言（学校名 / 关键词 / 区域 / 类型）
- 通过 QMD 语义检索 + SQLite 精确匹配
- 输出：单校卡片（基本信息 + 录取曲线 + 评估雷达图）

### Module 2: 多校对比（P1）

- 输入：2-5 所学校名称
- 输出：维度对比表 + 对比可视化图表

### Module 3: 志愿推荐（P1）

- 输入：
  - 估分（数值，如 610 分）
  - 家庭地址/学区（可选，用于判断是否有加分/优先权）
  - 偏好（如：重视学风 / 离家近 / 艺体特长 / 冲985）
- 处理：
  - 历年分数线对比（冲/稳/保 策略）
  - 政策加权（自主招生、名额分配到校等）
  - LLM 综合建议
- 输出：推荐学校列表 + 填报策略 + 注意事项

### Module 4: Web 应用（P0）

- 单页应用，响应式设计
- 路由：首页 / 查询 / 对比 / 推荐
- 数据后端：FastAPI + SQLite
- 搜索后端：QMD CLI 集成

---

## 4. 技术架构

```
middle-school/
├── data/                        # 数据层
│   ├── raw/                     # 爬虫原始数据
│   ├── schools.json             # 结构化学校数据
│   └── schools.db               # SQLite 数据库
├── scripts/                     # 数据脚本
│   ├── crawl_schools.py         # 爬虫主脚本
│   ├── build_knowledge.py       # 生成 QMD 知识库文档
│   └── evaluate_schools.py      # LLM 评估学校
├── backend/                     # FastAPI 后端
│   ├── main.py
│   ├── routers/
│   │   ├── schools.py           # 查询/对比接口
│   │   └── recommend.py         # 志愿推荐接口
│   └── services/
│       ├── qmd_service.py       # QMD 集成
│       └── llm_service.py       # Claude API 集成
├── frontend/                    # Web 前端
│   ├── index.html
│   ├── css/
│   └── js/
├── knowledge/                   # QMD 知识库文档
│   └── schools/                 # 每所学校一个 .md 文件
├── CLAUDE.md                    # 项目 runbook
└── SOUL.md                      # 产品人格
```

**技术栈**:
- 后端: Python 3.12 + FastAPI + SQLite
- 前端: HTML/CSS/JavaScript (原生，无框架，v1)
- 搜索: QMD (`/Users/cmwang/work/new_gtm/qmd`)
- LLM: Claude API (claude-sonnet-4-6)
- 爬虫: httpx + BeautifulSoup4

---

## 5. 数据来源规划

| 数据类型 | 来源 | 采集方式 | 可信度 |
|---------|------|---------|-------|
| 学校基本信息 | 上海市教委官网 | 爬虫 | 高 |
| 历年录取分数 | 上海教育考试院 | 爬虫+手工整理 | 高 |
| 高考升学率 | 各校官网/公开报道 | 爬虫+LLM摘要 | 中 |
| 综合评估 | 第三方平台+LLM | LLM评估 | 中（标注来源） |

---

## 6. 里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M0 | 数据架构 + 种子数据（20所重点高中） | TODO |
| M1 | 学校查询 Web v1 | TODO |
| M2 | 多校对比 | TODO |
| M3 | 志愿推荐（LLM） | TODO |
| M4 | 全量学校数据（~200所） | TODO |

---

## 7. 约束与边界

- 数据准确性：录取分数线以官方公布为准，LLM评估需标注来源
- 版权：爬虫遵守 robots.txt，仅采集公开数据
- 隐私：不收集用户个人信息，所有计算在前端/本地完成
- 微信小程序：API 接口从 v1 开始就要 RESTful 设计，保证复用
