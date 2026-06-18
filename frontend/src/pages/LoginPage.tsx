// Окно авторизации «ЛЕКС» — реализация дизайн-макета (legal-tech auth screen).
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { THEMIS_PATHS, DUST } from "./login/themisPaths";
import "../styles/login.css";

const TRACER_DUR = 6; // секунды (значение по умолчанию из макета)

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };

  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Параллакс на курсор: пишем --mx/--my напрямую в стиль корня, без ререндера.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // не на тач-устройствах
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Бэкенд этапа 1 принимает идентификатор как username — передаём значение поля.
      await signIn(email.trim(), password);
      const to = location.state?.from?.pathname ?? "/hub";
      navigate(to, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось войти. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="lex" ref={rootRef}>
      <div className="lex__wash" />

      <div className="lex__fog">
        <div className="lex__fog-a" />
        <div className="lex__fog-b" />
      </div>

      <div className="lex__dust">
        {DUST.map((d, i) => (
          <span
            key={i}
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              animation: `dust ${d.dur}s linear ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="lex__stage">
        {/* Фигура Фемиды */}
        <div className="lex__figure">
          <svg className="lex__svg" viewBox="0 0 600 860" aria-hidden="true">
            <defs>
              <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3.6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2a3350" />
                <stop offset="0.5" stopColor="#1b2138" />
                <stop offset="0.5" stopColor="#141a2e" />
                <stop offset="1" stopColor="#0a0d18" />
              </linearGradient>
            </defs>

            {/* Объёмная полупрозрачная заливка тела и головы */}
            <path
              d="M256 300 C236 430 214 580 198 712 L402 712 C386 580 364 430 344 300 Z"
              fill="url(#marble)"
              opacity="0.55"
            />
            <path
              d="M300 80 C271 80 255 103 255 130 C255 158 276 178 300 178 C324 178 345 158 345 130 C345 103 329 80 300 80 Z"
              fill="url(#marble)"
              opacity="0.5"
            />

            {/* Тусклый базовый контур */}
            <g fill="none" stroke="rgba(150,180,220,.16)" strokeWidth="1.4" strokeLinejoin="round">
              {THEMIS_PATHS.map((p, i) => (
                <path key={i} d={p.d} />
              ))}
            </g>

            {/* Бегущий неоновый трассер */}
            <g
              fill="none"
              stroke="var(--neon)"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            >
              {THEMIS_PATHS.map((p, i) => (
                <path
                  key={i}
                  className="lex__tracer"
                  d={p.d}
                  style={
                    {
                      "--dlen": `${p.len}px`,
                      "--tracer-dur": `${TRACER_DUR}s`,
                      "--tracer-delay": `${p.delay}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Стеклянная карточка формы */}
        <div className="lex__card-wrap">
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

            <label className="lex__label" htmlFor="lex-email">
              Email
            </label>
            <input
              id="lex-email"
              type="text"
              autoComplete="username"
              className={`lex__input lex__field${error ? " lex__input--invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@firm.legal"
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
              <a href="#">Забыли пароль?</a>
            </div>

            <button className="lex__submit" type="submit" disabled={submitting}>
              {submitting ? <span className="lex__spinner" /> : "Войти"}
              <span className="lex__sheen" />
            </button>

            <p className="lex__foot">
              Нет аккаунта? <a href="#">Регистрация</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
