import { useState, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import contactContent from '../../../content/contact.json';
import './ContactForm.css';

export default function ContactForm() {
  const t = useContent(contactContent.form);
  const headerRef = useScrollReveal(0.2);
  const formRef   = useScrollReveal(0.15);

  const [fields, setFields]       = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus]       = useState('idle'); // idle | submitting | success

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.phone || !fields.message) return;
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 900);
  }, [fields]);

  const reset = useCallback(() => {
    setFields({ name: '', phone: '', email: '', message: '' });
    setStatus('idle');
  }, []);

  return (
    <section className="cf-section">
      <div className="cf-section__inner">

        <div ref={headerRef} className="cf-section__header reveal">
          <div className="cf-section__eyebrow">
            <span className="cf-section__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="cf-section__title">{t.title}</h2>
          <p className="cf-section__lede">{t.lede}</p>
        </div>

        <div ref={formRef} className="cf-card reveal">
          {status !== 'success' ? (
            <form className="cf-form" onSubmit={onSubmit}>

              <div className="cf-row">
                <label className="cf-field">
                  <span className="cf-field__label">{t.labels.name}</span>
                  <input
                    type="text"
                    className="cf-field__input"
                    placeholder={t.placeholders.name}
                    value={fields.name}
                    onChange={update('name')}
                    required
                  />
                </label>

                <label className="cf-field">
                  <span className="cf-field__label">{t.labels.phone}</span>
                  <input
                    type="tel"
                    className="cf-field__input"
                    placeholder={t.placeholders.phone}
                    value={fields.phone}
                    onChange={update('phone')}
                    pattern="[0-9]{10}"
                    required
                  />
                </label>
              </div>

              <label className="cf-field">
                <span className="cf-field__label">{t.labels.email}</span>
                <input
                  type="email"
                  className="cf-field__input"
                  placeholder={t.placeholders.email}
                  value={fields.email}
                  onChange={update('email')}
                  required
                />
              </label>

              <label className="cf-field">
                <span className="cf-field__label">{t.labels.message}</span>
                <textarea
                  className="cf-field__input cf-field__input--area"
                  placeholder={t.placeholders.message}
                  value={fields.message}
                  onChange={update('message')}
                  rows={5}
                  required
                />
              </label>

              <button
                type="submit"
                className="cf-submit"
                disabled={status === 'submitting'}
                data-cursor="link"
              >
                <span>{status === 'submitting' ? t.submitting : t.submitLabel}</span>
                {status !== 'submitting' && (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            </form>
          ) : (
            <div className="cf-success">
              <div className="cf-success__tick" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="cf-success__title">{t.successTitle}</h3>
              <p className="cf-success__msg">{t.successMessage}</p>
              <button type="button" className="cf-success__reset" onClick={reset} data-cursor="link">
                {t.resetLabel}
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
