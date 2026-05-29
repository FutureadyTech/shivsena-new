import { useState, useCallback, useRef } from 'react';
import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import LeadershipBanner from './sections/LeadershipBanner.jsx';
import RegionMap from './sections/RegionMap.jsx';
import LeadersDirectory from './sections/LeadersDirectory.jsx';

import './leadership.css';

export default function Leadership() {
  useLenis();
  /* District-level selection now defaults to the first Konkan district */
  const [activeDistrict, setActiveDistrict] = useState('mumbai-suburban');
  const directoryRef = useRef(null);

  const handleSelectDistrict = useCallback((districtSlug) => {
 setActiveDistrict(districtSlug);

 /* Smooth scroll to the directory section */
 const el = directoryRef.current;
 if (!el) return;
 if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
 window.__lenis.scrollTo(el, { offset: -64, duration: 1.1 });
 } else {
 const top = el.getBoundingClientRect().top + window.scrollY - 64;
 window.scrollTo({ top, behavior: 'smooth' });
 }
  }, []);

  return (
 <div className="leadership-page">
 <CursorSparks />
 <SiteHeader />
 <LeadershipBanner />
 <RegionMap activeDistrict={activeDistrict} onSelectDistrict={handleSelectDistrict} />
 <div ref={directoryRef}>
 <LeadersDirectory activeDistrict={activeDistrict} onChangeDistrict={setActiveDistrict} />
 </div>
 <Footer />
 </div>
  );
}
