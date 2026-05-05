---
name: school-crawler-tester
description: |
  school-crawler 的自动化黑盒测试 skill。
  读取 test-cases.md 中的测试场景，通过 Task sub-agent 隔离执行被测 skill，
  按 1-5 Rubric 评分并生成加权总分报告。
version: 1.0.0
author: skill-tester-creator
triggers:
  - test school-crawler
  - run school-crawler tests
  - school-crawler-tester
allowed-tools:
  - Read
  - Write
  - Glob
  - Agent
  - AskUserQuestion
---

# school-crawler Skill Tester

自动化黑盒测试：通过 Task sub-agent 隔离执行 school-crawler，按场景概率加权评分。

## 执行前提

- 被测 skill 路径: `../SKILL.md`（相对于本文件）
- 测试用例文件: 与本 SKILL.md 同目录下的 `test-cases.md`

---

## 执行流程

### Phase 1: 加载测试配置

1. **读取 test-cases.md**：解析 YAML frontmatter，获取 scenarios、rubric-dimensions、total-cases、report-language
2. **读取所有 Test Case 区块**：解析每个 TC-X-NNN 的 Initial Input、Context Clues、Expected Outcome、Expected NOT to Happen
3. **向用户确认**后继续

### Phase 2: 逐用例执行

每个 test case 启动一个全新的、独立的 Agent（general-purpose 类型）。

Agent prompt 构造：
1. 读取被测 skill（`../SKILL.md`）完整内容
2. 将 Initial Input 作为用户请求传入
3. Agent 不知道自己在被测试

关键参数：max_turns=20，每个用例独立 agent，互不干扰。

### Phase 3: 评分

对每个 Test Case 逐维度 Chain-of-Thought 评分（先写理由再打分）：
- 数据准确性（40%）
- 信息完整性（30%）
- 来源标注（20%）
- 格式规范（10%）

### Phase 4: 汇总

```
scenario_score = avg(该场景下所有 case_score)
weighted_total = Σ(scenario_probability × scenario_score)
final_percentage = weighted_total / 5.0 × 100%
```

### Phase 5: 生成双报告

写入 `results/` 目录：
- `results/summary-YYYY-MM-DD.md` — 总结报告
- `results/detail-YYYY-MM-DD.md` — 详细报告

## 写入边界

只允许写入本 school-crawler-tester/ 目录下的 results/ 子目录。不修改被测 skill 或 test-cases.md。
