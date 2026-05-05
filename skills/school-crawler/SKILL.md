---
name: school-crawler
description: |
  爬取上海高中详细信息并保存为 QMD 兼容的 markdown 文件。
  支持从百度百科、学校官网等来源获取学校特色、历史、师资、设施等信息。
  触发词：爬取学校、更新学校信息、补充学校数据、crawl schools
---

# 学校信息爬取 Skill

## 目标

从公开来源爬取上海高中的详细信息，以 QMD 兼容的 markdown 格式保存到 `data/schools_md/<slug>/` 目录，支持全文检索。

## 数据来源优先级

1. **百度百科** — 学校历史、特色、师资、校友
2. **学校官网** — 最新招生信息、校区地址
3. **WebSearch** — 补充缺失信息（高考成绩、竞赛获奖等）

## 工作流程

### Step 1: 识别需要丰富的学校

```bash
# 查找 intro 不足 50 字的学校
python3 -c "
import json
schools = json.load(open('data/seed/schools.json'))
for s in schools:
    if len(s.get('intro','')) < 50:
        print(f\"{s['school_id']:30s} {s['short_name']:8s} intro={len(s.get('intro',''))}ch\")
"
```

### Step 2: 批量搜索学校信息

使用 WebSearch 工具搜索每所学校：

```
查询模板: "{学校全名} 百度百科 官网 特色 办学 历史 师资"
```

提取以下字段：
- `intro`: 学校简介（100-300 字，含创办年份、办学特色、知名校友）
- `tags`: 特色标签（如 "数学竞赛"、"寄宿制"、"外语特色"）
- `address`: 校区地址
- `phone`: 联系电话
- `website`: 官方网站
- `founded`: 创办年份
- `campus_area`: 占地面积
- `faculty`: 师资概况（特级教师数等）
- `alumni`: 知名校友
- `features`: 办学特色（竞赛、国际课程、特色班等）

### Step 3: 更新 JSON 数据

```python
import json

schools = json.load(open('data/seed/schools.json'))
by_id = {s['school_id']: s for s in schools}

# 更新学校信息
by_id['xxx']['intro'] = '...'
by_id['xxx']['tags'] = ['数学竞赛', '理科强', ...]
by_id['xxx']['website'] = 'https://...'

json.dump(schools, open('data/seed/schools.json', 'w'), ensure_ascii=False, indent=2)
```

### Step 4: 重建 md 文件和数据库

```bash
python scripts/seed_all.py
python scripts/init_db.py --reset
python scripts/md_to_db.py
```

### Step 5: 部署到服务器

```bash
rsync -avz data/ qianli_vm:/opt/zhongkao/data/
ssh qianli_vm 'systemctl restart zhongkao'
```

### Step 6: GEI 验证

```bash
# 验证 FTS 搜索能找到新增内容
sqlite3 data/schools.db "SELECT name FROM schools_fts WHERE schools_fts MATCH '\"数学竞赛\"*' LIMIT 5"
sqlite3 data/schools.db "SELECT name FROM schools_fts WHERE schools_fts MATCH '\"寄宿制\"*' LIMIT 5"

# 验证数据完整性
python3 -c "
import json
schools = json.load(open('data/seed/schools.json'))
short = [s for s in schools if len(s.get('intro','')) < 50]
print(f'Intro < 50ch: {len(short)}/{len(schools)}')
no_web = [s for s in schools if not s.get('website')]
print(f'No website: {len(no_web)}/{len(schools)}')
"
```

## QMD 集成（可选）

爬取完成后，可创建 QMD 集合实现语义搜索：

```bash
# 创建集合（用户手动执行）
qmd collection add /path/to/middle-school/data/schools_md --name sh-schools --mask '**/*.md'
qmd context add qmd://sh-schools/ "上海高中数据库 - 224所高中，含基本信息、录取分数线、学校特色"
qmd embed  # 生成向量索引
qmd query "浦东寄宿制理科强的学校"
```

## 数据质量要求

- **准确性第一**：所有信息必须来自可验证的公开来源
- **不编造数据**：找不到的字段留空，不要猜测
- **标注来源**：每条信息标注数据来源（百度百科/官网/公开报道）
- **交叉验证**：关键数据（分数线、招生人数）与官方数据对比

## 文件路径

| 文件 | 用途 |
|------|------|
| `data/seed/schools.json` | 学校基本信息（source of truth） |
| `data/seed/admissions.json` | 录取分数线 |
| `data/seed/gaokao.json` | 高考成绩 |
| `data/schools_md/<slug>/` | 生成的 md 文件（QMD 索引目标） |
| `data/schools.db` | 派生 SQLite 数据库（含 FTS5） |
