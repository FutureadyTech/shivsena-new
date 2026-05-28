import Header from '../../components/Header.jsx';
import SocialRail from '../../components/SocialRail.jsx';
import Loader from './Loader.jsx';
import HeroExperience from './HeroExperience.jsx';
import './entrance.css';

export default function Entrance() {
  return (
    <>
      <Loader />
      <HeroExperience />
      <Header />
      <SocialRail />
    </>
  );
}
