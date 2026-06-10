import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import './media-sections.css';

/**
 * News media section — बातम्या. Each item is a headline + source +
 * external link to a press article. Rendered as a clean list of rows
 * that open the source story in a new tab.
 */
export default function MediaNews({ block, sectionId, alt = false }) {
  const t = useContent(block);
  const headerRef = useScrollReveal(0.2);

  const items = t.items || [];
  if (items.length === 0) return null;

  return (
    <section className={`mr${alt ? ' mr--alt' : ''}`} id={sectionId}>
      <div className="mr__inner">
        <div ref={headerRef} className="mr__head reveal">
          <h2 className="mr__title">{t.title}<span className="mr__count">{items.length}</span></h2>
        </div>

        <div className="mr-news">
          {items.map((item, i) => (
            <NewsRow key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsRow({ item, index }) {
  const ref = useScrollReveal(0.1);
  return (
    <a
      ref={ref}
      className="mr-news__item reveal"
      style={{ '--reveal-delay': `${0.03 + (index % 5) * 0.05}s` }}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
    >
      {item.source && <span className="mr-news__source">{item.source}</span>}
      <h3 className="mr-news__headline">{item.title}</h3>
      <span className="mr-news__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
        </svg>
      </span>
    </a>
  );
}
