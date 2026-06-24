/**
 * Supported languages across the site. Marathi is the source language;
 * English is the client-provided translation.
 */
export const LANGUAGES = {
  mr: { code: 'mr', label: 'मराठी', latinLabel: 'Marathi' },
  en: { code: 'en', label: 'ENG',   latinLabel: 'English' },
};

export const SUPPORTED_LANGS = Object.keys(LANGUAGES);
export const DEFAULT_LANG = 'mr';

export function isValidLang(code) {
  return SUPPORTED_LANGS.includes(code);
}
