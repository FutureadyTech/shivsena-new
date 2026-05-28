import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import innovativeContent from '../../../content/innovative.json';
import './InnovativePrograms.css';

export default function InnovativePrograms() {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';
  const intro = useContent(innovativeContent.intro);
  const headerRef = useScrollReveal(0.2);
  const programs = innovativeContent.programs || [];

  return (
    <section className="inn">
      <div className="inn__inner">

        {/* ── Intro ── */}
        <div ref={headerRef} className="inn__header reveal">
          <div className="inn__eyebrow">
            <span className="inn__eyebrow-line" />
            <span>{intro.eyebrow}</span>
          </div>
          <h2 className="inn__title">{intro.title}</h2>
          <p className="inn__lede">{intro.lede}</p>
        </div>

        {/* ── Programs (alternating layout) ── */}
        <ol className="inn__programs">
          {programs.map((p, i) => (
            <Program key={p.id} program={p} index={i} lang={lang} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Program({ program, index, lang }) {
  const ref = useScrollReveal(0.15);
  const data = program[lang] || program.en || program.mr;
  const orientation = index % 2 === 0 ? 'left' : 'right';

  return (
    <li
      ref={ref}
      className={`inn-prog inn-prog--${orientation} reveal`}
    >
      <div className="inn-prog__media">
        <img
          src={program.image}
          alt={program.imageAlt || data.title}
          loading="lazy"
        />
        <span className="inn-prog__media-glow" aria-hidden="true" />
      </div>

      <div className="inn-prog__body">
        <span className="inn-prog__tag">{data.tag}</span>
        <h3 className="inn-prog__title">{data.title}</h3>
        {data.tagline && <p className="inn-prog__tagline">{data.tagline}</p>}
        <p className="inn-prog__text">{data.body}</p>

        {Array.isArray(data.highlights) && data.highlights.length > 0 && (
          <ul className="inn-prog__highlights">
            {data.highlights.map((h, i) => (
              <li key={i} className="inn-prog__highlight">
                <span className="inn-prog__highlight-dot" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
