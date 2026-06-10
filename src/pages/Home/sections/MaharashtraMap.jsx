import { MH_DISTRICT_PATHS, MH_VIEWBOX } from './districtPaths.js';
import { DISTRICTS } from '../../../config/districts.js';

/* Per-district orange heat-tints, matching the reference district map.
   Darker districts (Dhule, Satara, Sindhudurg, Bhandara, Thane, Hingoli)
   and the lighter ones (Jalgaon, Amravati, Yavatmal, Gadchiroli …) are
   hand-tuned so the in-app map reads like the printed reference. */
export const DISTRICT_FILL = {
  // Konkan
  mumbai: '#e07d1e', thane: '#d77f2c', palghar: '#f6c98a',
  raigad: '#ef9a3a', ratnagiri: '#e8852a', sindhudurg: '#c47a2a',
  // Pune
  pune: '#f0982f', satara: '#b5722a', sangli: '#e8852a',
  kolhapur: '#df7d1f', solapur: '#f4b265',
  // Nashik
  nashik: '#e07d1e', dhule: '#b5722a', nandurbar: '#f0982f',
  jalgaon: '#f7c98a', ahmadnagar: '#f4b061',
  // Marathwada
  aurangabad: '#f0982f', jalna: '#f6c075', beed: '#ef8f2a',
  latur: '#ef9a3a', dharashiv: '#f6c885', nanded: '#e8852a',
  hingoli: '#d27b2a', parbhani: '#ef9a3a',
  // Amravati
  amravati: '#f8cf95', akola: '#ee9a3a', buldhana: '#ef9430',
  washim: '#ec8f2a', yavatmal: '#f7c685',
  // Vidarbha
  nagpur: '#f0982f', wardha: '#f0a040', chandrapur: '#e8852a',
  gadchiroli: '#f7c07a', bhandara: '#b5722a', gondia: '#ef9a3a',
};

const FALLBACK_FILL = '#ef9a3a';
const FONT = 15;

/* Split long district names onto two lines (e.g. छत्रपती संभाजीनगर). */
function wrapName(name) {
  if (name.length <= 11 || !name.includes(' ')) return [name];
  const parts = name.split(' ');
  if (parts.length === 2) return parts;
  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')];
}

/* The map SVG body — accurate district polygons + red HQ dots + Marathi
   labels. Shared by the home Region Explorer and the Leadership Region Map
   so both render the identical reference design. */
export default function MaharashtraMap({ activeDistrict, onSelect, lang = 'mr', className }) {
  return (
    <svg viewBox={MH_VIEWBOX} xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Maharashtra district map">
      {/* District fills */}
      {MH_DISTRICT_PATHS.map(({ slug, d }) => {
        const meta = DISTRICTS[slug];
        if (!meta) return null;
        const isActive = slug === activeDistrict;
        return (
          <path
            key={slug}
            d={d}
            className={`mh-district ${isActive ? 'mh-district--active' : ''}`}
            style={{ fill: FALLBACK_FILL }}
            onClick={() => onSelect?.(slug)}
          >
            <title>{meta[lang] || meta.en || slug}</title>
          </path>
        );
      })}

    </svg>
  );
}
