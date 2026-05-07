"""LLM-powered recommendation analysis using GLM API (Anthropic-compatible)."""
from __future__ import annotations

import os
from typing import AsyncIterator

import anthropic


_CLIENT: anthropic.Anthropic | None = None

BASE_URL = os.environ.get("ANTHROPIC_BASE_URL", "https://open.bigmodel.cn/api/anthropic")
API_KEY = os.environ.get("ANTHROPIC_AUTH_TOKEN", "e1964536163fe5cea4dee3e3f2047f9a.j4dd1wzpz1yjriwi")
MODEL = os.environ.get("ANTHROPIC_DEFAULT_SONNET_MODEL", "glm-5.1")


def _get_client() -> anthropic.Anthropic:
    global _CLIENT
    if _CLIENT is None:
        _CLIENT = anthropic.Anthropic(base_url=BASE_URL, api_key=API_KEY)
    return _CLIENT


SYSTEM_PROMPT = """你是「上海中考志愿助手」的AI顾问。你的核心任务是帮助考生生成完整的志愿填报方案。

## 上海中考志愿结构（必须填满）
- 名额到区：1个志愿（冲刺，选分数略高于考生的名校）
- 名额到校：2个平行志愿（稳妥，选本区可达的学校）
- 统招平行志愿：**15个**（必须填满！按"冲4-稳6-保5"策略排列）

## 每次回复必须做的事
1. 简要分析考生定位和策略
2. **在回复末尾输出完整方案指令**，格式：
   [SET_DQ:school_id]
   [SET_DX:school_id1,school_id2]
   [SET_PX:id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id11,id12,id13,id14,id15]

   平行志愿必须15个，从高到低排列（冲→稳→保）。

## 选校策略
- 冲刺（4个）：分数高于考生5-15分的学校，有一定风险但值得尝试
- 匹配（6个）：分数在考生±5分范围内，录取概率高
- 保底（5个）：分数低于考生5-20分，确保不滑档

## 重要规则
- 必须从可选学校列表中选择（用school_id）
- 名额到校只能选本区学校，名额到区可以跨区
- **平行志愿必须填满15个，不能少于15个！** 宁可多加保底也不能留空
- **学校可以重复**：名额到区/到校选的学校，在平行志愿中可以再次出现（不同批次互不影响）
- 例如：到区选了上海中学，平行志愿第1个也可以填上海中学
- 数据为近似值，提醒用户以官方公布为准
- 用中文回答，专业但易懂"""


def build_user_prompt(
    score: float,
    district: str,
    district_rank: int,
    risk: str,
    preferences: dict,
    recommendations: dict,
) -> str:
    risk_cn = {"conservative": "稳妥型", "balanced": "均衡型", "aggressive": "冲刺型"}.get(risk, risk)

    pref_lines = []
    if preferences.get("home_district"):
        pref_lines.append(f"- 居住区域：{preferences['home_district']}")
    if preferences.get("prefer_nearby"):
        pref_lines.append("- 希望学校离家近")
    if preferences.get("prefer_boarding"):
        pref_lines.append("- 倾向寄宿制学校")
    if preferences.get("liked_schools"):
        pref_lines.append(f"- 心仪学校：{', '.join(preferences['liked_schools'])}")
    if preferences.get("notes"):
        pref_lines.append(f"- 其他需求：{preferences['notes']}")

    pref_text = "\n".join(pref_lines) if pref_lines else "无特殊偏好"

    def fmt_schools(schools: list, kind: str) -> str:
        if not schools:
            return f"  无{kind}学校\n"
        lines = []
        for s in schools:
            channels = []
            if s.get("score2025"):
                channels.append(f"统招 {s['score2025']}")
            if s.get("mingeDistrict"):
                channels.append(f"名额到区 {s['mingeDistrict']}")
            if s.get("mingeSchool"):
                channels.append(f"名额到校 {s['mingeSchool']}")
            if s.get("zizhao"):
                channels.append(f"自主招生 {s['zizhao']}")
            ch_text = " / ".join(channels)
            lines.append(
                f"  - {s['name']}（{s['district']}区 {s.get('kind', '')}）"
                f"录取概率 {s.get('prob', '?')}% | 分差 {s.get('gap', '?')} | {ch_text}"
            )
        return "\n".join(lines)

    return f"""## 考生信息
- 预估分数：{score} 分
- 所在区：{district}区
- 区内排名：约 {district_rank} 名
- 志愿策略：{risk_cn}

## 个人偏好
{pref_text}

## 系统推荐结果
定位：{recommendations.get('tierLabel', '')}

### 冲刺院校
{fmt_schools(recommendations.get('stretch', []), '冲刺')}

### 匹配院校
{fmt_schools(recommendations.get('match', []), '匹配')}

### 保底院校
{fmt_schools(recommendations.get('safety', []), '保底')}

请基于以上信息，给出详细的志愿填报分析和建议。"""


def analyze(
    score: float,
    district: str,
    district_rank: int,
    risk: str,
    preferences: dict,
    recommendations: dict,
) -> str:
    client = _get_client()
    user_msg = build_user_prompt(score, district, district_rank, risk, preferences, recommendations)

    response = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )
    return response.content[0].text


def analyze_stream(
    score: float,
    district: str,
    district_rank: int,
    risk: str,
    preferences: dict,
    recommendations: dict,
) -> anthropic.Stream:
    client = _get_client()
    user_msg = build_user_prompt(score, district, district_rank, risk, preferences, recommendations)

    return client.messages.stream(
        model=MODEL,
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )
