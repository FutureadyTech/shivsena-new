import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import TRANSLATIONS from './translations.json';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'SHIVSENA_LANG';

/* Bilingual: Marathi (source) ↔ English (client translation). The chosen
   language persists in localStorage so it survives reloads and route
   changes. UI strings fall back to Marathi if an English key is missing. */
export function LanguageProvider({ children, defaultLang = 'mr' }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && TRANSLATIONS[saved]) return saved;
    } catch { /* ignore */ }
    return defaultLang;
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const changeLang = useCallback((next) => {
    if (!TRANSLATIONS[next]) return;
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  const t = useCallback((key) => {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.mr?.[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang: changeLang, t }), [lang, changeLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
