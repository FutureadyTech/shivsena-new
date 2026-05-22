import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import NewsBanner from './sections/NewsBanner.jsx';
import PressReleases from './sections/PressReleases.jsx';
import InterviewsArticles from './sections/InterviewsArticles.jsx';
import Speeches from './sections/Speeches.jsx';
import VideoGallery from './sections/VideoGallery.jsx';
import PhotoGallery from './sections/PhotoGallery.jsx';

import './news.css';

export default function News() {
  useLenis();

  return (
    <div className="news-page">
      <CursorSparks />
      <SiteHeader />
      <NewsBanner />
      <PressReleases />
      <InterviewsArticles />
      <Speeches />
      <VideoGallery />
      <PhotoGallery />
      <Footer />
    </div>
  );
}
