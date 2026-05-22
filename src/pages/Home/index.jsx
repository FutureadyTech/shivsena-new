import SiteHeader from '../../components/SiteHeader.jsx';
import Hero from './Hero.jsx';
import VisionIdeology from './sections/VisionIdeology.jsx';
import LeadershipCarousel from './sections/LeadershipCarousel.jsx';
import OurJourney from './sections/OurJourney.jsx';
import NewsMedia from './sections/NewsMedia.jsx';
import SocialFeed from './sections/SocialFeed.jsx';
// import OfficeLocator from './sections/OfficeLocator.jsx';
import RegionExplorer from './sections/RegionExplorer.jsx';
import JoinCTA from './sections/JoinCTA.jsx';
import Footer from './sections/Footer.jsx';
import CursorSparks from './components/CursorSparks.jsx';
import { useLenis } from './hooks/useLenis.js';
import './home.css';

export default function Home() {
  useLenis();

  return (
    <div className="home-page">
      <CursorSparks />
      <SiteHeader />
      <Hero />
      <VisionIdeology />
      <LeadershipCarousel />
      <OurJourney />
      <NewsMedia />
      <SocialFeed />
      {/* <OfficeLocator /> */}
      <RegionExplorer />
      <JoinCTA />
      <Footer />
    </div>
  );
}