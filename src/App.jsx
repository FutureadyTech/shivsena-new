import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import Entrance from './pages/Entrance/index.jsx';
import Home from './pages/Home/index.jsx';
import About from './pages/About/index.jsx';
import News from './pages/News/index.jsx';
import Contact from './pages/Contact/index.jsx';
import Leadership from './pages/Leadership/index.jsx';
import Declarations from './pages/Declarations/index.jsx';
import AffiliatedOrg from './pages/AffiliatedOrg/index.jsx';
import LeaderProfile from './pages/LeaderProfile/index.jsx';
import Innovative from './pages/Innovative/index.jsx';
import Mahayuti from './pages/Mahayuti/index.jsx';
import ShivSenaJanma from './pages/ShivSenaJanma/index.jsx';

/* Reset scroll to the top on every route change.
 Tries Lenis (if it's been mounted by the active page) first for a clean
 jump that the smooth-scroll library doesn't fight, otherwise falls back
 to native window.scrollTo. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
 let cancelled = false;
 const timers = [];
 const clearAll = () => { cancelled = true; timers.forEach(clearTimeout); };

 /* ── Hash anchor (e.g. /leadership#secretaries) ──
    Heavy pages mount their Lenis instance + content AFTER the first
    frame, so a single early attempt scrolls before the page is ready
    (and gets reset to 0 once Lenis attaches). Poll until BOTH the
    target element and Lenis exist, then issue the scroll — with a
    couple of correction passes for lazy-loaded images that shift the
    layout above the target. */
 if (hash) {
 const doScroll = () => {
 const el = document.querySelector(hash);
 if (!el) return false;
 const top = el.getBoundingClientRect().top + window.scrollY - 80; // header offset
 const lenis = window.__lenis;
 if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(top, { immediate: false });
 else window.scrollTo({ top, left: 0, behavior: 'smooth' });
 return true;
 };
 let tries = 0;
 const poll = () => {
 if (cancelled) return;
 const ready = document.querySelector(hash) && window.__lenis;
 if (ready || tries > 20) {
 if (doScroll()) {
 /* Lazy images above the target keep growing the page after the
    first scroll, so the target drifts down (esp. for sections
    near the bottom). Re-align until its absolute position holds
    steady for a few checks, or we hit the time cap. */
 let last = -1, stable = 0, n = 0;
 const correct = () => {
 if (cancelled) return;
 const el = document.querySelector(hash);
 if (!el) return;
 const pos = Math.round(el.getBoundingClientRect().top + window.scrollY);
 if (pos === last) { stable += 1; } else { stable = 0; last = pos; doScroll(); }
 n += 1;
 if (stable < 3 && n < 22) timers.push(setTimeout(correct, 140));
 };
 timers.push(setTimeout(correct, 160));
 }
 return;
 }
 tries += 1;
 timers.push(setTimeout(poll, 70));
 };
 timers.push(setTimeout(poll, 40));
 return clearAll;
 }

 /* ── No hash → jump to top ── */
 const id = requestAnimationFrame(() => {
 if (cancelled) return;
 if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
 window.__lenis.scrollTo(0, { immediate: true, force: true });
 } else {
 window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
 }
 });
 return () => { cancelled = true; cancelAnimationFrame(id); };
  }, [pathname, hash]);
  return null;
}

/* Stop the Enter-click stinger (join.mp3) the instant pathname leaves
 /home, in case it's still playing. The looping home music stops on
 its own when HomeAudioProvider unmounts on the route change. */
function HomeAudioRouteGuard() {
  const { pathname } = useLocation();
  useEffect(() => {
 if (pathname === '/home') return;
 if (typeof window === 'undefined') return;
 try { window.__stopJoin?.(); } catch {}
  }, [pathname]);
  return null;
}

/* Floating WhatsApp button on every page EXCEPT the entrance ("/"),
   which is a full-screen immersive cover with its own CTAs. */
function GlobalWhatsApp() {
  const { pathname } = useLocation();
  if (pathname === '/') return null;
  return <WhatsAppButton />;
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
 <Link to="/home" className="btn" style={{ marginTop: '12px' }}>← BACK TO HOME</Link>
 </div>
  );
}

export default function App() {
  return (
 <LanguageProvider defaultLang="mr">
 <BrowserRouter>
 <ScrollToTop />
 <HomeAudioRouteGuard />
 <Routes>
 <Route path="/" element={<Entrance />} />
 <Route path="/home" element={<Home />} />
 <Route path="/about" element={<About />} />
 <Route path="/news" element={<News />} />
 <Route path="/contact" element={<Contact />} />
 <Route path="/leadership" element={<Leadership />} />
 <Route path="/declarations" element={<Declarations />} />
 <Route path="/affiliated/:slug" element={<AffiliatedOrg />} />
 <Route path="/leader/:slug" element={<LeaderProfile />} />
 <Route path="/innovative" element={<Innovative />} />
 <Route path="/mahayuti" element={<Mahayuti />} />
 <Route path="/shivsena-janma" element={<ShivSenaJanma />} />
 <Route path="/shivsena-live" element={<ComingSoon title="शिवसेना लाइव्ह" />} />
 <Route path="/members" element={<ComingSoon title="Members" />} />
 <Route path="*" element={<ComingSoon title="Page Not Found" />} />
 </Routes>
 <GlobalWhatsApp />
 </BrowserRouter>
 </LanguageProvider>
  );
}