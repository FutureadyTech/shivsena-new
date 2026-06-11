/* ═══════════════════════════════════════════════════════════════
   NOTIFICATIONS BELL + DRAWER

   Bell icon (rendered in SiteHeader next to the language toggle)
   shows a red dot badge with the count of unread notifications.
   Clicking it slides a drawer in from the right with tabbed lists
   of party notices, appointment letters, rally announcements, and
   directives.

   Source of truth: src/content/notifications.json
   Read-state: persisted in localStorage under SHIVSENA_NOTIFS_READ
═══════════════════════════════════════════════════════════════ */
import { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import notificationsData from '../content/notifications.json';
import './NotificationsBell.css';

const READ_STORAGE_KEY = 'SHIVSENA_NOTIFS_READ';

const TABS = [
  { id: 'all',         labelKey: 'all'         },
  { id: 'notice',      labelKey: 'notice'      },
  { id: 'appointment', labelKey: 'appointment' },
  { id: 'rally',       labelKey: 'rally'       },
  { id: 'order',       labelKey: 'order'       },
];

/* Brand-only — every category badge / accent uses the saffron
   brand colour so the panel reads as a single Shiv Sena palette
   instead of a multi-coloured kanban. */
const BRAND_SAFFRON = '#C44D0E';
const CATEGORY_ACCENT = {
  notice:      BRAND_SAFFRON,
  appointment: BRAND_SAFFRON,
  rally:       BRAND_SAFFRON,
  order:       BRAND_SAFFRON,
};

/* ─── Helpers ────────────────────────────────────────────────── */
function loadReadIds() {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}
function saveReadIds(set) {
  try {
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    /* localStorage unavailable — silently fail */
  }
}

/* "2026-05-29" → "२९ मे २०२६" (MR) or "29 May 2026" (EN). */
const MONTHS_MR = ['जानेवारी','फेब्रुवारी','मार्च','एप्रिल','मे','जून','जुलै','ऑगस्ट','सप्टेंबर','ऑक्टोबर','नोव्हेंबर','डिसेंबर'];
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function devDigits(s) {
  const map = ['०','१','२','३','४','५','६','७','८','९'];
  return String(s).replace(/\d/g, (d) => map[Number(d)] ?? d);
}
function formatDate(iso, lang) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y) return iso;
  if (lang === 'mr') return `${devDigits(d)} ${MONTHS_MR[m - 1]} ${devDigits(y)}`;
  return `${d} ${MONTHS_EN[m - 1]} ${y}`;
}

/* ═══════════════════════════════════════════════════════════════ */
export default function NotificationsBell() {
  const { lang } = useLanguage();
  const L = lang === 'mr' ? 'mr' : 'en';
  const labels = notificationsData.labels[L] || notificationsData.labels.en;

  const items = notificationsData.items || [];
  /* Newest first, urgent floats above normal within the same date. */
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const pa = a.priority === 'urgent' ? 1 : 0;
      const pb = b.priority === 'urgent' ? 1 : 0;
      const datecmp = (b.date || '').localeCompare(a.date || '');
      return datecmp !== 0 ? datecmp : (pb - pa);
    });
  }, [items]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [readIds, setReadIds] = useState(() => loadReadIds());

  const filtered = useMemo(() => {
    if (activeTab === 'all') return sorted;
    return sorted.filter((n) => n.category === activeTab);
  }, [sorted, activeTab]);

  const unreadCount = useMemo(() => {
    return sorted.filter((n) => !readIds.has(n.id)).length;
  }, [sorted, readIds]);

  /* Body scroll-lock while the drawer is open */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  /* Esc to close */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const markRead = useCallback((id) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    const next = new Set(sorted.map((n) => n.id));
    setReadIds(next);
    saveReadIds(next);
  }, [sorted]);

  /* When the user opens the drawer, mark every currently-visible
     item as read after a short delay so they get a chance to see
     the unread highlight before it fades. */
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      const next = new Set(readIds);
      filtered.forEach((n) => next.add(n.id));
      setReadIds(next);
      saveReadIds(next);
    }, 1800);
    return () => clearTimeout(id);
  }, [isOpen, filtered]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <>
      <button
        type="button"
        className="notif-bell"
        aria-label={labels.openLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notif-bell__badge" aria-label={`${unreadCount} new`}>
            {unreadCount > 9 ? '9+' : devDigits(unreadCount).replace(/\d/g, (d) => lang === 'mr' ? '०१२३४५६७८९'[Number(d)] : d)}
          </span>
        )}
      </button>

      {/* Backdrop + Drawer — rendered through a portal so the
          drawer's position:fixed escapes the SiteHeader's
          backdrop-filter containing block (which was clipping
          the drawer to the header strip). */}
      {typeof document !== 'undefined' && createPortal(
        <NotifDrawerOverlay
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          labels={labels}
          lang={lang}
          sortedCount={sorted.length}
          unreadCount={unreadCount}
          markAllRead={markAllRead}
          markRead={markRead}
          readIds={readIds}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filtered={filtered}
          sorted={sorted}
          L={L}
        />,
        document.body
      )}
    </>
  );
}

/* ─── Drawer overlay (rendered via portal) ───────────────────── */
function NotifDrawerOverlay({
  isOpen, onClose, labels, lang, sortedCount, unreadCount,
  markAllRead, markRead, readIds, activeTab, setActiveTab,
  filtered, sorted, L,
}) {
  return (
    <>
      <div
        className={`notif-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`notif-drawer ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
      >
        <header className="notif-drawer__head">
          <div>
            <h3 className="notif-drawer__title">{labels.title}</h3>
            <p className="notif-drawer__count">
              {sorted.length} सूचना
              {unreadCount > 0 && (
                <span className="notif-drawer__unread"> · {unreadCount} नवीन</span>
              )}
            </p>
          </div>
          <div className="notif-drawer__head-actions">
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-drawer__markall"
                onClick={markAllRead}
              >
                {labels.markAllRead}
              </button>
            )}
            <button
              type="button"
              className="notif-drawer__close"
              aria-label={labels.closeLabel}
              onClick={onClose}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        <nav className="notif-drawer__tabs" role="tablist">
          {TABS.map((tab) => {
            const count = tab.id === 'all'
              ? sorted.length
              : sorted.filter((n) => n.category === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`notif-drawer__tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{labels[tab.labelKey]}</span>
                {count > 0 && <span className="notif-drawer__tab-count">{count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="notif-drawer__body">
          {filtered.length === 0 ? (
            <p className="notif-drawer__empty">{labels.noItems}</p>
          ) : (
            <ul className="notif-list">
              {filtered.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  lang={L}
                  labels={labels}
                  isUnread={!readIds.has(n.id)}
                  onView={() => markRead(n.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}

/* ─── Card ───────────────────────────────────────────────────── */
function NotificationCard({ notification, lang, labels, isUnread, onView }) {
  const t = notification.title?.[lang] || notification.title?.en || '';
  const body = notification.body?.[lang] || notification.body?.en || '';
  const accent = CATEGORY_ACCENT[notification.category] || CATEGORY_ACCENT.notice;
  const isUrgent = notification.priority === 'urgent';

  return (
    <li
      className={`notif-card ${isUnread ? 'is-unread' : ''}`}
      style={{ '--accent': accent }}
      onClick={onView}
    >
      <div className="notif-card__head">
        <span className="notif-card__category" style={{ background: accent }}>
          {labels[notification.category] || notification.category}
        </span>
        {isUrgent && <span className="notif-card__urgent">{labels.urgentBadge}</span>}
        <span className="notif-card__date">{formatDate(notification.date, lang)}</span>
      </div>
      <h4 className="notif-card__title">{t}</h4>
      {body && <p className="notif-card__body">{body}</p>}
      {(notification.pdf || notification.externalLink) && (
        <div className="notif-card__actions">
          {notification.pdf && (
            <a
              href={notification.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="notif-card__action notif-card__action--primary"
              onClick={(e) => e.stopPropagation()}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{labels.downloadPdf}</span>
            </a>
          )}
          {notification.externalLink && (
            <a
              href={notification.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="notif-card__action"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{labels.readMore}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}
        </div>
      )}
    </li>
  );
}

/* ─── Bell icon ──────────────────────────────────────────────── */
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
