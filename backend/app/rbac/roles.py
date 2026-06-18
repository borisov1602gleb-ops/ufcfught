"""Реестр ролей как данные: роль -> набор прав.

Чтобы добавить роль, достаточно дописать запись в ROLES — ядро менять не нужно.
"""
from dataclasses import dataclass

from app.rbac.permissions import Permission


@dataclass(frozen=True)
class Role:
    id: str
    title: str
    permissions: frozenset[Permission]


ROLES: dict[str, Role] = {
    "lawyer": Role(
        id="lawyer",
        title="Юрист",
        permissions=frozenset({Permission.DOC_CONSTRUCTOR_USE}),
    ),
    # Методолог/администратор — управляет шаблонами отдельно от юриста-пользователя.
    "admin": Role(
        id="admin",
        title="Администратор / методолог",
        permissions=frozenset(
            {
                Permission.DOC_CONSTRUCTOR_USE,
                Permission.TEMPLATES_MANAGE,
                Permission.USERS_MANAGE,
            }
        ),
    ),
}


def permissions_for_role(role_id: str) -> frozenset[Permission]:
    role = ROLES.get(role_id)
    return role.permissions if role else frozenset()
