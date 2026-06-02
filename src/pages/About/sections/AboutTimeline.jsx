import { useState, useMemo, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import aboutContent from '../../../content/about.json';
import './AboutTimeline.css';

/* Convert ASCII digits → Devanagari digits when site is in Marathi */
const DEV_DIGITS = ['०','१','२','३','४','५','६','७','८','९'];
const toDevDigits = (s) => String(s ?? '').replace(/[0-9]/g, (d) => DEV_DIGITS[+d]);

const YEAR_ROW_PX = 72;

/* Maps each timeline event-id to the new year-named image at
   /public/timeline/{year}.jpg. The new images have the year,
   title, and body text baked into the artwork itself — so the
   HTML title / divider / body overlays below are intentionally
   not rendered (they'd duplicate what's in the image).

   Events not in this map are filtered out of the timeline until
   matching artwork is supplied. */
const EVENT_IMAGES = {
  'year-1960':  '/timeline/1960.webp',
  'year-1966':  '/timeline/1966.webp',
  'year-1967':  '/timeline/1967.webp',
  'year-1969':  '/timeline/1969.webp',
  'year-1970':  '/timeline/1970.webp',
  'year-1971':  '/timeline/1971.webp',
  'year-1972a': '/timeline/1972.webp',
  'year-1972b': '/timeline/1972-2.webp',
  'year-1984':  '/timeline/1984.webp',
  'year-1989':  '/timeline/1989.webp',
  'year-1995a': '/timeline/1995.webp',
  'year-1995b': '/timeline/1995-2.webp',
  'year-2012':  '/timeline/2012.webp',
  'year-2014':  '/timeline/2014.webp',
  'year-2022':  '/timeline/2022.webp',
  'year-2023':  '/timeline/2023.webp',
  'year-2024a': '/timeline/2024.webp',
  'year-2024b': '/timeline/2024-2.webp',
  'year-2024c': '/timeline/2024-3.webp',
};

export default function AboutTimeline() {
  const t = useContent(aboutContent.timeline);
  const { lang } = useLanguage();
  const isMr = lang === 'mr';
  const fmtYear = (y) => (isMr ? toDevDigits(y) : y);
  /* Show only events that have a matching image. Anything without
     artwork is hidden until the client supplies it — prevents the
     "year-only" empty-image card the user reported. */
  const events = (t.events || []).filter((ev) => Boolean(EVENT_IMAGES[ev.id]));
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

  /* Guard activeIdx if the filter shrinks the list below the
     stored index (e.g. on a hot-reload). */
  const safeIdx = Math.min(activeIdx, events.length - 1);
  const activeEvent = events[safeIdx];
  const activeImage = EVENT_IMAGES[activeEvent.id] || '/img-1.jpg';
  const activeYear = activeEvent.year;
  const activeYearIdx = yearGroups.findIndex(g => g.year === activeYear);

  return (
 <section className="cgn-tl" id="history">
 {/* Background: cream wash + huge blurred शिवसेना watermark */}
 <div className="cgn-tl__bg" aria-hidden="true">
 <div className="cgn-tl__bg-wash" />
 <div className="cgn-tl__watermark">शिवसेना</div>
 </div>

 <div className="cgn-tl__inner" ref={headerRef}>

 {/* Full-height vertical line sits in column 2, stretches full row height */}
 <div className="cgn-tl__line" aria-hidden="true" />

 {/* ── Left: big active year + arrow ── */}
 <div className="cgn-tl__left">
 <span key={`year-${activeYear}`} className="cgn-tl__big-year">
 {fmtYear(activeYear)}
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
 <span className="cgn-tl__year-label">{fmtYear(group.year)}</span>
 <span className="cgn-tl__year-dot" />
 </button>
 </li>
 );
 })}
 </ul>
 </div>
 </div>

 {/* ── Right: image only (the artwork already contains the
        year + title + body text, so HTML overlays were dropped). ── */}
 <div className="cgn-tl__content cgn-tl__content--image-only">
 <div className="cgn-tl__media cgn-tl__media--full">
 <img
 key={`img-${safeIdx}`}
 src={activeImage}
 alt={activeEvent.title || ''}
 className="cgn-tl__img"
 loading="lazy"
 />
 </div>
 </div>

 </div>
 </section>
  );
}
