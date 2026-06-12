import { useEffect, useState } from 'react';
import WelcomeBanner from './WelcomeBanner.jsx';

/**
 * HeroExperience static entrance banner + welcome CTAs.
 *
 * Earlier this mounted a 1,889-line Three.js scene (palace pillars,
 * walls, throne, god-rays, dust motes, scroll-driven camera, etc.).
 * The brief is now just a single hero image (entrance-banner-v2.webp)
 * + the language CTAs from WelcomeBanner — so the entire 3D stack
 * has been removed. Faster initial paint, no WebGL context, no
 * texture generation on the main thread, and no glitchy loader
 * (because there's nothing left to load).
 */
export default function HeroExperience() {
  /* Hold the loader on screen for a beat before fading it out, so
     the spinner reads as an intentional boot moment instead of a
     flash. The .hidden class then triggers the 1.2s opacity
     transition defined in entrance.css. */
  useEffect(() => {
    const id = setTimeout(() => {
      const el = document.getElementById('loader');
      if (el) el.classList.add('hidden');
    }, 1600);
    return () => clearTimeout(id);
  }, []);

  /* Mobile: show a static banner image instead of the (heavy) looping
     video so phones don't download / decode the clip. */
  const mq = '(max-width: 768px)';
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(mq).matches
  );
  useEffect(() => {
    const m = window.matchMedia(mq);
    const onChange = (e) => setIsMobile(e.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      {/* Full-bleed entrance banner — looping muted video, no controls.
          No `poster`: a looping <video> repaints its poster for one frame
          on every loop, which read as a glitch since the poster still
          differs from the clip's first frame. The dark .vestibule-cover
          background covers the brief moment before the clip loads. */}
      <div className="vestibule-cover" id="vestibule-cover" aria-hidden="true">
        {isMobile ? (
          <img
            src="/entrance/entrance-banner-mobile.webp"
            alt=""
            className="vestibule-banner-mobile"
          />
        ) : (
          <video
            src="/entrance/Flag-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
          />
        )}
      </div>

      {/* Subtle ambient overlays kept for visual polish (no JS). */}
      <div className="vignette"></div>
      <div className="grain"></div>

      <WelcomeBanner />
    </>
  );
}
