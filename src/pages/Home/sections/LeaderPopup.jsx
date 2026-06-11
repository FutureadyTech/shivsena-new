import { useEffect } from 'react';
import './LeaderPopup.css';

const SOCIAL_META = {
  instagram: {
 label: 'Instagram',
 icon: (
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
 <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
 </svg>
 ),
  },
  facebook: {
 label: 'Facebook',
 icon: (
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
 </svg>
 ),
  },
  twitter: {
 label: 'X / Twitter',
 icon: (
 <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
 </svg>
 ),
  },
  youtube: {
 label: 'YouTube',
 icon: (
 <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
 <path d="M23 12s0-3.18-.41-4.7a2.51 2.51 0 0 0-1.77-1.77C19.3 5.12 12 5.12 12 5.12s-7.3 0-8.82.41a2.51 2.51 0 0 0-1.77 1.77C1 8.82 1 12 1 12s0 3.18.41 4.7a2.51 2.51 0 0 0 1.77 1.77c1.52.41 8.82.41 8.82.41s7.3 0 8.82-.41a2.51 2.51 0 0 0 1.77-1.77C23 15.18 23 12 23 12Zm-13.2 3.04V8.96L15.5 12l-5.7 3.04Z" />
 </svg>
 ),
  },
};

const DUMMY_BIOS = {
  mr: [
 'जनसेवेच्या भावनेने प्रेरित होऊन शिवसेनेच्या विचारधारेला बळकटी देत असून, मतदारसंघाच्या सर्वांगीण विकासासाठी कटिबद्ध आहेत.',
 'गाव-गल्ली ते विधानभवन प्रत्येक स्तरावर जनतेच्या प्रश्नांना वाचा फोडणारे संघर्षशील नेतृत्व. विकासाच्या नव्या दिशेने अविरत कार्यरत.',
 'विकास, संस्कृती आणि एकजूट या त्रिसूत्रीवर आधारित कार्यपद्धतीने मतदारसंघाच्या प्रगतीला नवी दिशा देत आहेत.',
  ],
  en: [
 'Driven by the spirit of public service, dedicated to strengthening the Shiv Sena ideology and committed to the holistic development of the constituency.',
 'From villages to the Vidhan Bhavan a determined leader giving voice to public concerns at every level, working tirelessly toward progress.',
 'Charting a new direction for the constituency through a balance of development, culture, and unity the three pillars of grassroots leadership.',
  ],
};

function isValidUrl(s) {
  if (!s || typeof s !== 'string') return false;
  const v = s.trim().toLowerCase();
  if (!v) return false;
  if (v.includes('account nahi') || v.includes('nahiye')) return false;
  return v.startsWith('http://') || v.startsWith('https://');
}

function hashIndex(str, mod) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % mod;
}

function getPlaceholderPhoto(name = '') {
  return /^\s*smt\.?\s/i.test(name)
 ? '/placeholder/placeholder-women.png'
 : '/placeholder/placeholder-men.png';
}

export default function LeaderPopup({ leader, lang, regionColor, onClose }) {
  useEffect(() => {
 function onKey(e) {
 if (e.key === 'Escape') onClose();
 }
 document.addEventListener('keydown', onKey);
 const prevOverflow = document.body.style.overflow;
 document.body.style.overflow = 'hidden';
 return () => {
 document.removeEventListener('keydown', onKey);
 document.body.style.overflow = prevOverflow;
 };
  }, [onClose]);

  if (!leader) return null;

  const social = leader.social || {};
  const availableSocials = Object.entries(SOCIAL_META).filter(([key]) => isValidUrl(social[key]));

  const closeLabel = 'बंद करा';
  const noSocialsLabel = 'सोशल मीडिया तपशील उपलब्ध नाहीत';

  const photoSrc = leader.photo || getPlaceholderPhoto(leader.name);

  const bios = DUMMY_BIOS[lang] || DUMMY_BIOS.en;
  const description = leader.description || bios[hashIndex(leader.name || '', bios.length)];

  return (
 <div
 className="leader-popup__backdrop"
 onClick={onClose}
 role="dialog"
 aria-modal="true"
 aria-labelledby="leader-popup-name"
 >
 <div
 className="leader-popup"
 style={{ '--popup-accent': regionColor || '#C44D0E' }}
 onClick={(e) => e.stopPropagation()}
 >
 <button
 type="button"
 className="leader-popup__close"
 onClick={onClose}
 aria-label={closeLabel}
 >
 ×
 </button>

 {/* ── LEFT: photo ── */}
 <div className="leader-popup__media">
 <img
 className="leader-popup__photo"
 src={photoSrc}
 alt={leader.name}
 loading="lazy"
 />
 </div>

 {/* ── RIGHT: info + socials ── */}
 <div className="leader-popup__body">
 <h3 id="leader-popup-name" className="leader-popup__name">
 {leader.name}
 </h3>
 <p className="leader-popup__role">{leader.role}</p>

 <div className="leader-popup__divider" />

 {leader.constituency && (
 <p className="leader-popup__constituency">{leader.constituency}</p>
 )}

 <p className="leader-popup__desc">{description}</p>

 <div className="leader-popup__socials">
 {availableSocials.length > 0 ? (
 availableSocials.map(([key, meta]) => (
 <a
 key={key}
 href={social[key].trim()}
 target="_blank"
 rel="noopener noreferrer"
 className={`leader-popup__social leader-popup__social--${key}`}
 aria-label={meta.label}
 title={meta.label}
 >
 {meta.icon}
 </a>
 ))
 ) : (
 <p className="leader-popup__no-socials">{noSocialsLabel}</p>
 )}
 </div>
 </div>
 </div>
 </div>
  );
}
