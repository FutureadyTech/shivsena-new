import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import ShivSenaJanmaBanner from './sections/ShivSenaJanmaBanner.jsx';
import ShivSenaJanmaArticle from './sections/ShivSenaJanmaArticle.jsx';

import './shivsenajanma.css';

export default function ShivSenaJanma() {
  useLenis();

  return (
    <div className="ssj-page">
      <CursorSparks />
      <SiteHeader />
      <ShivSenaJanmaBanner />
      <ShivSenaJanmaArticle />
      <Footer />
    </div>
  );
}
