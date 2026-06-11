import { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import TRANSLATIONS from './translations.json';

const LanguageContext = createContext(null);

/* The site is Marathi-only. Language is locked to 'mr' — setLang is kept
   as a no-op so existing callers (e.g. the entrance screen) don't break. */
export function LanguageProvider({ children }) {
  const lang = 'mr';

  useEffect(() => {
    document.documentElement.lang = 'mr';
  }, []);

  // Locked: switching languages is disabled.
  const changeLang = useCallback(() => {}, []);

  const t = useCallback((key) => {
    return TRANSLATIONS.mr?.[key] ?? key;
  }, []);

  const value = useMemo(() => ({ lang, setLang: changeLang, t }), [changeLang, t]);

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
