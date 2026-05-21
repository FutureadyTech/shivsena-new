import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useT } from '../../i18n/LanguageContext.jsx';

export default function Outro() {
  const t = useT();
  const navigate = useNavigate();
  const joinAudioRef = useRef(null);

  const playJoinSound = useCallback(() => {
    if (!joinAudioRef.current) {
      const a = new Audio('/join.mp3');
      a.preload = 'auto';
      a.volume = 0.8;
      joinAudioRef.current = a;
    }
    const audio = joinAudioRef.current;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (err) {
      console.warn('Join audio play failed:', err);
    }
  }, []);

  const handleJoinClick = useCallback((e) => {
    e.preventDefault();
    playJoinSound();
    setTimeout(() => navigate('/home'), 600);
  }, [playJoinSound, navigate]);

  return (
    <section className="outro">
      <div className="outro-emblem"></div>
      <h2>{t('outro-title')}</h2>
      <div className="subhead">{t('outro-sub')}</div>
      <p>{t('outro-body')}</p>
      <a href="/home" className="btn-primary" onClick={handleJoinClick}>
        <span>{t('outro-cta')}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </section>
  );
}