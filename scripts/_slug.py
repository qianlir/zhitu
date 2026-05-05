"""中文学校名 → 拼音 slug。

规则：
- 全拼，词间连字符，无声调
- 已知学校（四校八大）走手工映射，保证 slug 与种子数据一致
- 其他用 pypinyin 自动转换
"""
from __future__ import annotations

try:
    from pypinyin import lazy_pinyin
except ImportError:
    lazy_pinyin = None

# 已知学校手工映射（与 _seed_data.py 保持一致）
KNOWN_SLUGS: dict[str, str] = {
    "上海中学": "shanghai-zhongxue",
    "华东师范大学第二附属中学": "huashida-erfu",
    "华东师大二附中": "huashida-erfu",
    "复旦大学附属中学": "fudan-fuzhong",
    "复旦附中": "fudan-fuzhong",
    "上海交通大学附属中学": "jiaoda-fuzhong",
    "交大附中": "jiaoda-fuzhong",
    "上海市七宝中学": "qibao-zhongxue",
    "七宝中学": "qibao-zhongxue",
    "上海市南洋模范中学": "nanyang-mofan",
    "南洋模范中学": "nanyang-mofan",
    "上海市控江中学": "kongjiang-zhongxue",
    "控江中学": "kongjiang-zhongxue",
    "上海市大同中学": "datong-zhongxue",
    "大同中学": "datong-zhongxue",
    "上海市复兴高级中学": "fuxing-gaoji",
    "复兴高级中学": "fuxing-gaoji",
    "上海市延安中学": "yanan-zhongxue",
    "延安中学": "yanan-zhongxue",
    "上海市市西中学": "shixi-zhongxue",
    "市西中学": "shixi-zhongxue",
    "上海市建平中学": "jianping-zhongxue",
    "建平中学": "jianping-zhongxue",
}

# 学校名常见去除前后缀
NAME_PREFIXES = ("上海市", "上海", "市")
NAME_SUFFIXES = ("学校",)  # 一般保留"中学"/"高级中学"


def _strip_decorations(name: str) -> str:
    n = name.strip()
    for p in NAME_PREFIXES:
        if n.startswith(p):
            n = n[len(p):]
            break
    for s in NAME_SUFFIXES:
        if n.endswith(s):
            n = n[: -len(s)]
            break
    return n


def slugify(name: str) -> str:
    """中文学校名 → URL 友好 slug。"""
    if name in KNOWN_SLUGS:
        return KNOWN_SLUGS[name]
    stripped = _strip_decorations(name)
    if stripped in KNOWN_SLUGS:
        return KNOWN_SLUGS[stripped]
    if lazy_pinyin is None:
        # 退化方案：返回 hash 前缀
        import hashlib
        return f"school-{hashlib.sha256(name.encode()).hexdigest()[:8]}"
    parts = lazy_pinyin(stripped)
    return "-".join(parts).lower()


if __name__ == "__main__":
    samples = ["上海中学", "上海市格致中学", "嘉定一中", "向明中学", "复旦附中"]
    for s in samples:
        print(f"{s:20s} → {slugify(s)}")
