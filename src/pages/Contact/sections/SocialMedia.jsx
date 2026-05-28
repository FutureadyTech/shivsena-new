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
    <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418A2.506 2.506 0 0 0 2.418 6.186C2 7.746 2 12 2 12s0 4.254.418 5.814a2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L16 12l-6 3.464z"/>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.02 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.86-7.01zm-7.03 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.15.17-.29.18-.54.06-.25-.12-1.05-.39-2-1.23a7.51 7.51 0 0 1-1.39-1.72c-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31s-.86.84-.86 2.05c0 1.21.88 2.38 1 2.55.12.17 1.73 2.65 4.2 3.72.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/>
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
      <span className="sm-card__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  );
}
