import SiteHeader from '../../components/SiteHeader.jsx';
import Hero from './Hero.jsx';
import VisionIdeology from './sections/VisionIdeology.jsx';
import LeadershipFeature from './sections/LeadershipFeature.jsx';
import OurJourney from './sections/OurJourney.jsx';
import NewsMedia from './sections/NewsMedia.jsx';
import SocialFeed from './sections/SocialFeed.jsx';
// import OfficeLocator from './sections/OfficeLocator.jsx';
import RegionExplorer from './sections/RegionExplorer.jsx';
import JoinCTA from './sections/JoinCTA.jsx';
import Footer from './sections/Footer.jsx';
import CursorSparks from './components/CursorSparks.jsx';
import SectionDivider from './components/SectionDivider.jsx';
import HomeBannerAudio from './HomeBannerAudio.jsx';
import { useLenis } from './hooks/useLenis.js';
import './home.css';

export default function Home() {
  useLenis();

  return (
    <div className="home-page">
      <CursorSparks />
      <HomeBannerAudio />
      <SiteHeader />
      <Hero />
      <VisionIdeology />
      <LeadershipFeature />
      <SectionDivider />
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