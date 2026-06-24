/* ═══════════════════════════════════════════════════════════════
   AUDIO PLAY / PAUSE BUTTON

   A thin view over the HomeAudioProvider context: the icon is driven
   purely by `isPlaying`, so it always matches the real audio. Renders
   nothing if used outside the provider (i.e. off the home page).
═══════════════════════════════════════════════════════════════ */
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { useHomeAudio } from '../pages/Home/HomeAudioProvider.jsx';
import './AudioMuteToggle.css';

export default function AudioMuteToggle({ className = '' }) {
  const { lang } = useLanguage();
  const audio = useHomeAudio();
  if (!audio) return null; // outside the home audio provider

  const { isPlaying, toggle } = audio;
  const label = isPlaying
    ? (lang === 'mr' ? 'आवाज बंद करा' : 'Pause audio')
    : (lang === 'mr' ? 'आवाज सुरू करा' : 'Play audio');

  return (
    <button
      type="button"
      className={`audio-mute ${isPlaying ? '' : 'is-muted'} ${className}`.trim()}
      aria-label={label}
      aria-pressed={!isPlaying}
      title={label}
      onClick={toggle}
    >
      {isPlaying ? <SoundIcon /> : <MutedIcon />}
    </button>
  );
}

/* Speaker with sound waves (audio playing) */
function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/* Speaker with an X (audio paused) */
function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}
