import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import contactContent from '../../../content/contact.json';
import './MapSection.css';

export default function MapSection() {
  const t = useContent(contactContent.map);
  const headerRef = useScrollReveal(0.2);
  const mapRef    = useScrollReveal(0.15);

  return (
    <section className="map-section">
      <div className="map-section__inner">

        <div ref={headerRef} className="map-section__header reveal">
          <div className="map-section__eyebrow">
            <span className="map-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="map-section__title">{t.title}</h2>
          <p className="map-section__lede">{t.lede}</p>
        </div>

        <div ref={mapRef} className="map-frame reveal">
          <div className="map-frame__embed">
            <iframe
              src={t.embedSrc}
              title="Shiv Sena Central Office Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <a
            href={t.directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="map-frame__directions"
            data-cursor="link"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="21 10 3 14 11 14 12 22 21 10" />
            </svg>
            {t.directionsLabel}
          </a>
        </div>

      </div>
    </section>
  );
}
