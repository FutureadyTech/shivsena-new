import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './WelcomeBanner.css';

/* ═══════════════════════════════════════════════════════════════
   WELCOME BANNER — Two language-entry buttons.
   Clicking either sets the site language, then navigates to /home.
═══════════════════════════════════════════════════════════════ */
export default function WelcomeBanner() {
  const [opacity, setOpacity] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const { setLang } = useLanguage();

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      if (window.scrollY <= 10 && !isExiting) setOpacity(1);
    }, 600);

    const onScroll = () => {
      if (window.scrollY > 10) setOpacity(0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(fadeInTimer);
      window.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = useCallback((targetLang) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLang(targetLang);

    try {
      const audio = new Audio('/join.mp3');
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch (err) {}

    setIsExiting(true);
    setOpacity(0);

    setTimeout(() => {
      navigate('/home');
    }, 380);
  }, [navigate, setLang]);

  return (
    <div className="welcome-banner" style={{ opacity }} aria-hidden={opacity < 0.1}>

      <div className="welcome-banner__actions">
        <button
          type="button"
          className="welcome-banner__cta welcome-banner__cta--mr"
          onClick={enter('mr')}
          disabled={isExiting}
          aria-label="मराठीत प्रवेश करा"
        >
          <span className="welcome-banner__cta-label">प्रवेश करा</span>
          <svg
            className="welcome-banner__cta-arrow"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <button
          type="button"
          className="welcome-banner__cta welcome-banner__cta--en"
          onClick={enter('en')}
          disabled={isExiting}
          aria-label="Enter in English"
        >
          <span className="welcome-banner__cta-label">Enter</span>
          <svg
            className="welcome-banner__cta-arrow"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
