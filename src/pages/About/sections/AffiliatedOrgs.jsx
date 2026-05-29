import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import aboutContent from '../../../content/about.json';
import './AffiliatedOrgs.css';

/* Party-wide socials used as the default for every org card. If an org
 later gets its own handles in about.json (`org.socials`), those override. */
const DEFAULT_SOCIALS = {
  facebook:  'https://www.facebook.com/Shivsenaofc',
  twitter: 'https://x.com/Shivsenaofc',
  instagram: 'https://www.instagram.com/shivsenaofc/',
};

const SOCIAL_META = [
  {
 id: 'facebook',
 label: 'Facebook',
 icon: (
 <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
 <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.27c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 22 12z" />
 </svg>
 ),
  },
  {
 id: 'twitter',
 label: 'X / Twitter',
 icon: (
 <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
 <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.79l-5.31-6.94L4.78 22H1.52l8.02-9.17L1 2h6.95l4.8 6.34L18.244 2zm-2.38 18h1.88L7.27 4H5.26l10.6 16z" />
 </svg>
 ),
  },
  {
 id: 'instagram',
 label: 'Instagram',
 icon: (
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <rect x="3" y="3" width="18" height="18" rx="5" />
 <circle cx="12" cy="12" r="4" />
 <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
 </svg>
 ),
  },
];

/* Flaticon PNG assets dropped into /public/icons/orgs/.
 Picked from outline/lineal styles so they keep their detail
 after the brand-saffron monochrome filter is applied.
 bks Labour Day (Flaticon id 4336740)  [user-specified]
 sls Employment (id 18238810) [user-specified]
 yuva Youth (id 1312651) [user-specified]
 bvs Graduation cap outline (id 43805)
 mahila Businesswoman (id 563230) [user-specified]
 udyog Business idea (id 8660446) [user-specified]
 shikshak Teacher (id 9721094) [user-specified]
 chitrapat Video / clapperboard (id 1179120) [user-specified]
 arogya Healthcare (id 4003747) [user-specified] */
const ORG_ICONS = {
  bks: <OrgIcon name="bks" />,
  sls: <OrgIcon name="sls" />,
  yuva: <OrgIcon name="yuva" />,
  bvs: <OrgIcon name="bvs" />,
  mahila: <OrgIcon name="mahila" />,
  udyog: <OrgIcon name="udyog" />,
  shikshak:  <OrgIcon name="shikshak" />,
  chitrapat: <OrgIcon name="chitrapat" />,
  arogya: <OrgIcon name="arogya" />,
};

function OrgIcon({ name }) {
  return (
 <img
 src={`/icons/orgs/${name}.png`}
 alt=""
 className="org-card__icon-img"
 loading="lazy"
 />
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
 {/* Saffron-tinted icon badge */}
 <div className="org-card__icon" aria-hidden="true">{icon}</div>

 {/* Content */}
 <span className="org-card__tag">{org.tag}</span>
 <h3 className="org-card__name">{org.name}</h3>
 <p className="org-card__desc">{org.body}</p>

 <span className="org-card__divider" aria-hidden="true" />

 <div className="org-card__footer">
 <Link
 to={`/affiliated/${org.id}`}
 className="org-card__cta"
 data-cursor="link"
 >
 <span>{ctaLabel}</span>
 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </Link>

 <OrgSocials socials={org.socials} orgName={org.name} />
 </div>

 {/* Left accent rail that fills in on hover */}
 <span className="org-card__rail" aria-hidden="true" />
 </article>
  );
}

/* ── Social row beside the CTA ────────────────────────────
 Reads URLs from the org's own `socials` field first; falls
 back to the party-wide DEFAULT_SOCIALS when missing. */
function OrgSocials({ socials, orgName }) {
  const resolved = { ...DEFAULT_SOCIALS, ...(socials || {}) };
  return (
 <div className="org-card__socials" aria-label={`${orgName} social profiles`}>
 {SOCIAL_META.map((s) => {
 const href = resolved[s.id];
 if (!href || href === '#') return null;
 return (
 <a
 key={s.id}
 href={href}
 target="_blank"
 rel="noopener noreferrer"
 className={`org-card__social org-card__social--${s.id}`}
 aria-label={s.label}
 title={s.label}
 onClick={(e) => e.stopPropagation()}
 >
 {s.icon}
 </a>
 );
 })}
 </div>
  );
}
