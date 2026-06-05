import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import shivsenajanmaContent from '../../../content/shivsenajanma.json';
import './ShivSenaJanmaArticle.css';

/* ─────────────────────────────────────────────────────────────
 Image per block, in source order. The content blocks in
 shivsenajanma.json carry the kicker + paragraph; the
 imagery + crop hints live here so the client can swap them
 without touching the prose.
 ─────────────────────────────────────────────────────────── */
const BLOCK_IMAGES = [
  {
    image: '/shivsena-janma/%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80%20%E0%A4%AE%E0%A4%BE%E0%A4%A3%E0%A4%B8%E0%A4%BE%E0%A4%9A%E0%A5%8D%E0%A4%AF%E0%A4%BE%20%E0%A4%B5%E0%A5%87%E0%A4%A6%E0%A4%A8%E0%A5%87%E0%A4%A4%E0%A5%82%E0%A4%A8%20%E0%A4%9C%E0%A4%A8%E0%A5%8D%E0%A4%AE%E0%A4%B2%E0%A5%87%E0%A4%B2%E0%A5%80%20%E0%A4%9A%E0%A4%B3%E0%A4%B5%E0%A4%B3.webp',
    alt: 'मराठी माणसाच्या वेदनेतून जन्मलेली चळवळ',
    objectPosition: 'center center',
  },
  {
    image: '/shivsena-janma/%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%BF%E0%A4%95%E0%A4%AE%E0%A4%A7%E0%A5%82%E0%A4%A8%20%E0%A4%89%E0%A4%A0%E0%A4%B2%E0%A4%BE%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80%20%E0%A4%86%E0%A4%B5%E0%A4%BE%E0%A4%9C.webp',
    alt: '‘मार्मिक’मधून उठला मराठी आवाज',
    objectPosition: 'center center',
  },
  {
    image: '/shivsena-janma/%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%82%E0%A4%97%E0%A4%9A%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%A4%E0%A5%87%20%E0%A4%9C%E0%A4%A8%E0%A4%A4%E0%A5%87%E0%A4%9A%E0%A4%BE%20%E0%A4%A8%E0%A5%87%E0%A4%A4%E0%A4%BE.webp',
    alt: 'व्यंगचित्रकार ते जनतेचा नेता',
    objectPosition: 'center center',
  },
  {
    image: '/shivsena-janma/%E0%A4%B8%E0%A4%82%E0%A4%98%E0%A4%9F%E0%A4%A8%E0%A5%87%E0%A4%9A%E0%A5%80%20%E0%A4%97%E0%A4%B0%E0%A4%9C%20%E0%A4%86%E0%A4%A3%E0%A4%BF%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%AC%E0%A5%8B%E0%A4%A7%E0%A4%A8%E0%A4%95%E0%A4%BE%E0%A4%B0%E0%A4%BE%E0%A4%82%E0%A4%9A%E0%A5%87%20%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%97%E0%A4%A6%E0%A4%B0%E0%A5%8D%E0%A4%B6%E0%A4%A8.webp',
    alt: 'संघटनेची गरज आणि प्रबोधनकारांचे मार्गदर्शन',
    objectPosition: 'center center',
  },
  {
    image: '/shivsena-janma/%E0%A5%A7%E0%A5%AF%20%E0%A4%9C%E0%A5%82%E0%A4%A8%20%E0%A5%A7%E0%A5%AF%E0%A5%AC%E0%A5%AC%20%20%E0%A4%B6%E0%A4%BF%E0%A4%B5%E0%A4%B8%E0%A5%87%E0%A4%A8%E0%A5%87%E0%A4%9A%E0%A4%BE%20%E0%A4%9C%E0%A4%A8%E0%A5%8D%E0%A4%AE.webp',
    alt: '१९ जून १९६६ : शिवसेनेचा जन्म',
    objectPosition: 'center center',
  },
  {
    image: '/shivsena-janma/%E0%A4%B6%E0%A4%BF%E0%A4%B5%E0%A4%B8%E0%A5%87%E0%A4%A8%E0%A4%BE%E2%80%99%20%E0%A4%A8%E0%A4%BE%E0%A4%B5%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%97%E0%A5%80%E0%A4%B2%20%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A5%87%E0%A4%B0%E0%A4%A3%E0%A4%BE.webp',
    alt: '‘शिवसेना’ नावामागील प्रेरणा',
    objectPosition: 'center center',
  },
  {
    image: '/shivsena-janma/%E0%A4%A6%E0%A4%B8%E0%A4%B0%E0%A4%BE%20%E0%A4%AE%E0%A5%87%E0%A4%B3%E0%A4%BE%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%A4%E0%A5%82%E0%A4%A8%20%E0%A4%89%E0%A4%AD%E0%A5%80%20%E0%A4%B0%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%B2%E0%A5%87%E0%A4%B2%E0%A5%80%20%E0%A4%9C%E0%A4%A8%E0%A4%B6%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A5%80.webp',
    alt: 'दसरा मेळाव्यातून उभी राहिलेली जनशक्ती',
    objectPosition: 'center center',
  },
];

export default function ShivSenaJanmaArticle() {
  const t = useContent(shivsenajanmaContent.article);
  const blocks = Array.isArray(t.blocks) ? t.blocks : [];

  return (
 <section className="ssj-article">

 {/* soft saffron ambient glows */}
 <span className="ssj-article__glow ssj-article__glow--tl" aria-hidden="true" />
 <span className="ssj-article__glow ssj-article__glow--br" aria-hidden="true" />

 <div className="ssj-article__inner">

 {/* ── Alternating story blocks ── */}
 <ol className="ssj-article__list">
 {blocks.map((b, i) => (
 <StoryBlock
 key={i}
 index={i}
 kicker={b.kicker}
 text={b.text}
 imageMeta={BLOCK_IMAGES[i] || BLOCK_IMAGES[BLOCK_IMAGES.length - 1]}
 />
 ))}
 </ol>


 </div>
 </section>
  );
}

/* ── One alternating block: image + paragraph ── */
function StoryBlock({ index, kicker, text, imageMeta }) {
  const ref = useScrollReveal(0.15);
  const orientation = index % 2 === 0 ? 'left' : 'right';

  return (
 <li
 ref={ref}
 className={`ssj-block ssj-block--${orientation} reveal`}
 style={{ '--reveal-delay': `${0.05 + (index % 2) * 0.06}s` }}
 >
 {/* ─── Image ─── */}
 <div className={`ssj-block__media${imageMeta.fit === 'contain' ? ' ssj-block__media--contain' : ''}`}>
 <img
 src={imageMeta.image}
 alt={imageMeta.alt}
 loading="lazy"
 style={{ objectPosition: imageMeta.objectPosition || 'center top' }}
 />
 </div>

 {/* ─── Body ─── */}
 <div className="ssj-block__body">
 {kicker && <span className="ssj-block__kicker">{kicker}</span>}
 {(Array.isArray(text) ? text : [text]).map((para, pi) => (
 <p key={pi} className="ssj-block__text">{para}</p>
 ))}
 </div>
 </li>
  );
}

