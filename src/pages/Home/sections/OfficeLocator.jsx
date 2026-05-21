import { useState, useMemo, useRef, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { useContent } from '../../../content/_shared/useContent.js';
import homeContent from '../../../content/home.json';
import { MH_PATHS } from './maharashtraPaths.js';
import './OfficeLocator.css';

const VB_W = 1126.9;
const VB_H = 940.43;

export default function OfficeLocator() {
  const t = useContent(homeContent.officeLocator);
  const OFFICES = t.offices ?? [];
  const headerRef = useScrollReveal(0.25);
  const [activeId, setActiveId] = useState('mumbai');
  const [query, setQuery] = useState('');

  const [pickerMode, setPickerMode] = useState(false);
  const [pickedPoints, setPickedPoints] = useState([]);
  const [hoverPos, setHoverPos] = useState(null);
  const [copyStatus, setCopyStatus] = useState('idle');
  const mapWrapRef = useRef(null);

  const toSvgCoords = (clientX, clientY) => {
    const rect = mapWrapRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * VB_W;
    const y = ((clientY - rect.top) / rect.height) * VB_H;
    return { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) };
  };

  const onMapMove = (e) => { if (pickerMode) setHoverPos(toSvgCoords(e.clientX, e.clientY)); };
  const onMapLeave = () => setHoverPos(null);
  const onMapClick = (e) => {
    if (!pickerMode) return;
    const coords = toSvgCoords(e.clientX, e.clientY);
    setPickedPoints((prev) => [...prev, { label: `Point ${prev.length + 1}`, ...coords }]);
  };

  const updateLabel = (i, label) =>
    setPickedPoints((prev) => prev.map((p, idx) => (idx === i ? { ...p, label } : p)));
  const removePoint = (i) =>
    setPickedPoints((prev) => prev.filter((_, idx) => idx !== i));
  const clearPoints = () => setPickedPoints([]);
  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(pickedPoints, null, 2));
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2200);
    } catch {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 2200);
    }
  };
  const togglePicker = () => { setPickerMode((m) => !m); setHoverPos(null); };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OFFICES;
    return OFFICES.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
    );
  }, [query, OFFICES]);

  const cardRefs = useRef({});
  const prevActiveIdRef = useRef('mumbai');

  useEffect(() => {
    if (prevActiveIdRef.current === activeId) return;
    prevActiveIdRef.current = activeId;
    if (pickerMode) return;
    const card = cardRefs.current[activeId];
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeId, pickerMode]);

  return (
    <section className="locator">
      <div className="locator__inner">
        <div ref={headerRef} className="locator__header reveal">
          <div>
            <div className="locator__eyebrow">
              <span className="locator__eyebrow-line"></span>
              <span>{t.eyebrow}</span>
            </div>
            <h2 className="locator__title">{t.title}</h2>
          </div>

          <div className="locator__controls">
            <div className="locator__search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="locator__search-icon">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                aria-label="Search offices"
                disabled={pickerMode}
              />
              {query && !pickerMode && (
                <button className="locator__search-clear" onClick={() => setQuery('')} aria-label="Clear">×</button>
              )}
            </div>

            <button
              type="button"
              onClick={togglePicker}
              className={`locator__picker-toggle ${pickerMode ? 'is-on' : ''}`}
              title="Toggle coordinate picker"
            >
              {pickerMode ? (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Exit Picker</span>
                  {pickedPoints.length > 0 && <span className="locator__picker-count">{pickedPoints.length}</span>}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Pick Coordinates</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="locator__grid">
          <div
            ref={mapWrapRef}
            className={`locator__map ${pickerMode ? 'is-picking' : ''}`}
            onMouseMove={onMapMove}
            onMouseLeave={onMapLeave}
            onClick={onMapClick}
          >
            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet" className="locator__map-svg">
              <g className="locator__districts">
                {MH_PATHS.map((p) => (
                  <path key={p.id} d={p.d} className={`locator__district locator__district--${p.cls}`} />
                ))}
              </g>

              {OFFICES.map((o) => (
                <g
                  key={o.id}
                  transform={`translate(${o.pin.x}, ${o.pin.y})`}
                  className={`locator__pin ${o.id === activeId ? 'is-active' : ''}`}
                  onClick={(e) => { if (!pickerMode) { e.stopPropagation(); setActiveId(o.id); } }}
                  style={{ cursor: pickerMode ? 'crosshair' : 'pointer', opacity: pickerMode ? 0.45 : 1 }}
                >
                  <circle r="22" className="locator__pin-pulse" />
                  <circle r="11" className="locator__pin-dot" />
                  {o.isHQ && (
                    <text y="-28" textAnchor="middle" className="locator__pin-label">
                      {t.hqBadge}
                    </text>
                  )}
                </g>
              ))}

              {pickedPoints.map((p, i) => (
                <g key={i} transform={`translate(${p.x}, ${p.y})`} className="locator__picked-pin">
                  <circle r="15" fill="#1aa56b" stroke="#fff" strokeWidth="3" />
                  <text y="5" textAnchor="middle" className="locator__picked-num">{i + 1}</text>
                </g>
              ))}

              {pickerMode && hoverPos && (
                <g style={{ pointerEvents: 'none' }}>
                  <line x1={hoverPos.x} y1="0" x2={hoverPos.x} y2={VB_H} stroke="rgba(26,165,107,0.5)" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
                  <line x1="0" y1={hoverPos.y} x2={VB_W} y2={hoverPos.y} stroke="rgba(26,165,107,0.5)" strokeWidth="1.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
                  <circle cx={hoverPos.x} cy={hoverPos.y} r="5" fill="rgba(26,165,107,0.7)" />
                </g>
              )}
            </svg>

            <div className="locator__map-caption">
              <span>{t.captionLabel} · {OFFICES.length} OFFICES</span>
            </div>

            {pickerMode && hoverPos && (
              <div className="locator__readout">
                x: <strong>{hoverPos.x}</strong> · y: <strong>{hoverPos.y}</strong>
              </div>
            )}
          </div>

          {pickerMode ? (
            <PickerPanel
              points={pickedPoints}
              onRename={updateLabel}
              onRemove={removePoint}
              onClear={clearPoints}
              onCopy={copyJSON}
              copyStatus={copyStatus}
            />
          ) : (
            <div className="locator__list">
              {filtered.length === 0 ? (
                <div className="locator__empty">{t.emptyMessage}</div>
              ) : (
                filtered.map((o) => (
                  <OfficeCard
                    key={o.id}
                    office={o}
                    active={o.id === activeId}
                    onClick={() => setActiveId(o.id)}
                    cardRef={(el) => (cardRefs.current[o.id] = el)}
                    hqBadge={t.hqBadge}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PickerPanel({ points, onRename, onRemove, onClear, onCopy, copyStatus }) {
  return (
    <div className="picker-panel">
      <div className="picker-panel__head">
        <h4>Coordinate Picker</h4>
        <p>Click anywhere on the map to capture a point. SVG space: X 0–1126.9, Y 0–940.43.</p>
      </div>
      <div className="picker-panel__list">
        {points.length === 0 ? (
          <div className="picker-panel__empty"><span>No points yet. Click the map to add.</span></div>
        ) : (
          points.map((p, i) => (
            <div key={i} className="picker-row">
              <span className="picker-row__num">{i + 1}</span>
              <input
                type="text"
                value={p.label}
                onChange={(e) => onRename(i, e.target.value)}
                className="picker-row__label"
                placeholder="Label (e.g. Mumbai HQ)"
              />
              <span className="picker-row__coords">{p.x}, {p.y}</span>
              <button onClick={() => onRemove(i)} className="picker-row__remove" aria-label={`Remove ${i + 1}`}>×</button>
            </div>
          ))
        )}
      </div>
      {points.length > 0 && (
        <div className="picker-panel__actions">
          <button onClick={onCopy} className="picker-btn picker-btn--primary">
            {copyStatus === 'copied' ? '✓ Copied' : copyStatus === 'failed' ? 'Failed' : 'Copy JSON'}
          </button>
          <button onClick={onClear} className="picker-btn picker-btn--ghost">Clear all</button>
        </div>
      )}
    </div>
  );
}

function OfficeCard({ office, active, onClick, cardRef, hqBadge }) {
  return (
    <article ref={cardRef} className={`office-card ${active ? 'is-active' : ''}`} onClick={onClick}>
      <div className="office-card__head">
        <div>
          <h4 className="office-card__name">{office.name}</h4>
          <p className="office-card__city">{office.city}</p>
        </div>
        {office.isHQ && <span className="office-card__hq-badge">{hqBadge}</span>}
      </div>
      <div className="office-card__details">
        <div className="office-card__row">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span>{office.address}</span>
        </div>
        <div className="office-card__row">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{office.phone}</span>
        </div>
        <div className="office-card__row">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{office.hours}</span>
        </div>
      </div>
      <div className="office-card__arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </article>
  );
}