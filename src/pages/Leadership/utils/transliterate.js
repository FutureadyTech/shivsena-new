/* ═══════════════════════════════════════════════════════════════
   Devanagari (Marathi) → Latin transliteration
   - Handles schwa deletion at end of words (natural Marathi reading)
   - Capitalises each word for English presentation
   - Pass-through for non-Devanagari content (spaces, punctuation, digits)
═══════════════════════════════════════════════════════════════ */

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

      if (next === '्') {                       // halant — kill inherent 'a'
        i++;
        lastWasConsonant = false;
      } else if (VOWEL_SIGNS[next]) {           // explicit vowel sign overrides 'a'
        result += VOWEL_SIGNS[next];
        i++;
        lastWasConsonant = false;
      } else if (OTHERS[next]) {                // anusvara/visarga still need 'a'
        result += 'a' + OTHERS[next];
        i++;
        lastWasConsonant = false;
      } else if (i === chars.length - 1) {
        // last char of word — schwa deletion (skip inherent 'a' for Marathi reading)
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

export function transliterateName(text) {
  if (!text) return '';
  return text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      if (!HAS_DEVANAGARI.test(token)) return token;
      const t = transliterateWord(token);
      if (!t) return '';
      return t.charAt(0).toUpperCase() + t.slice(1);
    })
    .join('');
}

/* ─── Role / title translations (longest match first) ─── */
const ROLE_PHRASES = [
  ['महाराष्ट्र राज्य', 'State of Maharashtra'],
  ['माननीय उप-मुख्यमंत्री', 'Hon. Deputy CM'],
  ['उप-मुख्यमंत्री', 'Deputy CM'],
  ['मुख्यमंत्री', 'CM'],
  ['उपसभापती', 'Deputy Speaker'],
  ['कें. रा. मंत्री', 'Union Minister of State'],
  ['केंद्रीय मंत्री', 'Union Minister'],
  ['राज्यमंत्री', 'Minister of State'],
  ['मा. मंत्री', 'Former Minister'],
  ['मा. खासदार', 'Former MP'],
  ['मा. आमदार', 'Former MLA'],
  ['मा. आ.', 'Former MLA'],
  ['मा. खा.', 'Former MP'],
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
  ['पूर्व विदर्भ', 'East Vidarbha'],
  ['पश्चिम विदर्भ', 'West Vidarbha'],
  ['मराठवाडा', 'Marathwada'],
  ['विदर्भ', 'Vidarbha'],
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

/* Convenience helper used by leader cards */
export function memberFor(member, lang) {
  if (lang !== 'en') return { name: member.name, role: member.role };
  return {
    name: member.name_en || transliterateName(member.name),
    role: member.role_en || translateRole(member.role),
  };
}
