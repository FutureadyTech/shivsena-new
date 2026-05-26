import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import InnovativeBanner from './sections/InnovativeBanner.jsx';
import InnovativePrograms from './sections/InnovativePrograms.jsx';

import './innovative.css';

export default function Innovative() {
  useLenis();

  return (
    <div className="innovative-page">
      <CursorSparks />
      <SiteHeader />
      <InnovativeBanner />
      <InnovativePrograms />
      <Footer />
    </div>
  );
}
