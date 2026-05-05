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


SYSTEM_PROMPT = """你是「上海中考志愿助手」的AI顾问。基于用户的分数、所在区、偏好和系统推荐的学校数据，提供专业、个性化的志愿填报分析。

分析要求：
1. 先评估用户的整体竞争力定位（哪个梯队）
2. 针对每个推荐学校，分析不同录取通道（统招/名额到区/名额到校）的机会
3. 结合用户偏好（距离、寄宿、学校类型等）给出个性化建议
4. 名额到区政策解读：本区考生在本区名校的名额到区通道通常分数更低，是重要机会
5. 给出具体的志愿排列建议（冲/稳/保比例）
6. 用中文回答，语气专业但易懂，适合家长阅读

注意：
- 数据为近似值，提醒用户以官方公布为准
- 分析要具体到学校名称和分数，不要泛泛而谈
- 如果用户有距离偏好，优先推荐近的学校"""


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
