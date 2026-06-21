// Окно «Забыли пароль»: пользователь вводит логин и получает ссылку для сброса.
// Почтового сервера нет — в dev/демо ссылка показывается прямо на экране.
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ApiError, forgotPassword } from "../api/client";
import { LexScene } from "./login/LexScene";

export function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResetToken(null);
    setSubmitting(true);
    try {
      const res = await forgotPassword(username.trim());
      setMessage(res.message);
      setResetToken(res.reset_token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось выполнить запрос.");
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

        <h1 className="lex__title">Восстановление пароля</h1>
        <p className="lex__subtitle">
          Укажите логин — пришлём ссылку для сброса пароля.
        </p>

        {error && (
          <div className="lex__error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="lex__notice" role="status">
            {message}
            {resetToken && (
              <div className="lex__notice-action">
                <span className="lex__notice-dev">Демо-режим (почта не отправляется):</span>
                <Link to={`/reset?token=${encodeURIComponent(resetToken)}`}>
                  Перейти к сбросу пароля →
                </Link>
              </div>
            )}
          </div>
        )}

        {!message && (
          <>
            <label className="lex__label" htmlFor="fp-username">
              Логин
            </label>
            <input
              id="fp-username"
              type="text"
              autoComplete="username"
              className="lex__input lex__field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ваш логин"
              required
            />

            <button className="lex__submit" type="submit" disabled={submitting}>
              {submitting ? <span className="lex__spinner" /> : "Отправить ссылку"}
              <span className="lex__sheen" />
            </button>
          </>
        )}

        <p className="lex__foot">
          Вспомнили пароль? <Link to="/login">Войти</Link>
        </p>
      </form>
    </LexScene>
  );
}
