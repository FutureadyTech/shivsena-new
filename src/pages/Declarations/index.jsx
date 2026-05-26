import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import DeclarationsBanner from './sections/DeclarationsBanner.jsx';
import ElectionDeclarations from './sections/ElectionDeclarations.jsx';

import './declarations.css';

export default function Declarations() {
  useLenis();

  return (
    <div className="declarations-page">
      <CursorSparks />
      <SiteHeader />
      <DeclarationsBanner />
      <ElectionDeclarations />
      <Footer />
    </div>
  );
}
