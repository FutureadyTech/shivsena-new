import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
/* Reuse the home page Media Highlights styles 1:1 keeps the design
 identical without duplicating CSS. */
import '../../Home/sections/NewsMedia.css';

export default function PressReleases() {
  const t = useContent(newsContent.pressReleases);
  const { lang } = useLanguage();
  const headerRef = useScrollReveal(0.25);
  const featuredRef = useScrollReveal(0.15);
  const sidebarRef = useScrollReveal(0.15);

  const items = t.items || [];
  if (items.length === 0) return null;

  const [featured, ...rest] = items;
  const sidebar = rest.slice(0, 3);

  const latestLabel = lang === 'mr' ? 'ताजी बातमी' : 'LATEST';
  const readArticleLabel = (t.readMoreLabel || (lang === 'mr' ? 'अधिक वाचा' : 'READ FULL ARTICLE')).toUpperCase();

  return (
 <section className="news" id="press-releases">
 <div className="news__inner">
 <div ref={headerRef} className="news__header reveal">
 <div>
 <div className="news__eyebrow">
 <span className="news__eyebrow-line"></span>
 <span>{t.eyebrow}</span>
 </div>
 <h2 className="news__title">{t.title}</h2>
 </div>

 <a href="#" className="news__archive-link" data-cursor="link">
 <span>{t.viewAllLabel}</span>
 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </a>
 </div>

 <div className="news__grid">
 {/* Featured story the first/most recent press release */}
 <article ref={featuredRef} className="news-feature reveal">
 <div className="news-feature__media">
 <div
 className="news-feature__image"
 style={{ backgroundImage: `url(${featured.image})` }}
 ></div>
 <span className="news-feature__badge">{latestLabel}</span>
 </div>

 <div className="news-feature__body">
 <div className="news-feature__meta">
 <span className="news-feature__date">{featured.date}</span>
 <span className="news-feature__dot"></span>
 <span className="news-feature__category">{featured.category}</span>
 </div>
 <h3 className="news-feature__title">{featured.title}</h3>
 <p className="news-feature__excerpt">{featured.excerpt}</p>
 <a href="#" className="news-feature__cta" data-cursor="link">
 <span>{readArticleLabel}</span>
 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </a>
 </div>
 </article>

 {/* Sidebar list next 3 press releases */}
 <div ref={sidebarRef} className="news-sidebar reveal">
 {sidebar.map((item, i) => (
 <SidebarItem key={item.id} item={item} index={i} />
 ))}
 </div>
 </div>
 </div>
 </section>
  );
}

function SidebarItem({ item, index }) {
  const ref = useScrollReveal(0.2);
  return (
 <article
 ref={ref}
 className="news-side reveal"
 style={{ '--reveal-delay': `${0.1 + index * 0.08}s` }}
 data-cursor="link"
 >
 <div
 className="news-side__thumb"
 style={{ backgroundImage: `url(${item.image})` }}
 ></div>
 <div className="news-side__body">
 <div className="news-side__meta">
 <span className="news-side__date">{item.date}</span>
 <span className="news-side__category">{item.category}</span>
 </div>
 <h4 className="news-side__title">{item.title}</h4>
 <span className="news-side__arrow" aria-hidden="true">
 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </span>
 </div>
 </article>
  );
}
