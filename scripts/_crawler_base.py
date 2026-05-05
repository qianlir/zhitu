"""通用爬虫基础设施：节流 / 重试 / 缓存 / 断点。

设计原则：
- 所有 HTTP 走 ThrottledClient（5 并发 + 500ms 间隔）
- 原始 HTML 落盘到 .cache/ 永不失效，重跑即跳过
- 状态文件 crawl_state.json 记录已完成 URL，支持 Ctrl+C 续传
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass, field
from pathlib import Path

import httpx

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36 "
    "(+sh-zhongkao-advisor/educational-research)"
)


def url_hash(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()[:12]


@dataclass
class CrawlState:
    """已完成 URL 集合（支持断点续传）。"""
    state_file: Path
    done: set[str] = field(default_factory=set)

    def __post_init__(self):
        if self.state_file.exists():
            self.done = set(json.loads(self.state_file.read_text(encoding="utf-8")))

    def mark(self, url: str) -> None:
        self.done.add(url)
        self.flush()

    def flush(self) -> None:
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        self.state_file.write_text(
            json.dumps(sorted(self.done), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )


class ThrottledClient:
    """5 并发 + 500ms 单 host 节流。"""

    def __init__(self, concurrency: int = 5, throttle_ms: int = 500, timeout: float = 30.0):
        self.sem = asyncio.Semaphore(concurrency)
        self.throttle = throttle_ms / 1000.0
        self.last_request_at = 0.0
        self.lock = asyncio.Lock()
        self.client = httpx.AsyncClient(
            timeout=timeout,
            headers={"User-Agent": USER_AGENT, "Accept-Language": "zh-CN,zh;q=0.9"},
            follow_redirects=True,
        )

    async def get(self, url: str, retries: int = 3) -> httpx.Response | None:
        async with self.sem:
            async with self.lock:
                gap = time.monotonic() - self.last_request_at
                if gap < self.throttle:
                    await asyncio.sleep(self.throttle - gap)
                self.last_request_at = time.monotonic()

            for attempt in range(retries):
                try:
                    r = await self.client.get(url)
                    if r.status_code == 200:
                        return r
                    if r.status_code in (429, 503):
                        await asyncio.sleep(2 ** attempt)
                        continue
                    print(f"  [http {r.status_code}] {url}")
                    return None
                except (httpx.TimeoutException, httpx.NetworkError) as e:
                    print(f"  [retry {attempt + 1}/{retries}] {url}: {e}")
                    await asyncio.sleep(2 ** attempt)
            return None

    async def aclose(self):
        await self.client.aclose()


@asynccontextmanager
async def open_client(concurrency: int = 5, throttle_ms: int = 500):
    client = ThrottledClient(concurrency=concurrency, throttle_ms=throttle_ms)
    try:
        yield client
    finally:
        await client.aclose()


class HtmlCache:
    """原始 HTML 缓存到 cache_dir/<url_hash>.html，永不失效。"""

    def __init__(self, cache_dir: Path):
        self.cache_dir = cache_dir
        cache_dir.mkdir(parents=True, exist_ok=True)

    def path_for(self, url: str) -> Path:
        return self.cache_dir / f"{url_hash(url)}.html"

    def get(self, url: str) -> str | None:
        p = self.path_for(url)
        return p.read_text(encoding="utf-8") if p.exists() else None

    def put(self, url: str, html: str) -> None:
        p = self.path_for(url)
        p.write_text(html, encoding="utf-8")
        # 元数据文件，便于追溯
        meta = self.cache_dir / f"{url_hash(url)}.url.txt"
        meta.write_text(url, encoding="utf-8")


async def fetch_with_cache(client: ThrottledClient, cache: HtmlCache, url: str) -> str | None:
    cached = cache.get(url)
    if cached is not None:
        return cached
    r = await client.get(url)
    if r is None:
        return None
    html = r.text
    cache.put(url, html)
    return html
