import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useYouTubeLatest } from '../hooks/useYouTubeLatest.js';
import homeContent from '../../../content/home.json';
import { SOCIALS } from '../../../config/socials.js';
import './SocialFeed.css';

/* ─── Platform icon set (shared) ─── */
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

/* The Behold widget id is wired via a Vite env var (VITE_BEHOLD_WIDGET_ID).
   Get it free at behold.so → Connect Instagram → New Widget.
   If unset, the Instagram tile falls back to the static curated card. */
const BEHOLD_ID = import.meta.env.VITE_BEHOLD_WIDGET_ID || '';

export default function SocialFeed() {
  const t = useContent(homeContent.socialFeed);
  const headerRef = useScrollReveal(0.25);
  const { items: ytItems, loading: ytLoading } = useYouTubeLatest(1);
  const latestYouTube = ytItems[0]; // most recent video

  return (
    <section className="social">
      <div className="social__inner">
        <div ref={headerRef} className="social__header reveal">
          <div>
            <div className="social__eyebrow">
              <span className="social__eyebrow-line"></span>
              <span>{t.eyebrow}</span>
            </div>
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

        <div className="social__grid">
          {t.posts?.map((post, i) => {
            /* Override the YouTube tile with live data if we have it */
            if (post.platform === 'youtube' && latestYouTube) {
              return (
                <PostCard
                  key={`yt-live-${latestYouTube.id}`}
                  post={{
                    ...post,
                    type: 'video',
                    image: latestYouTube.thumbnail,
                    caption: latestYouTube.title,
                    handle: SOCIALS.youtube.handle,
                    meta: 'Latest video',
                    time: formatRelative(latestYouTube.publishedAt),
                  }}
                  href={latestYouTube.url}
                  isLive
                  index={i}
                />
              );
            }
            /* Instagram with Behold widget configured → render embed */
            if (post.platform === 'instagram' && BEHOLD_ID) {
              return (
                <BeholdCard key={`ig-${i}`} widgetId={BEHOLD_ID} post={post} index={i} />
              );
            }
            /* All other cards (FB, X, IG-fallback, YT-fallback) — same
               beautiful card design but now wrapped in a real link to
               the official profile. */
            return (
              <PostCard
                key={i}
                post={post}
                href={SOCIALS[post.platform]?.url || '#'}
                index={i}
                isLive={post.platform === 'youtube' && ytLoading}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Tile (now anchored as a real link) ─────────────────── */
function PostCard({ post, href = '#', index, isLive }) {
  const ref = useScrollReveal(0.15);
  return (
    <a
      ref={ref}
      href={href}
      target={href === '#' ? undefined : '_blank'}
      rel={href === '#' ? undefined : 'noopener noreferrer'}
      className={`social-card social-card--${post.platform} reveal`}
      style={{ '--reveal-delay': `${0.05 + index * 0.08}s` }}
      data-cursor="link"
    >
      {post.type === 'text' ? (
        <div className="social-card__quote">
          <span className="social-card__quote-mark">"</span>
          <p className="social-card__quote-text">{post.caption.replace(/^"|"$/g, '')}</p>
        </div>
      ) : (
        <div className="social-card__media">
          <div
            className="social-card__image"
            style={{ backgroundImage: `url(${post.image})` }}
          />
          {post.type === 'video' && (
            <div className="social-card__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8 5 L8 19 L20 12 Z" />
              </svg>
            </div>
          )}
        </div>
      )}

      <div className="social-card__badge" aria-hidden="true">
        <PlatformIcon name={post.platform} />
      </div>

      {isLive && (
        <span className="social-card__live" aria-label="Live data">
          <span className="social-card__live-dot" />
          LIVE
        </span>
      )}

      <div className="social-card__body">
        <div className="social-card__handle">{post.handle}</div>
        {post.type !== 'text' && (
          <p className="social-card__caption">{post.caption}</p>
        )}
        <div className="social-card__meta">
          <span>{post.meta}</span>
          <span className="social-card__dot"></span>
          <span>{post.time}</span>
        </div>
      </div>
    </a>
  );
}

/* ─── Instagram via Behold ───────────────────────────────────
   Drops Behold's tiny script + their widget element. They handle
   the OAuth & post fetching on their backend. Free tier = up to
   9 posts, no watermark. */
function BeholdCard({ widgetId, post, index }) {
  const ref = useScrollReveal(0.15);
  return (
    <a
      ref={ref}
      href={SOCIALS.instagram.url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-card social-card--instagram social-card--behold reveal"
      style={{ '--reveal-delay': `${0.05 + index * 0.08}s` }}
      data-cursor="link"
    >
      <div className="social-card__behold">
        {/* eslint-disable-next-line react/no-unknown-property */}
        <behold-widget widget-id={widgetId}></behold-widget>
      </div>
      <div className="social-card__badge" aria-hidden="true">
        <PlatformIcon name="instagram" />
      </div>
      <span className="social-card__live" aria-label="Live data">
        <span className="social-card__live-dot" />
        LIVE
      </span>
      <div className="social-card__body">
        <div className="social-card__handle">{post.handle || SOCIALS.instagram.handle}</div>
      </div>
    </a>
  );
}

/* ─── Helpers ───────────────────────────────────────────────── */
function formatRelative(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const seconds = Math.max(1, Math.floor((now - then) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
