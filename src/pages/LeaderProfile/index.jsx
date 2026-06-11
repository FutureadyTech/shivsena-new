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
  const bodyRef = useScrollReveal(0.15);

  const backLabel = '← सर्व नेतृत्व पहा';

  return (
 <div className="leader-profile-page">
 <CursorSparks />
 <SiteHeader />

 {/* ─── Banner — image-only (all eyebrow / title / dates artwork is
     baked into the banner image, same approach as the About page).
     Driven per-leader by `bannerImage` in leaders.json. ─── */}
 <section className="lp-banner">
 <img
 src={t.bannerImage}
 alt={t.name}
 className="lp-banner__image"
 />
 </section>

 {/* ─── Bio body float-left portrait, text wraps around ─── */}
 <section className="lp-body">
 <div className="lp-body__inner">


 <article ref={bodyRef} className="lp-body__article reveal">
 <figure className="lp-body__figure">
 <img src={t.image} alt={t.name} className="lp-body__photo" loading="lazy" />
 </figure>

 {t.paragraphs?.map((p, i) => (
 <p key={i} className="lp-body__paragraph">{p}</p>
 ))}

 {/* Clear the float at the end so the next element starts cleanly */}
 <div className="lp-body__clear" aria-hidden="true" />
 </article>

 <div className="lp-body__back">
 <Link to="/leadership" className="lp-body__back-link btn" data-cursor="link">
 <span>{backLabel}</span>
 </Link>
 </div>

 </div>
 </section>

 <Footer />
 </div>
  );
}
