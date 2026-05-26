import { useContent } from '../../../content/_shared/useContent.js';
import declarationsContent from '../../../content/declarations.json';
import './DeclarationsBanner.css';

export default function DeclarationsBanner() {
  const t = useContent(declarationsContent.banner);

  return (
    <section className="decl-banner">
      <div
        className="decl-banner__image"
        style={{ backgroundImage: 'url(/img-2.webp)' }}
        aria-hidden="true"
      />

      <div className="ov-base" />
      <div className="ov-pattern" />
      <div className="ov-spotlight" />
      <div className="ov-light-tl" />
      <div className="ov-light-br" />
      <div className="ov-top" />
      <div className="ov-bottom" />

      <div className="decl-banner__content">
        <div className="decl-banner__mark" aria-hidden="true">
          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Scroll / document mark — represents an official filing */}
            <path d="M20 14 H56 L62 20 V64 A4 4 0 0 1 58 68 H22 A4 4 0 0 1 18 64 V18 A4 4 0 0 1 20 14 Z" />
            <path d="M56 14 V20 H62" />
            <line x1="26" y1="30" x2="54" y2="30" />
            <line x1="26" y1="38" x2="54" y2="38" />
            <line x1="26" y1="46" x2="46" y2="46" />
            <path d="M30 56 L36 62 L52 46" strokeWidth="2" />
          </svg>
        </div>

        <p className="decl-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="decl-banner__title">{t.title}</h1>
        <div className="decl-banner__divider" aria-hidden="true" />
        <p className="decl-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
