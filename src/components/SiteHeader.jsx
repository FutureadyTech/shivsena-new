import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';

const NAV = [
  { to: '/home',       key: 'nav-home' },
  { to: '/about',      key: 'nav-about' },
  { to: '/news',       key: 'nav-news' },
  { to: '/leadership', key: 'nav-leadership' },
  { to: '/members',    key: 'nav-members' },
];

export default function SiteHeader() {
  const t = useT();
  const { pathname } = useLocation();

  // Toggle a body class while the dark hero is in view, so the header
  // can swap between light (default) and dark style based on background.
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if (!hero) {
      document.body.classList.remove('has-dark-hero-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle('has-dark-hero-visible', entry.isIntersecting);
      },
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(hero);

    return () => {
      observer.disconnect();
      document.body.classList.remove('has-dark-hero-visible');
    };
  }, [pathname]);

  return (
    <header className="site-nav">
      <NavLink to="/home" className="site-nav__brand">
        <img src="/logo.png" alt="शिवसेना" className="site-nav__logo" />
        <div className="site-nav__brand-text">
          <span className="site-nav__brand-name">शिवसेना</span>
          <span className="site-nav__brand-tagline">{t('brand-tagline-home')}</span>
        </div>
      </NavLink>

      <nav className="site-nav__menu">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
            }
          >
            {t(item.key)}
          </NavLink>
        ))}
      </nav>

      <a href="#join" className="site-nav__cta">
        <span>{t('nav-join')}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </a>
      <LanguageToggle />

    </header>
    
  );
}