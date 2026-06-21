"""Pydantic-схемы запросов/ответов авторизации."""
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=6, max_length=128)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseModel):
    username: str


class ForgotPasswordResponse(BaseModel):
    message: str
    # Только для dev/демо (нет почтового сервера): токен сброса возвращается
    # прямо в ответе. В проде поле остаётся None, а ссылка уходит на email.
    reset_token: str | None = None


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=6, max_length=128)


class SkillOut(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    tag: str
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
