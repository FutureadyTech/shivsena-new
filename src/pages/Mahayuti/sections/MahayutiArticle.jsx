import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import mahayutiContent from '../../../content/mahayuti.json';
import './MahayutiArticle.css';

/* ─────────────────────────────────────────────────────────────
 Image + era-kicker pairing for each paragraph in mahayuti.json.
 Index matches the paragraph index.
 ─────────────────────────────────────────────────────────── */
const BLOCKS = [
  {
 image: '/mahayuti/payabharani.webp',
 alt: 'पायाभरणी हिंदुहृदयसम्राट बाळासाहेब ठाकरे',
 objectPosition: 'center center',
 kicker: { mr: 'पायाभरणी', en: 'Foundation' },
  },
  {
 image: '/mahayuti/vatchal.webp',
 alt: 'युतीची वाटचाल',
 objectPosition: 'center center',
 kicker: { mr: 'वाटचाल', en: 'The Rift' },
  },
  {
 image: '/mahayuti/nave.webp',
 alt: 'नवे नेतृत्व',
 objectPosition: 'center center',
 kicker: { mr: 'नवे नेतृत्व', en: 'New Leadership' },
  },
  {
 image: '/mahayuti/aitihasik.webp',
 alt: 'महायुती २०२४',
 objectPosition: 'center 30%',
 kicker: { mr: 'ऐतिहासिक विजय', en: 'Historic Victory' },
  },
];

export default function MahayutiArticle() {
  const { lang: language } = useLanguage();
  const lang = language === 'mr' ? 'mr' : 'en';
  const t = useContent(mahayutiContent.article);

  const paragraphs = Array.isArray(t.paragraphs) ? t.paragraphs : [];
  const blocks = paragraphs.map((text, i) => ({
 text,
 meta: BLOCKS[i] || BLOCKS[BLOCKS.length - 1],
  }));

  return (
 <section className="my-article">

 {/* soft ambient glows */}
 <span className="my-article__glow my-article__glow--tl" aria-hidden="true" />
 <span className="my-article__glow my-article__glow--br" aria-hidden="true" />

 <div className="my-article__inner">

 {/* ── Alternating story blocks ── */}
 <ol className="my-article__list">
 {blocks.map((b, i) => (
 <StoryBlock
 key={i}
 index={i}
 text={b.text}
 meta={b.meta}
 lang={lang}
 />
 ))}
 </ol>

 {/* Closing flourish */}
 <div className="my-article__flourish" aria-hidden="true">
 <span className="my-article__flourish-line" />
 <span className="my-article__flourish-mark">॥</span>
 <span className="my-article__flourish-line" />
 </div>

 </div>
 </section>
  );
}

/* ── One alternating block: image on one side, paragraph on the other. ── */
function StoryBlock({ index, text, meta, lang }) {
  const ref = useScrollReveal(0.15);
  const orientation = index % 2 === 0 ? 'left' : 'right';

  return (
 <li
 ref={ref}
 className={`my-block my-block--${orientation} reveal`}
 style={{ '--reveal-delay': `${0.05 + (index % 2) * 0.06}s` }}
 >
 {/* ─── Image ─── */}
 <div className="my-block__media">
 <img
 src={meta.image}
 alt={meta.alt}
 loading="lazy"
 style={{ objectPosition: meta.objectPosition || 'center top' }}
 />
 </div>

 {/* ─── Body ─── */}
 <div className="my-block__body">
 <span className="my-block__kicker">{meta.kicker[lang]}</span>
 <p className="my-block__text">{text}</p>
 </div>
 </li>
  );
}

