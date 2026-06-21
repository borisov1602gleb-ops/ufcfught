// Окно регистрации «ЛЕКС». Новый аккаунт получает роль «Юрист».
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { LexScene } from "./login/LexScene";

export function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Клиентская валидация до запроса.
    if (fullName.trim().length < 2) return setError("Укажите ФИО");
    if (username.trim().length < 3) return setError("Логин должен быть не короче 3 символов");
    if (password.length < 6) return setError("Пароль должен быть не короче 6 символов");
    if (password !== confirm) return setError("Пароли не совпадают");

    setSubmitting(true);
    try {
      await signUp(username.trim(), fullName.trim(), password);
      navigate("/hub", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Не удалось зарегистрироваться. Попробуйте позже.",
      );
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

        <h1 className="lex__title">Регистрация</h1>
        <p className="lex__subtitle">Создайте аккаунт, чтобы получить доступ к навыкам.</p>

        {error && (
          <div className="lex__error" role="alert">
            {error}
          </div>
        )}

        <label className="lex__label" htmlFor="reg-name">
          ФИО
        </label>
        <input
          id="reg-name"
          type="text"
          autoComplete="name"
          className="lex__input lex__field"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Иван Петров"
          required
        />

        <label className="lex__label" htmlFor="reg-username">
          Логин
        </label>
        <input
          id="reg-username"
          type="text"
          autoComplete="username"
          className="lex__input lex__field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="не короче 3 символов"
          required
        />

        <label className="lex__label" htmlFor="reg-pw">
          Пароль
        </label>
        <div className="lex__pw">
          <input
            id="reg-pw"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            className="lex__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="не короче 6 символов"
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

        <label className="lex__label" htmlFor="reg-confirm">
          Повторите пароль
        </label>
        <input
          id="reg-confirm"
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          className="lex__input lex__field"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••••"
          required
        />

        <button className="lex__submit" type="submit" disabled={submitting}>
          {submitting ? <span className="lex__spinner" /> : "Создать аккаунт"}
          <span className="lex__sheen" />
        </button>

        <p className="lex__foot">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </LexScene>
  );
}
