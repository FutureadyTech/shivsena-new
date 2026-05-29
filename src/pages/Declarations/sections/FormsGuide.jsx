import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import declarationsContent from '../../../content/declarations.json';
import './FormsGuide.css';

/* One icon per step paired with the body copy */
const STEP_ICONS = [
  /* 1 Document with signature (nomination / C2) */
  <svg key="s1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
 <polyline points="14 3 14 9 20 9" />
 <path d="M8 14 c1.5 -1.6 3.5 -1.6 5 0 c1.5 1.6 3.5 1.6 5 0" />
 <line x1="8" y1="18" x2="14" y2="18" />
  </svg>,
  /* 2 Megaphone (campaign / model code) */
  <svg key="s2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <path d="M3 11 v2 a1 1 0 0 0 1 1 H7 L18 20 V4 L7 10 H4 a1 1 0 0 0 -1 1 Z" />
 <path d="M10 16 v3 a2 2 0 0 0 4 0 v-1" />
 <path d="M21 9 a4 4 0 0 1 0 6" />
  </svg>,
  /* 3 Ledger / accounts (results / C7) */
  <svg key="s3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
 <rect x="3" y="4" width="18" height="16" rx="2" />
 <line x1="3" y1="10" x2="21" y2="10" />
 <line x1="8" y1="4"  x2="8"  y2="20" />
 <path d="M12 14 h6 M12 17 h4" />
 <path d="M13 7.5 v-1 M15 7.5 v-1 M17 7.5 v-1" />
  </svg>,
];

export default function FormsGuide() {
  const t = useContent(declarationsContent.formsGuide);
  const headerRef = useScrollReveal(0.2);

  return (
 <section className="fguide">
 <div className="fguide__inner">

 <div ref={headerRef} className="fguide__header reveal">
 <div className="fguide__eyebrow">
 <span className="fguide__eyebrow-line" />
 <span>{t.eyebrow}</span>
 </div>
 <h2 className="fguide__title">{t.title}</h2>
 <p className="fguide__lede">{t.lede}</p>
 </div>

 <ol className="fguide__steps">
 {t.steps.map((step, i) => (
 <Step
 key={i}
 num={step.num}
 title={step.title}
 body={step.body}
 icon={STEP_ICONS[i] || STEP_ICONS[0]}
 index={i}
 isLast={i === t.steps.length - 1}
 />
 ))}
 </ol>

 </div>
 </section>
  );
}

function Step({ num, title, body, icon, index, isLast }) {
  const ref = useScrollReveal(0.18);
  return (
 <li
 ref={ref}
 className="fstep reveal"
 style={{ '--step-delay': `${0.05 + index * 0.12}s` }}
 >
 <div className="fstep__inner">
 <div className="fstep__icon" aria-hidden="true">{icon}</div>
 <span className="fstep__num">{num}</span>
 <h3 className="fstep__title">{title}</h3>
 <p className="fstep__body">{body}</p>
 </div>
 {!isLast && <span className="fstep__connector" aria-hidden="true" />}
 </li>
  );
}
