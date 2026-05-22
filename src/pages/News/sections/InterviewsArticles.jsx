import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import './InterviewsArticles.css';

export default function InterviewsArticles() {
  const t = useContent(newsContent.interviews);
  const headerRef = useScrollReveal(0.2);
  const featuredRef = useScrollReveal(0.18);

  return (
    <section className="ia-section" id="interviews">
      <div className="ia-section__inner">

        <div ref={headerRef} className="ia-section__header reveal">
          <div className="ia-section__eyebrow">
            <span className="ia-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="ia-section__title">{t.title}</h2>
          <p className="ia-section__lede">{t.lede}</p>
        </div>

        <div className="ia-section__layout">

          {/* Featured large article */}
          <article ref={featuredRef} className="ia-featured reveal" data-cursor="link">
            <div className="ia-featured__media">
              <img src={t.featured.image} alt="" className="ia-featured__img" loading="lazy" />
              <div className="ia-featured__shade" aria-hidden="true" />
            </div>
            <div className="ia-featured__body">
              <div className="ia-featured__meta">
                <span className="ia-featured__source">{t.featured.source}</span>
                <span className="ia-featured__dot" aria-hidden="true">•</span>
                <span className="ia-featured__date">{t.featured.date}</span>
                <span className="ia-featured__dot" aria-hidden="true">•</span>
                <span className="ia-featured__read">{t.featured.readTime}</span>
              </div>
              <h3 className="ia-featured__title">{t.featured.title}</h3>
              <p className="ia-featured__summary">{t.featured.summary}</p>
            </div>
          </article>

          {/* Secondary article list */}
          <ul className="ia-list">
            {t.articles?.map((article, i) => (
              <ArticleItem key={article.id} article={article} index={i} />
            ))}
          </ul>

        </div>

      </div>
    </section>
  );
}

function ArticleItem({ article, index }) {
  const ref = useScrollReveal(0.15);
  return (
    <li
      ref={ref}
      className="ia-item reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 4) * 0.07}s` }}
      data-cursor="link"
    >
      <div className="ia-item__media">
        <img src={article.image} alt="" className="ia-item__img" loading="lazy" />
      </div>
      <div className="ia-item__body">
        <div className="ia-item__meta">
          <span className="ia-item__source">{article.source}</span>
          <span aria-hidden="true">•</span>
          <span className="ia-item__date">{article.date}</span>
        </div>
        <h4 className="ia-item__title">{article.title}</h4>
        <p className="ia-item__summary">{article.summary}</p>
      </div>
    </li>
  );
}
