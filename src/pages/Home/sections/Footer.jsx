import { Link } from 'react-router-dom';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './Footer.css';

const SOCIALS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/Shivsenaofc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.27c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.9h-2.33v6.98A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/shivsenaofc/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    href: 'https://x.com/Shivsenaofc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.79l-5.31-6.94L4.78 22H1.52l8.02-9.17L1 2h6.95l4.8 6.34L18.244 2zm-2.38 18h1.88L7.27 4H5.26l10.6 16z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@shivsenaofc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23 12a11.34 11.34 0 0 0-.18-2.07 2.88 2.88 0 0 0-2-2c-1.78-.46-8.82-.46-8.82-.46s-7.04 0-8.82.46a2.88 2.88 0 0 0-2 2A11.34 11.34 0 0 0 1 12a11.34 11.34 0 0 0 .18 2.07 2.88 2.88 0 0 0 2 2c1.78.46 8.82.46 8.82.46s7.04 0 8.82-.46a2.88 2.88 0 0 0 2-2A11.34 11.34 0 0 0 23 12zM9.75 15.5v-7l5.85 3.5z" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Channel',
    href: 'https://whatsapp.com/channel/0029Va9nyyVDDmFQ61SOyT1A',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.05 4.91A9.82 9.82 0 0 0 12.02 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.86-7.01zM12.02 20.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.22 8.22 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.15.17-.29.18-.54.06-.25-.12-1.05-.39-2-1.23a7.51 7.51 0 0 1-1.39-1.72c-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31s-.86.84-.86 2.05c0 1.21.88 2.38 1 2.55.12.17 1.73 2.65 4.2 3.72.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useContent(homeContent.footer);

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__inner">

          {/* Brand column */}
          <div className="footer__col footer__col--brand">
            <Link to="/home" className="footer__brand">
              <img src="/logo.png" alt="शिवसेना" className="footer__logo" />
              <div className="footer__brand-text">
                <span className="footer__brand-name">शिवसेना</span>
                <span className="footer__brand-tag">{t.brandTag}</span>
              </div>
            </Link>
            <p className="footer__about">{t.about}</p>

            {/* Official social channels */}
            <ul className="footer__socials" aria-label="Social media">
              {SOCIALS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`footer__social footer__social--${s.id}`}
                    aria-label={s.label}
                    data-cursor="link"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {t.columns?.map((col) => (
            <div key={col.heading} className="footer__col">
              <h4 className="footer__col-title">{col.heading}</h4>
              <ul className="footer__links">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="footer__link" data-cursor="link">
                      <span>{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {t.addresses?.length > 0 && (
        <div className="footer__addresses">
          <div className="footer__inner">
            <ul className="footer__address-list" aria-label="Office addresses">
              {t.addresses.map((addr) => (
                <li key={addr.labelKey} className="footer__address">
                  <svg className="footer__address-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div className="footer__address-text">
                    <span className="footer__address-label">{addr.label}</span>
                    <span className="footer__address-value">{addr.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="footer__bottom">
        <div className="footer__inner">
          <p className="footer__copyright">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
