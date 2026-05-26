import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './AudioController.css';

/**
 * Manual + automatic ambient audio control.
 *
 * 1. Floating mute/unmute toggle button (top-right) — always visible
 *    once the audio object exists on `window.__ambientAudio`.
 * 2. Home page (`/home`): when the user scrolls past the hero section,
 *    fade the audio to 0 (auto-mute). Scrolling back up restores it.
 * 3. Manual click on the toggle is *sticky* — overrides auto-mute and
 *    sets the user's explicit preference until they toggle again.
 */
const FULL_VOLUME = 0.5;

/* Smooth volume fade — cancels any in-flight fade first */
function makeFader() {
  let raf = 0;
  return (audio, target, duration = 700) => {
    if (!audio) return;
    if (raf) cancelAnimationFrame(raf);
    const start = performance.now();
    const from  = audio.volume;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      audio.volume = from + (target - from) * t;
      if (t < 1) raf = requestAnimationFrame(step);
      else { raf = 0; }
    };
    raf = requestAnimationFrame(step);
  };
}

export default function AudioController() {
  const { pathname } = useLocation();

  /* "User has explicitly muted" — sticky. Overrides auto behaviour. */
  const [userMuted, setUserMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage?.getItem('ss:audio-muted') === '1';
  });

  /* "Auto-muted because we're past the hero" — depends on scroll position */
  const [autoMuted, setAutoMuted] = useState(false);

  /* Re-renders the button label when window.__ambientAudio appears */
  const [hasAudio, setHasAudio] = useState(typeof window !== 'undefined' && !!window.__ambientAudio);

  const faderRef = useRef(null);
  if (!faderRef.current) faderRef.current = makeFader();

  /* Poll for the audio object until it's available (it appears either
     on first interaction via AmbientAudio.jsx, or after the entrance
     click in WelcomeBanner.jsx). */
  useEffect(() => {
    if (hasAudio) return;
    const id = setInterval(() => {
      if (window.__ambientAudio) {
        setHasAudio(true);
        clearInterval(id);
      }
    }, 400);
    return () => clearInterval(id);
  }, [hasAudio]);

  /* Apply the effective mute state any time it changes */
  const effectiveMuted = userMuted || autoMuted;
  useEffect(() => {
    const audio = window.__ambientAudio;
    if (!audio) return;
    faderRef.current(audio, effectiveMuted ? 0 : FULL_VOLUME, 600);
  }, [effectiveMuted, hasAudio]);

  /* On the home page, auto-mute once the hero scrolls out of view. */
  useEffect(() => {
    if (pathname !== '/home') {
      setAutoMuted(false);
      return;
    }
    const hero = document.querySelector('.hero, .hero-section');
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        /* Past the hero = hero is no longer intersecting the viewport top */
        setAutoMuted(!entry.isIntersecting);
      },
      {
        /* Trigger when the BOTTOM of the hero crosses the top of viewport */
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  /* Manual toggle */
  const onToggle = useCallback(() => {
    setUserMuted((prev) => {
      const next = !prev;
      try { window.localStorage?.setItem('ss:audio-muted', next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  /* Don't show the button on the entrance (`/`) — its own banner
     controls the audio start. */
  if (pathname === '/') return null;
  if (!hasAudio) return null;

  return (
    <button
      type="button"
      className={`audio-toggle ${effectiveMuted ? 'is-muted' : 'is-playing'}`}
      onClick={onToggle}
      aria-label={effectiveMuted ? 'Unmute background audio' : 'Mute background audio'}
      title={effectiveMuted ? 'Unmute' : 'Mute'}
      data-cursor="link"
    >
      {effectiveMuted ? (
        /* Muted icon — speaker with a line through */
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 L6 9 H3 V15 H6 L11 19 Z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      ) : (
        /* Playing icon — speaker with sound waves */
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 L6 9 H3 V15 H6 L11 19 Z" />
          <path d="M15.5 8 A6 6 0 0 1 15.5 16" />
          <path d="M18.5 5 A10 10 0 0 1 18.5 19" />
        </svg>
      )}

      {/* Live pulse ring when playing */}
      {!effectiveMuted && <span className="audio-toggle__ring" aria-hidden="true" />}
    </button>
  );
}
