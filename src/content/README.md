# Content Folder

All site copy lives here, organised by page as JSON files. Components read
content via the `useContent` hook and never hardcode strings.

## Structure

```
src/content/
├── _shared/
│   ├── languages.js     # Supported languages (mr, en)
│   └── useContent.js    # Hook + language fallback utility
├── home.json            # All Home page sections
├── entrance.json        # Entrance / cinematic experience
└── index.js             # Shared utility re-exports
```

## JSON Format

Each JSON file is a page-level object. Keys are section names; values
are objects keyed by language code first, then content keys:

```json
{
  "hero": {
    "mr": { "title": "जय भवानी", "subtitle": "..." },
    "en": { "title": "Jai Bhavani", "subtitle": "..." }
  }
}
```

## Hook Usage

```jsx
import { useContent } from '@/content/_shared/useContent';
import homeContent from '@/content/home.json';

function Hero() {
  const t = useContent(homeContent.hero);
  return <h1>{t.title}</h1>;
}
```

## Adding a New Language

1. Add to `src/content/_shared/languages.js`
2. Add the new language key to every section in all JSON files
3. Add the new language to `src/i18n/translations.json`

## Navigation / UI Strings

Global UI strings (nav, pillars, loader) live in `src/i18n/translations.json`
and are accessed via the `useT()` hook from `LanguageContext`.
