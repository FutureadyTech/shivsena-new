/* Entrance header — brand mark only. The language picker that
   used to sit in the top-right corner has been removed; on the
   entrance page the language is chosen via the two CTAs in
   WelcomeBanner (मराठी / English). */
export default function Header() {
  return (
    <header className="site-header" id="header">
      <a href="#" className="brand">
        <img src="/logo.png" alt="Shiv Sena" className="brand-logo" />
      </a>
    </header>
  );
}