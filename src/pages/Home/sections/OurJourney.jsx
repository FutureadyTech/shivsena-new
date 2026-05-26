import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import aboutContent from '../../../content/about.json';
import './OurJourney.css';

/* Convert ASCII digits → Devanagari for Marathi */
const DEV_DIGITS = ['०','१','२','३','४','५','६','७','८','९'];
const toDevDigits = (s) => String(s ?? '').replace(/[0-9]/g, (d) => DEV_DIGITS[+d]);

/* Same image map AboutTimeline uses — keeps the home journey in lock-step
   with the detailed About page. */
const EVENT_IMAGES = {
  'marmik':              '/timeline/image-1.png',
  'founding':            '/timeline/image-2.png',
  'first-elections':     '/timeline/image-3.png',
  'border-arrest':       '/timeline/image-4.png',
  'first-mla':           '/timeline/image-5.png',
  'first-mayor':         '/timeline/image-6.png',
  'navalkar':            '/timeline/image-7.png',
  'pradhan-mayor':       '/timeline/image-8.png',
  'first-alliance':      '/timeline/image-9.png',
  'alliance-renewed':    '/timeline/image-10.png',
  'bhujbal-exit':        '/timeline/image-12.png',
  'saffron-1995':        '/timeline/image-13.png',
  'rane-cm':             '/timeline/image-14.png',
  'uddhav-exec':         '/timeline/image-15.png',
  'rane-exit':           '/timeline/image-16.png',
  'naik-exit':           '/timeline/image-17.png',
  'balasaheb-passing':   '/timeline/image-18.png',
  'fadnavis-cm':         '/timeline/image-19.png',
  'uddhav-cm':           '/timeline/image-20.png',
  'shinde-not-reachable':'/timeline/image-21.png',
  'shinde-cm':           '/timeline/image-22.png',
  'official-shivsena':   '/timeline/image-1.jpg',
  'ls-2024':             '/timeline/image-2.jpg',
  'va-2024':             '/timeline/image-3.jpg',
  'shinde-dcm':          '/timeline/main.png',
};

export default function OurJourney() {
  const t = useContent(aboutContent.timeline);
  const { lang } = useLanguage();
  const isMr = lang === 'mr';
  const fmtYear = (y) => (isMr ? toDevDigits(y) : y);

  const events = t.events || [];
  const headerRef = useScrollReveal(0.2);

  const [activeIdx, setActiveIdx] = useState(0);
  const yearsRowRef = useRef(null);

  /* Build the unique-year list for the bottom strip. Each year jumps to
     the FIRST event in that year. */
  const yearStrip = useMemo(() => {
    const seen = new Map();
    events.forEach((ev, idx) => {
      if (!seen.has(ev.year)) seen.set(ev.year, idx);
    });
    return Array.from(seen.entries()).map(([year, idx]) => ({ year, idx }));
  }, [events]);

  const goTo = useCallback((i) => {
    if (events.length === 0) return;
    const next = Math.max(0, Math.min(events.length - 1, i));
    setActiveIdx(next);
  }, [events.length]);

  const prev = useCallback(() => goTo(activeIdx - 1), [goTo, activeIdx]);
  const next = useCallback(() => goTo(activeIdx + 1), [goTo, activeIdx]);

  /* Keep the active year visible in the horizontal strip — but only
     scroll the strip when the active tick is actually clipped out of
     view. Calling scrollIntoView on every click (even when the tick is
     fully visible) was triggering a smooth-scroll animation that read
     as "shake" alongside the panel re-mount. */
  useEffect(() => {
    const row = yearsRowRef.current;
    if (!row) return;
    const active = row.querySelector('.journey__year-tick.is-active');
    if (!active) return;

    const rowRect    = row.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const isClipped  =
      activeRect.left   < rowRect.left   - 1 ||
      activeRect.right  > rowRect.right  + 1;

    if (isClipped) {
      const offset = active.offsetLeft - row.clientWidth / 2 + active.clientWidth / 2;
      row.scrollTo({ left: offset, behavior: 'auto' });
    }
  }, [activeIdx]);

  if (events.length === 0) return null;

  const activeEvent = events[activeIdx];
  const activeImage = EVENT_IMAGES[activeEvent.id] || '/img-1.webp';
  const activeYearIdx = yearStrip.findIndex((y) => y.year === activeEvent.year);

  /* Heading sourced from the About-Us timeline content (single source
     of truth) — falls back to a sensible default if it ever goes missing. */
  const titleLabel = t.title || (isMr ? 'शिवसेना टाइम लाईन' : 'Shivsena Timeline');
  const prevLabel  = isMr ? 'मागे' : 'Previous';
  const nextLabel  = isMr ? 'पुढे' : 'Next';

  return (
    <section className="journey" id="history">
      {/* Background — swaps on every event change with a slow cross-fade */}
      <div
        key={activeImage}
        className="journey__bg"
        style={{ backgroundImage: `url(${activeImage})` }}
        aria-hidden="true"
      />
      <div className="journey__overlay" aria-hidden="true" />

      <div ref={headerRef} className="journey__inner reveal">

        {/* Big year + active event text (left-aligned, no title above) */}
        <div className="journey__panel" key={`panel-${activeIdx}`}>
          <p className="journey__year">{fmtYear(activeEvent.year)}</p>
          {activeEvent.title && <h3 className="journey__event-title">{activeEvent.title}</h3>}
          {activeEvent.body && <p className="journey__body">{activeEvent.body}</p>}
        </div>

      </div>

      {/* Bottom year strip + prev/next controls. Lifted OUT of __inner so
          it can use the full SECTION width (not the 1400px max-width
          container). Absolute-positioned to the bottom of the section. */}
      <div className="journey__footer">
        <div className="journey__years" ref={yearsRowRef}>
          {/* horizontal hairline that connects every dot */}
          <span className="journey__years-line" aria-hidden="true" />
          {yearStrip.map(({ year, idx }, i) => (
            <button
              key={year}
              type="button"
              className={`journey__year-tick ${i === activeYearIdx ? 'is-active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Go to ${year}`}
            >
              <span className="journey__year-dot" aria-hidden="true" />
              <span className="journey__year-label">{fmtYear(year)}</span>
            </button>
          ))}
        </div>

        <div className="journey__nav">
          <button
            type="button"
            className="journey__nav-btn"
            onClick={prev}
            disabled={activeIdx === 0}
            aria-label={prevLabel}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className="journey__nav-btn"
            onClick={next}
            disabled={activeIdx === events.length - 1}
            aria-label={nextLabel}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
