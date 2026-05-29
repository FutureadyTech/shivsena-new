import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Ambient sound player using HTML5 Audio + MP3 file.
 *
 * Playback strategy (browser-policy aware):
 *  1. Try to autoplay immediately on mount.
 *  2. If browser blocks it (most do without a user gesture), wait for the
 * FIRST user interaction (scroll / click / touch / key / mouse move) and
 * start there. Removes those listeners once playing.
 *  3. SoundToggle button can mute/unmute at any time.
 *
 * Audio file: /public/ambient.mp3 served at "/ambient.mp3".
 * Returns { enabled, toggle } same shape as before, so SoundToggle works as-is.
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
  // Init audio NO autoplay on load. Ambient now starts only
  // after the user clicks "Enter" on the welcome banner (kicked
  // off as a window-scoped Audio in WelcomeBanner so it survives
  // the route change). The SoundToggle button still works via
  // toggle() below for any manual mute/resume.
  // ──────────────────────────────────────────────────
  useEffect(() => {
 const audio = new Audio('/ambient.mp3');
 audio.loop = true;
 audio.volume = 0;
 audio.preload = 'auto';
 audioRef.current = audio;

 return () => {
 if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
 audio.pause();
 audio.src = '';
 audioRef.current = null;
 playingRef.current = false;
 };
  }, []);

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