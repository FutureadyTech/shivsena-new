import './InnovativeBanner.css';

/* Banner now ships with all eyebrow / title / lede artwork baked
   into the image, so the JSX is just the <img>. No overlays, no
   text, no JSON dependency. */
export default function InnovativeBanner() {
  return (
    <section className="inn-banner">
      <img
        src="/banners/InnovativeInitiatives.webp"
        alt=""
        className="inn-banner__image"
      />
    </section>
  );
}
