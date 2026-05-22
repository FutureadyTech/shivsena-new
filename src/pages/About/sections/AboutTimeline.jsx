import { useState, useMemo, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import aboutContent from '../../../content/about.json';
import './AboutTimeline.css';

const YEAR_ROW_PX = 72;

const EVENT_IMAGES = {
  'marmik':              '/leaders/thackeray.jpg',
  'founding':            '/leaders/thackeray.jpg',
  'first-elections':     '/img-1.webp',
  'border-arrest':       '/leaders/thackeray.jpg',
  'first-mla':           '/leaders/leader-1.jpg',
  'first-mayor':         '/leaders/leader-2.jpg',
  'navalkar':            '/leaders/leader-3.jpg',
  'pradhan-mayor':       '/leaders/dharmaveer.jpg',
  'first-alliance':      '/img-2.webp',
  'alliance-renewed':    '/img-2.webp',
  'bhujbal-exit':        '/leaders/leader-2.jpg',
  'saffron-1995':        '/img-2.webp',
  'rane-cm':             '/leaders/leader-3.jpg',
  'uddhav-exec':         '/leaders/leader-1.jpg',
  'rane-exit':           '/leaders/leader-2.jpg',
  'naik-exit':           '/leaders/leader-3.jpg',
  'balasaheb-passing':   '/leaders/thackeray.jpg',
  'fadnavis-cm':         '/img-1.jpg',
  'uddhav-cm':           '/leaders/leader-1.jpg',
  'shinde-not-reachable':'/leaders/shinde.png',
  'shinde-cm':           '/leaders/shinde.png',
  'official-shivsena':   '/leaders/shinde.png',
  'ls-2024':             '/img-1.jpg',
  'va-2024':             '/img-1.jpg',
  'shinde-dcm':          '/leaders/shinde.png',
};

export default function AboutTimeline() {
  const t = useContent(aboutContent.timeline);
  const events = t.events || [];
  const headerRef = useScrollReveal(0.2);

  const yearGroups = useMemo(() => {
    const map = new Map();
    events.forEach((ev, idx) => {
      const flat = { ...ev, _idx: idx };
      if (!map.has(ev.year)) map.set(ev.year, []);
      map.get(ev.year).push(flat);
    });
    return Array.from(map.entries()).map(([year, items]) => ({
      year,
      items,
      firstIdx: items[0]._idx,
    }));
  }, [events]);

  const [activeIdx, setActiveIdx] = useState(0);
  const goTo = useCallback((i) => setActiveIdx(Math.max(0, Math.min(events.length - 1, i))), [events.length]);

  if (events.length === 0) return null;

  const activeEvent   = events[activeIdx];
  const activeImage   = EVENT_IMAGES[activeEvent.id] || '/img-1.jpg';
  const activeYear    = activeEvent.year;
  const activeYearIdx = yearGroups.findIndex(g => g.year === activeYear);

  return (
    <section className="cgn-tl">
      {/* Background: cream wash + huge blurred शिवसेना watermark */}
      <div className="cgn-tl__bg" aria-hidden="true">
        <div className="cgn-tl__bg-wash" />
        <div className="cgn-tl__watermark">शिवसेना</div>
      </div>

      <div className="cgn-tl__inner" ref={headerRef}>

        {/* Full-height vertical line — sits in column 2, stretches full row height */}
        <div className="cgn-tl__line" aria-hidden="true" />

        {/* ── Left: big active year + arrow ── */}
        <div className="cgn-tl__left">
          <span key={`year-${activeYear}`} className="cgn-tl__big-year">
            {activeYear}
          </span>
          <span className="cgn-tl__arrow" aria-hidden="true">
            <svg viewBox="0 0 48 28" fill="none">
              <path d="M 0 14 L 48 14 L 30 0 L 30 28 Z" fill="currentColor" />
            </svg>
          </span>
        </div>

        {/* ── Center: vertical rail with year dots ── */}
        <div className="cgn-tl__rail">
          <div className="cgn-tl__viewport">
            <ul
              className="cgn-tl__years"
              style={{ top: `calc(50% - ${activeYearIdx * YEAR_ROW_PX + YEAR_ROW_PX / 2}px)` }}
            >
              {yearGroups.map((group) => {
                const isActive = group.year === activeYear;
                return (
                  <li key={group.year} className={`cgn-tl__year ${isActive ? 'is-active' : ''}`}>
                    <button
                      className="cgn-tl__year-btn"
                      onClick={() => goTo(group.firstIdx)}
                      aria-label={`Go to ${group.year}`}
                    >
                      <span className="cgn-tl__year-label">{group.year}</span>
                      <span className="cgn-tl__year-dot" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ── Right: image + content ── */}
        <div className="cgn-tl__content">
          <div className="cgn-tl__media">
            <img
              key={`img-${activeIdx}`}
              src={activeImage}
              alt=""
              className="cgn-tl__img"
              loading="lazy"
            />
          </div>
          <h3 key={`title-${activeIdx}`} className="cgn-tl__title">{activeEvent.title}</h3>
          <div key={`div-${activeIdx}`} className="cgn-tl__divider" aria-hidden="true">
            <span className="cgn-tl__divider-line" />
            <svg className="cgn-tl__divider-mark" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M8 0 L9.4 6.6 L16 8 L9.4 9.4 L8 16 L6.6 9.4 L0 8 L6.6 6.6 Z" fill="currentColor" />
            </svg>
            <span className="cgn-tl__divider-line" />
          </div>
          {activeEvent.body && (
            <p key={`body-${activeIdx}`} className="cgn-tl__body">{activeEvent.body}</p>
          )}
        </div>

      </div>
    </section>
  );
}
