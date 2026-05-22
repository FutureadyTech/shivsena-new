import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import ContactBanner from './sections/ContactBanner.jsx';
import ContactInfo from './sections/ContactInfo.jsx';
import ContactForm from './sections/ContactForm.jsx';
import MapSection from './sections/MapSection.jsx';
import SocialMedia from './sections/SocialMedia.jsx';

import './contact.css';

export default function Contact() {
  useLenis();

  return (
    <div className="contact-page">
      <CursorSparks />
      <SiteHeader />
      <ContactBanner />
      <ContactInfo />
      <ContactForm />
      <MapSection />
      <SocialMedia />
      <Footer />
    </div>
  );
}
