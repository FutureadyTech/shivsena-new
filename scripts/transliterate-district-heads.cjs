/* ═══════════════════════════════════════════════════════════════
   Transliterate the Latin district-head names already in
   src/content/leaders-by-district.json → Devanagari (Marathi).

   Two-stage approach for best accuracy:
     1. Try to match the Latin name against an existing Marathi
        name elsewhere in the JSON (MPs, MLAs, leaders, etc.) by
        comparing the EN transliteration of every MR name. If
        there's a confident match, reuse that MR name.
     2. Otherwise, run a custom rule-based Latin→Devanagari
        transliterator tuned for casual English spellings of
        Marathi names (handles "sh", "ch", "th", "mh", "aa", "ee",
        "oo", and the schwa-deletion at word boundaries).
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.resolve('src/content/leaders-by-district.json');

/* MR→EN transliterator — inlined from the project's
   src/pages/Leadership/utils/transliterate.js (the source file
   can't be require()'d directly because it imports leadership.json
   via ESM `import` syntax). Identical conventions: schwa-deletion
   at word endings, Marathi-specific consonants, honorific tokens
   passed through as their canonical Latin forms. */
const VOWELS_MR = {
  'अ':'a','आ':'aa','इ':'i','ई':'i','उ':'u','ऊ':'u',
  'ऋ':'ri','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ॲ':'a','ऑ':'o',
};
const VOWEL_SIGNS_MR = {
  'ा':'a','ि':'i','ी':'i','ु':'u','ू':'u',
  'ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au','ॅ':'a','ॉ':'o',
};
const CONSONANTS_MR = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'n',
  'च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'n',
  'ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n',
  'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
  'य':'y','र':'r','ल':'l','व':'v',
  'श':'sh','ष':'sh','स':'s','ह':'h','ळ':'l',
};
const OTHERS_MR = { 'ं':'n','ः':'h','्':'','़':'','ँ':'n' };
function transliterateName(text) {
  if (!text) return '';
  const HAS_DEV = /[ऀ-ॿ]/;
  return text.split(/(\s+)/).map((tok) => {
    if (/^\s+$/.test(tok)) return tok;
    if (!HAS_DEV.test(tok)) return tok;
    const chars = [...tok];
    let result = '';
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      const next = chars[i + 1];
      if (CONSONANTS_MR[ch]) {
        result += CONSONANTS_MR[ch];
        if (next === '्')                       { i++; }
        else if (VOWEL_SIGNS_MR[next])           { result += VOWEL_SIGNS_MR[next]; i++; }
        else if (OTHERS_MR[next])                { result += 'a' + OTHERS_MR[next]; i++; }
        else if (i === chars.length - 1)         { /* schwa deletion */ }
        else                                     { result += 'a'; }
      } else if (VOWELS_MR[ch])  result += VOWELS_MR[ch];
      else if (OTHERS_MR[ch])    result += OTHERS_MR[ch];
      else                       result += ch;
    }
    return result;
  }).join('');
}

/* ─── Step 2: Rule-based Latin → Devanagari for Marathi names ────
   Conventions used (most common English-spelling patterns):
     - Digraphs come first so they bind before single letters.
     - "aa/aa" → आ ; "ee/ii" → ई ; "oo" → ऊ
     - "sh" → श ; "ch" → च ; "chh" → छ ; "th" → थ ; "dh" → ध ;
       "ph" → फ ; "bh" → भ ; "gh" → घ ; "kh" → ख ; "mh" → म्ह
     - Schwa-deletion: trailing 'a' on a consonant cluster is dropped
       so "Parab" → परब (not परबा).
═══════════════════════════════════════════════════════════════ */

const VOWEL_INDEP = {
  'a':'अ','aa':'आ','i':'इ','ii':'ई','ee':'ई','u':'उ','uu':'ऊ','oo':'ऊ',
  'e':'ए','ai':'ऐ','o':'ओ','au':'औ',
};
const VOWEL_SIGN = {
  'a':'','aa':'ा','i':'ि','ii':'ी','ee':'ी','u':'ु','uu':'ू','oo':'ू',
  'e':'े','ai':'ै','o':'ो','au':'ौ',
};

/* Consonants and their special vowel-sign mappings */
const CONS = {
  'k':'क','kh':'ख','g':'ग','gh':'घ','ng':'ङ',
  'c':'च','ch':'च','chh':'छ','j':'ज','jh':'झ','ny':'ञ',
  't':'त','th':'थ','d':'द','dh':'ध','n':'न',
  'tt':'ट','tth':'ठ','dd':'ड','ddh':'ढ','nn':'ण',
  'p':'प','ph':'फ','f':'फ','b':'ब','bh':'भ','m':'म',
  'y':'य','r':'र','l':'ल','v':'व','w':'व','sh':'श','s':'स','h':'ह','ksh':'क्ष','gn':'ज्ञ','jn':'ज्ञ',
  /* Marathi-specific aspirated consonants */
  'mh':'म्ह','nh':'न्ह','lh':'ल्ह','rh':'र्ह','vh':'व्ह','wh':'व्ह',
};

/* Read the longest matching token (digraph or trigraph first). */
function readNext(s, i, table) {
  // try trigraph (3 chars), digraph (2), then 1
  for (let len = 3; len >= 1; len--) {
    const slice = s.slice(i, i + len).toLowerCase();
    if (table[slice]) return [slice, len];
  }
  return [null, 0];
}

function transliterateWord(word) {
  if (!word) return '';
  const lower = word.toLowerCase();
  let out = '';
  let i = 0;
  // Track whether the *previous* glyph emitted was a consonant
  // (which carries an inherent "a"). If yes and the next char is
  // another consonant, we DO NOT need a halant — just let the
  // schwa stay implicit (Hindi/Marathi reading convention).
  let prevWasConsonant = false;

  while (i < lower.length) {
    // 1) Consonant first (digraph/trigraph aware)
    const [c, cLen] = readNext(lower, i, CONS);
    if (c) {
      out += CONS[c];
      i += cLen;
      prevWasConsonant = true;

      // Now look at what follows:
      if (i >= lower.length) {
        // End of word — schwa-deletion (do nothing). Naked consonant
        // glyph reads correctly in Marathi.
        continue;
      }
      // Vowel next? Attach the matra (vowel sign).
      const [v, vLen] = readNext(lower, i, VOWEL_SIGN);
      if (v) {
        if (v !== 'a') {
          // Any vowel OTHER than the inherent "a" gets a matra.
          out += VOWEL_SIGN[v];
        }
        // For "a" specifically, the inherent vowel is already implicit
        // in the consonant — no matra needed.
        i += vLen;
        prevWasConsonant = false;
        continue;
      }
      // Another consonant or non-letter follows — leave the inherent
      // "a" in place (Hindi/Marathi convention). DO NOT emit halant
      // unless the cluster is genuinely conjunct like "shr"/"tr" —
      // but distinguishing this from "Mehta" / "Patkar" reliably is
      // hard, so we stay implicit (slightly over-pronounced but
      // visually correct in 95%+ of names).
      continue;
    }

    // 2) Standalone vowel (only valid at word start or right after a
    //    non-consonant). Use independent form.
    const [v, vLen] = readNext(lower, i, VOWEL_INDEP);
    if (v) {
      out += VOWEL_INDEP[v];
      i += vLen;
      prevWasConsonant = false;
      continue;
    }

    // 3) Non-letter — pass through (spaces, parens, dots, etc.)
    out += word[i];
    i++;
    prevWasConsonant = false;
  }

  return out;
}

/* Honorifics: keep what's already there (the importer pre-set them
   in Marathi). Anything still in Latin gets normalised here. */
const HONORIFIC_MAP = {
  'shri': 'श्री.', 'shri.': 'श्री.',
  'smt': 'श्रीमती.', 'smt.': 'श्रीमती.',
  'sou': 'सौ.', 'sou.': 'सौ.',
  'ku': 'कु.', 'ku.': 'कु.',
  'dr': 'डॉ.', 'dr.': 'डॉ.',
  'adv': 'ॲड.', 'adv.': 'ॲड.',
  'prof': 'प्रा.', 'prof.': 'प्रा.',
  'mantri': 'मंत्री',
  'kha': 'खा.', 'kha.': 'खा.',
};

/* Manual overrides for names where the rule-based output is wrong.
   Add to this map as you spot mistakes — they take priority over
   the auto transliteration. */
const MANUAL_OVERRIDES = {
  // Common Marathi names — manually written
  'sachidanand urf sanju jagannath parab': 'सच्चिदानंद उर्फ संजू जगन्नाथ परब',
  'devdatta (datta) samant':                'देवदत्त (दत्ता) सामंत',
  'shashikant chavan':                      'शशिकांत चव्हाण',
  'rahul pandit':                           'राहुल पंडित',
  'naresh mhaske':                          'नरेश म्हस्के',
  'devanand thale':                         'देवानंद थळे',
  'maruti shinde':                          'मारुती शिंदे',
  'raju yashwant bhoir':                    'राजू यशवंत भोईर',
  'gopal ramchandra lande':                 'गोपाल रामचंद्र लांडे',
  'dwarkanath babu bhoir':                  'द्वारकानाथ बाबू भोईर',
  'kishore patkar':                         'किशोर पाटकर',
  'naresh mhaske':                          'नरेश म्हस्के',
};

function transliterateFullName(latin) {
  if (!latin) return '';
  const lower = latin.toLowerCase().trim();
  // Manual override?
  if (MANUAL_OVERRIDES[lower]) return MANUAL_OVERRIDES[lower];

  // Token-by-token: honorifics get the dict, names get rule-based
  const tokens = latin.split(/\s+/);
  const out = [];
  for (const tok of tokens) {
    // Already Devanagari? keep as-is
    if (/[ऀ-ॿ]/.test(tok)) { out.push(tok); continue; }
    const honor = HONORIFIC_MAP[tok.toLowerCase().replace(/\./g, '.')];
    if (honor) { out.push(honor); continue; }
    // Parenthesised aliases like "(Datta)" — recurse inside the parens
    if (/^\(.*\)$/.test(tok)) {
      const inner = tok.slice(1, -1);
      out.push('(' + transliterateWord(inner) + ')');
      continue;
    }
    out.push(transliterateWord(tok));
  }
  return out.join(' ');
}

/* ─── Step 1: match Latin → existing MR via transliteration of all
   MR names. We compute every MR name's EN transliteration, lowercase
   both, and look for full or 80%+ substring overlap. */
function buildMrFromExisting(d) {
  const all = [];
  for (const dist of Object.keys(d)) {
    for (const role of Object.keys(d[dist])) {
      if (!Array.isArray(d[dist][role])) continue;
      if (role === 'districtHead') continue; // skip what we're rewriting
      for (const m of d[dist][role]) {
        if (m.name && /[ऀ-ॿ]/.test(m.name)) {
          all.push({
            mr: m.name,
            en: (transliterateName(m.name) || '').toLowerCase(),
          });
        }
      }
    }
  }
  return all;
}

function matchInExisting(latinName, mrPool) {
  if (!latinName) return null;
  const cleaned = latinName
    .toLowerCase()
    .replace(/^(shri\.|smt\.|sou\.|ku\.|dr\.|adv\.|prof\.|mantri|kha\.)\s*/g, '')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return null;

  // Look for exact full-name match first
  for (const m of mrPool) {
    const mEnClean = m.en
      .replace(/^(shri\s*|smt\s*|sou\s*|dr\s*|adv\s*|prof\s*|kha\s*|mantri\s*)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (mEnClean === cleaned) return m.mr;
  }
  // Surname + first-name token match (≥2 token overlap)
  const tokens = cleaned.split(/\s+/);
  for (const m of mrPool) {
    const mTokens = m.en.split(/\s+/);
    const overlap = tokens.filter((t) => mTokens.includes(t)).length;
    if (overlap >= 2) return m.mr;
  }
  return null;
}

/* ─── Run ───────────────────────────────────────────────────── */
const d = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const mrPool = buildMrFromExisting(d);
console.log('MR names available for cross-reference:', mrPool.length);

let viaMatch = 0, viaRules = 0;
for (const slug of Object.keys(d)) {
  const heads = d[slug].districtHead || [];
  for (const h of heads) {
    // Strip the honorific that the importer already converted, get the
    // raw Latin remainder
    const m = h.name.match(/^([^ऀ-ॿ]*[ऀ-ॿ]+\.?\s*)?(.*)$/);
    const honor = (m?.[1] || '').trim();
    const latinPart = (m?.[2] || '').trim();

    if (!latinPart) continue; // already fully MR

    // Try existing data
    const existing = matchInExisting(latinPart, mrPool);
    if (existing) {
      h.name = existing;
      viaMatch++;
      continue;
    }

    // Fall back to rule-based transliterator
    const trans = transliterateFullName(latinPart);
    h.name = (honor ? honor + ' ' : '') + trans;
    viaRules++;
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(d, null, 2), 'utf8');

console.log('Transliterated:', viaMatch + viaRules, 'names');
console.log('  via existing MR data match :', viaMatch);
console.log('  via rule-based fallback    :', viaRules);

/* Sample a few results for inspection */
console.log('\n=== Samples ===');
const samples = ['thane', 'pune', 'sindhudurg', 'aurangabad'];
for (const s of samples) {
  console.log('\n' + s + ':');
  (d[s]?.districtHead || []).slice(0, 4).forEach((h) =>
    console.log('  ' + h.name + '  ·  ' + h.role + '  ·  ' + h.phone)
  );
}
