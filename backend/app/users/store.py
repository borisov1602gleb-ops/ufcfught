"""Доступ к пользователям в БД + создание схемы и seed-данных.

Репозиторий-функции принимают сессию — это упрощает тестирование и переезд на
другую БД. На старте создаём таблицы и демо-учётки (если их ещё нет).
"""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db import Base, SessionLocal, engine
from app.users.models import User

# Демо-учётки. Создаются при первом запуске, если username свободен.
_SEED = [
    {"username": "lawyer", "full_name": "Иван Петров", "role_id": "lawyer", "password": "lawyer123"},
    {"username": "admin", "full_name": "Анна Смирнова", "role_id": "admin", "password": "admin123"},
]


def get_by_username(db: Session, username: str) -> User | None:
    return db.scalar(select(User).where(User.username == username))


def create_user(db: Session, username: str, full_name: str, password: str, role_id: str) -> User:
    user = User(
        id=str(uuid.uuid4()),
        username=username,
        full_name=full_name,
        role_id=role_id,
        hashed_password=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def set_password(db: Session, user: User, new_password: str) -> None:
    user.hashed_password = hash_password(new_password)
    db.add(user)
    db.commit()


def init_db() -> None:
    """Создать таблицы и засеять демо-учётки. Вызывается при старте приложения."""
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        for row in _SEED:
            if get_by_username(db, row["username"]) is None:
                create_user(
                    db,
                    username=row["username"],
                    full_name=row["full_name"],
                    password=row["password"],
                    role_id=row["role_id"],
                )
