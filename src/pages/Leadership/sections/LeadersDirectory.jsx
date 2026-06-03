import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import leadershipContent from '../../../content/leadership.json';
import mlasByDistrict from '../../../content/mlas-by-district.json';
import leadersByDistrict from '../../../content/leaders-by-district.json';
import stateLeaders from '../../../content/state-leaders.json';
import { DISTRICTS } from '../../../config/districts.js';
import { memberFor, translateRole, asciiToDevanagari } from '../utils/transliterate.js';
import LeaderPopup from '../../Home/sections/LeaderPopup.jsx';
import './LeadersDirectory.css';

/* Per-division accent colour used for the popup's accent bar / icon hover */
const REGION_COLORS = {
  konkan: '#C44D0E',
  pune: '#D4602A',
  nashik: '#B8390A',
  marathwada: '#E07840',
  amravati: '#A02808',
  vidarbha: '#8C2200',
};

/* Categories shown in the "State Leadership" group (state-wide, not region-filtered) */
const STATE_CATEGORIES = [
  'topLeader',
  'ministers',
  'mp',
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

/* Unified rendering order — exactly as the client specified.
   State-level rows (topLeader / spokespersons) and district-level
   rows interleave inside one continuous list so the page reads
   as one ordered roster instead of two stacked bands.

   `source` tells the renderer where to pull entries from:
     - 'state'    → state-leaders.json (same data for every district)
     - 'district' → leaders-by-district.json filtered to active district
*/
const UNIFIED_CATEGORIES = [
  { key: 'topLeader',                source: 'state'    }, // 1. शिवसेना मुख्य नेते
  { key: 'ministers',                source: 'state'    }, // 2. मंत्री
  { key: 'mp',                       source: 'state'    }, // 3. खासदार
  { key: 'mla',                      source: 'state'    }, // 4. आमदार
  { key: 'leaders',                  source: 'state'    }, // 5. नेते
  { key: 'deputyLeaders',            source: 'state'    }, // 6. उपनेते
  { key: 'spokespersons',            source: 'state'    }, // 7. प्रवक्ते (state-level)
  { key: 'divisionalContactHeads',   source: 'state'    }, // 8. विभागीय संपर्क प्रमुख
  { key: 'divisionalCoContactHeads', source: 'state'    }, // 9. विभागीय सह संपर्क प्रमुख
  { key: 'lokSabhaContactHead',      source: 'state'    }, // 10. लोकसभा संपर्क प्रमुख
  { key: 'districtHead',             source: 'state'    }, // 11. जिल्हा प्रमुख
  { key: 'womenDistrictHeads',       source: 'state'    }, // 12. महिला जिल्हा प्रमुख
];

/* When a category has no real entries for this district, show this
 many placeholder cards so the layout never collapses. */
const EMPTY_PLACEHOLDER_COUNT = 2;
const PLACEHOLDER_LABEL = { mr: 'लवकरच जाहीर', en: 'To be announced' };

/* Per-category display caps. MLA uses district data so a real cap doesn't help;
 everyone else caps at 200 (effectively no cap given real list sizes). */
const ITEMS_PER_CATEGORY = 200;

/* Gender placeholders (override per-member by setting `photo` in JSON) */
const MALE_PLACEHOLDER = '/placeholder/placeholder-men.png';
const FEMALE_PLACEHOLDER = '/placeholder/placeholder-women.png';

/* Detect female from Marathi honorifics + the ताई suffix */
const FEMALE_RE = /(^|\s)(सौ\.|श्रीम\.|श्रीमती\.|कु\.|डॉ\.\s*श्रीम\.|डॉ\.\s*श्रीमती\.|ॲड\.\s*सौ\.|प्रा\.\s*सौ\.)/;
const isFemale = (name) => !!name && (FEMALE_RE.test(name) || /ताई/.test(name));

const photoFor = (member) => {
  if (member.photo) return member.photo;
  /* `female: true` forces the female placeholder for entries whose name
     doesn't trip the honorific heuristic (e.g. महिला जिल्हा प्रमुख). */
  return (member.female || isFemale(member.name)) ? FEMALE_PLACEHOLDER : MALE_PLACEHOLDER;
};

export default function LeadersDirectory({ activeDistrict, onChangeDistrict, mode = 'district' }) {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';

  const t = useContent(leadershipContent.directory);
  const categoryNames = leadershipContent.categories[lang] || leadershipContent.categories.mr;
  const headerRef = useScrollReveal(0.2);

  const isAllMode = mode === 'all';

  /* Resolve the active district's parent division (for fallback data lookups
 against the existing region-level lists). */
  const activeDistrictMeta = DISTRICTS[activeDistrict] || { division: 'konkan' };
  const activeDivision = activeDistrictMeta.division;
  const districtLabel = activeDistrictMeta[lang] || activeDistrictMeta.en || activeDistrict;

  /* "All Leadership" mode header text — shows above the carousels
     when we're ignoring the district filter. Two-line slogan
     rendered via a \n + CSS white-space: pre-line. */
  const allModeTitle = lang === 'mr'
    ? 'व्रत जनसेवेचे,\nनेतृत्व शिवसेनेचे!'
    : 'A Pledge of Public Service,\nThe Leadership of Shiv Sena!';
  const allModeSubtitle = lang === 'mr'
    ? 'संपूर्ण महाराष्ट्रातील सर्व श्रेणींमधील नेतृत्व — कोणत्याही जिल्हा निवडीशिवाय.'
    : 'Every category, statewide — no district filter applied.';

  /* Popup state clicking any member card opens it with that member's info */
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
 twitter: rawSocial.twitter || rawSocial.x || '',
 youtube: rawSocial.youtube || '',
 },
 });
  }, [lang]);

  /* Build the dataset from leaders-by-district.json.
     - mode='district': filter to the active district (existing behaviour)
     - mode='all':      aggregate across every district, dedup by
                        name+role+phone so state-level rosters
                        (नेते / उपनेते) don't show 35× duplicates.
     Every category shows all 9 categories. When a category has zero
     real members we emit EMPTY_PLACEHOLDER_COUNT placeholders so the
     row never collapses. MLA entries are enriched from mlas-by-district
     (which has social handles + photos) where the data exists. */
  const sections = useMemo(() => {
    const allMlaSocials = isAllMode
      ? Object.values(mlasByDistrict || {}).flatMap((d) => (d && d.mla) || [])
      : ((mlasByDistrict[activeDistrict] && mlasByDistrict[activeDistrict].mla) || []);

    /* Merge MLA entries with social-handle data keyed by constituency
       number. Falls back to the unenriched entry from
       leaders-by-district.json when no match exists. */
    const enrichMlas = (entries) => {
      if (!Array.isArray(entries) || entries.length === 0) return entries || [];
      const byConst = new Map();
      for (const m of allMlaSocials) {
        if (m.constituencyNo != null) byConst.set(String(m.constituencyNo), m);
      }
      return entries.map((e) => {
        const enrich = e.constituencyNo != null && byConst.get(String(e.constituencyNo));
        return enrich ? { ...e, ...enrich } : e;
      });
    };

    const placeholdersFor = (categoryKey) => {
      const arr = [];
      for (let i = 0; i < EMPTY_PLACEHOLDER_COUNT; i++) {
        arr.push({
          id: `placeholder-${categoryKey}-${i}`,
          isPlaceholder: true,
          name: PLACEHOLDER_LABEL[lang] || PLACEHOLDER_LABEL.mr,
          role: categoryNames[categoryKey] || '',
          photo: i % 2 === 0 ? MALE_PLACEHOLDER : FEMALE_PLACEHOLDER,
        });
      }
      return arr;
    };

    /* "All Leadership" mode: walk every district, concatenate each
       category, then dedup by name+role+phone. */
    const collectAllForCategory = (key) => {
      const seen = new Set();
      const out = [];
      for (const districtSlug of Object.keys(leadersByDistrict)) {
        const arr = leadersByDistrict[districtSlug]?.[key] || [];
        for (const m of arr) {
          const dedupKey = (m.name || '') + '|' + (m.role || '') + '|' + (m.phone || '');
          if (seen.has(dedupKey)) continue;
          seen.add(dedupKey);
          out.push(m);
        }
      }
      return out;
    };

    const districtBucket = leadersByDistrict[activeDistrict] || {};

    /* Pull items for a single row in the unified list. The `source`
       tag on each entry decides whether we read from district data
       or from the statewide roster. The उ-spokespersons row also
       absorbs the राष्ट्रीय प्रवक्त्या entry so Shayna NC sits next
       to the rest of the प्रवक्ते instead of in a row of one. */
    const itemsFor = (key, source) => {
      if (source === 'state') {
        if (key === 'spokespersons') {
          const nat = (stateLeaders?.nationalSpokesperson) || [];
          const reg = (stateLeaders?.spokespersons)        || [];
          return [...nat, ...reg];
        }
        return (stateLeaders && stateLeaders[key]) || [];
      }
      return isAllMode ? collectAllForCategory(key) : (districtBucket[key] || []);
    };

    const buildGroup = ({ key, source }) => {
      let items = itemsFor(key, source);
      /* Only enrich the district-sourced MLA list from mlas-by-district.
         The state-sourced आमदार roster already carries its own Marathi
         names, photos, and social handles, so enriching would clobber them. */
      if (key === 'mla' && source === 'district') items = enrichMlas(items);
      const isEmpty = items.length === 0;
      return {
        key,
        label: categoryNames[key] || key,
        items: (isEmpty ? placeholdersFor(key) : items).slice(0, ITEMS_PER_CATEGORY),
        isEmpty,
      };
    };

    /* Single ordered section — exactly the 12-step sequence the
       client specified (मुख्य नेते → मंत्री → ... → महिला जिल्हा प्रमुख).
       No more split between state-level and district-level bands. */
    return [
      {
        id: isAllMode ? 'all' : 'district',
        title: '',
        subtitle: '',
        groups: UNIFIED_CATEGORIES.map(buildGroup),
      },
    ];
  }, [activeDistrict, categoryNames, lang, isAllMode]);

  const title = isAllMode
    ? allModeTitle
    : (t.titleTemplate || '{region}').replace('{region}', districtLabel);

  /* Subtitle text — restored under the H2 (it used to sit inside
     the inner group-head band which we removed earlier). */
  const subtitle = isAllMode ? allModeSubtitle : t.regionalSubtitle;

  return (
 <section className="dir-section">
 <div className="dir-section__inner">

 <div ref={headerRef} className="dir-section__header reveal">
 <h2 key={`title-${activeDistrict}`} className="dir-section__title">{title}</h2>
 </div>

 <div className="dir-categories" key={`cats-${activeDistrict}`}>
 {sections.map((section) => (
 <div key={section.id} className={`dir-section-group dir-section-group--${section.id}`}>
 {section.title && (
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
 )}
 {section.groups.map((group) => (
 <CategoryCarousel
 key={group.key}
 catKey={group.key}
 label={group.label}
 items={group.items}
 isEmpty={group.isEmpty}
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

/* ── Category carousel horizontal scroll w/ snap + arrow buttons ── */
function CategoryCarousel({ catKey, label, items, isEmpty, noDataLabel, prevLabel, nextLabel, viewMoreLabel, lang, onSelect }) {
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

  /* `isEmpty` from the parent already tells us if the items are
 real or placeholders. We still render the carousel even when
 empty just with placeholder cards inside. */
  const noItems = !items || items.length === 0;
  const realCount = isEmpty ? 0 : items.length;
  const showArrows = !isEmpty && items.length > 1;

  const isTopLeader = catKey === 'topLeader';

  return (
 <div ref={ref} className={`dir-cat reveal${catKey ? ` dir-cat--${catKey}` : ''}`}>
 <div className="dir-cat__head">
 <h3 className="dir-cat__label">
 {label}
 {!isEmpty && !isTopLeader && <span className="dir-cat__count">{realCount}</span>}
 </h3>
 {showArrows && (
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

 {noItems ? (
 <p className="dir-cat__empty">{noDataLabel}</p>
 ) : (
 <div ref={trackRef} className="dir-cat__track">
 {items.map((m, i) => (
 <MemberCard
 key={m.id || i}
 member={m}
 index={i}
 catKey={catKey}
 viewMoreLabel={viewMoreLabel}
 lang={lang}
 onSelect={onSelect}
 />
 ))}
 </div>
 )}
 </div>
  );
}


/* ── Member card full-bleed photo, content overlay, hover reveal.
 Only the inline "View more" button opens the LeaderPopup. The card
 itself isn't clickable so social / phone links keep their own behaviour.
 Placeholder members reuse the same layout but skip the socials /
 view-more action so the card reads as "to be announced". ── */
function MemberCard({ member, index, catKey, viewMoreLabel, lang, onSelect }) {
  const photo = photoFor(member);
  const { name, role } = memberFor(member, lang);
  const socials = member.social || {};
  const isPlaceholder = !!member.isPlaceholder;

  /* खासदार cards show the लोकसभा क्षेत्र (constituency) below the name.
     Falls back to the `note` (e.g. राज्यसभा) when there's no constituency. */
  /* नेते (leaders) and उपनेते (deputyLeaders) cards show the name only —
     the role badge is hidden for these two categories. */
  const hideRole = catKey === 'leaders' || catKey === 'deputyLeaders';

  let constituency = '';
  if (catKey === 'mp' && !isPlaceholder) {
 if (member.constituency) {
 const place = lang === 'mr' ? member.constituency : translateRole(member.constituency);
 const num = member.constituencyNo != null
 ? (lang === 'mr' ? asciiToDevanagari(String(member.constituencyNo)) : String(member.constituencyNo))
 : '';
 constituency = num ? `${num} - ${place}` : place;
 } else if (member.note) {
 constituency = lang === 'mr' ? member.note : translateRole(member.note);
 }
  }

  return (
 <article
 className={`dir-card${isPlaceholder ? ' dir-card--placeholder' : ''}`}
 style={{ '--card-delay': `${(index % 4) * 0.06}s` }}
 >
 <img src={photo} alt="" loading="lazy" className="dir-card__bg" />
 <div className="dir-card__shade" aria-hidden="true" />

 <div className="dir-card__content">
 <h4 className="dir-card__name">{name}</h4>
 {role && !hideRole && <p className="dir-card__role">{role}</p>}
 {constituency && <p className="dir-card__role dir-card__constituency">{constituency}</p>}

 {!isPlaceholder && (
 <div className="dir-card__reveal">
 <SocialIcons socials={socials} phone={member.phone} email={member.email} />

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
 )}
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
  email: (
 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <rect x="2" y="4" width="20" height="16" rx="2" />
 <path d="m22 6-10 7L2 6" />
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
function SocialIcons({ socials, phone, email }) {
  const safe = socials || {};
  const candidates = [
 { key: 'facebook',  href: safe.facebook, label: 'Facebook' },
 { key: 'twitter', href: safe.twitter || safe.x, label: 'X / Twitter' },
 { key: 'instagram', href: safe.instagram, label: 'Instagram' },
  ];

  const cleanPhone = (phone || '').toString().trim();
  if (cleanPhone) {
 candidates.push({
 key: 'phone',
 href: `tel:${cleanPhone.replace(/\s+/g, '')}`,
 label: `Call ${cleanPhone}`,
 });
  }

  const cleanEmail = (email || '').toString().trim();
  if (cleanEmail) {
 candidates.push({
 key: 'email',
 href: `mailto:${cleanEmail}`,
 label: `Email ${cleanEmail}`,
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
