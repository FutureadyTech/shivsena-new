import { useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════
 HOME BANNER AUDIO strictly one-shot.

 Rules:
 • Audio plays ONCE per page load, the first time the homepage
 banner (#home-hero-banner) enters the viewport.
 • Plays through, then is destroyed. Will NOT replay if the user
 scrolls back to the banner, navigates away and returns, or
 re-mounts the component for any reason.
 • If the banner exits the viewport mid-playback (user scrolls
 past), the audio is stopped and considered "consumed" no
 resume on scroll-back.
 • Lives in module scope so React StrictMode double-mounts and
 route transitions never duplicate playback.
 • Page refresh resets the lifecycle that's a fresh page load.
═══════════════════════════════════════════════════════════════ */

const AUDIO_SRC = '/ambient.mp3';
const VOLUME = 0.5;
const BANNER_ID = 'home-hero-banner';

/* ── Module-level state machine ─────────────────────────────────
 'IDLE' → waiting for banner to enter viewport
 'PLAYING' → audio is actively playing
 'DONE' → played once; permanent, never plays again this load
─────────────────────────────────────────────────────────────── */
let state = 'IDLE';
let audioEl = null;
let pendingGestureCleanup = null;

function clearPendingGesture() {
  if (pendingGestureCleanup) {
 pendingGestureCleanup();
 pendingGestureCleanup = null;
  }
}

/* Hard terminal for the AMBIENT track only: stop playback, release
 the audio element, mark permanent DONE.

 join.mp3 is NOT touched here calling this on ambient end / scroll
 shouldn't auto-kill the click stinger. The join stinger is stopped
 by its own dedicated helper, only when the banner actually exits
 the viewport (see the IntersectionObserver branch below). */
function markDone() {
  if (state === 'DONE') return;
  state = 'DONE';
  clearPendingGesture();
  if (audioEl) {
 try { audioEl.pause(); } catch {}
 try { audioEl.src = ''; } catch {}
 audioEl = null;
  }
}

/* Ask WelcomeBanner's module-level state to stop the join stinger
 if one is still playing. Lightweight cross-module link via
 window.__stopJoin (set by WelcomeBanner on its own module load). */
function stopJoinStinger() {
  if (typeof window !== 'undefined' && typeof window.__stopJoin === 'function') {
 try { window.__stopJoin(); } catch {}
  }
}

/* Expose ambient stop so the App-level route watcher can kill it
 on real navigation (its own useLocation inside this component
 can't fire before React unmounts the component on route change). */
if (typeof window !== 'undefined') {
  window.__stopAmbient = () => {
 if (state === 'PLAYING') markDone();
  };
}

function getAudio() {
  if (audioEl) return audioEl;
  audioEl = new Audio(AUDIO_SRC);
  audioEl.loop = false; // one-shot no looping
  audioEl.volume = VOLUME;
  audioEl.preload = 'auto';
  /* When the track ends naturally, retire it. */
  audioEl.addEventListener('ended', markDone, { once: true });
  return audioEl;
}

/* If autoplay is blocked, wait for the user's next gesture and
 try once. Only retries while we're still in IDLE state. */
function armGestureRetry() {
  const events = ['pointerdown', 'click', 'touchstart', 'keydown'];
  const onGesture = () => {
 clearPendingGesture();
 if (state !== 'IDLE') return;
 /* Only retry if the banner is still in view; otherwise the
 moment has passed mark done so we don't play "later". */
 const banner = document.getElementById(BANNER_ID);
 if (!banner) { markDone(); return; }
 const rect = banner.getBoundingClientRect();
 const inView = rect.top < window.innerHeight && rect.bottom > 0;
 if (!inView) { markDone(); return; }
 startPlay();
  };
  events.forEach((ev) =>
 window.addEventListener(ev, onGesture, { once: true, passive: true })
  );
  pendingGestureCleanup = () => {
 events.forEach((ev) => window.removeEventListener(ev, onGesture));
  };
}

function startPlay() {
  if (state !== 'IDLE') return;
  /* User has muted the intro audio (header toggle) — skip playback. */
  if (typeof window !== 'undefined' && window.__audioMuted) return;
  state = 'PLAYING';
  const audio = getAudio();
  const p = audio.play();
  if (p && typeof p.catch === 'function') {
 p.catch(() => {
 /* Autoplay blocked. Roll back to IDLE and wait for a gesture. */
 state = 'IDLE';
 armGestureRetry();
 });
  }
}

/* ── React wrapper ──────────────────────────────────────────── */
export default function HomeBannerAudio() {
  /* No in-component route watcher by the time React commits a
 route change, this component is being unmounted in the same
 pass so its useEffect can't run. Real-navigation stops are
 handled at App level (see HomeAudioRouteGuard in App.jsx),
 which always stays mounted. */
  useEffect(() => {
 if (state === 'DONE') return; // already consumed do nothing

 let observer = null;
 let cancelled = false;

 const attach = () => {
 if (cancelled || state === 'DONE') return;
 const banner = document.getElementById(BANNER_ID);
 if (!banner) {
 requestAnimationFrame(attach);
 return;
 }
 observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) {
 /* Banner is visible start ambient if we haven't yet.
 If state is DONE we deliberately do nothing no
 replay on scroll-back. */
 if (state === 'IDLE') startPlay();
 return;
 }
 /* Banner just exited the viewport kill BOTH the ambient
 bed (if still playing) AND the join stinger (if still
 ringing). Per spec, both are tied to the banner being
 visible. */
 if (state === 'PLAYING') markDone();
 stopJoinStinger();
 observer.disconnect();
 },
 { threshold: 0, rootMargin: '0px 0px -10% 0px' }
 );
 observer.observe(banner);
 };

 attach();

 return () => {
 cancelled = true;
 if (observer) observer.disconnect();
 /* Route change while ambient still playing → stop and retire
 permanently. The DONE state survives this unmount, so a
 later re-mount (user navigates back to /home) does nothing.
 join.mp3 is intentionally NOT touched here it plays to its
 own natural end via the `ended` listener in WelcomeBanner. */
 if (state === 'PLAYING') markDone();
 };
  }, []);

  return null;
}
