import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import './media-sections.css';

/**
 * Poster-style media section — used for प्रसिद्धी पत्रे (press releases)
 * and नियुक्ती पत्रे (appointment letters). Each item carries a photo +
 * title/name + body. Cards open a lightbox with the full image + text.
 *
 * Props:
 *   block      — bilingual content block ({ mr, en }) from media.json
 *   sectionId  — DOM id for the dropdown anchor (#press-releases etc.)
 *   alt        — render the alt (slightly darker) background variant
 */
export default function MediaPosters({ block, sectionId, alt = false }) {
  const t = useContent(block);
  const { lang } = useLanguage();
  const headerRef = useScrollReveal(0.2);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [active]);

  const close = useCallback(() => setActive(null), []);
  const items = t.items || [];
  if (items.length === 0) return null;

  const moreLabel = 'अधिक वाचा';

  return (
    <section className={`mr${alt ? ' mr--alt' : ''}`} id={sectionId}>
      <div className="mr__inner">
        <div ref={headerRef} className="mr__head reveal">
          <h2 className="mr__title">{t.title}<span className="mr__count">{items.length}</span></h2>
        </div>

        <div className="mr__grid">
          {items.map((item, i) => (
            <PosterCard key={item.id} item={item} index={i} moreLabel={moreLabel} onOpen={() => setActive(item)} />
          ))}
        </div>
      </div>

      {active && (
        <div className="mr-modal" role="dialog" aria-modal="true" onClick={close}>
          <button className="mr-modal__close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="mr-modal__poster" onClick={(e) => e.stopPropagation()}>
            <div className="mr-modal__poster-img">
              <img src={active.photo} alt={active.title || active.name} />
            </div>
            <div className="mr-modal__poster-text">
              <h3 className="mr-modal__poster-title">{active.title || active.name}</h3>
              <p className="mr-modal__poster-body">{active.body}</p>
              <a
                className="mr-modal__download"
                href={active.photo}
                download
                data-cursor="link"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                डाउनलोड करा
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function PosterCard({ item, index, moreLabel, onOpen }) {
  const ref = useScrollReveal(0.12);
  return (
    <button
      ref={ref}
      type="button"
      className="mr-poster reveal"
      style={{ '--reveal-delay': `${0.04 + (index % 3) * 0.07}s` }}
      onClick={onOpen}
      data-cursor="link"
    >
      <div className="mr-poster__media">
        <img className="mr-poster__img" src={item.photo} alt={item.title || item.name} loading="lazy" />
        <span className="mr-poster__zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </span>
      </div>
      <div className="mr-poster__body">
        <h3 className="mr-poster__name">{item.title || item.name}</h3>
        <p className="mr-poster__excerpt">{item.body}</p>
        <span className="mr-poster__more">
          {moreLabel}
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </button>
  );
}
