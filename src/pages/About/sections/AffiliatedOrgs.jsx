import { useState, useEffect, useCallback } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import aboutContent from '../../../content/about.json';
import './AffiliatedOrgs.css';

const ORG_ICONS = {
  bks:       <PathIcon><path d="M16 4 L4 10 V20 L16 26 L28 20 V10 Z" /><path d="M4 10 L16 16 L28 10" /><path d="M16 16 V26" /></PathIcon>,
  sls:       <PathIcon><circle cx="16" cy="11" r="5" /><path d="M5 27 Q5 18 16 18 Q27 18 27 27" /></PathIcon>,
  yuva:      <PathIcon><path d="M16 5 L19 12 L26 12 L20 17 L22 25 L16 20 L10 25 L12 17 L6 12 L13 12 Z" /></PathIcon>,
  bvs:       <PathIcon><path d="M3 11 L16 5 L29 11 L16 17 Z" /><path d="M8 13 V21 Q16 26 24 21 V13" /><line x1="29" y1="11" x2="29" y2="20" /></PathIcon>,
  mahila:    <PathIcon><circle cx="16" cy="11" r="6" /><path d="M16 17 V27" /><path d="M10 22 H22" /></PathIcon>,
  udyog:     <PathIcon><rect x="4" y="11" width="24" height="16" rx="2" /><path d="M11 11 V7 Q11 5 13 5 H19 Q21 5 21 7 V11" /><line x1="4" y1="18" x2="28" y2="18" /></PathIcon>,
  shikshak:  <PathIcon><path d="M3 11 L16 5 L29 11 L16 17 Z" /><path d="M22 14 V22" /><circle cx="22" cy="23" r="1.5" /></PathIcon>,
  chitrapat: <PathIcon><rect x="4" y="7" width="24" height="18" rx="1.5" /><line x1="4" y1="12" x2="28" y2="12" /><line x1="4" y1="20" x2="28" y2="20" /><circle cx="8" cy="9.5" r="0.8" /><circle cx="12" cy="9.5" r="0.8" /><circle cx="20" cy="9.5" r="0.8" /><circle cx="24" cy="9.5" r="0.8" /></PathIcon>,
  arogya:    <PathIcon><path d="M16 4 Q9 4 9 11 Q9 18 16 28 Q23 18 23 11 Q23 4 16 4 Z" /><line x1="16" y1="10" x2="16" y2="18" /><line x1="12" y1="14" x2="20" y2="14" /></PathIcon>,
};

function PathIcon({ children }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export default function AffiliatedOrgs() {
  const t = useContent(aboutContent.affiliated);
  const headerRef = useScrollReveal(0.25);
  const [selectedOrg, setSelectedOrg] = useState(null);

  return (
    <section className="affiliated">
      <div className="affiliated__inner">

        <div ref={headerRef} className="affiliated__header reveal">
          <div className="affiliated__eyebrow">
            <span className="affiliated__eyebrow-line" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="affiliated__title">{t.title}</h2>
          <p className="affiliated__lede">{t.lede}</p>
        </div>

        <div className="affiliated__grid">
          {t.orgs?.map((org, i) => (
            <OrgCard
              key={org.id}
              org={org}
              index={i}
              joinLabel={t.joinLabel}
              onJoin={() => setSelectedOrg(org)}
            />
          ))}
        </div>

      </div>

      {selectedOrg && (
        <JoinModal
          org={selectedOrg}
          form={t.form}
          onClose={() => setSelectedOrg(null)}
        />
      )}
    </section>
  );
}

/* ── Card ──────────────────────────────────────────────────── */
function OrgCard({ org, index, joinLabel, onJoin }) {
  const ref = useScrollReveal(0.15);
  const icon = ORG_ICONS[org.id] ?? ORG_ICONS.yuva;

  return (
    <article
      ref={ref}
      className="org-card reveal"
      style={{ '--reveal-delay': `${0.05 + (index % 3) * 0.08}s` }}
    >
      <div className="org-card__head">
        <div className="org-card__icon" aria-hidden="true">{icon}</div>
        <span className="org-card__tag">{org.tag}</span>
      </div>

      <h3 className="org-card__name">{org.name}</h3>
      <p className="org-card__body">{org.body}</p>

      <button
        type="button"
        className="org-card__join"
        onClick={onJoin}
        data-cursor="link"
      >
        <span>{joinLabel}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </article>
  );
}

/* ── Modal Form (shared across all orgs) ───────────────────── */
function JoinModal({ org, form, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [fields, setFields] = useState({ name: '', email: '', phone: '', city: '' });

  /* Body scroll lock + ESC close */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.phone) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  }, [fields]);

  return (
    <div className="org-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="org-modal__panel" onClick={(e) => e.stopPropagation()}>

        <button
          type="button"
          className="org-modal__close"
          onClick={onClose}
          aria-label={form.closeLabel}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <header className="org-modal__head">
              <span className="org-modal__eyebrow">{org.tag}</span>
              <h3 className="org-modal__title">{form.title}</h3>
              <p className="org-modal__subtitle">{form.subtitle}</p>
            </header>

            <form className="org-modal__form" onSubmit={handleSubmit}>
              <label className="org-field">
                <span className="org-field__label">{form.labels.organization}</span>
                <input
                  type="text"
                  className="org-field__input org-field__input--readonly"
                  value={org.name}
                  readOnly
                />
              </label>

              <label className="org-field">
                <span className="org-field__label">{form.labels.name}</span>
                <input
                  type="text"
                  className="org-field__input"
                  placeholder={form.placeholders.name}
                  value={fields.name}
                  onChange={update('name')}
                  required
                />
              </label>

              <div className="org-field-row">
                <label className="org-field">
                  <span className="org-field__label">{form.labels.email}</span>
                  <input
                    type="email"
                    className="org-field__input"
                    placeholder={form.placeholders.email}
                    value={fields.email}
                    onChange={update('email')}
                    required
                  />
                </label>

                <label className="org-field">
                  <span className="org-field__label">{form.labels.phone}</span>
                  <input
                    type="tel"
                    className="org-field__input"
                    placeholder={form.placeholders.phone}
                    value={fields.phone}
                    onChange={update('phone')}
                    pattern="[0-9]{10}"
                    required
                  />
                </label>
              </div>

              <label className="org-field">
                <span className="org-field__label">{form.labels.city}</span>
                <input
                  type="text"
                  className="org-field__input"
                  placeholder={form.placeholders.city}
                  value={fields.city}
                  onChange={update('city')}
                />
              </label>

              <button
                type="submit"
                className="org-modal__submit"
                disabled={submitting}
                data-cursor="link"
              >
                {submitting ? form.submitting : form.submitLabel}
                {!submitting && (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="org-modal__success">
            <div className="org-modal__success-tick" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="org-modal__success-title">{form.successTitle}</h3>
            <p className="org-modal__success-msg">{form.successMessage}</p>
            <button type="button" className="org-modal__success-close" onClick={onClose}>
              {form.closeLabel}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
