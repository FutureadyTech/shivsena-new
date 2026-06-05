import React, { useState, useCallback, useMemo, useEffect } from 'react';
import MaharashtraMap from './MaharashtraMap.jsx';
import { useLanguage } from '../../../i18n/LanguageContext';
import mlasByDistrict from '../../../content/mlas-by-district.json';
import leadersByDistrict from '../../../content/leaders-by-district.json';
import {
  DISTRICTS,
  DIVISIONS_ORDER,
  DISTRICTS_BY_DIVISION,
} from '../../../config/districts.js';
import { mrMlaFor, asciiToDevanagari } from '../../Leadership/utils/transliterate.js';
import LeaderPopup from './LeaderPopup.jsx';
import './RegionExplorer.css';

/* Per-division colour used to tint the district paths on the map */
const REGION_COLORS = {
  konkan: '#C44D0E',
  pune: '#D4602A',
  nashik: '#B8390A',
  marathwada: '#E07840',
  amravati: '#A02808',
  vidarbha: '#8C2200',
};

const REGION_LABELS = {
  konkan: { mr: 'कोकण', en: 'Konkan' },
  pune: { mr: 'पुणे', en: 'Pune' },
  nashik: { mr: 'नाशिक', en: 'Nashik' },
  marathwada: { mr: 'मराठवाडा', en: 'Marathwada' },
  amravati: { mr: 'अमरावती', en: 'Amravati' },
  vidarbha: { mr: 'विदर्भ/नागपूर', en: 'Vidarbha' },
};

const UI = {
  mr: {
 eyebrow: '',
 title: 'शिवसेनेचे प्रतिनिधी',
 regionLabel: 'प्रदेश',
 hoverHint: 'नकाशावर प्रदेश निवडा',
 searchPlaceholder: 'नाव, पद किंवा मतदारसंघ शोधा...',
 noResults: 'कोणतेही नेते आढळले नाहीत',
 clearSearch: 'शोध साफ करा',
  },
  en: {
 eyebrow: '',
 title: 'Shivsena Representatives',
 regionLabel: 'Region',
 hoverHint: 'Select a region on the map',
 searchPlaceholder: 'Search by name, role, or constituency...',
 noResults: 'No leaders match your search',
 clearSearch: 'Clear search',
  },
};

export default function RegionExplorer() {
  const { lang: language } = useLanguage();
  const [activeRegion, setActiveRegion] = useState('konkan');
  const [activeDistrict, setActiveDistrict] = useState('mumbai');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeader, setSelectedLeader] = useState(null);

  const lang = (language === 'mr') ? 'mr' : 'en';
  const ui = UI[lang] || UI.en;

  /* Auto-pick the first district of the newly-selected division */
  useEffect(() => {
 const districtsInRegion = DISTRICTS_BY_DIVISION[activeRegion] || [];
 if (districtsInRegion.length && !districtsInRegion.includes(activeDistrict)) {
 setActiveDistrict(districtsInRegion[0]);
 }
  }, [activeRegion, activeDistrict]);

  useEffect(() => { setSearchQuery(''); }, [activeRegion, activeDistrict, lang]);

  const activeDistrictMeta  = DISTRICTS[activeDistrict] || {};
  const activeDistrictLabel = activeDistrictMeta[lang] || activeDistrictMeta.en || activeDistrict;

  /* Members shown in the side panel pull from leaders-by-district.json
     across all 9 categories of the selected district, in the order the
     Leadership page uses. Same source as /leadership, so the homepage
     map stays in sync. */
  const sourceMembers = useMemo(() => {
    const bucket = leadersByDistrict[activeDistrict] || {};
    /* Category labels keyed in Marathi (the JSON is Marathi-native).
       English fallbacks are computed inline for EN mode. */
    const CATEGORY_LABELS_MR = {
      mp: 'खासदार', mla: 'आमदार',
      leaders: 'नेते', deputyLeaders: 'उपनेते',
      divisionalContactHeads: 'विभागीय संपर्कप्रमुख',
      divisionalCoContactHeads: 'विभागीय सह-संपर्कप्रमुख',
      lokSabhaContactHead: 'लोकसभा संपर्कप्रमुख',
      districtHead: 'जिल्हाप्रमुख',
      womenDistrictHeads: 'महिला जिल्हाप्रमुख',
    };
    const CATEGORY_LABELS_EN = {
      mp: 'MP', mla: 'MLA',
      leaders: 'Leader', deputyLeaders: 'Deputy Leader',
      divisionalContactHeads: 'Divisional Contact Head',
      divisionalCoContactHeads: 'Divisional Co-Contact Head',
      lokSabhaContactHead: 'Lok Sabha Contact Head',
      districtHead: 'District Head',
      womenDistrictHeads: 'Women District Head',
    };
    /* Walk categories in display order. Only DISTRICT-SPECIFIC roles —
       the state-level shared rosters (नेते / उपनेते) are intentionally
       excluded here because they're the same for every district and
       belong on the Leadership page, not the homepage map. */
    const seen = new Set();
    const out = [];
    const order = ['mp', 'mla',
                   'divisionalContactHeads', 'divisionalCoContactHeads',
                   'lokSabhaContactHead', 'districtHead', 'womenDistrictHeads'];
    for (const cat of order) {
      const arr = bucket[cat] || [];
      const catLabel = (lang === 'mr' ? CATEGORY_LABELS_MR : CATEGORY_LABELS_EN)[cat];
      for (const m of arr) {
        const dedupKey = (m.name || '') + '|' + (m.role || '') + '|' + (m.phone || '');
        if (seen.has(dedupKey)) continue;
        seen.add(dedupKey);
        /* Build display fields. Names are mostly Marathi; for EN mode
           we still display the Marathi (no client EN names yet) — same
           as the Leadership page does today. */
        const cleanName = (m.name || '').replace(/\s*\|\s*/g, ' · ').trim();
        /* Initials: first letter of first two name tokens after
           stripping honorifics. */
        const initials = cleanName
          .replace(/^(श्री\.?|श्रीम\.?|श्रीमती\.?|सौ\.?|कु\.?|डॉ\.?|खा\.?|आ\.?|मंत्री|मा\.?|Shri\.?|Smt\.?|Dr\.?|Prof\.?|Kha\.?|Mantri)\s*/gi, '')
          .split(/[\s.·]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => [...w][0] || '')
          .join('')
          .toUpperCase();
        /* Suppress the generic "राज्यस्तर" / "State Level" tag — for
           state-level leaders (नेते, उपनेते) the role field is just
           that label, which adds no information next to the category
           it already lives under. Keep specific roles like
           "१५४-मागाठाणे" or "लोकसभा — मुंबई दक्षिण मध्य". */
        const isGenericStateLevel = /^(राज्यस्तर|state\s*level)$/i.test((m.role || '').trim());
        const roleSuffix = (m.role && !isGenericStateLevel) ? ' · ' + m.role : '';
        const role = catLabel + roleSuffix;
        out.push({
          initials: initials || '?',
          name: cleanName,
          role,
          constituency: isGenericStateLevel ? '' : (m.role || ''),
          social: m.social || {},
          photo: m.photo || '',
        });
      }
    }

    /* MLA enrichment: if the same MLA exists in mlas-by-district.json
       (which carries social handles + photos), merge those in. */
    const mlaExtra = (mlasByDistrict[activeDistrict] || {}).mla || [];
    if (mlaExtra.length) {
      const byName = new Map();
      mlaExtra.forEach((m) => {
        const mr = mrMlaFor(m);
        const key = (mr?.name || m.name || '').trim();
        if (key) byName.set(key, m);
      });
      out.forEach((entry) => {
        const enrich = byName.get(entry.name);
        if (enrich) {
          if (!entry.photo && enrich.photo) entry.photo = enrich.photo;
          if (enrich.social) entry.social = { ...enrich.social, ...entry.social };
        }
      });
    }

    return out;
  }, [activeDistrict, lang]);

  const filteredMembers = useMemo(() => {
 const q = searchQuery.trim().toLowerCase();
 if (!q) return sourceMembers;
 return sourceMembers.filter(m =>
 m.name.toLowerCase().includes(q) ||
 m.role.toLowerCase().includes(q) ||
 m.constituency.toLowerCase().includes(q)
 );
  }, [sourceMembers, searchQuery]);

  return (
 <section className="region-explorer">
 <div className="region-explorer__inner">

 {/* Header */}
 <div className="region-explorer__header">
 {ui.eyebrow && (
 <p className="region-explorer__eyebrow">
 <span className="eyebrow-rule" />
 {ui.eyebrow}
 </p>
 )}
 <h2 className="region-explorer__title">{ui.title}</h2>
 </div>

 {/* Body */}
 <div className="region-explorer__body">

 {/* ── MAP SIDE ── */}
 <div className="region-explorer__map-side">
 <div className="region-explorer__svg-wrap">
 <MaharashtraMap
 lang={lang}
 activeDistrict={activeDistrict}
 onSelect={(slug) => {
 const division = DISTRICTS[slug]?.division;
 if (division) setActiveRegion(division);
 setActiveDistrict(slug);
 }}
 className="region-explorer__svg"
 />
 </div>

 </div>

 {/* ── PANEL SIDE ── */}
 <div
 className="region-explorer__panel"
 style={{ '--active-color': REGION_COLORS[activeRegion] }}
 >
 <div className="region-panel__head">
 <h3 className="region-panel__name">{activeDistrictLabel}</h3>
 <div className="region-panel__divider" />
 </div>

 <div className="region-panel__search">
 <svg
 className="region-panel__search-icon"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 aria-hidden="true"
 >
 <circle cx="11" cy="11" r="7" />
 <path d="m21 21-4.3-4.3" />
 </svg>
 <input
 type="text"
 className="region-panel__search-input"
 placeholder={ui.searchPlaceholder}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 aria-label={ui.searchPlaceholder}
 />
 {searchQuery && (
 <button
 type="button"
 className="region-panel__search-clear"
 onClick={() => setSearchQuery('')}
 aria-label={ui.clearSearch}
 >
 ×
 </button>
 )}
 </div>

 <div className="region-panel__members" data-lenis-prevent>
 {filteredMembers.length > 0 ? (
 filteredMembers.map((m, i) => (
 <button
 type="button"
 key={`${activeRegion}-${m.name}-${i}`}
 className="region-member"
 style={{ animationDelay: `${i * 60}ms` }}
 onClick={() => setSelectedLeader(m)}
 aria-label={`${m.name} ${m.role}`}
 >
 <div className={`region-member__avatar ${m.photo ? 'region-member__avatar--photo' : ''}`}>
 {m.photo ? (
 <img src={m.photo} alt="" loading="lazy" onError={(e) => {
 // Fallback: if the image fails to load, swap to the initials text.
 e.currentTarget.style.display = 'none';
 e.currentTarget.parentNode.classList.remove('region-member__avatar--photo');
 e.currentTarget.parentNode.textContent = m.initials;
 }} />
 ) : (
 m.initials
 )}
 </div>
 <div className="region-member__info">
 <p className="region-member__name">{m.name}</p>
 <p className="region-member__role">{m.role}</p>
 <p className="region-member__constituency">{m.constituency}</p>
 </div>
 <div className="region-member__arrow">→</div>
 </button>
 ))
 ) : (
 <p className="region-panel__no-results">{ui.noResults}</p>
 )}
 </div>

 <p className="region-panel__hint">{ui.hoverHint}</p>
 </div>

 </div>
 </div>

 {selectedLeader && (
 <LeaderPopup
 leader={selectedLeader}
 lang={lang}
 regionColor={REGION_COLORS[activeRegion]}
 onClose={() => setSelectedLeader(null)}
 />
 )}
 </section>
  );
}