import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import contactContent from '../../../content/contact.json';
import './SocialMedia.css';

const SOCIAL_ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.27c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 22 12z"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.79l-5.31-6.94L4.78 22H1.52l8.02-9.17L1 2h6.95l4.8 6.34L18.244 2zm-2.38 18h1.88L7.27 4H5.26l10.6 16z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12a11.34 11.34 0 0 0-.18-2.07 2.88 2.88 0 0 0-2-2c-1.78-.46-8.82-.46-8.82-.46s-7.04 0-8.82.46a2.88 2.88 0 0 0-2 2A11.34 11.34 0 0 0 1 12a11.34 11.34 0 0 0 .18 2.07 2.88 2.88 0 0 0 2 2c1.78.46 8.82.46 8.82.46s7.04 0 8.82-.46a2.88 2.88 0 0 0 2-2A11.34 11.34 0 0 0 23 12zM9.75 15.5v-7l5.85 3.5z"/>
    </svg>
  ),
};

export default function SocialMedia() {
  const t = useContent(contactContent.social);
  const headerRef = useScrollReveal(0.2);

  return (
    <section className="sm-section">
      <div className="sm-section__inner">

        <div ref={headerRef} className="sm-section__header reveal">
          <div className="sm-section__eyebrow">
            <span className="sm-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="sm-section__title">{t.title}</h2>
          <p className="sm-section__lede">{t.lede}</p>
        </div>

        <div className="sm-grid">
          {t.items?.map((item, i) => (
            <SocialCard key={item.id} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function SocialCard({ item, index }) {
  const ref = useScrollReveal(0.15);
  const icon = SOCIAL_ICONS[item.id];

  return (
    <a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`sm-card sm-card--${item.id} reveal`}
      style={{ '--reveal-delay': `${0.05 + (index % 4) * 0.06}s` }}
      data-cursor="link"
      aria-label={item.name}
    >
      <span className="sm-card__icon" aria-hidden="true">{icon}</span>
      <span className="sm-card__name">{item.name}</span>
      <span className="sm-card__handle">{item.handle}</span>
      <span className="sm-card__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  );
}
