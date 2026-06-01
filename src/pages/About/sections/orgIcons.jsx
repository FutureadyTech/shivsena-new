/* ════════════════════════════════════════════════════════════
   Org-card icon library.

   Polished inline SVG icons for the 73 affiliated / allied
   organisations. Each org gets the most recognisable visual for
   what it actually does — Indian-cultural concepts (diya, khanda,
   marigold, bullock cart, Ashoka chakra, mallakhamb, gopuram,
   Maratha helmet, etc.) are drawn from scratch in a consistent
   1.8-stroke line-icon style so the whole set reads as one
   coherent illustrated language.

   The site auto-prefers a Flaticon PNG at
   /icons/orgs/{slug}.png — these SVGs render as the fallback
   until that file is provided.
   ════════════════════════════════════════════════════════════ */

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className: 'org-card__icon-svg',
  'aria-hidden': true,
};

/* ─── Universal icons (Lucide-style) ─────────────────────── */
const Teacher      = () => (<svg {...ICON_PROPS}><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/><path d="M22 10v6"/></svg>);
const HardHat      = () => (<svg {...ICON_PROPS}><path d="M2 18h20"/><path d="M4 18a8 8 0 0 1 16 0"/><path d="M9 6a3 3 0 0 1 6 0v4"/><path d="M9 10h6"/></svg>);
const Scales       = () => (<svg {...ICON_PROPS}><path d="M12 3v18"/><path d="M5 21h14"/><path d="M5 7h14"/><path d="m2 12 3-5 3 5a3 3 0 0 1-6 0z"/><path d="m16 12 3-5 3 5a3 3 0 0 1-6 0z"/></svg>);
const People       = () => (<svg {...ICON_PROPS}><circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M2 21v-1a6 6 0 0 1 12 0v1"/><path d="M15 21v-.5a3.5 3.5 0 0 1 7 0V21"/></svg>);
const Globe        = () => (<svg {...ICON_PROPS}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></svg>);
const Stethoscope  = () => (<svg {...ICON_PROPS}><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M6 3h2"/><path d="M12 3h2"/><path d="M10 13v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/></svg>);
const Briefcase    = () => (<svg {...ICON_PROPS}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 14h20"/></svg>);
const Gavel        = () => (<svg {...ICON_PROPS}><path d="m14 3 7 7-3 3-7-7z"/><path d="m9 8-6 6 4 4 6-6"/><path d="M3 21h11"/></svg>);
const Shield       = () => (<svg {...ICON_PROPS}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>);
const Camera       = () => (<svg {...ICON_PROPS}><path d="M22 8a2 2 0 0 0-2-2h-3l-2-2H9L7 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"/><circle cx="12" cy="13" r="4"/></svg>);
const Home         = () => (<svg {...ICON_PROPS}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>);
const Film         = () => (<svg {...ICON_PROPS}><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20"/><path d="M2 16h20"/><path d="M7 3v18"/><path d="M17 3v18"/></svg>);
const Woman        = () => (<svg {...ICON_PROPS}><circle cx="12" cy="5" r="3"/><path d="M8 22v-4l-2-5 6-5 6 5-2 5v4"/><path d="M10 13h4"/></svg>);
const ShoppingBag  = () => (<svg {...ICON_PROPS}><path d="M6 7h12l-1 14H7z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/><path d="m13 13-3 4"/></svg>);
const BloodDrop    = () => (<svg {...ICON_PROPS}><path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z"/><path d="M8 14a4 4 0 0 0 3 3"/></svg>);
const Scissors     = () => (<svg {...ICON_PROPS}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14 14l6 6"/><path d="M8.12 8.12 12 12"/></svg>);
const Cart         = () => (<svg {...ICON_PROPS}><path d="M2 3h2l3 14h13l2-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>);
const Truck        = () => (<svg {...ICON_PROPS}><path d="M1 17V7h13v10"/><path d="M14 10h4l3 4v3h-7"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>);
const Cable        = () => (<svg {...ICON_PROPS}><path d="M3 21c0-3 3-3 3-6V5a2 2 0 0 1 4 0v10c0 3 4 3 4 6"/><path d="M21 3c0 3-3 3-3 6v10a2 2 0 0 1-4 0V9c0-3-4-3-4-6"/></svg>);
const IdBadge      = () => (<svg {...ICON_PROPS}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5 17c1-2 3-3 4-3s3 1 4 3"/><path d="M15 9h4"/><path d="M15 12h4"/><path d="M15 15h3"/></svg>);
const Handshake    = () => (<svg {...ICON_PROPS}><path d="m11 17 2-2 4 4-2 2-4-4z"/><path d="m21 13-4-4-3 3 4 4z"/><path d="m11 9 4 4"/><path d="M3 13c4-4 6-1 10-6"/><path d="M3 13c2 2 5 4 7 5"/></svg>);
const Handraise    = () => (<svg {...ICON_PROPS}><circle cx="12" cy="5" r="2.5"/><path d="M8 12l4-5 4 5"/><path d="M8 21v-9"/><path d="M16 21v-9"/><path d="M5 9V4"/><path d="M19 9V4"/></svg>);
const Megaphone    = () => (<svg {...ICON_PROPS}><path d="M3 11v2a1 1 0 0 0 1 1h4l8 6V4l-8 6H4a1 1 0 0 0-1 1z"/><path d="M19 8a4 4 0 0 1 0 8"/></svg>);
const Storefront   = () => (<svg {...ICON_PROPS}><path d="M3 9V7l3-4h12l3 4v2"/><path d="M3 9h18l-1 11H4z"/><path d="M9 20v-7h6v7"/><path d="M3 9c0 2 2 3 3 3s3-1 3-3 2 3 3 3 3-1 3-3 2 3 3 3 3-1 3-3"/></svg>);
const Heart        = () => (<svg {...ICON_PROPS}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21l8.84-8.61a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const HandHeart    = () => (<svg {...ICON_PROPS}><path d="M3 14s2-3 5-3 4 2 4 2 1-2 4-2 5 3 5 3v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="m9 9 3 3 3-3a2 2 0 0 0-3-3 2 2 0 0 0-3 3z"/></svg>);
const Lightbulb    = () => (<svg {...ICON_PROPS}><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.9.8 1.4 1.7 1.4 2.7v.6h5.2v-.6c0-1 .5-1.9 1.4-2.7A7 7 0 0 0 12 2z"/></svg>);
const Building     = () => (<svg {...ICON_PROPS}><rect x="4" y="3" width="16" height="18"/><path d="M4 9h16"/><path d="M4 15h16"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>);
const Factory      = () => (<svg {...ICON_PROPS}><path d="M3 21V11l5 3v-3l5 3v-3l5 3V8h3v13H3z"/><path d="M9 16h.01"/><path d="M14 16h.01"/></svg>);
const Construction = () => (<svg {...ICON_PROPS}><rect x="2" y="14" width="20" height="6" rx="1"/><rect x="6" y="6" width="12" height="8"/><path d="M6 10h12"/><path d="M10 6v8"/><path d="M14 6v8"/></svg>);
const FistRaised   = () => (<svg {...ICON_PROPS}><path d="M6 9V6c0-1 1-2 2-2s2 1 2 2v3"/><path d="M10 9V5c0-1 1-2 2-2s2 1 2 2v4"/><path d="M14 9V6c0-1 1-2 2-2s2 1 2 2v6"/><path d="M6 9a2 2 0 0 0-2 2v4a7 7 0 0 0 14 0V11"/></svg>);
const Strength     = () => (<svg {...ICON_PROPS}><path d="M7 12a4 4 0 1 1 8 0v4l5-2v6H4v-6l3 1z"/><circle cx="11" cy="6" r="2.5"/></svg>);

/* ─── India-specific cultural icons ──────────────────────── */

/* Diya: clay oil lamp with rising flame */
const Diya = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 16h18"/>
    <path d="M5 16c0-2 3-3 7-3s7 1 7 3"/>
    <path d="M12 13v-3"/>
    <path d="M12 10c0-2 1-3 1-4 0 1-1 1-1 2s-1 1-1 2c0 1 1 0 1 0z"/>
  </svg>
);

/* Lotus: layered five-petal flower seen from above */
const Lotus = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 20c-5 0-9-3-9-7 2 1 4 2 5 1-2-2-3-5-1-7 1 2 3 4 5 4-1-3 0-7 0-9 1 3 2 6 0 9 2 0 4-2 5-4 2 2 1 5-1 7 1-1 3-2 5-1 0 4-4 7-9 7z"/>
  </svg>
);

/* Khanda — Sikh emblem: vertical double sword + crescent + chakra */
const Khanda = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 2v20"/>
    <path d="M9 7v8"/>
    <path d="M15 7v8"/>
    <circle cx="12" cy="11" r="3"/>
    <path d="M5 11a7 7 0 0 1 14 0"/>
  </svg>
);

/* Marigold: layered round flower for Mali community */
const Marigold = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 4 13 9 12 8 11 9z"/>
    <path d="M20 12l-5 1 4-1-4-1z"/>
    <path d="M12 20l-1-5 1 4 1-4z"/>
    <path d="M4 12l5-1-4 1 4 1z"/>
    <path d="m18 6-3 4 4-3z"/>
    <path d="m18 18-4-3 3 4z"/>
    <path d="m6 18 3-4-4 3z"/>
    <path d="m6 6 4 3-3-4z"/>
  </svg>
);

/* Bullock cart for Vanjari traders */
const BullockCart = () => (
  <svg {...ICON_PROPS}>
    <rect x="6" y="9" width="12" height="5"/>
    <circle cx="9" cy="17" r="2.5"/>
    <circle cx="17" cy="17" r="2.5"/>
    <path d="M6 12 2 9"/>
    <path d="M2 9V7"/>
    <path d="M2 7h3"/>
  </svg>
);

/* Maratha warrior helmet (Shivaji-style with curved peak + neck guard) */
const MarathaHelmet = () => (
  <svg {...ICON_PROPS}>
    <path d="M5 16c0-5 3-9 7-9s7 4 7 9"/>
    <path d="M5 16h14"/>
    <path d="M12 7V4"/>
    <circle cx="12" cy="3" r="1"/>
    <path d="M7 16v3l-2 1"/>
    <path d="M17 16v3l2 1"/>
  </svg>
);

/* Mallakhamb pole — vertical pole with athlete arm */
const Mallakhamb = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3v18"/>
    <circle cx="12" cy="6" r="1.5"/>
    <path d="M12 9h5"/>
    <path d="M17 9v3"/>
    <path d="M12 14h-4"/>
    <path d="M8 14v3"/>
    <path d="M9 20h6"/>
  </svg>
);

/* Ashoka chakra — 24-spoke wheel (simplified to 8 for clarity at small size) */
const AshokaChakra = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="9"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M12 3v6"/>
    <path d="M12 15v6"/>
    <path d="M3 12h6"/>
    <path d="M15 12h6"/>
    <path d="m5.6 5.6 4.2 4.2"/>
    <path d="m14.2 14.2 4.2 4.2"/>
    <path d="m18.4 5.6-4.2 4.2"/>
    <path d="m9.8 14.2-4.2 4.2"/>
  </svg>
);

/* Khukuri — curved Gurkha/Nepali knife */
const Khukuri = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 6c5 0 14 4 17 12"/>
    <path d="M3 6c4 1 11 5 15 12"/>
    <path d="m18 19 3-2"/>
    <path d="m20 18 1-3"/>
  </svg>
);

/* Taj Mahal silhouette — central dome + four minarets */
const TajMahal = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 4c2 0 3 2 3 4v4h-6V8c0-2 1-4 3-4z"/>
    <circle cx="12" cy="4" r="1"/>
    <path d="M9 12H6v8h12v-8h-3"/>
    <path d="M4 20V10"/>
    <path d="M2 10h4"/>
    <path d="M20 20V10"/>
    <path d="M18 10h4"/>
    <path d="M2 21h20"/>
  </svg>
);

/* Gopuram — tiered triangular South-Indian temple tower */
const Gopuram = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3 6 9h12z"/>
    <path d="M7 9v3h10V9"/>
    <path d="M6 12 5 15h14l-1-3"/>
    <path d="M5 15v3h14v-3"/>
    <path d="M5 18 4 21h16l-1-3"/>
    <path d="M10 21v-4h4v4"/>
  </svg>
);

/* Mysore-style palace — central dome with side towers */
const Palace = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 21V11l4-3"/>
    <path d="M21 21V11l-4-3"/>
    <path d="M7 8h10"/>
    <path d="M7 11h10"/>
    <path d="M9 11v10"/>
    <path d="M15 11v10"/>
    <path d="M9 8c0-2 1-4 3-4s3 2 3 4"/>
    <circle cx="12" cy="3" r="1"/>
    <path d="M3 21h18"/>
  </svg>
);

/* Houseboat — Kerala backwater style */
const Houseboat = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 18s2 2 5 2 4-2 7-2 5 2 5 2"/>
    <path d="M4 16l1-3h14l1 3"/>
    <path d="M6 13V8h12v5"/>
    <path d="M9 8V6h6v2"/>
  </svg>
);

/* Christian cross with rays */
const CrossChristian = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3v18"/>
    <path d="M7 9h10"/>
    <path d="M12 3v-1"/>
    <path d="M4 7l-1-1"/>
    <path d="M20 7l1-1"/>
  </svg>
);

/* Tribal drum (dhol) — horizontal drum with sticks */
const TribalDrum = () => (
  <svg {...ICON_PROPS}>
    <ellipse cx="12" cy="13" rx="9" ry="4"/>
    <path d="M3 13v3a4 9 0 0 0 18 0v-3"/>
    <path d="m5 7 2 4"/>
    <path d="m19 7-2 4"/>
  </svg>
);

/* Tribal mask — oval with eyes + lines */
const TribalMask = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 3c4 0 7 3 7 7 0 6-3 11-7 11s-7-5-7-11c0-4 3-7 7-7z"/>
    <circle cx="10" cy="10" r="0.8" fill="currentColor"/>
    <circle cx="14" cy="10" r="0.8" fill="currentColor"/>
    <path d="M10 15c1 1 3 1 4 0"/>
    <path d="M9 5l-1 2"/>
    <path d="M15 5l1 2"/>
  </svg>
);

/* Wheat plant — single stalk with grains */
const Wheat = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 22V10"/>
    <path d="M12 10c-3 0-5-2-5-5 3 0 5 2 5 5z"/>
    <path d="M12 10c3 0 5-2 5-5-3 0-5 2-5 5z"/>
    <path d="M12 14c-3 0-5-2-5-5"/>
    <path d="M12 14c3 0 5-2 5-5"/>
    <path d="M12 18c-3 0-5-2-5-5"/>
    <path d="M12 18c3 0 5-2 5-5"/>
  </svg>
);

/* Bricklayer — worker holding a brick on a trowel */
const Bricklayer = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="6" r="2.5"/>
    <path d="M9 9c-2 1-3 4-3 5"/>
    <path d="M15 9c2 1 3 4 3 5"/>
    <rect x="4" y="14" width="16" height="3"/>
    <path d="M9 14v3"/>
    <path d="M15 14v3"/>
    <path d="M4 17v3h16v-3"/>
  </svg>
);

/* Soldier saluting — silhouette with raised arm */
const Soldier = () => (
  <svg {...ICON_PROPS}>
    <circle cx="11" cy="6" r="2.5"/>
    <path d="M8 5h6"/>
    <path d="M11 8.5v6"/>
    <path d="m11 11 5-3"/>
    <path d="M16 8v3"/>
    <path d="M7 21v-6h8v6"/>
  </svg>
);

/* Military medal with ribbon */
const MilitaryMedal = () => (
  <svg {...ICON_PROPS}>
    <path d="M9 3h6"/>
    <path d="m9 3 1 6"/>
    <path d="m15 3-1 6"/>
    <circle cx="12" cy="14" r="5"/>
    <path d="m12 11 1 2 2 .3-1.5 1.5.4 2-1.9-1-1.9 1 .4-2-1.5-1.5L11 13z"/>
  </svg>
);

/* Police shield with star */
const PoliceShield = () => (
  <svg {...ICON_PROPS}>
    <path d="M12 22s7-4 7-10V5l-7-2-7 2v7c0 6 7 10 7 10z"/>
    <path d="m12 7 1 2 2 .3-1.5 1.5.4 2L12 12l-1.9 1 .4-2-1.5-1.5L11 9z"/>
  </svg>
);

/* Tower crane for big-scale construction */
const Crane = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 21h18"/>
    <path d="M6 21V5h12"/>
    <path d="M6 9h12"/>
    <path d="M12 9v6"/>
    <path d="M11 15h2v3h-2z"/>
    <path d="M6 5l-2 4h4z"/>
  </svg>
);

/* Vintage film camera (with reel on top) */
const FilmCamera = () => (
  <svg {...ICON_PROPS}>
    <rect x="3" y="9" width="13" height="9" rx="1"/>
    <circle cx="9.5" cy="6" r="2.5"/>
    <circle cx="13.5" cy="6" r="2.5"/>
    <path d="m16 12 5-3v9l-5-3z"/>
  </svg>
);

/* Clapperboard for cinema */
const Clapperboard = () => (
  <svg {...ICON_PROPS}>
    <rect x="3" y="9" width="18" height="12"/>
    <path d="m3 9 3-6 3 3-3 3"/>
    <path d="m9 9 3-6 3 3-3 3"/>
    <path d="m15 9 3-6 3 3-3 3"/>
  </svg>
);

/* Cobbler's tools — shoe + hammer */
const CobblerShoe = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 17c0-3 3-5 7-5h5c2 0 3 1 3 3v3H3z"/>
    <path d="M10 12V8"/>
    <path d="M7 12V9"/>
    <path d="m18 8 3 2-1 2-3-2z"/>
  </svg>
);

/* Library — stacked books on a shelf */
const LibraryBooks = () => (
  <svg {...ICON_PROPS}>
    <rect x="3" y="5" width="3" height="14"/>
    <rect x="7" y="7" width="3" height="12"/>
    <rect x="11" y="4" width="3" height="15"/>
    <rect x="15" y="6" width="3" height="13"/>
    <path d="m19 6 2 13"/>
    <path d="m20 8 1-2 1 1"/>
  </svg>
);

/* Apartment building — multi-floor with windows */
const Apartment = () => (
  <svg {...ICON_PROPS}>
    <rect x="4" y="3" width="16" height="18"/>
    <path d="M8 7h2"/>
    <path d="M14 7h2"/>
    <path d="M8 11h2"/>
    <path d="M14 11h2"/>
    <path d="M8 15h2"/>
    <path d="M14 15h2"/>
    <path d="M11 19h2v2h-2z"/>
  </svg>
);

/* Slum cluster — small irregular shanty roofs */
const SlumCluster = () => (
  <svg {...ICON_PROPS}>
    <path d="M2 20h20"/>
    <path d="M4 20v-5l3-3 3 3v5"/>
    <path d="M10 20v-7l4-3 4 3v7"/>
    <path d="M18 20v-4l2-2 2 2v4"/>
    <path d="M6 17h2"/>
    <path d="M13 16h2"/>
  </svg>
);

/* Nomadic tent — triangular tent silhouette */
const NomadTent = () => (
  <svg {...ICON_PROPS}>
    <path d="m12 4-8 16h16z"/>
    <path d="M12 4v16"/>
    <path d="m10 20 2-4 2 4"/>
  </svg>
);

/* Cleaning broom + dustpan */
const BroomDustpan = () => (
  <svg {...ICON_PROPS}>
    <path d="m4 20 7-13"/>
    <path d="M11 7l4-4 3 3-4 4z"/>
    <path d="M2 21v-3l5-2 2 5z"/>
    <path d="M14 14h6l-1 6h-4z"/>
  </svg>
);

/* Anchor — for sailor/maritime */
const Anchor = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v15"/>
    <path d="M9 11h6"/>
    <path d="M5 14c0 4 3 7 7 7s7-3 7-7"/>
    <path d="M5 14l-2-1"/>
    <path d="M19 14l2-1"/>
  </svg>
);

/* News microphone — handheld with broadcast bars */
const NewsMic = () => (
  <svg {...ICON_PROPS}>
    <rect x="9" y="2" width="6" height="11" rx="3"/>
    <path d="M5 11a7 7 0 0 0 14 0"/>
    <path d="M12 18v3"/>
    <path d="M9 21h6"/>
    <path d="M11 6h2"/>
  </svg>
);

/* Fishing boat with net rod */
const FishingBoat = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 17s2 2 5 2 4-2 7-2 5 2 5 2"/>
    <path d="M3 14h18l-2-3H5z"/>
    <path d="M12 11V4"/>
    <path d="m12 4 6 3"/>
  </svg>
);

/* Multi-faith — three symbols arranged horizontally */
const MultiFaith = () => (
  <svg {...ICON_PROPS}>
    <path d="M5 21v-8"/>
    <path d="M3 16h4"/>
    <path d="M5 9V7"/>
    <path d="M12 21V11"/>
    <path d="M12 11a3 3 0 1 1 3-3"/>
    <circle cx="19" cy="14" r="3"/>
    <path d="M19 11v-3"/>
  </svg>
);

/* Religious-style "Om" or generic spiritual circle with halo */
const SpiritualHalo = () => (
  <svg {...ICON_PROPS}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 4v2"/>
    <path d="M12 18v2"/>
    <path d="M4 12h2"/>
    <path d="M18 12h2"/>
    <path d="m6 6 1.4 1.4"/>
    <path d="m16.6 16.6 1.4 1.4"/>
    <path d="m6 18 1.4-1.4"/>
    <path d="m16.6 7.4 1.4-1.4"/>
  </svg>
);

/* India map outline (simplified) */
const IndiaMap = () => (
  <svg {...ICON_PROPS}>
    <path d="M7 3c-2 1-3 3-3 5l3 3v3l-2 2 1 3 3-1 2 4h3l1-3 3-2-1-3 3-3 1-3-3-2-3 1-2-3-3-1z"/>
  </svg>
);

/* Indian-style gardener with watering can */
const Gardener = () => (
  <svg {...ICON_PROPS}>
    <circle cx="9" cy="6" r="2.5"/>
    <path d="M9 8.5V14"/>
    <path d="M6 12h6"/>
    <path d="M9 14v6"/>
    <path d="m13 14 3 2-1 2"/>
    <path d="M17 13h4l-1 4-4-1"/>
    <path d="m20 10 1-2"/>
  </svg>
);

/* Diversity / community joined hands inner ring */
const Diversity = () => (
  <svg {...ICON_PROPS}>
    <circle cx="6" cy="8" r="2"/>
    <circle cx="18" cy="8" r="2"/>
    <circle cx="12" cy="6" r="2"/>
    <path d="M3 18c0-3 2-5 5-5"/>
    <path d="M21 18c0-3-2-5-5-5"/>
    <path d="M8 18c0-2 2-4 4-4s4 2 4 4"/>
    <path d="M3 21h18"/>
  </svg>
);

/* ─── id → component map ─────────────────────────────────── */
const ICON_BY_ID = {
  /* ── अंगीकृत संघटना (55) ── */
  'shetkari-sena':          Wheat,           // wheat stalk → farmer
  'shikshak-sena':          Teacher,         // graduation cap
  'lokadhikar':             Briefcase,       // employment
  'dharmaveer-adhyatmik':   Diya,            // oil lamp — spiritual
  'samajik-nyay':           Scales,          // justice scales
  'obc-balutedar':          Diversity,       // diverse artisan community
  'uttar-bhartiya':         TajMahal,        // North India landmark
  'rajasthani':             SpiritualHalo,   // (use Diya placeholder if turban not available — for now spiritual halo serves as a desert-sun-style icon; user can replace)
  'mali-samaj':             Marigold,        // flower grower
  'granthalay':             LibraryBooks,    // bookshelves
  'khristi-minority':       CrossChristian,  // christian cross
  'sikh-punjabi':           Khanda,          // sikh emblem
  'nabhik-samaj':           Scissors,        // barber scissors
  'maji-sainik':            MilitaryMedal,   // veteran medal
  'udyog-sahakar':          Handshake,       // cooperation
  'bandhkam-kamgar':        Bricklayer,      // mason
  'dakshin-bharat':         Gopuram,         // dravidian temple
  'telugu-samaj':           Gopuram,         // andhra/telugu temple style
  'kannada-samaj':          Palace,          // mysore palace
  'tamil-samaj':            Gopuram,         // tamil temple gopuram
  'kayde-vibhag':           Gavel,           // law gavel
  'adivasi-samaj':          TribalDrum,      // tribal drum (dhol)
  'alpsankhyak':            MultiFaith,      // multi-religion unity
  'grahak-sanrakshan':      ShoppingBag,     // consumer
  'jhopadpatti':            SlumCluster,     // shanty cluster
  'vjnt-vibhag':            People,          // community
  'vanjari-samaj':          BullockCart,     // caravan trader
  'doctor-sel':             Stethoscope,     // doctor
  'gruh-nivaran':           Apartment,       // housing
  'mehtar-balmiki':         BroomDustpan,    // sanitation worker
  'bhatkya-vimukta':        NomadTent,       // nomadic tent
  'shiv-lahusena':          BloodDrop,       // blood donation
  'shikshaketar-sena':      Building,        // school building
  'chitrapat-sena':         Clapperboard,    // movie slate
  'vyapari-sena':           Storefront,      // shop
  'nav-kranti-kamgar':      Anchor,          // sailor / maritime
  'anusuchit-jati':         Handraise,       // unity raised hands
  'rajya-udyog':            Factory,         // industry
  'gujarati-vibhag':        IndiaMap,        // generic regional outline
  'prasar-madhyam':         NewsMic,         // media
  'malyalam-samaj':         Houseboat,       // kerala boat
  'sindhi-samaj':           Diya,            // sindhi diaspora — diya for community
  'nepali-sena':            Khukuri,         // khukuri knife
  'shaskiya-karmachari':    IdBadge,         // govt employee badge
  'agri-koli':              FishingBoat,     // konkan fishermen
  'nirankari-mandal':       Lotus,           // spiritual lotus
  'sanrakshan-dal':         Shield,          // defence training
  'police-parivar':         PoliceShield,    // police shield
  'sainik-aghadi':          Soldier,         // saluting soldier
  'shivkalin-maidani':      Mallakhamb,      // mallakhamb pole sport
  'shivpratap-sena':        MarathaHelmet,   // maratha warrior helmet
  'mahila-saksham':         Woman,           // women empowerment
  'swayam-rojgar':          Lightbulb,       // entrepreneur idea
  'shiv-udyog-cell':        Factory,         // industry
  'dighe-nagari-sahaayata': HandHeart,       // civic aid helping hand

  /* ── सलंग्न सेना (18) ── */
  'rashtriya-karmachari':       IdBadge,        // employees badge
  'sahakar-sena':               Handshake,      // cooperative
  'shiv-kamgar':                HardHat,        // worker helmet
  'samarthya-sanghatana':       Strength,       // strength
  'bhartiya-kamgar-sanghatana': HardHat,        // workers union
  'jay-mh-mathadi':             HardHat,        // porter/labour
  'feriwala-sena':              Cart,           // hawker cart
  'mehtar-safai-cell':          BroomDustpan,   // sanitation
  'vahatuk-sena':               Truck,          // transport
  'charmodyog-kamgar':          CobblerShoe,    // leather worker
  'hindusthan-chitrapat':       FilmCamera,     // film camera
  'bhim-sena-foundation':       AshokaChakra,   // ashoka chakra
  'republican-charmkar':        CobblerShoe,    // cobbler
  'bhartiya-lokshakti':         Handraise,      // people power
  'cable-sena':                 Cable,          // cable wire
  'mahila-kamgar':              Woman,          // woman worker
  'rashtriya-kamgar-union':     FistRaised,     // labour fist
  'bandhkam-udyog':             Crane,          // construction crane
};

/* Public API: pass an org id, get a ready-to-render SVG element.
   Returns null when no theme matches so the caller can render
   its own fallback (the generic bow-and-arrow emblem). */
export function iconForOrgId(id) {
  const Cmp = ICON_BY_ID[id];
  return Cmp ? <Cmp /> : null;
}
