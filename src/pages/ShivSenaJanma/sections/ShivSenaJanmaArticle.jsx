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
 image: '/timeline/image-12.png',
 alt: 'बाळासाहेब ठाकरे मार्मिकचे संस्थापक',
 objectPosition: 'center center',
  },
  {
 image: '/timeline/main.png',
 alt: 'मार्मिक साप्ताहिक',
 objectPosition: 'center center',
  },
  {
 image: '/timeline/image-5.png',
 alt: 'संघटना की पक्ष?',
 objectPosition: 'center center',
  },
  {
 image: '/timeline/image-10.png',
 alt: 'प्रबोधनकार ठाकरे',
 objectPosition: 'center center',
  },
  {
 image: '/timeline/image-4.png',
 alt: '१९ जून १९६६ · स्थापना',
 objectPosition: 'center center',
  },
  {
 image: '/timeline/image-3.png',
 alt: 'शिवसेना नाव',
 objectPosition: 'center center',
  },
  {
 image: '/timeline/image-1.png',
 alt: '३० ऑक्टोबर १९६६ · पहिला दसरा मेळावा',
 objectPosition: 'center top',
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
 <p className="ssj-block__text">{text}</p>
 </div>
 </li>
  );
}

