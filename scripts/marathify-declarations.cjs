/* ═══════════════════════════════════════════════════════════════
   MARATHIFY DECLARATIONS

   Walks every candidate in src/content/declarations.json and adds
   two new fields:
     - candidateMr     (Marathi candidate name)
     - constituencyMr  (Marathi constituency name)

   Order of resolution:
     1. Manual override in CANDIDATE_OVERRIDES / CONSTITUENCY_MR
        (most accurate — handcrafted for known names/places).
     2. Elected MLA lookup by constituency number from
        leadership.stateLevel.mla (when a Shiv Sena MLA won
        that seat — uses the official MR name + role tail).
     3. Rule-based Latin → Devanagari transliteration for any
        remaining text.

   Re-runnable: re-running overwrites the *Mr fields with the
   latest mappings; English source fields are never modified.
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const FILE = path.resolve('src/content/declarations.json');

/* ─── Maharashtra Vidhan Sabha constituency name dictionary ──── */
const CONSTITUENCY_MR = {
  'Akkalkuwa':              'अक्कलकुआ',
  'Sakri':                  'साक्री',
  'Chopda':                 'चोपडा',
  'Jalgaon Rural':          'जळगाव ग्रामीण',
  'Erandol':                'एरंडोल',
  'Pachora':                'पाचोरा',
  'Muktainagar':            'मुक्ताईनगर',
  'Buldhana':               'बुलढाणा',
  'Sindkhed Raja':          'सिंदखेड राजा',
  'Mehkar':                 'मेहकर',
  'Balapur':                'बाळापूर',
  'Risod':                  'रिसोड',
  'Daryapur':               'दर्यापूर',
  'Ramtek':                 'रामटेक',
  'Ramtek (SC)':            'रामटेक (अ.जा.)',
  'Bhandara':               'भंडारा',
  'Digras':                 'दिग्रस',
  'Hadgaon':                'हदगाव',
  'Nanded North':           'नांदेड उत्तर',
  'Nanded South':           'नांदेड दक्षिण',
  'Kalamnuri':              'कळमनुरी',
  'Parbhani':               'परभणी',
  'Ghansawangi':            'घनसावंगी',
  'Jalna':                  'जालना',
  'Sillod':                 'सिल्लोड',
  'Kannad':                 'कन्नड',
  'Aurangabad Central':     'औरंगाबाद मध्य',
  'Aurangabad West':        'औरंगाबाद पश्चिम',
  'Aurangabad (Sambhajinagar)':'छत्रपती संभाजीनगर',
  'Paithan':                'पैठण',
  'Vaijapur':               'वैजापूर',
  'Nandgaon':               'नांदगाव',
  'Malegaon Outer':         'मालेगाव बाह्य',
  'Deolali':                'देवळाली',
  'Palghar':                'पालघर',
  'Boisar':                 'बोईसर',
  'Bhiwandi Rural':         'भिवंडी ग्रामीण',
  'Bhiwandi East':          'भिवंडी पूर्व',
  'Kalyan West':            'कल्याण पश्चिम',
  'Ambernath':              'अंबरनाथ',
  'Kalyan Rural':           'कल्याण ग्रामीण',
  'Ovala – Majiwada':       'ओवळा-माजीवाडा',
  'Kopri – Pachpakhadi':    'कोपरी-पाचपाखाडी',
  'Magathane':              'मागाठाणे',
  'Vikhroli':               'विक्रोळी',
  'Bhandup West':           'भांडुप पश्चिम',
  'Jogeshwari East':        'जोगेश्वरी पूर्व',
  'Dindoshi':               'दिंडोशी',
  'Andheri East':           'अंधेरी पूर्व',
  'Chandivali':             'चांदिवली',
  'Mankhurd Shivaji Nagar': 'मानखुर्द शिवाजी नगर',
  'Chembur':                'चेंबूर',
  'Kurla':                  'कुर्ला',
  'Dharavi':                'धारावी',
  'Mahim':                  'माहीम',
  'Worli':                  'वरळी',
  'Byculla':                'भायखळा',
  'Mumbadevi':              'मुंबादेवी',
  'Karjat':                 'कर्जत',
  'Alibag':                 'अलिबाग',
  'Mahad':                  'महाड',
  'Purandar':               'पुरंदर',
  'Sangamner':              'संगमनेर',
  'Shrirampur':             'श्रीरामपूर',
  'Nevasa':                 'नेवासा',
  'Umarga':                 'उमरगा',
  'Osmanabad':              'उस्मानाबाद',
  'Paranda':                'परंडा',
  'Karmala':                'करमाळा',
  'Barshi':                 'बार्शी',
  'Sangole':                'सांगोले',
  'Koregaon':               'कोरेगाव',
  'Patan':                  'पाटण',
  'Dapoli':                 'दापोली',
  'Guhagar':                'गुहागर',
  'Ratnagiri':              'रत्नागिरी',
  'Rajapur':                'राजापूर',
  'Kudal':                  'कुडाळ',
  'Sawantwadi':             'सावंतवाडी',
  'Radhanagari':            'राधानगरी',
  'Karvir':                 'करवीर',
  'Kolhapur North':         'कोल्हापूर उत्तर',
  'Kolhapur':               'कोल्हापूर',
  'Khanapur':               'खानापूर',
  'Hatkanangale':           'हातकणंगले',
  'Yavatmal – Washim':      'यवतमाळ–वाशिम',
  'Hingoli':                'हिंगोली',
  'Mawal':                  'मावळ',
  'Shirdi':                 'शिर्डी',
  'Kalyan':                 'कल्याण',
  'Thane':                  'ठाणे',
  'Nashik':                 'नाशिक',
  'Nashik Division':        'नाशिक विभाग',
  'Mumbai North West':      'मुंबई उत्तर पश्चिम',
  'Mumbai South':           'मुंबई दक्षिण',
  'Mumbai South Central':   'मुंबई दक्षिण मध्य',
};

/* ─── Hand-translated Marathi candidate names ───────────────────
   Keyed by exact English string as it appears in declarations.json.
   Many Shiv Sena candidates have well-known Marathi spellings —
   capturing them here is more accurate than auto-transliteration. */
const CANDIDATE_OVERRIDES = {
  /* Vidhan Sabha 2024 — non-winning candidates */
  'Khedekar Dr. Shashikant Narsingrao':  'खेडेकर डॉ. शशिकांत नरसिंगराव',
  'Sanjay Bhaskar Raymulkar':            'श्री. संजय भास्कर रायमुलकर',
  'Baliram Bhagwan Siraskar':            'श्री. बळीराम भगवान शिरस्कर',
  'Bhavana Pundlikrao Gawali':           'श्रीमती. भावना पुंडलिकराव गवळी',
  'Abhijit Anand Adsul':                 'श्री. अभिजीत आनंद अडसुळ',
  'Anand Sheshrao Bharose':              'श्री. आनंद शेषराव भरोसे',
  'Dr. Rajashri Harishchandra Ahirrao':  'डॉ. राजश्री हरिश्चंद्र अहिरराव',
  'Santosh Manjayya Shetty':             'श्री. संतोष मांजय्या शेट्टी',
  'Suvarna Sahdev Karanje':              'श्रीमती. सुवर्णा सहदेव करंजे',
  'Manisha Ravindra Waikar':             'श्रीमती. मनीषा रवींद्र वायकर',
  'Sanjay Nirupam':                      'श्री. संजय निरुपम',
  'Suresh Krishnaroa Patil':             'श्री. सुरेश कृष्णराव पाटील',
  'Rajesh Shivdas Khandare':             'श्री. राजेश शिवदास खंडारे',
  'Sadanand Shankar Sarvankar':          'श्री. सदानंद शंकर सरवणकर',
  'Milind Murli Deora':                  'श्री. मिलिंद मुरली देवरा',
  'Yamini Yashwant Jadhav':              'श्रीमती. यामिनी यशवंत जाधव',
  'Shaina Manish Chudasama Munot':       'श्रीमती. शायना मनीष चुडासमा मुणोत',
  'Bhausaheb Malhari Kamble':            'श्री. भाऊसाहेब मल्हारी कांबळे',
  'Chougule Dnyanraj Dhondiram':         'श्री. ज्ञानराज धोंडीराम चौगुले',
  'Ajit Bappasaheb Pingle':              'श्री. अजित बाप्पासाहेब पिंगळे',
  'Digvijay Digambarrao Bagal':          'श्री. दिग्विजय दिगंबरराव बागल',
  'Rajendra Vitthal Raut':               'श्री. राजेंद्र विठ्ठल राऊत',
  'Shahaji Rajaram Patil':               'श्री. शहाजी राजाराम पाटील',
  'Bendal Rajesh Ramchandra':            'श्री. राजेश रामचंद्र बेंडल',
  'Rajesh Vinayak Kshirsagar':           'श्री. राजेश विनायक क्षीरसागर',

  /* Lok Sabha 2024 */
  'Shri Shrirang Barne':                 'श्री. श्रीरंग बारणे',
  'Shri Shrikant Eknath Shinde':         'श्री. श्रीकांत एकनाथ शिंदे',
  'Shri Naresh Ganpat Mhaske':           'श्री. नरेश गणपत म्हस्के',
  'Shri Prataprao Jadhav':               'श्री. प्रतापराव जाधव',
  'Shri Sandipan Bhumare':               'श्री. संदीपान भुमरे',
  'Shri Ravindra Waikar':                'श्री. रविंद्र वायकर',
  'Shri Milind Deora':                   'श्री. मिलिंद देवरा',
  'Shri Yamini Jadhav':                  'श्रीमती. यामिनी जाधव',
  'Shri Lokmanya Jadhav':                'श्री. लोकमान्य जाधव',
  'Shri Sadashiv Lokhande':              'श्री. सदाशिव लोखंडे',
  'Shri Rahul Shewale':                  'श्री. राहुल शेवाळे',
  'Shri Hemant Patil':                   'श्री. हेमंत पाटील',
  'Shri Raosaheb Danve':                 'श्री. रावसाहेब दानवे',
  'Shri Dhairyasheel Patil':             'श्री. धैर्यशील पाटील',
  'Shri Dhairyashil Mane':               'श्री. धैर्यशील माने',

  /* Rajya Sabha / Vidhan Parishad */
  'Smt. Bhavana Pundlikrao Gawali':      'श्रीमती. भावना पुंडलिकराव गवळी',
  'Smt. Neelam Divakar Gorhe':           'डॉ. श्रीमती. नीलमताई दिवाकर गोऱ्हे',
  'Shri Milind Mahadev Narvekar':        'श्री. मिलिंद महादेव नार्वेकर',
};

/* ─── Rule-based fallback Latin → Devanagari ────────────────────
   Tuned for casual English spellings of Marathi names. Used only
   when neither the override dictionary nor MLA lookup produces a
   match. Imperfect but predictable. */
const VOWEL_INDEP = {
  'a':'अ','aa':'आ','i':'इ','ii':'ई','ee':'ई','u':'उ','uu':'ऊ','oo':'ऊ',
  'e':'ए','ai':'ऐ','o':'ओ','au':'औ',
};
const VOWEL_SIGN = {
  'a':'','aa':'ा','i':'ि','ii':'ी','ee':'ी','u':'ु','uu':'ू','oo':'ू',
  'e':'े','ai':'ै','o':'ो','au':'ौ',
};
const CONS = {
  'k':'क','kh':'ख','g':'ग','gh':'घ',
  'ch':'च','chh':'छ','j':'ज','jh':'झ',
  't':'त','th':'थ','d':'द','dh':'ध','n':'न',
  'tt':'ट','tth':'ठ','dd':'ड','ddh':'ढ',
  'p':'प','ph':'फ','f':'फ','b':'ब','bh':'भ','m':'म',
  'y':'य','r':'र','l':'ल','v':'व','w':'व',
  'sh':'श','s':'स','h':'ह','ksh':'क्ष',
  'mh':'म्ह','nh':'न्ह','lh':'ल्ह','rh':'र्ह','vh':'व्ह','wh':'व्ह',
};
function readNext(s, i, table) {
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
  while (i < lower.length) {
    const [c, cLen] = readNext(lower, i, CONS);
    if (c) {
      out += CONS[c];
      i += cLen;
      if (i >= lower.length) continue;
      const [v, vLen] = readNext(lower, i, VOWEL_SIGN);
      if (v) {
        if (v !== 'a') out += VOWEL_SIGN[v];
        i += vLen;
      }
      continue;
    }
    const [v, vLen] = readNext(lower, i, VOWEL_INDEP);
    if (v) { out += VOWEL_INDEP[v]; i += vLen; continue; }
    out += word[i];
    i++;
  }
  return out;
}
const HONOR_MAP = {
  'shri':'श्री.','shri.':'श्री.',
  'smt':'श्रीमती.','smt.':'श्रीमती.',
  'sou':'सौ.','sou.':'सौ.',
  'ku':'कु.','ku.':'कु.',
  'dr':'डॉ.','dr.':'डॉ.',
  'adv':'ॲड.','adv.':'ॲड.',
  'prof':'प्रा.','prof.':'प्रा.',
};
function autoTransliterate(name) {
  if (!name) return '';
  return name.split(/\s+/).map((tok) => {
    if (/[ऀ-ॿ]/.test(tok)) return tok;            // already MR
    const honor = HONOR_MAP[tok.toLowerCase()];
    if (honor) return honor;
    if (/^\(.*\)$/.test(tok)) return '(' + transliterateWord(tok.slice(1, -1)) + ')';
    return transliterateWord(tok);
  }).join(' ');
}

/* ─── Build MLA constituency-number lookup from leadership.json ── */
function buildMlaLookup() {
  const l = JSON.parse(fs.readFileSync(path.resolve('src/content/leadership.json'), 'utf8'));
  const D2A = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'};
  const lookup = {};
  for (const m of (l.stateLevel?.mla || [])) {
    const nm = m.role && m.role.match(/[०-९]+/);
    if (nm) {
      const num = Number(String(nm[0]).replace(/[०-९]/g, (d) => D2A[d]));
      if (num && !lookup[num]) lookup[num] = m;
    }
  }
  return lookup;
}
const MLA_BY_CON = buildMlaLookup();

/* ─── Resolution helpers ──────────────────────────────────────── */
function resolveCandidate(c) {
  if (CANDIDATE_OVERRIDES[c.candidate]) return CANDIDATE_OVERRIDES[c.candidate];
  if (c.no && MLA_BY_CON[c.no]?.name) return MLA_BY_CON[c.no].name;
  return autoTransliterate(c.candidate || '');
}
function resolveConstituency(c) {
  const raw = (c.constituency || '').trim();
  if (!raw) return '';
  if (CONSTITUENCY_MR[raw]) return CONSTITUENCY_MR[raw];
  if (c.no && MLA_BY_CON[c.no]?.role) {
    const tail = MLA_BY_CON[c.no].role.split('—').pop().trim();
    const parts = tail.split('-');
    if (parts.length > 1) return parts.slice(1).join('-').trim() || autoTransliterate(raw);
  }
  return autoTransliterate(raw);
}

/* ─── Walk and enrich ────────────────────────────────────────── */
const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let count = 0, mlaCount = 0, overrideCount = 0, autoCount = 0;

for (const cy of data.cycles || []) {
  const groups = cy.groups ? cy.groups : [{ candidates: cy.candidates || [] }];
  for (const g of groups) {
    for (const c of (g.candidates || [])) {
      const candidateMr = resolveCandidate(c);
      const constituencyMr = resolveConstituency(c);
      c.candidateMr = candidateMr;
      c.constituencyMr = constituencyMr;
      count++;
      if (CANDIDATE_OVERRIDES[c.candidate]) overrideCount++;
      else if (c.no && MLA_BY_CON[c.no]) mlaCount++;
      else autoCount++;
    }
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
console.log('✓ Enriched', count, 'candidates with Marathi fields');
console.log('  - via override dict   :', overrideCount);
console.log('  - via elected MLA     :', mlaCount);
console.log('  - via auto-translit   :', autoCount);
console.log('Output:', FILE);
