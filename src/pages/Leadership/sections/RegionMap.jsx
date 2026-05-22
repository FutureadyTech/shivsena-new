import { useState } from 'react';
import { MH_PATHS } from '../../Home/sections/maharashtraPaths.js';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import leadershipContent from '../../../content/leadership.json';
import './RegionMap.css';

/* Same region → PC mapping as RegionExplorer */
const REGION_COLORS = {
  konkan:     '#C44D0E',
  pune:       '#D4602A',
  nashik:     '#B8390A',
  marathwada: '#E07840',
  amravati:   '#A02808',
  vidarbha:   '#8C2200',
};

const REGION_MAP = {
  konkan:     ['PC247','PC248','PC249','PC250','PC251','PC252','PC245','PC246','PC255','PC256','PC257','PC258','PC268','PC269','PC270'],
  pune:       ['PC243','PC244','PC259','PC260','PC261','PC271'],
  nashik:     ['PC224','PC225','PC226','PC227','PC241','PC242'],
  marathwada: ['PC228','PC229','PC230','PC238','PC239','PC240','PC262','PC263','PC264','PC265','PC266','PC267'],
  amravati:   ['PC231','PC237'],
  vidarbha:   ['PC233','PC234','PC235','PC236'],
};

const PC_TO_REGION = {};
Object.entries(REGION_MAP).forEach(([region, pcs]) => {
  pcs.forEach((pc) => { PC_TO_REGION[pc] = region; });
});

export default function RegionMap({ activeRegion, onSelectRegion }) {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';
  const t = useContent(leadershipContent.map);
  const regionNames = leadershipContent.regions[lang] || leadershipContent.regions.mr;
  const headerRef = useScrollReveal(0.2);

  const [hoverRegion, setHoverRegion] = useState(null);
  const displayRegion = hoverRegion || activeRegion;

  const getRegion = (pcId) => PC_TO_REGION[pcId];

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
            <svg
              viewBox="0 0 1126.9 940.43"
              xmlns="http://www.w3.org/2000/svg"
              className="rmap__svg"
              aria-label="Maharashtra map — click a region to view leadership"
            >
              {MH_PATHS.filter((p) => p.cls === 'cls-2').map(({ id, d }) => (
                <path key={id} d={d} className="mh-outline" />
              ))}
              {MH_PATHS.filter((p) => p.cls === 'cls-1').map(({ id, d }) => {
                const region = getRegion(id);
                if (!region) return null;
                const isActive = region === displayRegion;
                const color = REGION_COLORS[region];
                return (
                  <path
                    key={id}
                    d={d}
                    className={`mh-district ${isActive ? 'mh-district--active' : ''}`}
                    style={{
                      '--region-color': color,
                      '--region-color-dim': color + '40',
                    }}
                    onMouseEnter={() => setHoverRegion(region)}
                    onMouseLeave={() => setHoverRegion(null)}
                    onClick={() => onSelectRegion?.(region)}
                  />
                );
              })}
            </svg>
            <div className="rmap__hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
              <span>{lang === 'mr' ? 'क्लिक करा' : 'CLICK A REGION'}</span>
            </div>
          </div>

          {/* ── LEGEND PILLS ── */}
          <div className="rmap__legend">
            {Object.keys(REGION_MAP).map((key) => (
              <button
                key={key}
                type="button"
                className={`rmap__pill ${displayRegion === key ? 'rmap__pill--active' : ''}`}
                style={{ '--pill-color': REGION_COLORS[key] }}
                onMouseEnter={() => setHoverRegion(key)}
                onMouseLeave={() => setHoverRegion(null)}
                onClick={() => onSelectRegion?.(key)}
                data-cursor="link"
              >
                <span className="rmap__pill-dot" />
                <span className="rmap__pill-label">{regionNames[key]}</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rmap__pill-arrow" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
