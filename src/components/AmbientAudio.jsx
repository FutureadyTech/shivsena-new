import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const FULL_VOLUME = 0.5;
const FADE_MS = 600;
/* How far the user has to scroll down on /home before the audio mutes.
 ~half the viewport feels natural past the hero, into content. */
const SCROLL_MUTE_PX = () => window.innerHeight * 0.5;

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

/**
 * Global ambient audio controller.
 *
 * Hard rules:
 *  - Audio plays ONLY on /home. On every other route it's paused.
 *  - On /home, the audio fades to 0 once the user scrolls past the hero,
 * and fades back when they scroll back up.
 *  - The Entrance ('/') page handles its own audio kickoff via the
 * WelcomeBanner "Enter" button (which sets window.__ambientAudio).
 * This component only governs playback state from that point on.
 */
export default function AmbientAudio() {
  const { pathname } = useLocation();
  const faderRef = useRef(null);
  if (!faderRef.current) faderRef.current = makeFader();

  useEffect(() => {
 /* ── On routes OTHER than /home: pause audio if it exists ── */
 if (pathname !== '/home') {
 const audio = window.__ambientAudio;
 if (audio && !audio.paused) {
 /* Fade quickly to 0, then pause so it's a clean stop. */
 faderRef.current(audio, 0, 300);
 setTimeout(() => {
 if (audio && !audio.paused) audio.pause();
 }, 350);
 }
 return;
 }

 /* ── On /home: ensure audio is alive + playing ── */
 const ensurePlaying = () => {
 let audio = window.__ambientAudio;
 if (!audio) {
 /* No global instance yet (user landed directly on /home).
 Create one and try muted-autoplay (browser-allowed),
 then unmute on first interaction. */
 audio = new Audio('/ambient.mp3');
 audio.loop = true;
 audio.volume = FULL_VOLUME;
 audio.preload = 'auto';
 audio.muted = true;

 audio.play()
 .then(() => {
 window.__ambientAudio = audio;
 armUnmuteOnGesture(audio);
 })
 .catch(() => {
 /* Even muted autoplay blocked wait for first gesture to play. */
 armPlayOnGesture(audio);
 });
 return;
 }

 /* Existing instance make sure it's audible + resuming. */
 audio.muted = false;
 if (audio.volume === 0) audio.volume = FULL_VOLUME;
 if (audio.paused) {
 audio.play().catch(() => {
 /* Resume might be blocked if user hasn't interacted yet on this
 session arm a one-shot gesture listener to try again. */
 armPlayOnGesture(audio);
 });
 }
 };

 let cleanupListeners = () => {};
 const INTERACTION_EVENTS = ['pointerdown', 'click', 'touchstart', 'keydown', 'mousemove', 'scroll', 'wheel'];

 function armUnmuteOnGesture(audio) {
 const handler = () => {
 audio.muted = false;
 cleanupListeners();
 };
 INTERACTION_EVENTS.forEach((ev) =>
 window.addEventListener(ev, handler, { once: true, passive: true })
 );
 cleanupListeners = () => INTERACTION_EVENTS.forEach((ev) =>
 window.removeEventListener(ev, handler)
 );
 }
 function armPlayOnGesture(audio) {
 const handler = () => {
 audio.muted = false;
 audio.play()
 .then(() => { window.__ambientAudio = audio; })
 .catch(() => {});
 cleanupListeners();
 };
 INTERACTION_EVENTS.forEach((ev) =>
 window.addEventListener(ev, handler, { once: true, passive: true })
 );
 cleanupListeners = () => INTERACTION_EVENTS.forEach((ev) =>
 window.removeEventListener(ev, handler)
 );
 }

 ensurePlaying();

 /* ── Scroll-mute: fade to 0 once user scrolls past the hero ── */
 let lastMuted = null;
 const onScroll = () => {
 const audio = window.__ambientAudio;
 if (!audio) return;
 const shouldMute = window.scrollY > SCROLL_MUTE_PX();
 if (shouldMute === lastMuted) return;
 lastMuted = shouldMute;
 faderRef.current(audio, shouldMute ? 0 : FULL_VOLUME);
 };
 /* Run once on mount so the volume matches current scroll position. */
 onScroll();
 window.addEventListener('scroll', onScroll, { passive: true });

 return () => {
 window.removeEventListener('scroll', onScroll);
 cleanupListeners();
 };
  }, [pathname]);

  return null;
}
