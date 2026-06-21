// Окно входа «ЛЕКС».
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { LexScene } from "./login/LexScene";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
      setError(err instanceof ApiError ? err.message : "Не удалось войти. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LexScene>
      <form className="lex__card" onSubmit={handleSubmit} noValidate>
        <div className="lex__card-accent" />

        <div className="lex__brand">
          <div className="lex__brand-mark">
            <span>Λ</span>
          </div>
          <div>
            <div className="lex__brand-name">ЛЕКС</div>
            <div className="lex__brand-tag">AI-помощник юриста</div>
          </div>
        </div>

        <h1 className="lex__title">Вход в систему</h1>
        <p className="lex__subtitle">
          Ваш персональный AI-помощник по правовым вопросам ждёт.
        </p>

        {error && (
          <div className="lex__error" role="alert">
            {error}
          </div>
        )}

        <label className="lex__label" htmlFor="lex-username">
          Логин
        </label>
        <input
          id="lex-username"
          type="text"
          autoComplete="username"
          className={`lex__input lex__field${error ? " lex__input--invalid" : ""}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ваш логин"
          required
        />

        <label className="lex__label" htmlFor="lex-pw">
          Пароль
        </label>
        <div className="lex__pw">
          <input
            id="lex-pw"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            className={`lex__input${error ? " lex__input--invalid" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            required
          />
          <button
            type="button"
            className="lex__pw-toggle"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPw ? "🙈" : "👁"}
          </button>
        </div>

        <div className="lex__forgot">
          <Link to="/forgot">Забыли пароль?</Link>
        </div>

        <button className="lex__submit" type="submit" disabled={submitting}>
          {submitting ? <span className="lex__spinner" /> : "Войти"}
          <span className="lex__sheen" />
        </button>

        <p className="lex__foot">
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </form>
    </LexScene>
  );
}
