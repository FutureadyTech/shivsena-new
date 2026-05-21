import { useState, useEffect, useRef, useMemo } from 'react';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import homeContent from '../../../content/home.json';
import './StorytellingTimeline.css';

const resolveImage = (path = '') => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path}`;
};

const extractYear = (str = '') => str.match(/\d{4}/)?.[0] || str;
const extractYearDev = (str = '') => str.match(/[०-९]{4}/)?.[0] || str;

const Star = ({ size = 10, className = '' }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} className={className} aria-hidden="true">
    <path d="M8 0 L9.4 6.6 L16 8 L9.4 9.4 L8 16 L6.6 9.4 L0 8 L6.6 6.6 Z" fill="currentColor" />
  </svg>
);

export default function StorytellingTimeline() {
  const sectionRef = useRef(null);
  const stageRef  = useRef(null);
  const trackRef  = useRef(null);
  const fillRef   = useRef(null);

  const t = useContent(homeContent.storytelling);
  const { lang } = useLanguage();

  const ERAS = useMemo(() => (t.eras || []).map((era, i) => ({
    number:       String(i + 1).padStart(2, '0'),
    year:         extractYear(era.yearLatin),
    yearDev:      era.yearDev,
    yearDevShort: extractYearDev(era.yearDev),
    years:        era.yearLatin,
    title:        era.title,
    short:        era.short,
    body:         era.description,
    image:        resolveImage(era.image),
  })), [t]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef  = useRef(0);
  const isAnimatingRef  = useRef(false);

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 900 : true
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── CSS transition drives the visual — not scroll math ───
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    if (!trackRef.current || ERAS.length === 0) return;

    const p = ERAS.length > 1 ? activeIndex / (ERAS.length - 1) : 0;
    const maxTranslate = (ERAS.length - 1) * window.innerWidth;

    trackRef.current.style.transition = 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)';
    trackRef.current.style.transform  = `translate3d(${-p * maxTranslate}px, 0, 0)`;

    if (fillRef.current) {
      fillRef.current.style.transition = 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)';
      fillRef.current.style.transform  = `scaleX(${p})`;
    }
  }, [activeIndex, ERAS.length]);

  useEffect(() => {
    if (!isDesktop || ERAS.length === 0) return;

    let rafId = 0;
    let lastPinState = '';
    let lastWheelTime = 0;

    // ─── Pin logic only — track movement handled above ───
    const update = () => {
      const sec   = sectionRef.current;
      const stage = stageRef.current;
      if (!sec || !stage) return;

      const rect = sec.getBoundingClientRect();
      const vh   = window.innerHeight;

      let nextState;
      if (rect.top > 0)        nextState = 'before';
      else if (rect.bottom <= vh) nextState = 'after';
      else                      nextState = 'during';

      if (nextState !== lastPinState) {
        if (nextState === 'before') {
          stage.style.position = 'absolute';
          stage.style.top      = '0';
          stage.style.bottom   = 'auto';
        } else if (nextState === 'after') {
          stage.style.position = 'absolute';
          stage.style.top      = 'auto';
          stage.style.bottom   = '0';
        } else {
          stage.style.position = 'fixed';
          stage.style.top      = '84px';
          stage.style.bottom   = 'auto';
        }
        lastPinState = nextState;
      }
    };

    const getSectionAbsTop = () => {
      const sec = sectionRef.current;
      if (!sec) return 0;
      return sec.getBoundingClientRect().top + window.scrollY;
    };

    const isInSection = () => {
      const sec = sectionRef.current;
      if (!sec) return false;
      const rect = sec.getBoundingClientRect();
      return rect.top <= 0 && rect.bottom > window.innerHeight;
    };

    // ─── Go to slide: set state + silently sync scroll pos ───
    const goToSlide = (nextIdx) => {
      if (nextIdx < 0 || nextIdx >= ERAS.length) return false;
      isAnimatingRef.current  = true;
      activeIndexRef.current  = nextIdx;
      setActiveIndex(nextIdx);
      // Sync scroll position instantly so pin math stays correct
      const top = getSectionAbsTop() + nextIdx * window.innerHeight;
      window.scrollTo({ top, behavior: 'instant' });
      setTimeout(() => { isAnimatingRef.current = false; }, 700);
      return true;
    };

let accumulated = 0;
let lastDirection = 0;

const handleWheel = (e) => {
  if (!isInSection()) {
    accumulated = 0;
    return;
  }

  const direction = e.deltaY > 0 ? 1 : -1;
  const nextIdx   = activeIndexRef.current + direction;

  // Reset accumulator if user reverses direction
  if (direction !== lastDirection) {
    accumulated = 0;
    lastDirection = direction;
  }

  // At edges — let scroll escape
  if (nextIdx < 0 || nextIdx >= ERAS.length) {
    accumulated = 0;
    return;
  }

  e.preventDefault();

  if (isAnimatingRef.current) return;

  accumulated += Math.abs(e.deltaY);

  if (accumulated < 80) return;

  const now = Date.now();
  if (now - lastWheelTime < 1000) return;

  accumulated   = 0;
  lastWheelTime = now;
  goToSlide(nextIdx);
};

    // ─── Keyboard ───
    const handleKey = (e) => {
      if (!isInSection() || isAnimatingRef.current) return;
      const isNext = e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ';
      const isPrev = e.key === 'ArrowUp'   || e.key === 'PageUp';
      if (!isNext && !isPrev) return;
      e.preventDefault();
      goToSlide(activeIndexRef.current + (isNext ? 1 : -1));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = 0; update(); });
    };

    update();
    window.addEventListener('scroll',  onScroll,     { passive: true  });
    window.addEventListener('wheel',   handleWheel,  { passive: false });
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize',  update);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll',  onScroll);
      window.removeEventListener('wheel',   handleWheel);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize',  update);
    };
  }, [isDesktop, ERAS.length]);

  if (ERAS.length === 0) return null;

  // ─── MOBILE ───
  if (!isDesktop) {
    return (
      <section className="story-mobile">
        <div className="story-mobile__header">
          <h2 className="story-mobile__title">{t.title}</h2>
        </div>
        {ERAS.map((era) => (
          <article key={era.number} className="story-mobile__era">
            <div className="story-mobile__img" style={{ backgroundImage: `url(${era.image})` }}>
              <div className="story-mobile__img-overlay" aria-hidden="true"></div>
            </div>
            <div className="story-mobile__body">
              <span className="era-cartouche">
                <Star size={8} className="era-cartouche__orn" />
                <span>{lang === 'mr' ? era.yearDev : era.years}</span>
                <Star size={8} className="era-cartouche__orn" />
              </span>
              <h3>{era.title}</h3>
              <div className="era-divider">
                <span className="era-divider__line"></span>
                <Star size={10} className="era-divider__mark" />
                <span className="era-divider__line"></span>
              </div>
              <p className="story-mobile__short">{era.short}</p>
              <p className="story-mobile__text">{era.body}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  // ─── DESKTOP ───
  return (
    <section
      ref={sectionRef}
      className="story-cinema"
      style={{ height: `${ERAS.length * 100}vh` }}
    >
      <div ref={stageRef} className="story-cinema__stage">
        <div className="story-cinema__progress">
          <div ref={fillRef} className="story-cinema__progress-fill"></div>
        </div>

        <div ref={trackRef} className="story-cinema__track">
          {ERAS.map((era, i) => (
            <EraPanel key={era.number} era={era} active={i === activeIndex} lang={lang} />
          ))}
        </div>

        <div className="story-cinema__nav">
          {ERAS.map((era, i) => (
            <div
              key={era.number}
              className={`story-cinema__nav-seg ${i === activeIndex ? 'is-active' : ''} ${i < activeIndex ? 'is-passed' : ''}`}
            >
              <span className="story-cinema__nav-bar"></span>
              <span className="story-cinema__nav-year">
                {lang === 'mr' ? era.yearDevShort : era.year}
              </span>
            </div>
          ))}
        </div>

        <div className="story-cinema__hint">
          <Star size={11} />
          <span>{t.scrollHint}</span>
        </div>
      </div>
    </section>
  );
}

function EraPanel({ era, active, lang }) {
  return (
    <div className={`era-panel ${active ? 'is-active' : ''}`}>
      <div className="era-panel__bg" style={{ backgroundImage: `url(${era.image})` }}></div>
      <div className="era-panel__overlay" aria-hidden="true"></div>
      <div className="era-panel__pattern"  aria-hidden="true"></div>

      <div className="era-panel__year-decor" aria-hidden="true">
        <span className="era-panel__year-dev">
          {lang === 'mr' ? era.yearDev : era.years}
        </span>
      </div>

      <div className="era-panel__content">
        <h3 className="era-text__title">{era.title}</h3>
        <div className="era-divider" aria-hidden="true">
          <span className="era-divider__line"></span>
          <Star size={11} className="era-divider__mark" />
          <span className="era-divider__line"></span>
        </div>
        <p className="era-text__short">{era.short}</p>
        <p className="era-text__body">{era.body}</p>
      </div>
    </div>
  );
}