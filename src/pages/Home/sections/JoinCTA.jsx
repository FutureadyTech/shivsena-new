import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import './JoinCTA.css';

export default function JoinCTA() {
  const t = useContent(homeContent.joinCta);
  const headerRef = useScrollReveal(0.25);
  const formRef = useScrollReveal(0.25);

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
 <div className="join__inner">

 <div ref={headerRef} className="join__header reveal">
 {t.eyebrow && (
 <div className="join__eyebrow">
 <span className="join__eyebrow-line"></span>
 <span>{t.eyebrow}</span>
 <span className="join__eyebrow-line"></span>
 </div>
 )}
 <h2 className="join__title">{t.title}</h2>
 <p className="join__lede">{t.lede}</p>
 </div>

 {status === 'success' ? (
 <div ref={formRef} className="join__form reveal">
 <p className="join__success">{t.successMessage}</p>
 </div>
 ) : (
 <>
 <form ref={formRef} className="join__form reveal" onSubmit={onSubmit}>
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
 </form>
 <p className="join__privacy">{t.privacyNote}</p>
 </>
 )}

 </div>
 </section>
  );
}
