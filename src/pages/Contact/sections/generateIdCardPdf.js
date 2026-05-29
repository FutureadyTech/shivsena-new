/* ═══════════════════════════════════════════════════════════════
   ID CARD PDF GENERATOR
   - Takes a DOM node (the rendered IdCard) and converts it to PDF.
   - Uses html2canvas → captures the card at 2× scale for crispness.
   - Uses jsPDF → wraps the PNG in a single-page landscape A6 PDF.
   - Avoids server roundtrips and font embedding issues by letting
     the browser render Marathi text natively, then rasterising it.
═══════════════════════════════════════════════════════════════ */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateIdCardPdf(node, fileName = 'IDCard') {
  if (!node) throw new Error('generateIdCardPdf: no DOM node provided');

  // Wait one frame so any pending layout / image decodes settle.
  await new Promise((r) => requestAnimationFrame(() => r()));

  // Capture the card at 2× pixel density for sharper PDF output.
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    allowTaint: false,
  });

  const imgData = canvas.toDataURL('image/png', 1.0);

  // Card is 640×400 px CSS. We mirror that aspect ratio in the PDF
  // page so the image fills the page edge-to-edge.
  // Using mm: 160 × 100 mm (close to a standard ID card landscape).
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [160, 100],
    compress: true,
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 160, 100, undefined, 'FAST');
  pdf.save(`${fileName}.pdf`);
}

/* ─── Helpers ─────────────────────────────────────────────────── */

/* Generates a deterministic-looking member ID: SS-YY-XXXXX (5 random base36) */
export function generateMemberId() {
  const year = String(new Date().getFullYear()).slice(-2);
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SS-${year}-${rand}`;
}

/* Formats today's date as DD/MM/YYYY (with optional Devanagari digits) */
export function todayFormatted(useDevanagariDigits = false) {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const s = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  if (!useDevanagariDigits) return s;
  const map = ['०','१','२','३','४','५','६','७','८','९'];
  return s.replace(/\d/g, (n) => map[Number(n)] ?? n);
}

/* Reads an uploaded File object to a data URL the IdCard can render */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (file.size > 2 * 1024 * 1024) {
      // Reject files > 2 MB so html2canvas + jsPDF don't choke
      return reject(new Error('photo-too-large'));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('photo-read-failed'));
    reader.readAsDataURL(file);
  });
}

/* Computes age in years from a YYYY-MM-DD string (from <input type="date">) */
export function ageFromDob(dob) {
  if (!dob) return '';
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age > 0 && age < 150 ? String(age) : '';
}
