# Shiv Sena Website — Image Asset Specifications

This document lists **every image slot** on the site with the exact size the client should deliver. All recommendations are **2× the display size** so they render crisp on Retina / high-DPI screens.

## 🧭 Quick rules (apply to every image)

| Rule | Detail |
|---|---|
| **Format (photos)** | WebP first, JPG fallback. Both at quality 80–85. |
| **Format (logos / illustrations / icons)** | PNG with transparency. SVG when geometric. |
| **Format (video)** | MP4, H.264, 30 fps, ~2–3 Mbps |
| **Colour profile** | sRGB |
| **File size target** | Photos ≤ 250 KB · Hero banners ≤ 500 KB · Logos ≤ 100 KB |
| **Naming** | All lowercase, no spaces, hyphens between words. e.g. `mla-name-constituency.webp` |
| **Filename clarity** | Use the leader's name in English transliteration. Don't use Marathi in filenames. |
| **Always provide 2× the listed display size** | We downscale crisply; we cannot upscale without blur. |
| **No watermarks / IPTC tags / EXIF rotation issues** | Strip metadata before delivering. |
| **Padding** | For portraits, keep the face in the upper 60% of the frame — our cards crop with `object-position: center top`. |

---

## 1) Header & Brand

| Slot | Display size | **Deliver** | Format | Notes |
|---|---|---|---|---|
| Site logo (top-left, every page) | 60 × auto | **240 × 240 px** | PNG (transparent) or WebP | Square or near-square. Saffron logo with full padding inside the canvas. |
| Mobile menu logo (same source) | 60 × auto | (same as above) | (same) | Reused. |
| Entrance loader logo | 84 × 84 inside disc | **400 × 400 px** | PNG (transparent) | Saffron-on-white blend mode is applied. |
| Entrance "vestibule cover" photo | 100vw × 100vh | **3840 × 2160 px (4K)** | WebP | This is the cinematic poster before the 3D scene loads. |

---

## 2) Home page — Hero (banner video)

| Slot | Display | **Deliver** | Format | Notes |
|---|---|---|---|---|
| Hero background video | full viewport (~1920×1080) | **1920 × 1080 @ 30fps** | MP4 (H.264) | 8–15s loop, **no audio**, ≤ 4 MB. Quiet animated b-roll preferred. |
| Hero poster (fallback while video loads) | full viewport | **1920 × 1080 px** | WebP | First frame of the video, used as poster + low-bandwidth fallback. |

---

## 3) Home page — "वारसा हिंदुत्वाचा" Leadership Feature (also on About page)

3 alternating left/right hero blocks. Image is **500 px tall**, ~600 px wide on desktop.

| # | Leader | Display | **Deliver** | Crop |
|---|---|---|---|---|
| 1 | बाळासाहेब ठाकरे | 600 × 500 (4 : 5 portrait) | **1200 × 1500 px** | Face in top 30% (upper-centred) |
| 2 | धर्मवीर आनंद दिघे | same | **1200 × 1500 px** | same |
| 3 | एकनाथ शिंदे | same | **1200 × 1500 px** | same |

Format: **WebP + JPG**. ≤ 250 KB each.

---

## 4) Mahayuti page — alternating article blocks

4 blocks, image is **500 px tall** × ~600 px wide.

| # | Block | **Deliver** | Notes |
|---|---|---|---|
| 1 | १९८९ · पायाभरणी | **1200 × 1500 px** | Balasaheb + BJP founders (Mahajan, Munde) historical photo |
| 2 | २०१२–२०१९ · वाटचाल | **1200 × 1500 px** | Period photos – Balasaheb / Dharmaveer / Sena pillars |
| 3 | २०२२ · नवे नेतृत्व | **1200 × 1500 px** | Eknath Shinde rally / sworn-in photo |
| 4 | २०२४ · ऐतिहासिक विजय | **1200 × 1500 px** OR **1500 × 1200 px (landscape)** | Mahayuti victory crowd shot |

Format: WebP + JPG. ≤ 250 KB each.

---

## 5) ShivSena Janma page — 7 alternating article blocks

Image **500 px tall** × ~600 px wide. Historical/archival photos preferred.

| # | Block | **Deliver** |
|---|---|---|
| 1 | मार्मिकची मुळे (1960) | **1200 × 1500 px** |
| 2 | मार्मिकचा प्रहार | **1200 × 1500 px** |
| 3 | संघटना की पक्ष? | **1200 × 1500 px** |
| 4 | प्रबोधनकारांचा सल्ला | **1200 × 1500 px** |
| 5 | १९ जून १९६६ · स्थापना | **1200 × 1500 px** |
| 6 | नाव · शिवसेना | **1200 × 1500 px** |
| 7 | ३० ऑक्टोबर १९६६ · पहिला दसरा मेळावा | **1200 × 1500 px** |

If any image is taller than 4:5 (e.g. Balasaheb hand-raised) deliver at **1200 × 1800** instead. We use `object-position: center top` so heads stay in frame.

---

## 6) Leadership directory — Per-district leader cards

These are the leader cards under the map. Card aspect is **3 : 4 portrait**. Audited live display size on /leadership: **338 × 450 px** per card on desktop. For 2× retina we need **676 × 900** source minimum.

> **REAL-WORLD AUDIT FINDING (May 2026):** the two correctly-delivered photos already on disk (`MP Photos/04_Sandipan_Bhumare.webp` and `Mla Photos/48_Smt_Ranjanatai_Jadhav.webp`) are both at **720 × 960 px**, which is the sweet spot. **Match this size for every replacement.** Most existing photos are 238 × 317 px and visibly soft.

| Slot | Display | **Deliver** | Notes |
|---|---|---|---|
| MLA portrait | 338 × 450 (3:4) | **720 × 960 px** | 60 MLAs — currently mostly at 238 × 317, **needs re-delivery** |
| MP portrait | same | **720 × 960 px** | 9 MPs — same upscale issue |
| District head portraits (जिल्हाप्रमुख) | same | **720 × 960 px** | All 36 districts — **none delivered yet** |
| Women district head portraits | same | **720 × 960 px** | 89 leaders — **none delivered yet** |
| State-level नेते / उपनेते portraits | same | **720 × 960 px** | 66 leaders combined — most missing |
| Regional contact head portraits (विभागीय संपर्क प्रमुख) | same | **720 × 960 px** | ~12 leaders — most missing |

Format: **WebP**. ≤ 100 KB each. Face anchored in the upper 60% of the frame.

**Placeholder fallbacks already in the site:** `/public/placeholder/placeholder-men.png` and `placeholder-women.png`. These show when no photo is delivered.

---

## 7) Leadership directory — Map right-panel avatars

Small circular avatars next to the map on the home `Region Explorer`. 44 × 44 px round.

| Slot | Display | **Deliver** | Notes |
|---|---|---|---|
| Avatar circle | 44 × 44 round | **160 × 160 px** square crop | Same photo as #6 (MLAs/etc.) reused — we crop to circle in CSS |

---

## 8) Leader profile pages (`/leader/:slug`)

Currently exists for Balasaheb, Dharmaveer, Shinde.

| Slot | Display | **Deliver** | Notes |
|---|---|---|---|
| Profile banner image | ~1280 × 600 | **2560 × 1200 px** | Wide landscape hero |
| Profile portrait | varies | **1200 × 1500 px** | Used in article body |

---

## 9) Innovative page (5 schemes)

Alternating image + text blocks. Image aspect is **4 : 3**.

| Slot | Display | **Deliver** |
|---|---|---|
| Scheme image (each of 5) | 600 × 450 | **1200 × 900 px** |

Format: WebP + JPG. Photos should show the scheme in action (beneficiaries, infra, etc.).

---

## 10) Affiliated Organizations (9 orgs)

| Slot | Display | **Deliver** |
|---|---|---|
| Org card icon | ~80 × 80 | **240 × 240 px** | PNG transparent if logo |
| Org detail page banner | ~1280 × 400 | **2560 × 800 px** | Wide landscape |

---

## 11) News page

| Slot | Display | **Deliver** | Aspect |
|---|---|---|---|
| News Banner background | full | **1920 × 1080 px** | 16:9 |
| Press release card thumbnail | ~340 × 192 | **720 × 405 px** | 16:9 |
| Interview / article thumbnail | 130 × 130 round-ish | **400 × 400 px** | 1:1 square |
| Video gallery thumbnail | ~400 × 225 | **800 × 450 px** | 16:9 |
| Photo gallery image | varies (grid) | **1600 × 1200 px** | 4:3 — flexible |
| Speech thumbnail | ~400 × 225 | **800 × 450 px** | 16:9 |

---

## 12) Banners — Section heroes (one per page)

Same template for: Innovative, News, Declarations, Mahayuti, ShivSena Janma, About, Contact, Leadership.

| Slot | Display | **Deliver** |
|---|---|---|
| Section banner background | full viewport (~1920 × 1080) | **2560 × 1440 px** (1440p) |

Format: WebP + JPG. ≤ 400 KB. Subject framed center; we overlay dark gradients + saffron tint.

---

## 13) Storytelling Timeline (Home page) — 4 era cards

| Slot | Display | **Deliver** | Aspect |
|---|---|---|---|
| Era image (each of 4) | ~1280 × 720 | **2560 × 1440 px** | 16:9 |

Currently uses: `/img-1.webp`, `/img-2.webp`, `/img-1.jpg`, etc.

---

## 14) Vision / Pillars (Home page)

Three pillar cards. They use **icons / glyphs**, not photos. SVG provided via Flaticon — no client image needed unless you want to swap.

If swapping to photos:
- Display: each card ~340 × 220
- Deliver: **720 × 480 px**

---

## 15) Contact page

| Slot | Display | **Deliver** | Notes |
|---|---|---|---|
| Contact banner background | full viewport | **2560 × 1440 px** | Subject in middle 50%, overlays applied |
| ID card photo (generated dynamically) | from user upload | n/a | Member uploads at form submission |

---

## 📦 Delivery format

Easiest for both sides:

1. **One Google Drive folder** with sub-folders matching the section names above (`01-header`, `02-hero`, `03-leadership-feature`, etc.)
2. Each image named per the **filename clarity** rule above
3. Provide both **WebP** + **JPG** for every photo (we choose at runtime via `<picture>` element if needed)
4. A single accompanying **`captions.txt`** with: filename → caption / alt text (English + Marathi). Useful for accessibility + SEO.

---

## ⚠️ Things we DO NOT need from client

- Icons / SVGs (already sourced from Flaticon)
- Maharashtra map SVG (built-in)
- Social platform icons (built-in)
- Decorative ornaments / Devanagari watermarks (rendered as type)
- Background patterns / textures (CSS-generated)
- Cursor sparks / loader animations

---

## 📐 Aspect ratio cheat sheet

| Ratio | Where | Source size for 2× |
|---|---|---|
| **4:5 portrait** | Leadership Feature, Mahayuti / Janma article blocks | 1200 × 1500 |
| **3:4 portrait** | Leader directory cards (MLAs, MPs, district heads) | **720 × 960** |
| **1:1 square** | Avatars, logos, social profiles | 240 × 240 / 400 × 400 |
| **4:3 landscape** | Innovative scheme blocks | 1200 × 900 |
| **16:9 widescreen** | All section banners, news thumbnails, video gallery, timeline | 2560 × 1440 (banners) · 720 × 405 (cards) |
| **Free landscape** | Photo gallery (grid auto-sizes) | 1600 × 1200 |

---

## Total image asset count (rough estimate)

| Category | Count |
|---|---|
| Top leaders (Balasaheb, Dharmaveer, Shinde, etc.) | ~10 |
| MLAs | 60 |
| MPs | 9 |
| जिल्हाप्रमुख (male) | 36 (when supplied) |
| महिला जिल्हाप्रमुख | 89 |
| State-level नेते / उपनेते | 66 |
| Section banners (all pages) | ~10 |
| Mahayuti / Janma article photos | 11 |
| Affiliated org logos | 9 |
| Innovative scheme photos | 5 |
| Storytelling timeline images | 4 |
| News / Press / Speech / Video thumbnails | dynamic, ongoing |
| Hero video + poster | 1 + 1 |

**Approximate total of one-time assets: ~310 images + 1 video.**
