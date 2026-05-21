import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Ambient sound player using HTML5 Audio + MP3 file.
 *
 * Playback strategy (browser-policy aware):
 *  1. Try to autoplay immediately on mount.
 *  2. If browser blocks it (most do without a user gesture), wait for the
 *     FIRST user interaction (scroll / click / touch / key / mouse move) and
 *     start there. Removes those listeners once playing.
 *  3. SoundToggle button can mute/unmute at any time.
 *
 * Audio file: /public/ambient.mp3 — served at "/ambient.mp3".
 * Returns { enabled, toggle } — same shape as before, so SoundToggle works as-is.
 */
export function useAmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef(null);
  const playingRef = useRef(false);
  const fadeRafRef = useRef(null);

  // ──────────────────────────────────────────────────
  // Smooth volume fade
  // ──────────────────────────────────────────────────
  const fadeVolume = useCallback((target, duration = 1400, onComplete) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);

    const start = performance.now();
    const from = audio.volume;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      audio.volume = from + (target - from) * t;
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        fadeRafRef.current = null;
        onComplete?.();
      }
    };
    fadeRafRef.current = requestAnimationFrame(step);
  }, []);

  // ──────────────────────────────────────────────────
  // Init audio + try autoplay (with interaction fallback)
  // ──────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio('/ambient.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    const startAudio = () => {
      if (playingRef.current) return;
      const a = audioRef.current;
      if (!a) return;

      a.play()
        .then(() => {
          playingRef.current = true;
          setEnabled(true);
          fadeVolume(0.5, 2000); // 2s gentle fade-in
          removeInteractionListeners();
        })
        .catch(() => {
          // Autoplay still blocked — listeners stay armed, will retry on interaction.
        });
    };

    const onInteraction = () => startAudio();

    const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown', 'mousemove'];
    const addInteractionListeners = () => {
      interactionEvents.forEach((ev) =>
        window.addEventListener(ev, onInteraction, { passive: true })
      );
    };
    const removeInteractionListeners = () => {
      interactionEvents.forEach((ev) =>
        window.removeEventListener(ev, onInteraction)
      );
    };

    // Attempt 1: direct autoplay (will work if browser allows it)
    startAudio();

    // Attempt 2: fall back to first user interaction
    addInteractionListeners();

    return () => {
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
      removeInteractionListeners();
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      playingRef.current = false;
    };
  }, [fadeVolume]);

  // ──────────────────────────────────────────────────
  // Manual toggle (SoundToggle button)
  // ──────────────────────────────────────────────────
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => {
          playingRef.current = true;
          setEnabled(true);
          fadeVolume(0.5, 800);
        })
        .catch(() => {});
    } else {
      fadeVolume(0, 600, () => {
        audio.pause();
        playingRef.current = false;
      });
      setEnabled(false);
    }
  }, [fadeVolume]);

  return { enabled, toggle };
}