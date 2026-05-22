import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './Footer.css';

export default function Footer() {
  const t = useContent(homeContent.footer);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const onNewsletter = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('success');
    setTimeout(() => { setEmail(''); setStatus('idle'); }, 3500);
  };

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

          {/* Newsletter column */}
          {t.newsletter && (
            <div className="footer__col footer__col--newsletter">
              <h4 className="footer__col-title">{t.newsletter.heading}</h4>
              <p className="footer__newsletter-desc">{t.newsletter.description}</p>
              <form className="footer__newsletter-form" onSubmit={onNewsletter}>
                {status === 'success' ? (
                  <p className="footer__newsletter-success">✓ Subscribed</p>
                ) : (
                  <>
                    <input
                      type="email"
                      className="footer__newsletter-input"
                      placeholder={t.newsletter.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="footer__newsletter-btn" data-cursor="link">
                      {t.newsletter.submitLabel}
                    </button>
                  </>
                )}
              </form>
            </div>
          )}

        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__inner">
          <p className="footer__copyright">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
