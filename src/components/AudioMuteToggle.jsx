/* ═══════════════════════════════════════════════════════════════
   AUDIO MUTE TOGGLE

   Sits in the SiteHeader next to the notifications bell. Mutes /
   un-mutes the two "intro" audios:
     • ambient.mp3  — home banner bed   (window.__stopAmbient)
     • join.mp3     — Enter-click stinger (window.__stopJoin)

   The choice is persisted in localStorage and exposed as a global
   flag (window.__audioMuted) that both audio modules check before
   they start playing. Toggling ON also stops anything currently
   playing immediately.
═══════════════════════════════════════════════════════════════ */
import { useState, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import './AudioMuteToggle.css';

const MUTE_KEY = 'SHIVSENA_AUDIO_MUTED';

function readMuted() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

/* Publish the initial flag at module load so the audio modules see
   the correct value even before this component mounts. */
if (typeof window !== 'undefined' && typeof window.__audioMuted === 'undefined') {
  window.__audioMuted = readMuted();
}

export default function AudioMuteToggle() {
  const { lang } = useLanguage();
  const [muted, setMuted] = useState(() => readMuted());

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(MUTE_KEY, next ? '1' : '0');
      } catch {
        /* localStorage unavailable — silently fail */
      }
      window.__audioMuted = next;
      /* Muting should also silence anything already playing. */
      if (next) {
        try { window.__stopAmbient?.(); } catch {}
        try { window.__stopJoin?.(); } catch {}
      }
      return next;
    });
  }, []);

  const label = muted
    ? (lang === 'mr' ? 'आवाज सुरू करा' : 'Unmute audio')
    : (lang === 'mr' ? 'आवाज बंद करा' : 'Mute audio');

  return (
    <button
      type="button"
      className={`audio-mute ${muted ? 'is-muted' : ''}`}
      aria-label={label}
      aria-pressed={muted}
      title={label}
      onClick={toggle}
    >
      {muted ? <MutedIcon /> : <SoundIcon />}
    </button>
  );
}

/* Speaker with sound waves (audio on) */
function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/* Speaker with an X (audio muted) */
function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}
