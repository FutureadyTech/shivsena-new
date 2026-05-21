import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './SocialFeed.css';

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

          <div className="social__handles">
            <a href="#" className="social__handle" aria-label="Instagram"><PlatformIcon name="instagram" /></a>
            <a href="#" className="social__handle" aria-label="Facebook"><PlatformIcon name="facebook" /></a>
            <a href="#" className="social__handle" aria-label="Twitter / X"><PlatformIcon name="twitter" /></a>
            <a href="#" className="social__handle" aria-label="YouTube"><PlatformIcon name="youtube" /></a>
          </div>
        </div>

        <div className="social__grid">
          {t.posts?.map((post, i) => (
            <PostCard key={i} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, index }) {
  const ref = useScrollReveal(0.15);
  return (
    <article
      ref={ref}
      className={`social-card social-card--${post.platform} reveal`}
      style={{ '--reveal-delay': `${0.05 + index * 0.08}s` }}
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
          ></div>
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
    </article>
  );
}