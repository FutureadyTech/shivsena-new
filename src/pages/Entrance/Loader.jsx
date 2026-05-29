/**
 * Loader is hidden imperatively by scene.js via:
 * document.getElementById('loader').classList.add('hidden')
 *
 * Static className ("loader" with no conditional) so React's reconciler
 * leaves the classList alone on re-renders the .hidden class added by
 * scene.js survives any re-render.
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
