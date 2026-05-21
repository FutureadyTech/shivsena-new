import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth-scroll hook. Mount it on a page (not at app root) so it only
 * runs on routes that want premium scroll behavior. Cleanup is automatic.
 *
 * Used on /home (and future main-site routes). Entrance stays on native scroll.
 */
export function useLenis(options = {}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      ...options,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose globally so anchor handlers / future scrollTo() calls can use it
    window.__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}
