import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MH_PATHS } from './maharashtraPaths';
import { useLanguage } from '../../../i18n/LanguageContext';
import './RegionExplorer.css';

/* ─── Region → PC constituency mapping ─────────────────────────── */
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

// Reverse: PC → region
const PC_TO_REGION = {};
Object.entries(REGION_MAP).forEach(([region, pcs]) => {
  pcs.forEach(pc => { PC_TO_REGION[pc] = region; });
});

/* ─── Dummy member data ─────────────────────────────────────────── */
const MEMBERS = {
  konkan: {
    mr: {
      name: 'कोकण',
      desc: 'मुंबई, ठाणे, रायगड, रत्नागिरी, सिंधुदुर्ग',
      members: [
        { initials: 'एश', name: 'एकनाथ शिंदे', role: 'उपमुख्यमंत्री, महाराष्ट्र', constituency: 'कोपरी-पाचपाखाडी' },
        { initials: 'रव', name: 'रवींद्र वायकर', role: 'खासदार, शिवसेना', constituency: 'मुंबई उत्तर-पश्चिम' },
        { initials: 'नम', name: 'नरेश म्हस्के', role: 'खासदार, शिवसेना', constituency: 'ठाणे' },
        { initials: 'दि', name: 'दिलीप लांडे', role: 'आमदार, शिवसेना', constituency: 'चेंबूर' },
        { initials: 'यक', name: 'योगेश कदम', role: 'जिल्हा प्रमुख', constituency: 'रत्नागिरी' },
      ]
    },
    en: {
      name: 'Konkan',
      desc: 'Mumbai, Thane, Raigad, Ratnagiri, Sindhudurg',
      members: [
        { initials: 'ES', name: 'Eknath Shinde', role: 'Deputy CM, Maharashtra', constituency: 'Kopri-Pachpakhadi' },
        { initials: 'RW', name: 'Ravindra Waikar', role: 'MP, Shiv Sena', constituency: 'Mumbai North-West' },
        { initials: 'NM', name: 'Naresh Mhaske', role: 'MP, Shiv Sena', constituency: 'Thane' },
        { initials: 'DL', name: 'Dilip Lande', role: 'MLA, Shiv Sena', constituency: 'Chembur' },
        { initials: 'YK', name: 'Yogesh Kadam', role: 'District Head', constituency: 'Ratnagiri' },
      ]
    }
  },
  pune: {
    mr: {
      name: 'पुणे',
      desc: 'पुणे, सातारा, सांगली, सोलापूर, कोल्हापूर',
      members: [
        { initials: 'सप', name: 'सतेज पाटील', role: 'जिल्हाध्यक्ष, शिवसेना', constituency: 'पुणे' },
        { initials: 'दभ', name: 'दत्तात्रय भरणे', role: 'आमदार, शिवसेना', constituency: 'इंदापूर' },
        { initials: 'रजा', name: 'रमेश जाधव', role: 'महानगरप्रमुख', constituency: 'पुणे शहर' },
        { initials: 'सक', name: 'संजय काळे', role: 'जिल्हा प्रमुख', constituency: 'कोल्हापूर' },
      ]
    },
    en: {
      name: 'Pune',
      desc: 'Pune, Satara, Sangli, Solapur, Kolhapur',
      members: [
        { initials: 'SP', name: 'Satej Patil', role: 'District Head, Shiv Sena', constituency: 'Pune' },
        { initials: 'DB', name: 'Dattatray Bharane', role: 'MLA, Shiv Sena', constituency: 'Indapur' },
        { initials: 'RJ', name: 'Ramesh Jadhav', role: 'City Head', constituency: 'Pune City' },
        { initials: 'SK', name: 'Sanjay Kale', role: 'District Head', constituency: 'Kolhapur' },
      ]
    }
  },
  nashik: {
    mr: {
      name: 'नाशिक',
      desc: 'नाशिक, धुळे, नंदुरबार, जळगाव, अहमदनगर',
      members: [
        { initials: 'हव', name: 'हेमंत वाघ', role: 'जिल्हाध्यक्ष, शिवसेना', constituency: 'नाशिक पश्चिम' },
        { initials: 'सभ', name: 'सुनील भुसारा', role: 'आमदार, शिवसेना', constituency: 'जळगाव' },
        { initials: 'दघ', name: 'दीपक घुमरे', role: 'महानगरप्रमुख', constituency: 'नाशिक पूर्व' },
        { initials: 'वप', name: 'विकास पाटील', role: 'जिल्हा प्रमुख', constituency: 'अहमदनगर' },
      ]
    },
    en: {
      name: 'Nashik',
      desc: 'Nashik, Dhule, Nandurbar, Jalgaon, Ahmednagar',
      members: [
        { initials: 'HW', name: 'Hemant Wagh', role: 'District Head, Shiv Sena', constituency: 'Nashik West' },
        { initials: 'SB', name: 'Sunil Bhusara', role: 'MLA, Shiv Sena', constituency: 'Jalgaon' },
        { initials: 'DG', name: 'Deepak Ghumre', role: 'City Head', constituency: 'Nashik East' },
        { initials: 'VP', name: 'Vikas Patil', role: 'District Head', constituency: 'Ahmednagar' },
      ]
    }
  },
  marathwada: {
    mr: {
      name: 'मराठवाडा',
      desc: 'छत्रपती संभाजीनगर, जालना, बीड, लातूर, नांदेड',
      members: [
        { initials: 'सभ', name: 'संदीपान भुमरे', role: 'खासदार, शिवसेना', constituency: 'छत्रपती संभाजीनगर' },
        { initials: 'प्रजा', name: 'प्रतापराव जाधव', role: 'खासदार, शिवसेना', constituency: 'बुलढाणा' },
        { initials: 'आभ', name: 'अब्दुल सत्तार', role: 'आमदार, शिवसेना', constituency: 'सिल्लोड' },
        { initials: 'रव', name: 'रमेश बोरनारे', role: 'जिल्हा प्रमुख', constituency: 'नांदेड' },
        { initials: 'पक', name: 'पंकज काळे', role: 'जिल्हाध्यक्ष', constituency: 'लातूर' },
      ]
    },
    en: {
      name: 'Marathwada',
      desc: 'Chh. Sambhajinagar, Jalna, Beed, Latur, Nanded',
      members: [
        { initials: 'SB', name: 'Sandipan Bhumre', role: 'MP, Shiv Sena', constituency: 'Chh. Sambhajinagar' },
        { initials: 'PJ', name: 'Prataprao Jadhav', role: 'MP, Shiv Sena', constituency: 'Buldhana' },
        { initials: 'AS', name: 'Abdul Sattar', role: 'MLA, Shiv Sena', constituency: 'Sillod' },
        { initials: 'RB', name: 'Ramesh Bornare', role: 'District Head', constituency: 'Nanded' },
        { initials: 'PK', name: 'Pankaj Kale', role: 'District Head', constituency: 'Latur' },
      ]
    }
  },
  amravati: {
    mr: {
      name: 'अमरावती',
      desc: 'अमरावती, अकोला, वाशीम, बुलढाणा, यवतमाळ',
      members: [
        { initials: 'नव', name: 'नवनीत राणा', role: 'आमदार, शिवसेना', constituency: 'बडनेरा' },
        { initials: 'सघ', name: 'संजय घाटे', role: 'जिल्हा प्रमुख', constituency: 'अकोला' },
        { initials: 'रप', name: 'रमेश पाटील', role: 'जिल्हाध्यक्ष', constituency: 'यवतमाळ' },
        { initials: 'दक', name: 'दीपक काटे', role: 'महानगरप्रमुख', constituency: 'अमरावती' },
      ]
    },
    en: {
      name: 'Amravati',
      desc: 'Amravati, Akola, Washim, Buldhana, Yavatmal',
      members: [
        { initials: 'NR', name: 'Navneet Rana', role: 'MLA, Shiv Sena', constituency: 'Badnera' },
        { initials: 'SG', name: 'Sanjay Ghate', role: 'District Head', constituency: 'Akola' },
        { initials: 'RP', name: 'Ramesh Patil', role: 'District Head', constituency: 'Yavatmal' },
        { initials: 'DK', name: 'Deepak Kate', role: 'City Head', constituency: 'Amravati' },
      ]
    }
  },
  vidarbha: {
    mr: {
      name: 'विदर्भ / नागपूर',
      desc: 'नागपूर, वर्धा, भंडारा, गोंदिया, चंद्रपूर, गडचिरोली',
      members: [
        { initials: 'श्र', name: 'श्रीकांत शिंदे', role: 'खासदार, शिवसेना', constituency: 'कल्याण' },
        { initials: 'वक', name: 'विकास कुमठेकर', role: 'जिल्हा प्रमुख', constituency: 'नागपूर' },
        { initials: 'रज', name: 'राजेश जोशी', role: 'महानगरप्रमुख', constituency: 'नागपूर दक्षिण' },
        { initials: 'सम', name: 'सुधीर मुनगंटीवार', role: 'आमदार, युती', constituency: 'बल्लारपूर' },
      ]
    },
    en: {
      name: 'Vidarbha / Nagpur',
      desc: 'Nagpur, Wardha, Bhandara, Gondia, Chandrapur, Gadchiroli',
      members: [
        { initials: 'SS', name: 'Shrikant Shinde', role: 'MP, Shiv Sena', constituency: 'Kalyan' },
        { initials: 'VK', name: 'Vikas Kumthekar', role: 'District Head', constituency: 'Nagpur' },
        { initials: 'RJ', name: 'Rajesh Joshi', role: 'City Head', constituency: 'Nagpur South' },
        { initials: 'SM', name: 'Sudhir Mungantiwar', role: 'MLA, Alliance', constituency: 'Ballarpur' },
      ]
    }
  }
};

const REGION_LABELS = {
  konkan:     { mr: 'कोकण',        en: 'Konkan' },
  pune:       { mr: 'पुणे',        en: 'Pune' },
  nashik:     { mr: 'नाशिक',       en: 'Nashik' },
  marathwada: { mr: 'मराठवाडा',   en: 'Marathwada' },
  amravati:   { mr: 'अमरावती',     en: 'Amravati' },
  vidarbha:   { mr: 'विदर्भ/नागपूर', en: 'Vidarbha' },
};

const UI = {
  mr: {
    eyebrow: 'महाराष्ट्रभर',
    title: 'प्रादेशिक नेतृत्व',
    regionLabel: 'प्रदेश',
    hoverHint: 'नकाशावर प्रदेश निवडा',
    searchPlaceholder: 'नाव, पद किंवा मतदारसंघ शोधा...',
    noResults: 'कोणतेही नेते आढळले नाहीत',
    clearSearch: 'शोध साफ करा',
  },
  en: {
    eyebrow: 'ACROSS MAHARASHTRA',
    title: 'Regional Leadership',
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
  const [hoverRegion, setHoverRegion]   = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');

  const lang          = (language === 'mr') ? 'mr' : 'en';
  const displayRegion = hoverRegion || activeRegion;
  const regionData    = MEMBERS[displayRegion]?.[lang] || MEMBERS.konkan.en;
  const ui            = UI[lang] || UI.en;

  useEffect(() => { setSearchQuery(''); }, [activeRegion, lang]);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return regionData.members;
    return regionData.members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.constituency.toLowerCase().includes(q)
    );
  }, [regionData.members, searchQuery]);

  const getRegion = (pcId) => PC_TO_REGION[pcId];

  return (
    <section className="region-explorer">
      <div className="region-explorer__inner">

        {/* Header */}
        <div className="region-explorer__header">
          <p className="region-explorer__eyebrow">
            <span className="eyebrow-rule" />
            {ui.eyebrow}
          </p>
          <h2 className="region-explorer__title">{ui.title}</h2>
        </div>

        {/* Body */}
        <div className="region-explorer__body">

          {/* ── MAP SIDE ── */}
          <div className="region-explorer__map-side">
            <div className="region-explorer__svg-wrap">
              <svg
                viewBox="0 0 1126.9 940.43"
                xmlns="http://www.w3.org/2000/svg"
                className="region-explorer__svg"
              >
                {/* State outline */}
                {MH_PATHS.filter(p => p.cls === 'cls-2').map(({ id, d }) => (
                  <path key={id} d={d} className="mh-outline" />
                ))}

                {/* District paths grouped by region */}
                {MH_PATHS.filter(p => p.cls === 'cls-1').map(({ id, d }) => {
                  const region = getRegion(id);
                  if (!region) return null;
                  const isActive = region === displayRegion;
                  const color    = REGION_COLORS[region];
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
                      onClick={() => setActiveRegion(region)}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Legend pills */}
            <div className="region-explorer__legend">
              {Object.keys(REGION_MAP).map(key => (
                <button
                  key={key}
                  className={`region-legend-pill ${displayRegion === key ? 'region-legend-pill--active' : ''}`}
                  style={{ '--pill-color': REGION_COLORS[key] }}
                  onMouseEnter={() => setHoverRegion(key)}
                  onMouseLeave={() => setHoverRegion(null)}
                  onClick={() => setActiveRegion(key)}
                >
                  <span className="region-legend-pill__dot" />
                  {REGION_LABELS[key][lang]}
                </button>
              ))}
            </div>
          </div>

          {/* ── PANEL SIDE ── */}
          <div
            className="region-explorer__panel"
            style={{ '--active-color': REGION_COLORS[displayRegion] }}
          >
            <div className="region-panel__head">
              <span className="region-panel__label">{ui.regionLabel}</span>
              <h3 className="region-panel__name">{regionData.name}</h3>
              <p className="region-panel__desc">{regionData.desc}</p>
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

            <div className="region-panel__members">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m, i) => (
                  <div key={`${displayRegion}-${m.name}-${i}`} className="region-member" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="region-member__avatar">
                      {m.initials}
                    </div>
                    <div className="region-member__info">
                      <p className="region-member__name">{m.name}</p>
                      <p className="region-member__role">{m.role}</p>
                      <p className="region-member__constituency">{m.constituency}</p>
                    </div>
                    <div className="region-member__arrow">→</div>
                  </div>
                ))
              ) : (
                <p className="region-panel__no-results">{ui.noResults}</p>
              )}
            </div>

            <p className="region-panel__hint">{ui.hoverHint}</p>
          </div>

        </div>
      </div>
    </section>
  );
}