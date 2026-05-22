import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global ambient audio bootstrapper.
 *
 * The Entrance page (`/`) intentionally stays silent until the user clicks
 * the welcome button — that click sets `window.__ambientAudio` and starts
 * the loop. But if a user lands directly on any other route (e.g. /home,
 * /about, /news via URL, bookmark, or refresh) we still want the ambient
 * bed to play.
 *
 * Strategy:
 *  1. Skip entirely on `/` (entrance handles its own audio).
 *  2. If `window.__ambientAudio` already exists, do nothing (already playing).
 *  3. Try to autoplay immediately. Modern browsers block this without a
 *     prior user gesture, so:
 *  4. Fall back to the FIRST user interaction (click / scroll / touch /
 *     keydown / mousemove) on the page and start from there. Listeners
 *     remove themselves once playback begins.
 */
export default function AmbientAudio() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip on the entrance — its WelcomeBanner button starts ambient itself.
    if (pathname === '/') return;

    // Already started by an earlier entry/click? Nothing to do.
    if (window.__ambientAudio) return;

    let started = false;
    let audio = null;

    const start = () => {
      if (started) return;
      started = true;

      audio = new Audio('/ambient.mp3');
      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = 'auto';

      audio.play()
        .then(() => {
          window.__ambientAudio = audio;
          removeInteractionListeners();
        })
        .catch(() => {
          // Autoplay still blocked — listeners stay armed for next gesture.
          started = false;
          audio = null;
        });
    };

    const onInteraction = () => start();

    const interactionEvents = ['pointerdown', 'click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
    const addInteractionListeners = () => {
      interactionEvents.forEach((ev) =>
        window.addEventListener(ev, onInteraction, { passive: true, once: false })
      );
    };
    const removeInteractionListeners = () => {
      interactionEvents.forEach((ev) =>
        window.removeEventListener(ev, onInteraction)
      );
    };

    // Attempt 1: direct autoplay (succeeds if browser allows it).
    start();

    // Attempt 2: fall back to the first user gesture.
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
      // Do NOT pause/destroy the audio here — it's intentionally global and
      // should keep looping across route changes inside the SPA.
    };
  }, [pathname]);

  return null;
}
