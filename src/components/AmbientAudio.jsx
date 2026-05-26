import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const FULL_VOLUME = 0.5;
const FADE_MS     = 700;

/* Smoothly ramp the audio element's volume to a target value over
   `duration` milliseconds. Cancels any in-flight fade first. */
function makeFader() {
  let raf = 0;
  return (audio, target, duration = FADE_MS) => {
    if (!audio) return;
    if (raf) cancelAnimationFrame(raf);
    const from  = audio.volume;
    const start = performance.now();
    const step  = (now) => {
      const t = Math.min(1, (now - start) / duration);
      audio.volume = from + (target - from) * t;
      if (t < 1) raf = requestAnimationFrame(step);
      else { raf = 0; }
    };
    raf = requestAnimationFrame(step);
  };
}

/* Interaction events we listen for to either kick off playback (when
   the browser has blocked autoplay even with muted=true) or unmute
   an already-playing-muted track. */
const INTERACTION_EVENTS = [
  'pointerdown', 'click', 'touchstart',
  'keydown', 'mousemove', 'scroll', 'wheel',
];

/**
 * Global ambient audio.
 *
 * Bootstrap strategy:
 *  1. Skip on the entrance ('/') — the WelcomeBanner button starts the
 *     loop with a real user gesture.
 *  2. On every other route (including a direct URL visit to /home, /about,
 *     etc.), immediately create an Audio element and try to play it
 *     **muted** — modern browsers allow muted autoplay even without a
 *     prior user gesture.
 *  3. Once playing (muted), attach one-shot listeners that **unmute** on
 *     the first user interaction (move mouse, scroll, click, …). Result:
 *     audio feels like it starts on visit + becomes audible the moment
 *     the user does anything.
 *  4. If even muted autoplay is blocked, fall back to the original
 *     "wait for first gesture, then play unmuted" path.
 *
 * Scroll-mute on /home is handled in the second effect: fade to 0 when
 * the hero scrolls out of view, fade back when it returns.
 */
export default function AmbientAudio() {
  const { pathname } = useLocation();
  const faderRef = useRef(null);
  if (!faderRef.current) faderRef.current = makeFader();

  /* ── Bootstrap ── */
  useEffect(() => {
    if (pathname === '/') return;
    if (window.__ambientAudio) return;

    let cleanupListeners = () => {};

    const armForGesture = (audio) => {
      /* Either: trigger the first play() (fallback path), or just unmute
         an already-playing muted track. We decide based on whether the
         audio has a play state. */
      const handler = () => {
        if (!audio) return;
        if (audio.paused) {
          audio.muted = false;
          audio.play().catch(() => {});
        } else {
          audio.muted = false;
        }
        cleanupListeners();
      };
      INTERACTION_EVENTS.forEach((ev) =>
        window.addEventListener(ev, handler, { once: true, passive: true })
      );
      cleanupListeners = () => {
        INTERACTION_EVENTS.forEach((ev) =>
          window.removeEventListener(ev, handler)
        );
      };
    };

    const audio = new Audio('/ambient.mp3');
    audio.loop = true;
    audio.volume = FULL_VOLUME;
    audio.preload = 'auto';
    audio.muted = true; // Muted-autoplay is allowed by most browsers

    audio.play()
      .then(() => {
        /* Muted autoplay succeeded. Expose globally and arm the unmute
           listener for the very next user interaction. */
        window.__ambientAudio = audio;
        armForGesture(audio);
      })
      .catch(() => {
        /* Even muted autoplay was blocked. Wait for a user gesture,
           then create-and-play in one go inside the event handler so
           the browser sees the activation. */
        const playOnGesture = () => {
          audio.muted = false;
          audio.play()
            .then(() => { window.__ambientAudio = audio; })
            .catch(() => {});
          cleanupListeners();
        };
        INTERACTION_EVENTS.forEach((ev) =>
          window.addEventListener(ev, playOnGesture, { once: true, passive: true })
        );
        cleanupListeners = () => {
          INTERACTION_EVENTS.forEach((ev) =>
            window.removeEventListener(ev, playOnGesture)
          );
        };
      });

    return () => cleanupListeners();
  }, [pathname]);

  /* ── Scroll-mute on the home page ── */
  useEffect(() => {
    if (pathname !== '/home') {
      const audio = window.__ambientAudio;
      if (audio) faderRef.current(audio, FULL_VOLUME);
      return;
    }

    let observer = null;
    let cancelled = false;

    const tryAttach = () => {
      if (cancelled) return;
      const hero = document.querySelector('.hero, .hero-section');
      if (!hero) {
        setTimeout(tryAttach, 100);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          const audio = window.__ambientAudio;
          if (!audio) return;
          faderRef.current(audio, entry.isIntersecting ? FULL_VOLUME : 0);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      observer.observe(hero);
    };
    tryAttach();

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
