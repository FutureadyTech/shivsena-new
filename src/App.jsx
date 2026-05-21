import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import Entrance from './pages/Entrance/index.jsx';
import Home from './pages/Home/index.jsx';

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
        <Routes>
          <Route path="/" element={<Entrance />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<ComingSoon title="About" />} />
          <Route path="/news" element={<ComingSoon title="News & Media" />} />
          <Route path="/leadership" element={<ComingSoon title="Leadership" />} />
          <Route path="/members" element={<ComingSoon title="Members" />} />
          <Route path="*" element={<ComingSoon title="Page Not Found" />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}