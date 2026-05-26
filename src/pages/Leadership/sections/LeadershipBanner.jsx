import { useContent } from '../../../content/_shared/useContent.js';
import leadershipContent from '../../../content/leadership.json';
import './LeadershipBanner.css';

export default function LeadershipBanner() {
  const t = useContent(leadershipContent.banner);

  return (
    <section className="ldr-banner">
      <div
        className="ldr-banner__image"
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

      <div className="ldr-banner__content">
        <p className="ldr-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="ldr-banner__title">{t.title}</h1>
        <div className="ldr-banner__divider" aria-hidden="true" />
        <p className="ldr-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
