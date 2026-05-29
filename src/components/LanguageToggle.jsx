import { useLanguage } from '../i18n/LanguageContext.jsx';
import { LANGUAGES, SUPPORTED_LANGS } from '../content/_shared/languages.js';
import './LanguageToggle.css';

/**
 * Language toggle drops into any header.
 * Auto-inherits color from parent (works on light or dark backgrounds).
 *
 * Optional `variant` prop:
 * - "auto" (default) → inherits parent text color
 * - "light" → forces dark text (use on light/cream backgrounds)
 * - "dark" → forces light text (use on dark/navy backgrounds)
 *
 * @example
 * <LanguageToggle /> // auto-adapts
 * <LanguageToggle variant="dark" />  // for dark hero areas
 */
export default function LanguageToggle({ variant = 'auto', className = '' }) {
  const { lang, setLang } = useLanguage();

  return (
 <div
 className={`lang-toggle lang-toggle--${variant} ${className}`}
 role="group"
 aria-label="Language selector"
 >
 {SUPPORTED_LANGS.map((code, i) => (
 <span key={code} className="lang-toggle__item">
 <button
 type="button"
 className={`lang-toggle__btn ${lang === code ? 'is-active' : ''}`}
 onClick={() => setLang(code)}
 aria-pressed={lang === code}
 aria-label={`Switch to ${LANGUAGES[code].latinLabel}`}
 >
 {LANGUAGES[code].label}
 </button>
 {i < SUPPORTED_LANGS.length - 1 && (
 <span className="lang-toggle__sep" aria-hidden="true">|</span>
 )}
 </span>
 ))}
 </div>
  );
}
