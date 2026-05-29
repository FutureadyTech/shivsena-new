/* Builds Image_Audit.xlsx — the full per-page image inventory we ran
   in Chrome DevTools, plus 2× retina delivery targets, formatted for
   Google Sheets import. Run with:  node build_image_audit_xlsx.cjs */

const XLSX = require('C:/Users/Admin/AppData/Local/Temp/wirephoto-deps/node_modules/xlsx');

const OUT = 'C:/Users/Admin/Downloads/shivsena-clean/shivsena-clean/Image_Audit.xlsx';

const HEADERS = ['Page', 'Rendered', 'Filename', 'Section', 'Deliver (2× retina)', 'Notes'];

const rows = [
  /* ─────── HOME ─────── */
  ['Home', '60 × 60',    'logo.png',                                'Header',                              '240 × 240', ''],
  ['Home', '48 × 48',    'logo.png',                                'Footer',                              '240 × 240', 'Reused asset'],
  ['Home', '48 × 48',    'icons/governance.png',                    'Vision pillar',                       '96 × 96',   ''],
  ['Home', '48 × 48',    'icons/unity.png',                         'Vision pillar',                       '96 × 96',   ''],
  ['Home', '48 × 48',    'icons/progress.png',                      'Vision pillar',                       '96 × 96',   ''],
  ['Home', '604 × 500',  'leaders/thackeray.jpg',                   'वारसा हिंदुत्वाचा',                    '1208 × 1000', 'Source 500×518 — undersized, blurry'],
  ['Home', '604 × 500',  'leaders/dharmaveer.jpg',                  'वारसा हिंदुत्वाचा',                    '1208 × 1000', 'Source 500×518 — undersized, blurry'],
  ['Home', '604 × 500',  'leaders/shinde-white.png',                'वारसा हिंदुत्वाचा',                    '1208 × 1000', '1.5 MB PNG — convert to WebP'],
  ['Home', '1532 × 600', 'timeline/image-1.png',                    'Our Journey (background)',            '3064 × 1200', ''],
  ['Home', '913 × 300',  'news/featured-maha-day.jpg',              'News',                                '1920 × 640',  '404 — file missing'],
  ['Home', '100 × 100',  'news/air-india-flight.jpg',               'News thumbnail',                      '240 × 240',   ''],
  ['Home', '100 × 100',  'news/bmc-win.webp',                       'News thumbnail',                      '240 × 240',   ''],
  ['Home', '100 × 100',  'news/womens-bill.jpg',                    'News thumbnail',                      '240 × 240',   ''],
  ['Home', '44 × 44',    'MLA / MP photos (multiple)',              'Region Explorer avatars',             'See /leadership', 'Same files as Leadership directory'],

  /* ─────── ABOUT ─────── */
  ['About', '60 × 60',    'logo.png',                               'Header',                              '240 × 240',   'Reused asset'],
  ['About', '48 × 48',    'logo.png',                               'Footer',                              '240 × 240',   'Reused asset'],
  ['About', '1629 × 739', 'img-1.jpg',                              'About banner (background)',           '2560 × 1440', ''],
  ['About', '604 × 500',  'leaders/thackeray.jpg',                  'वारसा हिंदुत्वाचा',                    '1208 × 1000', 'Same file as /home'],
  ['About', '604 × 500',  'leaders/dharmaveer.jpg',                 'वारसा हिंदुत्वाचा',                    '1208 × 1000', 'Same file as /home'],
  ['About', '604 × 500',  'leaders/shinde-white.png',               'वारसा हिंदुत्वाचा',                    '1208 × 1000', 'Same file as /home'],
  ['About', '1532 × 600', 'timeline/image-1.png',                   'Our Journey (background)',            '3064 × 1200', 'Same file as /home'],
  ['About', '32 × 32',    'icons/orgs/bks.png',                     'भारतीय कामगार सेना',                  '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/sls.png',                     'स्थानीय लोकाधिकार समिति',             '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/yuva.png',                    'युवा सेना',                           '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/bvs.png',                     'भारतीय विद्यार्थी सेना',              '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/mahila.png',                  'शिवसेना महिला आघाडी',                 '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/udyog.png',                   'शिवसेना उद्योग सेना',                 '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/shikshak.png',                'शिक्षक सेना',                          '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/chitrapat.png',               'चित्रपट सेना',                         '128 × 128',   ''],
  ['About', '32 × 32',    'icons/orgs/arogya.png',                  'आरोग्य सेना',                          '128 × 128',   ''],

  /* ─────── LEADERSHIP ─────── */
  ['Leadership', '60 × 60',    'logo.png',                          'Header',                              '240 × 240',   'Reused asset'],
  ['Leadership', '48 × 48',    'logo.png',                          'Footer',                              '240 × 240',   'Reused asset'],
  ['Leadership', '1673 × 759', 'img-2.webp',                        'Leadership banner (background)',      '2560 × 1440', ''],
  ['Leadership', '338 × 450',  'leaders/MP Photos/* (9 MPs)',       'खासदार',                              '720 × 960',   'Match the two gold-standard files: Bhumare + Ranjanatai Jadhav'],
  ['Leadership', '338 × 450',  'leaders/Mla Photos/* (60 MLAs)',    'आमदार',                                '720 × 960',   'Most currently 238×317 — needs re-delivery'],
  ['Leadership', '338 × 450',  'leaders/नेते/*',                     'नेते',                                 '720 × 960',   ''],
  ['Leadership', '338 × 450',  'leaders/उपनेते/*',                   'उपनेते',                               '720 × 960',   ''],
  ['Leadership', '338 × 450',  'leaders/मंत्री/*',                   'विभागीय संपर्क प्रमुख',                '720 × 960',   ''],
  ['Leadership', '338 × 450',  'leaders/महिला/*',                    'महिला जिल्हाप्रमुख',                   '720 × 960',   '89 leaders missing'],
  ['Leadership', '338 × 450',  'placeholder/placeholder-men.png',   'District placeholder',                '720 × 960',   'Default fallback'],
  ['Leadership', '338 × 450',  'placeholder/placeholder-women.png', 'District placeholder',                '720 × 960',   'Default fallback'],
  ['Leadership', '44 × 44',    '(same files as above)',             'Region Explorer avatars',             'See above',   'Reuses directory photos'],

  /* ─────── INNOVATIVE ─────── */
  ['Innovative', '60 × 60',    'logo.png',                                 'Header',                       '240 × 240',   'Reused asset'],
  ['Innovative', '48 × 48',    'logo.png',                                 'Footer',                       '240 × 240',   'Reused asset'],
  ['Innovative', '1678 × 762', 'img-2.webp',                               'Innovative banner (background)', '2560 × 1440', ''],
  ['Innovative', '606 × 454',  'innovative/shiv-sena-medical-help.jpg',    'शिवसेना वैद्यकीय मदत कक्ष',     '1212 × 908',  'Source 500×518 — undersized'],
  ['Innovative', '606 × 454',  'innovative/aapla-dawakhana.webp',          'बाळासाहेब ठाकरे आपला दवाखाना',  '1212 × 908',  'OK'],
  ['Innovative', '606 × 454',  'innovative/shasan-aplya-dari.webp',        'शासन आपल्या दारी',              '1212 × 908',  'OK'],
  ['Innovative', '606 × 454',  'innovative/ladki-bahin-yojana.avif',       'मुख्यमंत्री माझी लाडकी बहीण योजना', '1212 × 908', 'Source 480×321 — undersized'],
  ['Innovative', '606 × 454',  'innovative/dharmaveer-anand-dighe.jpg',    'धर्मवीर आनंद दिघे नागरी सहायता कक्ष', '1212 × 908', 'Source 500×518 — undersized'],

  /* ─────── NEWS ─────── */
  ['News', '60 × 60',     'logo.png',                                                 'Header',                          '240 × 240',   'Reused asset'],
  ['News', '48 × 48',     'logo.png',                                                 'Footer',                          '240 × 240',   'Reused asset'],
  ['News', '1632 × 740',  'img-2.webp',                                               'News banner (background)',        '2560 × 1440', ''],

  ['News', '913 × 300',   'new-imgs/gettyimages-2256018761-612x612.jpg',              'प्रेस रिलीज — featured',          '1920 × 640',  'Source 488×612 — undersized'],
  ['News', '100 × 100',   'new-imgs/mumbai_-maharashtra…shiv-sena-mlas.webp',         'प्रेस रिलीज — thumbnail',         '240 × 240',   ''],
  ['News', '100 × 100',   'leaders/leader-2.jpg',                                     'प्रेस रिलीज — thumbnail',         '240 × 240',   ''],
  ['News', '100 × 100',   'new-imgs/gettyimages-2256018761-612x612.jpg',              'प्रेस रिलीज — thumbnail',         '240 × 240',   ''],

  ['News', '679 × 382',   'new-imgs/06eknath-shinde.webp',                            'मुलाखती व लेख — featured',         '1440 × 810',  ''],
  ['News', '130 × 130',   'new-imgs/TNIE_import_…Shinde_PTI1_Final.avif',             'मुलाखती व लेख — list thumb',       '320 × 320',   ''],
  ['News', '130 × 130',   'leaders/thackeray.jpg',                                    'मुलाखती व लेख — list thumb',       '320 × 320',   ''],
  ['News', '130 × 130',   'leaders/shinde.png',                                       'मुलाखती व लेख — list thumb',       '320 × 320',   ''],
  ['News', '130 × 130',   'leaders/dharmaveer.jpg',                                   'मुलाखती व लेख — list thumb',       '320 × 320',   ''],

  ['News', '388 × 218',   'new-imgs/gettyimages-2256018761-612x612.jpg',              'भाषणे — card',                     '800 × 450',   ''],
  ['News', '388 × 218',   'new-imgs/TNIE_import_…Shinde_PTI1_Final.avif',             'भाषणे — card',                     '800 × 450',   ''],
  ['News', '388 × 218',   'new-imgs/06eknath-shinde.webp',                            'भाषणे — card',                     '800 × 450',   ''],

  ['News', '388 × 218',   'new-imgs/gettyimages-2256018761-612x612.jpg',              'व्हिडीओ गॅलरी — card',             '800 × 450',   ''],
  ['News', '388 × 218',   'leaders/leader-2.jpg',                                     'व्हिडीओ गॅलरी — card',             '800 × 450',   ''],
  ['News', '388 × 218',   'img-2.webp',                                               'व्हिडीओ गॅलरी — card',             '800 × 450',   ''],
  ['News', '388 × 218',   'new-imgs/06eknath-shinde.webp',                            'व्हिडीओ गॅलरी — card',             '800 × 450',   ''],
  ['News', '388 × 218',   'leaders/dharmaveer.jpg',                                   'व्हिडीओ गॅलरी — card',             '800 × 450',   ''],
  ['News', '388 × 218',   'new-imgs/images.jpg',                                      'व्हिडीओ गॅलरी — card',             '800 × 450',   '404 — file missing'],

  ['News', '293 × 367',   'new-imgs/gettyimages-2256018761-612x612.jpg',              'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × 219',   'new-imgs/mumbai_-maharashtra…shiv-sena-mlas.webp',         'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × 180',   'img-2.webp',                                               'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × 400',   'leaders/leader-2.jpg',                                     'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × ?',     'leaders/leader-1.jpg',                                     'फोटो गॅलरी — tile',                '800 × max 1100', '404 — file missing'],
  ['News', '293 × 196',   'new-imgs/TNIE_import_…Shinde_PTI1_Final.avif',             'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × 303',   'leaders/dharmaveer.jpg',                                   'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × ?',     'img-1.jpg',                                                'फोटो गॅलरी — tile',                '800 × max 1100', '404 — file missing'],
  ['News', '293 × 202',   'new-imgs/06eknath-shinde.webp',                            'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × 367',   'new-imgs/gettyimages-2256018761-612x612.jpg',              'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × 303',   'leaders/thackeray.jpg',                                    'फोटो गॅलरी — tile',                '800 × max 1100', 'Masonry, flexible'],
  ['News', '293 × ?',     'new-imgs/G7-8skRaAAAQX6z.png',                             'फोटो गॅलरी — tile',                '800 × max 1100', '404 — file missing'],
];

const data = [HEADERS, ...rows];
const ws = XLSX.utils.aoa_to_sheet(data);

/* Column widths */
const widths = HEADERS.map((h, i) => {
  const max = Math.max(h.length, ...rows.map((r) => (r[i] ? String(r[i]).length : 0)));
  return { wch: Math.min(80, Math.max(10, max + 2)) };
});
ws['!cols'] = widths;

/* Freeze header row */
ws['!freeze'] = { xSplit: 0, ySplit: 1 };

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Image Audit');
XLSX.writeFile(wb, OUT);

console.log('✅ Wrote', OUT);
console.log('Total rows:', rows.length);
