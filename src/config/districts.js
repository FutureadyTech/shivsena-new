/**
 * Maharashtra districts registry — bilingual names + parent division.
 * Single source of truth for the district-level navigation that powers
 * the Leadership directory and the home Region Explorer.
 */

export const DIVISIONS_ORDER = ['konkan', 'pune', 'nashik', 'marathwada', 'amravati', 'vidarbha'];

/* Division → bilingual label (matches the existing colour mapping) */
export const DIVISION_LABELS = {
  konkan:     { mr: 'कोकण',           en: 'Konkan' },
  pune:       { mr: 'पुणे विभाग',       en: 'Pune Division' },
  nashik:     { mr: 'नाशिक विभाग',    en: 'Nashik Division' },
  marathwada: { mr: 'मराठवाडा',       en: 'Marathwada' },
  amravati:   { mr: 'अमरावती विभाग', en: 'Amravati Division' },
  vidarbha:   { mr: 'विदर्भ',         en: 'Vidarbha' },
};

/* slug → { mr, en, division } */
export const DISTRICTS = {
  /* ── Konkan ── */
  'mumbai-city':     { mr: 'मुंबई शहर',          en: 'Mumbai City',          division: 'konkan' },
  'mumbai-suburban': { mr: 'मुंबई उपनगर',        en: 'Mumbai Suburban',      division: 'konkan' },
  'thane':           { mr: 'ठाणे',              en: 'Thane',                division: 'konkan' },
  'palghar':         { mr: 'पालघर',            en: 'Palghar',              division: 'konkan' },
  'raigad':          { mr: 'रायगड',             en: 'Raigad',               division: 'konkan' },
  'ratnagiri':       { mr: 'रत्नागिरी',          en: 'Ratnagiri',            division: 'konkan' },
  'sindhudurg':      { mr: 'सिंधुदुर्ग',          en: 'Sindhudurg',           division: 'konkan' },

  /* ── Pune ── */
  'pune':            { mr: 'पुणे',              en: 'Pune',                 division: 'pune' },
  'satara':          { mr: 'सातारा',            en: 'Satara',               division: 'pune' },
  'sangli':          { mr: 'सांगली',            en: 'Sangli',               division: 'pune' },
  'kolhapur':        { mr: 'कोल्हापूर',          en: 'Kolhapur',             division: 'pune' },
  'solapur':         { mr: 'सोलापूर',           en: 'Solapur',              division: 'pune' },

  /* ── Nashik ── */
  'nashik':          { mr: 'नाशिक',             en: 'Nashik',               division: 'nashik' },
  'dhule':           { mr: 'धुळे',              en: 'Dhule',                division: 'nashik' },
  'nandurbar':       { mr: 'नंदुरबार',          en: 'Nandurbar',            division: 'nashik' },
  'jalgaon':         { mr: 'जळगाव',            en: 'Jalgaon',              division: 'nashik' },
  'ahmadnagar':      { mr: 'अहमदनगर',         en: 'Ahmadnagar',           division: 'nashik' },

  /* ── Marathwada ── */
  'aurangabad':      { mr: 'छत्रपती संभाजीनगर',    en: 'Chh. Sambhajinagar',   division: 'marathwada' },
  'jalna':           { mr: 'जालना',             en: 'Jalna',                division: 'marathwada' },
  'beed':            { mr: 'बीड',               en: 'Beed',                 division: 'marathwada' },
  'latur':           { mr: 'लातूर',             en: 'Latur',                division: 'marathwada' },
  'dharashiv':       { mr: 'धाराशिव',           en: 'Dharashiv',            division: 'marathwada' },
  'nanded':          { mr: 'नांदेड',             en: 'Nanded',               division: 'marathwada' },
  'hingoli':         { mr: 'हिंगोली',            en: 'Hingoli',              division: 'marathwada' },
  'parbhani':        { mr: 'परभणी',             en: 'Parbhani',             division: 'marathwada' },

  /* ── Amravati ── */
  'amravati':        { mr: 'अमरावती',          en: 'Amravati',             division: 'amravati' },
  'akola':           { mr: 'अकोला',             en: 'Akola',                division: 'amravati' },
  'buldhana':        { mr: 'बुलढाणा',           en: 'Buldhana',             division: 'amravati' },
  'washim':          { mr: 'वाशिम',             en: 'Washim',               division: 'amravati' },
  'yavatmal':        { mr: 'यवतमाळ',          en: 'Yavatmal',             division: 'amravati' },

  /* ── Vidarbha (Nagpur division) ── */
  'nagpur':          { mr: 'नागपूर',            en: 'Nagpur',               division: 'vidarbha' },
  'wardha':          { mr: 'वर्धा',              en: 'Wardha',               division: 'vidarbha' },
  'chandrapur':      { mr: 'चंद्रपूर',            en: 'Chandrapur',           division: 'vidarbha' },
  'gadchiroli':      { mr: 'गडचिरोली',          en: 'Gadchiroli',           division: 'vidarbha' },
  'bhandara':        { mr: 'भंडारा',            en: 'Bhandara',             division: 'vidarbha' },
  'gondia':          { mr: 'गोंदिया',           en: 'Gondia',               division: 'vidarbha' },
};

/* Pre-built: districts ordered by division */
export const DISTRICTS_BY_DIVISION = DIVISIONS_ORDER.reduce((acc, div) => {
  acc[div] = Object.entries(DISTRICTS)
    .filter(([, d]) => d.division === div)
    .map(([slug]) => slug);
  return acc;
}, {});

/* Convenience: flat ordered list of all district slugs */
export const ALL_DISTRICTS = DIVISIONS_ORDER.flatMap((div) => DISTRICTS_BY_DIVISION[div]);
