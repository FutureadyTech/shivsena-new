import LanguageSwitcher from './LanguageSwitcher.jsx';
import SoundToggle from './SoundToggle.jsx';

export default function Header({ soundEnabled, onSoundToggle }) {
  return (
    <header className="site-header" id="header">
      <a href="#" className="brand">
        <img src="/logo.png" alt="Shiv Sena" className="brand-logo" />
      </a>

      <div className="header-controls">
        <LanguageSwitcher />
        <SoundToggle enabled={soundEnabled} onToggle={onSoundToggle} />
      </div>
    </header>
  );
}