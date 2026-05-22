import { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';

/* ─── Nav structure ─────────────────────────────────────────────
   Items can be a plain link OR a parent with `children` (dropdown).
   Children are rendered as a submenu under the parent on hover/focus. */
const NAV = [
  { to: '/home',         key: 'nav-home' },
  {
    key: 'nav-about',
    to: '/about',
    children: [
      { to: '/leadership',       key: 'nav-leadership' },
      { to: '/about#affiliated', key: 'nav-affiliated' },
    ],
  },
  { to: '/leadership',   key: 'nav-leadership' },
  {
    key: 'nav-news',
    to: '/news',
    children: [
      { to: '/news#press-releases', key: 'nav-press' },
      { to: '/news#interviews',     key: 'nav-interviews' },
      { to: '/news#speeches',       key: 'nav-speeches' },
      { to: '/news#gallery',        key: 'nav-gallery' },
    ],
  },
  { to: '/innovative',   key: 'nav-innovative' },
  { to: '/members',      key: 'nav-members' },
  { to: '/contact',      key: 'nav-contact' },
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
        {NAV.map((item) =>
          item.children ? (
            <NavDropdown key={item.key} item={item} t={t} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `site-nav__link ${isActive ? 'site-nav__link--active' : ''}`
              }
            >
              {t(item.key)}
            </NavLink>
          )
        )}
      </nav>

      <NavLink to="/contact" className="site-nav__cta">
        <span>{t('nav-join')}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </NavLink>
      <LanguageToggle />

    </header>
  );
}

/* ────────────────────────────────────────────────────────────────
   Dropdown — opens on hover (desktop) AND on click/focus (a11y).
   Closes when clicking outside or pressing Escape.
─────────────────────────────────────────────────────────────────── */
function NavDropdown({ item, t }) {
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Parent counts as "active" if any of its children's paths match.
  const isParentActive =
    pathname === item.to ||
    item.children.some((c) => {
      const [path] = c.to.split('#');
      return pathname === path;
    });

  // Close when path changes (after clicking a sub-link)
  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  // Click-outside + Escape to close
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Hover with a tiny grace period so the user can move into the panel
  const handleEnter = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimerRef.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={wrapperRef}
      className={`site-nav__dropdown ${open ? 'is-open' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <NavLink
        to={item.to}
        className={`site-nav__link site-nav__link--has-children ${
          isParentActive ? 'site-nav__link--active' : ''
        }`}
        onClick={(e) => {
          // On touch / no-hover devices, the first tap should open the menu
          // rather than navigate. Once open, a second tap on the parent
          // proceeds to the parent route.
          if (!window.matchMedia('(hover: hover)').matches && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {t(item.key)}
        <svg
          className="site-nav__caret"
          viewBox="0 0 12 12"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 5 6 8 9 5" />
        </svg>
      </NavLink>

      <div className="site-nav__submenu" role="menu">
        {item.children.map((child) => (
          <NavLink
            key={child.to}
            to={child.to}
            className={({ isActive }) =>
              `site-nav__sublink ${isActive ? 'site-nav__sublink--active' : ''}`
            }
            role="menuitem"
          >
            <span className="site-nav__sublink-dot" aria-hidden="true" />
            <span>{t(child.key)}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
