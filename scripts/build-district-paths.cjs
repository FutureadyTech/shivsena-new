/* Emit a React data module of accurate Maharashtra district outlines:
   one SVG path per project district slug, in a viewBox sized to match the
   old PC map (so existing CSS stroke-widths still look right).

   Consumed by RegionExplorer.jsx and RegionMap.jsx. */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '_mh.geojson');
const OUT = path.join(__dirname, '..', 'src', 'pages', 'Home', 'sections', 'districtPaths.js');

/* GeoJSON English district name -> project slug (see src/config/districts.js) */
const SLUG = {
  Ahmednagar: 'ahmadnagar',
  Akola: 'akola',
  Amravati: 'amravati',
  Aurangabad: 'aurangabad',
  Beed: 'beed',
  Bhandara: 'bhandara',
  Buldhana: 'buldhana',
  Chandrapur: 'chandrapur',
  Dhule: 'dhule',
  Gadchiroli: 'gadchiroli',
  Gondia: 'gondia',
  Hingoli: 'hingoli',
  Jalgaon: 'jalgaon',
  Jalna: 'jalna',
  Kolhapur: 'kolhapur',
  Latur: 'latur',
  Mumbai: 'mumbai',
  Nagpur: 'nagpur',
  Nanded: 'nanded',
  Nandurbar: 'nandurbar',
  Nashik: 'nashik',
  Osmanabad: 'dharashiv',
  Palghar: 'palghar',
  Parbhani: 'parbhani',
  Pune: 'pune',
  Raigad: 'raigad',
  Ratnagiri: 'ratnagiri',
  Sangli: 'sangli',
  Satara: 'satara',
  Sindhudurg: 'sindhudurg',
  Solapur: 'solapur',
  Thane: 'thane',
  Wardha: 'wardha',
  Washim: 'washim',
  Yavatmal: 'yavatmal',
};

const gj = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const feats = gj.features;

let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
const eachCoord = (geom, fn) => {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  for (const poly of polys) for (const ring of poly) for (const [lon, lat] of ring) fn(lon, lat);
};
for (const f of feats) eachCoord(f.geometry, (lon, lat) => {
  if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
  if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
});

const W = 1126.9;       // total viewBox width (incl. left label gutter)
const PAD = 8;
const LEFT_EXTRA = 100; // gutter on the west coast for the Mumbai / Mumbai-Suburban labels
const latMid = (minLat + maxLat) / 2;
const kx = Math.cos((latMid * Math.PI) / 180);
const spanX = (maxLon - minLon) * kx;
const spanY = (maxLat - minLat);
const scale = (W - 2 * PAD - LEFT_EXTRA) / spanX;
const H = +(spanY * scale + 2 * PAD).toFixed(2);

const px = (lon) => +(PAD + LEFT_EXTRA + (lon - minLon) * kx * scale).toFixed(2);
const py = (lat) => +(PAD + (maxLat - lat) * scale).toFixed(2);

/* ---- geometry helpers for label placement ---- */
const ringArea = (ring) => {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++)
    a += (ring[j][0] * ring[i][1]) - (ring[i][0] * ring[j][1]);
  return Math.abs(a / 2);
};
const pointInRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
    if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
};
const distToSeg = (x, y, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  let t = dx || dy ? ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy) : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
};
/* pole of inaccessibility (visual centre) via coarse→fine grid search */
const visualCenter = (ring) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of ring) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  const score = (x, y) => {
    if (!pointInRing(x, y, ring)) return -1;
    let dmin = Infinity;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++)
      dmin = Math.min(dmin, distToSeg(x, y, ring[j][0], ring[j][1], ring[i][0], ring[i][1]));
    return dmin;
  };
  let best = null, bestD = -1;
  for (let pass = 0; pass < 2; pass++) {
    const steps = 56;
    const sx = (x1 - x0) / steps, sy = (y1 - y0) / steps;
    const bx0 = best ? best[0] - sx * 4 : x0, bx1 = best ? best[0] + sx * 4 : x1;
    const by0 = best ? best[1] - sy * 4 : y0, by1 = best ? best[1] + sy * 4 : y1;
    const stx = (bx1 - bx0) / steps, sty = (by1 - by0) / steps;
    for (let i = 0; i <= steps; i++) for (let k = 0; k <= steps; k++) {
      const x = bx0 + i * stx, y = by0 + k * sty;
      const dd = score(x, y);
      if (dd > bestD) { bestD = dd; best = [x, y]; }
    }
  }
  return best || [(x0 + x1) / 2, (y0 + y1) / 2];
};

const rows = [];
for (const f of feats) {
  const en = f.properties.district;
  const slug = SLUG[en];
  if (!slug) { console.warn('No slug for', en); continue; }
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = '';
  let biggest = null, biggestArea = -1;
  for (const poly of polys) {
    for (const ring of poly) {
      d += 'M' + ring.map(([lon, lat]) => `${px(lon)} ${py(lat)}`).join('L') + 'Z';
    }
    const a = ringArea(poly[0]);
    if (a > biggestArea) { biggestArea = a; biggest = poly[0]; }
  }
  const ringScreen = biggest.map(([lon, lat]) => [px(lon), py(lat)]);
  const [cx, cy] = visualCenter(ringScreen);
  rows.push({ slug, d, cx: +cx.toFixed(1), cy: +cy.toFixed(1) });
}
rows.sort((a, b) => a.slug.localeCompare(b.slug));

const body = rows.map((r) =>
  `  { slug: ${JSON.stringify(r.slug)}, cx: ${r.cx}, cy: ${r.cy}, d: ${JSON.stringify(r.d)} },`).join('\n');

const out = `/* AUTO-GENERATED by scripts/build-district-paths.cjs — do not edit by hand.
   Accurate Maharashtra district outlines, one path per district slug.
   cx/cy = visual-centre anchor for the red HQ dot + Marathi label.
   Source: udit-001/india-maps-data (35 district polygons). */

export const MH_VIEWBOX = "0 0 ${W} ${H}";

export const MH_DISTRICT_PATHS = [
${body}
];
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log('Wrote', OUT, '(' + rows.length, 'districts, viewBox 0 0', W, H + ')');
