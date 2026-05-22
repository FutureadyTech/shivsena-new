import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import declarationsContent from '../../../content/declarations.json';
import './DeclarationsList.css';

const ICONS = [
  // Document with check
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </svg>,
  // Rupee / finance
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 4h12M6 8h12M9 13a4 4 0 0 0 4-4M9 13h3l5 7" />
  </svg>,
  // Scroll / constitution
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5a2 2 0 0 1 2-2h10l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="13" y2="18" />
  </svg>,
  // Shield with user
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" />
    <circle cx="12" cy="11" r="2" />
    <path d="M9 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
  </svg>,
  // Gavel
  <svg key="i5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4 20 10" />
    <path d="M10 8 16 14" />
    <path d="M4 20 14 10" />
    <path d="M3 21h8" />
  </svg>,
];

export default function DeclarationsList() {
  const intro = useContent(declarationsContent.intro);
  const items = useContent(declarationsContent.items);
  const footer = useContent(declarationsContent.footer);

  const headerRef = useScrollReveal(0.2);
  const footerRef = useScrollReveal(0.2);

  return (
    <section className="decl">
      <div className="decl__inner">
        {/* ── Intro ── */}
        <div ref={headerRef} className="decl__header reveal">
          <div className="decl__eyebrow">
            <span className="decl__eyebrow-line" />
            <span>{intro.eyebrow}</span>
          </div>
          <h2 className="decl__title">{intro.title}</h2>
          <p className="decl__lede">{intro.lede}</p>
          <div className="decl__hr" aria-hidden="true">
            <span className="decl__hr-line" />
            <span className="decl__hr-mark" />
            <span className="decl__hr-line" />
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="decl__list">
          {items.map((item, i) => (
            <DeclarationCard
              key={i}
              item={item}
              index={i}
              icon={ICONS[i % ICONS.length]}
            />
          ))}
        </div>

        {/* ── Footer block ── */}
        <div ref={footerRef} className="decl__footer reveal">
          <h3 className="decl__footer-title">{footer.title}</h3>
          <p className="decl__footer-body">{footer.body}</p>
          <a
            href="https://www.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="decl__footer-cta"
          >
            <span>{footer.cta}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function DeclarationCard({ item, index, icon }) {
  const ref = useScrollReveal(0.18);

  return (
    <article
      ref={ref}
      className="decl-card reveal"
      style={{ '--reveal-delay': `${0.08 + (index % 3) * 0.08}s` }}
    >
      <div className="decl-card__rail" aria-hidden="true" />

      <div className="decl-card__head">
        <span className="decl-card__num">{item.number}</span>
        <span className="decl-card__icon" aria-hidden="true">{icon}</span>
      </div>

      <span className="decl-card__tag">{item.tag}</span>
      <h3 className="decl-card__title">{item.title}</h3>
      <p className="decl-card__body">{item.body}</p>

      <span className="decl-card__corner" aria-hidden="true" />
    </article>
  );
}
