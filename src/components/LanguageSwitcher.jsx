import { useLanguage } from '../i18n/LanguageContext.jsx';
import { LANGUAGES, SUPPORTED_LANGS } from '../content/_shared/languages.js';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-switcher">
      {SUPPORTED_LANGS.map((code, i) => (
        <span key={code} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <button
            className={`lang-btn ${lang === code ? 'active' : ''}`}
            onClick={() => setLang(code)}
          >
            {LANGUAGES[code].label}
          </button>
          {i < SUPPORTED_LANGS.length - 1 && <span className="lang-divider">|</span>}
        </span>
      ))}
    </div>
  );
}
