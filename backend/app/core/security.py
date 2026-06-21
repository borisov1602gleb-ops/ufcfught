"""Хеширование паролей и выпуск/проверка JWT-токенов."""
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return _pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_context.verify(plain, hashed)


def create_access_token(subject: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire, "typ": "access"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> str | None:
    """Возвращает subject (логин) из валидного access-токена либо None."""
    return _decode_with_type(token, "access")


# Время жизни токена сброса пароля (минуты).
RESET_TOKEN_EXPIRE_MINUTES = 15


def create_reset_token(subject: str) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire, "typ": "reset"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_reset_token(token: str) -> str | None:
    """Возвращает логин из валидного токена сброса пароля либо None."""
    return _decode_with_type(token, "reset")


def _decode_with_type(token: str, expected_typ: str) -> str | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None
    if payload.get("typ") != expected_typ:
        return None
    return payload.get("sub")
