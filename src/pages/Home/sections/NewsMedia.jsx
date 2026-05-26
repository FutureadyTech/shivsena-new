import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './NewsMedia.css';

export default function NewsMedia() {
  const t = useContent(homeContent.news);
  const headerRef = useScrollReveal(0.25);
  const featuredRef = useScrollReveal(0.15);
  const sidebarRef = useScrollReveal(0.15);

  const featured = t.featured ?? {};
  const sidebar = t.sidebar ?? [];

  return (
    <section className="news">
      <div className="news__inner">
        <div ref={headerRef} className="news__header reveal">
          <div>
            <div className="news__eyebrow">
              <span className="news__eyebrow-line"></span>
              <span>{t.eyebrow}</span>
            </div>
            <h2 className="news__title">{t.title}</h2>
          </div>

          <a href="/news" className="news__archive-link">
            <span>{t.viewAllLabel}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div className="news__grid">
          {/* Featured story — entire card links to the source article */}
          <article ref={featuredRef} className="news-feature reveal">
            <a
              href={featured.href || '#'}
              target={featured.href ? '_blank' : undefined}
              rel={featured.href ? 'noopener noreferrer' : undefined}
              className="news-feature__link"
              data-cursor="link"
              aria-label={featured.title}
            >
              <div className="news-feature__media">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="news-feature__image"
                  loading="lazy"
                />
                <span className="news-feature__badge">{featured.badge}</span>
              </div>

              <div className="news-feature__body">
                <div className="news-feature__meta">
                  <span className="news-feature__date">{featured.date}</span>
                  <span className="news-feature__dot"></span>
                  <span className="news-feature__category">{featured.category}</span>
                </div>
                <h3 className="news-feature__title">{featured.title}</h3>
                <p className="news-feature__excerpt">{featured.excerpt}</p>
                <span className="news-feature__cta">
                  <span>{(t.readMoreLabel || 'READ FULL ARTICLE').toUpperCase()}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </a>
          </article>

          {/* Sidebar list */}
          <div ref={sidebarRef} className="news-sidebar reveal">
            {sidebar.map((item, i) => (
              <SidebarItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({ item, index }) {
  const ref = useScrollReveal(0.2);
  const Tag = item.href ? 'a' : 'article';
  const linkProps = item.href
    ? { href: item.href, target: '_blank', rel: 'noopener noreferrer', 'data-cursor': 'link' }
    : {};

  return (
    <Tag
      ref={ref}
      className="news-side reveal"
      style={{ '--reveal-delay': `${0.1 + index * 0.08}s` }}
      {...linkProps}
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
    </Tag>
  );
}