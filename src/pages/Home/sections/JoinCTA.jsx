import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './JoinCTA.css';

// Icons stay in component — not content
const BENEFIT_ICONS = {
  voice: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11 V21 L11 21 L18 27 V5 L11 11 Z" />
      <path d="M22 11 Q25 16 22 21" />
      <path d="M26 7 Q31 16 26 25" />
    </svg>
  ),
  initiatives: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M5 28 Q5 18 16 18 Q27 18 27 28" />
      <path d="M10 8 L22 8" strokeDasharray="1 2" />
    </svg>
  ),
  informed: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="24" height="20" rx="1" />
      <line x1="8" y1="12" x2="24" y2="12" />
      <line x1="8" y1="16" x2="20" y2="16" />
      <line x1="8" y1="20" x2="22" y2="20" />
    </svg>
  ),
};

export default function JoinCTA() {
  const t = useContent(homeContent.joinCta);
  const headerRef = useScrollReveal(0.25);
  const formRef = useScrollReveal(0.25);
  const benefitsRef = useScrollReveal(0.15);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('success');
    setTimeout(() => { setEmail(''); setStatus('idle'); }, 4000);
  };

  return (
    <section className="join" id="join">
      <div className="join__pattern" aria-hidden="true"></div>
      <div className="join__inner">

        <div ref={headerRef} className="join__header reveal">
          <div className="join__eyebrow">
            <span className="join__eyebrow-line"></span>
            <span>{t.eyebrow}</span>
            <span className="join__eyebrow-line"></span>
          </div>
          <h2 className="join__title">{t.title}</h2>
          <p className="join__lede">{t.lede}</p>
        </div>

        <form ref={formRef} className="join__form reveal" onSubmit={onSubmit}>
          {status === 'success' ? (
            <p className="join__success">{t.successMessage}</p>
          ) : (
            <>
              <input
                type="email"
                className="join__email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label={t.emailPlaceholder}
              />
              <button type="submit" className="join__submit" data-cursor="link">
                {t.submitLabel}
              </button>
              <p className="join__privacy">{t.privacyNote}</p>
            </>
          )}
        </form>

        <div ref={benefitsRef} className="join__benefits reveal">
          {t.benefits?.map((benefit) => (
            <div key={benefit.id} className="join__benefit">
              <div className="join__benefit-icon" aria-hidden="true">
                {BENEFIT_ICONS[benefit.id] ?? BENEFIT_ICONS.informed}
              </div>
              <h4 className="join__benefit-title">{benefit.title}</h4>
              <p className="join__benefit-body">{benefit.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
