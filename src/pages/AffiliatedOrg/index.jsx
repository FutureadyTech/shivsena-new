import { useParams } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';
import { useContent } from '../../content/_shared/useContent.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import aboutContent from '../../content/about.json';

/* Reuse the leadership directory card styles for पदाधिकारी cards. */
import '../Leadership/sections/LeadersDirectory.css';
import './affiliated-org.css';

/* Gender-aware placeholder (same heuristic as the leadership page). */
const FEMALE_RE = /(^|\s)(सौ\.|श्रीम\.|श्रीमती\.|कु\.|डॉ\.\s*श्रीम\.|डॉ\.\s*श्रीमती\.)/;
const isFemale = (n) => !!n && (FEMALE_RE.test(n) || /ताई/.test(n));
const photoFor = (n) =>
  isFemale(n) ? '/placeholder/placeholder-women.png' : '/placeholder/placeholder-men.png';

function BearerCard({ bearer }) {
  return (
    <article className="dir-card">
      <img src={photoFor(bearer.name)} alt="" loading="lazy" className="dir-card__bg" />
      <div className="dir-card__shade" aria-hidden="true" />
      <div className="dir-card__content">
        <h4 className="dir-card__name">{bearer.name}</h4>
        {bearer.role && <p className="dir-card__role">{bearer.role}</p>}
      </div>
    </article>
  );
}

export default function AffiliatedOrg() {
  useLenis();

  const { slug } = useParams();
  const { lang } = useLanguage();
  const affiliated = useContent(aboutContent.affiliated);
  const org = affiliated.orgs?.find((o) => o.id === slug);

  const orgName = org?.name ?? slug;
  const orgTag = org?.tag;
  const bearers = Array.isArray(org?.officeBearers) ? org.officeBearers : [];

  const padTitle  = lang === 'mr' ? 'पदाधिकारी' : 'Office Bearers';
  const soonBody  = lang === 'mr' ? 'माहिती लवकरच उपलब्ध होईल.' : 'Details coming soon.';

  return (
    <div className="aff-org-page">
      <CursorSparks />
      <SiteHeader />

      <section className="aff-detail">
        <div className="aff-org__bg" aria-hidden="true" />

        <div className="aff-detail__inner">

          {/* ── Header ── */}
          <header className="aff-detail__head">
            {orgTag && <span className="aff-org__tag">{orgTag}</span>}
            <h1 className="aff-detail__name">{orgName}</h1>
            <div className="aff-org__divider" aria-hidden="true">
              <span className="aff-org__divider-line" />
              <span className="aff-org__divider-dot" />
              <span className="aff-org__divider-line" />
            </div>
            <p className="aff-detail__body">{org?.body || soonBody}</p>
          </header>

          {/* ── पदाधिकारी (leadership-card layout) ── */}
          {bearers.length > 0 && (
            <div className="aff-detail__pad">
              <h2 className="aff-detail__pad-title">
                {padTitle}
                <span className="aff-detail__pad-count">{bearers.length}</span>
              </h2>
              <div className="dir-cat__grid aff-detail__grid">
                {bearers.map((b, i) => (
                  <BearerCard key={i} bearer={b} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
