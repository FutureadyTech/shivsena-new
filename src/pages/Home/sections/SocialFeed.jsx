import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import { SOCIALS } from '../../../config/socials.js';
import './SocialFeed.css';

/* ═══════════════════════════════════════════════════════════════
   SOCIAL FEED  (Elfsight)

   The dummy hand-curated grid was replaced with a live Elfsight
   "Social Feed" widget that pulls real posts from the official
   handles configured on Elfsight's dashboard.

   To swap the widget later, update ELFSIGHT_APP_ID below — that's
   the only thing you need to change on the React side. Adjust the
   feed contents from the Elfsight dashboard, not from this file.
═══════════════════════════════════════════════════════════════ */

const ELFSIGHT_APP_ID = '1e6f21d3-9235-403d-af42-05d53f0b4a51';
const ELFSIGHT_SRC = 'https://elfsightcdn.com/platform.js';

/* Inject Elfsight's loader script once, no matter how many widgets
   live on the page. Subsequent mounts piggyback on the same script. */
function useElfsight() {
  useEffect(() => {
    if (document.querySelector(`script[src="${ELFSIGHT_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = ELFSIGHT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);
}

/* ─── Platform icon set (used in the top-right handle row) ─── */
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

export default function SocialFeed() {
  const t = useContent(homeContent.socialFeed);
  const headerRef = useScrollReveal(0.25);
  const widgetRef = useScrollReveal(0.15);

  useElfsight();

  return (
    <section className="social">
      <div className="social__inner">
        <div ref={headerRef} className="social__header reveal">
          <div>
            <h2 className="social__title">{t.title}</h2>
          </div>

          {/* Top-right small icon row — links to all 4 official handles */}
          <div className="social__handles">
            <a
              href={SOCIALS.instagram.url}
              className="social__handle"
              aria-label={SOCIALS.instagram.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlatformIcon name="instagram" />
            </a>
            <a
              href={SOCIALS.facebook.url}
              className="social__handle"
              aria-label={SOCIALS.facebook.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlatformIcon name="facebook" />
            </a>
            <a
              href={SOCIALS.twitter.url}
              className="social__handle"
              aria-label={SOCIALS.twitter.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlatformIcon name="twitter" />
            </a>
            <a
              href={SOCIALS.youtube.url}
              className="social__handle"
              aria-label={SOCIALS.youtube.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlatformIcon name="youtube" />
            </a>
          </div>
        </div>

        {/* Elfsight widget. The platform.js loader (injected by
            useElfsight above) scans the DOM for `.elfsight-app-*`
            classes and mounts the configured feed into them. */}
        <div ref={widgetRef} className="social__elfsight reveal">
          <div
            className={`elfsight-app-${ELFSIGHT_APP_ID}`}
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </section>
  );
}
