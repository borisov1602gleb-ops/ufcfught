// Окно авторизации.
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(username.trim(), password);
      const to = location.state?.from?.pathname ?? "/hub";
      navigate(to, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Не удалось войти. Попробуйте позже.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-layout">
      {/* Левая брендовая панель */}
      <aside className="auth-brand">
        <div className="auth-brand__mark">⚖</div>
        <h1 className="auth-brand__title">Персональный помощник юриста</h1>
        <p className="auth-brand__subtitle">
          Хаб профессиональных инструментов: конструктор документов, шаблоны практик
          и автоматизация рутины — в одном защищённом окне.
        </p>
      </aside>

      {/* Форма входа */}
      <main className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-card__title">Вход в систему</h2>
          <p className="auth-card__hint">Введите учётные данные для продолжения</p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <label className="auth-field">
            <span>Логин</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="например, lawyer"
              required
            />
          </label>

          <label className="auth-field">
            <span>Пароль</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Вход…" : "Войти"}
          </button>

          <p className="auth-demo">
            Демо-доступы: <code>lawyer / lawyer123</code> · <code>admin / admin123</code>
          </p>
        </form>
      </main>
    </div>
  );
}
