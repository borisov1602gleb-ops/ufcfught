"""Хранилище пользователей.

На этапе 1 — in-memory seed-данные. Интерфейс намеренно простой
(get_by_username), чтобы позже заменить реализацию на БД, не трогая остальной код.
"""
from app.core.security import hash_password
from app.users.models import User

# Демо-учётки. Пароли хешируются при старте. В проде — выносится в БД.
_SEED = [
    {
        "id": "u-lawyer",
        "username": "lawyer",
        "full_name": "Иван Петров",
        "role_id": "lawyer",
        "password": "lawyer123",
    },
    {
        "id": "u-admin",
        "username": "admin",
        "full_name": "Анна Смирнова",
        "role_id": "admin",
        "password": "admin123",
    },
]


class UserStore:
    def __init__(self) -> None:
        self._by_username: dict[str, User] = {}
        for row in _SEED:
            user = User(
                id=row["id"],
                username=row["username"],
                full_name=row["full_name"],
                role_id=row["role_id"],
                hashed_password=hash_password(row["password"]),
            )
            self._by_username[user.username] = user

    def get_by_username(self, username: str) -> User | None:
        return self._by_username.get(username)


user_store = UserStore()
