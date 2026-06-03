import './NewsBanner.css';

/* Image-only banner — all eyebrow / title / text is baked into the
   artwork, so the JSX is just the <img>. Same approach as the About
   page banner. No overlays, no text, no JSON dependency. */
export default function NewsBanner() {
  return (
    <section className="news-banner">
      <img
        src="/banners/media/media-resource.webp"
        alt=""
        className="news-banner__image"
      />
    </section>
  );
}
