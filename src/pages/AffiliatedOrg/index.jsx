import { Link, useParams } from 'react-router-dom';
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
  const org = affiliated.orgs?.find((o) => o.id === slug);

  // Fallback name if slug doesn't match any org
  const orgName = org?.name ?? slug;
  const orgTag  = org?.tag;

  const comingSoonLabel = lang === 'mr' ? 'लवकरच येत आहे' : 'COMING SOON';
  const backLabel       = lang === 'mr' ? 'मागे जा' : 'BACK TO AFFILIATED';

  return (
    <div className="aff-org-page">
      <CursorSparks />
      <SiteHeader />

      <section className="aff-org">
        <div className="aff-org__bg" aria-hidden="true" />

        <div className="aff-org__inner">
          {orgTag && (
            <span className="aff-org__tag">{orgTag}</span>
          )}

          <h1 className="aff-org__name">{orgName}</h1>

          <div className="aff-org__divider" aria-hidden="true">
            <span className="aff-org__divider-line" />
            <span className="aff-org__divider-dot" />
            <span className="aff-org__divider-line" />
          </div>

          <p className="aff-org__soon">{comingSoonLabel}</p>

          {org?.body && <p className="aff-org__body">{org.body}</p>}

          <Link to="/about#affiliated" className="aff-org__back btn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{backLabel}</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
