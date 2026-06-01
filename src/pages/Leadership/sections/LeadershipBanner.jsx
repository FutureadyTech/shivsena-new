import './LeadershipBanner.css';

/* Banner now ships with all eyebrow / title / lede artwork baked
   into the image, so the JSX is just the <img>. No overlays, no
   text, no JSON dependency. */
export default function LeadershipBanner() {
  return (
    <section className="ldr-banner">
      <img
        src="/banners/leadership.webp"
        alt=""
        className="ldr-banner__image"
      />
    </section>
  );
}
