import { useMemo, useState } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import declarationsContent from '../../../content/declarations.json';
import './ElectionDeclarations.css';

const SOURCE_URL = 'https://shivsenacentraloffice.com/main.asp?page=ecinorm';

/* When a form is "Available" on the source page but we don't yet have a
   direct PDF URL hosted on this site, we link back to the source page so
   users still reach the actual filing. */
function formLink(available) {
  return available ? SOURCE_URL : null;
}

/* Per-cycle icons — small SVG glyphs rendered inside each tab */
const CYCLE_ICONS = {
  /* State assembly (Vidhan Sabha) — building with central flag */
  'vidhan-sabha-2024': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21 H21" />
      <path d="M5 21 V11 M9 21 V11 M15 21 V11 M19 21 V11" />
      <path d="M3 11 H21" />
      <path d="M4 11 L12 5 L20 11" />
      <path d="M12 5 V2" />
    </svg>
  ),
  /* Lok Sabha — domed parliament */
  'lok-sabha-2024': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21 H21" />
      <path d="M5 21 V13 M19 21 V13" />
      <path d="M4 13 H20" />
      <path d="M5 13 a7 7 0 0 1 14 0" />
      <path d="M12 6 V3" />
      <line x1="9" y1="21" x2="9" y2="14" />
      <line x1="15" y1="21" x2="15" y2="14" />
    </svg>
  ),
  /* Council chamber — podium / pillar */
  'council-2025': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="9" width="16" height="2" />
      <path d="M7 11 V20 M12 11 V20 M17 11 V20" />
      <path d="M3 20 H21" />
      <path d="M5 9 L12 4 L19 9" />
    </svg>
  ),
  /* Graduate constituency — graduation cap */
  graduate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 9 L12 4 L22 9 L12 14 Z" />
      <path d="M6 11 V16 a6 3 0 0 0 12 0 V11" />
      <line x1="22" y1="9" x2="22" y2="14" />
    </svg>
  ),
  /* Maharashtra Council biennial — chamber with stars */
  'council-2024-biennial': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="9" width="16" height="2" />
      <path d="M7 11 V20 M12 11 V20 M17 11 V20" />
      <path d="M3 20 H21" />
      <path d="M5 9 L12 4 L19 9" />
      <circle cx="12" cy="7" r="0.6" fill="currentColor" />
    </svg>
  ),
  /* Rajya Sabha — circular chamber */
  'rajya-sabha-2026': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="13" r="7" />
      <path d="M5 13 a7 7 0 0 1 14 0" />
      <line x1="12" y1="6" x2="12" y2="3" />
      <line x1="6" y1="20" x2="18" y2="20" />
    </svg>
  ),
  /* Vidhan Parishad — chamber with arched roof */
  'vidhan-parishad-2026': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 21 V11 a8 6 0 0 1 16 0 V21" />
      <line x1="3" y1="21" x2="21" y2="21" />
      <path d="M8 21 V14 M12 21 V14 M16 21 V14" />
    </svg>
  ),
};

export default function ElectionDeclarations() {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';
  const t = useContent(declarationsContent.elections);
  const cycles = declarationsContent.cycles;

  const headerRef = useScrollReveal(0.2);

  const [activeId, setActiveId] = useState(cycles[0]?.id);
  const [query, setQuery]       = useState('');

  const active = cycles.find((c) => c.id === activeId) || cycles[0];

  /* Group candidates either by phase (Lok Sabha) or as a single flat group */
  const groups = useMemo(() => {
    if (!active) return [];
    if (active.groups) {
      return active.groups.map((g) => ({
        title: lang === 'mr' ? g.phaseMr : g.phase,
        candidates: g.candidates,
      }));
    }
    return [{ title: null, candidates: active.candidates || [] }];
  }, [active, lang]);

  /* Apply search filter across groups; preserves grouping */
  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        candidates: g.candidates.filter((c) =>
          `${c.no}`.includes(q) ||
          (c.candidate || '').toLowerCase().includes(q) ||
          (c.constituency || '').toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.candidates.length > 0);
  }, [groups, query]);

  const totalCount = useMemo(
    () => groups.reduce((acc, g) => acc + g.candidates.length, 0),
    [groups]
  );
  const filteredCount = useMemo(
    () => filteredGroups.reduce((acc, g) => acc + g.candidates.length, 0),
    [filteredGroups]
  );

  return (
    <section className="eci">
      <div className="eci__inner">

        {/* Header */}
        <div ref={headerRef} className="eci__header reveal">
          <div className="eci__eyebrow">
            <span className="eci__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="eci__title">{t.title}</h2>
          <p className="eci__lede">{t.lede}</p>
        </div>

        {/* Tab bar — one tab per election cycle */}
        <div className="eci__tabs" role="tablist" aria-label="Election cycles">
          {cycles.map((c) => {
            const label = lang === 'mr' ? c.labelMr : c.labelEn;
            const sub   = lang === 'mr' ? c.subMr   : c.subEn;
            const count = c.groups
              ? c.groups.reduce((s, g) => s + g.candidates.length, 0)
              : (c.candidates || []).length;
            const isActive = c.id === activeId;
            const icon    = CYCLE_ICONS[c.id];
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`eci__tab ${isActive ? 'eci__tab--active' : ''}`}
                onClick={() => { setActiveId(c.id); setQuery(''); }}
              >
                {icon && <span className="eci__tab-icon" aria-hidden="true">{icon}</span>}
                <span className="eci__tab-body">
                  <span className="eci__tab-label">{label}</span>
                  <span className="eci__tab-sub">{sub}</span>
                </span>
                <span className="eci__tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar — search + count */}
        <div className="eci__toolbar">
          <div className="eci__search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />
            {query && (
              <button
                type="button"
                className="eci__search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear"
              >×</button>
            )}
          </div>
          <p className="eci__count">
            {t.showingLabel} <strong>{filteredCount}</strong> {t.totalLabel} <strong>{totalCount}</strong>
          </p>
        </div>

        {/* Results */}
        <div className="eci__results" data-lenis-prevent>
          {filteredCount === 0 ? (
            <p className="eci__empty">{t.noResults}</p>
          ) : (
            filteredGroups.map((g, gi) => (
              <div key={gi} className="eci__group">
                {g.title && (
                  <div className="eci__group-head">
                    <span className="eci__group-rule" />
                    <h4 className="eci__group-title">{g.title}</h4>
                    <span className="eci__group-rule" />
                  </div>
                )}

                <ul className="eci__list" role="list">
                  {g.candidates.map((c, i) => (
                    <CandidateRow key={`${gi}-${i}`} c={c} lang={lang} t={t} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CandidateRow({ c, t }) {
  const c2Href = formLink(c.c2);
  const c7Href = formLink(c.c7);

  return (
    <li className="eci-row">
      <span className="eci-row__no" aria-label={t.constituencyLabel}>
        {c.no}
      </span>
      <div className="eci-row__main">
        <h5 className="eci-row__name">{c.candidate}</h5>
        {c.constituency && c.constituency !== '—' && (
          <p className="eci-row__const">{c.constituency}</p>
        )}
      </div>
      <div className="eci-row__forms">
        <FormChip label={t.c2Label} href={c2Href} available={c.c2} availableText={t.available} />
        <FormChip label={t.c7Label} href={c7Href} available={c.c7} availableText={t.available} />
      </div>
    </li>
  );
}

function FormChip({ label, href, available, availableText }) {
  /* Unavailable filings are omitted entirely — no greyed-out chip. */
  if (!available || !href) return null;
  return (
    <a
      className="eci-chip is-available"
      title={availableText}
      aria-label={`${label} — ${availableText}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="eci-chip__dot" aria-hidden="true" />
      <span className="eci-chip__label">{label}</span>
      <svg className="eci-chip__icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}
