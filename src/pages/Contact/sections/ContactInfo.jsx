import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import contactContent from '../../../content/contact.json';
import './ContactInfo.css';

const ICONS = {
  pin: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4 Q9 4 9 11 Q9 18 16 28 Q23 18 23 11 Q23 4 16 4 Z" />
      <circle cx="16" cy="11" r="3.2" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="5" width="18" height="22" rx="1.5" />
      <line x1="11" y1="10" x2="14" y2="10" /><line x1="18" y1="10" x2="21" y2="10" />
      <line x1="11" y1="14" x2="14" y2="14" /><line x1="18" y1="14" x2="21" y2="14" />
      <line x1="11" y1="18" x2="14" y2="18" /><line x1="18" y1="18" x2="21" y2="18" />
      <rect x="14" y="22" width="4" height="5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M27 22 V26 Q27 28 25 28 Q14 28 6 16 Q6 5 8 5 H12 L14 11 L11 14 Q14 19 18 22 L21 19 L27 22 Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="8" width="24" height="18" rx="2" />
      <path d="M4 10 L16 19 L28 10" />
    </svg>
  ),
};

export default function ContactInfo() {
  const t = useContent(contactContent.info);
  const headerRef = useScrollReveal(0.2);

  return (
    <section className="ci-section">
      <div className="ci-section__inner">

        <div ref={headerRef} className="ci-section__header reveal">
          <div className="ci-section__eyebrow">
            <span className="ci-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="ci-section__title">{t.title}</h2>
          <p className="ci-section__lede">{t.lede}</p>
        </div>

        <div className="ci-grid">
          {t.cards?.map((card, i) => (
            <ContactCard key={card.id} card={card} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ContactCard({ card, index }) {
  const ref = useScrollReveal(0.15);
  const icon = ICONS[card.icon] ?? ICONS.pin;
  const external = card.linkHref && !card.linkHref.startsWith('mailto:') && !card.linkHref.startsWith('tel:');

  return (
    <article
      ref={ref}
      className="ci-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 4) * 0.07}s` }}
    >
      <div className="ci-card__icon" aria-hidden="true">{icon}</div>
      <span className="ci-card__tag">{card.tag}</span>
      <h3 className="ci-card__title">{card.title}</h3>
      <div className="ci-card__lines">
        {card.lines.map((line, j) => <p key={j} className="ci-card__line">{line}</p>)}
      </div>
      {card.linkHref && (
        <a
          href={card.linkHref}
          className="ci-card__link"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          data-cursor="link"
        >
          {card.linkLabel}
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      )}
    </article>
  );
}
