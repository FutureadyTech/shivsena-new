/* Build a Maharashtra district choropleth SVG that matches the reference image:
   36 districts (current names), white borders, varied orange fills,
   red HQ dots and Marathi labels.

   Source GeoJSON: udit-001/india-maps-data (35 district polygons).
   Mumbai Suburban (मुंबई उपनगर) has no separate polygon in the source, so it is
   added as a second label next to Mumbai, exactly as the reference image shows. */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '_mh.geojson');
const OUT = path.join(__dirname, '..', 'public', 'map', 'maharashtra-districts.svg');

/* English (source) -> current Marathi name */
const MR = {
  Ahmednagar: 'अहिल्यानगर',
  Akola: 'अकोला',
  Amravati: 'अमरावती',
  Aurangabad: 'छत्रपती संभाजीनगर',
  Beed: 'बीड',
  Bhandara: 'भंडारा',
  Buldhana: 'बुलढाणा',
  Chandrapur: 'चंद्रपूर',
  Dhule: 'धुळे',
  Gadchiroli: 'गडचिरोली',
  Gondia: 'गोंदिया',
  Hingoli: 'हिंगोली',
  Jalgaon: 'जळगाव',
  Jalna: 'जालना',
  Kolhapur: 'कोल्हापूर',
  Latur: 'लातूर',
  Mumbai: 'मुंबई',
  Nagpur: 'नागपूर',
  Nanded: 'नांदेड',
  Nandurbar: 'नंदुरबार',
  Nashik: 'नाशिक',
  Osmanabad: 'धाराशिव',
  Palghar: 'पालघर',
  Parbhani: 'परभणी',
  Pune: 'पुणे',
  Raigad: 'रायगड',
  Ratnagiri: 'रत्नागिरी',
  Sangli: 'सांगली',
  Satara: 'सातारा',
  Sindhudurg: 'सिंधुदुर्ग',
  Solapur: 'सोलापूर',
  Thane: 'ठाणे',
  Wardha: 'वर्धा',
  Washim: 'वाशिम',
  Yavatmal: 'यवतमाळ',
};

const gj = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const feats = gj.features;

/* ---- projection (equirectangular w/ latitude aspect correction) ---- */
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
const eachCoord = (geom, fn) => {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  for (const poly of polys) for (const ring of poly) for (const [lon, lat] of ring) fn(lon, lat);
};
for (const f of feats) eachCoord(f.geometry, (lon, lat) => {
  if (lon < minLon) minLon = lon; if (lon > maxLon) maxLon = lon;
  if (lat < minLat) minLat = lat; if (lat > maxLat) maxLat = lat;
});

const W = 2000;
const PAD = 20;
const LEFT_EXTRA = 150; // room for the Mumbai / Mumbai-Suburban labels on the coast
const latMid = (minLat + maxLat) / 2;
const kx = Math.cos((latMid * Math.PI) / 180);
const spanX = (maxLon - minLon) * kx;
const spanY = (maxLat - minLat);
const scale = (W - 2 * PAD - LEFT_EXTRA) / spanX;
const H = Math.round(spanY * scale + 2 * PAD);

const px = (lon) => PAD + LEFT_EXTRA + (lon - minLon) * kx * scale;
const py = (lat) => PAD + (maxLat - lat) * scale;

/* ---- geometry helpers ---- */
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
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(x - cx, y - cy);
};
/* visual-center (pole of inaccessibility) via coarse-then-fine grid search */
const visualCenter = (ring) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of ring) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  const score = (x, y) => {
    if (!pointInRing(x, y, ring)) return -1;
    let d = Infinity;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++)
      d = Math.min(d, distToSeg(x, y, ring[j][0], ring[j][1], ring[i][0], ring[i][1]));
    return d;
  };
  let best = null, bestD = -1;
  for (let pass = 0; pass < 2; pass++) {
    const steps = 60;
    const sx = (x1 - x0) / steps, sy = (y1 - y0) / steps;
    const bx0 = best ? best[0] - sx * 4 : x0;
    const bx1 = best ? best[0] + sx * 4 : x1;
    const by0 = best ? best[1] - sy * 4 : y0;
    const by1 = best ? best[1] + sy * 4 : y1;
    const stx = (bx1 - bx0) / steps, sty = (by1 - by0) / steps;
    for (let i = 0; i <= steps; i++) for (let k = 0; k <= steps; k++) {
      const x = bx0 + i * stx, y = by0 + k * sty;
      const d = score(x, y);
      if (d > bestD) { bestD = d; best = [x, y]; }
    }
  }
  return best || [(x0 + x1) / 2, (y0 + y1) / 2];
};

/* ---- build per-district path + label anchor ---- */
const palette = ['#fbdca6', '#f9c97e', '#f7b85e', '#f4a63f', '#f0962b',
  '#e9881f', '#dd7d22', '#cc7328', '#bd6a2a', '#f6ce8f'];

let paths = '', dots = '', labels = '';
feats.forEach((f, idx) => {
  const en = f.properties.district;
  const name = MR[en] || en;
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;

  // path data for every ring
  let d = '';
  let biggest = null, biggestArea = -1;
  for (const poly of polys) {
    poly.forEach((ring) => {
      d += 'M' + ring.map(([lon, lat]) => `${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`).join(' L') + 'Z';
    });
    const outer = poly[0];
    const a = ringArea(outer);
    if (a > biggestArea) { biggestArea = a; biggest = outer; }
  }
  const fill = palette[idx % palette.length];
  paths += `  <path d="${d}" fill="${fill}" stroke="#ffffff" stroke-width="2" stroke-linejoin="round" data-district="${en}"><title>${name}</title></path>\n`;

  // label anchor in screen space
  const ringScreen = biggest.map(([lon, lat]) => [px(lon), py(lat)]);
  const [lx, ly] = visualCenter(ringScreen);
  dots += `  <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="5" fill="#d40000"/>\n`;
  const fontSize = 26;

  // Mumbai City + Mumbai Suburban: stacked labels to the LEFT of the dot,
  // matching the reference (the source has a single Mumbai polygon).
  if (en === 'Mumbai') {
    const rx = (lx - 14).toFixed(1);
    labels += `  <text x="${rx}" y="${(ly - 6).toFixed(1)}" font-size="${fontSize}" font-weight="700" text-anchor="end" fill="#1a1a1a">मुंबई उपनगर</text>\n`;
    labels += `  <text x="${rx}" y="${(ly + fontSize - 4).toFixed(1)}" font-size="${fontSize}" font-weight="700" text-anchor="end" fill="#1a1a1a">मुंबई</text>\n`;
    return;
  }

  // name above the dot; wrap long names
  const parts = name.length > 12 ? name.split(' ') : [name];
  const ty = ly - 12 - (parts.length - 1) * (fontSize * 0.55);
  const tspans = parts.map((p, i) =>
    `<tspan x="${lx.toFixed(1)}" dy="${i === 0 ? 0 : fontSize}">${p}</tspan>`).join('');
  labels += `  <text x="${lx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="${fontSize}" font-weight="700" text-anchor="middle" fill="#1a1a1a">${tspans}</text>\n`;
});

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="'Noto Sans Devanagari','Mangal','Nirmala UI',sans-serif">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
${paths}${dots}${labels}</svg>
`;

fs.writeFileSync(OUT, svg, 'utf8');
console.log('Wrote', OUT, '(' + (svg.length / 1024).toFixed(0) + ' KB,', feats.length, 'districts,', W + 'x' + H + ')');
