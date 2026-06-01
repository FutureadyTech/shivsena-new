import { useContent } from '../../../content/_shared/useContent.js';
import innovativeContent from '../../../content/innovative.json';
import './InnovativeBanner.css';

export default function InnovativeBanner() {
  const t = useContent(innovativeContent.banner);

  return (
    <section className="inn-banner">
      <div
        className="inn-banner__image"
        style={{ backgroundImage: 'url(/banners/InnovativeInitiatives.webp)' }}
        aria-hidden="true"
      />

      <div className="ov-base" />
      <div className="ov-pattern" />
      <div className="ov-spotlight" />
      <div className="ov-light-tl" />
      <div className="ov-light-br" />
      <div className="ov-top" />
      <div className="ov-bottom" />

      <div className="inn-banner__content">
        <p className="inn-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="inn-banner__title">{t.title}</h1>
        <div className="inn-banner__divider" aria-hidden="true" />
        <p className="inn-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
