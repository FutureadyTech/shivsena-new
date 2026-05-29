/* ═══════════════════════════════════════════════════════════════
   IMPORT NEW CONTENT from "details/new data/*.docx"

   Updates four JSON files in one shot:
     1. src/content/leaders.json
          • thackeray.mr.paragraphs
          • dighe.mr.paragraphs
          • shinde.mr.paragraphs
          (titles + dates already correct in JSON — left untouched)

     2. src/content/innovative.json
          • Each of the 5 programs' mr.body is replaced with the
            paragraph that follows its title in the docx.

     3. src/content/about.json
          • Adds a new "purpose" section containing the two
            subsections from "शिवसेनेचे ध्येय आणि धोरण".

     4. src/content/home.json
          • Adds the same "purpose" data so the homepage can
            optionally surface it.

   English translations for the new bios are left as-is — the
   client docs provided are Marathi only. Auto-translating bios
   would degrade quality; we leave EN to be updated separately.

   Run with: node scripts/import-new-content.cjs
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const DOC_DIR = path.resolve('_tmp_docx');
const LEADERS_PATH    = path.resolve('src/content/leaders.json');
const INNOVATIVE_PATH = path.resolve('src/content/innovative.json');
const ABOUT_PATH      = path.resolve('src/content/about.json');
const HOME_PATH       = path.resolve('src/content/home.json');

function readDocText(file) {
  const xml = fs.readFileSync(path.join(DOC_DIR, file), 'utf8');
  const paras = xml.split(/<w:p[ >]/).slice(1);
  return paras
    .map((p) => [...p.matchAll(/<w:t[^>]*>([^<]+)<\/w:t>/g)].map((m) => m[1]).join(''))
    .filter((t) => t.trim());
}

/* ─── 1. Leaders ────────────────────────────────────────────── */
const leaders = JSON.parse(fs.readFileSync(LEADERS_PATH, 'utf8'));

const LEADER_DOC_MAP = [
  { id: 'thackeray', file: 'हिंदूहृदयसम्राट_शिवसेनाप्रमुख_बाळासाहेब_ठाकरे.xml', skipFirst: 2 },
  { id: 'dighe',     file: 'धर्मवीर_आनंद_दिघे_साहेब_WEB_.xml',                 skipFirst: 2 },
  { id: 'shinde',    file: 'मा._श्री._एकनाथजी_शिंदे_साहेब_WEB.xml',            skipFirst: 2 },
];

for (const { id, file, skipFirst } of LEADER_DOC_MAP) {
  const paras = readDocText(file);
  /* skipFirst = number of leading paragraphs that are title/date and
     should NOT enter the bio. The remaining lines become paragraphs. */
  const bio = paras.slice(skipFirst);
  if (!leaders[id]) continue;
  leaders[id].mr = leaders[id].mr || {};
  leaders[id].mr.paragraphs = bio;
  console.log('Leader ' + id + ' → ' + bio.length + ' bio paragraphs');
}
fs.writeFileSync(LEADERS_PATH, JSON.stringify(leaders, null, 2), 'utf8');

/* ─── 2. Innovative programs ────────────────────────────────── */
const inn = JSON.parse(fs.readFileSync(INNOVATIVE_PATH, 'utf8'));
const innParas = readDocText('नाविन्यपूर्ण_उपक्रम_WEB.xml');

/* Doc structure (alternating title / body lines, skipping the
   first heading "नाविन्यपूर्ण उपक्रम"):
     [0]   नाविन्यपूर्ण उपक्रम
     [1]   शिवसेना वैद्यकीय मदत कक्ष
     [2]   <body>
     [3]   बाळासाहेब ठाकरे आपला दवाखाना
     [4]   <body>
     ... etc
   Map titles → existing program IDs by string match. */
const PROGRAM_TITLE_TO_ID = {
  'शिवसेना वैद्यकीय मदत कक्ष':          'medical-help-cell',
  'बाळासाहेब ठाकरे आपला दवाखाना':       'aapla-dawakhana',
  'शासन आपल्या दारी':                   'shasan-aplya-dari',
  'लाडकी बहीण योजना':                   'ladki-bahin',
  'धर्मवीर आनंद दिघे नागरी सहायता कक्ष':'anand-dighe-cell',
};

const bodyById = {};
for (let i = 0; i < innParas.length; i++) {
  const para = innParas[i].trim();
  const id = PROGRAM_TITLE_TO_ID[para];
  if (id && innParas[i + 1]) {
    bodyById[id] = innParas[i + 1].trim();
  }
}

let innUpdated = 0;
for (const p of inn.programs || []) {
  if (bodyById[p.id]) {
    p.mr = p.mr || {};
    p.mr.body = bodyById[p.id];
    innUpdated++;
  }
}
fs.writeFileSync(INNOVATIVE_PATH, JSON.stringify(inn, null, 2), 'utf8');
console.log('Innovative programs updated:', innUpdated, '/', (inn.programs || []).length);

/* ─── 3. Purpose section (ध्येय आणि धोरण) ────────────────────── */
const purposeParas = readDocText('शिवसेनेचे_ध्येय_आणि_धोरण_.xml');
/* Doc structure:
     [0] हेडर - शिवसेनेचे ध्येय आणि धोरण
     [1] शिवसेनेचे ध्येय                      ← subhead 1
     [2] <body of ध्येय>
     [3] शिवसेनेचे धोरण                       ← subhead 2
     [4] <body of धोरण> */
const purposeMr = {
  eyebrow: 'पक्षाची भूमिका',
  title: 'शिवसेनेचे ध्येय आणि धोरण',
  sections: [
    {
      id: 'dhyey',
      title: purposeParas[1] || 'शिवसेनेचे ध्येय',
      body: purposeParas[2] || '',
    },
    {
      id: 'dhoran',
      title: purposeParas[3] || 'शिवसेनेचे धोरण',
      body: purposeParas[4] || '',
    },
  ],
};

const purposeEn = {
  eyebrow: 'OUR STANCE',
  title: "Shiv Sena's Vision & Policy",
  sections: [
    {
      id: 'dhyey',
      title: "Our Vision",
      body: "Protecting the self-respect of the Marathi people, the fierce pride of Hindutva, and the dignity of Maharashtra — that is Shiv Sena's foremost goal. Founded by Hindu-Hridaysamrat Shiv Sena chief Balasaheb Thackeray, Shiv Sena is not merely a political organization but a broad movement that fights for the rights of the common people — farmers, workers, the labouring class, the middle class, youth, women, senior citizens, entrepreneurs, students, and every section of society — to bring them justice, dignity, and into the mainstream of development.",
    },
    {
      id: 'dhoran',
      title: "Our Policy",
      body: "“80% social work and 20% politics” is Shiv Sena's foundational policy. Adopting the path of Hindutva given by Hindu-Hridaysamrat Shiv Sena chief Balasaheb Thackeray, taking to the streets for the common people's concerns, firmly upholding Hindutva and nationalism, fighting for the rights of the Marathi people, and prioritising public welfare — this is Shiv Sena's policy. Through development, public service, organisational strength, and people-oriented administration, Shiv Sena is resolved to build a stronger, more prosperous Maharashtra.",
    },
  ],
};

/* About page — add as top-level section */
const about = JSON.parse(fs.readFileSync(ABOUT_PATH, 'utf8'));
about.purpose = { mr: purposeMr, en: purposeEn };
fs.writeFileSync(ABOUT_PATH, JSON.stringify(about, null, 2), 'utf8');
console.log('Added purpose section to about.json');

/* Home page — same data, available to reference if a homepage
   section is wired in later */
const home = JSON.parse(fs.readFileSync(HOME_PATH, 'utf8'));
home.purpose = { mr: purposeMr, en: purposeEn };
fs.writeFileSync(HOME_PATH, JSON.stringify(home, null, 2), 'utf8');
console.log('Added purpose section to home.json');

console.log('\n✓ Content import complete.');
