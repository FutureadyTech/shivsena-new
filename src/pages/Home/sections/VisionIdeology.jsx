import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './VisionIdeology.css';

const PILLAR_ICONS = {
  governance: (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 52 L55 52" />
      <path d="M11 52 L11 24 M30 52 L30 24 M49 52 L49 24" />
      <path d="M5 24 L55 24" />
      <path d="M30 8 L7 24 L53 24 Z" />
      <path d="M11 24 L11 21 M30 24 L30 21 M49 24 L49 21" strokeWidth="2.2" />
    </svg>
  ),
  unity: (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="15" cy="20" r="5.5" />
      <circle cx="30" cy="14" r="5.5" />
      <circle cx="45" cy="20" r="5.5" />
      <path d="M5 48 Q15 30 26 38" />
      <path d="M22 38 Q30 28 38 38" />
      <path d="M34 38 Q45 30 55 48" />
    </svg>
  ),
  progress: (
    <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 50 L20 35 L30 42 L48 18" />
      <polyline points="40 18 48 18 48 26" />
      <path d="M5 54 L55 54" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
};

export default function VisionIdeology() {
  const t = useContent(homeContent.vision);
  const headerRef = useScrollReveal(0.2);

  return (
    <section className="vision">
      <div className="vision__inner">
        <div ref={headerRef} className="vision__header reveal">
          <div className="vision__eyebrow">
            <span className="vision__eyebrow-line"></span>
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="vision__title">{t.title}</h2>
          <p className="vision__lede">{t.lede}</p>
        </div>

        <div className="vision__grid">
          {t.pillars?.map((p, i) => (
            <Card key={p.id} principle={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ principle, index }) {
  const ref = useScrollReveal(0.2);
  return (
    <article
      ref={ref}
      className="vision-card reveal"
      style={{ '--reveal-delay': `${index * 0.12}s` }}
    >
      <div className="vision-card__number">{principle.number}</div>
      <div className="vision-card__icon">{PILLAR_ICONS[principle.id] ?? PILLAR_ICONS.progress}</div>
      <h3 className="vision-card__title">{principle.title}</h3>
      <p className="vision-card__body">{principle.body}</p>
      <div className="vision-card__corner" aria-hidden="true"></div>
    </article>
  );
}