const SECTIONS = [
  { idx: 0, label: 'Entrance' },
  { idx: 1, label: 'Hall' },
  { idx: 2, label: 'History' },
  { idx: 3, label: 'Leadership' },
  { idx: 4, label: 'Join' },
];

export default function ProgressRail() {
  return (
    <aside className="progress-rail" id="progress-rail">
      {SECTIONS.map((s, i) => (
        <div
          key={s.idx}
          className={`progress-dot ${i === 0 ? 'active' : ''}`}
          data-section={s.idx}
          data-label={s.label}
        />
      ))}
    </aside>
  );
}