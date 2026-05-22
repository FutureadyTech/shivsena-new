import { useEffect, useRef } from 'react';
import { useContent } from '../../../content/_shared/useContent.js';
import contactContent from '../../../content/contact.json';
import './ContactBanner.css';

export default function ContactBanner() {
  const t = useContent(contactContent.banner);
  const imageRef = useRef(null);

  /* Parallax: shift image based on scroll while banner is in view */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let rafId = 0;
    const update = () => {
      rafId = 0;
      const el = imageRef.current;
      if (!el) return;
      const offset = window.scrollY * 0.35;
      el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
    };
    const onScroll = () => { if (!rafId) rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="contact-banner">
      <div
        ref={imageRef}
        className="contact-banner__image"
        style={{ backgroundImage: 'url(/img-1.jpg)' }}
        aria-hidden="true"
      />

      <div className="ov-base" />
      <div className="ov-pattern" />
      <div className="ov-spotlight" />
      <div className="ov-light-tl" />
      <div className="ov-light-br" />
      <div className="ov-top" />
      <div className="ov-bottom" />

      <div className="contact-banner__content">
        <p className="contact-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="contact-banner__title">{t.title}</h1>
        <div className="contact-banner__divider" aria-hidden="true" />
        <p className="contact-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
