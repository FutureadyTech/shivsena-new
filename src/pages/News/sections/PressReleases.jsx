import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import './PressReleases.css';

export default function PressReleases() {
  const t = useContent(newsContent.pressReleases);
  const headerRef = useScrollReveal(0.2);

  return (
    <section className="pr-section">
      <div className="pr-section__inner">

        <div ref={headerRef} className="pr-section__header reveal">
          <div className="pr-section__eyebrow">
            <span className="pr-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="pr-section__title">{t.title}</h2>
          <p className="pr-section__lede">{t.lede}</p>
        </div>

        <div className="pr-section__grid">
          {t.items?.map((item, i) => (
            <PressCard key={item.id} item={item} ctaLabel={t.readMoreLabel} index={i} />
          ))}
        </div>

        <div className="pr-section__viewall">
          <a href="#" className="pr-section__viewall-btn" data-cursor="link">
            {t.viewAllLabel}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}

function PressCard({ item, ctaLabel, index }) {
  const ref = useScrollReveal(0.15);
  return (
    <article
      ref={ref}
      className="pr-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.08}s` }}
      data-cursor="link"
    >
      <div className="pr-card__media">
        <img src={item.image} alt="" className="pr-card__img" loading="lazy" />
        <span className="pr-card__category">{item.category}</span>
      </div>
      <div className="pr-card__body">
        <time className="pr-card__date">{item.date}</time>
        <h3 className="pr-card__title">{item.title}</h3>
        <p className="pr-card__excerpt">{item.excerpt}</p>
        <a href="#" className="pr-card__cta" data-cursor="link">
          {ctaLabel}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </article>
  );
}
