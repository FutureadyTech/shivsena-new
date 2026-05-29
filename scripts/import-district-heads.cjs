/* ═══════════════════════════════════════════════════════════════
   IMPORT DISTRICT HEADS (जिल्हाप्रमुख)

   Reads the client-provided XLSX
     C:/Users/Admin/Downloads/ShivSena_Jilha_Pramukh_2026.xlsx
   and writes the data into the `districtHead` array of every
   matching district in src/content/leaders-by-district.json.

   Re-runnable: every run REPLACES the districtHead arrays
   entirely with the latest XLSX contents — so if the XLSX is
   updated, just run this again.

   Run with:  node scripts/import-district-heads.cjs
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const XLSX_SRC   = 'C:/Users/Admin/Downloads/ShivSena_Jilha_Pramukh_2026.xlsx';
const DOCX_MR    = 'C:/Users/Admin/Downloads/jilha_pramukh_yadi.docx';
const JSON_OUT   = path.resolve('src/content/leaders-by-district.json');

/* ─── Optional Marathi overlay ─────────────────────────────────
   The client may also drop a partial Marathi .docx containing some
   rows in proper Devanagari. We extract whatever rows are there
   (keyed by Sr.No.) and override the matching XLSX rows so those
   names/roles appear in Marathi.

   Returns: Map<srNo, { name, role }>  (empty Map if no docx). */
function readMarathiOverlay() {
  const result = new Map();
  if (!fs.existsSync(DOCX_MR)) return result;
  let xml;
  try {
    const { execSync } = require('child_process');
    xml = execSync('unzip -p ' + JSON.stringify(DOCX_MR) + ' word/document.xml',
                   { encoding: 'utf8', maxBuffer: 50_000_000, env: { ...process.env, LC_ALL: 'en_US.UTF-8' } });
  } catch (e) {
    console.warn('  (could not read docx — overlay skipped):', e.message.split('\n')[0]);
    return result;
  }
  const tables = xml.split('</w:tbl>');
  for (let t = 0; t < tables.length - 1; t++) {
    const trs = tables[t].split(/<w:tr[ >]/).slice(1);
    for (const row of trs) {
      const cells = row.split(/<w:tc[ >]/).slice(1).map((c) => {
        const paras = c.split(/<w:p[ >]/).slice(1);
        return paras.map((p) => [...p.matchAll(/<w:t[^>]*>([^<]+)<\/w:t>/g)].map((m) => m[1]).join(''))
                    .join(' ').trim();
      });
      if (cells.length < 6) continue;
      const srNo = Number(cells[0]);
      if (!Number.isInteger(srNo) || srNo <= 0) continue; // skip header row
      const jilha = cells[2], name = cells[3], area = cells[5];
      if (!name) continue;
      result.set(srNo, { name, area, jilha });
    }
  }
  return result;
}

/* ─── XLSX district label → our internal district slug ──────────
   Many XLSX rows tag a sub-region (e.g. "Thane - Bhiwandi-Gra.")
   that maps back to the parent district. A few use English names
   that we map to our slugs. */
const SLUG = {
  'Sindhudurg':                                'sindhudurg',
  'Ratnagiri':                                 'ratnagiri',
  'Raigad':                                    'raigad',
  'Thane':                                     'thane',
  'Thane - Bhiwandi-Gra. / Bhiwandi-Pu.':      'thane',
  'Thane - Shahapur / Bhiwandi-Pa.':           'thane',
  'Thane - Mira Bhayandar':                    'thane',
  'Kalyan':                                    'thane',
  'Navi Mumbai':                               'thane',  // Navi Mumbai falls under Thane dist.
  'Palghar':                                   'palghar',
  'Nashik':                                    'nashik',
  'Nagar - Dakshin':                           'ahmadnagar',
  'Nagar - Uttar':                             'ahmadnagar',
  'Dhule':                                     'dhule',
  'Nandurbar':                                 'nandurbar',
  'Jalgaon':                                   'jalgaon',
  'Buldhana':                                  'buldhana',
  'Amravati':                                  'amravati',
  'Akola':                                     'akola',
  'Washim':                                    'washim',
  'Nagpur - Sahar':                            'nagpur',
  'Nagpur - Gramin':                           'nagpur',
  'Chandrapur':                                'chandrapur',
  'Gadchiroli':                                'gadchiroli',
  'Bhandara':                                  'bhandara',
  'Gondia':                                    'gondia',
  'Wardha':                                    'wardha',
  'Yavatmal':                                  'yavatmal',
  'Nanded':                                    'nanded',
  'Parbhani':                                  'parbhani',
  'Jalna':                                     'jalna',
  'Chhatrapati Sambhajinagar':                 'aurangabad',
  'Dharashiv':                                 'dharashiv',
  'Beed':                                      'beed',
  'Latur':                                     'latur',
  'Hingoli':                                   'hingoli',
  'Pune':                                      'pune',
  'Hatkanangale':                              'kolhapur',  // LS seat in Kolhapur district
  'Kolhapur':                                  'kolhapur',
  'Sangli':                                    'sangli',
  'Solapur':                                   'solapur',
  'Satara':                                    'satara',
};

/* ─── Hardcoded English honorific replacements so that names look
   correct in MR mode. We only substitute the leading honorific —
   the surname/middle name stays English for now (it can be
   transliterated to Devanagari in a future pass). */
const HONOR_MAP = [
  [/^Shri\.\s*/i,     'श्री. '],
  [/^Smt\.\s*/i,      'श्रीमती. '],
  [/^Sou\.\s*/i,      'सौ. '],
  [/^Ku\.\s*/i,       'कु. '],
  [/^Dr\.\s*/i,       'डॉ. '],
  [/^Adv\.\s*/i,      'ॲड. '],
  [/^Prof\.\s*/i,     'प्रा. '],
  [/^Mantri\s*/i,     'मंत्री '],
];

function devanagariHonorific(name) {
  let out = name.trim();
  for (const [re, rep] of HONOR_MAP) {
    if (re.test(out)) {
      out = out.replace(re, rep);
      break;
    }
  }
  return out;
}

/* ─── Read XLSX ─────────────────────────────────────────────── */
if (!fs.existsSync(XLSX_SRC)) {
  console.error('❌ XLSX not found:', XLSX_SRC);
  process.exit(1);
}
const wb = XLSX.readFile(XLSX_SRC);
const ws = wb.Sheets['Jilha Pramukh'] || wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
const dataRows = rows.slice(1).filter((r) => r[2] && r[3]); // skip header + blank

/* ─── Read optional Marathi overlay ────────────────────────── */
const mrOverlay = readMarathiOverlay();
if (mrOverlay.size > 0) {
  console.log('  Marathi overlay loaded:', mrOverlay.size, 'rows from jilha_pramukh_yadi.docx');
}

/* ─── Bucket by slug ────────────────────────────────────────── */
const heads = {}; // slug → [entries]
let unmapped = 0;
let idSeq = 0;
let mrUsed = 0;

for (const r of dataRows) {
  const [srNoRaw, region, jilha, name, phone, karyakshetra] = r;
  const slug = SLUG[jilha];
  if (!slug) {
    console.warn('  (no slug for "' + jilha + '" — row skipped)');
    unmapped++;
    continue;
  }
  // Build a role string. For sub-regions like "Thane - Bhiwandi-Gra."
  // include that suffix so the role is informative; otherwise just
  // use the karyakshetra (area-of-work) text.
  const subRegion = jilha !== Object.keys(SLUG).find((k) => SLUG[k] === slug && k === jilha)
    && jilha.includes(' - ')
    ? jilha.split(' - ')[1].trim()
    : '';

  // ── If the Marathi overlay has a row for this Sr.No., prefer
  //    the Devanagari name and karyakshetra. The XLSX sub-region
  //    suffix (Latin) is dropped when we have a Marathi role —
  //    the OCR docx already includes the full area text. ──
  const srNo = Number(srNoRaw);
  const mr = mrOverlay.get(srNo);

  let displayName, displayRole;
  if (mr) {
    displayName = mr.name;
    displayRole = mr.area || (karyakshetra || '').trim() || 'जिल्हाप्रमुख';
    mrUsed++;
  } else {
    displayName = devanagariHonorific(String(name).trim());
    displayRole = [subRegion, (karyakshetra || '').trim()].filter(Boolean).join(' — ') || 'जिल्हाप्रमुख';
  }

  heads[slug] = heads[slug] || [];
  heads[slug].push({
    id: 'dh-' + (++idSeq),
    name: displayName,
    role: displayRole,
    phone: String(phone || '').trim(),
  });
}

/* ─── Merge into leaders-by-district.json ───────────────────── */
const json = JSON.parse(fs.readFileSync(JSON_OUT, 'utf8'));
let total = 0;
let touched = 0;
for (const slug of Object.keys(json)) {
  const newHeads = heads[slug] || [];
  json[slug].districtHead = newHeads;
  total += newHeads.length;
  if (newHeads.length) touched++;
}

fs.writeFileSync(JSON_OUT, JSON.stringify(json, null, 2), 'utf8');

console.log('✓ Imported', total, 'district heads into', touched, 'districts');
console.log('  Source XLSX :', XLSX_SRC);
if (mrOverlay.size > 0) {
  console.log('  Marathi overlay applied to', mrUsed, '/', total, 'rows (from', DOCX_MR + ')');
}
console.log('  Output      :', JSON_OUT);
if (unmapped) console.log('  ⚠️', unmapped, 'rows skipped (unmapped district label)');

console.log('\nPer-district breakdown:');
for (const [slug, arr] of Object.entries(heads).sort()) {
  console.log('  ' + slug.padEnd(18) + arr.length);
}
