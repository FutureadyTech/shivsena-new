import './ShivSenaJanmaBanner.css';

/* Image-only banner — all eyebrow / title / text is baked into the
   artwork, so the JSX is just the <img>. Same approach as the About
   page banner. No overlays, no text, no JSON dependency. */
export default function ShivSenaJanmaBanner() {
  return (
    <section className="ssj-banner">
      <img
        src="/banners/shivsena-janma/shivsena-janma.webp"
        alt=""
        className="ssj-banner__image"
      />
    </section>
  );
}
