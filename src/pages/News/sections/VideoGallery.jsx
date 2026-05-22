import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import './VideoGallery.css';

export default function VideoGallery() {
  const t = useContent(newsContent.videos);
  const headerRef = useScrollReveal(0.2);
  const [activeVideo, setActiveVideo] = useState(null);

  /* Lock body scroll while modal open + ESC to close */
  useEffect(() => {
    if (!activeVideo) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setActiveVideo(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeVideo]);

  const close = useCallback(() => setActiveVideo(null), []);

  return (
    <section className="vg-section">
      <div className="vg-section__inner">

        <div ref={headerRef} className="vg-section__header reveal">
          <div className="vg-section__eyebrow">
            <span className="vg-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="vg-section__title">{t.title}</h2>
          <p className="vg-section__lede">{t.lede}</p>
        </div>

        <div className="vg-grid">
          {t.items?.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} onPlay={() => setActiveVideo(video)} />
          ))}
        </div>

      </div>

      {activeVideo && (
        <div className="vg-modal" role="dialog" aria-modal="true" onClick={close}>
          <button className="vg-modal__close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="vg-modal__frame" onClick={(e) => e.stopPropagation()}>
            <div className="vg-modal__embed">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="vg-modal__caption">
              <p className="vg-modal__title">{activeVideo.title}</p>
              <p className="vg-modal__meta">{activeVideo.date} · {activeVideo.duration}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function VideoCard({ video, index, onPlay }) {
  const ref = useScrollReveal(0.15);
  return (
    <article
      ref={ref}
      className="vg-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.08}s` }}
    >
      <button className="vg-card__btn" onClick={onPlay} aria-label={`Play: ${video.title}`} data-cursor="link">
        <div className="vg-card__thumb">
          <img src={video.thumbnail} alt="" className="vg-card__img" loading="lazy" />
          <div className="vg-card__shade" aria-hidden="true" />
          <span className="vg-card__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5 V19 L20 12 Z" />
            </svg>
          </span>
          <span className="vg-card__duration">{video.duration}</span>
        </div>
        <div className="vg-card__body">
          <time className="vg-card__date">{video.date}</time>
          <h3 className="vg-card__title">{video.title}</h3>
        </div>
      </button>
    </article>
  );
}
