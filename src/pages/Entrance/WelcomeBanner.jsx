import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentWithLang } from '../../content/_shared/useContent.js';
import entranceContent from '../../content/entrance.json';
import './WelcomeBanner.css';

/* ═══════════════════════════════════════════════════════════════
   WELCOME BANNER — Photojournalistic splash overlay.
   Eyebrow · Saffron title · Description · Outlined Enter CTA.
═══════════════════════════════════════════════════════════════ */
export default function WelcomeBanner() {
  const [opacity, setOpacity] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const { t, lang } = useContentWithLang(entranceContent.welcomeBanner);

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

  const handleEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

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
  };

  // Render description with highlighted inline CTA word
  const renderDescription = () => {
    const desc = t.description || '';
    const inline = t.ctaInline || '';
    if (!inline || !desc.includes(`'${inline}'`)) {
      return <>{desc}</>;
    }
    const parts = desc.split(`'${inline}'`);
    return parts.reduce((acc, part, idx, arr) => {
      acc.push(part);
      if (idx < arr.length - 1) {
        acc.push(
          <span key={idx} className="welcome-banner__cta-inline">
            "{inline}"
          </span>
        );
      }
      return acc;
    }, []);
  };

  return (
    <div className="welcome-banner" style={{ opacity }} aria-hidden={opacity < 0.1}>
      {/* Eyebrow — small tracked-out tagline */}
      <p className="welcome-banner__eyebrow">{t.eyebrow}</p>

      {/* MASSIVE saffron title */}
      <h1 className={`welcome-banner__title welcome-banner__title--${lang}`}>
        {t.title}
      </h1>

      {/* Description */}
      <p className="welcome-banner__description">
        {renderDescription()}
      </p>

      {/* Outlined Enter CTA */}
      <button
        type="button"
        className="welcome-banner__cta"
        onClick={handleEnter}
        disabled={isExiting}
        aria-label={t.ariaLabel}
      >
        <span className="welcome-banner__cta-label">{t.ctaLabel}</span>
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
  );
}