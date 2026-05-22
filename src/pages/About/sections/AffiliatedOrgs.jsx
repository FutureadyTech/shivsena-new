import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import aboutContent from '../../../content/about.json';
import './AffiliatedOrgs.css';

const ORG_ICONS = {
  bks:       <PathIcon><path d="M16 4 L4 10 V20 L16 26 L28 20 V10 Z" /><path d="M4 10 L16 16 L28 10" /><path d="M16 16 V26" /></PathIcon>,
  sls:       <PathIcon><circle cx="16" cy="11" r="5" /><path d="M5 27 Q5 18 16 18 Q27 18 27 27" /></PathIcon>,
  yuva:      <PathIcon><path d="M16 5 L19 12 L26 12 L20 17 L22 25 L16 20 L10 25 L12 17 L6 12 L13 12 Z" /></PathIcon>,
  bvs:       <PathIcon><path d="M3 11 L16 5 L29 11 L16 17 Z" /><path d="M8 13 V21 Q16 26 24 21 V13" /><line x1="29" y1="11" x2="29" y2="20" /></PathIcon>,
  mahila:    <PathIcon><circle cx="16" cy="11" r="6" /><path d="M16 17 V27" /><path d="M10 22 H22" /></PathIcon>,
  udyog:     <PathIcon><rect x="4" y="11" width="24" height="16" rx="2" /><path d="M11 11 V7 Q11 5 13 5 H19 Q21 5 21 7 V11" /><line x1="4" y1="18" x2="28" y2="18" /></PathIcon>,
  shikshak:  <PathIcon><path d="M3 11 L16 5 L29 11 L16 17 Z" /><path d="M22 14 V22" /><circle cx="22" cy="23" r="1.5" /></PathIcon>,
  chitrapat: <PathIcon><rect x="4" y="7" width="24" height="18" rx="1.5" /><line x1="4" y1="12" x2="28" y2="12" /><line x1="4" y1="20" x2="28" y2="20" /><circle cx="8" cy="9.5" r="0.8" /><circle cx="12" cy="9.5" r="0.8" /><circle cx="20" cy="9.5" r="0.8" /><circle cx="24" cy="9.5" r="0.8" /></PathIcon>,
  arogya:    <PathIcon><path d="M16 4 Q9 4 9 11 Q9 18 16 28 Q23 18 23 11 Q23 4 16 4 Z" /><line x1="16" y1="10" x2="16" y2="18" /><line x1="12" y1="14" x2="20" y2="14" /></PathIcon>,
};

function PathIcon({ children }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function AffiliatedOrgs() {
  const t = useContent(aboutContent.affiliated);
  const headerRef = useScrollReveal(0.25);

  return (
    <section className="affiliated" id="affiliated">
      <div className="affiliated__inner">

        <div ref={headerRef} className="affiliated__header reveal">
          <div className="affiliated__eyebrow">
            <span className="affiliated__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="affiliated__title">{t.title}</h2>
          <p className="affiliated__lede">{t.lede}</p>
        </div>

        <div className="affiliated__grid">
          {t.orgs?.map((org, i) => (
            <OrgCard
              key={org.id}
              org={org}
              index={i}
              ctaLabel={t.readMoreLabel ?? t.joinLabel}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Card ──────────────────────────────────────────────────── */
function OrgCard({ org, index, ctaLabel }) {
  const ref = useScrollReveal(0.15);
  const icon = ORG_ICONS[org.id] ?? ORG_ICONS.yuva;

  return (
    <article
      ref={ref}
      className="org-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.08}s` }}
    >
      <div className="org-card__head">
        <div className="org-card__icon" aria-hidden="true">{icon}</div>
        <span className="org-card__tag">{org.tag}</span>
      </div>

      <h3 className="org-card__name">{org.name}</h3>
      <p className="org-card__body">{org.body}</p>

      <Link
        to={`/affiliated/${org.id}`}
        className="org-card__join"
        data-cursor="link"
      >
        <span>{ctaLabel}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </article>
  );
}
