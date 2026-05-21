/**
 * Three.js darbar scene — the full 3D experience.
 *
 * Depends on these globals loaded from CDN <script> tags in index.html:
 *   THREE        (three.min.js)
 *   THREE.Reflector (Reflector.js from three examples)
 *   gsap         (gsap.min.js)
 *   ScrollTrigger (ScrollTrigger.min.js)
 *
 * Quick map of what lives where (search these labels with Ctrl+F):
 *   THREE.JS — MAIN SCENE        renderer, camera, lights, ambient
 *   PILLARS                       column geometry + capitals + bases
 *   WALLS                         left/right walls + sandstone texture
 *   WALL CONTENT PANELS           the 4 chapter panels (canvas textures)
 *   THRONE AREA                   throne + dais at far end
 *   ARCHED WINDOW + GOD RAYS      light source behind throne
 *   AMBIENT LIGHTING              hemi + ambient + torches
 *   DUST MOTES                    particle system in light beams
 *   SCROLL-DRIVEN CAMERA          camera keyframe animation
 *   PALACE TEXTURES               Polyhaven CDN loader (real marble/sandstone)
 *   ANIMATION LOOP                requestAnimationFrame loop
 *   BOOT                          panel texture generation + start
 */

import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

// Reflector is imported as a named export. Used directly (not via THREE.Reflector)
// because the bundler can't statically resolve runtime namespace mutation.

export function initScene() {
'use strict';

/* ═══════════════════════════════════════════════════════════════
   THREE.JS — MAIN SCENE
═══════════════════════════════════════════════════════════════ */
const canvas = document.getElementById('scene-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas, antialias: true, alpha: true, powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0604);
scene.fog = new THREE.FogExp2(0x1a0c06, 0.025);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 1.7, 22);
camera.lookAt(0, 1.7, -10);

/* ────── HALL DIMENSIONS ─────────────────────────────────────── */
const HALL = {
  width: 20,            // x: -10 to +10
  length: 70,           // z: -50 to +20
  height: 14,           // y: 0 to 14
  wallLeftX: -10,
  wallRightX: 10,
  zEntrance: 20,
  zThrone: -50,
  panelZ: [-10.5, -19.5, -28.5] // 3 panels (History, Leadership, Join) — centred between pillar pairs at z=12,3,-6,-15,-24,-33,-42
};

/* ────── PBR TEXTURE GENERATORS (procedural, no external files) ─ */
function makeCanvasTex(setup, opts = {}) {
  const S = opts.size || 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  setup(c.getContext('2d', { willReadFrequently: true }), S);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  if (!opts.grayscale) tex.encoding = THREE.sRGBEncoding;
  if (opts.repeat) tex.repeat.set(opts.repeat.x, opts.repeat.y);
  tex.anisotropy = 8;
  return tex;
}
function paintNoise(ctx, S, amp = 18) {
  const img = ctx.getImageData(0, 0, S, S), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amp;
    d[i]   = Math.max(0, Math.min(255, d[i]   + n));
    d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
    d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
  }
  ctx.putImageData(img, 0, 0);
}
function paintVeins(ctx, S, colors, count, len, widthScale = 1) {
  ctx.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.lineWidth = (Math.random() * 2.5 + 0.6) * widthScale;
    ctx.beginPath();
    let x = Math.random() * S, y = Math.random() * S;
    ctx.moveTo(x, y);
    let dx = (Math.random() - 0.5) * 2, dy = (Math.random() - 0.5) * 2;
    for (let j = 0; j < len; j++) {
      dx += (Math.random() - 0.5) * 0.5;
      dy += (Math.random() - 0.5) * 0.5;
      const m = Math.hypot(dx, dy);
      dx = dx / m * 7; dy = dy / m * 7;
      x += dx; y += dy;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
function paintBlocks(ctx, S, color, bw = 256, bh = 128, lineWidth = 2) {
  ctx.strokeStyle = color; ctx.lineWidth = lineWidth;
  for (let y = 0; y < S; y += bh) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(S, y); ctx.stroke();
    const offset = (Math.floor(y / bh) % 2 === 0) ? 0 : bw / 2;
    for (let x = offset; x < S + bw; x += bw) {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + bh); ctx.stroke();
    }
  }
}
// Random block-to-block tonal variation — kills the "tiled wallpaper" feel
function paintBlockVariation(ctx, S, bw = 256, bh = 128) {
  for (let y = 0; y < S; y += bh) {
    const offset = (Math.floor(y / bh) % 2 === 0) ? 0 : bw / 2;
    for (let x = offset - bw; x < S + bw; x += bw) {
      const shade = (Math.random() - 0.5) * 28;
      ctx.fillStyle = shade > 0
        ? `rgba(255,235,200,${shade / 80})`
        : `rgba(0,0,0,${-shade / 80})`;
      ctx.fillRect(x, y, bw, bh);
    }
  }
}
// Convert a grayscale height canvas to a normal map (Sobel-derived)
function heightToNormal(heightCanvas, scale = 4) {
  const S = heightCanvas.width;
  const hctx = heightCanvas.getContext('2d', { willReadFrequently: true });
  const hData = hctx.getImageData(0, 0, S, S).data;
  const out = document.createElement('canvas');
  out.width = out.height = S;
  const octx = out.getContext('2d');
  const img = octx.createImageData(S, S);
  const d = img.data;
  const h = (x, y) => {
    x = (x + S) % S; y = (y + S) % S;
    return hData[(y * S + x) * 4] / 255;
  };
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * scale;
      const dy = (h(x, y + 1) - h(x, y - 1)) * scale;
      const nx = -dx, ny = -dy, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * S + x) * 4;
      d[i]     = ((nx / len) * 0.5 + 0.5) * 255;
      d[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      d[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      d[i + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(out);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

// ── STONE WALL (cut basalt blocks, weathered)
const stoneWallTex = makeCanvasTex((ctx, S) => {
  // Base: warm dark stone
  const g = ctx.createLinearGradient(0, 0, 0, S);
  g.addColorStop(0, '#4a3424'); g.addColorStop(0.5, '#352518'); g.addColorStop(1, '#241810');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  paintNoise(ctx, S, 32);
  // Bold block-to-block tonal variation
  paintBlockVariation(ctx, S, 192, 96);
  // Heavy mortar joints (very dark)
  paintBlocks(ctx, S, 'rgba(0,0,0,0.92)', 192, 96, 5);
  // Smaller cracks running across blocks
  paintVeins(ctx, S, ['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.30)'], 28, 14, 0.6);
}, { repeat: { x: 8, y: 5 } });

// Heightmap for stone (drives the normal map)
const stoneWallHeightCanvas = (() => {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgb(180,180,180)'; ctx.fillRect(0, 0, S, S);
  paintNoise(ctx, S, 50);
  // Mortar joints are DEEP recesses (dark = lower height)
  paintBlocks(ctx, S, 'rgba(8,8,8,1)', 192, 96, 8);
  // Each block raised slightly different (random)
  for (let y = 0; y < S; y += 96) {
    const offset = (Math.floor(y / 96) % 2 === 0) ? 0 : 96;
    for (let x = offset - 192; x < S + 192; x += 192) {
      const shade = (Math.random() - 0.5) * 50;
      ctx.fillStyle = shade > 0
        ? `rgba(255,255,255,${shade / 80})` : `rgba(0,0,0,${-shade / 80})`;
      ctx.fillRect(x + 6, y + 6, 192 - 12, 96 - 12); // inset so joints stay dark
    }
  }
  // Cracks (dark = recessed)
  paintVeins(ctx, S, ['rgba(40,40,40,0.7)', 'rgba(50,50,50,0.5)'], 28, 14, 0.6);
  return c;
})();
const stoneWallNormal = heightToNormal(stoneWallHeightCanvas, 8);
stoneWallNormal.repeat.set(8, 5);

// ── MARBLE (warm sandstone with bold veining, polished)
const marbleTex = makeCanvasTex((ctx, S) => {
  // Warmer, lighter base — sandstone palace pillar
  const g = ctx.createRadialGradient(S/2, S/2, 0, S/2, S/2, S*0.7);
  g.addColorStop(0, '#a08458'); g.addColorStop(0.5, '#86683f'); g.addColorStop(1, '#5e4628');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  // Strong dark recessed veining
  paintVeins(ctx, S, [
    'rgba(20,10,2,0.78)', 'rgba(30,16,6,0.55)', 'rgba(15,6,0,0.85)'
  ], 32, 110, 1.4);
  // Lighter chalky highlight veins
  paintVeins(ctx, S, [
    'rgba(245,225,185,0.50)', 'rgba(235,210,165,0.38)', 'rgba(255,240,205,0.30)'
  ], 18, 85, 0.9);
  // Fine grain noise
  paintNoise(ctx, S, 14);
}, { repeat: { x: 1, y: 2 } });

const marbleHeightCanvas = (() => {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgb(150,150,150)'; ctx.fillRect(0, 0, S, S);
  paintNoise(ctx, S, 40);
  // Dark veins (recessed)
  paintVeins(ctx, S, [
    'rgba(40,40,40,0.85)', 'rgba(55,55,55,0.6)', 'rgba(25,25,25,0.95)'
  ], 32, 110, 1.4);
  // Light veins (raised crystal lines)
  paintVeins(ctx, S, [
    'rgba(230,230,230,0.55)', 'rgba(210,210,210,0.4)'
  ], 18, 85, 0.9);
  return c;
})();
const marbleNormal = heightToNormal(marbleHeightCanvas, 6);
marbleNormal.repeat.set(1, 2);

/* ────── IBL ENVIRONMENT MAP (procedural PMREM) ─────────────── */
(function setupIBL() {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x140a06);
  envScene.add(new THREE.HemisphereLight(0xff8a40, 0x0a0604, 0.55));
  const key = new THREE.DirectionalLight(0xffaa55, 0.95);  key.position.set(5, 8, 3);
  const fill = new THREE.DirectionalLight(0x4a2a0a, 0.35); fill.position.set(-5, 5, -3);
  envScene.add(key, fill);
  const rt = pmrem.fromScene(envScene, 0.04);
  scene.environment = rt.texture;
  pmrem.dispose();
})();

/* ────── MATERIALS (shared, all real PBR — AmbientCG textures, CC0) ──
   Drop replacement texture folders into ./textures/ and update the
   _loadTex paths below to swap any material's appearance. */

// Helper: load a JPG as a wrappable, anisotropy-maxed Three.js texture.
// Used by every material below — single source of truth for texture setup.
const _tl = new THREE.TextureLoader();
function _loadTex(path, isColor) {
  const t = _tl.load(path);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (isColor) t.encoding = THREE.sRGBEncoding;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

// ─── Marble pillar shafts (AmbientCG Marble007, CC0) ─────────────
// Cream/beige polished marble. Used on cylindrical shaft of the 14 pillars.
const stoneCarvedMat = new THREE.MeshStandardMaterial({
  color: 0xe8dec5,   // off-white cream — slight age tint vs pure white polished
  map:          _loadTex('/textures/Marble007/Marble007_1K-JPG_Color.jpg', true),
  normalMap:    _loadTex('/textures/Marble007/Marble007_1K-JPG_NormalGL.jpg', false),
  roughnessMap: _loadTex('/textures/Marble007/Marble007_1K-JPG_Roughness.jpg', false),
  normalScale: new THREE.Vector2(0.6, 0.6),  // marble is smooth — gentle micro-relief
  roughness: 1.0,    // let map dictate
  metalness: 0.0,    // marble is non-metallic
  envMapIntensity: 0.0  // fully matte — no environment reflection (was 0.4)
});
// Pillar shafts are tall — repeat once around, twice vertically for natural veining
[stoneCarvedMat.map, stoneCarvedMat.normalMap, stoneCarvedMat.roughnessMap]
  .forEach(t => t.repeat.set(1, 2));

// ─── Pillar bases + capitals (AmbientCG Concrete044D, CC0) ───────
// Lighter weathered stone, provides architectural contrast against the marble shafts.
const pillarStoneMat = new THREE.MeshStandardMaterial({
  color: 0xc4ad8c,   // warm beige tint pushes neutral concrete → warm palace stone
  map:          _loadTex('/textures/Concrete044D/Concrete044D_1K-JPG_Color.jpg', true),
  normalMap:    _loadTex('/textures/Concrete044D/Concrete044D_1K-JPG_NormalGL.jpg', false),
  roughnessMap: _loadTex('/textures/Concrete044D/Concrete044D_1K-JPG_Roughness.jpg', false),
  normalScale: new THREE.Vector2(0.9, 0.9),
  roughness: 1.0,
  metalness: 0.0
});

// Legacy material — defined but no longer referenced (kept to avoid breaking other refs)
const stoneDarkMat = new THREE.MeshStandardMaterial({
  color: 0xffffff, map: marbleTex, normalMap: marbleNormal,
  normalScale: new THREE.Vector2(1.4, 1.4),
  roughness: 0.62, metalness: 0.04
});

// ─── Aged brass — old fort weathered metal (AmbientCG Metal007, CC0) ───
// Centuries-old fort brass: oxidized, dulled, slight tarnish — not factory-fresh gold.
// Lower metalness + darker tint + minimal envMap = aged feel.
const goldTrimMat = new THREE.MeshStandardMaterial({
  map:          _loadTex('/textures/metal007/Metal007_1K-JPG_Color.jpg', true),
  normalMap:    _loadTex('/textures/metal007/Metal007_1K-JPG_NormalGL.jpg', false),
  roughnessMap: _loadTex('/textures/metal007/Metal007_1K-JPG_Roughness.jpg', false),
  metalnessMap: _loadTex('/textures/metal007/Metal007_1K-JPG_Metalness.jpg', false),
  color: 0x7a5020,        // darkened aged-brass tint (was 0xffd089 polished gold)
  roughness: 1.0,
  metalness: 0.65,        // less than fully metallic — surface oxidation breaks reflectance (was 1.0)
  normalScale: new THREE.Vector2(1.1, 1.1),  // slightly more relief reads as weathered
  envMapIntensity: 0.45,  // muted reflections (was 1.4 — that was mirror brass)
  emissive: 0x000000,     // no self-glow — old metal doesn't emit
  emissiveIntensity: 0
});

// Brazier-bowl variant — aged brass but with strong orange emissive
// so the bowl still reads as "hot from the fire" not just "dull metal".
const goldBowlMat = goldTrimMat.clone();
goldBowlMat.emissive = new THREE.Color(0xff6020);
goldBowlMat.emissiveIntensity = 0.5;

// ─── Dark walnut wood (AmbientCG Wood067, CC0) ────────────────────
// Used on outer photo frames around chapter panels. Rich dark wood
// against aged brass inner trim — period-correct picture-frame look.
const frameWoodMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,       // pure white — let texture's natural dark walnut show
  map:          _loadTex('/textures/Wood067/Wood067_1K-JPG_Color.jpg', true),
  normalMap:    _loadTex('/textures/Wood067/Wood067_1K-JPG_NormalGL.jpg', false),
  roughnessMap: _loadTex('/textures/Wood067/Wood067_1K-JPG_Roughness.jpg', false),
  normalScale: new THREE.Vector2(0.5, 0.5),  // gentle wood-grain relief
  roughness: 1.0,        // let map dictate (smooth polished wood)
  metalness: 0.0         // wood is non-metallic
});

const carpetMat = new THREE.MeshStandardMaterial({
  color: 0x4a0808, roughness: 0.95, metalness: 0
});
const saffronMat = new THREE.MeshStandardMaterial({
  color: 0xff6b1a, roughness: 0.6, metalness: 0.0, emissive: 0xff4a08, emissiveIntensity: 0.35,
  side: THREE.DoubleSide
});

/* ────── REFLECTIVE FLOOR ────────────────────────────────────── */
const floorReflector = new Reflector(
  new THREE.PlaneGeometry(HALL.width, HALL.length + 20),
  {
    textureWidth: Math.min(window.innerWidth, 1280) * 0.8,
    textureHeight: Math.min(window.innerHeight, 720) * 0.8,
    color: 0x1a1208,
    recursion: 0
  }
);
floorReflector.rotation.x = -Math.PI / 2;
floorReflector.position.y = 0;
floorReflector.position.z = -15;
scene.add(floorReflector);

// Floor overlay — POLISHED MARBLE (AmbientCG Marble007, CC0).
// Reflector stays below — classic Mughal Diwan-i-Khas effect: cream marble
// with subtle torchlight reflections sliding across as the camera moves.
// Pairs against the dark olive walls for the palace-inside-fort contrast.
const floorMarbleColor  = _loadTex('/textures/Marble007/Marble007_1K-JPG_Color.jpg', true);
const floorMarbleNormal = _loadTex('/textures/Marble007/Marble007_1K-JPG_NormalGL.jpg', false);
const floorMarbleRough  = _loadTex('/textures/Marble007/Marble007_1K-JPG_Roughness.jpg', false);
// Larger repeats — marble veining looks natural in long stretches, not cobble-scale.
[floorMarbleColor, floorMarbleNormal, floorMarbleRough].forEach(t => t.repeat.set(3, 10));

const floorTint = new THREE.Mesh(
  new THREE.PlaneGeometry(HALL.width, HALL.length + 20),
  new THREE.MeshStandardMaterial({
    color: 0xeaddc4,   // warm cream — palace marble against dark olive walls
    map:          floorMarbleColor,
    normalMap:    floorMarbleNormal,
    roughnessMap: floorMarbleRough,
    normalScale: new THREE.Vector2(0.4, 0.4),  // marble is smooth — gentle relief only
    roughness: 1.0,    // let map dictate
    metalness: 0.0,    // marble is non-metallic
    transparent: true,
    opacity: 0.84      // marble visible, Reflector below shows faint torch reflections
  })
);
floorTint.rotation.x = -Math.PI / 2;
floorTint.position.y = 0.005;
floorTint.position.z = -15;
floorTint.receiveShadow = true;
scene.add(floorTint);

/* ────── RED CARPET ──────────────────────────────────────────── */
const carpetGeo = new THREE.PlaneGeometry(2.6, HALL.length);
const carpet = new THREE.Mesh(carpetGeo, carpetMat);
carpet.rotation.x = -Math.PI / 2;
carpet.position.set(0, 0.012, -15);
carpet.receiveShadow = true;
scene.add(carpet);

// Carpet trim (gold)
const trimGeo = new THREE.PlaneGeometry(0.18, HALL.length);
const trimMatBright = new THREE.MeshStandardMaterial({
  color: 0xd4a24c, roughness: 0.4, metalness: 0.6,
  emissive: 0x6a4010, emissiveIntensity: 0.3
});
const trimL = new THREE.Mesh(trimGeo, trimMatBright);
trimL.rotation.x = -Math.PI / 2;
trimL.position.set(-1.4, 0.014, -15);
const trimR = trimL.clone();
trimR.position.x = 1.4;
scene.add(trimL, trimR);

/* ────── WALLS (AmbientCG Bricks102, CC0) ──────────────────────
   Dark fort interior masonry — large rough-hewn stone blocks with
   deep mortar crevices, soot-darkened from centuries of torchlight.
   Heavy color tint pulls bright tan brick → dark fort sandstone. */
const wallMat = new THREE.MeshStandardMaterial({
  color: 0x2c3a24,   // dark olive-green tint — moss-stained fort stone, much darker
  map:          _loadTex('/textures/Bricks102/Bricks102_1K-JPG_Color.jpg', true),
  normalMap:    _loadTex('/textures/Bricks102/Bricks102_1K-JPG_NormalGL.jpg', false),
  roughnessMap: _loadTex('/textures/Bricks102/Bricks102_1K-JPG_Roughness.jpg', false),
  aoMap:        _loadTex('/textures/Bricks102/Bricks102_1K-JPG_AmbientOcclusion.jpg', false),
  aoMapIntensity: 1.6,   // even deeper mortar shadows for cave-like depth
  normalScale: new THREE.Vector2(2.0, 2.0),  // pronounced surface relief
  roughness: 1.0,
  metalness: 0.0
});
// (4, 2) makes individual stones large and chunky — fort-block scale.
// Bump these for finer brickwork, drop further for boulder-sized blocks.
[wallMat.map, wallMat.normalMap, wallMat.roughnessMap, wallMat.aoMap]
  .forEach(t => t.repeat.set(4, 2));

// AO requires a second UV channel. Tiny helper to attach uv2 to a geometry.
const _addUV2 = g => { g.setAttribute('uv2', g.attributes.uv); return g; };

const leftWall = new THREE.Mesh(
  _addUV2(new THREE.BoxGeometry(0.5, HALL.height, HALL.length + 10)),
  wallMat
);
leftWall.position.set(HALL.wallLeftX - 0.25, HALL.height / 2, -15);
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = leftWall.clone();  // shares geometry — uv2 propagates automatically
rightWall.position.x = HALL.wallRightX + 0.25;
scene.add(rightWall);

// Back wall (behind throne)
const backWall = new THREE.Mesh(
  _addUV2(new THREE.BoxGeometry(HALL.width + 2, HALL.height, 0.5)),
  wallMat
);
backWall.position.set(0, HALL.height / 2, HALL.zThrone - 0.25);
backWall.receiveShadow = true;
scene.add(backWall);

// Front wall (entrance) — has opening
const frontWallL = new THREE.Mesh(
  _addUV2(new THREE.BoxGeometry(7, HALL.height, 0.5)),
  wallMat
);
frontWallL.position.set(-6.5, HALL.height / 2, HALL.zEntrance);
const frontWallR = frontWallL.clone();  // shares geometry — uv2 propagates
frontWallR.position.x = 6.5;
const frontWallTop = new THREE.Mesh(
  _addUV2(new THREE.BoxGeometry(HALL.width, 4, 0.5)),
  wallMat
);
frontWallTop.position.set(0, HALL.height - 2, HALL.zEntrance);
scene.add(frontWallL, frontWallR, frontWallTop);

// Ceiling
const ceiling = new THREE.Mesh(
  new THREE.PlaneGeometry(HALL.width + 2, HALL.length + 10),
  new THREE.MeshStandardMaterial({ color: 0x0a0604, roughness: 0.95 })
);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.set(0, HALL.height, -15);
scene.add(ceiling);

// Carved ceiling trim (gold beams crossing)
for (let i = 0; i < 7; i++) {
  const z = HALL.zEntrance - 5 - i * 8;
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(HALL.width + 1, 0.6, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0x4a3018, roughness: 0.6, metalness: 0.4,
      emissive: 0x2a1808, emissiveIntensity: 0.3
    })
  );
  beam.position.set(0, HALL.height - 0.3, z);
  scene.add(beam);
}

/* ────── PILLARS ─────────────────────────────────────────────── */
function createPillar(x, z) {
  const group = new THREE.Group();

  // Multi-tiered base — 3 stepped plinths + gold trim ring (classical column foot)
  // Widest at bottom, stepping inward → reads as proper pillar architecture, not just a block.
  const plinth1 = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.3, 2.2), stoneCarvedMat   // widest bottom plinth
  );
  plinth1.position.y = 0.15;
  plinth1.castShadow = plinth1.receiveShadow = true;
  group.add(plinth1);

  const plinth2 = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 0.25, 1.95), stoneCarvedMat  // middle plinth, stepped in
  );
  plinth2.position.y = 0.425;
  group.add(plinth2);

  const plinth3 = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.2, 1.75), stoneCarvedMat   // upper plinth, transitioning to shaft
  );
  plinth3.position.y = 0.65;
  group.add(plinth3);

  // Lower base trim (gold ring at top of base)
  const baseTrim = new THREE.Mesh(
    new THREE.BoxGeometry(1.95, 0.12, 1.95), goldTrimMat
  );
  baseTrim.position.y = 0.81;
  group.add(baseTrim);

  // Shaft
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.6, HALL.height - 2.4, 16),
    stoneCarvedMat
  );
  shaft.position.y = (HALL.height - 2.4) / 2 + 0.95;
  shaft.castShadow = shaft.receiveShadow = true;
  group.add(shaft);

  // Capital top — same marble as shaft (continuous-column look)
  const capital = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.6, 1.6), stoneCarvedMat
  );
  capital.position.y = HALL.height - 1.2;
  group.add(capital);

  // Capital crown (gold)
  const capCrown = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.2, 1.8), goldTrimMat
  );
  capCrown.position.y = HALL.height - 0.8;
  group.add(capCrown);

  group.position.set(x, 0, z);
  return group;
}

// Two rows of pillars, set inward from walls so wall panels are visible behind
// and the pillars don't crowd the masonry.
const pillarPositions = [];
for (let i = 0; i < 7; i++) {
  const z = 12 - i * 9;
  pillarPositions.push({ x: -6.5, z });
  pillarPositions.push({ x: 6.5, z });
}
pillarPositions.forEach(p => scene.add(createPillar(p.x, p.z)));

/* ────── HANGING SAFFRON BANNERS ─────────────────────────────── */
const banners = [];
function createBanner(x, z) {
  const group = new THREE.Group();

  const bannerGeo = new THREE.PlaneGeometry(1.0, 3.4, 8, 16);
  const bannerMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0xff6b1a) },
      colorDeep: { value: new THREE.Color(0xb8420a) }
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 p = position;
        float wave = sin(p.y * 1.8 + time * 1.2) * 0.06 * (1.0 - uv.y);
        wave += sin(p.y * 4.0 + time * 1.7) * 0.025;
        p.z += wave;
        p.x += wave * 0.4;
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform vec3 colorDeep;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vec3 c = mix(colorDeep, color, 0.6 + vWave * 4.0);
        // Subtle gradient + bow-arrow icon hint
        float topShade = smoothstep(0.0, 0.2, vUv.y);
        c *= 0.85 + topShade * 0.15;
        // Bow arrow circle hint near top
        vec2 center = vec2(0.5, 0.85);
        float d = length(vUv - center);
        c = mix(c, vec3(0.05, 0.04, 0.02), smoothstep(0.10, 0.085, d) * 0.7);
        // Vertical line (arrow) inside
        float arrowLine = smoothstep(0.012, 0.005, abs(vUv.x - 0.5)) * step(vUv.y, 0.93) * step(0.78, vUv.y);
        c = mix(c, vec3(0.04, 0.03, 0.02), arrowLine * 0.85);
        // Bow arc (semicircle)
        float bowD = abs(d - 0.06);
        float bowArc = smoothstep(0.012, 0.006, bowD) * step(vUv.y, 0.86);
        c = mix(c, vec3(0.04, 0.03, 0.02), bowArc * 0.85);
        gl_FragColor = vec4(c, 1.0);
      }
    `
  });
  const banner = new THREE.Mesh(bannerGeo, bannerMat);
  banner.position.y = HALL.height - 4;
  group.add(banner);

  // Banner top fixture (gold rod)
  const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
    goldTrimMat
  );
  rod.rotation.z = Math.PI / 2;
  rod.position.y = HALL.height - 2.2;
  group.add(rod);

  group.userData.material = bannerMat;
  group.position.set(x, 0, z);
  banners.push(group);
  return group;
}

// Banners hung between every pair of pillars (pillars at z=12,3,-6,-15,-24,-33,-42 → midpoints 7.5,-1.5,-10.5,-19.5,-28.5,-37.5)
const bannerZs = [7.5, -1.5, -10.5, -19.5, -28.5, -37.5, -45];
bannerZs.forEach(z => {
  scene.add(createBanner(-9.6, z));
  scene.add(createBanner(9.6, z));
});

/* ────── TORCH BRAZIERS (with flame + light) ─────────────────── */
const fires = [];
const fireLights = [];

function createBrazier(x, z, height = 1.4) {
  const group = new THREE.Group();

  // Stand (cylinder) — real gold PBR
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.28, height, 8),
    goldTrimMat
  );
  stand.position.y = height / 2;
  group.add(stand);

  // Bowl — real gold PBR with strong orange emissive (reads as hot from the fire)
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.3, 0.25, 12),
    goldBowlMat
  );
  bowl.position.y = height + 0.1;
  group.add(bowl);

  // Flame (additive plane, billboard)
  const flameMat = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: { time: { value: Math.random() * 100 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      void main() {
        vec2 uv = vUv;
        uv.y -= time * 0.7;
        float n = noise(uv * 4.0) * 0.5 + noise(uv * 9.0) * 0.25 + noise(uv * 18.0) * 0.125;
        float shape = smoothstep(0.0, 0.4, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
        float horiz = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 1.6);
        float intensity = n * shape * horiz * 1.8;
        vec3 col = mix(vec3(1.0, 0.35, 0.08), vec3(1.0, 0.9, 0.5), intensity);
        gl_FragColor = vec4(col, intensity);
      }
    `
  });
  const flame = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0), flameMat);
  flame.position.y = height + 0.65;
  flame.userData.material = flameMat;
  flame.userData.isFlame = true;
  group.add(flame);
  fires.push(flame);

  // Point light
  const light = new THREE.PointLight(0xff7a30, 1.6, 12, 2);
  light.position.y = height + 0.5;
  light.userData.baseIntensity = 1.6;
  fireLights.push(light);
  group.add(light);

  group.position.set(x, 0, z);
  return group;
}

// Floor braziers along walkway between pillars (visible & dramatic)
const brazierFloorZs = [8, -3, -13, -23, -33, -43];
brazierFloorZs.forEach(z => {
  scene.add(createBrazier(-3.5, z));
  scene.add(createBrazier(3.5, z));
});

// Wall-mounted small torches between panels (extra glow on left wall)
function createWallTorch(x, y, z, faceDir = 1) {
  const group = new THREE.Group();
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.4, 0.25),
    goldTrimMat
  );
  group.add(bracket);

  const flameMat = new THREE.ShaderMaterial({
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    uniforms: { time: { value: Math.random() * 50 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec2 vUv; uniform float time;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);float a=hash(i);float b=hash(i+vec2(1,0));float c=hash(i+vec2(0,1));float d=hash(i+vec2(1,1));vec2 u=f*f*(3.0-2.0*f);return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;}
      void main(){
        vec2 uv = vUv; uv.y -= time*0.8;
        float n = noise(uv*5.0)*0.5 + noise(uv*12.0)*0.25;
        float shape = smoothstep(0.0,0.3,vUv.y) * (1.0 - smoothstep(0.5,1.0,vUv.y));
        float horiz = pow(1.0 - abs(vUv.x-0.5)*2.0, 1.5);
        float i2 = n * shape * horiz * 2.0;
        vec3 col = mix(vec3(1.0,0.4,0.1), vec3(1.0,0.95,0.6), i2);
        gl_FragColor = vec4(col, i2);
      }`
  });
  const flame = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.6), flameMat);
  flame.position.set(faceDir * 0.2, 0.3, 0);
  flame.userData.material = flameMat;
  flame.userData.isFlame = true;
  fires.push(flame);
  group.add(flame);

  // Small wall light
  const light = new THREE.PointLight(0xff8a40, 0.6, 6, 2);
  light.position.set(faceDir * 0.3, 0.4, 0);
  light.userData.baseIntensity = 0.6;
  fireLights.push(light);
  group.add(light);

  group.position.set(x, y, z);
  return group;
}

// Wall torches mounted ABOVE the panels (between panel positions) — light spills down onto frames
const torchZs = [-3, -13, -23, -33, -43];
torchZs.forEach(z => {
  scene.add(createWallTorch(HALL.wallLeftX + 0.2, 9.5, z, 1));
  scene.add(createWallTorch(HALL.wallRightX - 0.2, 9.5, z, -1));
});

/* ════════════════════════════════════════════════════════════
   WALL CONTENT PANELS — drawn via CanvasTexture
═══════════════════════════════════════════════════════════ */

const PANEL_TEXTURES = {};
const PANEL_WIDTH = 4.8;
const PANEL_HEIGHT = 6.4;
const panelMeshes = [];           // left wall — interactive content
const decorPanelMeshes = [];      // right wall — decorative emblems

// Create panels meshes immediately with placeholder, replace texture once fonts loaded
function makePlaceholderTex() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 80;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0,0,0,80);
  grad.addColorStop(0, '#1a1208'); grad.addColorStop(1, '#0a0604');
  ctx.fillStyle = grad; ctx.fillRect(0,0,64,80);
  return new THREE.CanvasTexture(c);
}

// side = +1 for left wall (faces +X into hall), -1 for right wall (faces -X)
// isInteractive = true → registered in panelMeshes for focus highlighting + scroll keyframes
function createPanel(z, idx, side = 1, isInteractive = true) {
  const group = new THREE.Group();
  const facing = side; // +1 = panel on +X side, -1 = on -X side

  // Outer wooden frame — Wood067 dark walnut PBR
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, PANEL_HEIGHT + 0.55, PANEL_WIDTH + 0.55),
    frameWoodMat
  );
  frame.position.x = facing * 0.20;
  frame.castShadow = frame.receiveShadow = true;
  group.add(frame);

  // Inner gold trim — slightly proud of the wood frame, slightly larger than canvas
  const goldFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, PANEL_HEIGHT + 0.18, PANEL_WIDTH + 0.18),
    new THREE.MeshStandardMaterial({
      color: 0x9c6a26, roughness: 0.35, metalness: 0.85,
      emissive: 0x4a2a08, emissiveIntensity: 0.35
    })
  );
  goldFrame.position.x = facing * 0.22;
  group.add(goldFrame);

  // Inner artwork surface (canvas-textured plane facing into the hall)
  const panelMat = new THREE.MeshStandardMaterial({
    map: makePlaceholderTex(),
    roughness: 0.7, metalness: 0.1,
    emissive: 0xff6b1a, emissiveIntensity: 0.0
  });
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT),
    panelMat
  );
  panel.position.x = facing * 0.45;
  panel.rotation.y = facing > 0 ? Math.PI / 2 : -Math.PI / 2;
  group.add(panel);

  // Glow plane behind (focus highlight)
  const glowGeo = new THREE.PlaneGeometry(PANEL_WIDTH + 1.6, PANEL_HEIGHT + 1.6);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff7a30, transparent: true, opacity: 0.0,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.x = facing * 0.13;
  glow.rotation.y = facing > 0 ? Math.PI / 2 : -Math.PI / 2;
  group.add(glow);

  // Picture-light fixture above the frame: simple horizontal bar parallel to wall
  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(0.30, 0.14, PANEL_WIDTH * 0.55),
    new THREE.MeshStandardMaterial({
      color: 0x8a5a20, roughness: 0.4, metalness: 0.9,
      emissive: 0x4a2a08, emissiveIntensity: 0.30
    })
  );
  hood.position.set(facing * 0.55, PANEL_HEIGHT / 2 + 0.42, 0);
  group.add(hood);
  // Slim arm connecting hood to wall
  const hoodArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.06, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x6a4a18, roughness: 0.5, metalness: 0.8 })
  );
  hoodArm.position.set(facing * 0.35, PANEL_HEIGHT / 2 + 0.42, 0);
  group.add(hoodArm);

  // Warm spot illuminating the artwork from above
  const pictureLight = new THREE.SpotLight(0xffc070, 1.6, 8, Math.PI / 4.5, 0.55, 1.4);
  pictureLight.position.set(facing * 0.55, PANEL_HEIGHT / 2 + 0.30, 0);
  pictureLight.target.position.set(facing * 1.5, -PANEL_HEIGHT / 2 + 1.2, 0);
  group.add(pictureLight);
  group.add(pictureLight.target);

  // Lower decorative console bracket — wide along wall, thin into hall
  const bracket = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.18, PANEL_WIDTH * 0.45),
    new THREE.MeshStandardMaterial({
      color: 0x4a2e10, roughness: 0.6, metalness: 0.5,
      emissive: 0x2a1604, emissiveIntensity: 0.2
    })
  );
  bracket.position.set(facing * 0.32, -PANEL_HEIGHT / 2 - 0.25, 0);
  group.add(bracket);

  group.userData = { panelMat, glowMat, idx, isInteractive };
  const wallX = side > 0 ? HALL.wallLeftX + 0.05 : HALL.wallRightX - 0.05;
  group.position.set(wallX, 4.7, z);
  if (isInteractive) panelMeshes.push(group);
  else decorPanelMeshes.push(group);
  return group;
}

// Left wall: 3 interactive content panels (history, leadership, join)
HALL.panelZ.forEach((z, i) => scene.add(createPanel(z, i, 1, true)));

// Right wall: matching decorative frames (same content, mirrored — restores symmetry)
HALL.panelZ.forEach((z, i) => scene.add(createPanel(z, i, -1, false)));

/* ────── Drawing high-quality panel textures ─────────────────── */
function drawPanelTexture(idx) {
  const W = 768, H = 1024;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1f1408');
  bg.addColorStop(0.5, '#100a04');
  bg.addColorStop(1, '#080502');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Inner border
  ctx.strokeStyle = '#8a5a20';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = '#d4a24c';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  // Top accent line
  ctx.strokeStyle = '#ff8a3d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W/2 - 80, 100); ctx.lineTo(W/2 + 80, 100);
  ctx.stroke();

  // Title
  ctx.fillStyle = '#f4d68a';
  ctx.font = '700 78px "Tiro Devanagari Marathi", "Mukta", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Subtitle
  ctx.shadowColor = 'rgba(255, 122, 48, 0.6)';
  ctx.shadowBlur = 18;

  const data = [
    {
      title: 'आमचा इतिहास',
      sub: 'OUR HISTORY · स्वाभिमानाची गाथा',
      type: 'history'
    },
    {
      title: 'नेतृत्व',
      sub: 'LEADERSHIP · संघर्षपथ',
      type: 'leadership'
    },
    {
      title: 'सहभागी व्हा',
      sub: 'JOIN THE MOVEMENT · कार्यकर्ता बना',
      type: 'join'
    }
  ][idx];

  ctx.fillText(data.title, W / 2, 175);
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#d4a24c';
  ctx.font = '500 22px "Cinzel", serif';
  ctx.fillText(data.sub, W / 2, 240);

  // Decorative line
  ctx.strokeStyle = '#8a5a20';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W/2 - 120, 280); ctx.lineTo(W/2 + 120, 280);
  ctx.stroke();
  // Diamond accent
  ctx.fillStyle = '#ff6b1a';
  ctx.beginPath();
  ctx.moveTo(W/2, 274); ctx.lineTo(W/2 + 8, 280); ctx.lineTo(W/2, 286); ctx.lineTo(W/2 - 8, 280);
  ctx.closePath(); ctx.fill();

  // Type-specific content
  if (data.type === 'history') {
    // 2 portrait placeholders
    const portW = 220, portH = 260, gap = 30, startX = (W - portW * 2 - gap) / 2;
    [0,1].forEach(i => {
      const x = startX + i * (portW + gap);
      const y = 320;
      // Frame
      ctx.fillStyle = '#3a2410';
      ctx.fillRect(x - 4, y - 4, portW + 8, portH + 8);
      // Portrait placeholder (sepia gradient)
      const pg = ctx.createLinearGradient(x, y, x, y + portH);
      pg.addColorStop(0, '#5a3818');
      pg.addColorStop(1, '#1a0c04');
      ctx.fillStyle = pg;
      ctx.fillRect(x, y, portW, portH);
      // Silhouette
      ctx.fillStyle = '#0a0402';
      // Head
      ctx.beginPath(); ctx.arc(x + portW/2, y + 80, 38, 0, Math.PI * 2); ctx.fill();
      // Shoulders
      ctx.beginPath();
      ctx.moveTo(x + portW/2 - 70, y + portH);
      ctx.quadraticCurveTo(x + portW/2, y + 130, x + portW/2 + 70, y + portH);
      ctx.lineTo(x + portW/2 - 70, y + portH);
      ctx.fill();
    });
    // Body text
    ctx.fillStyle = 'rgba(244, 228, 188, 0.65)';
    ctx.font = '400 18px "Mukta", sans-serif';
    ctx.textAlign = 'left';
    const text1 = '१९६६ साली स्थापन झालेली, मुंबईच्या';
    const text2 = 'मराठी मातीतून उगम पावलेली एक चळवळ';
    const text3 = 'जी आजही धनुष्यबाणाच्या निशाणाखाली';
    const text4 = 'महाराष्ट्राच्या सेवेसाठी कटिबद्ध आहे.';
    ctx.fillText(text1, 70, 640);
    ctx.fillText(text2, 70, 670);
    ctx.fillText(text3, 70, 700);
    ctx.fillText(text4, 70, 730);

    // Timeline
    const years = ['1966', '1967', '1985', '1995', '2022'];
    const timelineY = 870;
    ctx.strokeStyle = '#ff6b1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, timelineY); ctx.lineTo(W - 80, timelineY);
    ctx.stroke();
    years.forEach((y, i) => {
      const tx = 80 + i * ((W - 160) / (years.length - 1));
      // Dot
      ctx.fillStyle = '#ff6b1a';
      ctx.beginPath(); ctx.arc(tx, timelineY, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0a0604';
      ctx.beginPath(); ctx.arc(tx, timelineY, 3, 0, Math.PI * 2); ctx.fill();
      // Year
      ctx.fillStyle = '#f4d68a';
      ctx.font = '600 18px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText(y, tx, timelineY + 30);
    });
  }

  else if (data.type === 'leadership') {
    // 3 portrait placeholders
    const portW = 160, portH = 200, gap = 24, startX = (W - portW * 3 - gap * 2) / 2;
    [0,1,2].forEach(i => {
      const x = startX + i * (portW + gap);
      const y = 320;
      ctx.fillStyle = '#3a2410';
      ctx.fillRect(x - 3, y - 3, portW + 6, portH + 6);
      const pg = ctx.createLinearGradient(x, y, x, y + portH);
      pg.addColorStop(0, '#5a3818');
      pg.addColorStop(1, '#1a0c04');
      ctx.fillStyle = pg;
      ctx.fillRect(x, y, portW, portH);
      ctx.fillStyle = '#0a0402';
      ctx.beginPath(); ctx.arc(x + portW/2, y + 70, 32, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + portW/2 - 60, y + portH);
      ctx.quadraticCurveTo(x + portW/2, y + 110, x + portW/2 + 60, y + portH);
      ctx.lineTo(x + portW/2 - 60, y + portH);
      ctx.fill();
      // Name placeholder
      ctx.fillStyle = '#d4a24c';
      ctx.font = '600 16px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`LEADER ${i + 1}`, x + portW/2, y + portH + 28);
    });

    // Quote
    ctx.fillStyle = '#f4d68a';
    ctx.font = 'italic 24px "Tiro Devanagari Marathi", serif';
    ctx.textAlign = 'center';
    ctx.fillText('॥ हिंदुत्ववादी · मराठीवादी ॥', W / 2, 620);

    ctx.fillStyle = 'rgba(244, 228, 188, 0.6)';
    ctx.font = '400 18px "Mukta", sans-serif';
    ctx.fillText('संस्थापकांच्या स्वप्नाला घेऊन', W / 2, 700);
    ctx.fillText('आजचे नेतृत्व पुढे चालले आहे —', W / 2, 730);
    ctx.fillText('हिंदुत्व, मराठी अभिमान, स्वराज्य.', W / 2, 760);

    // Bow & arrow accent
    ctx.strokeStyle = '#ff6b1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W/2, 870, 40, Math.PI * 0.3, Math.PI * 1.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W/2, 830); ctx.lineTo(W/2, 910);
    ctx.stroke();
    ctx.fillStyle = '#ff6b1a';
    ctx.beginPath();
    ctx.moveTo(W/2, 815); ctx.lineTo(W/2 - 8, 830); ctx.lineTo(W/2 + 8, 830);
    ctx.closePath(); ctx.fill();
  }

  else if (data.type === 'vision') {
    const items = [
      { icon: '◈', title: 'युव सक्षमीकरण', en: 'Youth Empowerment' },
      { icon: '✦', title: 'महिला सशक्तिकरण', en: 'Women Leadership' },
      { icon: '✸', title: 'शेती व शेतकरी', en: 'Farmers' },
      { icon: '✺', title: 'रोजगार व उद्योग', en: 'Employment' },
      { icon: '✹', title: 'शिक्षण', en: 'Education' },
      { icon: '✶', title: 'डिजिटल महाराष्ट्र', en: 'Digital Maharashtra' }
    ];
    const cols = 2, rows = 3;
    const itemW = (W - 120) / cols;
    const itemH = 130;
    const startY = 330;
    items.forEach((it, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = 60 + col * itemW;
      const y = startY + row * itemH;
      // Icon box
      ctx.fillStyle = 'rgba(255, 107, 26, 0.12)';
      ctx.fillRect(x, y, 60, 60);
      ctx.strokeStyle = '#ff6b1a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, 60, 60);
      ctx.fillStyle = '#ff8a3d';
      ctx.font = '40px serif';
      ctx.textAlign = 'center';
      ctx.fillText(it.icon, x + 30, y + 45);
      // Title
      ctx.fillStyle = '#f4d68a';
      ctx.font = '600 22px "Tiro Devanagari Marathi", serif';
      ctx.textAlign = 'left';
      ctx.fillText(it.title, x + 80, y + 28);
      // EN
      ctx.fillStyle = '#d4a24c';
      ctx.font = '500 14px "Cinzel", serif';
      ctx.fillText(it.en, x + 80, y + 52);
    });
  }

  else if (data.type === 'join') {
    // Big CTA
    ctx.fillStyle = '#f4d68a';
    ctx.font = '600 52px "Tiro Devanagari Marathi", serif';
    ctx.textAlign = 'center';
    ctx.fillText('कार्यकर्ता बना', W/2, 380);

    ctx.fillStyle = '#d4a24c';
    ctx.font = '500 22px "Cinzel", serif';
    ctx.fillText('BECOME A KĀRYAKARTĀ', W/2, 430);

    // Big bow & arrow centerpiece
    const cx = W/2, cy = 600;
    ctx.strokeStyle = '#ff6b1a';
    ctx.lineWidth = 6;
    // Bow arc
    ctx.beginPath();
    ctx.arc(cx, cy, 100, Math.PI * 0.25, Math.PI * 1.75);
    ctx.stroke();
    // String
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 100); ctx.lineTo(cx, cy + 100);
    ctx.stroke();
    // Arrow shaft
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 100); ctx.lineTo(cx, cy - 180);
    ctx.stroke();
    // Arrowhead
    ctx.fillStyle = '#ff6b1a';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 200);
    ctx.lineTo(cx - 14, cy - 170);
    ctx.lineTo(cx + 14, cy - 170);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(244, 228, 188, 0.65)';
    ctx.font = '400 18px "Mukta", sans-serif';
    ctx.fillText('आपला आवाज. आपला वेळ. आपले मत.', W/2, 800);
    ctx.fillText('Your voice. Your time. Your vote.', W/2, 830);

    // Button
    const btnY = 880, btnW = 280, btnH = 60;
    ctx.fillStyle = '#ff6b1a';
    ctx.fillRect(W/2 - btnW/2, btnY, btnW, btnH);
    ctx.fillStyle = '#f4d68a';
    ctx.font = '600 18px "Cinzel", serif';
    ctx.fillText('JOIN NOW', W/2, btnY + 38);
  }

  // Bottom signature
  ctx.fillStyle = 'rgba(244, 228, 188, 0.3)';
  ctx.font = '500 12px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.fillText('॥  शिवसेना  ·  जय महाराष्ट्र  ॥', W/2, H - 60);

  return new THREE.CanvasTexture(c);
}

/* ────── Decorative emblem texture for right-wall panels ─────── */
function drawEmblemTexture(idx) {
  const W = 768, H = 1024;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1a1208');
  bg.addColorStop(0.5, '#0a0604');
  bg.addColorStop(1, '#050302');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Double borders
  ctx.strokeStyle = '#8a5a20'; ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.strokeStyle = '#d4a24c'; ctx.lineWidth = 1;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  // Top calligraphic line (per panel)
  const headings = ['॥ जय महाराष्ट्र ॥', '॥ जय भवानी ॥', '॥ हिंदुत्व ॥', '॥ धनुष्यबाण ॥'];
  ctx.fillStyle = '#f4d68a';
  ctx.shadowColor = 'rgba(255, 122, 48, 0.55)';
  ctx.shadowBlur = 16;
  ctx.font = '600 56px "Tiro Devanagari Marathi", serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(headings[idx % headings.length], W / 2, 180);
  ctx.shadowBlur = 0;

  // Decorative divider
  ctx.strokeStyle = '#8a5a20'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W/2 - 140, 250); ctx.lineTo(W/2 + 140, 250);
  ctx.stroke();
  ctx.fillStyle = '#ff6b1a';
  ctx.beginPath();
  ctx.moveTo(W/2, 242); ctx.lineTo(W/2 + 10, 250); ctx.lineTo(W/2, 258); ctx.lineTo(W/2 - 10, 250);
  ctx.closePath(); ctx.fill();

  // Central bow & arrow centerpiece
  const cx = W/2, cy = 580;
  // Outer ring
  ctx.strokeStyle = '#6a4010'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#d4a24c'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, 168, 0, Math.PI * 2); ctx.stroke();

  // Bow arc
  ctx.strokeStyle = '#ff6b1a'; ctx.lineWidth = 8;
  ctx.shadowColor = 'rgba(255, 107, 26, 0.6)'; ctx.shadowBlur = 22;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, Math.PI * 0.22, Math.PI * 1.78);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Bow string
  ctx.strokeStyle = '#d4a24c'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(Math.PI * 0.22) * 110, cy + Math.sin(Math.PI * 0.22) * 110);
  ctx.lineTo(cx + Math.cos(Math.PI * 1.78) * 110, cy + Math.sin(Math.PI * 1.78) * 110);
  ctx.stroke();

  // Arrow shaft
  ctx.strokeStyle = '#ff8a3d'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx, cy + 90); ctx.lineTo(cx, cy - 170);
  ctx.stroke();
  // Arrowhead
  ctx.fillStyle = '#ff6b1a';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 195);
  ctx.lineTo(cx - 16, cy - 160);
  ctx.lineTo(cx + 16, cy - 160);
  ctx.closePath(); ctx.fill();
  // Fletching
  ctx.fillStyle = '#d4a24c';
  ctx.beginPath();
  ctx.moveTo(cx, cy + 90);
  ctx.lineTo(cx - 10, cy + 75);
  ctx.lineTo(cx, cy + 65);
  ctx.lineTo(cx + 10, cy + 75);
  ctx.closePath(); ctx.fill();

  // Bottom plinth text
  ctx.fillStyle = '#d4a24c';
  ctx.font = '500 22px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHIVSENA · BOW & ARROW', W/2, 860);

  // Years
  const years = ['1966', '1985', '1995', '2022'];
  ctx.fillStyle = 'rgba(244, 228, 188, 0.5)';
  ctx.font = '600 16px "Cinzel", serif';
  ctx.fillText('SINCE ' + years[idx % years.length], W/2, 895);

  // Bottom signature
  ctx.fillStyle = 'rgba(244, 228, 188, 0.3)';
  ctx.font = '500 12px "Cinzel", serif';
  ctx.fillText('॥  जय महाराष्ट्र  ॥', W/2, H - 60);

  return new THREE.CanvasTexture(c);
}

/* ════════════════════════════════════════════════════════════
   THRONE AREA (back of hall)
═══════════════════════════════════════════════════════════ */
const throneGroup = new THREE.Group();

// Steps (3 stacked)
for (let i = 0; i < 3; i++) {
  const step = new THREE.Mesh(
    new THREE.BoxGeometry(8 - i * 1.5, 0.4, 4 - i * 0.8),
    new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.8, metalness: 0.2 })
  );
  step.position.set(0, 0.2 + i * 0.4, -1 - i * 0.4);
  step.receiveShadow = true;
  throneGroup.add(step);
}

// Carpet up steps
const stepCarpet = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 4),
  carpetMat
);
stepCarpet.rotation.x = -Math.PI / 2 + 0.3;
stepCarpet.position.set(0, 0.7, -0.5);
throneGroup.add(stepCarpet);

// Throne chair
const throne = new THREE.Group();
const seat = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.4, 1.6),
  new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.5, metalness: 0.5, emissive: 0x2a1808, emissiveIntensity: 0.3 })
);
seat.position.y = 1.6;
throne.add(seat);

const back = new THREE.Mesh(
  new THREE.BoxGeometry(2, 3.2, 0.3),
  new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.5, metalness: 0.5, emissive: 0x2a1808, emissiveIntensity: 0.3 })
);
back.position.set(0, 3.2, -0.65);
throne.add(back);

const armL = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.8, 1.6),
  new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.5, metalness: 0.5 })
);
armL.position.set(-0.85, 2, 0);
throne.add(armL);
const armR = armL.clone();
armR.position.x = 0.85;
throne.add(armR);

throne.position.set(0, 0, -2);
throneGroup.add(throne);

// Two lion silhouettes flanking throne
function createLion(x) {
  const lion = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.2, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.6, metalness: 0.5 })
  );
  body.position.y = 0.6;
  lion.add(body);
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.8, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x4a3018, roughness: 0.6, metalness: 0.5 })
  );
  head.position.set(0, 1.5, 0.7);
  lion.add(head);
  const mane = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x3a2410, roughness: 0.85, metalness: 0.2 })
  );
  mane.position.set(0, 1.5, 0.5);
  lion.add(mane);
  lion.position.set(x, 0.6, -0.5);
  return lion;
}
throneGroup.add(createLion(-3));
throneGroup.add(createLion(3));

// Big saffron medallion (back wall)
function createMedallion() {
  const C = 512;
  const c = document.createElement('canvas');
  c.width = c.height = C;
  const ctx = c.getContext('2d');
  // Outer ring
  ctx.fillStyle = '#0a0604';
  ctx.fillRect(0,0,C,C);
  // Saffron circle
  const grad = ctx.createRadialGradient(C/2, C/2, 30, C/2, C/2, C/2 - 20);
  grad.addColorStop(0, '#ff8a3d');
  grad.addColorStop(0.7, '#ff6b1a');
  grad.addColorStop(1, '#b8420a');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(C/2, C/2, C/2 - 20, 0, Math.PI * 2); ctx.fill();
  // Outer rim (gold)
  ctx.strokeStyle = '#d4a24c'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(C/2, C/2, C/2 - 24, 0, Math.PI * 2); ctx.stroke();
  // Bow & arrow (dark)
  ctx.strokeStyle = '#0a0604'; ctx.lineWidth = 18;
  ctx.beginPath(); ctx.arc(C/2, C/2 - 20, 90, Math.PI * 0.25, Math.PI * 1.75); ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(C/2, C/2 - 110); ctx.lineTo(C/2, C/2 + 70); ctx.stroke();
  ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(C/2, C/2 - 110); ctx.lineTo(C/2, C/2 - 170); ctx.stroke();
  ctx.fillStyle = '#0a0604';
  ctx.beginPath();
  ctx.moveTo(C/2, C/2 - 195); ctx.lineTo(C/2 - 18, C/2 - 160); ctx.lineTo(C/2 + 18, C/2 - 160);
  ctx.closePath(); ctx.fill();
  // Text
  ctx.fillStyle = '#0a0604';
  ctx.font = 'bold 56px "Tiro Devanagari Marathi", serif';
  ctx.textAlign = 'center';
  ctx.fillText('शिवसेना', C/2, C/2 + 130);
  return new THREE.CanvasTexture(c);
}

const medallionTex = createMedallion();
medallionTex.encoding = THREE.sRGBEncoding;
const medallion = new THREE.Mesh(
  new THREE.CircleGeometry(2.2, 64),
  new THREE.MeshStandardMaterial({
    map: medallionTex,
    emissive: 0xff6b1a, emissiveIntensity: 0.45,
    emissiveMap: medallionTex,
    roughness: 0.7
  })
);
medallion.position.set(0, 6, HALL.zThrone + 0.1);
throneGroup.add(medallion);

throneGroup.position.set(0, 0, HALL.zThrone + 4);
scene.add(throneGroup);

// Throne backlight
const throneLight = new THREE.PointLight(0xff8a3d, 1.4, 14, 2);
throneLight.position.set(0, 6, HALL.zThrone + 1);
scene.add(throneLight);

/* ════════════════════════════════════════════════════════════
   ARCHED WINDOW + GOD RAYS (above throne, behind)
═══════════════════════════════════════════════════════════ */
// Window (bright plane on back wall)
const winGeo = new THREE.PlaneGeometry(3, 4);
const winMat = new THREE.MeshBasicMaterial({
  color: 0xffd99a,
  transparent: true,
  opacity: 0.85
});
const window1 = new THREE.Mesh(winGeo, winMat);
window1.position.set(0, 11, HALL.zThrone + 0.1);
scene.add(window1);

// God rays plane (in front of window, additive)
const rayMat = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  uniforms: { time: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    varying vec2 vUv;
    uniform float time;
    void main() {
      vec2 p = vUv - vec2(0.5, 1.0);
      float d = length(p);
      float angle = atan(p.x, -p.y);
      float rays = 0.5 + 0.5 * sin(angle * 24.0 + time * 0.15);
      rays = pow(rays, 6.0);
      float falloff = smoothstep(1.2, 0.0, length(p) * 1.2);
      float vfade = smoothstep(0.0, 0.4, vUv.y);
      float intensity = rays * falloff * vfade * 0.55;
      vec3 col = vec3(1.0, 0.75, 0.42) * intensity;
      gl_FragColor = vec4(col, intensity);
    }
  `
});
const rays = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), rayMat);
rays.position.set(0, 5, HALL.zThrone + 1);
scene.add(rays);

// Strong key light from window
const keyLight = new THREE.SpotLight(0xffd9a0, 2.2, 50, Math.PI / 5, 0.6, 1.5);
keyLight.position.set(0, 11, HALL.zThrone + 0.5);
keyLight.target.position.set(0, 0, HALL.zThrone + 8);
scene.add(keyLight);
scene.add(keyLight.target);

/* ════════════════════════════════════════════════════════════
   AMBIENT LIGHTING — dim fort interior, torches do most of the work
═══════════════════════════════════════════════════════════ */
// Very low ambient — preserves dark fort atmosphere, lets material colors
// (dark olive walls) read in shadowed areas instead of being washed warm.
const ambient = new THREE.AmbientLight(0xff6020, 0.08);  // was 0.18
scene.add(ambient);

// Hemi sky color much cooler/dimmer — was bathing walls in orange from above.
// Now provides just enough lift to read shapes; torches provide warm key light.
const hemi = new THREE.HemisphereLight(0x4a4030, 0x080404, 0.18);  // was 0xff8030 @ 0.32
scene.add(hemi);

// Walking spotlight (follows camera, fakes torch the visitor carries)
const walkerLight = new THREE.PointLight(0xff7a30, 0.9, 14, 2);
scene.add(walkerLight);

/* ════════════════════════════════════════════════════════════
   DUST MOTES (particles in light beams)
═══════════════════════════════════════════════════════════ */
const dustCount = 350;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
const dustPhase = new Float32Array(dustCount);
for (let i = 0; i < dustCount; i++) {
  dustPos[i*3]   = (Math.random() - 0.5) * 18;
  dustPos[i*3+1] = Math.random() * HALL.height;
  dustPos[i*3+2] = HALL.zEntrance - Math.random() * (HALL.zEntrance - HALL.zThrone);
  dustPhase[i] = Math.random() * Math.PI * 2;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
dustGeo.setAttribute('phase', new THREE.BufferAttribute(dustPhase, 1));

const dustMat = new THREE.ShaderMaterial({
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  uniforms: { time: { value: 0 } },
  vertexShader: `
    attribute float phase;
    varying float vAlpha;
    uniform float time;
    void main() {
      vec3 p = position;
      p.x += sin(time * 0.3 + phase) * 0.15;
      p.y += sin(time * 0.5 + phase * 1.5) * 0.1;
      vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
      gl_PointSize = (1.0 + sin(time * 1.2 + phase) * 0.5) * (160.0 / -mvPos.z);
      vAlpha = 0.3 + 0.5 * sin(time * 0.8 + phase);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragmentShader: `
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float a = (1.0 - d * 2.0) * vAlpha * 0.5;
      gl_FragColor = vec4(1.0, 0.78, 0.45, a);
    }
  `
});
const dust = new THREE.Points(dustGeo, dustMat);
scene.add(dust);

/* ════════════════════════════════════════════════════════════
   SCROLL-DRIVEN CAMERA SYSTEM
═══════════════════════════════════════════════════════════ */
const KEYFRAMES = [
  // Section 0 — Entrance, looking down hall (eye slightly lifted for grandeur)
  { pos: [0, 1.9, 18], tgt: [0, 2.4, -10], fov: 55 },
  // Section 1 — Walked deeper into hall
  { pos: [0, 1.9, 4], tgt: [0, 2.6, -20], fov: 52 },
  // Section 2 — Stopped at panel 1 (History), head turned LEFT
  { pos: [-0.5, 2.6, HALL.panelZ[0]], tgt: [-10, 4.4, HALL.panelZ[0]], fov: 52 },
  // Section 3 — Slid along wall to panel 2 (Leadership)
  { pos: [-0.5, 2.6, HALL.panelZ[1]], tgt: [-10, 4.4, HALL.panelZ[1]], fov: 52 },
  // Section 4 — Panel 3 (Join)
  { pos: [-0.5, 2.6, HALL.panelZ[2]], tgt: [-10, 4.4, HALL.panelZ[2]], fov: 52 }
];

const cameraState = {
  pos: new THREE.Vector3().fromArray(KEYFRAMES[0].pos),
  tgt: new THREE.Vector3().fromArray(KEYFRAMES[0].tgt),
  fov: KEYFRAMES[0].fov,
  scrollProgress: 0
};

function smoothstep(t) { return t * t * (3 - 2 * t); }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

// Lerp between keyframes based on overall scroll progress through 6 sections
function updateCameraFromScroll() {
  const sections = document.querySelectorAll('.scroll-section');
  if (!sections.length) return;

  const trackTop = sections[0].getBoundingClientRect().top + window.scrollY;
const trackEnd = sections[sections.length - 1].getBoundingClientRect().top + window.scrollY;
  const trackHeight = trackEnd - trackTop;

  const raw = (window.scrollY - trackTop) / trackHeight;
  const clamped = Math.max(0, Math.min(0.99999, raw));

  cameraState.scrollProgress = clamped;

  // Map 0..1 over 6 sections — last section ends at 1.0
  const segCount = KEYFRAMES.length - 1;
  const segFloat = clamped * segCount;
  const segIdx = Math.min(segCount - 1, Math.floor(segFloat));
  const segT = segFloat - segIdx;

  // Use stronger easing on the dramatic head-turn (section 1 → 2)
  let eased;
  if (segIdx === 1) {
    eased = easeInOutCubic(segT); // dramatic ease for head turn
  } else {
    eased = smoothstep(segT);
  }

  const a = KEYFRAMES[segIdx];
  const b = KEYFRAMES[segIdx + 1];
  cameraState.pos.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * eased,
    a.pos[1] + (b.pos[1] - a.pos[1]) * eased,
    a.pos[2] + (b.pos[2] - a.pos[2]) * eased
  );
  cameraState.tgt.set(
    a.tgt[0] + (b.tgt[0] - a.tgt[0]) * eased,
    a.tgt[1] + (b.tgt[1] - a.tgt[1]) * eased,
    a.tgt[2] + (b.tgt[2] - a.tgt[2]) * eased
  );
  cameraState.fov = a.fov + (b.fov - a.fov) * eased;

  // Update progress dots
  const activeIdx = Math.round(clamped * (KEYFRAMES.length - 1));
  document.querySelectorAll('.progress-dot').forEach((d, i) => {
    d.classList.toggle('active', i === activeIdx);
  });
}

window.addEventListener('scroll', updateCameraFromScroll, { passive: true });
updateCameraFromScroll();

// Click on progress dot → scroll to that section
document.querySelectorAll('.progress-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.section);
    const section = document.querySelector(`.scroll-section[data-section="${idx}"]`);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ════════════════════════════════════════════════════════════
   MOUSE PARALLAX (subtle head sway)
═══════════════════════════════════════════════════════════ */
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ════════════════════════════════════════════════════════════
   PANEL FOCUS HIGHLIGHTING
═══════════════════════════════════════════════════════════ */
const camForward = new THREE.Vector3();
const toPanel = new THREE.Vector3();
function updatePanelFocus() {
  // For each panel compute cosine alignment with camera forward
  camera.getWorldDirection(camForward);
  panelMeshes.forEach((p, i) => {
    toPanel.copy(p.position).sub(camera.position).normalize();
    const dot = toPanel.dot(camForward); // 1.0 if camera looks at it
    const distance = camera.position.distanceTo(p.position);
    const proximity = Math.max(0, 1 - distance / 14);
    const focus = Math.max(0, dot) * proximity;
    // Boost emissive on the panel material when focused
    p.userData.panelMat.emissiveIntensity = focus * 0.4;
    p.userData.glowMat.opacity = focus * 0.35;
  });
}

/* ════════════════════════════════════════════════════════════
   ANIMATION LOOP
═══════════════════════════════════════════════════════════ */
const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  // Smooth mouse parallax
  mouse.x += (mouse.tx - mouse.x) * 0.04;
  mouse.y += (mouse.ty - mouse.y) * 0.04;

  // Apply scroll-driven pose with mouse parallax overlay
  camera.position.x = cameraState.pos.x + mouse.x * 0.15;
  camera.position.y = cameraState.pos.y - mouse.y * 0.1;
  camera.position.z = cameraState.pos.z;
  camera.lookAt(cameraState.tgt.x, cameraState.tgt.y - mouse.y * 0.15, cameraState.tgt.z);

  if (Math.abs(camera.fov - cameraState.fov) > 0.05) {
    camera.fov += (cameraState.fov - camera.fov) * 0.08;
    camera.updateProjectionMatrix();
  }

  // Walker light follows camera
  walkerLight.position.set(camera.position.x, camera.position.y - 0.3, camera.position.z - 0.5);

  // Flame shaders
  fires.forEach(f => { f.userData.material.uniforms.time.value = t; });

  // Flickering torch lights
  fireLights.forEach((l, i) => {
    l.intensity = l.userData.baseIntensity * (0.85 + Math.sin(t * 9 + i * 1.7) * 0.12 + Math.random() * 0.06);
  });

  // Banner waves
  banners.forEach(b => { b.userData.material.uniforms.time.value = t; });

  // Dust motes
  dustMat.uniforms.time.value = t;
  const dp = dustGeo.attributes.position.array;
  for (let i = 0; i < dustCount; i++) {
    dp[i*3+1] += 0.003;
    if (dp[i*3+1] > HALL.height) dp[i*3+1] = 0;
  }
  dustGeo.attributes.position.needsUpdate = true;

  // God rays
  rayMat.uniforms.time.value = t;

  // Throne light flicker
  throneLight.intensity = 1.4 + Math.sin(t * 1.3) * 0.15;

  // Panel focus
  updatePanelFocus();

  // Banner subtle sway
  banners.forEach((b, i) => {
    b.rotation.y = Math.sin(t * 0.4 + i * 0.7) * 0.03;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

/* ════════════════════════════════════════════════════════════
   RESIZE
═══════════════════════════════════════════════════════════ */
function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  if (floorReflector.getRenderTarget) {
    floorReflector.getRenderTarget().setSize(
      Math.min(w, 1280) * 0.8,
      Math.min(h, 720) * 0.8
    );
  }
}
window.addEventListener('resize', onResize);

/* ════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED SECTION OVERLAY FADES
═══════════════════════════════════════════════════════════ */
function updateOverlays() {
  const sections = document.querySelectorAll('.scroll-section');
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const distance = Math.abs(center - window.innerHeight / 2);
    const norm = Math.min(1, distance / (window.innerHeight * 0.6));
    const opacity = 1 - norm;
    const overlay = s.querySelector('.section-hero, .section-prompt, .wall-readout');
    if (overlay) {
      overlay.style.opacity = opacity;
      overlay.style.transform = (overlay.classList.contains('wall-readout'))
        ? `translateY(calc(-50% + ${norm * 30}px))`
        : `translateY(${norm * 20}px)`;
    }
  });

  // Vestibule cover + golden bloom — cinematic doorway transit
  const cover = document.getElementById('vestibule-cover');
  const glow = document.getElementById('entry-glow');
  if (cover && glow) {
    // Allow progress to overflow past 1.0 so the glow lingers briefly into Section 1
    const sec0Progress = Math.min(1.4, Math.max(0, window.scrollY / window.innerHeight));

    // Easing helpers
    const easeInCubic    = t => t * t * t;
    const easeOutCubic   = t => 1 - Math.pow(1 - t, 3);
    const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

    // Photo: holds at full opacity briefly, then fades with ease-in (slow start, fast finish)
    const photoT = Math.max(0, Math.min(1, (sec0Progress - 0.10) / 0.75));
    const photoOpacity = 1 - easeInCubic(photoT);
    // Photo scale: ease-in-out so the dolly feels organic — slow start, accelerate, slow settle
    const photoScale = 1 + easeInOutCubic(Math.min(1, sec0Progress)) * 0.42;
    // Brightness + saturation bloom as photo fades — feels like sun-glare stepping into light
    const photoBrightness = 1 + photoT * 0.32;
    const photoSaturate   = 1 + photoT * 0.35;
    cover.style.opacity = photoOpacity;
    cover.style.transform = `scale(${photoScale})`;
    cover.style.filter = `brightness(${photoBrightness}) saturate(${photoSaturate})`;
    cover.style.visibility = photoOpacity < 0.001 ? 'hidden' : 'visible';

    // Golden bloom: bell curve peaking at sec0Progress = 0.55 (mid-fade moment)
    const glowPeak   = 0.55;
    const glowSpread = 0.62;
    const glowDist = Math.abs(sec0Progress - glowPeak) / glowSpread;
    const glowT = Math.max(0, 1 - glowDist);
    const glowOpacity = easeOutCubic(glowT) * 0.95;
    const glowScale   = 1 + glowT * 0.14;
    glow.style.opacity = glowOpacity;
    glow.style.transform = `scale(${glowScale})`;
    glow.style.visibility = glowOpacity < 0.005 ? 'hidden' : 'visible';
  }

  // Hide social rail + header on later scroll (so wall view is clean)
  const ratio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const socialRail = document.getElementById('social-rail');
if (socialRail) socialRail.style.opacity =
    Math.max(0.3, 1 - Math.max(0, (ratio - 0.5) * 2));

  // Fade canvas at very end
  const totalH = document.body.scrollHeight - window.innerHeight;
  const lastSection = document.querySelector('.outro');
  if (lastSection) {
    const lr = lastSection.getBoundingClientRect();
    const fade = 1 - Math.max(0, Math.min(1, (window.innerHeight - lr.top) / window.innerHeight));
    canvas.style.opacity = Math.max(0.2, fade);
  }
}
window.addEventListener('scroll', updateOverlays, { passive: true });
updateOverlays();


/* ════════════════════════════════════════════════════════════
   BOOT — wait fonts, draw textures, start animation
═══════════════════════════════════════════════════════════ */
async function boot() {
  // Wait for fonts (so canvas-rendered Devanagari is correct)
  try {
    await Promise.all([
      document.fonts.load('700 78px "Tiro Devanagari Marathi"'),
      document.fonts.load('500 22px "Cinzel"'),
      document.fonts.load('500 18px "Mukta"')
    ]);
    await document.fonts.ready;
  } catch (e) {
    console.warn('Font load issue', e);
  }

  // Generate panel textures
  panelMeshes.forEach((p, i) => {
    const tex = drawPanelTexture(i);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    p.userData.panelMat.map = tex;
    p.userData.panelMat.emissiveMap = tex;
    p.userData.panelMat.needsUpdate = true;
  });

  // Decorative right-wall panel textures (bow & arrow emblem)
  decorPanelMeshes.forEach((p, i) => {
    const tex = drawEmblemTexture(i);
    tex.encoding = THREE.sRGBEncoding;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    p.userData.panelMat.map = tex;
    p.userData.panelMat.emissiveMap = tex;
    p.userData.panelMat.emissiveIntensity = 0.18; // gentle ambient glow
    p.userData.panelMat.needsUpdate = true;
  });

  // Hide loader
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 600);

  // Start render loop
  animate();
}

boot();

}