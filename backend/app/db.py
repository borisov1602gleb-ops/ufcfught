"""Подключение к БД (SQLite) и базовые примитивы SQLAlchemy.

SQLite выбран для старта: данные сохраняются в файл, ничего поднимать не нужно.
Слой намеренно изолирован — переезд на PostgreSQL = смена URL и драйвера.
"""
from collections.abc import Iterator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Файл БД рядом с backend/ (backend/data/app.db).
_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "app.db"
_DB_PATH.parent.mkdir(parents=True, exist_ok=True)

DATABASE_URL = f"sqlite:///{_DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    # SQLite + многопоточный uvicorn: разрешаем доступ из разных потоков.
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Iterator[Session]:
    """FastAPI-зависимость: сессия БД на время запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
