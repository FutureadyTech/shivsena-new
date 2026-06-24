import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import homeContent from '../../../content/home.json';
import { SOCIALS } from '../../../config/socials.js';
import './SocialFeed.css';

/* ─── Feed on/off switch ───────────────────────────────────────
   Elfsight's free plan counts a "view" every time a widget loads.
   This toggle lets us keep the feeds OFF by default so we don't burn
   the monthly view quota; when OFF we render NOTHING from Elfsight
   (no platform.js, no widget div) so zero views are consumed. The
   choice is remembered per-browser in localStorage. */
const FEEDS_KEY = 'SHIVSENA_FEEDS_ON';
function readFeedsOn() {
  if (typeof window === 'undefined') return false;
  try { return window.localStorage.getItem(FEEDS_KEY) === '1'; } catch { return false; }
}

/* ═══════════════════════════════════════════════════════════════
   SOCIAL FEED  (per-platform native embeds)

   Top-right four icons are TAB BUTTONS — clicking one swaps the
   feed underneath to that platform's NATIVE embed (no Elfsight):
     - Instagram → Behold.so <behold-widget>
     - Facebook  → Facebook Page Plugin iframe
     - X / Twitter → Twitter Timeline widget
     - YouTube   → YouTube channel uploads playlist iframe

   See EMBED_CONFIG below to fill in the per-platform IDs/handles.
═══════════════════════════════════════════════════════════════ */

/* ─── Per-platform Elfsight widget IDs ─────────────────────
   Each tab embeds an Elfsight Social-Feed widget. All four
   currently point at the same widget — the original aggregated
   feed. To split them, create a separate Elfsight widget per
   platform (one filtered to Instagram, one to Facebook, etc.)
   and paste each widget's app-ID below. */
const ELFSIGHT_IDS = {
  instagram: '4bc21124-90e5-49a7-81c0-a37e15c40786',
  facebook:  '4bc21124-90e5-49a7-81c0-a37e15c40786',
  twitter:   '667cbb45-fd67-4956-804f-ca099fde336d',
  youtube:   '271e47c0-41d6-4b93-b5f5-5aa68491343c',
};
const ELFSIGHT_SRC = 'https://elfsightcdn.com/platform.js';

/* ─── Platform icon set (used as the per-column header label) ─── */
const PlatformIcon = ({ name }) => {
  const ICONS = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21V13.5h2.7l.4-3.3h-3.1V8.1c0-1 .3-1.7 1.7-1.7h1.8V3.4c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.5H7.3v3.3h2.7V21h3.5z" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3-5.2 3z" />
      </svg>
    ),
  };
  return ICONS[name] || null;
};

/* ─── Reusable "feed unavailable" placeholder ────────────── */
function PlatformPlaceholder({ message, ctaHref, ctaLabel }) {
  return (
    <div className="social__placeholder">
      <p className="social__placeholder-msg">{message}</p>
      {ctaHref && (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="social__placeholder-cta btn"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
}

/* ─── Inject Elfsight loader script once ─────────────────── */
function useElfsight() {
  useEffect(() => {
    if (document.querySelector(`script[src="${ELFSIGHT_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = ELFSIGHT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

/* ─── Generic Elfsight embed (one component, per-platform IDs) ─── */
function ElfsightEmbed({ appId, fallbackUrl }) {
  useElfsight();
  if (!appId) {
    return (
      <PlatformPlaceholder
        message="Social feed will appear here once an Elfsight widget ID is configured for this platform."
        ctaHref={fallbackUrl}
        ctaLabel="Open profile"
      />
    );
  }
  /* The Elfsight platform.js loader scans the DOM for class names
     like `elfsight-app-<APP_ID>` and mounts each configured widget. */
  return (
    <div className="social__embed">
      <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
    </div>
  );
}

/* Columns shown side-by-side, in display order. */
const FEEDS = [
  { key: 'facebook',  label: 'फेसबुक',       labelEn: 'Facebook' },
  { key: 'instagram', label: 'इन्स्टाग्राम', labelEn: 'Instagram' },
  { key: 'youtube',   label: 'यूट्यूब',      labelEn: 'YouTube' },
  { key: 'twitter',   label: 'ट्विटर',       labelEn: 'Twitter' },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function SocialFeed() {
  const t = useContent(homeContent.socialFeed);
  const { lang } = useLanguage();
  const headerRef = useScrollReveal(0.25);
  const gridRef = useScrollReveal(0.15);

  const [feedsOn, setFeedsOn] = useState(() => readFeedsOn());
  const toggleFeeds = () => setFeedsOn((prev) => {
    const next = !prev;
    try { window.localStorage.setItem(FEEDS_KEY, next ? '1' : '0'); } catch { /* ignore */ }
    return next;
  });

  const isMr = lang === 'mr';
  const toggleLabel = feedsOn
    ? (isMr ? 'लाइव्ह फीड बंद करा' : 'Turn live feeds off')
    : (isMr ? 'लाइव्ह फीड दाखवा' : 'Show live feeds');
  const offMsg = isMr
    ? 'लाइव्ह फीड सध्या बंद आहे. प्रोफाइल पाहण्यासाठी क्लिक करा.'
    : 'Live feed is off. Click to view the profile.';
  const ctaLabel = isMr ? 'प्रोफाइल उघडा' : 'Open profile';

  return (
    <section className="social">
      <div className="social__inner">
        <div ref={headerRef} className="social__header reveal">
          <div>
            <h2 className="social__title">{t.title}</h2>
          </div>

          {/* On/off switch — keeps Elfsight view-quota usage at zero
              while feeds are off (nothing from Elfsight is rendered). */}
          <button
            type="button"
            className={`social__toggle ${feedsOn ? 'is-on' : ''}`}
            onClick={toggleFeeds}
            aria-pressed={feedsOn}
            title={toggleLabel}
          >
            <span className="social__toggle-track"><span className="social__toggle-knob" /></span>
            <span className="social__toggle-text">{toggleLabel}</span>
          </button>
        </div>

        {/* All four feeds shown together, one column each. */}
        <div ref={gridRef} className="social__grid reveal">
          {FEEDS.map(({ key, label, labelEn }) => (
            <div key={key} className={`social__col social__col--${key}`}>
              <div className="social__col-head">
                <span className="social__col-icon"><PlatformIcon name={key} /></span>
                <span className="social__col-label">{isMr ? label : labelEn}</span>
              </div>
              <div className="social__col-feed">
                {feedsOn ? (
                  <ElfsightEmbed appId={ELFSIGHT_IDS[key]} fallbackUrl={SOCIALS[key]?.url} />
                ) : (
                  <PlatformPlaceholder message={offMsg} ctaHref={SOCIALS[key]?.url} ctaLabel={ctaLabel} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
