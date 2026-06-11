import './MahayutiBanner.css';

/* Image-only banner (same pattern as the About Us banner) — the
   eyebrow / title / lede are baked into the artwork, so the JSX is
   just the <img>. No overlays, text, or JSON dependency. */
export default function MahayutiBanner() {
  return (
    <section className="my-banner">
      <img
        src="/banners/mahayuti/mahayuti-banner.jpeg"
        alt=""
        className="my-banner__image"
      />
    </section>
  );
}
