"""Маршруты авторизации: вход и профиль текущего пользователя."""
from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.auth.schemas import LoginRequest, MeResponse, SkillOut, TokenResponse
from app.core.security import create_access_token, verify_password
from app.rbac.roles import ROLES, permissions_for_role
from app.skills.registry import skills_for_permissions
from app.users.models import User
from app.users.store import user_store

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    user = user_store.get_by_username(payload.username)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )
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
