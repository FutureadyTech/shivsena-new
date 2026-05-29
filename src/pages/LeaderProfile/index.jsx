import { Link, Navigate, useParams } from 'react-router-dom';
import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';
import { useScrollReveal } from '../Home/hooks/useScrollReveal.js';
import { useContent } from '../../content/_shared/useContent.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import leadersContent from '../../content/leaders.json';

import './leader-profile.css';

export default function LeaderProfile() {
  useLenis();

  const { slug } = useParams();
  const { lang } = useLanguage();
  const data = leadersContent[slug];

  // If the slug doesn't exist in our leaders content, redirect home.
  if (!data) return <Navigate to="/home" replace />;

  const t = useContent(data);
  const headerRef = useScrollReveal(0.2);
  const bodyRef = useScrollReveal(0.15);

  const backLabel = lang === 'mr' ? '← सर्व नेतृत्व पहा' : '← BACK TO LEADERSHIP';

  return (
 <div className="leader-profile-page">
 <CursorSparks />
 <SiteHeader />

 {/* ─── Banner (matches the design rhythm of About/Declarations banners) ─── */}
 <section className="lp-banner">
 <div
 className="lp-banner__image"
 style={{ backgroundImage: `url(${t.bannerImage})` }}
 aria-hidden="true"
 />
 <div className="lp-banner__ov-base" />
 <div className="lp-banner__ov-spotlight" />
 <div className="lp-banner__ov-top" />
 <div className="lp-banner__ov-bottom" />

 <div className="lp-banner__content">
 <p className="lp-banner__eyebrow">{t.eyebrow}</p>
 <h1 className="lp-banner__title">{t.name}</h1>
 <div className="lp-banner__divider" aria-hidden="true" />
 <p className="lp-banner__role">{t.title}</p>
 {t.role && <p className="lp-banner__sub">{t.role}</p>}
 <p className="lp-banner__dates">{t.dates}</p>
 </div>
 </section>

 {/* ─── Bio body float-left portrait, text wraps around ─── */}
 <section className="lp-body">
 <div className="lp-body__inner">


 <article ref={bodyRef} className="lp-body__article reveal">
 <figure className="lp-body__figure">
 <img src={t.image} alt={t.name} className="lp-body__photo" loading="lazy" />
 <figcaption className="lp-body__caption">{t.name}</figcaption>
 </figure>

 {t.paragraphs?.map((p, i) => (
 <p key={i} className="lp-body__paragraph">{p}</p>
 ))}

 {/* Clear the float at the end so the next element starts cleanly */}
 <div className="lp-body__clear" aria-hidden="true" />
 </article>

 <div className="lp-body__back">
 <Link to="/leadership" className="lp-body__back-link" data-cursor="link">
 <span>{backLabel}</span>
 </Link>
 </div>

 </div>
 </section>

 <Footer />
 </div>
  );
}
