import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import MahayutiBanner from './sections/MahayutiBanner.jsx';
import MahayutiArticle from './sections/MahayutiArticle.jsx';

import './mahayuti.css';

export default function Mahayuti() {
  useLenis();

  return (
    <div className="mahayuti-page">
      <CursorSparks />
      <SiteHeader />
      <MahayutiBanner />
      <MahayutiArticle />
      <Footer />
    </div>
  );
}
