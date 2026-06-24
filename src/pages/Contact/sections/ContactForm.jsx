/* ═══════════════════════════════════════════════════════════════
 CONTACT FORM Shiv Sena Membership Registration
 On successful registration, generates a downloadable PDF ID
 card via html2canvas + jsPDF. Client-side only no backend.
═══════════════════════════════════════════════════════════════ */
import { useState, useRef, useCallback, useMemo } from 'react';
import { useScrollReveal } from '../../Home/hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import { useLanguage } from '../../../i18n/LanguageContext.jsx';
import contactContent from '../../../content/contact.json';
import IdCard from './IdCard.jsx';
import {
  generateIdCardPdf,
  generateMemberId,
  todayFormatted,
  fileToDataUrl,
  ageFromDob,
} from './generateIdCardPdf.js';
import './ContactForm.css';

const INITIAL_FIELDS = {
  name: '',
  phone: '',
  email: '',
  address: '',
  district: '',
  dob: '',
  gender: '',
  occupation: '',
  photoFile: null,
  photoDataUrl: '',
};

export default function ContactForm() {
  const t = useContent(contactContent.form);
  const { lang } = useLanguage();
  const isMr = lang === 'mr';

  const headerRef = useScrollReveal(0.2);
  const formRef = useScrollReveal(0.15);

  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [cardData, setCardData] = useState(null);

  const cardRef = useRef(null);

  const update = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const onPhotoChange = useCallback(async (e) => {
 const file = e.target.files?.[0];
 if (!file) {
 setFields((f) => ({ ...f, photoFile: null, photoDataUrl: '' }));
 return;
 }
 try {
 const dataUrl = await fileToDataUrl(file);
 setFields((f) => ({ ...f, photoFile: file, photoDataUrl: dataUrl }));
 } catch (err) {
 setErrorMsg(
 err.message === 'photo-too-large'
 ? (isMr ? 'चित्र 2 MB पेक्षा मोठे आहे.' : 'Photo exceeds 2 MB limit.')
 : (isMr ? 'चित्र वाचता आले नाही.' : 'Could not read photo.')
 );
 }
  }, [isMr]);

  const buildCardData = useCallback(() => {
 const dob = fields.dob || '';
 const age = ageFromDob(dob);

 // Format DOB nicely for display (DD/MM/YYYY)
 let dobDisplay = '';
 if (dob) {
 const [y, m, d] = dob.split('-');
 dobDisplay = `${d}/${m}/${y}`;
 if (isMr) {
 const map = ['०','१','२','३','४','५','६','७','८','९'];
 dobDisplay = dobDisplay.replace(/\d/g, (n) => map[Number(n)] ?? n);
 }
 }

 return {
 memberId: generateMemberId(),
 issuedDate: todayFormatted(isMr),
 name: fields.name.trim(),
 phone: fields.phone.trim(),
 email: fields.email.trim(),
 address: fields.address.trim(),
 district: fields.district.trim(),
 dob: dobDisplay,
 age: isMr && age ? age.replace(/\d/g, (n) => '०१२३४५६७८९'[Number(n)] ?? n) : age,
 gender: fields.gender,
 occupation: fields.occupation.trim(),
 photoDataUrl: fields.photoDataUrl || '',
 };
  }, [fields, isMr]);

  const onSubmit = useCallback(async (e) => {
 e.preventDefault();
 setErrorMsg('');

 // Basic required-field check
 const required = ['name', 'phone', 'email', 'address', 'district', 'gender', 'occupation'];
 for (const key of required) {
 if (!fields[key] || !String(fields[key]).trim()) return;
 }

 setStatus('submitting');
 const card = buildCardData();
 setCardData(card);

 // Wait two frames so the hidden IdCard renders + decodes its photo
 await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
 // Then another small delay to let the photo image decode
 await new Promise((r) => setTimeout(r, 250));

 try {
 await generateIdCardPdf(cardRef.current, t.idCard?.fileName || 'IDCard');
 setStatus('success');
 } catch (err) {
 console.warn('PDF generation failed:', err);
 setErrorMsg(isMr ? 'PDF तयार होऊ शकले नाही. कृपया पुन्हा प्रयत्न करा.' : 'Could not generate the PDF. Please try again.');
 setStatus('error');
 }
  }, [fields, buildCardData, t, isMr]);

  const downloadAgain = useCallback(async () => {
 if (!cardRef.current) return;
 try {
 await generateIdCardPdf(cardRef.current, t.idCard?.fileName || 'IDCard');
 } catch (err) {
 console.warn('Re-download failed:', err);
 }
  }, [t]);

  const reset = useCallback(() => {
 setFields(INITIAL_FIELDS);
 setCardData(null);
 setStatus('idle');
 setErrorMsg('');
  }, []);

  /* Card labels (idCard sub-block) */
  const cardLabels = useMemo(() => ({ ...t.idCard, genderOptions: t.genderOptions }), [t]);

  return (
 <section className="cf-section">
 <div className="cf-section__inner">

 {/* ── HEADER + INSTRUCTIONS ──────────────────────── */}
 <div ref={headerRef} className="cf-section__header reveal">
 <h2 className="cf-section__title">{t.title}</h2>
 <p className="cf-section__lede">{t.lede}</p>
 </div>

 {Array.isArray(t.instructions) && t.instructions.length > 0 && (
 <div className="cf-instructions">
 {t.instructionsTitle && (
 <h3 className="cf-instructions__title">
 <span aria-hidden="true">ⓘ</span> {t.instructionsTitle}
 </h3>
 )}
 <ol className="cf-instructions__list">
 {t.instructions.map((line, i) => (
 <li key={i}>{line}</li>
 ))}
 </ol>
 </div>
 )}

 {/* ── CARD ──────────────────────────────────────── */}
 <div ref={formRef} className="cf-card reveal">

 {status !== 'success' ? (
 <form className="cf-form" onSubmit={onSubmit} noValidate>

 {/* Row 1: Name + Mobile */}
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
 pattern="[0-9\s\-+()]{7,}"
 required
 />
 </label>
 </div>

 {/* Row 2: Email alone */}
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

 {/* Row 3: Gender + Occupation */}
 <div className="cf-row">
 <label className="cf-field">
 <span className="cf-field__label">{t.labels.gender}</span>
 <select
 className="cf-field__input cf-field__input--select"
 value={fields.gender}
 onChange={update('gender')}
 required
 >
 <option value=""> </option>
 <option value="male">{t.genderOptions.male}</option>
 <option value="female">{t.genderOptions.female}</option>
 <option value="other">{t.genderOptions.other}</option>
 </select>
 </label>
 <label className="cf-field">
 <span className="cf-field__label">{t.labels.occupation}</span>
 <input
 type="text"
 className="cf-field__input"
 placeholder={t.placeholders.occupation}
 value={fields.occupation}
 onChange={update('occupation')}
 required
 />
 </label>
 </div>

 {/* Row 4: District alone */}
 <label className="cf-field">
 <span className="cf-field__label">{t.labels.district}</span>
 <input
 type="text"
 className="cf-field__input"
 placeholder={t.placeholders.district}
 value={fields.district}
 onChange={update('district')}
 required
 />
 </label>

 {/* Row 5: Address */}
 <label className="cf-field">
 <span className="cf-field__label">{t.labels.address}</span>
 <textarea
 className="cf-field__input cf-field__input--area"
 placeholder={t.placeholders.address}
 value={fields.address}
 onChange={update('address')}
 rows={3}
 required
 />
 </label>

 {/* Row 6: Photo */}
 <label className="cf-field cf-field--photo">
 <span className="cf-field__label">{t.labels.photo}</span>
 <input
 type="file"
 accept="image/png, image/jpeg"
 onChange={onPhotoChange}
 className="cf-field__file"
 />
 {fields.photoDataUrl && (
 <img src={fields.photoDataUrl} alt="" className="cf-field__photo-preview" />
 )}
 <small className="cf-field__hint">{t.photoHint}</small>
 </label>

 {errorMsg && <p className="cf-form__error" role="alert">{errorMsg}</p>}

 <button
 type="submit"
 className="cf-submit btn"
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

 {t.privacyNote && <p className="cf-privacy">{t.privacyNote}</p>}
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

 {/* Live preview of the issued card */}
 {cardData && (
 <div className="cf-success__preview">
 <IdCard data={cardData} labels={cardLabels} lang={lang} />
 </div>
 )}

 <div className="cf-success__actions">
 <button type="button" className="cf-success__download" onClick={downloadAgain} data-cursor="link">
 {t.downloadAgainLabel}
 </button>
 <button type="button" className="cf-success__reset" onClick={reset} data-cursor="link">
 {t.resetLabel}
 </button>
 </div>
 </div>
 )}
 </div>

 </div>

 {/* ── HIDDEN OFF-SCREEN CARD (captured for the PDF) ───── */}
 {cardData && (
 <div className="idcard--capture-host" aria-hidden="true">
 <IdCard ref={cardRef} data={cardData} labels={cardLabels} lang={lang} />
 </div>
 )}
 </section>
  );
}
