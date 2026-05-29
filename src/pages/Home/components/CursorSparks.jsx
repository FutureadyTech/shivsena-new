import { useEffect } from 'react';

/**
 * Subtle fire sparkles that follow the cursor.
 *
 * Design choices:
 *  - DOM manipulation (not React state) much faster for ephemeral effects
 *  - Throttled by both movement distance + time, so slow cursor = no clutter,
 * fast cursor = nice trail
 *  - Pure CSS animation (transform + opacity only) → GPU-composited
 *  - Auto-cleans elements after animation ends
 *  - Skips on touch devices + reduced-motion preference
 */
export default function CursorSparks() {
  useEffect(() => {
 if (!window.matchMedia('(hover: hover)').matches) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

 // Mount a dedicated layer so we don't pollute the body with floating divs
 const layer = document.createElement('div');
 layer.className = 'spark-layer';
 document.body.appendChild(layer);

 let lastX = -100;
 let lastY = -100;
 let lastSpawn = 0;

 const MIN_DISTANCE = 14; // require ~14px movement between sparks
 const MIN_INTERVAL = 38; // ~26 sparks/sec max while moving fast
 const LIFETIME = 850; // ms per spark

 const spawn = (x, y) => {
 const spark = document.createElement('span');
 spark.className = 'spark';

 const size = 4 + Math.random() * 5; // 4–9px
 const driftX = (Math.random() - 0.5) * 24; // -12 to +12
 const driftY = -(14 + Math.random() * 16); // -14 to -30 (always rising)
 const rot = (Math.random() - 0.5) * 120; // -60° to +60°

 spark.style.left = `${x}px`;
 spark.style.top = `${y}px`;
 spark.style.width = `${size}px`;
 spark.style.height = `${size}px`;
 spark.style.setProperty('--drift-x', `${driftX}px`);
 spark.style.setProperty('--drift-y', `${driftY}px`);
 spark.style.setProperty('--rot', `${rot}deg`);

 layer.appendChild(spark);
 setTimeout(() => spark.remove(), LIFETIME);
 };

 const onMouseMove = (e) => {
 const now = performance.now();
 const dx = e.clientX - lastX;
 const dy = e.clientY - lastY;
 const distance = Math.hypot(dx, dy);

 if (distance < MIN_DISTANCE) return;
 if (now - lastSpawn < MIN_INTERVAL) return;

 lastX = e.clientX;
 lastY = e.clientY;
 lastSpawn = now;

 spawn(e.clientX, e.clientY);
 };

 window.addEventListener('mousemove', onMouseMove, { passive: true });

 return () => {
 window.removeEventListener('mousemove', onMouseMove);
 layer.remove();
 };
  }, []);

  return null;
}
