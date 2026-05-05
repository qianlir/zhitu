"""上海中考志愿助手 — FastAPI 入口。

启动：
    uvicorn backend.main:app --reload --port 8000
访问：
    http://localhost:8000/         前端首页
    http://localhost:8000/docs     OpenAPI 文档
    http://localhost:8000/api/health
"""
from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from backend.routers import compare, meta, recommend, schools

REPO_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = REPO_ROOT / "frontend"

app = FastAPI(
    title="上海中考志愿助手 API",
    description="数据驱动的上海中考志愿填报助手",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only — 生产环境收紧
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict:
    """健康检查 + DB 连通性。"""
    from backend.db.connection import query_one
    try:
        row = query_one("SELECT COUNT(*) AS n FROM schools")
        return {"status": "ok", "schools_count": row["n"] if row else 0}
    except Exception as e:
        return JSONResponse({"status": "error", "detail": str(e)}, status_code=500)


# 路由注册
app.include_router(meta.router, prefix="/api/meta", tags=["meta"])
app.include_router(schools.router, prefix="/api/schools", tags=["schools"])
app.include_router(compare.router, prefix="/api/compare", tags=["compare"])
app.include_router(recommend.router, prefix="/api/recommend", tags=["recommend"])


# ============================================================
# 静态前端：fallback 到 index.html 支持单页式跳转
# ============================================================

if FRONTEND_DIR.exists():
    app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
    app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")

    MOBILE_DIR = FRONTEND_DIR / "mobile"
    if MOBILE_DIR.exists():
        app.mount("/mobile/css", StaticFiles(directory=MOBILE_DIR / "css"), name="mobile-css")
        app.mount("/mobile/js", StaticFiles(directory=MOBILE_DIR / "js"), name="mobile-js")

        @app.get("/mobile/")
        def mobile_index():
            return FileResponse(MOBILE_DIR / "index.html")

        @app.get("/mobile")
        def mobile_redirect():
            from fastapi.responses import RedirectResponse
            return RedirectResponse("/mobile/")

    @app.get("/")
    def index():
        return FileResponse(FRONTEND_DIR / "index.html")

    @app.get("/{page}.html")
    def page(page: str):
        target = FRONTEND_DIR / f"{page}.html"
        if target.exists():
            return FileResponse(target)
        return FileResponse(FRONTEND_DIR / "index.html")
