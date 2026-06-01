import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import OurJourney from '../Home/sections/OurJourney.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import SectionDivider from '../Home/components/SectionDivider.jsx';
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
      <SectionDivider />
      <OurJourney />
      <AffiliatedOrgs />
      {aboutContent.salangna && (
        <AffiliatedOrgs
          content={aboutContent.salangna}
          sectionId="salangna"
        />
      )}
      <Footer />
    </div>
  );
}
