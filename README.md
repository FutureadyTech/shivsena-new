# Shivsena Hall — React Edition

Cinematic 3D scrolling experience, now on **Vite + React 18**. The 3D scene
(`scene.js`) is the original Three.js r128 code, untouched — just wrapped in
a React component so the rest of the site can be built around it.

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Drop in the PBR textures (NOT included — see public/textures/README.md)
#    Required folders: Bricks102, Concrete044D, Marble007, metal007, Wood067
#    Place them at: public/textures/<FolderName>/

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:5173
```

Production build:
```bash
npm run build      # outputs to dist/
npm run preview    # local preview of the build
```

---

## 📁 Project structure

```
shivsena-react/
├── index.html                       Vite entry (React mounts into #root)
├── package.json
├── vite.config.js
│
├── public/                          Static assets served at /
│   ├── hero.png                     Vestibule cover image
│   ├── hero.jpg
│   └── textures/                    ⚠️ DROP YOUR PBR TEXTURES HERE
│       └── README.md                Exact folder structure required
│
└── src/
    ├── main.jsx                     React root
    ├── App.jsx                      Wraps LanguageProvider + Entrance page
    │
    ├── i18n/                        Site-wide internationalization
    │   ├── LanguageContext.jsx      Provider + useLanguage() / useT() hooks
    │   └── translations.js          mr / hi / en dictionaries
    │
    ├── components/                  Shared across all pages
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── SocialRail.jsx
    │   ├── LanguageSwitcher.jsx
    │   └── SoundToggle.jsx
    │
    ├── pages/
    │   └── Entrance/                The 3D hall landing page
    │       ├── index.jsx            Page composition
    │       ├── HeroExperience.jsx   React wrapper for scene.js
    │       ├── scene.js             1,889-line Three.js scene (untouched)
    │       ├── Loader.jsx
    │       ├── ProgressRail.jsx
    │       ├── ScrollSections.jsx   The 6 scrolling chapters
    │       ├── Outro.jsx
    │       ├── useAmbientAudio.js   Hook (refactored from audio.js)
    │       └── entrance.css         Page-specific styles
    │
    └── styles/
        └── global.css               Design tokens + reset (site-wide)
```

---

## 🌐 Adding a new page (future work)

1. Create `src/pages/About/index.jsx` (or whatever the page is called)
2. When you're ready for routing, install React Router and add a `<Routes>`
   block in `App.jsx`:

   ```jsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import Entrance from './pages/Entrance';
   import About from './pages/About';

   <BrowserRouter>
     <Routes>
       <Route path="/" element={<Entrance />} />
       <Route path="/about" element={<About />} />
     </Routes>
   </BrowserRouter>
   ```

3. The **Header**, **Footer**, **SocialRail**, and **i18n context** all work
   on the new page automatically — no setup needed.

---

## 🈯 Adding translations

Edit `src/i18n/translations.js`. Add the key to all three languages, then use
it anywhere via the `useT()` hook:

```jsx
import { useT } from '../i18n/LanguageContext';

function MyComponent() {
  const t = useT();
  return <h1>{t('my-new-key')}</h1>;
}
```

To add a **new language**: add a new top-level entry in `TRANSLATIONS` and a
new entry in the `LANGUAGES` array.

---

## 🎨 Where to change what

| To change…                          | Edit                                            |
|-------------------------------------|-------------------------------------------------|
| Translation copy                    | `src/i18n/translations.js`                      |
| Hero cover photo                    | Replace `public/hero.png`                       |
| Section structure (chapters)        | `src/pages/Entrance/ScrollSections.jsx`         |
| Header / brand / language buttons   | `src/components/Header.jsx`                     |
| Visual styling — site-wide tokens   | `src/styles/global.css`                         |
| Visual styling — entrance only      | `src/pages/Entrance/entrance.css`               |
| 3D geometry / lighting / camera     | `src/pages/Entrance/scene.js`                   |
| Ambient audio synth                 | `src/pages/Entrance/useAmbientAudio.js`         |

---

## 🛠 Tech stack

- **Vite 5** — dev server + bundler
- **React 18** — UI
- **Three.js r128** — pinned to match the original scene code 1:1
- **Web Audio API** — ambient drone (synth, no audio files)

GSAP / ScrollTrigger were referenced in the original CDN scripts but never
actually used in the code. Removed.
