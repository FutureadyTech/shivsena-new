import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import TRANSLATIONS from './translations.json';

const LanguageContext = createContext(null);

export function LanguageProvider({ children, defaultLang = 'mr' }) {
  const [lang, setLang] = useState(defaultLang);

  const changeLang = useCallback((next) => {
    if (!TRANSLATIONS[next]) return;
    setLang(next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback((key) => {
    return TRANSLATIONS[lang]?.[key] ?? key;
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
