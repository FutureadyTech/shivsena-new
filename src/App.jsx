import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import Entrance from './pages/Entrance/index.jsx';
import Home from './pages/Home/index.jsx';
import About from './pages/About/index.jsx';
import News from './pages/News/index.jsx';
import Contact from './pages/Contact/index.jsx';
import Leadership from './pages/Leadership/index.jsx';

/* Reset scroll to the top on every route change.
   Tries Lenis (if it's been mounted by the active page) first for a clean
   jump that the smooth-scroll library doesn't fight, otherwise falls back
   to native window.scrollTo. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Run on next tick so the new page has mounted (and any new Lenis
    // instance has had a chance to attach).
    const id = requestAnimationFrame(() => {
      if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
        window.__lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  return null;
}

function ComingSoon({ title }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      background: '#050302',
      color: '#F4E4BC',
      fontFamily: 'Cinzel, serif',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.04em' }}>{title}</h1>
      <p style={{ color: '#FFB26B', letterSpacing: '0.3em', fontSize: '0.85rem' }}>COMING SOON</p>
      <Link to="/home" style={{
        marginTop: '12px',
        padding: '12px 28px',
        border: '1.5px solid #FF6B1A',
        borderRadius: '6px',
        color: '#FF6B1A',
        textDecoration: 'none',
        letterSpacing: '0.04em',
      }}>← BACK TO HOME</Link>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider defaultLang="mr">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Entrance />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/members" element={<ComingSoon title="Members" />} />
          <Route path="*" element={<ComingSoon title="Page Not Found" />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}