import { useT } from '../../i18n/LanguageContext.jsx';

export default function ScrollSections() {
  const t = useT();

  return (
    <main className="scroll-track">

      {/* Section 1: Hero entrance (text removed — visual-only) */}
      <section className="scroll-section" data-section="0">
        <div className="scroll-cue">
          <div className="scroll-cue-line"></div>
          <div className="scroll-cue-text">{t('scroll-cue')}</div>
        </div>
      </section>

      {/* Section 2: Walking inside */}
      <section className="scroll-section" data-section="1">
        <div className="section-prompt">
          <div className="num">II · दरबार</div>
          <div className="label">{t('s2-label')}</div>
          <div className="label-en">{t('s2-label-en')}</div>
        </div>
      </section>

      {/* Section 3: Panel 1 — History */}
      <section className="scroll-section" data-section="2">
        <div className="wall-readout">
          <span className="chapter-num">CHAPTER · 01</span>
          <h2 className="chapter-title">{t('p1-title')}</h2>
          <div className="chapter-title-en">{t('p1-title-en')}</div>
          <p className="chapter-body">{t('p1-body')}</p>
          <a href="#" className="chapter-cta">{t('p1-cta')}</a>
        </div>
      </section>

      {/* Section 4: Panel 2 — Leadership */}
      <section className="scroll-section" data-section="3">
        <div className="wall-readout">
          <span className="chapter-num">CHAPTER · 02</span>
          <h2 className="chapter-title">{t('p2-title')}</h2>
          <div className="chapter-title-en">{t('p2-title-en')}</div>
          <p className="chapter-body">{t('p2-body')}</p>
          <a href="#" className="chapter-cta">{t('p2-cta')}</a>
        </div>
      </section>

      {/* Section 5: Panel 3 — Join (renumbered to Chapter 03 after Vision was removed) */}
      <section className="scroll-section" data-section="4">
        <div className="wall-readout">
          <span className="chapter-num">CHAPTER · 03</span>
          <h2 className="chapter-title">{t('p4-title')}</h2>
          <div className="chapter-title-en">{t('p4-title-en')}</div>
          <p className="chapter-body">{t('p4-body')}</p>
          <a href="#" className="chapter-cta">{t('p4-cta')}</a>
        </div>
      </section>

    </main>
  );
}