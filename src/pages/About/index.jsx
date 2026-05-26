import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import LeadershipCarousel from '../Home/sections/LeadershipCarousel.jsx';
import OurJourney from '../Home/sections/OurJourney.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';
import aboutContent from '../../content/about.json';

import AboutBanner from './sections/AboutBanner.jsx';
import AffiliatedOrgs from './sections/AffiliatedOrgs.jsx';

import './about.css';

export default function About() {
  useLenis();

  return (
    <div className="about-page">
      <CursorSparks />
      <SiteHeader />
      <AboutBanner />
      <OurJourney />
      <LeadershipCarousel content={aboutContent.leadership} gridCols={3} />
      <AffiliatedOrgs />
      <Footer />
    </div>
  );
}
