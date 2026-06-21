// Окно сброса пароля по ссылке (токен в query-параметре ?token=...).
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { LexScene } from "./login/LexScene";

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Пароль должен быть не короче 6 символов");
    if (password !== confirm) return setError("Пароли не совпадают");

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      navigate("/hub", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Не удалось сбросить пароль. Попробуйте позже.",
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

        <h1 className="lex__title">Новый пароль</h1>
        <p className="lex__subtitle">Придумайте новый пароль для входа в систему.</p>

        {!token && (
          <div className="lex__error" role="alert">
            Ссылка некорректна — нет токена сброса.
          </div>
        )}
        {error && (
          <div className="lex__error" role="alert">
            {error}
          </div>
        )}

        <label className="lex__label" htmlFor="rs-pw">
          Пароль
        </label>
        <div className="lex__pw">
          <input
            id="rs-pw"
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

        <label className="lex__label" htmlFor="rs-confirm">
          Повторите пароль
        </label>
        <input
          id="rs-confirm"
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          className="lex__input lex__field"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••••"
          required
        />

        <button className="lex__submit" type="submit" disabled={submitting || !token}>
          {submitting ? <span className="lex__spinner" /> : "Сохранить пароль"}
          <span className="lex__sheen" />
        </button>

        <p className="lex__foot">
          <Link to="/login">Вернуться ко входу</Link>
        </p>
      </form>
    </LexScene>
  );
}
