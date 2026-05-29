import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import './WelcomeBanner.css';

/* ═══════════════════════════════════════════════════════════════
   JOIN.MP3 — click stinger
   ───────────────────────────────────────────────────────────────
   Plays every time the Enter button is clicked. Tracked via a
   module-level reference (not a closure) so the unmount cleanup
   below can stop it — otherwise the Audio would keep playing into
   /home after navigation, which was the original bug.

   No "played once" lock — the stinger is meant to fire on every
   Enter click. The only guarantee is: it can never bleed into
   /home, because the WelcomeBanner unmount cleanup kills it.
═══════════════════════════════════════════════════════════════ */
let joinAudio = null;

/* Exposed on window so HomeBannerAudio can ask us to stop the
   stinger if the user scrolls past the banner or navigates away
   from /home before the audio ends naturally. Avoids a cross-
   module circular import. */
if (typeof window !== 'undefined') {
  window.__stopJoin = () => stopJoin();
}

function playJoinClick() {
  /* If a previous click is still playing, stop it first so two
     clicks don't overlap and double-up. */
  stopJoin();
  try {
    joinAudio = new Audio('/join.mp3');
    joinAudio.volume = 0.85;
    joinAudio.addEventListener('ended', stopJoin, { once: true });
    joinAudio.play().catch(() => { stopJoin(); });
  } catch {
    stopJoin();
  }
}

function stopJoin() {
  if (!joinAudio) return;
  try { joinAudio.pause(); } catch {}
  try { joinAudio.src = ''; } catch {}
  joinAudio = null;
}

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
      /* Do NOT stop join.mp3 here. The stinger is allowed to keep
         playing through the route transition into /home, where it
         overlaps with ambient.mp3 and plays through to its own
         natural end (via the 'ended' listener wired up in
         playJoinClick). */
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enter = useCallback((targetLang) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLang(targetLang);

    // Play the "Enter" click stinger. Tracked at module scope so the
    // unmount cleanup can stop it — that's what stops it from bleeding
    // into /home. The ambient bed is handled by HomeBannerAudio.
    playJoinClick();

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
          aria-label="मराठी"
        >
          <span className="welcome-banner__cta-label">मराठी</span>
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
          aria-label="English"
        >
          <span className="welcome-banner__cta-label">English</span>
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
