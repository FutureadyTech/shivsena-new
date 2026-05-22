import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import './Speeches.css';

export default function Speeches() {
  const t = useContent(newsContent.speeches);
  const headerRef = useScrollReveal(0.2);
  const [activeSpeech, setActiveSpeech] = useState(null);

  /* Lock body scroll + ESC to close while lightbox is open */
  useEffect(() => {
    if (!activeSpeech) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setActiveSpeech(null); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeSpeech]);

  const close = useCallback(() => setActiveSpeech(null), []);

  return (
    <section className="sp-section" id="speeches">
      <div className="sp-section__inner">

        <div ref={headerRef} className="sp-section__header reveal">
          <div className="sp-section__eyebrow">
            <span className="sp-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="sp-section__title">{t.title}</h2>
          <p className="sp-section__lede">{t.lede}</p>
        </div>

        <div className="sp-grid">
          {t.items?.map((item, i) => (
            <SpeechCard key={item.id} speech={item} index={i} onPlay={() => setActiveSpeech(item)} />
          ))}
        </div>

      </div>

      {activeSpeech && (
        <div className="sp-modal" role="dialog" aria-modal="true" onClick={close}>
          <button className="sp-modal__close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="sp-modal__frame" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal__embed">
              <iframe
                src={`https://www.youtube.com/embed/${activeSpeech.videoId}?autoplay=1&rel=0`}
                title={activeSpeech.title}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="sp-modal__caption">
              <p className="sp-modal__title">{activeSpeech.title}</p>
              <p className="sp-modal__meta">{activeSpeech.date} · {activeSpeech.event} · {activeSpeech.duration}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function SpeechCard({ speech, index, onPlay }) {
  const ref = useScrollReveal(0.15);
  return (
    <article
      ref={ref}
      className="sp-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.08}s` }}
    >
      <button className="sp-card__btn" onClick={onPlay} aria-label={`Play: ${speech.title}`} data-cursor="link">
        <div className="sp-card__thumb">
          <img src={speech.thumbnail} alt="" className="sp-card__img" loading="lazy" />
          <div className="sp-card__shade" aria-hidden="true" />
          <span className="sp-card__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5 V19 L20 12 Z" />
            </svg>
          </span>
          <span className="sp-card__duration">{speech.duration}</span>
        </div>
        <div className="sp-card__body">
          <div className="sp-card__meta">
            <time className="sp-card__date">{speech.date}</time>
            <span className="sp-card__dot" aria-hidden="true">·</span>
            <span className="sp-card__event">{speech.event}</span>
          </div>
          <h3 className="sp-card__title">{speech.title}</h3>
          <p className="sp-card__desc">{speech.description}</p>
        </div>
      </button>
    </article>
  );
}
