/**
 * SoundToggle pure UI button. Audio logic is in useAmbientAudio hook,
 * which is invoked by the parent page that wants ambient sound.
 *
 * The parent passes `enabled` (current state) and `onToggle` (handler).
 */
export default function SoundToggle({ enabled, onToggle }) {
  return (
 <button
 className="icon-btn"
 onClick={onToggle}
 aria-label="Toggle ambient sound"
 style={{ color: enabled ? '#FFB26B' : undefined }}
 >
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="22" height="22">
 <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
 <path d="M15.54 8.46a5 5 0 0 1 0 7.07" opacity={enabled ? 1 : 0.3} />
 <path d="M19.07 4.93a10 10 0 0 1 0 14.14" opacity={enabled ? 1 : 0.3} />
 </svg>
 </button>
  );
}
