import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import newsContent from '../../../content/news.json';
import './PhotoGallery.css';

/* Build a sensible filename for the downloaded file uses the photo
 title (slugified) and tries to preserve the source extension. */
function suggestedFilename(photo) {
  const titleSlug = (photo?.title || 'photo')
 .replace(/\s+/g, '-')
 .replace(/[^\w\-ऀ-ॿ]+/g, '')
 .slice(0, 80);
  const cleanSrc = (photo?.src || '').split('?')[0].split('#')[0];
  const m = cleanSrc.match(/\.([a-zA-Z0-9]{2,5})$/);
  const ext = m ? m[1].toLowerCase() : 'jpg';
  return `${titleSlug || 'photo'}.${ext}`;
}

/* Force-download an image. Tries fetch+blob first (so cross-origin
 images still trigger a real download); falls back to a plain
 anchor click, then to opening the source in a new tab. */
async function downloadPhoto(photo) {
  if (!photo?.src) return;
  const filename = suggestedFilename(photo);
  try {
 const res = await fetch(photo.src, { mode: 'cors' });
 if (!res.ok) throw new Error(`HTTP ${res.status}`);
 const blob = await res.blob();
 const objectUrl = URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = objectUrl;
 link.download = filename;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  } catch {
 /* Fallback let the browser handle it directly */
 try {
 const link = document.createElement('a');
 link.href = photo.src;
 link.download = filename;
 link.target = '_blank';
 link.rel = 'noopener noreferrer';
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 } catch {
 window.open(photo.src, '_blank', 'noopener');
 }
  }
}

const DownloadIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
 <polyline points="7 10 12 15 17 10" />
 <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function PhotoGallery() {
  const t = useContent(newsContent.photos);
  const headerRef = useScrollReveal(0.2);
  const items = t.items || [];

  const [activeIdx, setActiveIdx] = useState(null);
  const open  = useCallback((i) => setActiveIdx(i), []);
  const close = useCallback(() => setActiveIdx(null), []);
  const prev  = useCallback(() => setActiveIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length)), [items.length]);
  const next  = useCallback(() => setActiveIdx((i) => (i === null ? null : (i + 1) % items.length)), [items.length]);

  /* Lock body + keyboard nav while lightbox is open */
  useEffect(() => {
 if (activeIdx === null) return;
 const prevOverflow = document.body.style.overflow;
 document.body.style.overflow = 'hidden';
 const onKey = (e) => {
 if (e.key === 'Escape') close();
 if (e.key === 'ArrowLeft')  prev();
 if (e.key === 'ArrowRight') next();
 };
 window.addEventListener('keydown', onKey);
 return () => {
 document.body.style.overflow = prevOverflow;
 window.removeEventListener('keydown', onKey);
 };
  }, [activeIdx, close, prev, next]);

  const activePhoto = activeIdx !== null ? items[activeIdx] : null;
  const downloadLabel = t.downloadLabel || 'फोटो डाउनलोड करा';

  return (
 <section className="pg-section" id="photo-gallery">
 <div className="pg-section__inner">

 <div ref={headerRef} className="pg-section__header reveal">
 <div className="pg-section__eyebrow">
 <span className="pg-section__eyebrow-line" />
 <span>{t.eyebrow}</span>
 </div>
 <h2 className="pg-section__title">{t.title}</h2>
 </div>

 <div className="pg-masonry">
 {items.map((photo, i) => (
 <PhotoTile
 key={photo.id}
 photo={photo}
 index={i}
 onOpen={() => open(i)}
 downloadLabel={downloadLabel}
 />
 ))}
 </div>

 {/* "Download HD Images" CTA — opens the curated Google Drive
     folder of full-resolution photos in a new tab. The Drive URL
     is configured in news.json (`photos.mr.bulkDownloadUrl` /
     `photos.en.bulkDownloadUrl`) so it can be changed without
     touching this file. */}
 {t.bulkDownloadUrl && (
 <div className="pg-section__cta-wrap">
 <a
 href={t.bulkDownloadUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="pg-section__bulk-cta btn"
 >
 <span className="pg-section__bulk-cta-icon" aria-hidden="true">
 {DownloadIcon}
 </span>
 <span>{t.bulkDownloadLabel || 'एचडी फोटो डाउनलोड करा'}</span>
 </a>
 </div>
 )}

 </div>

 {activePhoto && (
 <div className="pg-lightbox" role="dialog" aria-modal="true" onClick={close}>
 <button className="pg-lightbox__close" onClick={close} aria-label="Close">
 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <line x1="18" y1="6" x2="6" y2="18" />
 <line x1="6" y1="6" x2="18" y2="18" />
 </svg>
 </button>

 <button
 className="pg-lightbox__download"
 onClick={(e) => { e.stopPropagation(); downloadPhoto(activePhoto); }}
 aria-label={downloadLabel}
 title={downloadLabel}
 >
 {DownloadIcon}
 </button>

 <button className="pg-lightbox__nav pg-lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous">
 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="15 18 9 12 15 6" />
 </svg>
 </button>

 <figure className="pg-lightbox__frame" onClick={(e) => e.stopPropagation()}>
 <img key={activePhoto.id} src={activePhoto.src} alt={activePhoto.title} className="pg-lightbox__img" />
 <figcaption className="pg-lightbox__caption">
 <span className="pg-lightbox__title">{activePhoto.title}</span>
 <span className="pg-lightbox__counter">{activeIdx + 1} / {items.length}</span>
 </figcaption>
 </figure>

 <button className="pg-lightbox__nav pg-lightbox__nav--next" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next">
 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="9 18 15 12 9 6" />
 </svg>
 </button>
 </div>
 )}
 </section>
  );
}

function PhotoTile({ photo, index, onOpen, downloadLabel }) {
  const ref = useScrollReveal(0.12);
  const handleKey = (e) => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 onOpen();
 }
  };
  return (
 <div
 ref={ref}
 className="pg-tile reveal"
 style={{ '--reveal-delay': `${0.04 + (index % 4) * 0.06}s` }}
 onClick={onOpen}
 onKeyDown={handleKey}
 role="button"
 tabIndex={0}
 aria-label={`Open: ${photo.title}`}
 data-cursor="link"
 >
 <img src={photo.src} alt={photo.title} loading="lazy" className="pg-tile__img" />

 {/* Download button sits in the top-right corner; stops propagation
 so clicking it doesn't also open the lightbox */}
 <button
 type="button"
 className="pg-tile__download"
 onClick={(e) => { e.stopPropagation(); downloadPhoto(photo); }}
 onKeyDown={(e) => e.stopPropagation()}
 aria-label={downloadLabel}
 title={downloadLabel}
 >
 {DownloadIcon}
 </button>

 <div className="pg-tile__overlay" aria-hidden="true">
 <span className="pg-tile__icon">
 <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <circle cx="11" cy="11" r="7" />
 <line x1="21" y1="21" x2="16.65" y2="16.65" />
 <line x1="11" y1="8" x2="11" y2="14" />
 <line x1="8" y1="11" x2="14" y2="11" />
 </svg>
 </span>
 <span className="pg-tile__caption">{photo.title}</span>
 </div>
 </div>
  );
}
