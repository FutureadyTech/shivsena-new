import { useContent } from '../../../content/_shared/useContent.js';
import aboutContent from '../../../content/about.json';
import './AboutBanner.css';

export default function AboutBanner() {
  const t = useContent(aboutContent.banner);

  return (
    <section className="about-banner">
      <div
        className="about-banner__image"
        style={{ backgroundImage: 'url(/banners/aboutUs.webp)' }}
        aria-hidden="true"
      />

      <div className="ov-base" />
      <div className="ov-pattern" />
      <div className="ov-spotlight" />
      <div className="ov-light-tl" />
      <div className="ov-light-br" />
      <div className="ov-top" />
      <div className="ov-bottom" />

      <div className="about-banner__content">
        <p className="about-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="about-banner__title">{t.title}</h1>
        <div className="about-banner__divider" aria-hidden="true" />
        <p className="about-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
