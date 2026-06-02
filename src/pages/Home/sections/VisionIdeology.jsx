import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './VisionIdeology.css';

/* Pillar icons Flaticon assets dropped into /public/icons/.
 governance.png  → Freepik "Government" (Flaticon id 1582292)
 unity.png → Freepik "Social justice" (Flaticon id 10554213)
 progress.png → Freepik "Career development" (Flaticon id 17652288) */
const PILLAR_ICONS = {
  /* New (2-card layout): ध्येय / धोरण — custom SVG line icons.
     Recoloured to saffron via the .vision-card__icon-img filter. */
  dhyey:  <img src="/icons/mission.svg"  alt="" className="vision-card__icon-img" />,
  dhoran: <img src="/icons/strategy.svg" alt="" className="vision-card__icon-img" />,
  /* Legacy keys kept for safety in case any content still uses them */
  governance: <img src="/icons/governance.png" alt="" className="vision-card__icon-img" />,
  unity:      <img src="/icons/unity.png"      alt="" className="vision-card__icon-img" />,
  progress:   <img src="/icons/progress.png"   alt="" className="vision-card__icon-img" />,
};

export default function VisionIdeology() {
  const t = useContent(homeContent.vision);
  const headerRef = useScrollReveal(0.2);

  return (
 <section className="vision">
 <div className="vision__inner">
 <div ref={headerRef} className="vision__header reveal">
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
 <div className="vision-card__icon" aria-hidden="true">
 {PILLAR_ICONS[principle.id] ?? PILLAR_ICONS.progress}
 </div>
 <h3 className="vision-card__title">{principle.title}</h3>
 <p className="vision-card__body">{principle.body}</p>
 <div className="vision-card__corner" aria-hidden="true"></div>
 </article>
  );
}