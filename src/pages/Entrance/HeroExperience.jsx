import { useEffect } from 'react';
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

  return (
    <>
      {/* Full-bleed static entrance banner. */}
      <div className="vestibule-cover" id="vestibule-cover" aria-hidden="true">
        <img src="/entrance-banner-v2.webp" alt="" />
      </div>

      {/* Subtle ambient overlays kept for visual polish (no JS). */}
      <div className="vignette"></div>
      <div className="grain"></div>

      <WelcomeBanner />
    </>
  );
}
