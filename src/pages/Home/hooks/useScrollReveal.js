import { useEffect, useRef } from 'react';

/**
 * Reveal trigger for scroll-into-view animations.
 * Adds `.is-revealed` class to the element once it crosses the threshold.
 * Fires once, then unobserves (no re-trigger on scroll back up).
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="my-element">...</div>
 *
 * Then in CSS:
 *   .my-element { opacity: 0; transform: translateY(40px); transition: ...; }
 *   .my-element.is-revealed { opacity: 1; transform: none; }
 */
export function useScrollReveal(threshold = 0.15, rootMargin = '0px 0px -80px 0px') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion users: reveal immediately, no observer needed
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}
