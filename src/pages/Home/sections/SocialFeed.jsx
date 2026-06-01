import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import { SOCIALS } from '../../../config/socials.js';
import './SocialFeed.css';

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
  instagram: '1e6f21d3-9235-403d-af42-05d53f0b4a51',
  facebook:  '1e6f21d3-9235-403d-af42-05d53f0b4a51',
  twitter:   '1e6f21d3-9235-403d-af42-05d53f0b4a51',
  youtube:   '1e6f21d3-9235-403d-af42-05d53f0b4a51',
};
const ELFSIGHT_SRC = 'https://elfsightcdn.com/platform.js';

const PLATFORMS = ['instagram', 'facebook', 'twitter', 'youtube'];

/* ─── Platform icon set (used in the top-right tab row) ─── */
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
          className="social__placeholder-cta"
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

function InstagramEmbed() {
  return <ElfsightEmbed appId={ELFSIGHT_IDS.instagram} fallbackUrl={SOCIALS.instagram.url} />;
}
function FacebookEmbed() {
  return <ElfsightEmbed appId={ELFSIGHT_IDS.facebook} fallbackUrl={SOCIALS.facebook.url} />;
}
function TwitterEmbed() {
  return <ElfsightEmbed appId={ELFSIGHT_IDS.twitter} fallbackUrl={SOCIALS.twitter.url} />;
}
function YouTubeEmbed() {
  return <ElfsightEmbed appId={ELFSIGHT_IDS.youtube} fallbackUrl={SOCIALS.youtube.url} />;
}

/* ═══════════════════════════════════════════════════════════════ */
export default function SocialFeed() {
  const t = useContent(homeContent.socialFeed);
  const headerRef = useScrollReveal(0.25);
  const widgetRef = useScrollReveal(0.15);

  /* Default to Instagram — the most visual feed. */
  const [activePlatform, setActivePlatform] = useState('instagram');

  return (
    <section className="social">
      <div className="social__inner">
        <div ref={headerRef} className="social__header reveal">
          <div>
            <h2 className="social__title">{t.title}</h2>
          </div>

          {/* Top-right four icons act as tab buttons — clicking
              swaps the feed body below. Active tab gets saffron. */}
          <div className="social__handles" role="tablist" aria-label="Social platforms">
            {PLATFORMS.map((platform) => {
              const isActive = platform === activePlatform;
              return (
                <button
                  key={platform}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="social-feed-body"
                  className={`social__handle ${isActive ? 'social__handle--active' : ''}`}
                  onClick={() => setActivePlatform(platform)}
                  title={SOCIALS[platform]?.name || platform}
                >
                  <PlatformIcon name={platform} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Active platform's native embed.
            The outer wrapper has NO `key` — we want it to stay
            mounted across tab switches so the IntersectionObserver-
            driven `is-revealed` class doesn't get wiped on every
            click (that was the "empty area" bug). The INNER embed
            is keyed by platform instead, so React swaps the
            iframe correctly when you change tabs. */}
        <div
          ref={widgetRef}
          id="social-feed-body"
          className="social__feed-body reveal"
          role="tabpanel"
        >
          <div key={activePlatform} className="social__feed-slot">
            {activePlatform === 'instagram' && <InstagramEmbed />}
            {activePlatform === 'facebook'  && <FacebookEmbed />}
            {activePlatform === 'twitter'   && <TwitterEmbed />}
            {activePlatform === 'youtube'   && <YouTubeEmbed />}
          </div>
        </div>
      </div>
    </section>
  );
}
