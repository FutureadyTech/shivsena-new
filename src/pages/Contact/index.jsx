import SiteHeader from '../../components/SiteHeader.jsx';
import Footer from '../Home/sections/Footer.jsx';
import CursorSparks from '../Home/components/CursorSparks.jsx';
import { useLenis } from '../Home/hooks/useLenis.js';

import ContactBanner from './sections/ContactBanner.jsx';
import ContactInfo from './sections/ContactInfo.jsx';
import ContactForm from './sections/ContactForm.jsx';
import SocialFeed from '../Home/sections/SocialFeed.jsx';

import './contact.css';

export default function Contact() {
  useLenis();

  return (
    <div className="contact-page">
      <CursorSparks />
      <SiteHeader />
      <ContactBanner />
      <ContactForm />
      <ContactInfo />
      <SocialFeed />
      <Footer />
    </div>
  );
}
