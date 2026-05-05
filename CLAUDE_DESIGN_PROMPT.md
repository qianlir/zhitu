# Claude Design 提示词 — 上海中考志愿助手 Web UI

## 使用方式
将以下提示词完整粘贴给 Claude design，用于生成完整的前端界面设计。

---

## 完整提示词

---

Design a modern, elegant web application called **"上海中考志愿助手"** (Shanghai High School Application Advisor) — a data-driven tool helping Shanghai middle school graduates and parents navigate the 中考 (high school entrance exam) application process.

### Brand Identity
- **Product name**: 上海中考志愿助手
- **Tagline**: 数据说话，志愿不慌 (Let data speak, no more anxiety about applications)
- **Audience**: Shanghai middle school students (Grade 9) and their parents
- **Tone**: Professional yet approachable, data-driven, trustworthy

### Design System
- **Primary color**: Deep blue `#1a56db` (authority, trust)
- **Secondary color**: Teal `#0694a2` (clarity, intelligence)
- **Accent**: Amber `#d97706` (highlights, CTAs)
- **Background**: Off-white `#f8fafc`, card white `#ffffff`
- **Text**: Dark gray `#111827`, secondary `#6b7280`
- **Success**: Green `#059669`
- **Font**: System sans-serif stack, Chinese-first (PingFang SC, Source Han Sans)
- **Rounded corners**: `8px` cards, `6px` inputs, `24px` pills
- **Shadows**: Subtle `0 1px 3px rgba(0,0,0,0.1)`

### Page 1: Home / Landing Page (`/`)

Layout: centered hero + 3-feature grid + quick search bar

**Hero section**:
- Large headline: "找到适合你的上海高中" (Find Your Ideal Shanghai High School)
- Subheadline: "基于历年招录数据，智能分析志愿填报策略" (Evidence-based volunteer strategy using historical data)
- Prominent search bar in the center: placeholder "输入学校名、区域或分数..." with a blue search button
- Below search: 3 quick filter pills: [📍 按区域] [🏆 按类型] [📊 按分数段]
- Subtle background: light grid pattern or Shanghai skyline illustration in low opacity

**Stats bar** (below hero, full-width gray background):
- 4 numbers: `296所` 高中覆盖 | `历年` 录取数据 | `2025年` 最新分数线 | `智能` 志愿建议

**Feature cards** (3 columns):
1. 🔍 **学校查询** — "输入学校名或关键词，查看详细信息、历年分数线和高考成绩"
2. ⚖️ **多校对比** — "选择2-5所学校，横向对比录取分数、升学率、学校特色"
3. 🎯 **志愿推荐** — "输入估分和偏好，获取个性化报名策略和冲稳保建议"

**Recent popular schools** (horizontal scroll cards, compact):
Show 6 school cards with: school name, district badge, type badge, 2025 score

### Page 2: School Query & Detail (`/schools` + `/schools/:id`)

**Search page** layout: 
- Top: search bar (full width)
- Left sidebar (240px): filter panel
  - 区域 checkboxes: 黄浦/徐汇/长宁/静安/普陀/虹口/杨浦/闵行/宝山/嘉定/浦东/金山/松江/青浦/奉贤/崇明
  - 学校类型: 委属市重点/市实验示范/区实验示范/普通高中 (with colored badges)
  - 办别: 公办/民办
  - 2025统招分数段: slider `513 — 720`
  - 一本率: slider `0% — 100%`
- Right main area: school cards grid (3 columns on desktop, 1 on mobile)

**School card** design:
- White card with subtle shadow
- Top: colored left border (blue=市重点, teal=区重点, gray=普通)
- School name (bold, large), district badge (pill), type badge (pill)
- Key stats row: `2025统招 XXX分` | `一本率 XX%` | `招生人数 XXX`
- Bottom: [查看详情] button

**School detail page** layout:
- Breadcrumb: 首页 > 学校查询 > 七宝中学
- Header card: school name, district, type badges, key metrics strip
- Tab navigation: [基本信息] [历年分数线] [高考成绩] [综合评估]

**历年分数线 tab**:
- Line chart: 2020-2025 统招分数线趋势 (use Chart.js style)
- Below: data table with columns: 年份 | 统招最低分 | 名额到区(参考) | 自招分 | 控制线
- Color coding: rising trend = green, falling = red

**综合评估 tab**:
- Radar chart (5 axes): 学业水平 / 升学质量 / 学校管理 / 课外活动 / 地理位置
- Overall score badge (1-10 with color)
- LLM-generated summary paragraph
- Data source disclaimer in small text

### Page 3: Multi-School Comparison (`/compare`)

**School selector** at top:
- Search box to add schools (with autocomplete dropdown)
- Currently selected: up to 5 school pills with ✕ to remove
- [清空对比] button

**Comparison table** (horizontal scroll on mobile):
- First column: metric names (pinned)
- Subsequent columns: one per school, with school name + type badge in header
- Rows grouped by section:
  - 📋 **基本信息**: 区域 / 类型 / 办别 / 招生人数
  - 📊 **2025录取**: 统招最低分 / 名额到区(参考) / 自招分
  - 📈 **历年趋势**: 2023分 / 2024分 / 2025分 / 三年变化↑↓
  - 🎓 **高考成绩**: 一本率 / 985率 / 清北复交人数
  - ⭐ **综合评分**: 总分 / 雷达图迷你版

**Highlight cells**: best value in each row gets green background; lowest gets light red.

**Bottom**: [导出对比报告] button (generates shareable summary)

### Page 4: Application Recommendation (`/recommend`)

**Input form** (single-column, card layout):

Step 1 — 我的情况:
- 预估分数: large number input `[___] 分` with range hint "(满分750分)"
- 所在区: dropdown (16 districts)
- 户籍类型: radio [上海户籍] [持居住证] [其他]

Step 2 — 我的偏好:
- 学校类型偏好: multi-select pills [不限] [市重点] [区重点] [寄宿制] [艺体特长]
- 期望通勤: radio [30分钟内] [1小时内] [不限]
- 核心诉求: checkbox grid
  - [重视升学率] [离家近] [学风严格] [课外活动丰富] [国际方向] [理科强]

Step 3 — 志愿策略偏好:
- 风险偏好: 3 cards with icons
  - 🚀 激进型 (冲高分学校)
  - ⚖️ 均衡型 (推荐，冲稳保结合)  
  - 🛡️ 保守型 (稳妥为主)

[获取志愿建议] button (blue, full width, large)

**Results section** (appears below after submission):
- Score band visualization: gauge chart showing where score falls
- 3 columns: [冲一冲] [稳一稳] [保底选]
  - Each column: 2-3 school cards with match score badge
  - School card shows: name, 2025录取分, 近3年趋势, 一本率
- Expandable LLM analysis section: "综合分析" with policy notes

### Page 5: About / Data Sources (`/about`)
Simple centered page explaining data sources, update frequency, and disclaimers.

### Global Components

**Navigation header**:
- Logo left: school icon + "中考志愿助手"
- Nav links: 学校查询 / 多校对比 / 志愿推荐
- Right: "数据更新: 2025年7月" badge

**Mobile navigation**: 
- Bottom tab bar with 4 icons: 首页/查询/对比/推荐

**Empty state**: Illustrated empty state for no search results

**Loading state**: Skeleton cards while data loads

**Score chip component**: 
- Pill with color coding: 
  - `≥700`: dark blue (四校级)
  - `680-699`: blue (强市重点)
  - `660-679`: teal (市重点)
  - `640-659`: green (区重点)
  - `<640`: gray (普通高中)

### Responsive Breakpoints
- Mobile: `< 640px` — single column, bottom nav
- Tablet: `640-1024px` — 2 columns, condensed filters
- Desktop: `> 1024px` — full layout as described

### Data Display Standards
- All scores: show as `XXX 分` or `XXX.X 分`
- Rates: show as `XX%`
- Missing data: show as `—` (not 0 or null)
- Data freshness: show source year badge `[2025]`
- LLM-generated content: subtle `✨ AI生成` badge with italic text

### Accessibility
- All color choices meet WCAG AA contrast
- Focus rings on interactive elements
- Screen reader labels for data visualizations
- Loading announcements for dynamic content

---

**Deliverable**: Please design all 5 pages as high-fidelity mockups with real-looking data. Use actual school names (七宝中学, 建平中学, 复旦附中, etc.) and realistic score numbers (699, 695, 706, etc.) in the designs. The overall aesthetic should feel like a well-crafted Chinese educational SaaS product — clean, data-rich, trustworthy, not flashy.
