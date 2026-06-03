import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import homeContent from '../../../content/home.json';
import leadersContent from '../../../content/leaders.json';
import './LeadershipFeature.css';

/* ── Localized labels for the CTA / fall-back text ── */
const CTA_LABEL = {
  mr: 'संपूर्ण परिचय वाचा',
  en: 'Read full profile',
};

/* True if a leader has a bio page wired up in leaders.json */
const hasProfile = (leaderId) => Boolean(leadersContent[leaderId]);

/* Trim a paragraph at the last sentence-end within `max` chars so we
 don't cut a word in half. Falls back to a hard slice if no sentence
 boundary is found. */
function trimAtSentence(text, max = 320) {
  if (!text) return '';
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastStop = Math.max(
 slice.lastIndexOf('. '),
 slice.lastIndexOf('. '),
 slice.lastIndexOf('।'),
 slice.lastIndexOf('!'),
 slice.lastIndexOf('?')
  );
  if (lastStop > max * 0.5) return slice.slice(0, lastStop + 1).trim() + '…';
  // fallback cut at last space
  const lastSpace = slice.lastIndexOf(' ');
  return slice.slice(0, lastSpace > 0 ? lastSpace : max).trim() + '…';
}

export default function LeadershipFeature({ content }) {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';
  const t = useContent(content ?? homeContent.leadership);
  const headerRef = useScrollReveal(0.22);

  const leaders = Array.isArray(t.leaders) ? t.leaders : [];

  return (
 <section className="lf">
 {/* soft ambient glows */}
 <span className="lf__glow lf__glow--tl" aria-hidden="true" />
 <span className="lf__glow lf__glow--br" aria-hidden="true" />

 <div className="lf__inner">

 {/* ── Section header ── */}
 <div ref={headerRef} className="lf__header reveal">
 {t.eyebrow && (
 <div className="lf__eyebrow">
 <span className="lf__eyebrow-line" />
 <span>{t.eyebrow}</span>
 <span className="lf__eyebrow-line" />
 </div>
 )}
 <h2 className="lf__title">{t.title}</h2>
 </div>

 {/* ── Alternating leader blocks ── */}
 <ol className="lf__list">
 {leaders.map((leader, i) => (
 <Fragment key={leader.id}>
 {leader.sectionHeader && (
 <li className="lf__divider" aria-hidden="false">
 <span className="lf__divider-rule" />
 <h3 className="lf__divider-title">{leader.sectionHeader}</h3>
 <span className="lf__divider-rule" />
 </li>
 )}
 <LeaderFeature
 leader={leader}
 index={i}
 lang={lang}
 />
 </Fragment>
 ))}
 </ol>
 </div>
 </section>
  );
}

function LeaderFeature({ leader, index, lang }) {
  const ref = useScrollReveal(0.15);
  const orientation = index % 2 === 0 ? 'left' : 'right';

  // Pull richer bio fields from leaders.json when available
  const profile = leadersContent[leader.id];
  const bio = profile ? (profile[lang] || profile.en || profile.mr) : null;

  /* Page-content fields (home.json / about.json) WIN over the
     bio fields in leaders.json — the per-page content is the
     single source of truth for what shows in the Legacy block. */
  const name = leader.name || bio?.name;
  const role = leader.role || bio?.role;
  const dates = leader.dates || bio?.dates;
  // The "lede" tagline is intentionally omitted — we only display
  // fields that come from the source documents, not authored summaries.
  const body = trimAtSentence(bio?.paragraphs?.[0]);
  // Prefer the leader.image given in the page content (it includes the
  // leading slash for /-rooted public paths). Fall back to bio image.
  const image = leader.image?.startsWith('/')
 ? leader.image
 : `/${leader.image || bio?.image?.replace(/^\//, '') || ''}`;

  const profileAvailable = hasProfile(leader.id);

  return (
 <li
 ref={ref}
 className={`lf-feat lf-feat--${orientation} reveal`}
 style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.06}s` }}
 >
 {/* ─── Media ─── */}
 <div className="lf-feat__media">
 <img src={image} alt={name} loading="lazy" />
 <span className="lf-feat__media-glow" aria-hidden="true" />
 </div>

 {/* ─── Body ─── */}
 <div className="lf-feat__body">
 {role && (
 <span className="lf-feat__role">{role}</span>
 )}

 <p className="lf-feat__name">{name}</p>

 {dates && <p className="lf-feat__dates">{dates}</p>}


 {body && <p className="lf-feat__body-text">{body}</p>}

 {profileAvailable && (
 <Link
 to={`/leader/${leader.id}`}
 className="lf-feat__cta btn"
 data-cursor="link"
 >
 <span>{CTA_LABEL[lang]}</span>
 <svg
 viewBox="0 0 24 24" width="18" height="18"
 fill="none" stroke="currentColor"
 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
 >
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </Link>
 )}
 </div>
 </li>
  );
}
