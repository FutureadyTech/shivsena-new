import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import leadershipContent from '../../../content/leadership.json';
import mlasByDistrict from '../../../content/mlas-by-district.json';
import { DISTRICTS } from '../../../config/districts.js';
import { memberFor } from '../utils/transliterate.js';
import LeaderPopup from '../../Home/sections/LeaderPopup.jsx';
import './LeadersDirectory.css';

/* Per-division accent colour used for the popup's accent bar / icon hover */
const REGION_COLORS = {
  konkan:     '#C44D0E',
  pune:       '#D4602A',
  nashik:     '#B8390A',
  marathwada: '#E07840',
  amravati:   '#A02808',
  vidarbha:   '#8C2200',
};

/* Categories shown in the "State Leadership" group (state-wide, not region-filtered) */
const STATE_CATEGORIES = [
  'topLeader',
  'ministers',
  'mlc',
  'leaders',
  'deputyLeaders',
  'treasurer',
  'generalSecretary',
  'secretaries',
  'coSecretaries',
  'nationalSpokesperson',
  'spokespersons',
  'coordinators',
  'socialMedia',
  'yuvaSena',
];

/* Categories shown in the "Regional & District" group (filtered by activeDivision) */
const REGIONAL_CATEGORIES = [
  'mla',
  'divisionalContactHeads',
  'divisionalCoContactHeads',
  'womenDistrictHeads',
];

/* Per-category display caps. MLA uses district data so a real cap doesn't help;
   everyone else caps at 200 (effectively no cap given real list sizes). */
const ITEMS_PER_CATEGORY = 200;

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

export default function LeadersDirectory({ activeDistrict, onChangeDistrict }) {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';

  const t = useContent(leadershipContent.directory);
  const categoryNames = leadershipContent.categories[lang] || leadershipContent.categories.mr;
  const headerRef = useScrollReveal(0.2);

  /* Resolve the active district's parent division (for fallback data lookups
     against the existing region-level lists). */
  const activeDistrictMeta = DISTRICTS[activeDistrict] || { division: 'konkan' };
  const activeDivision = activeDistrictMeta.division;
  const districtLabel = activeDistrictMeta[lang] || activeDistrictMeta.en || activeDistrict;

  /* Popup state — clicking any member card opens it with that member's info */
  const [selectedLeader, setSelectedLeader] = useState(null);

  const openLeader = useCallback((member) => {
    const { name, role } = memberFor(member, lang);
    let constituency = '';
    if (member.constituencyNo && member.constituency) {
      constituency = `${member.constituencyNo}-${member.constituency}`;
    } else if (member.constituency) {
      constituency = member.constituency;
    }
    const rawSocial = member.social || {};
    setSelectedLeader({
      name,
      role: role || '',
      constituency,
      photo: member.photo || photoFor(member),
      description: member.description,
      social: {
        instagram: rawSocial.instagram || '',
        facebook:  rawSocial.facebook  || '',
        twitter:   rawSocial.twitter   || rawSocial.x || '',
        youtube:   rawSocial.youtube   || '',
      },
    });
  }, [lang]);

  /* Build the merged dataset.
     State-level categories come from leadershipContent.stateLevel and are NOT
     filtered by district — they're the party-wide leadership directory.
     Regional categories come from leadershipContent.byRegion[activeDivision].
     MLA is special: the active district's MLAs are fetched from mlasByDistrict
     (which has the social-handle data) and fall back to the regional MLA list. */
  const sections = useMemo(() => {
    const state = leadershipContent.stateLevel || {};
    const region = leadershipContent.byRegion?.[activeDivision] || {};
    const districtData = mlasByDistrict[activeDistrict] || {};

    const stateMap = {
      topLeader:            state.topLeader            || [],
      ministers:            state.ministers            || [],
      mlc:                  state.mlc                  || [],
      leaders:              state.leaders              || [],
      deputyLeaders:        state.deputyLeaders        || [],
      treasurer:            state.treasurer            || [],
      generalSecretary:     state.generalSecretary     || [],
      secretaries:          state.secretaries          || [],
      coSecretaries:        state.coSecretaries        || [],
      nationalSpokesperson: state.nationalSpokesperson || [],
      spokespersons:        state.spokespersons        || [],
      coordinators:         state.coordinators         || [],
      socialMedia:          state.socialMedia          || [],
      yuvaSena:             state.yuvaSena             || [],
    };

    const regionalMap = {
      mla:                      districtData.mla               || region.mla                     || [],
      divisionalContactHeads:   region.divisionalContactHeads   || [],
      divisionalCoContactHeads: region.divisionalCoContactHeads || [],
      womenDistrictHeads:       region.womenDistrictHeads       || [],
    };

    const buildGroup = (key, map) => ({
      key,
      label: categoryNames[key] || key,
      items: (map[key] || []).slice(0, ITEMS_PER_CATEGORY),
    });

    return [
      /* District-specific data first — these are the leaders the user
         expects to see when they click a district pill. */
      {
        id: 'regional',
        title: t.regionalHeader,
        subtitle: t.regionalSubtitle,
        groups: REGIONAL_CATEGORIES.map((k) => buildGroup(k, regionalMap)),
      },
      /* State-wide party hierarchy — shown below so it's clearly secondary
         and labelled as state-wide, not district-specific. */
      {
        id: 'state',
        title: t.stateHeader,
        subtitle: t.stateSubtitle,
        groups: STATE_CATEGORIES.map((k) => buildGroup(k, stateMap)),
      },
    ];
  }, [activeDistrict, activeDivision, categoryNames, t.stateHeader, t.regionalHeader, t.stateSubtitle, t.regionalSubtitle]);

  const title = (t.titleTemplate || '{region}').replace('{region}', districtLabel);

  return (
    <section className="dir-section">
      <div className="dir-section__inner">

        <div ref={headerRef} className="dir-section__header reveal">
          <div className="dir-section__eyebrow">
            <span className="dir-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 key={`title-${activeDistrict}`} className="dir-section__title">{title}</h2>
        </div>

        <div className="dir-categories" key={`cats-${activeDistrict}`}>
          {sections.map((section) => (
            <div key={section.id} className={`dir-section-group dir-section-group--${section.id}`}>
              <div className="dir-group-head">
                <span className="dir-group-rule" />
                <div className="dir-group-titlewrap">
                  <h3 className="dir-group-title">{section.title}</h3>
                  {section.subtitle && (
                    <p className="dir-group-subtitle">{section.subtitle}</p>
                  )}
                </div>
                <span className="dir-group-rule" />
              </div>
              {section.groups.map((group) => (
                <CategoryCarousel
                  key={group.key}
                  label={group.label}
                  items={group.items}
                  noDataLabel={t.noData}
                  prevLabel={t.prevLabel}
                  nextLabel={t.nextLabel}
                  viewMoreLabel={t.viewMoreLabel}
                  lang={lang}
                  onSelect={openLeader}
                />
              ))}
            </div>
          ))}
        </div>

      </div>

      {selectedLeader && (
        <LeaderPopup
          leader={selectedLeader}
          lang={lang}
          regionColor={REGION_COLORS[activeDivision] || '#C44D0E'}
          onClose={() => setSelectedLeader(null)}
        />
      )}
    </section>
  );
}

/* ── Category carousel — horizontal scroll w/ snap + arrow buttons ── */
function CategoryCarousel({ label, items, noDataLabel, prevLabel, nextLabel, viewMoreLabel, lang, onSelect }) {
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
            <MemberCard key={m.id || i} member={m} index={i} viewMoreLabel={viewMoreLabel} lang={lang} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Member card — full-bleed photo, content overlay, hover reveal.
   Only the inline "View more" button opens the LeaderPopup. The card
   itself isn't clickable so social / phone links keep their own behaviour. ── */
function MemberCard({ member, index, viewMoreLabel, lang, onSelect }) {
  const photo = photoFor(member);
  const { name, role } = memberFor(member, lang);
  const socials = member.social || {};
  return (
    <article
      className="dir-card"
      style={{ '--card-delay': `${(index % 4) * 0.06}s` }}
    >
      <img src={photo} alt="" loading="lazy" className="dir-card__bg" />
      <div className="dir-card__shade" aria-hidden="true" />

      <div className="dir-card__content">
        <h4 className="dir-card__name">{name}</h4>
        {role && <p className="dir-card__role">{role}</p>}

        <div className="dir-card__reveal">
          <SocialIcons socials={socials} phone={member.phone} />

          <button
            type="button"
            className="dir-card__action"
            data-cursor="link"
            onClick={() => onSelect?.(member)}
          >
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

/* ── Glyph map: one SVG per social platform ── */
const SOCIAL_GLYPHS = {
  facebook: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H8v-2.9h2.44V9.84c0-2.4 1.44-3.73 3.63-3.73 1.05 0 2.15.19 2.15.19v2.37h-1.21c-1.2 0-1.57.74-1.57 1.5V12h2.67l-.43 2.9h-2.24v6.98A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.84l-5.36-6.93L4.56 22H1.3l8.04-9.18L1 2h6.98l4.84 6.36L18.244 2Zm-1.2 18h1.9L7.04 4H5.05l11.994 16Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
};

const isValidSocial = (v) => {
  const s = (v || '').toString().trim();
  return !!s && s !== '#' && !/account\s*nahi|nahiye/i.test(s);
};

/* ── Social icons row (revealed on card hover) ───────────────────
   Renders Facebook, X/Twitter, Instagram, and a Call icon (only when
   the member has a phone number). Social platforms with no handle
   show as muted, non-clickable spans so every card stays visually
   consistent; the phone slot is omitted entirely when no number. */
function SocialIcons({ socials, phone }) {
  const safe = socials || {};
  const candidates = [
    { key: 'facebook',  href: safe.facebook,                  label: 'Facebook' },
    { key: 'twitter',   href: safe.twitter || safe.x,         label: 'X / Twitter' },
    { key: 'instagram', href: safe.instagram,                 label: 'Instagram' },
  ];

  const cleanPhone = (phone || '').toString().trim();
  if (cleanPhone) {
    candidates.push({
      key: 'phone',
      href: `tel:${cleanPhone.replace(/\s+/g, '')}`,
      label: `Call ${cleanPhone}`,
    });
  }

  return (
    <div className="dir-card__socials" aria-label="Social profiles">
      {candidates.map((s) => {
        const hasLink = isValidSocial(s.href);
        const className = `dir-card__social dir-card__social--${s.key}${hasLink ? '' : ' is-disabled'}`;
        const glyph = SOCIAL_GLYPHS[s.key];
        if (!hasLink) {
          return (
            <span
              key={s.key}
              className={className}
              aria-label={`${s.label} (unavailable)`}
              aria-disabled="true"
            >
              {glyph}
            </span>
          );
        }
        return (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            aria-label={s.label}
          >
            {glyph}
          </a>
        );
      })}
    </div>
  );
}
