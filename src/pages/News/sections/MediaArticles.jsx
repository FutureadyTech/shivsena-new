import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import './media-sections.css';

/**
 * Article media section — लेख. Each item carries a photo + title + body
 * excerpt + external link to the published article. Cards link out
 * (new tab) to the source publication.
 */
export default function MediaArticles({ block, sectionId, alt = false }) {
  const t = useContent(block);
  const { lang } = useLanguage();
  const headerRef = useScrollReveal(0.2);

  const items = t.items || [];
  if (items.length === 0) return null;

  const readLabel = 'संपूर्ण लेख वाचा';

  return (
    <section className={`mr${alt ? ' mr--alt' : ''}`} id={sectionId}>
      <div className="mr__inner">
        <div ref={headerRef} className="mr__head reveal">
          <h2 className="mr__title">{t.title}<span className="mr__count">{items.length}</span></h2>
        </div>

        <div className="mr__grid">
          {items.map((item, i) => (
            <ArticleCard key={item.id} item={item} index={i} readLabel={readLabel} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ item, index, readLabel }) {
  const ref = useScrollReveal(0.12);
  return (
    <a
      ref={ref}
      className="mr-article reveal"
      style={{ '--reveal-delay': `${0.04 + (index % 3) * 0.07}s` }}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
    >
      <div className="mr-article__media">
        <img className="mr-article__img" src={item.photo} alt="" loading="lazy" />
      </div>
      <div className="mr-article__body">
        {item.source && <span className="mr-article__source">{item.source}</span>}
        <h3 className="mr-article__title">{item.title}</h3>
        <p className="mr-article__excerpt">{item.body}</p>
        <span className="mr-article__cta">
          {readLabel}
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
          </svg>
        </span>
      </div>
    </a>
  );
}
