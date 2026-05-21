import Header from '../../components/Header.jsx';
import SocialRail from '../../components/SocialRail.jsx';
import Loader from './Loader.jsx';
import HeroExperience from './HeroExperience.jsx';
import { useAmbientAudio } from './useAmbientAudio.js';
import './entrance.css';

export default function Entrance() {
  const { enabled: soundEnabled, toggle: toggleSound } = useAmbientAudio();

  return (
    <>
      <Loader />
      <HeroExperience />
      <Header soundEnabled={soundEnabled} onSoundToggle={toggleSound} />
      <SocialRail />
    </>
  );
}
