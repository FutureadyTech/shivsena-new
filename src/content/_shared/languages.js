/**
 * Supported languages across the site.
 * The site is Marathi-only — English has been retired. Add a language
 * back here AND ensure all content files have the new key to re-enable.
 */
export const LANGUAGES = {
  mr: { code: 'mr', label: 'मराठी', latinLabel: 'Marathi' },
};

export const SUPPORTED_LANGS = Object.keys(LANGUAGES);
export const DEFAULT_LANG = 'mr';

export function isValidLang(code) {
  return SUPPORTED_LANGS.includes(code);
}
