"""Реестр навыков (манифесты как данные).

Каждый навык — самодостаточный модуль, описанный манифестом:
id, название, иконка, требуемые права, точка входа.
Хаб на фронте показывает только те навыки, на которые у роли есть права.
Добавление навыка = добавление записи здесь, ядро не меняется.
"""
from dataclasses import dataclass, field

from app.rbac.permissions import Permission


@dataclass(frozen=True)
class SkillManifest:
    id: str
    title: str
    description: str
    icon: str  # имя иконки на фронте
    entry_point: str  # маршрут фронтенда, точка входа в навык
    required_permissions: frozenset[Permission] = field(default_factory=frozenset)


SKILLS: list[SkillManifest] = [
    SkillManifest(
        id="doc-constructor",
        title="Конструктор документов",
        description="Практика → документ → форма с вопросами → готовый .docx",
        icon="file-text",
        entry_point="/skills/doc-constructor",
        required_permissions=frozenset({Permission.DOC_CONSTRUCTOR_USE}),
    ),
]


def skills_for_permissions(user_permissions: frozenset[Permission]) -> list[SkillManifest]:
    """Навыки, доступные при данном наборе прав."""
    return [s for s in SKILLS if s.required_permissions <= user_permissions]
