import './SectionDivider.css';

/**
 * Decorative divider used between major page sections.
 * Saffron fade-line · ✦ · saffron fade-line — matches the hero
 * quote ornament so the brand language stays consistent.
 *
 * Drop in between two stacked <section>s on any page; it renders
 * its own vertical padding so adjacent sections don't need to
 * change their margins.
 */
export default function SectionDivider() {
  return (
    <div className="section-divider" aria-hidden="true">
      <span className="section-divider__line section-divider__line--left" />
      <svg viewBox="0 0 16 16" className="section-divider__star" fill="currentColor">
        <path d="M8 0 L9.4 6.6 L16 8 L9.4 9.4 L8 16 L6.6 9.4 L0 8 L6.6 6.6 Z" />
      </svg>
      <span className="section-divider__line section-divider__line--right" />
    </div>
  );
}
