/* ═══════════════════════════════════════════════════════════════
   Build "Shivsena_PDF_Data.xlsx" — one tab per client-shared PDF.

   The Marathi PDFs in details/Shared by the client/ are all image-
   based (pdftotext returns 0 bytes). The data they contain was
   already transcribed into leadership.json and leaders-by-district
   .json earlier, so we read from there and write each PDF's worth
   of data into its own sheet.
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.resolve(__dirname, '..');
const leadership = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/leadership.json'), 'utf8'));
const byDistrict = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/leaders-by-district.json'), 'utf8'));

/* District code → Marathi label so the spreadsheet shows readable
   names instead of "mumbai-suburban". */
const DISTRICT_LABELS_MR = {
  'mumbai': 'मुंबई',
  'mumbai-city': 'मुंबई शहर',
  'mumbai-suburban': 'मुंबई उपनगर',
  'thane': 'ठाणे',
  'palghar': 'पालघर',
  'raigad': 'रायगड',
  'ratnagiri': 'रत्नागिरी',
  'sindhudurg': 'सिंधुदुर्ग',
  'pune': 'पुणे',
  'satara': 'सातारा',
  'sangli': 'सांगली',
  'kolhapur': 'कोल्हापूर',
  'solapur': 'सोलापूर',
  'nashik': 'नाशिक',
  'dhule': 'धुळे',
  'nandurbar': 'नंदुरबार',
  'jalgaon': 'जळगाव',
  'ahmadnagar': 'अहमदनगर',
  'aurangabad': 'छत्रपती संभाजीनगर',
  'jalna': 'जालना',
  'beed': 'बीड',
  'parbhani': 'परभणी',
  'hingoli': 'हिंगोली',
  'nanded': 'नांदेड',
  'latur': 'लातूर',
  'dharashiv': 'धाराशिव',
  'amravati': 'अमरावती',
  'akola': 'अकोला',
  'washim': 'वाशिम',
  'buldhana': 'बुलढाणा',
  'yavatmal': 'यवतमाळ',
  'nagpur': 'नागपूर',
  'wardha': 'वर्धा',
  'bhandara': 'भंडारा',
  'gondia': 'गोंदिया',
  'chandrapur': 'चंद्रपूर',
  'gadchiroli': 'गडचिरोली',
};

const DIVISION_LABELS_MR = {
  konkan: 'कोकण',
  pune: 'पुणे विभाग',
  nashik: 'नाशिक विभाग',
  marathwada: 'मराठवाडा',
  amravati: 'अमरावती विभाग',
  vidarbha: 'विदर्भ',
};

/* ─── Helpers ────────────────────────────────────────────────── */
function dt(label) {
  return DISTRICT_LABELS_MR[label] || label;
}

function pad2(n) { return String(n).padStart(2, '0'); }

/* Convert an array of objects → array-of-arrays the way the user
   expects to see a roster: serial #, name, role/area, phone, etc. */
function rosterFromArr(arr, opts = {}) {
  const rows = [];
  rows.push(['#', 'नाव (Name)', 'पद / कार्यक्षेत्र (Role / Area)', 'फोन (Phone)']);
  (arr || []).forEach((m, i) => {
    rows.push([
      i + 1,
      m.name || '',
      m.role || m.constituency || '',
      m.phone || '',
    ]);
  });
  return rows;
}

/* Flatten across districts: each row gets a district column too. */
function rosterByDistrict(field, opts = {}) {
  const rows = [];
  rows.push(['#', 'जिल्हा (District)', 'नाव (Name)', 'पद / कार्यक्षेत्र (Role / Area)', 'फोन (Phone)']);
  let n = 1;
  for (const districtSlug of Object.keys(byDistrict)) {
    const items = byDistrict[districtSlug][field] || [];
    items.forEach((m) => {
      rows.push([
        n++,
        dt(districtSlug),
        m.name || '',
        m.role || '',
        m.phone || '',
      ]);
    });
  }
  return rows;
}

/* Flatten leadership.byRegion[*][field] across divisions */
function rosterByDivision(field) {
  const rows = [];
  rows.push(['#', 'विभाग (Division)', 'नाव (Name)', 'पद / कार्यक्षेत्र (Role / Area)', 'फोन (Phone)']);
  let n = 1;
  for (const div of Object.keys(leadership.byRegion || {})) {
    const items = leadership.byRegion[div][field] || [];
    items.forEach((m) => {
      rows.push([
        n++,
        DIVISION_LABELS_MR[div] || div,
        m.name || '',
        m.role || '',
        m.phone || '',
      ]);
    });
  }
  return rows;
}

/* The "विभागनुसार यादी" master list — combines every state-level
   category from leadership.stateLevel into one big roster, with
   a category column so the reader can filter. */
function masterRoster() {
  const rows = [];
  rows.push(['#', 'श्रेणी (Category)', 'नाव (Name)', 'पद / कार्यक्षेत्र (Role / Area)', 'फोन (Phone)']);
  const catLabels = {
    topLeader: 'मुख्यनेते',
    leaders: 'नेते',
    deputyLeaders: 'उपनेते',
    treasurer: 'खजिनदार',
    generalSecretary: 'सरचिटणीस',
    secretaries: 'सचिव',
    coSecretaries: 'सह-सचिव',
    nationalSpokesperson: 'राष्ट्रीय प्रवक्ता',
    spokespersons: 'प्रवक्ते',
    ministers: 'मंत्री',
    coordinators: 'समन्वयक',
    socialMedia: 'सोशल मीडिया',
    yuvaSena: 'युवासेना',
    mlc: 'विधान परिषद सदस्य',
    mla: 'विधानसभा सदस्य',
    mp: 'खासदार',
  };
  let n = 1;
  for (const cat of Object.keys(catLabels)) {
    const items = leadership.stateLevel?.[cat] || [];
    items.forEach((m) => {
      rows.push([
        n++,
        catLabels[cat],
        m.name || '',
        m.role || '',
        m.phone || '',
      ]);
    });
  }
  return rows;
}

/* ─── Sheet definitions: one entry per source PDF ─────────────── */
const SHEETS = [
  {
    tab: 'मुख्यनेते',
    pdf: 'शिवसेना मुख्यनेते यादी ०१-०४-२०२६.pdf',
    rows: rosterFromArr(leadership.stateLevel?.topLeader || []),
  },
  {
    tab: 'खासदार',
    pdf: 'शिवसेना खासदार १८-०३-२०२६.pdf',
    rows: rosterFromArr(leadership.stateLevel?.mp || []),
  },
  {
    tab: 'विभागनुसार यादी',
    pdf: 'शिवसेना विभागनुसार यादी २०२४ up.pdf',
    rows: masterRoster(),
  },
  {
    tab: 'जिल्हाप्रमुख',
    pdf: 'जिल्हाप्रमुख कार्यक्षेत्रानुसार यादी २०-०३-२०२६.pdf',
    rows: (function() {
      const data = rosterByDistrict('districtHead');
      // districtHead is empty across all 35 districts in JSON — write a
      // clear "data not transcribed yet" note so the empty tab isn't
      // mistaken for a broken file.
      if (data.length <= 1) {
        return [
          ['⚠️ DATA PENDING — JSON मध्ये अद्याप नोंद नाही'],
          [''],
          ['या PDF मधील "जिल्हाप्रमुख" यादी अद्याप JSON मध्ये transcribe झालेली नाही.'],
          ['leaders-by-district.json मधील districtHead: [] हे सर्व 35 जिल्ह्यांसाठी रिकामे आहे.'],
          [''],
          ['(The district-head list from this PDF has not been transcribed into JSON.'],
          ['Field "districtHead" is empty for all 35 districts in leaders-by-district.json.)'],
          [''],
          ['📁 स्रोत: details/Shared by the client/जिल्हाप्रमुख कार्यक्षेत्रानुसार यादी २०-०३-२०२६.pdf'],
        ];
      }
      return data;
    })(),
  },
  {
    tab: 'लोकसभा संपर्कप्रमुख',
    pdf: 'महाराष्ट्र लोकसभा संपर्कप्रमुख यादी ३१-०३-२०२६.pdf',
    rows: rosterByDistrict('lokSabhaContactHead'),
  },
  {
    tab: 'महिला जिल्हाप्रमुख',
    pdf: 'महिला जिल्हाप्रमुख कार्यक्षेत्रानुसार यादी ०५-०५-२०२६.pdf',
    /* leaders-by-district has the full 89-entry roster — preferred source */
    rows: rosterByDistrict('womenDistrictHeads'),
  },
  {
    tab: 'विभागीय संपर्कप्रमुख',
    pdf: 'शिवसेना विभागीय संपर्कप्रमुख ३१-०३-२०२६.pdf',
    /* leaders-by-district has 36 entries (vs 8 in leadership.byRegion) */
    rows: rosterByDistrict('divisionalContactHeads'),
  },
  {
    tab: 'विभागीय सह-संपर्कप्रमुख',
    pdf: 'शिवसेना विभागीय सह संपर्कप्रमुख ३१-०३-२०२६.pdf',
    rows: rosterByDistrict('divisionalCoContactHeads'),
  },
  {
    tab: '८०-२० सिद्धांत',
    pdf: 'शिवसेना - ८०_ समाजकारण २०_ राजकारण (1).pdf',
    rows: [
      ['📄 स्रोत PDF (Source PDF)'],
      ['शिवसेना - ८० समाजकारण / २० राजकारण'],
      [''],
      ['📌 स्वरूप (Type)'],
      ['सिद्धांतपर दस्तावेज (Doctrine / philosophy document) — कोणतीही नावांची यादी नाही.'],
      [''],
      ['📁 .docx आवृत्ती उपलब्ध आहे: details/Shared by the client/शिवसेना - ८०_ समाजकारण २०_ राजकारण (1).docx'],
      ['तेथून प्रत्यक्ष मजकूर वाचा.'],
    ],
  },
  {
    tab: 'English Doctrine',
    pdf: 'Shiv Sena English Version Document.pdf',
    rows: [
      ['📄 Source PDF'],
      ['Shiv Sena English Version Document.pdf'],
      [''],
      ['📌 Type'],
      ['English-language doctrine document — not a roster, so no tabular data to extract.'],
      [''],
      ['📁 This is the only PDF in the shared folder that has extractable text:'],
      ['pdftotext returns ~1.7 KB of clean text for it.'],
    ],
  },
];

/* ─── Build the workbook ──────────────────────────────────────── */
const wb = XLSX.utils.book_new();

/* Cover sheet — index of all tabs + their source PDFs */
const cover = [
  ['SHIVSENA — Data from Client-Shared PDFs'],
  [`Generated ${new Date().toISOString().split('T')[0]} from src/content/leadership.json + src/content/leaders-by-district.json`],
  [''],
  ['#', 'Tab name', 'Source PDF', 'Rows'],
];
SHEETS.forEach((s, i) => {
  cover.push([i + 1, s.tab, s.pdf, Math.max(0, s.rows.length - 1)]);
});
const coverWs = XLSX.utils.aoa_to_sheet(cover);
coverWs['!cols'] = [{ wch: 4 }, { wch: 28 }, { wch: 56 }, { wch: 8 }];
XLSX.utils.book_append_sheet(wb, coverWs, 'अनुक्रमणिका');

/* Append each PDF's tab */
SHEETS.forEach((s) => {
  const ws = XLSX.utils.aoa_to_sheet(s.rows);
  // Column widths sized to the widest expected content
  const numCols = (s.rows[0] || []).length;
  ws['!cols'] = Array.from({ length: numCols }, (_, i) => ({
    wch: i === 0 ? 5 : i === 1 ? 24 : i === 2 ? 40 : 18,
  }));
  // Sheet name limit is 31 chars in Excel — truncate just in case
  const safeName = s.tab.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, safeName);
});

// Default output: overwrite the canonical file. If it's open in Excel
// (EBUSY), fall back to a timestamped sibling so the user gets the
// new data immediately without closing Excel.
const primary = path.join(ROOT, 'Shivsena_PDF_Data.xlsx');
let out = primary;
try {
  XLSX.writeFile(wb, primary);
} catch (err) {
  if (err && err.code === 'EBUSY') {
    out = path.join(ROOT, 'Shivsena_PDF_Data_v2.xlsx');
    console.warn('(primary file is open in Excel — writing to', out, 'instead)');
    XLSX.writeFile(wb, out);
  } else {
    throw err;
  }
}
console.log('✓ Wrote:', out);
console.log('  Tabs:', SHEETS.length + 1);
SHEETS.forEach((s) => {
  console.log(`    - ${s.tab.padEnd(28)}${Math.max(0, s.rows.length - 1)} rows`);
});
