# Shiv Sena Website — Pending Tasks

> Project: `shivsena-react` (Vite + React 18 + React Router v7 + Lenis + Three.js)
> Path: `C:\Users\Admin\Downloads\shivsena-clean\shivsena-clean`
> Bilingual: Marathi (default) + English, driven by `useContent()` + JSON files in `src/content/`

---

## Done recently

- [x] **#1 Banner hero logo** — swapped SHIVSENA text for `/Logo/sena-logo.webp` in `src/pages/Home/Hero.jsx`. Size `clamp(200px, 32vw, 460px)`, no glow.
- [x] **#2 Mahayuti page** — rebuilt to use ONLY docx content (`details/Shared by the client/For web site महायुती.docx`). Banner + single editorial article with drop cap, twin portrait band (Balasaheb + Dharmaveer), verbatim pull quote, floated Shinde portrait, cinematic 2024 hero photo, closing flourish. No invented timeline / partners / vision sections.

---

## Pending — 8 tasks

### #3 — ShivSena Establishment page
- Create a new dedicated page.
- **Blocker:** need source content from client.
- Routing pattern: add to `src/App.jsx` + create `src/pages/ShivSenaEstablishment/`.

### #4 — Preloader functionality
- Audit preloader on entrance and route changes.
- Check `src/pages/Entrance/` and any loader components.
- Confirm timing, asset preload completeness, and that it doesn't flash on subsequent navigations.

### #7 — YouTube icon on Contact page
- `src/pages/Contact/` — verify icon is rendering, linked, and styled with the rest of the socials.
- Likely missing icon import or broken filter color.

### #10 — Leadership section new layout
- Currently a 3-column grid (`src/pages/Home/sections/LeadershipCarousel.*` or similar — confirm).
- Redesign needed. **Awaiting design direction** from user (mosaic? hero-leader + tiles? horizontal carousel back?).

### #11 — Map right-side leadership images
- `src/pages/Home/sections/RegionExplorer.*` / `RegionMap.*` right panel.
- Update photos / refresh source set / fix any broken paths.

### #14 — Footer address alignment
- `src/pages/Home/sections/Footer.*` — long address wraps awkwardly / column balance off.
- Adjust column widths, line-height, or break-points.

### #17 — Thobad images
- Need to confirm which page/section uses "thobad" imagery.
- Check `/public/leaders/`, `/public/new-imgs/`, and component references.

### #19 — ShivSena Janm page
- Page audit — confirm content accuracy, layout polish, image quality, bilingual coverage.

---

## Quick context for the next chat

### Key conventions
- **Content:** JSON-driven via `useContent(content)` from `src/content/_shared/useContent.js`. Each content file has `mr` and `en` slices.
- **Sections:** Each page has `index.jsx` + `pageName.css` + `sections/SectionName.jsx` + `.css`.
- **Scroll reveal:** `useScrollReveal()` hook from `src/pages/Home/hooks/useScrollReveal.js` — adds `.is-revealed` to the ref'd element.
- **Palette tokens (light theme):** `--paper #FAF6EE`, `--paper-deep #F2EBDD`, `--saffron-on-light #C44D0E`, `--ink #1A1410`, `--body-text #5C544A`.
- **Fonts:** `Noto Sans Devanagari` + `Mukta` (Marathi), `Cinzel` + `Playfair` (English display).
- **Lenis smooth scroll:** mounted per-page via `useLenis()`. Use `data-lenis-prevent` on nested scrollers.
- **Images with spaces:** `encodeURIComponent` the filename.
- **Saffron icon filter (for PNGs):** `brightness(0) saturate(100%) invert(31%) sepia(95%) saturate(2076%) hue-rotate(8deg)`.

### Dev server
```bash
cd C:\Users\Admin\Downloads\shivsena-clean\shivsena-clean
npm run dev     # http://localhost:5173
```

### Suggested order
- **Quick wins first:** #7 (YouTube icon), #14 (footer alignment), #4 (preloader audit)
- **Need user input:** #3 (content), #10 (design direction), #17 (which page)
- **Content audits:** #11, #19
