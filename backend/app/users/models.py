"""Доменные модели пользователя."""
from dataclasses import dataclass


@dataclass
class User:
    id: str
    username: str
    full_name: str
    role_id: str
    hashed_password: str
