import { useEffect, useRef } from 'react';
import './home.css';

/* ─────────────────────────────────────────────────────────────
 HERO BACKGROUND SOURCE TOGGLE
 ─────────────────────────────────────────────────────────────
 Change SOURCE to swap between a local MP4 file and a YouTube
 embed. Everything else (overlays, text, CTAs) stays identical.

 SOURCE = 'mp4' → uses MP4_SRC (default, currently
 /youtube-banner-video.mp4)
 SOURCE = 'youtube'  → uses the YouTube embed for YT_VIDEO_ID

 To switch to the YouTube version:
 1. Set SOURCE to 'youtube' below.
 2. (Optional) Change YT_VIDEO_ID to whatever video the
 client wants it's the part after `watch?v=` in any
 youtube.com URL.
 ───────────────────────────────────────────────────────────── */
const SOURCE = 'mp4'; // 'mp4' | 'youtube'

const MP4_SRC = '/youtube-banner-video.mp4';

const YT_VIDEO_ID = 'c82ukzAhwPg';
const YT_SRC =
  `https://www.youtube-nocookie.com/embed/${YT_VIDEO_ID}` +
  `?autoplay=1&mute=1&loop=1&playlist=${YT_VIDEO_ID}` +
  `&controls=0&modestbranding=1&rel=0&iv_load_policy=3` +
  `&disablekb=1&fs=0&cc_load_policy=0&playsinline=1`;

export default function Hero() {
  const videoRef = useRef(null);

  /* MP4-only performance hooks: pause when off-screen / tab hidden,
 resume when back. Skipped entirely when SOURCE is 'youtube' YouTube manages its own decode lifecycle. */
  useEffect(() => {
 if (SOURCE !== 'mp4') return;
 const v = videoRef.current;
 if (!v) return;
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

 const tryPlay = () => {
 const p = v.play();
 if (p && typeof p.catch === 'function') p.catch(() => {});
 };

 const io = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) tryPlay();
 else if (!v.paused) v.pause();
 },
 { threshold: 0 }
 );
 io.observe(v);

 const onVisibility = () => {
 if (document.hidden) {
 if (!v.paused) v.pause();
 } else {
 const rect = v.getBoundingClientRect();
 const inView = rect.bottom > 0 && rect.top < window.innerHeight;
 if (inView) tryPlay();
 }
 };
 document.addEventListener('visibilitychange', onVisibility);

 tryPlay();

 return () => {
 io.disconnect();
 document.removeEventListener('visibilitychange', onVisibility);
 };
  }, []);

  return (
 <section id="home-hero-banner" className="hero-section">

 {/* ─── BACKGROUND ─── */}
 {SOURCE === 'mp4' ? (
 <video
 ref={videoRef}
 autoPlay
 muted
 loop
 playsInline
 preload="metadata"
 poster="/entrance-banner-v2.webp"
 disablePictureInPicture
 disableRemotePlayback
 className="hero-video"
 tabIndex={-1}
 >
 <source src={MP4_SRC} type="video/mp4" />
 </video>
 ) : (
 <div className="hero-yt-wrap" aria-hidden="true">
 <iframe
 className="hero-yt-iframe"
 src={YT_SRC}
 title="शिवसेना"
 loading="eager"
 allow="autoplay; encrypted-media; picture-in-picture"
 referrerPolicy="strict-origin-when-cross-origin"
 tabIndex={-1}
 />
 {/* Shield catches clicks/hovers so YouTube's player UI never
 has a reason to surface. */}
 <div className="hero-yt-shield" />
 </div>
 )}

 </section>
  );
}
