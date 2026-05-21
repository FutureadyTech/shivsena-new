import { useT } from '../i18n/LanguageContext.jsx';

export default function Footer() {
  const t = useT();

  return (
    <footer className="site-footer">
      <div className="site-footer-meta">{t('footer-meta')}</div>
      <div className="site-footer-credit">{t('footer-credit')}</div>
    </footer>
  );
}
