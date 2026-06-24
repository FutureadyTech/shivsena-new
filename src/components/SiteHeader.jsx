import { useEffect, useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useT } from '../i18n/LanguageContext.jsx';
import NotificationsBell from './NotificationsBell.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import './SiteHeader.css';

/* ─── Nav structure ─────────────────────────────────────────────
   Items can be a plain link OR a parent with `children` (dropdown).
   Children are rendered as a submenu under the parent on hover/focus. */
const NAV = [
  { to: '/home', key: 'nav-home' },
  {
    key: 'nav-about',
    children: [
      { to: '/shivsena-janma', key: 'nav-shivsena-janma' },
      { to: '/about#history',  key: 'nav-timeline' },
      { to: '/about#affiliated', key: 'nav-about-party' },
      { to: '/mahayuti',       key: 'nav-mahayuti' },
    ],
  },
  {
    key: 'nav-leadership',
    to: '/leadership',
    children: [
      { to: '/leadership#topLeader',                key: 'nav-lead-topLeader' },
      { to: '/leadership#ministers',                key: 'nav-lead-ministers' },
      { to: '/leadership#mp',                       key: 'nav-lead-mp' },
      { to: '/leadership#mla',                      key: 'nav-lead-mla' },
      { to: '/leadership#mlc',                      key: 'nav-lead-mlc' },
      { to: '/leadership#leaders',                  key: 'nav-lead-leaders' },
      { to: '/leadership#deputyLeaders',            key: 'nav-lead-deputyLeaders' },
      { to: '/leadership#spokespersons',            key: 'nav-lead-spokespersons' },
      { to: '/leadership#generalSecretary',         key: 'nav-lead-generalSecretary' },
      { to: '/leadership#secretaries',              key: 'nav-lead-secretaries' },
      { to: '/leadership#coSecretaries',            key: 'nav-lead-coSecretaries' },
      { to: '/leadership#treasurer',                key: 'nav-lead-treasurer' },
      { to: '/leadership#coordinators',             key: 'nav-lead-coordinators' },
      { to: '/leadership#divisionalContactHeads',   key: 'nav-lead-divisionalContactHeads' },
      { to: '/leadership#divisionalCoContactHeads', key: 'nav-lead-divisionalCoContactHeads' },
      { to: '/leadership#lokSabhaContactHead',      key: 'nav-lead-lokSabhaContactHead' },
      { to: '/leadership#yuvaSena',                 key: 'nav-lead-yuvaSena' },
      { to: '/leadership#socialMedia',              key: 'nav-lead-socialMedia' },
      { to: '/leadership#districtHead',             key: 'nav-lead-districtHead' },
      { to: '/leadership#womenDistrictHeads',       key: 'nav-lead-womenDistrictHeads' },
    ],
  },
  { to: '/innovative', key: 'nav-innovative' },
  {
    key: 'nav-news',
    to: '/news',
    children: [
      { to: '/news#press-releases',     key: 'nav-press' },
      { to: '/news#appointment-letters', key: 'nav-appointments' },
      { to: '/news#speeches',           key: 'nav-speeches' },
      { to: '/news#interviews',         key: 'nav-interviews' },
      { to: '/news#articles',           key: 'nav-articles' },
      { to: '/news#news',               key: 'nav-news-item' },
      { to: '/news#video-gallery',      key: 'nav-video-gallery' },
      { to: '/news#photo-gallery',      key: 'nav-photo-gallery' },
    ],
  },
  { to: '/declarations', key: 'nav-declarations' },
  { to: '/contact', key: 'nav-contact' },
];

export default function SiteHeader() {
  const t = useT();
  const { pathname, hash } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  /* Close mobile menu on every navigation (path or hash change). */
  useEffect(() => { setMobileOpen(false); }, [pathname, hash]);

  /* Lock body scroll + listen for Escape while menu is open. */
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    /* Pages use Lenis smooth-scroll, which ignores body overflow:hidden.
       Pause it so the page behind the menu can't scroll; the drawer itself
       scrolls natively (it carries data-lenis-prevent). */
    try { window.__lenis?.stop(); } catch {}
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      try { window.__lenis?.start(); } catch {}
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className={`site-nav ${mobileOpen ? 'site-nav--mobile-open' : ''}`}>
        <NavLink to="/home" className="site-nav__brand" aria-label="शिवसेना">
          <img src="/Logos/header-logo.png" alt="शिवसेना" className="site-nav__logo" />
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

        <NavLink to="/shivsena-live" className="site-nav__live btn">
          <span className="site-nav__live-dot" aria-hidden="true" />
          <span>{t('nav-live')}</span>
        </NavLink>

        <div className="site-nav__utils">
          <NotificationsBell />
          <LanguageToggle />
        </div>

        {/* ───────── MOBILE HAMBURGER (only visible < 1024px) ───────── */}
        <button
          type="button"
          className={`site-nav__burger ${mobileOpen ? 'is-open' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'मेनू बंद करा' : 'मेनू उघडा'}
          aria-expanded={mobileOpen}
          aria-controls="site-mobile-menu"
        >
          <span className="site-nav__burger-line" />
          <span className="site-nav__burger-line" />
          <span className="site-nav__burger-line" />
        </button>
      </header>

      {/* MOBILE MENU — rendered OUTSIDE the header so its
          position:fixed isn't constrained by the header's
          backdrop-filter / transform stacking context. */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        t={t}
      />
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   Mobile overlay menu — full-screen slide-in from the right.
   Each top-level NAV entry becomes a large bold row with a
   saffron ornament. Parents with children render as accordions
   that open inline. Bottom of the panel carries language toggle,
   the LIVE link, and a closing Devanagari ornament.
─────────────────────────────────────────────────────────────── */
function MobileMenu({ open, onClose, t }) {
  const { pathname, hash } = useLocation();
  const [expandedKey, setExpandedKey] = useState(null);

  /* Auto-expand the parent of the current route so the open path is
     visible the moment the user pulls up the menu. */
  useEffect(() => {
    if (!open) return;
    const matching = NAV.find(
      (item) => item.children && item.children.some((c) => c.to.split('#')[0] === pathname)
    );
    if (matching) setExpandedKey(matching.key);
  }, [open, pathname]);

  return (
    <>
      <div
        className={`site-mobile__backdrop ${open ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="site-mobile-menu"
        className={`site-mobile ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        data-lenis-prevent
      >
        {/* Decorative saffron glows + Devanagari watermark */}
        <span className="site-mobile__glow site-mobile__glow--tl" aria-hidden="true" />
        <span className="site-mobile__glow site-mobile__glow--br" aria-hidden="true" />
        <span className="site-mobile__watermark" aria-hidden="true">॥</span>

        <div className="site-mobile__inner">

          <nav className="site-mobile__nav">
            <ol className="site-mobile__list">
              {NAV.map((item, i) => {
                const hasChildren = !!item.children;
                const isExpanded = expandedKey === item.key;
                const [parentPath] = (item.to || '').split('#');
                const isParentActive = pathname === parentPath ||
                  (hasChildren && item.children.some((c) => c.to.split('#')[0] === pathname));

                return (
                  <li
                    key={item.key}
                    className={`site-mobile__item ${isExpanded ? 'is-expanded' : ''}`}
                    style={{ '--item-delay': `${0.18 + i * 0.05}s` }}
                  >
                    <div className="site-mobile__row">
                      {item.to ? (
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `site-mobile__link ${isActive || isParentActive ? 'is-active' : ''}`
                          }
                          onClick={(e) => {
                            if (hasChildren) {
                              /* Tap on parent first opens the accordion;
                                 second tap follows the parent link. */
                              if (!isExpanded) {
                                e.preventDefault();
                                setExpandedKey(item.key);
                                return;
                              }
                            }
                            onClose();
                          }}
                        >
                          <span>{t(item.key)}</span>
                        </NavLink>
                      ) : (
                        /* No `to` (e.g. पक्ष) — pure accordion toggle, no navigation. */
                        <button
                          type="button"
                          className={`site-mobile__link ${isParentActive ? 'is-active' : ''}`}
                          onClick={() => setExpandedKey(isExpanded ? null : item.key)}
                        >
                          <span>{t(item.key)}</span>
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <ul className="site-mobile__sublist" aria-hidden={!isExpanded}>
                        {item.children.map((child) => {
                          const [childPath, childHash = ''] = child.to.split('#');
                          const isChildActive =
                            pathname === childPath &&
                            hash === (childHash ? `#${childHash}` : '');
                          return (
                            <li key={child.to} className="site-mobile__subitem">
                              <NavLink
                                to={child.to}
                                className={`site-mobile__sublink ${isChildActive ? 'is-active' : ''}`}
                                onClick={onClose}
                              >
                                <span className="site-mobile__subdot" aria-hidden="true" />
                                <span>{t(child.key)}</span>
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <footer className="site-mobile__foot">
            <NavLink
              to="/shivsena-live"
              className="site-mobile__live btn"
              onClick={onClose}
            >
              <span className="site-mobile__live-dot" aria-hidden="true" />
              <span>{t('nav-live')}</span>
            </NavLink>
            <div className="site-mobile__lang">
              <NotificationsBell />
              <LanguageToggle />
            </div>
          </footer>

          <span className="site-mobile__closer-ornament" aria-hidden="true">॥</span>
        </div>
      </aside>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────
   Dropdown opens on hover (desktop) AND on click/focus (a11y).
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
      {(() => {
        const caret = (
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
        );
        const cls = `site-nav__link site-nav__link--has-children ${
          isParentActive ? 'site-nav__link--active' : ''
        }`;
        /* Parent with NO `to` (e.g. पक्ष) is a pure dropdown trigger —
           render a button so it never navigates. */
        if (!item.to) {
          return (
            <button
              type="button"
              className={cls}
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {t(item.key)}
              {caret}
            </button>
          );
        }
        return (
          <NavLink
            to={item.to}
            className={cls}
            onClick={(e) => {
              // On touch / no-hover devices, the first tap should open the menu
              // rather than navigate. Once open, a second tap proceeds to the route.
              if (!window.matchMedia('(hover: hover)').matches && !open) {
                e.preventDefault();
                setOpen(true);
              }
            }}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {t(item.key)}
            {caret}
          </NavLink>
        );
      })()}

      <div className="site-nav__submenu" role="menu" data-lenis-prevent>
        {item.children.map((child) => {
          // NavLink's built-in isActive only compares pathname, so two
          // sub-items that share a pathname (e.g. /about#history and
          // /about#affiliated) would BOTH be highlighted at the same time.
          // We hand-roll the active check so the hash is also compared.
          const [childPath, childHash = ''] = child.to.split('#');
          const isChildActive = pathname === childPath && hash === (childHash ? `#${childHash}` : '');
          return (
            <NavLink
              key={child.to}
              to={child.to}
              className={`site-nav__sublink ${isChildActive ? 'site-nav__sublink--active' : ''}`}
              role="menuitem"
            >
              <span className="site-nav__sublink-dot" aria-hidden="true" />
              <span>{t(child.key)}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
