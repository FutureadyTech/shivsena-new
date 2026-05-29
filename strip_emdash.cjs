/* Strip em-dash (—, U+2014) from every text file under src/ and the
   content JSONs at the repo root. Runs in-place. */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve('C:/Users/Admin/Downloads/shivsena-clean/shivsena-clean');
const SCAN_DIRS = [
  path.join(ROOT, 'src'),
];

const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.md', '.html']);

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(p);
  }
}

const files = [];
for (const d of SCAN_DIRS) walk(d, files);

let modified = 0;
let total = 0;
for (const f of files) {
  let src;
  try { src = fs.readFileSync(f, 'utf8'); } catch { continue; }
  if (!src.includes('—')) continue;
  total++;
  const before = src;
  /* Replace em-dash with a single space when it's between non-space text
     (so "Name — Role" → "Name Role"). Then strip orphan em-dashes.
     Finally collapse any 3+ spaces this introduces (but leave normal
     double-space in code formatting alone — only collapse runs > 2). */
  src = src.replace(/\s*—\s*/g, ' ');
  src = src.replace(/ {3,}/g, ' ');
  /* Clean up `" "` (leading/trailing whitespace inside JSON strings) is
     not safe blanket-wise — keep file edits minimal. */
  if (src !== before) {
    fs.writeFileSync(f, src, 'utf8');
    modified++;
  }
}

console.log(`Files scanned: ${files.length}`);
console.log(`Files with em-dash: ${total}`);
console.log(`Files modified: ${modified}`);
