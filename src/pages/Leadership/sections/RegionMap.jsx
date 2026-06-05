import { useState, useMemo } from 'react';
import MaharashtraMap from '../../Home/sections/MaharashtraMap.jsx';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import leadershipContent from '../../../content/leadership.json';
import mlasByDistrict from '../../../content/mlas-by-district.json';
import {
  DISTRICTS,
  DIVISION_LABELS,
  ALL_DISTRICTS,
} from '../../../config/districts.js';
import './RegionMap.css';

/* Per-division colour used to tint the PC paths on the map */
const REGION_COLORS = {
  konkan: '#C44D0E',
  pune: '#D4602A',
  nashik: '#B8390A',
  marathwada: '#E07840',
  amravati: '#A02808',
  vidarbha: '#8C2200',
};

/* Build the district roster once slug + bilingual meta + MLA count */
function buildDistricts() {
  return ALL_DISTRICTS.map((slug) => {
 const meta = DISTRICTS[slug];
 const mlaCount = (mlasByDistrict[slug]?.mla || []).length;
 return {
 slug,
 meta,
 division: meta.division,
 mlaCount,
 };
  });
}

export default function RegionMap({ activeDistrict, onSelectDistrict }) {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';
  const t = useContent(leadershipContent.map);
  const headerRef = useScrollReveal(0.2);

  const [query, setQuery] = useState('');

  const districts = useMemo(buildDistricts, []);

  const filtered = useMemo(() => {
 const q = query.trim().toLowerCase();
 if (!q) return districts;
 return districts.filter((d) =>
 (d.meta.mr || '').toLowerCase().includes(q) ||
 (d.meta.en || '').toLowerCase().includes(q) ||
 d.slug.toLowerCase().includes(q)
 );
  }, [districts, query]);

  return (
 <section className="rmap">
 <div className="rmap__inner">

 <div ref={headerRef} className="rmap__header reveal">
 <div className="rmap__eyebrow">
 <span className="rmap__eyebrow-line" />
 <span>{t.eyebrow}</span>
 </div>
 <h2 className="rmap__title">{t.title}</h2>
 <p className="rmap__lede">{t.lede}</p>
 </div>

 <div className="rmap__layout">

 {/* ── SVG MAP ── */}
 <div className="rmap__svg-wrap">
 <MaharashtraMap
 lang={lang}
 activeDistrict={activeDistrict}
 onSelect={(slug) => onSelectDistrict?.(slug)}
 className="rmap__svg"
 />

 <div className="rmap__hint" aria-hidden="true">
 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="12" y1="5" x2="12" y2="19" />
 <polyline points="19 12 12 19 5 12" />
 </svg>
 <span>{lang === 'mr' ? 'जिल्हा निवडा' : 'PICK A DISTRICT'}</span>
 </div>
 </div>

 {/* ── DISTRICT LIST (flat, searchable) ── */}
 <div className="rmap__legend rmap__legend--districts">
 <div className="rmap__legend-head">
 <div className="rmap__legend-search">
 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <circle cx="11" cy="11" r="7" />
 <line x1="21" y1="21" x2="16.65" y2="16.65" />
 </svg>
 <input
 type="text"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder={lang === 'mr' ? 'जिल्हा शोधा' : 'Search district'}
 className="rmap__legend-search-input"
 aria-label="Search"
 />
 {query && (
 <button
 type="button"
 className="rmap__legend-search-clear"
 onClick={() => setQuery('')}
 aria-label="Clear"
 >×</button>
 )}
 </div>
 </div>

 <div className="rmap__legend-list" data-lenis-prevent>
 {filtered.length === 0 && (
 <p className="rmap__legend-empty">
 {lang === 'mr' ? 'काही सापडले नाही.' : 'No matches found.'}
 </p>
 )}
 {filtered.map((d) => {
 const color = REGION_COLORS[d.division];
 const label = d.meta[lang] || d.meta.en;
 const divLabel =
 DIVISION_LABELS[d.division]?.[lang] ||
 DIVISION_LABELS[d.division]?.en ||
 '';
 const isActive = d.slug === activeDistrict;
 /* Always render the count for consistency "0 आमदार" is
 a real signal that no Shiv Sena MLA is from that district. */
 const countLabel = ` · ${d.mlaCount} ${lang === 'mr' ? 'आमदार' : 'MLAs'}`;
 return (
 <button
 key={d.slug}
 type="button"
 className={`rmap__pill rmap__pill--district ${isActive ? 'rmap__pill--active' : ''}`}
 style={{ '--pill-color': color }}
 onClick={() => onSelectDistrict?.(d.slug)}
 data-cursor="link"
 >
 <span className="rmap__pill-dot" />
 <span className="rmap__pill-body">
 <span className="rmap__pill-label">{label}</span>
 <span className="rmap__pill-sub">{divLabel}{countLabel}</span>
 </span>
 <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rmap__pill-arrow" aria-hidden="true">
 <line x1="5" y1="12" x2="19" y2="12" />
 <polyline points="12 5 19 12 12 19" />
 </svg>
 </button>
 );
 })}
 </div>
 </div>

 </div>
 </div>
 </section>
  );
}
