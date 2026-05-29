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

/* Files in /public/timeline/ flat URL-safe names. */
const EVENT_IMAGES = {
  'marmik': '/timeline/image-1.png',
  'founding': '/timeline/image-2.png',
  'first-elections': '/timeline/image-3.png',
  'border-arrest': '/timeline/image-4.png',
  'first-mla': '/timeline/image-5.png',
  'first-mayor': '/timeline/image-6.png',
  'navalkar': '/timeline/image-7.png',
  'pradhan-mayor': '/timeline/image-8.png',
  'first-alliance': '/timeline/image-9.png',
  'alliance-renewed': '/timeline/image-10.png',
  'bhujbal-exit': '/timeline/image-12.png',
  'saffron-1995': '/timeline/image-13.png',
  'rane-cm': '/timeline/image-14.png',
  'uddhav-exec': '/timeline/image-15.png',
  'rane-exit': '/timeline/image-16.png',
  'naik-exit': '/timeline/image-17.png',
  'balasaheb-passing': '/timeline/image-18.png',
  'fadnavis-cm': '/timeline/image-19.png',
  'uddhav-cm': '/timeline/image-20.png',
  'shinde-not-reachable':'/timeline/image-21.png',
  'shinde-cm': '/timeline/image-22.png',
  'official-shivsena': '/timeline/image-1.jpg',
  'ls-2024': '/timeline/image-2.jpg',
  'va-2024': '/timeline/image-3.jpg',
  'shinde-dcm': '/timeline/main.png',
};

export default function AboutTimeline() {
  const t = useContent(aboutContent.timeline);
  const { lang } = useLanguage();
  const isMr = lang === 'mr';
  const fmtYear = (y) => (isMr ? toDevDigits(y) : y);
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

  const activeEvent = events[activeIdx];
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
