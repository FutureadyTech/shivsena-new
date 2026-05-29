/* ═══════════════════════════════════════════════════════════════
   IMAGE SIZE AUDIT  (Playwright)

   Crawls every public route on the running dev server and captures
   the RENDERED dimensions of every <img> and every element with a
   background-image, at three viewports (desktop / tablet / mobile).

   Output: `Rendered_Image_Sizes.xlsx` at the project root,
   one sheet per viewport.

   Run:
     1. Make sure `npm run dev` is running on :5173
     2. node scripts/audit-image-sizes.cjs
═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const XLSX = require('xlsx');

const BASE = process.env.AUDIT_BASE || 'http://localhost:5173';
const OUT  = path.resolve('Rendered_Image_Sizes.xlsx');

/* ─── Routes to crawl ───────────────────────────────────────────
   /home is the meaty one. Includes leader-profile + affiliated-org
   sub-routes so dynamic pages are covered too. */
const ROUTES = [
  { name: 'Entrance', path: '/' },
  { name: 'Home',     path: '/home' },
  { name: 'About',    path: '/about' },
  { name: 'Leadership', path: '/leadership' },
  { name: 'News',     path: '/news' },
  { name: 'Contact',  path: '/contact' },
  { name: 'Declarations', path: '/declarations' },
  { name: 'Innovative', path: '/innovative' },
  { name: 'Mahayuti', path: '/mahayuti' },
  { name: 'Leader · Thackeray', path: '/leader/thackeray' },
  { name: 'Leader · Dighe',     path: '/leader/dighe' },
  { name: 'Leader · Shinde',    path: '/leader/shinde' },
];

/* ─── Viewports ─────────────────────────────────────────────── */
const VIEWPORTS = [
  { label: 'Desktop · 1920×1080', width: 1920, height: 1080 },
  { label: 'Tablet · 768×1024',   width: 768,  height: 1024 },
  { label: 'Mobile · 390×844',    width: 390,  height: 844  },
];

/* ─── In-page extractor: returns one row per visible image ───
   - <img> elements        → src + rendered + natural sizes
   - background-image els  → background URL + rendered size
   Skips elements that are display:none / 0×0. */
const EXTRACTOR = () => {
  /* eslint-disable no-undef */
  const out = [];

  function nearestSection(el) {
    let n = el;
    while (n) {
      if (n.tagName === 'SECTION' && n.className) {
        return (typeof n.className === 'string' ? n.className : '').trim().split(/\s+/)[0];
      }
      n = n.parentElement;
    }
    return '';
  }

  function classString(el) {
    if (!el || !el.className) return '';
    return (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/).slice(0, 3).join('.');
  }

  // 1) Real <img> tags
  document.querySelectorAll('img').forEach((img) => {
    const r = img.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    out.push({
      kind: 'img',
      section: nearestSection(img),
      element: img.tagName.toLowerCase() + (classString(img) ? '.' + classString(img) : ''),
      renderedW: Math.round(r.width),
      renderedH: Math.round(r.height),
      naturalW: img.naturalWidth || 0,
      naturalH: img.naturalHeight || 0,
      src: img.currentSrc || img.src || '',
    });
  });

  // 2) Elements with a background-image URL
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundImage;
    if (!bg || bg === 'none') return;
    const m = bg.match(/url\(["']?([^"')]+)/);
    if (!m) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    out.push({
      kind: 'bg',
      section: nearestSection(el),
      element: el.tagName.toLowerCase() + (classString(el) ? '.' + classString(el) : ''),
      renderedW: Math.round(r.width),
      renderedH: Math.round(r.height),
      naturalW: 0,
      naturalH: 0,
      src: m[1],
    });
  });

  return out;
  /* eslint-enable no-undef */
};

/* ─── Helpers ────────────────────────────────────────────────── */
function aspectLabel(w, h) {
  if (!w || !h) return '';
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const g = gcd(w, h);
  const a = w / g, b = h / g;
  if (a > 50 || b > 50) return (w / h).toFixed(2) + ':1';
  return `${a}:${b}`;
}

function dedupRows(rows) {
  /* Some background images appear on several decorative ::before/::after
     style layers — collapse exact duplicates. */
  const seen = new Set();
  return rows.filter((r) => {
    const k = [r.pageName, r.viewport, r.section, r.element, r.renderedW, r.renderedH, r.src].join('|');
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ─── Main ───────────────────────────────────────────────────── */
(async () => {
  console.log('Launching headless Chromium …');
  const browser = await chromium.launch({ headless: true });

  const allRows = [];

  for (const vp of VIEWPORTS) {
    console.log(`\n──  Viewport: ${vp.label}  ──`);
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      userAgent: 'ImageAudit/1.0 (Playwright)',
    });
    const page = await ctx.newPage();

    for (const route of ROUTES) {
      const url = BASE + route.path;
      process.stdout.write(`  ${route.name.padEnd(28)} `);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        /* Scroll to the bottom to trigger lazy-loaded images */
        await page.evaluate(async () => {
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
          const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
          for (let y = 0; y < max; y += 600) {
            window.scrollTo(0, y);
            await sleep(120);
          }
          window.scrollTo(0, 0);
          await sleep(300);
        });
        await page.waitForTimeout(800);

        const rows = await page.evaluate(EXTRACTOR);
        rows.forEach((r) => {
          r.pageName = route.name;
          r.pagePath = route.path;
          r.viewport = vp.label;
          allRows.push(r);
        });
        console.log(`✓  ${rows.length} images`);
      } catch (err) {
        console.log('✗ ', err.message.split('\n')[0]);
      }
    }
    await ctx.close();
  }
  await browser.close();

  /* ─── Build XLSX ────────────────────────────────────────────── */
  const clean = dedupRows(allRows);
  console.log(`\nTotal rows after dedup: ${clean.length}`);

  const wb = XLSX.utils.book_new();
  const headerRow = [
    'Page', 'Path', 'Viewport', 'Section', 'Element',
    'Kind', 'Rendered W', 'Rendered H', 'Rendered (WxH)',
    'Aspect', 'Natural W', 'Natural H', 'Image src',
  ];

  /* Sheet 1: ALL rows */
  const all = [headerRow, ...clean.map((r) => [
    r.pageName, r.pagePath, r.viewport, r.section, r.element,
    r.kind, r.renderedW, r.renderedH, `${r.renderedW}×${r.renderedH}`,
    aspectLabel(r.renderedW, r.renderedH),
    r.naturalW || '', r.naturalH || '',
    r.src,
  ])];
  const wsAll = XLSX.utils.aoa_to_sheet(all);
  wsAll['!cols'] = [
    { wch: 22 }, { wch: 14 }, { wch: 22 }, { wch: 28 }, { wch: 32 },
    { wch: 5 },  { wch: 9 },  { wch: 9 },  { wch: 14 },
    { wch: 10 }, { wch: 9 },  { wch: 9 },  { wch: 70 },
  ];
  XLSX.utils.book_append_sheet(wb, wsAll, 'All Images');

  /* One sheet per viewport for quick scanning */
  for (const vp of VIEWPORTS) {
    const subset = clean.filter((r) => r.viewport === vp.label);
    if (!subset.length) continue;
    const rows = [
      ['Page', 'Section', 'Element', 'Kind', 'Rendered (WxH)', 'Aspect', 'Image src'],
      ...subset.map((r) => [
        r.pageName, r.section, r.element, r.kind,
        `${r.renderedW}×${r.renderedH}`,
        aspectLabel(r.renderedW, r.renderedH),
        r.src,
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 32 }, { wch: 5 }, { wch: 14 }, { wch: 10 }, { wch: 70 }];
    XLSX.utils.book_append_sheet(wb, ws, vp.label.split(' ')[0]); // "Desktop"/"Tablet"/"Mobile"
  }

  /* Summary sheet: unique image src + max rendered size seen anywhere */
  const bySrc = {};
  for (const r of clean) {
    const key = r.src;
    const prev = bySrc[key];
    const area = r.renderedW * r.renderedH;
    if (!prev || area > prev.renderedW * prev.renderedH) {
      bySrc[key] = { ...r };
    }
  }
  const summary = [
    ['Image src', 'Largest rendered (WxH)', 'Aspect', 'Page (largest seen on)', 'Section', 'Element', 'Natural (WxH)'],
    ...Object.values(bySrc)
      .sort((a, b) => (b.renderedW * b.renderedH) - (a.renderedW * a.renderedH))
      .map((r) => [
        r.src,
        `${r.renderedW}×${r.renderedH}`,
        aspectLabel(r.renderedW, r.renderedH),
        r.pageName,
        r.section,
        r.element,
        r.naturalW ? `${r.naturalW}×${r.naturalH}` : '',
      ]),
  ];
  const wsSum = XLSX.utils.aoa_to_sheet(summary);
  wsSum['!cols'] = [{ wch: 70 }, { wch: 22 }, { wch: 10 }, { wch: 22 }, { wch: 28 }, { wch: 32 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsSum, 'Per-file Summary');

  XLSX.writeFile(wb, OUT);
  console.log(`\n✓ Wrote ${OUT}`);
  console.log(`  Sheets: All Images · Desktop · Tablet · Mobile · Per-file Summary`);
})();
