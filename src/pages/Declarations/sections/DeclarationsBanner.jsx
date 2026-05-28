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
        <p className="decl-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="decl-banner__title">{t.title}</h1>
        <div className="decl-banner__divider" aria-hidden="true" />
        <p className="decl-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
