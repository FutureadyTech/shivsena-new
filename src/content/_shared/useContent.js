import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { DEFAULT_LANG, isValidLang } from './languages.js';

/**
 * Returns the localized slice of a content object for the current language.
 * Falls back to DEFAULT_LANG ('mr') if the active language is missing or
 * the content object doesn't have a slice for it.
 *
 * @template T
 * @param {Record<string, T>} content - Content object keyed by language code
 * @returns {T} The slice for the active language (or fallback)
 *
 * @example
 *   import { useContent } from '@/content/_shared/useContent';
 *   import homeContent from '@/content/home.json';
 *
 *   function Hero() {
 *     const t = useContent(hero);
 *     return <h1>{t.title}</h1>;
 *   }
 */
export function useContent(content) {
  const { lang } = useLanguage();
  const activeLang = isValidLang(lang) ? lang : DEFAULT_LANG;
  return content[activeLang] || content[DEFAULT_LANG] || {};
}

/**
 * Same as useContent but returns BOTH the slice and the active language code.
 * Useful when components need to render language-specific markup
 * (e.g., switching fonts based on script).
 *
 * @example
 *   const { t, lang } = useContentWithLang(welcomeBanner);
 *   <h1 className={`title title--${lang}`}>{t.title}</h1>
 */
export function useContentWithLang(content) {
  const { lang } = useLanguage();
  const activeLang = isValidLang(lang) ? lang : DEFAULT_LANG;
  return {
    t: content[activeLang] || content[DEFAULT_LANG] || {},
    lang: activeLang,
  };
}
