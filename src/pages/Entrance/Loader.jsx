import { useT } from '../../i18n/LanguageContext.jsx';

/**
 * Loader is hidden imperatively by scene.js via:
 *   document.getElementById('loader').classList.add('hidden')
 *
 * So we keep className static here ("loader" with no conditional). React's
 * reconciler will leave the classList alone on re-renders, which means the
 * .hidden class added by scene.js survives language changes. The text content
 * inside can still react to language changes safely — only textContent updates.
 */
export default function Loader() {
  const t = useT();
  return (
    <div className="loader" id="loader">
      <div className="loader-emblem">
        <img
          src="/logo.png"
          alt="शिवसेना"
          className="loader-emblem-logo"
          draggable="false"
        />
      </div>
      <div className="loader-text">{t('loader')}</div>
      <div className="loader-sub">{t('loader-sub')}</div>
      <div className="loader-bar"></div>
    </div>
  );
}
