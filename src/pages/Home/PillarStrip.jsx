import { useT } from '../../i18n/LanguageContext.jsx';

const PILLARS = [
  {
    key: 'pillar-1',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L4 6 V12 C4 17 8 21 12 22 C16 21 20 17 20 12 V6 Z" />
        <path d="M9 12 L11 14 L15 10" />
      </svg>
    ),
  },
  {
    key: 'pillar-2',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17 Q12 5 21 17" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <polyline points="9 7 12 3 15 7" />
        <polyline points="9 21 12 17 15 21" />
      </svg>
    ),
  },
  {
    key: 'pillar-3',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21 V11 L6 8 V11 H10 V8 L14 8 V11 H18 V8 L21 11 V21 Z" />
        <line x1="3" y1="21" x2="21" y2="21" />
        <rect x="10" y="15" width="4" height="6" />
        <path d="M12 6 L12 4" />
        <path d="M11 4 L13 4 L12 2 Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'pillar-4',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="3" x2="6" y2="22" />
        <path d="M6 4 H19 L16 8 L19 12 H6 Z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function PillarStrip() {
  const t = useT();
  return (
    <div className="pillar-strip">
      <div className="pillar-strip__inner">
        {PILLARS.map((p) => (
          <div key={p.key} className="pillar">
            <div className="pillar__icon">{p.icon}</div>
            <div className="pillar__text">
              <div className="pillar__title">{t(`${p.key}-title`)}</div>
              <div className="pillar__sub">{t(`${p.key}-sub`)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}