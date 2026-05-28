import { useEffect, useRef } from 'react';
import { useContent } from '../../../content/_shared/useContent.js';
import mahayutiContent from '../../../content/mahayuti.json';
import './MahayutiArticle.css';

/* Long-form editorial article that renders the Mahayuti story
   straight from mahayuti.json — no invented sections, just the
   four paragraphs from the source doc interleaved with imagery
   and a verbatim pull-quote from Balasaheb. */
export default function MahayutiArticle() {
  const t = useContent(mahayutiContent.article);
  const rootRef = useRef(null);

  // Stagger the in-view reveal of every .reveal child once the
  // root crosses the viewport — keeps the page feeling alive
  // without needing a ref per element.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-revealed');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -60px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, []);

  const paragraphs = Array.isArray(t.paragraphs) ? t.paragraphs : [];

  return (
    <section className="my-article" ref={rootRef}>
      {/* Soft ornamental background — diya glow + paper grain */}
      <div className="my-article__bg" aria-hidden="true">
        <div className="my-article__glow my-article__glow--tl" />
        <div className="my-article__glow my-article__glow--br" />
      </div>

      <div className="my-article__inner">
        {/* Devanagari ornament header */}
        <header className="my-article__header reveal">
          <span className="my-article__orn" aria-hidden="true">॥</span>
          <span className="my-article__kicker">
            {mahayutiContent.banner?.mr?.eyebrow?.replace(/॥/g, '').trim() || 'महायुती'}
          </span>
          <span className="my-article__orn" aria-hidden="true">॥</span>
        </header>

        {/* ── Paragraph 1: opening with drop cap ── */}
        {paragraphs[0] && (
          <p className="my-article__para my-article__para--lead reveal">
            <span className="my-article__dropcap" aria-hidden="true">
              {paragraphs[0].charAt(0)}
            </span>
            {paragraphs[0].slice(1)}
          </p>
        )}

        {/* ── Twin portrait band: Balasaheb + Dharmaveer ── */}
        <figure className="my-article__band reveal">
          <div className="my-article__band-item">
            <div className="my-article__band-frame">
              <img
                src="/leaders/thackeray.jpg"
                alt="हिंदुहृदयसम्राट बाळासाहेब ठाकरे"
                loading="lazy"
              />
              <span className="my-article__band-overlay" />
            </div>
            <figcaption>
              <span className="my-article__band-tag">१९८९ · पाया</span>
              <span className="my-article__band-name">
                हिंदुहृदयसम्राट बाळासाहेब ठाकरे
              </span>
            </figcaption>
          </div>
          <div className="my-article__band-item">
            <div className="my-article__band-frame">
              <img
                src="/leaders/dharmaveer.jpg"
                alt="धर्मवीर आनंद दिघे"
                loading="lazy"
              />
              <span className="my-article__band-overlay" />
            </div>
            <figcaption>
              <span className="my-article__band-tag">वारसा · विचार</span>
              <span className="my-article__band-name">
                धर्मवीर आनंद दिघे
              </span>
            </figcaption>
          </div>
        </figure>

        {/* ── Paragraph 2 ── */}
        {paragraphs[1] && (
          <p className="my-article__para reveal">{paragraphs[1]}</p>
        )}

        {/* ── Pull quote — Balasaheb's verbatim line ── */}
        {t.pullQuote && (
          <blockquote className="my-article__quote reveal">
            <span className="my-article__quote-mark" aria-hidden="true">“</span>
            <p className="my-article__quote-text">{t.pullQuote}</p>
            {t.pullQuoteAuthor && (
              <footer className="my-article__quote-author">
                {t.pullQuoteAuthor}
              </footer>
            )}
          </blockquote>
        )}

        {/* ── Paragraph 3 with Shinde portrait floated ── */}
        {paragraphs[2] && (
          <div className="my-article__float reveal">
            <figure className="my-article__float-figure">
              <div className="my-article__float-frame">
                <img
                  src="/06eknath-shinde.webp"
                  alt="श्री एकनाथ शिंदे"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <span className="my-article__float-tag">२०२२ · नवे नेतृत्व</span>
                <span className="my-article__float-name">श्री एकनाथ शिंदे</span>
              </figcaption>
            </figure>
            <p className="my-article__para my-article__para--wrap">
              {paragraphs[2]}
            </p>
          </div>
        )}

        {/* ── Cinematic hero image for 2024 victory ── */}
        <figure className="my-article__hero reveal">
          <img
            src="/new-imgs/mumbai_-maharashtra-cm-eknath-shinde-with-rebel-shiv-sena-mlas-during-the-specia-.webp"
            alt="महायुती — शिवसेना, भाजप व राष्ट्रवादी काँग्रेस"
            loading="lazy"
          />
          <figcaption>
            <span className="my-article__hero-year">२०२४</span>
            <span className="my-article__hero-line">
              महायुतीला महाराष्ट्राचा भरभरुन कौल
            </span>
          </figcaption>
        </figure>

        {/* ── Paragraph 4 — closing ── */}
        {paragraphs[3] && (
          <p className="my-article__para my-article__para--close reveal">
            {paragraphs[3]}
          </p>
        )}

        {/* ── Closing flourish ── */}
        <div className="my-article__flourish reveal" aria-hidden="true">
          <span className="my-article__flourish-line" />
          <span className="my-article__flourish-mark">॥</span>
          <span className="my-article__flourish-line" />
        </div>
      </div>
    </section>
  );
}
