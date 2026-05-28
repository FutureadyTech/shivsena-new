import { useEffect, useRef } from 'react';
import './home.css';
import { useContent } from '../../content/_shared/useContent.js';
import homeContent from '../../content/home.json';

export default function Hero() {
  const t = useContent(homeContent.hero);
  const videoRef = useRef(null);

  /* Resilient playback:
     1. Force re-play if the browser pauses the video (tab blur, low
        battery, throttling) by re-issuing play() on the `pause` event.
     2. On the `seeked` event near the end, hint the decoder to keep
        going — this masks any tiny hitch at the loop seam.
     3. Skip on prefers-reduced-motion users — let the browser default. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    const onPause = () => {
      // Only auto-resume if the pause wasn't user-initiated (no native
      // controls are exposed, so any pause is from the browser itself).
      if (!v.ended) tryPlay();
    };

    v.addEventListener('pause', onPause);
    tryPlay();

    return () => {
      v.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <section className="hero-section">

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className="hero-video"
        tabIndex={-1}
      >
        <source src="/videos/homepage-banner-sena.mp4" type="video/mp4" />
      </video>

      <div className="ov-base" />
      <div className="ov-pattern" />
      <div className="ov-spotlight" />
      <div className="ov-light-tl" />
      <div className="ov-light-br" />
      <div className="ov-top" />
      <div className="ov-bottom" />

      <div className="hero-content">
        <p className="hero-tagline">{t.eyebrow}</p>
        <h1 className="hero-main-title">
          <img
            src="/Logo/sena-logo.webp"
            alt={t.title}
            className="hero-main-title__img"
          />
        </h1>
        <p className="hero-para">{t.subtitle}</p>
        <div className="hero-ctas">
          <a href="#join" className="hero-cta-btn" data-cursor="link">
            {t.ctaPrimary}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a href="/about" className="hero-cta-btn hero-cta-btn--ghost" data-cursor="link">
            {t.ctaSecondary}
          </a>
        </div>
      </div>

    </section>
  );
}
