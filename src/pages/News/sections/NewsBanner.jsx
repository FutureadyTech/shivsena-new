import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import './NewsBanner.css';

export default function NewsBanner() {
  const t = useContent(newsContent.banner);

  return (
    <section className="news-banner">
      <div
        className="news-banner__image"
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

      <div className="news-banner__content">
        <p className="news-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="news-banner__title">{t.title}</h1>
        <div className="news-banner__divider" aria-hidden="true" />
        <p className="news-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
