import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import aboutContent from '../../../content/about.json';
import { iconForOrgId } from './orgIcons.jsx';
import './AffiliatedOrgs.css';

/* PNG-first, SVG-fallback icon component.
   Loads /public/icons/orgs/{slug}.png; if that 404s, the onError
   handler silently swaps in the themed inline SVG from orgIcons.
   No code change needed to switch from inline to Flaticon PNGs —
   just drop the file at the slug path. */
function OrgIconAuto({ orgId }) {
  const [pngFailed, setPngFailed] = useState(false);
  if (pngFailed) {
    return iconForOrgId(orgId) ?? <GenericOrgIcon />;
  }
  return (
    <img
      src={`/icons/orgs/${orgId}.png`}
      alt=""
      className="org-card__icon-img"
      loading="lazy"
      onError={() => setPngFailed(true)}
    />
  );
}

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

/* Optional per-org Flaticon overrides (kept for back-compat with
   the original 9 org IDs that had bespoke PNG icons). When the
   current PDF-driven list has no entry here, we fall back to
   GenericOrgIcon, a clean inline SVG that styles with the saffron
   filter the same way the PNGs do. */
const ORG_ICONS = {
  // legacy IDs — left in place in case the PNG art is reused
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

/* Generic inline-SVG icon — used when an org's `id` doesn't match
   any of the hand-curated PNGs above. Shaped like a stylised
   Shiv Sena emblem (bow + arrow + base). */
function GenericOrgIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="org-card__icon-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Arrow shaft pointing up */}
      <line x1="24" y1="8" x2="24" y2="34" />
      {/* Arrow head */}
      <polyline points="18 14 24 8 30 14" />
      {/* Bow curve underneath */}
      <path d="M10 30 Q24 42 38 30" />
      {/* Base ribbon */}
      <line x1="14" y1="38" x2="34" y2="38" />
    </svg>
  );
}

/**
 * AffiliatedOrgs / sister-section renderer.
 *
 * `content` — the bilingual content block to render (defaults to
 *             `aboutContent.affiliated` so the original About page
 *             call site keeps working unchanged). Pass
 *             `aboutContent.salangna` (or any future block with the
 *             same `{ orgs: [...] }` shape) to render a second
 *             instance of this section with different data.
 * `sectionId` — DOM id for anchor links (defaults to "affiliated").
 *               Pass a unique id when rendering more than one
 *               instance on the same page.
 */
const INITIAL_VISIBLE = 6; // 3 columns × 2 rows
const REVEAL_STEP = 6;     // reveal two more rows per click

export default function AffiliatedOrgs({
  content,
  sectionId = 'affiliated',
} = {}) {
  const t = useContent(content ?? aboutContent.affiliated);
  const headerRef = useScrollReveal(0.25);

  const orgs = t.orgs || [];
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const total = orgs.length;
  const canToggle = total > INITIAL_VISIBLE;
  const visibleOrgs = orgs.slice(0, visible);
  const allShown = visible >= total;
  const remaining = total - visible; // how many more are still hidden

  const showMore = () => setVisible((v) => Math.min(total, v + REVEAL_STEP));
  const showLess = () => setVisible(INITIAL_VISIBLE);

  const isMr = t._lang === 'mr';
  const moreLabel = isMr ? `आणखी पाहा (${remaining})` : `See more (${remaining})`;
  const lessLabel = isMr ? 'कमी दाखवा' : 'See less';

  return (
 <section className="affiliated" id={sectionId}>
 <div className="affiliated__inner">

 <div ref={headerRef} className="affiliated__header reveal">
 <h2 className="affiliated__title">{t.title}</h2>
 </div>

 {/* ── Grid: shows 4 cards, "See more" reveals the rest in batches ── */}
 <div className="affiliated__grid">
 {visibleOrgs.map((org, i) => (
 <OrgCard
 key={org.id}
 org={org}
 index={i}
 ctaLabel={t.readMoreLabel ?? t.joinLabel}
 />
 ))}
 </div>

 {canToggle && (
 <div className="affiliated__more">
 <button
 type="button"
 className="affiliated__more-btn"
 onClick={allShown ? showLess : showMore}
 aria-expanded={visible > INITIAL_VISIBLE}
 >
 <span>{allShown ? lessLabel : moreLabel}</span>
 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={allShown ? 'is-up' : ''}>
 <polyline points="6 9 12 15 18 9" />
 </svg>
 </button>
 </div>
 )}

 </div>
 </section>
  );
}

/* ── Card ──────────────────────────────────────────────────── */
function OrgCard({ org, index, ctaLabel }) {
  const ref = useScrollReveal(0.15);
  /* Auto-fallback icon: try PNG at /icons/orgs/{slug}.png first,
     drop to themed inline SVG (or generic bow-and-arrow) on 404. */
  const icon = <OrgIconAuto orgId={org.id} />;

  return (
 <article
 ref={ref}
 className="org-card reveal"
 style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.08}s` }}
 >
 {/* Saffron-tinted icon badge */}
 <div className="org-card__icon" aria-hidden="true">{icon}</div>

 {/* Content — tag + body are optional now (the 55-org list from
     the master PDF only carries names; legacy entries may still
     have tag + body filled in). */}
 {org.tag && <span className="org-card__tag">{org.tag}</span>}
 <h3 className="org-card__name">{org.name}</h3>

 <span className="org-card__divider" aria-hidden="true" />

 <div className="org-card__footer">
 <Link
 to={`/affiliated/${org.id}`}
 className="org-card__cta btn--ghost"
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
