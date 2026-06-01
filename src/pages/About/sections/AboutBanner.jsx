import './AboutBanner.css';

/* Banner now ships with all eyebrow / title / lede artwork baked
   into the image, so the JSX is just the <img>. No overlays, no
   text, no JSON dependency. */
export default function AboutBanner() {
  return (
    <section className="about-banner">
      <img
        src="/banners/aboutUs.webp"
        alt=""
        className="about-banner__image"
      />
    </section>
  );
}
