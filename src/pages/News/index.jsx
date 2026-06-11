import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import NewsBanner from './sections/NewsBanner.jsx';
import MediaPosters from './sections/MediaPosters.jsx';
import MediaVideos from './sections/MediaVideos.jsx';
import MediaArticles from './sections/MediaArticles.jsx';
import MediaNews from './sections/MediaNews.jsx';
import VideoGallery from './sections/VideoGallery.jsx';
import PhotoGallery from './sections/PhotoGallery.jsx';

import mediaContent from '../../content/media.json';

import './news.css';

export default function News() {
  useLenis();

  return (
    <div className="news-page">
      <CursorSparks />
      <SiteHeader />
      <NewsBanner />

      {/* मिडीया रिसोर्सेस — driven by src/content/media.json.
          Anchor ids match the header dropdown links. */}
      <MediaPosters  block={mediaContent.pressReleases} sectionId="press-releases" />
      <MediaPosters  block={mediaContent.appointments}  sectionId="appointment-letters" alt />
      <MediaVideos   block={mediaContent.speeches}      sectionId="speeches" />
      <MediaVideos   block={mediaContent.interviews}    sectionId="interviews" alt />
      <MediaArticles block={mediaContent.articles}      sectionId="articles" />
      <MediaNews     block={mediaContent.news}          sectionId="news" alt />

      {/* Galleries retained as-is (no docx data supplied yet) */}
      <VideoGallery />
      <PhotoGallery />
      <Footer />
    </div>
  );
}
