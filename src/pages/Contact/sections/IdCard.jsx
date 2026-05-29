/* ═══════════════════════════════════════════════════════════════
   ID CARD — Horizontal layout, white card with saffron accents.
   Inspired by classic corporate ID-card design but themed for
   Shivsena: saffron curved corners, party logo top-right, photo
   + signature on the left, key details aligned right.

   IMPORTANT: Component renders at fixed pixel dimensions so
   html2canvas captures it crisply for the PDF.
═══════════════════════════════════════════════════════════════ */
import { forwardRef } from 'react';
import './IdCard.css';

const MALE_PHOTO   = '/placeholder/placeholder-men.png';
const FEMALE_PHOTO = '/placeholder/placeholder-women.png';

function fallbackPhoto(gender) {
  if (gender === 'female') return FEMALE_PHOTO;
  return MALE_PHOTO;
}

const IdCard = forwardRef(function IdCard({ data, labels, lang }, ref) {
  const photoSrc = data.photoDataUrl || fallbackPhoto(data.gender);
  const genderLabel = labels.genderOptions?.[data.gender] || data.gender || '—';

  /* The five rows shown on the right side (mirrors the reference
     design's 5 rows: Name, Desig, ID, Issued, Expires). */
  const rows = [
    { label: labels.nameLabel,       value: data.name },
    { label: labels.occupationLabel, value: data.occupation || '—' },
    { label: labels.memberIdLabel,   value: data.memberId },
    { label: labels.phoneLabel,      value: data.phone },
    { label: labels.districtLabel,   value: data.district },
  ];

  return (
    <div ref={ref} className={`idcard idcard--${lang}`}>

      {/* ── Decorative saffron shapes ────────────────────────── */}
      <span className="idcard__shape idcard__shape--tl" aria-hidden="true" />
      <span className="idcard__shape idcard__shape--tr-stripe-1" aria-hidden="true" />
      <span className="idcard__shape idcard__shape--tr-stripe-2" aria-hidden="true" />
      <span className="idcard__shape idcard__shape--br" aria-hidden="true" />
      <span className="idcard__shape idcard__shape--bl-stripe" aria-hidden="true" />

      {/* ── Brand: logo + word-mark in top-right corner ──────── */}
      <header className="idcard__brand">
        <img src="/logo.png" alt="" className="idcard__logo" />
        <div className="idcard__brand-text">
          <span className="idcard__brand-name">{labels.headerLine1}</span>
          <span className="idcard__brand-sub">{labels.headerLine2}</span>
        </div>
      </header>

      {/* ── Body: photo (left) + details (right) ─────────────── */}
      <div className="idcard__body">

        <figure className="idcard__photo-block">
          <div className="idcard__photo-frame">
            <img
              src={photoSrc}
              alt=""
              className="idcard__photo"
              crossOrigin="anonymous"
            />
          </div>
          <div className="idcard__signature">
            <span className="idcard__signature-line" />
            <span className="idcard__signature-label">{labels.signatureLabel}</span>
          </div>
        </figure>

        <dl className="idcard__details">
          {rows.map((row, i) => (
            <Row key={i} label={row.label} value={row.value} />
          ))}
          <Row label={labels.genderLabel} value={genderLabel} muted />
        </dl>
      </div>

      {/* ── Tagline bottom-left ──────────────────────────────── */}
      <p className="idcard__tagline">{labels.tagline}</p>
      <p className="idcard__issued-stamp">
        <span>{labels.issuedLabel}</span>
        <strong>{data.issuedDate}</strong>
      </p>
    </div>
  );
});

function Row({ label, value, muted }) {
  return (
    <div className={`idcard__row ${muted ? 'idcard__row--muted' : ''}`}>
      <dt className="idcard__row-label">{label}</dt>
      <span className="idcard__row-sep" aria-hidden="true">:</span>
      <dd className="idcard__row-value">{value || '—'}</dd>
    </div>
  );
}

export default IdCard;
