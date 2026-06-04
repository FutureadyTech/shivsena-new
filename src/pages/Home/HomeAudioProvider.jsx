import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════
   HOME AUDIO — single source of truth, tied to the hero banner.

   One looping <audio> element that exists only while Home is mounted.
   Playback follows the banner's visibility:
     • banner in view  → play (unless the visitor muted it)
     • banner scrolled away → pause
     • scrolled back to the banner → resume
   The button is a mute/unmute control; its icon mirrors the real
   playing state (read straight from this context, so it can't desync).
   Leaving /home unmounts the provider, which stops the audio.
═══════════════════════════════════════════════════════════════ */

const AUDIO_SRC = '/ambient.mp3';
const VOLUME = 0.5;
const BANNER_ID = 'home-hero-banner';
const OFF_KEY = 'SHIVSENA_AUDIO_OFF'; // '1' = visitor muted the music

const HomeAudioContext = createContext(null);
export const useHomeAudio = () => useContext(HomeAudioContext);

function readOff() {
  try { return localStorage.getItem(OFF_KEY) === '1'; } catch { return false; }
}

export default function HomeAudioProvider({ children }) {
  const audioRef = useRef(null);
  const bannerInViewRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const a = new Audio(AUDIO_SRC);
    a.loop = true;
    a.volume = VOLUME;
    a.preload = 'auto';
    audioRef.current = a;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);

    let observer = null;
    let cancelled = false;

    const attach = () => {
      if (cancelled) return;
      const banner = document.getElementById(BANNER_ID);
      if (!banner) { requestAnimationFrame(attach); return; }
      observer = new IntersectionObserver(
        ([entry]) => {
          bannerInViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            /* Banner on screen → play, unless the visitor muted it. */
            if (!readOff()) {
              const p = a.play();
              if (p && typeof p.catch === 'function') p.catch(() => {});
            }
          } else {
            /* Scrolled away from the banner → pause the looping bed
               (resumes when the banner returns) AND stop the one-shot
               Enter stinger (join.mp3) if it's still ringing. */
            try { a.pause(); } catch { /* ignore */ }
            try { window.__stopJoin?.(); } catch { /* ignore */ }
          }
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' }
      );
      observer.observe(banner);
    };
    attach();

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      try { a.pause(); } catch { /* ignore */ }
      try { a.src = ''; } catch { /* ignore */ }
      audioRef.current = null;
    };
  }, []);

  /* Button: mute / unmute. Mute pauses + remembers the choice; unmute
     clears it and starts playing only if the banner is currently in
     view (otherwise it'll start when you scroll back to the banner). */
  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!a.paused) {
      try { localStorage.setItem(OFF_KEY, '1'); } catch { /* ignore */ }
      a.pause();
    } else {
      try { localStorage.setItem(OFF_KEY, '0'); } catch { /* ignore */ }
      if (bannerInViewRef.current) {
        const p = a.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
    }
  }, []);

  return (
    <HomeAudioContext.Provider value={{ isPlaying, toggle }}>
      {children}
    </HomeAudioContext.Provider>
  );
}
