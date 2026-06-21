"""Точка входа FastAPI-приложения «Персональный помощник юриста»."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.core.config import get_settings
from app.users.store import init_db

settings = get_settings()

app = FastAPI(title="Персональный помощник юриста", version="0.1.0")


@app.on_event("startup")
def _startup() -> None:
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
