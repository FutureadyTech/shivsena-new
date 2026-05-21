import './home.css';
import { useContent } from '../../content/_shared/useContent.js';
import homeContent from '../../content/home.json';

export default function Hero() {
  const t = useContent(homeContent.hero);

  return (
    <section className="hero-section">

      <video autoPlay muted loop playsInline preload="auto" className="hero-video">
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
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
        <h1 className="hero-main-title">{t.title}</h1>
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
