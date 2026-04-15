// pages/NotificationsPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markOneAsRead,
  markAllRead,
  selectAllNotifications,
  selectUnreadCount,
  selectNotifStatus,
} from "../store/slices/notiifcationSlice";
// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "all", label: "Toutes" },
  { key: "sys", label: "Système" },
  { key: "book", label: "Réservations" },
  { key: "msg", label: "Messages" },
  { key: "rev", label: "Avis" },
];

const TYPE_MAP = {
  SYSTEM_BROADCAST: {
    key: "sys",
    label: "Système",
    pill: "bg-[#eef5e8] text-[#27500A]",
  },
  BOOKING: {
    key: "book",
    label: "Réservation",
    pill: "bg-orange-50 text-[#633806]",
  },
  MESSAGE: { key: "msg", label: "Message", pill: "bg-blue-50 text-[#0C447C]" },
  REVIEW: { key: "rev", label: "Avis", pill: "bg-purple-50 text-[#3C3489]" },
};

const AVATAR_COLOR = {
  sys: "bg-[#eef5e8] text-[#27500A]",
  book: "bg-orange-50 text-[#633806]",
  msg: "bg-blue-50 text-[#0C447C]",
  rev: "bg-purple-50 text-[#3C3489]",
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const initials = (id = "") => id.slice(0, 2).toUpperCase();

const typeKey = (type) => TYPE_MAP[type]?.key ?? "sys";

// ─────────────────────────────────────────────────────────────────────────────
// NotificationItem
// ─────────────────────────────────────────────────────────────────────────────

function NotificationItem({ notif, onRead, onDelete }) {
  const meta = TYPE_MAP[notif.type] ?? TYPE_MAP.SYSTEM_BROADCAST;
  const avColor = AVATAR_COLOR[meta.key] ?? AVATAR_COLOR.sys;

  return (
    <div
      className={`
        flex items-start gap-3 rounded-xl border px-4 py-3.5 mb-2 transition-colors
        ${
          notif.isRead
            ? "border-sand3 bg-white"
            : "border-green-mid/50 bg-[#fafdf6]"
        }
        hover:border-sand3/80
      `}
    >
      {/* Unread dot */}
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full
          ${notif.isRead ? "bg-sand3" : "bg-primary"}`}
      />

      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center
                       rounded-full text-xs font-medium ${avColor}`}
      >
        {initials(notif.senderId)}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${notif.isRead ? "text-ink2" : "text-ink"}`}
        >
          {notif.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink3">{notif.message}</p>
        <p className="mt-1.5 text-[11px] text-ink3/60">
          {formatDate(notif.createdAt)}
        </p>
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.pill}`}
        >
          {meta.label}
        </span>
        <div className="flex items-center gap-1.5">
          {!notif.isRead && (
            <button
              onClick={onRead}
              className="text-[11px] text-primary hover:underline"
            >
              Marquer lu
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex h-6 w-6 items-center justify-center rounded-md
                       border border-sand3 text-ink3 transition hover:bg-sand2"
            aria-label="Supprimer"
          >
            <XIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ label, count }) {
  return (
    <div className="flex items-center gap-3 pb-3 pt-5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-ink3">
        {label} · {count}
      </span>
      <div className="flex-1 border-t border-sand3" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationsPage
// ─────────────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectAllNotifications);
  const unread = useSelector(selectUnreadCount);
  const status = useSelector(selectNotifStatus);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const currentUserId = "0de6"; // à remplacer par le sélecteur auth

  useEffect(() => {
    if (status === "idle") dispatch(fetchNotifications(currentUserId));
  }, [dispatch, status]);

  // ── Compteurs par catégorie ───────────────────────────────────────────────
  const unreadByCategory = useMemo(() => {
    const counts = {};
    items
      .filter((n) => !n.isRead)
      .forEach((n) => {
        const key = typeKey(n.type);
        counts[key] = (counts[key] || 0) + 1;
      });
    return counts;
  }, [items]);

  // ── Filtrage ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((n) => {
      const catOk =
        activeCategory === "all" || typeKey(n.type) === activeCategory;
      const searchOk =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [items, activeCategory, search]);

  const unreadList = filtered.filter((n) => !n.isRead);
  const readList = filtered.filter((n) => n.isRead);

  return (
    <div className="flex min-h-screen bg-sand font-body">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-sand3 bg-sand2 px-3 py-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between px-2">
          <h1 className="font-display text-base font-semibold text-ink">
            Notifications
          </h1>
          {unread > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
              {unread}
            </span>
          )}
        </div>

        {/* Categories */}
        <nav className="flex flex-col gap-0.5">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2
                          text-sm transition-colors
                          ${
                            activeCategory === key
                              ? "bg-green-light font-medium text-primary"
                              : "text-ink3 hover:bg-sand3"
                          }`}
            >
              <span>{label}</span>
              {key !== "all" && unreadByCategory[key] > 0 && (
                <span
                  className="rounded-full bg-accent/10 px-2 py-0.5
                                 text-[11px] font-medium text-accent"
                >
                  {unreadByCategory[key]}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-sand3 pt-4">
          <button
            onClick={() => dispatch(markAllRead(currentUserId))}
            disabled={unread === 0}
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-ink3
                       transition hover:bg-sand3 disabled:opacity-40"
          >
            Tout marquer comme lu
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-sand3 px-6 py-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une notification..."
              className="h-9 w-full rounded-lg border border-sand3 bg-sand2
                         pl-9 pr-3 text-sm text-ink outline-none
                         focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {unread > 0 && (
            <button
              onClick={() => dispatch(markAllRead(currentUserId))}
              className="h-9 rounded-lg bg-primary px-4 text-xs font-medium
                         text-white transition hover:bg-primary/90"
            >
              Tout lu
            </button>
          )}
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {status === "loading" && (
            <p className="mt-12 text-center text-sm text-ink3 animate-pulse-soft">
              Chargement…
            </p>
          )}

          {status === "succeeded" && filtered.length === 0 && (
            <p className="mt-16 text-center text-sm text-ink3">
              Aucune notification dans cette catégorie.
            </p>
          )}

          {unreadList.length > 0 && (
            <>
              <SectionHeader label="Non lues" count={unreadList.length} />
              {unreadList.map((n) => (
                <NotificationItem
                  key={n.id}
                  notif={n}
                  onRead={() => dispatch(markOneAsRead(n.id))}
                  onDelete={() => {
                    /* dispatch(deleteNotif(n.id)) */
                  }}
                />
              ))}
            </>
          )}

          {readList.length > 0 && (
            <>
              <SectionHeader label="Lues" count={readList.length} />
              <div className="opacity-60">
                {readList.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notif={n}
                    onDelete={() => {
                      /* dispatch(deleteNotif(n.id)) */
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons (inline SVG — pas de dépendance externe)
// ─────────────────────────────────────────────────────────────────────────────

function SearchIcon({ className = "" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="6.5" cy="6.5" r="4.5" />
      <path d="M11 11l3.5 3.5" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
    </svg>
  );
}
