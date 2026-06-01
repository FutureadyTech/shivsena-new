/**
 * Loader brief boot splash. Hidden on the next paint frame by
 * HeroExperience.jsx (which adds the .hidden class via DOM).
 *
 * Static className ("loader" with no conditional) so React's
 * reconciler leaves the classList alone on re-renders — the
 * .hidden class added imperatively survives.
 */
export default function Loader() {
  return (
    <div className="loader" id="loader">
      <div className="loader-emblem">
        <div className="loader-emblem-disc">
          <img
            src="/entrance-logo-loader.png"
            alt="शिवसेना"
            className="loader-emblem-logo"
            draggable="false"
          />
        </div>
      </div>
      <div className="loader-bar"></div>
    </div>
  );
}
