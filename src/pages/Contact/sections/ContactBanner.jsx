import './ContactBanner.css';

/* Image-only banner — all eyebrow / title / text is baked into the
   artwork, so the JSX is just the <img>. Same approach as the About
   page banner. No overlays, no text, no JSON dependency. */
export default function ContactBanner() {
  return (
    <section className="contact-banner">
      <img
        src="/banners/contact/contact.webp"
        alt=""
        className="contact-banner__image"
      />
    </section>
  );
}
