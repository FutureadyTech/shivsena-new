import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import './media-sections.css';

/**
 * Video media section — used for भाषणे (speeches) and मुलाखत (interviews).
 * Each item carries a title + YouTube videoId. Cards show the auto
 * thumbnail and open an inline embed lightbox on click.
 *
 * Props:
 *   block      — bilingual content block ({ mr, en }) from media.json
 *   sectionId  — DOM id for the dropdown anchor (#speeches / #interviews)
 *   alt        — render the alt background variant
 */
export default function MediaVideos({ block, sectionId, alt = false }) {
  const t = useContent(block);
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
  const items = (t.items || []).filter((v) => v.videoId);
  if (items.length === 0) return null;

  return (
    <section className={`mr${alt ? ' mr--alt' : ''}`} id={sectionId}>
      <div className="mr__inner">
        <div ref={headerRef} className="mr__head reveal">
          <h2 className="mr__title">{t.title}<span className="mr__count">{items.length}</span></h2>
          {t.lede && <p className="mr__lede">{t.lede}</p>}
        </div>

        <div className="mr__grid">
          {items.map((item, i) => (
            <VideoCard key={item.id} item={item} index={i} onPlay={() => setActive(item)} />
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
          <div className="mr-modal__video" onClick={(e) => e.stopPropagation()}>
            <div className="mr-modal__embed">
              <iframe
                src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mr-modal__cap">{active.title}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function VideoCard({ item, index, onPlay }) {
  const ref = useScrollReveal(0.12);
  return (
    <button
      ref={ref}
      type="button"
      className="mr-video reveal"
      style={{ '--reveal-delay': `${0.04 + (index % 3) * 0.07}s` }}
      onClick={onPlay}
      aria-label={`Play: ${item.title}`}
      data-cursor="link"
    >
      <div className="mr-video__thumb">
        <img
          className="mr-video__img"
          src={`https://i.ytimg.com/vi/${item.videoId}/maxresdefault.jpg`}
          alt=""
          loading="lazy"
          onError={(e) => {
            // maxres isn't always available — fall back to the 16:9 medium thumb
            if (!e.currentTarget.dataset.fb) {
              e.currentTarget.dataset.fb = '1';
              e.currentTarget.src = `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
            }
          }}
        />
        <span className="mr-video__shade" aria-hidden="true" />
        <span className="mr-video__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5 V19 L20 12 Z" /></svg>
        </span>
      </div>
      <div className="mr-video__body">
        <h3 className="mr-video__title">{item.title}</h3>
      </div>
    </button>
  );
}
