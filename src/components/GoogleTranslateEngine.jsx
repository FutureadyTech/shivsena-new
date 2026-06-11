import { useEffect } from 'react';

/* ═══════════════════════════════════════════════════════════════
   GOOGLE TRANSLATE ENGINE — mount ONCE at the app root.

   Loads Google's element script and initialises a hidden translator
   (source: Marathi, only target: English). On every page load it
   re-applies the language saved in the `googtrans` cookie by driving
   Google's hidden <select> (.goog-te-combo) — this is what makes the
   choice persist as the user navigates between routes.

   Rendered exactly once so there's a single #google_translate_element
   host (the toggle UI can appear many times).
═══════════════════════════════════════════════════════════════ */

const SCRIPT_ID = 'google-translate-script';

/* Active target language from the googtrans cookie ('/mr/en' → 'en'). */
function cookieTarget() {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!m) return 'mr';
  const t = decodeURIComponent(m[1]).split('/').filter(Boolean).pop();
  return t === 'en' ? 'en' : 'mr';
}

/* Poll for Google's hidden combo, then select the target language so
   the page translates. Retries because the combo mounts a moment
   after the script's init callback fires. */
function applyToCombo(target, tries = 0) {
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    if (combo.value !== target) {
      combo.value = target;
      combo.dispatchEvent(new Event('change'));
    }
    return;
  }
  if (tries < 60) setTimeout(() => applyToCombo(target, tries + 1), 150);
}

export default function GoogleTranslateEngine() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      // eslint-disable-next-line no-new
      new window.google.translate.TranslateElement(
        { pageLanguage: 'mr', includedLanguages: 'en', autoDisplay: false },
        'google_translate_element'
      );
      // Re-apply the saved language on this fresh page load.
      if (cookieTarget() === 'en') applyToCombo('en');
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement('script');
      s.id = SCRIPT_ID;
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      document.body.appendChild(s);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return <div id="google_translate_element" aria-hidden="true" translate="no" />;
}
