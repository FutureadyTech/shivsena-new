import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import aboutContent from '../../../content/about.json';
import './OurJourney.css';

/* Convert ASCII digits → Devanagari for Marathi */
const DEV_DIGITS = ['०','१','२','३','४','५','६','७','८','९'];
const toDevDigits = (s) => String(s ?? '').replace(/[0-9]/g, (d) => DEV_DIGITS[+d]);

/* Year-keyed image map — each new timeline image has the year + title +
   body baked in, so the panel text overlays have been removed. */
const EVENT_IMAGES = {
  'year-1960':  '/timeline/1960.jpg',
  'year-1966':  '/timeline/1966.jpg',
  'year-1967':  '/timeline/1967.jpg',
  'year-1969':  '/timeline/1969.jpg',
  'year-1970':  '/timeline/1970.jpg',
  'year-1971':  '/timeline/1971.jpg',
  'year-1972a': '/timeline/1972.jpg',
  'year-1972b': '/timeline/1972-2.jpg',
  'year-1984':  '/timeline/1984.jpg',
  'year-1989':  '/timeline/1989.jpg',
  'year-1995a': '/timeline/1995.jpg',
  'year-1995b': '/timeline/1995-2.jpg',
  'year-2012':  '/timeline/2012.jpg',
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

  /* Keep the active year visible in the horizontal strip but only
 scroll the strip when the active tick is actually clipped out of
 view. Calling scrollIntoView on every click (even when the tick is
 fully visible) was triggering a smooth-scroll animation that read
 as "shake" alongside the panel re-mount. */
  useEffect(() => {
 const row = yearsRowRef.current;
 if (!row) return;
 const active = row.querySelector('.journey__year-tick.is-active');
 if (!active) return;

 const rowRect = row.getBoundingClientRect();
 const activeRect = active.getBoundingClientRect();
 const isClipped  =
 activeRect.left < rowRect.left - 1 ||
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
 of truth) falls back to a sensible default if it ever goes missing. */
  const titleLabel = t.title || (isMr ? 'शिवसेना टाइम लाईन' : 'Shivsena Timeline');
  const prevLabel  = isMr ? 'मागे' : 'Previous';
  const nextLabel  = isMr ? 'पुढे' : 'Next';

  return (
 <section className="journey" id="history">
 {/* Background swaps on every event change with a slow cross-fade */}
 <div
 key={activeImage}
 className="journey__bg"
 style={{ backgroundImage: `url(${activeImage})` }}
 aria-hidden="true"
 />

 <div ref={headerRef} className="journey__inner reveal">

 {/* Image-only mode: panel renders ONLY when text content exists.
     New timeline images have year + title + body baked in, so the
     text overlays are skipped. */}
 {(activeEvent.title || activeEvent.body) && (
 <div className="journey__panel" key={`panel-${activeIdx}`}>
 <p className="journey__year">{fmtYear(activeEvent.year)}</p>
 {activeEvent.title && <h3 className="journey__event-title">{activeEvent.title}</h3>}
 {activeEvent.body && <p className="journey__body">{activeEvent.body}</p>}
 </div>
 )}

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
