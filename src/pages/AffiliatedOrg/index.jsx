import { useParams } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';
import { useContent } from '../../content/_shared/useContent.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import aboutContent from '../../content/about.json';

import './affiliated-org.css';

export default function AffiliatedOrg() {
  useLenis();

  const { slug } = useParams();
  const { lang } = useLanguage();
  const affiliated = useContent(aboutContent.affiliated);
  const salangna = useContent(aboutContent.salangna);
  const org =
    affiliated.orgs?.find((o) => o.id === slug) ||
    salangna.orgs?.find((o) => o.id === slug);

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

          {/* ── पदाधिकारी (names only — no photo cards) ── */}
          {bearers.length > 0 && (
            <div className="aff-detail__pad">
              <h2 className="aff-detail__pad-title">
                {padTitle}
                <span className="aff-detail__pad-count">{bearers.length}</span>
              </h2>
              <ul className="aff-detail__bearers">
                {bearers.map((b, i) => (
                  <li key={i} className="aff-detail__bearer">
                    <span className="aff-detail__bearer-name">{b.name}</span>
                    {b.role && <span className="aff-detail__bearer-role">{b.role}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
