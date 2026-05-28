import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function Header() {
  return (
    <header className="site-header" id="header">
      <a href="#" className="brand">
        <img src="/logo.png" alt="Shiv Sena" className="brand-logo" />
      </a>

      <div className="header-controls">
        <LanguageSwitcher />
      </div>
    </header>
  );
}