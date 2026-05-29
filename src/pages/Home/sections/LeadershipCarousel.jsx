import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import leadersContent from '../../../content/leaders.json';
import './LeadershipCarousel.css';

/* True if a leader has a bio page wired up in leaders.json */
const hasProfile = (leaderId) => Boolean(leadersContent[leaderId]);

export default function LeadershipCarousel({ content, gridCols }) {
  const t = useContent(content ?? homeContent.leadership);
  const trackRef = useRef(null);
  const headerRef = useScrollReveal(0.25);
  const isGrid = !!gridCols;

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    if (isGrid) return; // grid mode: no scroll arrows
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, [isGrid]);

  useEffect(() => {
    if (isGrid) return;
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, isGrid]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.leader-card');
    const gap = parseInt(getComputedStyle(el).gap) || 24;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="leadership">
      <div className="leadership__inner">
        <div ref={headerRef} className="leadership__header reveal">
          <div>
            {t.eyebrow && (
              <div className="leadership__eyebrow">
                <span className="leadership__eyebrow-line"></span>
                <span>{t.eyebrow}</span>
              </div>
            )}
            <h2 className="leadership__title">{t.title}</h2>
          </div>

          {!isGrid && (
            <div className="leadership__controls">
              <button
                className={`leadership__arrow ${canPrev ? '' : 'is-disabled'}`}
                onClick={() => scrollByCard(-1)}
                aria-label="Previous leaders"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button
                className={`leadership__arrow ${canNext ? '' : 'is-disabled'}`}
                onClick={() => scrollByCard(1)}
                aria-label="Next leaders"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          className={`leadership__track ${isGrid ? `leadership__track--grid leadership__track--cols-${gridCols}` : ''}`}
        >
          {t.leaders?.map((leader, i) => (
            <LeaderCard key={leader.id} leader={leader} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LeaderCard({ leader, index }) {
  const ref = useScrollReveal(0.15);
  const profileAvailable = hasProfile(leader.id);

  const cardInner = (
    <>
      <div
        className="leader-card__photo"
        style={{ backgroundImage: `url(${leader.image})` }}
      >
        <div className="leader-card__photo-overlay" aria-hidden="true"></div>
      </div>
      <div className="leader-card__meta">
        <h4 className="leader-card__name">{leader.name}</h4>
        <p className="leader-card__role">{leader.role}</p>
        {profileAvailable && (
          <div className="leader-card__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        )}
      </div>
    </>
  );

  /* Whole card becomes a Link when a profile page exists; otherwise
     stays a plain article so the design doesn't change. */
  if (profileAvailable) {
    return (
      <Link
        ref={ref}
        to={`/leader/${leader.id}`}
        className="leader-card leader-card--clickable reveal"
        style={{ '--reveal-delay': `${0.05 + (index % 4) * 0.08}s` }}
        data-cursor="link"
      >
        {cardInner}
      </Link>
    );
  }

  return (
    <article
      ref={ref}
      className="leader-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 4) * 0.08}s` }}
    >
      {cardInner}
    </article>
  );
}
