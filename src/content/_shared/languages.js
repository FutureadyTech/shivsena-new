/**
 * Supported languages across the site.
 * Add a new language here AND ensure all content files have the new key.
 */
export const LANGUAGES = {
  mr: { code: 'mr', label: 'मराठी', latinLabel: 'Marathi' },
  en: { code: 'en', label: 'EN',     latinLabel: 'English' },
};

export const SUPPORTED_LANGS = Object.keys(LANGUAGES);
export const DEFAULT_LANG = 'mr';

export function isValidLang(code) {
  return SUPPORTED_LANGS.includes(code);
}
