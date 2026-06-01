/* ═══════════════════════════════════════════════════════════════
   STORYTELLING TIMELINE  (images-only)

   The timeline images now have all the year + title + body text
   baked in (see public/timeline/{YEAR}.jpg). So this component
   only renders the images — no HTML overlays for title / body /
   year / cartouche / dividers. The scroll-pin + nav behaviour is
   preserved so the cinematic transitions still work.
═══════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef, useMemo } from 'react';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './StorytellingTimeline.css';

const resolveImage = (path = '') => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `/${path}`;
};

export default function StorytellingTimeline() {
  const sectionRef = useRef(null);
  const stageRef   = useRef(null);
  const trackRef   = useRef(null);
  const fillRef    = useRef(null);

  const t = useContent(homeContent.storytelling);

  const ERAS = useMemo(() => (t.eras || []).map((era, i) => ({
    number: String(i + 1).padStart(2, '0'),
    year:   era.year || '',
    image:  resolveImage(era.image),
  })), [t]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

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

    const update = () => {
      const sec = sectionRef.current;
      const stage = stageRef.current;
      if (!sec || !stage) return;

      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight;

      let nextState;
      if (rect.top > 0) nextState = 'before';
      else if (rect.bottom <= vh) nextState = 'after';
      else nextState = 'during';

      if (nextState !== lastPinState) {
        if (nextState === 'before') {
          stage.style.position = 'absolute';
          stage.style.top = '0';
          stage.style.bottom = 'auto';
        } else if (nextState === 'after') {
          stage.style.position = 'absolute';
          stage.style.top = 'auto';
          stage.style.bottom = '0';
        } else {
          stage.style.position = 'fixed';
          stage.style.top = '84px';
          stage.style.bottom = 'auto';
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

    const goToSlide = (nextIdx) => {
      if (nextIdx < 0 || nextIdx >= ERAS.length) return false;
      isAnimatingRef.current = true;
      activeIndexRef.current = nextIdx;
      setActiveIndex(nextIdx);
      const top = getSectionAbsTop() + nextIdx * window.innerHeight;
      window.scrollTo({ top, behavior: 'instant' });
      setTimeout(() => { isAnimatingRef.current = false; }, 700);
      return true;
    };

    let accumulated = 0;
    let lastDirection = 0;

    const handleWheel = (e) => {
      if (!isInSection()) { accumulated = 0; return; }
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIdx = activeIndexRef.current + direction;
      if (direction !== lastDirection) { accumulated = 0; lastDirection = direction; }
      if (nextIdx < 0 || nextIdx >= ERAS.length) { accumulated = 0; return; }
      e.preventDefault();
      if (isAnimatingRef.current) return;
      accumulated += Math.abs(e.deltaY);
      if (accumulated < 80) return;
      const now = Date.now();
      if (now - lastWheelTime < 1000) return;
      accumulated = 0;
      lastWheelTime = now;
      goToSlide(nextIdx);
    };

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
    window.addEventListener('scroll',  onScroll, { passive: true });
    window.addEventListener('wheel',   handleWheel, { passive: false });
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

  // ─── MOBILE: simple vertical stack of images ───
  if (!isDesktop) {
    return (
      <section className="story-mobile">
        {ERAS.map((era) => (
          <article key={era.number} className="story-mobile__era story-mobile__era--image-only">
            <img
              src={era.image}
              alt={era.year}
              className="story-mobile__img-full"
              loading="lazy"
            />
          </article>
        ))}
      </section>
    );
  }

  // ─── DESKTOP: pinned cinematic slider, image-only panels ───
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
            <EraPanel key={era.number} era={era} active={i === activeIndex} />
          ))}
        </div>

        <div className="story-cinema__nav">
          {ERAS.map((era, i) => (
            <div
              key={era.number}
              className={`story-cinema__nav-seg ${i === activeIndex ? 'is-active' : ''} ${i < activeIndex ? 'is-passed' : ''}`}
            >
              <span className="story-cinema__nav-bar"></span>
              <span className="story-cinema__nav-year">{era.year}</span>
            </div>
          ))}
        </div>

        {t.scrollHint && (
          <div className="story-cinema__hint">
            <span>{t.scrollHint}</span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── A panel is now just the image, no text overlays.
   The image itself carries the year + title + body. ─── */
function EraPanel({ era, active }) {
  return (
    <div className={`era-panel era-panel--image-only ${active ? 'is-active' : ''}`}>
      <img
        src={era.image}
        alt={era.year}
        className="era-panel__img"
        loading="lazy"
      />
    </div>
  );
}
