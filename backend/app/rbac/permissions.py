"""Реестр прав (permissions).

Доступ в системе задаётся правами на действия, а НЕ захардкоженным списком
навыков. Навыки и хаб затем спрашивают: "есть ли у пользователя такое право?".
Добавление нового права — это добавление строковой константы здесь и привязка
её к ролям в roles.py и к навыкам в skills/registry.py.
"""
from enum import StrEnum


class Permission(StrEnum):
    # Навык «Конструктор документов»
    DOC_CONSTRUCTOR_USE = "doc_constructor:use"

    # Администрирование / методология (управление шаблонами, практиками)
    TEMPLATES_MANAGE = "templates:manage"
    USERS_MANAGE = "users:manage"
