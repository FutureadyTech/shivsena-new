import { useEffect, useState, useCallback } from 'react';
import './GoogleTranslate.css';

/* ═══════════════════════════════════════════════════════════════
   GOOGLE TRANSLATE — custom मराठी ↔ ENG toggle (UI only).

   The site is authored in Marathi (source). This toggle drives
   Google's Translate engine (mounted once via <GoogleTranslateEngine/>)
   by setting the `googtrans` cookie and reloading — the most reliable,
   crash-free way to switch translation on a React SPA.

   Can be mounted multiple times (desktop + mobile header); it carries
   no engine state, only the cookie-driven buttons.
═══════════════════════════════════════════════════════════════ */

const COOKIE = 'googtrans';

function activeLangFromCookie() {
  if (typeof document === 'undefined') return 'mr';
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!m) return 'mr';
  const target = decodeURIComponent(m[1]).split('/').filter(Boolean).pop();
  return target === 'en' ? 'en' : 'mr';
}

function setGoogTransCookie(value) {
  const host = window.location.hostname;
  ['', `;domain=${host}`, `;domain=.${host}`].forEach((d) => {
    document.cookie = `${COOKIE}=${value};path=/${d}`;
  });
}

export default function GoogleTranslate({ variant = 'auto', className = '' }) {
  const [lang, setLang] = useState('mr');

  useEffect(() => { setLang(activeLangFromCookie()); }, []);

  const choose = useCallback((next) => {
    if (next === lang) return;
    // '/mr/en' translates to English; '/mr/mr' restores the original.
    setGoogTransCookie(next === 'en' ? '/mr/en' : '/mr/mr');
    window.location.reload();
  }, [lang]);

  return (
    <div
      className={`gtr gtr--${variant} ${className}`}
      role="group"
      aria-label="भाषा / Language"
      translate="no"
    >
      <button
        type="button"
        className={`gtr__btn ${lang === 'mr' ? 'is-active' : ''}`}
        onClick={() => choose('mr')}
        aria-pressed={lang === 'mr'}
      >
        मराठी
      </button>
      <span className="gtr__sep" aria-hidden="true">|</span>
      <button
        type="button"
        className={`gtr__btn ${lang === 'en' ? 'is-active' : ''}`}
        onClick={() => choose('en')}
        aria-pressed={lang === 'en'}
      >
        ENG
      </button>
    </div>
  );
}
