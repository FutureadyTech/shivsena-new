import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import LeadershipBanner from './sections/LeadershipBanner.jsx';
import LeadersDirectory from './sections/LeadersDirectory.jsx';
import RegionExplorer from '../Home/sections/RegionExplorer.jsx';

import './leadership.css';

/* ═══════════════════════════════════════════════════════════════
   LEADERSHIP PAGE

   1. Banner
   2. ALL nine category carousels — every leader, no district filter
      (mode='all' on LeadersDirectory aggregates + dedupes across
       all districts)
   3. RegionExplorer — the same district-aware map+side-panel
      component that the homepage uses, embedded as-is for users
      who want to drill into a specific district.
═══════════════════════════════════════════════════════════════ */
export default function Leadership() {
  useLenis();

  return (
    <div className="leadership-page">
      <CursorSparks />
      <SiteHeader />
      <LeadershipBanner />

      {/* ── All 9 carousels, unfiltered ────────────────────────── */}
      <LeadersDirectory mode="all" activeDistrict="mumbai" />

      {/* ── Homepage map + district panel, embedded as-is ─────── */}
      <RegionExplorer />

      <Footer />
    </div>
  );
}
