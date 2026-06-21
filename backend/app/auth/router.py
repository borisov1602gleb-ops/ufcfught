"""Маршруты авторизации: регистрация, вход и профиль текущего пользователя."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.schemas import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    MeResponse,
    RegisterRequest,
    ResetPasswordRequest,
    SkillOut,
    TokenResponse,
)
from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    create_reset_token,
    decode_reset_token,
    verify_password,
)
from app.db import get_db
from app.rbac.roles import ROLES, permissions_for_role
from app.skills.registry import skills_for_permissions
from app.users.models import User
from app.users import store

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Роль по умолчанию для самостоятельной регистрации.
DEFAULT_ROLE = "lawyer"


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    username = payload.username.strip().lower()
    if store.get_by_username(db, username) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Логин уже занят",
        )
    user = store.create_user(
        db,
        username=username,
        full_name=payload.full_name.strip(),
        password=payload.password,
        role_id=DEFAULT_ROLE,
    )
    # Сразу логиним зарегистрированного пользователя.
    return TokenResponse(access_token=create_access_token(user.username))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = store.get_by_username(db, payload.username.strip().lower())
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )
    return TokenResponse(access_token=create_access_token(user.username))


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(
    payload: ForgotPasswordRequest, db: Session = Depends(get_db)
) -> ForgotPasswordResponse:
    # Не раскрываем, существует ли логин (защита от перебора): ответ всегда общий.
    generic = "Если такой логин существует, ссылка для сброса пароля отправлена."
    user = store.get_by_username(db, payload.username.strip().lower())
    if user is None:
        return ForgotPasswordResponse(message=generic, reset_token=None)

    token = create_reset_token(user.username)
    # В проде здесь отправляется письмо со ссылкой; в dev/демо возвращаем токен.
    expose = get_settings().expose_reset_token
    return ForgotPasswordResponse(message=generic, reset_token=token if expose else None)


@router.post("/reset-password", response_model=TokenResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> TokenResponse:
    username = decode_reset_token(payload.token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ссылка недействительна или устарела",
        )
    user = store.get_by_username(db, username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ссылка недействительна или устарела",
        )
    store.set_password(db, user, payload.new_password)
    # Сразу выдаём access-токен — пользователь входит с новым паролем.
    return TokenResponse(access_token=create_access_token(user.username))


@router.get("/me", response_model=MeResponse)
def me(current: User = Depends(get_current_user)) -> MeResponse:
    permissions = permissions_for_role(current.role_id)
    role = ROLES.get(current.role_id)
    skills = skills_for_permissions(permissions)
    return MeResponse(
        id=current.id,
        username=current.username,
        full_name=current.full_name,
        role_id=current.role_id,
        role_title=role.title if role else current.role_id,
        permissions=sorted(str(p) for p in permissions),
        skills=[
            SkillOut(
                id=s.id,
                title=s.title,
                description=s.description,
                icon=s.icon,
                tag=s.tag,
                entry_point=s.entry_point,
            )
            for s in skills
        ],
    )
