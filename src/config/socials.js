/**
 * Official Shiv Sena social handles — single source of truth.
 * Imported by the footer, the social-rail, and the SocialFeed section
 * so URL changes only ever happen here.
 */
export const SOCIALS = {
  facebook: {
    name: 'Facebook',
    handle: '@Shivsenaofc',
    url: 'https://www.facebook.com/Shivsenaofc',
  },
  instagram: {
    name: 'Instagram',
    handle: '@shivsenaofc',
    url: 'https://www.instagram.com/shivsenaofc/',
  },
  twitter: {
    name: 'X / Twitter',
    handle: '@Shivsenaofc',
    url: 'https://x.com/Shivsenaofc',
  },
  youtube: {
    name: 'YouTube',
    handle: '@shivsenaofc',
    url: 'https://www.youtube.com/@shivsenaofc',
    /* Filled in via env var (see /api/youtube.js). Used by the
       serverless function to resolve the @handle → channelId. */
  },
  whatsapp: {
    name: 'WhatsApp Channel',
    handle: 'Shivsena',
    url: 'https://whatsapp.com/channel/0029Va9nyyVDDmFQ61SOyT1A',
  },
};

export const SOCIAL_ORDER = ['facebook', 'instagram', 'twitter', 'youtube', 'whatsapp'];
