/* ═══════════════════════════════════════════════════════════════
 Devanagari (Marathi) → Latin transliteration
 - Handles schwa deletion at end of words (natural Marathi reading)
 - Capitalises each word for English presentation
 - Pass-through for non-Devanagari content (spaces, punctuation, digits)
═══════════════════════════════════════════════════════════════ */

import leadershipContent from '../../../content/leadership.json';

const VOWELS = {
  'अ':'a','आ':'aa','इ':'i','ई':'i','उ':'u','ऊ':'u',
  'ऋ':'ri','ए':'e','ऐ':'ai','ओ':'o','औ':'au','ॲ':'a','ऑ':'o',
};

const VOWEL_SIGNS = {
  'ा':'a','ि':'i','ी':'i','ु':'u','ू':'u',
  'ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au','ॅ':'a','ॉ':'o',
};

const CONSONANTS = {
  'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'n',
  'च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'n',
  'ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n',
  'त':'t','थ':'th','द':'d','ध':'dh','न':'n',
  'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m',
  'य':'y','र':'r','ल':'l','व':'v',
  'श':'sh','ष':'sh','स':'s','ह':'h','ळ':'l',
  /* Marathi-specific rare consonants */
  'ऱ':'r','ऴ':'l','क़':'q','ख़':'kh','ग़':'gh','ज़':'z','ड़':'d','ढ़':'dh','फ़':'f','य़':'y',
};

const OTHERS = { 'ं':'n','ः':'h','्':'','़':'','ँ':'n' };

const DEV_DIGITS = {
  '०':'0','१':'1','२':'2','३':'3','४':'4',
  '५':'5','६':'6','७':'7','८':'8','९':'9',
};

function transliterateWord(word) {
  const chars = [...word];
  let result = '';
  let lastWasConsonant = false;

  for (let i = 0; i < chars.length; i++) {
 const ch = chars[i];
 const next = chars[i + 1];

 if (CONSONANTS[ch]) {
 result += CONSONANTS[ch];
 lastWasConsonant = true;

 if (next === '्') { // halant kill inherent 'a'
 i++;
 lastWasConsonant = false;
 } else if (VOWEL_SIGNS[next]) { // explicit vowel sign overrides 'a'
 result += VOWEL_SIGNS[next];
 i++;
 lastWasConsonant = false;
 } else if (OTHERS[next]) { // anusvara/visarga still need 'a'
 result += 'a' + OTHERS[next];
 i++;
 lastWasConsonant = false;
 } else if (i === chars.length - 1) {
 // last char of word schwa deletion (skip inherent 'a' for Marathi reading)
 } else {
 result += 'a';
 }
 } else if (VOWELS[ch]) {
 result += VOWELS[ch];
 lastWasConsonant = false;
 } else if (OTHERS[ch]) {
 result += OTHERS[ch];
 lastWasConsonant = false;
 } else if (DEV_DIGITS[ch]) {
 result += DEV_DIGITS[ch];
 lastWasConsonant = false;
 } else {
 result += ch;
 lastWasConsonant = false;
 }
  }

  return result;
}

const HAS_DEVANAGARI = /[ऀ-ॿঀ-৿]/;

/* Common honorifics + role tags that appear inside personal names substituted token-by-token so "डॉ. श्रीमती. निलमताई" becomes
 "Dr. Smt. Nilamtai" instead of "Do. Shrimati. Nilamtai". */
const NAME_TOKEN_MAP = {
  'डॉ.': 'Dr.',
  'श्री.': 'Shri',
  'श्री': 'Shri',
  'सौ.': 'Smt.',
  'श्रीमती.': 'Smt.',
  'श्रीमती':  'Smt.',
  'श्रीम.': 'Smt.',
  'श्रीम': 'Smt.',
  'कु.': 'Ku.',
  'ॲड.': 'Adv.',
  'प्रा.': 'Prof.',
  'प्रा.सौ.': 'Prof. Smt.',
  'कॅ.': 'Capt.',
  'कॅ.श्री.': 'Capt. Shri',
  'डॉ.श्री.': 'Dr. Shri',
  'मा.': 'Hon.',
  'कै.': 'Late',
  'आ.': 'Hon.',
  'आ.श्री.':  'Hon. Shri',
  'खा.': 'MP',
  'मंत्री': 'Minister',
  'मा.खा.':  'Former MP',
  'मा.आ.':  'Former MLA',
};

export function transliterateName(text) {
  if (!text) return '';
  return text
 .split(/(\s+)/)
 .map((token) => {
 if (/^\s+$/.test(token)) return token;
 if (!HAS_DEVANAGARI.test(token)) return token;
 if (NAME_TOKEN_MAP[token]) return NAME_TOKEN_MAP[token];
 const t = transliterateWord(token);
 if (!t) return '';
 return t.charAt(0).toUpperCase() + t.slice(1);
 })
 .join('');
}

/* ─── Role / title translations (longest match first) ─── */
const ROLE_PHRASES = [
  /* Long compound phrases must come first so they match before substrings */
  ['माननीय उप-मुख्यमंत्री, महाराष्ट्र राज्य', 'Hon. Deputy CM, State of Maharashtra'],
  ['महाराष्ट्र विधानसभा सदस्यांद्वारा', 'via Vidhan Sabha members'],
  ['विधानसभा सदस्यांद्वारा', 'via Vidhan Sabha members'],
  ['राज्यपाल नामनिर्देशित', 'Governor-nominated'],
  ['नामनिर्देशित', 'Nominated'],
  ['उपसभापती, विधान परिषद', 'Deputy Speaker, Legislative Council'],
  ['विधान परिषद सदस्य', 'MLC'],
  ['विधान परिषद', 'Legislative Council'],
  ['नाशिक शिक्षक विभाग', 'Nashik Teachers Constituency'],
  ['अमरावती शिक्षक विभाग', 'Amravati Teachers Constituency'],
  ['शिक्षक विभाग', 'Teachers Constituency'],
  ['महाराष्ट्र प्रदेश समन्वयक', 'Maharashtra Pradesh Coordinator'],
  ['राष्ट्रीय सह-समन्वयक', 'National Co-Coordinator'],
  ['प्रसार माध्यम समन्वयक', 'Media Coordinator'],
  ['निवडणूक विभाग समन्वयक', 'Election Cell Coordinator'],
  ['निवडणूक विभाग', 'Election Cell'],
  ['ग्राहक संरक्षण कक्ष', 'Consumer Protection Cell'],
  ['शिक्षकेत्तर कर्मचारी सेना', 'Non-Teaching Staff Sena'],
  ['अल्प संख्यांक विभाग', 'Minorities Cell'],
  ['सहकार विभाग', 'Cooperative Cell'],
  ['सोशल मीडिया उप-राज्यप्रमुख', 'Social Media Deputy State Head'],
  ['सोशल मीडिया राज्यप्रमुख', 'Social Media State Head'],
  ['सोशल मीडिया', 'Social Media'],
  ['युवासेना सरचिटणीस', 'Yuva Sena General Secretary'],
  ['युवासेना कार्याध्यक्ष', 'Yuva Sena Working President'],
  ['युवासेना राज्य सचिव', 'Yuva Sena State Secretary'],
  ['युवासेना', 'Yuva Sena'],
  ['राज्य सचिव', 'State Secretary'],
  ['राष्ट्रीय प्रवक्त्या', 'National Spokesperson'],
  ['राष्ट्रीय प्रवक्ता', 'National Spokesperson'],
  ['हिंदी/इंग्रजी प्रवक्ते', 'Hindi/English Spokesperson'],
  ['हिंदी प्रवक्ते', 'Hindi Spokesperson'],
  ['महाराष्ट्र राज्य', 'State of Maharashtra'],
  ['माननीय उप-मुख्यमंत्री', 'Hon. Deputy CM'],
  ['उप-मुख्यमंत्री', 'Deputy CM'],
  ['मुख्यमंत्री', 'CM'],
  ['उपसभापती', 'Deputy Speaker'],
  ['कें. रा. मंत्री', 'Union Minister of State'],
  ['केंद्रीय राज्य मंत्री', 'Union Minister of State'],
  ['केंद्रीय मंत्री', 'Union Minister'],
  ['कॅबिनेट मंत्री', 'Cabinet Minister'],
  ['कॅ. मंत्री', 'Cabinet Minister'],
  ['राज्यमंत्री', 'Minister of State'],
  ['मुख्य प्रतोद', 'Chief Whip'],
  ['मुख्यनेते', 'Chief Leader'],
  ['गटनेते', 'Group Leader'],
  ['सरचिटणीस', 'General Secretary'],
  ['सह-सचिव', 'Co-Secretary'],
  ['खजिनदार', 'Treasurer'],
  ['प्रवक्ते', 'Spokesperson'],
  ['समन्वयक', 'Coordinator'],
  ['मा. मंत्री', 'Former Minister'],
  ['मा. खासदार', 'Former MP'],
  ['मा. आमदार', 'Former MLA'],
  ['मा. आ.', 'Former MLA'],
  ['मा. खा.', 'Former MP'],
  ['माजी मंत्री', 'Former Minister'],
  ['मंत्री', 'Minister'],
  ['खासदार', 'MP'],
  ['आमदार', 'MLA'],
  ['कै.', 'Late'],
  ['मा.', 'Hon.'],
  ['डॉ.', 'Dr.'],
  ['ॲड.', 'Adv.'],
  ['प्रा.', 'Prof.'],
  ['कॅ.', 'Capt.'],
  ['श्री.', 'Shri'],
  ['सौ.', 'Smt.'],
  ['श्रीमती.', 'Smt.'],
  ['श्रीम.', 'Smt.'],
  ['कु.', 'Ku.'],
  ['वि.प.स.', 'MLC'],
  ['वि.स.स.', 'MLC'],
  ['राज्यसभा', 'Rajya Sabha'],
  ['लोकसभा', 'Lok Sabha'],
  ['विधानसभा', 'Vidhan Sabha'],
  ['शिवसेना नेते', 'Shiv Sena Leader'],
  ['शिवसेना उपनेते', 'Shiv Sena Deputy Leader'],
  ['शिवसेना सचिव', 'Shiv Sena Secretary'],
  ['सचिव', 'Secretary'],
  ['नेते', 'Leader'],
  ['उपनेते', 'Deputy Leader'],
  ['जिल्हाप्रमुख', 'District Head'],
  ['महानगर प्रमुख', 'City Head'],
  ['विभागीय संपर्क प्रमुख', 'Divisional Contact Head'],
  ['विभागीय सह संपर्क प्रमुख', 'Divisional Co-Contact Head'],
  ['लोकसभा संपर्क प्रमुख', 'LS Contact Head'],
  ['संपर्क प्रमुख', 'Contact Head'],
  ['उत्तर कोकण', 'North Konkan'],
  ['दक्षिण कोकण', 'South Konkan'],
  ['कोकण', 'Konkan'],
  ['पश्चिम महाराष्ट्र', 'Western Maharashtra'],
  ['उत्तर महाराष्ट्र', 'North Maharashtra'],
  ['पूर्व विदर्भ', 'East Vidarbha'],
  ['पश्चिम विदर्भ', 'West Vidarbha'],
  ['मराठवाडा', 'Marathwada'],
  ['विदर्भ', 'Vidarbha'],
  ['मुंबई शहर', 'Mumbai City'],
  ['मुंबई', 'Mumbai'],
  ['नांदेड', 'Nanded'],
  ['नागपूर', 'Nagpur'],
  ['नाशिक', 'Nashik'],
  ['नंदुरबार', 'Nandurbar'],
  ['पुणे', 'Pune'],
  ['यवतमाळ-वाशीम', 'Yavatmal-Washim'],
  ['सिंधुदुर्ग', 'Sindhudurg'],
  ['सहयोगी आमदार', 'Allied MLA'],
  ['अपक्ष आमदार', 'Independent MLA'],
  ['सहयोगी', 'Allied'],
  ['कार्यक्षेत्र', 'Area'],
];

export function translateRole(text) {
  if (!text) return '';
  let result = text;
  for (const [mr, en] of ROLE_PHRASES) {
 if (result.includes(mr)) result = result.split(mr).join(en);
  }
  // Anything still in Devanagari → transliterate
  return transliterateName(result);
}

/* ═══════════════════════════════════════════════════════════════
 Cross-reference lookup: MLAs in mlas-by-district.json are stored
 with English names + social handles + photos, but the corresponding
 Marathi names (and full role strings like "आमदार १५४-मागाठाणे")
 live in leadership.json under byRegion.<division>.mla.

 We build a one-time photo-path index so that when the UI is in
 Marathi mode, we can return the MR name/role for any English-source
 MLA card. ConstituencyNo (extracted from the MR role string) is a
 fallback in case photo paths don't match.
═══════════════════════════════════════════════════════════════ */

const DEV_DIGIT_TO_ASCII = { '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9' };
const ASCII_DIGIT_TO_DEV = ['०','१','२','३','४','५','६','७','८','९'];

function devToAscii(s) {
  return String(s).replace(/[०-९]/g, (d) => DEV_DIGIT_TO_ASCII[d] ?? d);
}

export function asciiToDevanagari(s) {
  return String(s).replace(/\d/g, (d) => ASCII_DIGIT_TO_DEV[Number(d)] ?? d);
}

const MR_MLA_BY_PHOTO = {};
const MR_MLA_BY_CONSTITUENCY = {};
(() => {
  /* The Marathi MLA list lives at `stateLevel.mla` (one flat array of all
 MLAs party-wide). `byRegion.<division>` only carries the regional roles
 like contact heads it has no `mla` field, so don't look there. */
  const indexMla = (m) => {
 if (!m) return;
 if (m.photo) MR_MLA_BY_PHOTO[m.photo] = m;
 // Role pattern: "आमदार १५४-मागाठाणे" / "आमदार, उपमुख्यमंत्री १४७-कोपरी पाचपाखाडी"
 const numMatch = m.role && m.role.match(/[०-९]+/);
 if (numMatch) {
 const num = Number(devToAscii(numMatch[0]));
 if (num && !MR_MLA_BY_CONSTITUENCY[num]) MR_MLA_BY_CONSTITUENCY[num] = m;
 }
  };

  // Primary source: top-level stateLevel.mla (where all MR MLAs actually live)
  (leadershipContent?.stateLevel?.mla || []).forEach(indexMla);

  // Defensive: also walk byRegion.*.mla in case future entries get added there
  Object.values(leadershipContent?.byRegion || {}).forEach((region) => {
 (region.mla || []).forEach(indexMla);
  });
})();

/* Look up the Marathi record for an English-source MLA member.
 Tries photo path first (exact match), then constituency number. */
export function mrMlaFor(member) {
  if (!member) return null;
  if (member.photo && MR_MLA_BY_PHOTO[member.photo]) return MR_MLA_BY_PHOTO[member.photo];
  if (member.constituencyNo && MR_MLA_BY_CONSTITUENCY[member.constituencyNo]) {
 return MR_MLA_BY_CONSTITUENCY[member.constituencyNo];
  }
  return null;
}

/* Convenience helper used by leader cards */
export function memberFor(member, lang) {
  if (lang !== 'en') {
 /* English-source MLAs: pull the MR name/role from leadership.json */
 const mr = mrMlaFor(member);
 if (mr) return { name: mr.name, role: mr.role };
 return { name: member.name, role: member.role };
  }
  return {
 name: member.name_en || transliterateName(member.name),
 role: member.role_en || translateRole(member.role),
  };
}
