// Хаб навыков «ЛЕКС» — реализация дизайн-макета. Карточки навыков берутся
// из данных текущего пользователя (отфильтрованы бэкендом по правам роли).
import { useEffect, useRef, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { DUST, SCALE_PATHS, skillsLabel } from "./hub/hubData";
import "../styles/hub.css";

const TRACER_DUR = 7;

export function HubPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      root.style.setProperty("--mx", mx.toFixed(3));
      root.style.setProperty("--my", my.toFixed(3));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!user) return null;

  return (
    <div className="hubx" ref={rootRef}>
      <div className="hubx__wash" />

      <div className="hubx__fog">
        <div className="hubx__fog-a" />
        <div className="hubx__fog-b" />
      </div>

      <div className="hubx__dust">
        {DUST.map((d, i) => (
          <span
            key={i}
            style={{
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              animation: `hub-dust ${d.dur}s linear ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Водяной знак «весы» справа */}
      <div className="hubx__scales" aria-hidden="true">
        <svg viewBox="0 0 300 300">
          <defs>
            <filter id="g2" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g fill="none" stroke="rgba(150,180,220,.12)" strokeWidth="1.3">
            {SCALE_PATHS.map((p, i) => (
              <path key={i} d={p.d} />
            ))}
          </g>
          <g fill="none" stroke="var(--neon)" strokeWidth="1.5" strokeLinecap="round" filter="url(#g2)">
            {SCALE_PATHS.map((p, i) => (
              <path
                key={i}
                className="hubx__tracer"
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

      <div className="hubx__content">
        {/* Топ-бар */}
        <div className="hubx__top">
          <div className="hubx__brand">
            <div className="hubx__brand-mark">Λ</div>
            <div>
              <h1 className="hubx__title">Хаб навыков</h1>
              <div className="hubx__user">
                {user.full_name} <span className="hubx__user-sep">·</span>{" "}
                <span className="hubx__user-role">{user.role_title}</span>
              </div>
            </div>
          </div>

          <button type="button" className="hubx__logout" onClick={signOut}>
            <span className="hubx__logout-dot" />
            Выйти
          </button>
        </div>

        {/* Заголовок секции */}
        <div className="hubx__section">
          <span className="hubx__section-label">Доступные навыки</span>
          <span className="hubx__section-line" />
          <span className="hubx__section-count">{skillsLabel(user.skills.length)}</span>
        </div>

        {/* Сетка навыков */}
        {user.skills.length === 0 ? (
          <p className="hubx__empty">Для вашей роли пока нет доступных навыков.</p>
        ) : (
          <div className="hubx__grid">
            {user.skills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                className="hubx__card"
                onClick={() => navigate(skill.entry_point)}
              >
                <div className="hubx__card-accent" />

                <div className="hubx__card-head">
                  <div className="hubx__card-icon">
                    <svg
                      viewBox="0 0 24 24"
                      width="26"
                      height="26"
                      fill="none"
                      stroke="var(--neon)"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
                      <path d="M13.5 3.5V8h4.5" />
                      <path d="M9 12.5h6M9 15.5h6M9 9.5h2" />
                    </svg>
                  </div>
                  <span className="hubx__card-tag">{skill.tag}</span>
                </div>

                <div>
                  <h2 className="hubx__card-title">{skill.title}</h2>
                  <p className="hubx__card-desc">{skill.description}</p>
                </div>

                <div className="hubx__card-cta">
                  Открыть
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
