// Хаб навыков (заглушка этапа 1): показывает карточки навыков, доступных роли.
import { useAuth } from "../auth/AuthContext";

export function HubPage() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <div className="hub">
      <header className="hub__header">
        <div>
          <h1 className="hub__title">Хаб навыков</h1>
          <p className="hub__user">
            {user.full_name} · <span className="hub__role">{user.role_title}</span>
          </p>
        </div>
        <button className="hub__logout" onClick={signOut}>
          Выйти
        </button>
      </header>

      {user.skills.length === 0 ? (
        <p className="hub__empty">Для вашей роли пока нет доступных навыков.</p>
      ) : (
        <div className="hub__grid">
          {user.skills.map((skill) => (
            <article key={skill.id} className="skill-card">
              <div className="skill-card__icon">▤</div>
              <h2 className="skill-card__title">{skill.title}</h2>
              <p className="skill-card__desc">{skill.description}</p>
              <span className="skill-card__cta">Открыть →</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
