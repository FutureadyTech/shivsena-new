/* ═══════════════════════════════════════════════════════════════
   ATTACH LEADER PHOTOS

   Scans public/leaders/* for image files and adds a `photo` field
   to the matching entries in src/content/leaders-by-district.json.

   Each photo's filename is the canonical hint (e.g.
   "01_Shri Prakash Surve.webp" → "Shri Prakash Surve").
   Matching is done with case-insensitive token overlap after
   stripping honorifics and after transliterating Marathi names
   to Latin for cross-script comparison.

   Run with:  node scripts/attach-leader-photos.cjs
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.resolve('src/content/leaders-by-district.json');
const PUBLIC_LEADERS = path.resolve('public/leaders');

/* ─── Inlined Marathi → Latin transliterator (same conventions as
   src/pages/Leadership/utils/transliterate.js) ─── */
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
const HAS_DEV = /[ऀ-ॿ]/;

function transliterateName(text) {
  if (!text) return '';
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

/* Honorifics + parenthesised suffixes to strip before token compare */
const STRIP_HONORIFICS_RE = /^(खा\.?|डॉ\.?|श्री\.?|श्रीम\.?|श्रीमती\.?|सौ\.?|कु\.?|ॲड\.?|प्रा\.?|कै\.?|मा\.?|आ\.?|मंत्री|शिवसेना|kha|dr|shri|smt|sou|smt\.?|sou\.?|adv|prof|prof\.?|kha\.?|mantri|main\s+leader|main\s+leader\s+dy\s+cm)\.?\s+/gi;
const STRIP_PARENS_RE = /\([^)]+\)/g;

function canonicalize(name) {
  if (!name) return '';
  // If Marathi, transliterate first so comparison is in one script
  let out = name;
  if (HAS_DEV.test(out)) out = transliterateName(out);
  out = out.toLowerCase();
  // Drop honorifics (multiple passes for stacked ones like "kha. dr. shri.")
  for (let i = 0; i < 5; i++) {
    const prev = out;
    out = out.replace(STRIP_HONORIFICS_RE, '');
    if (out === prev) break;
  }
  out = out.replace(STRIP_PARENS_RE, ' ');
  out = out.replace(/[.,\/–—\-]/g, ' ');
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

function tokens(name) {
  return canonicalize(name)
    .split(' ')
    .filter((t) => t.length >= 2);  // drop single chars (श्री → "shri" already stripped, but defensive)
}

/* Strip ALL vowels — gives the consonant skeleton. Useful for
   matching across Marathi's variable schwa deletion (e.g.
   "kudalkar" ↔ "kudalakar" both reduce to "kdlkr"). */
function skeleton(tok) {
  return tok.replace(/[aeiouyāīūṛḷṃḥ]/gi, '');
}
function skeletonTokens(toks) { return toks.map(skeleton).filter((s) => s.length >= 2); }

/* Token overlap score with a hard requirement that the LAST token
   (typical surname) of the photo or leader matches anywhere in the
   other side's tokens. Returns 0–10.

   Two passes: first exact-token overlap, then consonant-skeleton
   overlap (handles "kudalkar" ↔ "kudalakar" / schwa variations). */
function matchScore(leaderTokens, photoTokens) {
  if (!leaderTokens.length || !photoTokens.length) return 0;

  // Pass 1 — exact-token overlap
  const leaderSet = new Set(leaderTokens);
  const photoSet = new Set(photoTokens);
  const overlap = [...leaderSet].filter((t) => photoSet.has(t)).length;
  const leaderLast = leaderTokens[leaderTokens.length - 1];
  const photoLast = photoTokens[photoTokens.length - 1];
  const surnameMatch = photoSet.has(leaderLast) || leaderSet.has(photoLast);
  if (overlap > 0 && surnameMatch) {
    return overlap + (overlap === Math.min(leaderTokens.length, photoTokens.length) ? 3 : 0);
  }

  // Pass 2 — consonant-skeleton overlap (handles schwa variation)
  const lSkel = skeletonTokens(leaderTokens);
  const pSkel = skeletonTokens(photoTokens);
  if (!lSkel.length || !pSkel.length) return 0;
  const lSet = new Set(lSkel);
  const pSet = new Set(pSkel);
  const sOverlap = [...lSet].filter((t) => pSet.has(t)).length;
  if (sOverlap === 0) return 0;
  const sLeaderLast = lSkel[lSkel.length - 1];
  const sPhotoLast = pSkel[pSkel.length - 1];
  const sSurname = pSet.has(sLeaderLast) || lSet.has(sPhotoLast);
  if (!sSurname) return 0;
  // Slightly lower base because skeleton matches are looser
  return (sOverlap * 0.9) + (sOverlap === Math.min(lSkel.length, pSkel.length) ? 2 : 0);
}

/* ─── Map photo folders → category fields (preference, not hard
   constraint — a photo can still match an entry in another field). */
const FOLDER_CATEGORY_HINT = {
  '02_विभागीय संपर्क प्रमुख':       'divisionalContactHeads',
  '03_विभागीय सह संपर्क प्रमुख':    'divisionalCoContactHeads',
  '06_मंत्री':                       'deputyLeaders',   // ministers are usually उपनेते too
  '07_विधान परिषद सदस्य':           'deputyLeaders',   // MLCs as well
  '09_उपनेते':                       'deputyLeaders',
  'MP Photos':                       'mp',
  'Mla Photos':                      'mla',
};

/* ─── Gather every image file ───────────────────────────────── */
const photos = [];
for (const folder of Object.keys(FOLDER_CATEGORY_HINT)) {
  const dir = path.join(PUBLIC_LEADERS, folder);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    if (!/\.(webp|jpe?g|png)$/i.test(file)) continue;
    // canonical hint: strip "NN_" prefix and extension
    const stem = file.replace(/\.[a-z]+$/i, '').replace(/^\d{1,3}_+/, '').trim();
    photos.push({
      folder,
      file,
      stem,
      tokens: tokens(stem),
      preferField: FOLDER_CATEGORY_HINT[folder],
      url: '/leaders/' + encodeURIComponent(folder) + '/' + encodeURIComponent(file),
    });
  }
}
console.log('Indexed', photos.length, 'photos.');

/* ─── For each leader entry, find the best photo ────────────── */
const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
let attached = 0;
let missCount = 0;
const sampleMisses = [];

for (const slug of Object.keys(json)) {
  for (const field of Object.keys(json[slug])) {
    const arr = json[slug][field];
    if (!Array.isArray(arr)) continue;
    for (const entry of arr) {
      if (entry.photo) continue;  // already has one
      const eTokens = tokens(entry.name);
      if (!eTokens.length) continue;

      let best = null;
      let bestScore = 0;
      for (const p of photos) {
        let s = matchScore(eTokens, p.tokens);
        if (s === 0) continue;
        // Bonus when photo's preferred field matches leader's field
        if (p.preferField === field) s += 2;
        if (s > bestScore) { best = p; bestScore = s; }
      }

      if (best && bestScore >= 3) {
        entry.photo = best.url;
        attached++;
      } else {
        missCount++;
        if (sampleMisses.length < 8) sampleMisses.push(entry.name);
      }
    }
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(json, null, 2), 'utf8');

console.log('✓ Attached photos to', attached, 'leader entries.');
console.log('  Entries without a photo:', missCount, '(will fall back to gender placeholder)');
console.log();
console.log('Sample of unmatched names (for spot-check):');
sampleMisses.forEach((n) => console.log('  · ' + n));
