import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor dot (instant) + ring (lagging spring).
 * Reads `data-cursor` attribute on any ancestor of the hovered element
 * to switch variants ('default', 'link', 'magnetic').
 *
 * Skips entirely on touch / no-hover devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [variant, setVariant] = useState('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
 if (!window.matchMedia('(hover: hover)').matches) return;

 let rafId;
 let dotX = -100, dotY = -100;
 let ringX = -100, ringY = -100;
 let targetX = -100, targetY = -100;

 const tick = () => {
 // Dot: snappy (small lerp for smoothness, almost direct)
 dotX += (targetX - dotX) * 0.6;
 dotY += (targetY - dotY) * 0.6;
 // Ring: lagging spring for that cinematic trail
 ringX += (targetX - ringX) * 0.16;
 ringY += (targetY - ringY) * 0.16;

 if (dotRef.current) {
 dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
 }
 if (ringRef.current) {
 ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
 }
 rafId = requestAnimationFrame(tick);
 };

 const onMouseMove = (e) => {
 targetX = e.clientX;
 targetY = e.clientY;
 if (!visible) setVisible(true);
 };

 const onMouseOver = (e) => {
 const host = e.target.closest?.('[data-cursor]');
 const v = host?.dataset?.cursor || 'default';
 setVariant(v);
 };

 const onMouseLeaveWindow = () => setVisible(false);
 const onMouseEnterWindow = () => setVisible(true);

 window.addEventListener('mousemove', onMouseMove);
 document.addEventListener('mouseover', onMouseOver);
 document.addEventListener('mouseleave', onMouseLeaveWindow);
 document.addEventListener('mouseenter', onMouseEnterWindow);

 document.body.classList.add('has-custom-cursor');
 rafId = requestAnimationFrame(tick);

 return () => {
 cancelAnimationFrame(rafId);
 window.removeEventListener('mousemove', onMouseMove);
 document.removeEventListener('mouseover', onMouseOver);
 document.removeEventListener('mouseleave', onMouseLeaveWindow);
 document.removeEventListener('mouseenter', onMouseEnterWindow);
 document.body.classList.remove('has-custom-cursor');
 };
  }, [visible]);

  return (
 <>
 <div
 ref={dotRef}
 className={`cursor-dot cursor-dot--${variant} ${visible ? 'is-visible' : ''}`}
 aria-hidden="true"
 />
 <div
 ref={ringRef}
 className={`cursor-ring cursor-ring--${variant} ${visible ? 'is-visible' : ''}`}
 aria-hidden="true"
 />
 </>
  );
}
