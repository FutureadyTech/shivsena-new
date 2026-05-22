import { useEffect } from 'react';
import { initScene } from './scene.js';
import WelcomeBanner from './WelcomeBanner.jsx';

/**
 * HeroExperience — thin React wrapper around the Three.js scene.
 *
 * `scene.js` is a 1,889-line vanilla module. It now returns a destroy()
 * function from initScene() so we can stop its RAF loop + listener callbacks
 * when the user navigates away (e.g. to /home).
 *
 * The Promise.resolve() defer is a StrictMode trick: in dev, React mounts →
 * cleans up → mounts again. By deferring init past the synchronous cleanup,
 * we avoid the init-then-immediately-destroy cycle. In production this is
 * just a microtask delay, imperceptible.
 */
export default function HeroExperience() {
  useEffect(() => {
    let destroy;
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return;
      destroy = initScene();
    });

    return () => {
      active = false;
      if (destroy) destroy();
    };
  }, []);

  return (
    <>
      {/* 3D stage */}
      <canvas id="scene-canvas" />

      {/* Photorealistic vestibule cover — fades + scales to reveal the 3D hall */}
      <div className="vestibule-cover" id="vestibule-cover" aria-hidden="true">
        <img src="/shakha.jpeg" alt="" />
      </div>

      {/* Golden bloom from the doorway */}
      <div className="entry-glow" id="entry-glow" aria-hidden="true"></div>
      <div className="vignette"></div>
      <div className="grain"></div>


            <WelcomeBanner />

    </>
  );
}