"""Pydantic-схемы запросов/ответов авторизации."""
from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SkillOut(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    entry_point: str


class MeResponse(BaseModel):
    """Профиль текущего пользователя + то, что нужно хабу для отрисовки."""
    id: str
    username: str
    full_name: str
    role_id: str
    role_title: str
    permissions: list[str]
    skills: list[SkillOut]
