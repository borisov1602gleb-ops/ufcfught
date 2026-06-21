// Общий кинематографичный фон экранов авторизации «ЛЕКС»:
// Фемида с бегущей обводкой, туман, частицы, параллакс. В слот (children)
// помещается стеклянная карточка формы (вход/регистрация).
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { THEMIS_PATHS, DUST } from "./themisPaths";
import "../../styles/login.css";

const TRACER_DUR = 6;

export function LexScene({ children }: { children: ReactNode }) {
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

            <g fill="none" stroke="rgba(150,180,220,.16)" strokeWidth="1.4" strokeLinejoin="round">
              {THEMIS_PATHS.map((p, i) => (
                <path key={i} d={p.d} />
              ))}
            </g>

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

        <div className="lex__card-wrap">{children}</div>
      </div>
    </div>
  );
}
