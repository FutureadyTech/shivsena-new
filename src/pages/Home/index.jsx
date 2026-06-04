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
import HomeAudioProvider from './HomeAudioProvider.jsx';
import { useLenis } from './hooks/useLenis.js';
import './home.css';

export default function Home() {
  useLenis();

  return (
    <HomeAudioProvider>
      <div className="home-page">
        <CursorSparks />
        <SiteHeader />
        <Hero />
        <VisionIdeology />
        <LeadershipFeature />
        <OurJourney />
        <NewsMedia />
        <SocialFeed />
        {/* <OfficeLocator /> */}
        <RegionExplorer />
        <JoinCTA />
        <Footer />
      </div>
    </HomeAudioProvider>
  );
}