"""Конфигурация приложения. Значения читаются из переменных окружения (.env)."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_", extra="ignore")

    # Подпись JWT. В проде ОБЯЗАТЕЛЬНО переопределить через окружение.
    secret_key: str = "dev-insecure-secret-change-me"
    access_token_expire_minutes: int = 60 * 8  # рабочий день
    algorithm: str = "HS256"

    # CORS: адреса фронтенда, которым разрешён доступ к API.
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Dev/демо: возвращать токен сброса пароля прямо в ответе API (нет почтового
    # сервера). В проде ставить False — ссылка будет уходить на email.
    expose_reset_token: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
