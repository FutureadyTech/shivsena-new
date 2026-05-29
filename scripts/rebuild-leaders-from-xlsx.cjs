/* ═══════════════════════════════════════════════════════════════
   REBUILD src/content/leaders-by-district.json FROM
   Leadership_By_District.xlsx

   The XLSX is now the canonical source of truth for who appears
   under which category in each of the 36 districts. This script
   parses the single "जिल्हानुसार" sheet and replaces the JSON
   entirely so the website reflects the spreadsheet 1:1.

   Re-run any time the XLSX is updated:
     node scripts/rebuild-leaders-from-xlsx.cjs
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const XLSX_SRC = path.resolve('Leadership_By_District.xlsx');
const JSON_OUT = path.resolve('src/content/leaders-by-district.json');

/* ─── Marathi district label → slug (matches src/config/districts.js)
   ─── Includes "अहिल्यानगर" (the renamed Ahmadnagar) and the legacy
       "अहमदनगर" so either spelling in the XLSX works. */
const DISTRICT_SLUG = {
  /* Website uses one `mumbai` slug — the XLSX splits it into "City"
     and "Suburban", so both labels merge into the same bucket. */
  'मुंबई शहर':       'mumbai',
  'मुंबई उपनगर':     'mumbai',
  'मुंबई':           'mumbai',
  'ठाणे':           'thane',
  'पालघर':          'palghar',
  'रायगड':          'raigad',
  'रत्नागिरी':       'ratnagiri',
  'सिंधुदुर्ग':       'sindhudurg',
  'नाशिक':          'nashik',
  'धुळे':           'dhule',
  'नंदुरबार':        'nandurbar',
  'जळगाव':         'jalgaon',
  'अहिल्यानगर':     'ahmadnagar',
  'अहमदनगर':       'ahmadnagar',
  'पुणे':           'pune',
  'सातारा':         'satara',
  'सांगली':         'sangli',
  'कोल्हापूर':       'kolhapur',
  'सोलापूर':        'solapur',
  'छत्रपती संभाजीनगर': 'aurangabad',
  'संभाजीनगर':      'aurangabad',
  'औरंगाबाद':       'aurangabad',
  'जालना':         'jalna',
  'परभणी':         'parbhani',
  'हिंगोली':         'hingoli',
  'बीड':           'beed',
  'नांदेड':          'nanded',
  'धाराशिव':        'dharashiv',
  'उस्मानाबाद':      'dharashiv',
  'लातूर':          'latur',
  'अमरावती':        'amravati',
  'अकोला':         'akola',
  'वाशिम':         'washim',
  'यवतमाळ':        'yavatmal',
  'बुलढाणा':        'buldhana',
  'नागपूर':        'nagpur',
  'वर्धा':          'wardha',
  'चंद्रपूर':         'chandrapur',
  'भंडारा':         'bhandara',
  'गोंदिया':        'gondia',
  'गडचिरोली':      'gadchiroli',
};

/* ─── Category label → JSON field name in leaders-by-district.json */
const CATEGORY_FIELD = {
  'खासदार':                  'mp',
  'आमदार':                   'mla',
  'नेते':                    'leaders',
  'उपनेते':                  'deputyLeaders',
  'विभागीय संपर्कप्रमुख':         'divisionalContactHeads',
  'विभागीय सह-संपर्कप्रमुख':      'divisionalCoContactHeads',
  'विभागीय सह संपर्कप्रमुख':      'divisionalCoContactHeads',
  'लोकसभा संपर्कप्रमुख':         'lokSabhaContactHead',
  'जिल्हाप्रमुख':              'districtHead',
  'महिला जिल्हाप्रमुख':          'womenDistrictHeads',
};

/* ─── Read the XLSX ─────────────────────────────────────────── */
if (!fs.existsSync(XLSX_SRC)) {
  console.error('❌ XLSX not found:', XLSX_SRC);
  process.exit(1);
}
const wb = XLSX.readFile(XLSX_SRC);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

/* ─── Parse: walk rows tracking current district + category ─── */
const out = {};
// Initialise every known slug with all-9 empty arrays so the
// downstream UI never hits an undefined field.
const ALL_SLUGS = Array.from(new Set(Object.values(DISTRICT_SLUG)));
for (const slug of ALL_SLUGS) {
  out[slug] = {
    mp: [], mla: [], leaders: [], deputyLeaders: [],
    divisionalContactHeads: [], divisionalCoContactHeads: [],
    lokSabhaContactHead: [], districtHead: [], womenDistrictHeads: [],
  };
}

let curSlug = null;
let curField = null;
let idSeq = 0;
let unknownDist = new Set();
let unknownCat = new Set();
let totalAdded = 0;

for (const r of rows) {
  const c0 = String(r[0] || '').trim();
  const c1 = String(r[1] || '').trim();
  const c2 = String(r[2] || '').trim();
  const c3 = String(r[3] || '').trim();

  if (!c0 && !c1 && !c2 && !c3) continue;       // blank separator

  // 1) District header? "◆◆◆  मुंबई शहर  ◆◆◆"
  if (c0.includes('◆')) {
    const distName = c0.replace(/◆/g, '').trim();
    const slug = DISTRICT_SLUG[distName];
    if (!slug) {
      unknownDist.add(distName);
      curSlug = null;
    } else {
      curSlug = slug;
    }
    curField = null;
    continue;
  }

  // 2) Category header? "● खासदार"
  if (c0.startsWith('●')) {
    const cat = c0.replace(/^●\s*/, '').trim();
    const field = CATEGORY_FIELD[cat];
    if (!field) unknownCat.add(cat);
    curField = field || null;
    continue;
  }

  // 3) Data row — name in c1, area in c2, phone in c3
  if (!curSlug || !curField) continue;
  if (!c1) continue;          // need at least a name

  // Skip the spreadsheet's "no data available" placeholder rows.
  // The XLSX uses "— माहिती उपलब्ध नाही —" (and dash-prefixed
  // variants) when a district has no leader in a given category.
  // We don't want those rendered as fake cards on the website.
  if (/^[—–-]+\s*(माहिती)?\s*(उपलब्ध)?\s*(नाही)?\s*[—–-]*$/.test(c1)) continue;
  if (/माहिती\s*उपलब्ध\s*नाही/.test(c1)) continue;

  // Split "Name A | Name B" rows into separate leader entries — each
  // person gets their own card. By project convention the trailing
  // name carries the phone (the row's phone usually belongs to the
  // associate paired with the LS MP / Minister, not the headline name).
  const names = String(c1).split(/\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  names.forEach((nm, idx) => {
    out[curSlug][curField].push({
      id: shortId(curField),
      name: nm,
      role: c2 || '',
      phone: idx === names.length - 1 ? (c3 || '') : '',
    });
  });
  totalAdded += names.length;
}

function shortId(field) {
  idSeq++;
  const prefix = ({
    mp: 'mp', mla: 'mla', leaders: 'lead', deputyLeaders: 'dlead',
    divisionalContactHeads: 'dch', divisionalCoContactHeads: 'dcch',
    lokSabhaContactHead: 'lsc', districtHead: 'dh', womenDistrictHeads: 'wdh',
  }[field]) || 'x';
  return prefix + '-' + idSeq;
}

/* ─── Dedupe (per slug, per category) ───────────────────────────
   When multiple XLSX districts merge into the same slug (e.g.
   "मुंबई शहर" + "मुंबई उपनगर" → mumbai), the state-level shared
   rosters (नेते / उपनेते) get duplicated. Dedupe by name+phone
   so each person appears once per slug. */
let dedupedTotal = 0;
for (const slug of Object.keys(out)) {
  for (const cat of Object.keys(out[slug])) {
    const seen = new Set();
    const kept = [];
    for (const m of out[slug][cat]) {
      // Dedup key includes the role/area so an MP covering multiple
      // Lok Sabha seats (e.g. "मुंबई दक्षिण" vs "मुंबई उत्तर") shows
      // up as separate cards — only true duplicates (same person AND
      // same area, e.g. state-level shared नेते/उपनेते rows repeated
      // across the merged district) get collapsed.
      const key = (m.name || '') + '|' + (m.role || '') + '|' + (m.phone || '');
      if (seen.has(key)) continue;
      seen.add(key);
      kept.push(m);
    }
    if (kept.length !== out[slug][cat].length) {
      dedupedTotal += (out[slug][cat].length - kept.length);
    }
    out[slug][cat] = kept;
  }
}
if (dedupedTotal > 0) console.log('  Deduped', dedupedTotal, 'duplicate rows (state-level shared lists)');

/* ─── Write JSON ────────────────────────────────────────────── */
fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2), 'utf8');

/* ─── Report ────────────────────────────────────────────────── */
console.log('✓ Wrote', JSON_OUT);
console.log('  Total entries:', totalAdded);
const tot = {};
for (const slug of Object.keys(out)) {
  for (const k of Object.keys(out[slug])) {
    tot[k] = (tot[k] || 0) + out[slug][k].length;
  }
}
console.log('\nPer-category totals:');
for (const [k, v] of Object.entries(tot).sort((a, b) => b[1] - a[1])) {
  console.log('  ' + k.padEnd(28) + v);
}
console.log('\nDistricts with data:');
const distRows = [];
for (const slug of ALL_SLUGS) {
  const n = Object.values(out[slug]).reduce((s, a) => s + a.length, 0);
  distRows.push([slug, n]);
}
distRows.sort((a, b) => b[1] - a[1])
        .forEach(([s, n]) => console.log('  ' + s.padEnd(18) + n));

if (unknownDist.size) {
  console.log('\n⚠️ Unknown district labels (added to DISTRICT_SLUG?):');
  [...unknownDist].forEach((d) => console.log('  ' + d));
}
if (unknownCat.size) {
  console.log('\n⚠️ Unknown category labels (added to CATEGORY_FIELD?):');
  [...unknownCat].forEach((c) => console.log('  ' + c));
}
