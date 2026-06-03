import './MahayutiBanner.css';

/* Image-only banner (same pattern as the About Us banner) — the
   eyebrow / title / lede are baked into the artwork, so the JSX is
   just the <img>. No overlays, text, or JSON dependency. */
export default function MahayutiBanner() {
  return (
    <section className="my-banner">
      <img
        src="/banners/mahayuti/%E0%A4%AE%E0%A4%B9%E0%A4%BE%E0%A4%AF%E0%A5%81%E0%A4%A4%E0%A5%80%20banner.webp"
        alt=""
        className="my-banner__image"
      />
    </section>
  );
}
