import { useContent } from '../../../content/_shared/useContent.js';
import shivsenajanmaContent from '../../../content/shivsenajanma.json';
import './ShivSenaJanmaBanner.css';

export default function ShivSenaJanmaBanner() {
  const t = useContent(shivsenajanmaContent.banner);

  return (
    <section className="ssj-banner">
      <div
        className="ssj-banner__image"
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

      <div className="ssj-banner__content">
        <p className="ssj-banner__eyebrow">{t.eyebrow}</p>
        <h1 className="ssj-banner__title">{t.title}</h1>
        <div className="ssj-banner__divider" aria-hidden="true" />
        <p className="ssj-banner__lede">{t.subtitle}</p>
      </div>
    </section>
  );
}
