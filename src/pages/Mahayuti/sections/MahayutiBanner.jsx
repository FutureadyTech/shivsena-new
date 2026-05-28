import { useContent } from '../../../content/_shared/useContent.js';
import mahayutiContent from '../../../content/mahayuti.json';
import './MahayutiBanner.css';

export default function MahayutiBanner() {
  const t = useContent(mahayutiContent.banner);

  return (
    <section className="my-banner">
      <div
        className="my-banner__image"
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

      <div className="my-banner__content">
        <p className="my-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="my-banner__title">{t.title}</h1>
        <div className="my-banner__divider" aria-hidden="true" />
        <p className="my-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
