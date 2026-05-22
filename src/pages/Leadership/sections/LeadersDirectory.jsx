import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import leadershipContent from '../../../content/leadership.json';
import { memberFor } from '../utils/transliterate.js';
import './LeadersDirectory.css';

const CATEGORY_ORDER = [
  'mp',
  'mla',
  'leaders',
  'deputyLeaders',
  'divisionalContactHeads',
  'divisionalCoContactHeads',
  'lokSabhaContactHeads',
  'districtHeads',
  'womenDistrictHeads',
];

/* Show only this many per category (test-page cap; remove or raise later) */
const ITEMS_PER_CATEGORY = 5;

/* Gender placeholders (override per-member by setting `photo` in JSON) */
const MALE_PLACEHOLDER   = '/placeholder/placeholder-men.png';
const FEMALE_PLACEHOLDER = '/placeholder/placeholder-women.png';

/* Detect female from Marathi honorifics + the ताई suffix */
const FEMALE_RE = /(^|\s)(सौ\.|श्रीम\.|श्रीमती\.|कु\.|डॉ\.\s*श्रीम\.|डॉ\.\s*श्रीमती\.|ॲड\.\s*सौ\.|प्रा\.\s*सौ\.)/;
const isFemale = (name) => !!name && (FEMALE_RE.test(name) || /ताई/.test(name));

const photoFor = (member) => {
  if (member.photo) return member.photo;
  return isFemale(member.name) ? FEMALE_PLACEHOLDER : MALE_PLACEHOLDER;
};

export default function LeadersDirectory({ activeRegion, onChangeRegion }) {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';

  const t = useContent(leadershipContent.directory);
  const categoryNames = leadershipContent.categories[lang] || leadershipContent.categories.mr;
  const regionNames   = leadershipContent.regions[lang]   || leadershipContent.regions.mr;
  const headerRef = useScrollReveal(0.2);

  /* Build the merged dataset for the active region */
  const groups = useMemo(() => {
    const state = leadershipContent.stateLevel || {};
    const region = leadershipContent.byRegion?.[activeRegion] || {};
    const map = {
      mp:                       region.mp                      || state.mp                       || [],
      mla:                      region.mla                     || state.mla                      || [],
      leaders:                  state.leaders                  || [],
      deputyLeaders:            state.deputyLeaders            || [],
      divisionalContactHeads:   region.divisionalContactHeads   || [],
      divisionalCoContactHeads: region.divisionalCoContactHeads || [],
      lokSabhaContactHeads:     region.lokSabhaContactHeads     || [],
      districtHeads:            region.districtHeads            || [],
      womenDistrictHeads:       region.womenDistrictHeads       || [],
    };
    return CATEGORY_ORDER.map((key) => ({
      key,
      label: categoryNames[key],
      items: (map[key] || []).slice(0, ITEMS_PER_CATEGORY),
    }));
  }, [activeRegion, categoryNames]);

  const title = (t.titleTemplate || '{region}').replace('{region}', regionNames[activeRegion] || '');

  /* Region quick-switch tabs above the categories */
  const regionKeys = Object.keys(leadershipContent.regions[lang] || {});

  return (
    <section className="dir-section">
      <div className="dir-section__inner">

        <div ref={headerRef} className="dir-section__header reveal">
          <div className="dir-section__eyebrow">
            <span className="dir-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 key={`title-${activeRegion}`} className="dir-section__title">{title}</h2>

          <div className="dir-section__tabs" role="tablist">
            {regionKeys.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                className={`dir-section__tab ${key === activeRegion ? 'is-active' : ''}`}
                onClick={() => onChangeRegion?.(key)}
                data-cursor="link"
              >
                {regionNames[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="dir-categories" key={`cats-${activeRegion}`}>
          {groups.map((group) => (
            <CategoryCarousel
              key={group.key}
              label={group.label}
              items={group.items}
              noDataLabel={t.noData}
              prevLabel={t.prevLabel}
              nextLabel={t.nextLabel}
              viewMoreLabel={t.viewMoreLabel}
              lang={lang}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ── Category carousel — horizontal scroll w/ snap + arrow buttons ── */
function CategoryCarousel({ label, items, noDataLabel, prevLabel, nextLabel, viewMoreLabel, lang }) {
  const ref = useScrollReveal(0.12);
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, items]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.dir-card');
    const gap = parseInt(getComputedStyle(el).gap) || 18;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const isEmpty = !items || items.length === 0;

  return (
    <div ref={ref} className="dir-cat reveal">
      <div className="dir-cat__head">
        <h3 className="dir-cat__label">
          {label}
          {!isEmpty && <span className="dir-cat__count">{items.length}</span>}
        </h3>
        {!isEmpty && (
          <div className="dir-cat__controls">
            <button
              type="button"
              className={`dir-cat__arrow ${canPrev ? '' : 'is-disabled'}`}
              onClick={() => scroll(-1)}
              aria-label={prevLabel}
              disabled={!canPrev}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className={`dir-cat__arrow ${canNext ? '' : 'is-disabled'}`}
              onClick={() => scroll(1)}
              aria-label={nextLabel}
              disabled={!canNext}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {isEmpty ? (
        <p className="dir-cat__empty">{noDataLabel}</p>
      ) : (
        <div ref={trackRef} className="dir-cat__track">
          {items.map((m, i) => (
            <MemberCard key={m.id || i} member={m} index={i} viewMoreLabel={viewMoreLabel} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Member card — full-bleed photo, content overlay, hover reveal ── */
function MemberCard({ member, index, viewMoreLabel, lang }) {
  const photo = photoFor(member);
  const { name, role } = memberFor(member, lang);
  return (
    <article
      className="dir-card"
      style={{ '--card-delay': `${(index % 4) * 0.06}s` }}
      data-cursor="link"
    >
      <img src={photo} alt="" loading="lazy" className="dir-card__bg" />
      <div className="dir-card__shade" aria-hidden="true" />

      <div className="dir-card__content">
        <h4 className="dir-card__name">{name}</h4>
        {role && <p className="dir-card__role">{role}</p>}

        <div className="dir-card__reveal">
          {member.phone && (
            <a className="dir-card__phone" href={`tel:${member.phone.replace(/\s+/g, '')}`} data-cursor="link" tabIndex={-1}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 16.5 V20 Q21 22 19 22 Q11 22 5 11 Q5 3 7 3 H10 L12 9 L9.5 10.5 Q11.5 14 14 16 L15.5 13.5 L21 16.5 Z" />
              </svg>
              {member.phone}
            </a>
          )}
          <button type="button" className="dir-card__action" tabIndex={-1}>
            <span>{viewMoreLabel}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
