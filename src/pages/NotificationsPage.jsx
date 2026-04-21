// pages/NotificationsPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markOneAsRead,
  markAllRead,
  deleteNotif,
  deleteAllRead,
  selectAllNotifications,
  selectUnreadCount,
  selectNotifStatus,
  selectNotifError,
} from "../store/slices/notiifcationSlice"; // ✅ typo corrigée

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { key: "all", label: "Toutes", icon: "🔔" },
  { key: "sys", label: "Système", icon: "⚙️" },
  { key: "book", label: "Réservations", icon: "📅" },
  { key: "msg", label: "Messages", icon: "💬" },
  { key: "rev", label: "Avis", icon: "⭐" },
];

const TYPE_META = {
  SYSTEM_BROADCAST: {
    key: "sys",
    label: "Système",
    icon: "⚙️",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  BOOKING: {
    key: "book",
    label: "Réservation",
    icon: "📅",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    ring: "ring-orange-200",
  },
  MESSAGE: {
    key: "msg",
    label: "Message",
    icon: "💬",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
    ring: "ring-sky-200",
  },
  REVIEW: {
    key: "rev",
    label: "Avis",
    icon: "⭐",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
  },
};

const FALLBACK_META = TYPE_META.SYSTEM_BROADCAST;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const typeKey = (type) => TYPE_META[type]?.key ?? "sys";

const formatRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
};

const avatarInitials = (id = "") =>
  id.length >= 2 ? id.slice(0, 2).toUpperCase() : "??";

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonItem() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 mb-2 animate-pulse">
      <div className="mt-1 h-2 w-2 rounded-full bg-gray-200 shrink-0" />
      <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-2.5 w-1/4 rounded bg-gray-100" />
      </div>
      <div className="h-5 w-16 rounded-full bg-gray-100 shrink-0" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState({ filtered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl">
        {filtered ? "🔍" : "🎉"}
      </div>
      <p className="text-sm font-medium text-gray-700">
        {filtered ? "Aucun résultat" : "Tout est lu !"}
      </p>
      <p className="mt-1 text-xs text-gray-400">
        {filtered
          ? "Essayez un autre filtre ou mot-clé."
          : "Vous êtes à jour sur toutes vos notifications."}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section divider
// ─────────────────────────────────────────────────────────────────────────────

function SectionDivider({ label, count, action, onAction }) {
  return (
    <div className="flex items-center gap-3 py-3 mb-1">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
        {count}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
      {action && (
        <button
          onClick={onAction}
          className="shrink-0 text-[11px] text-[#5b8523] hover:underline font-medium"
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationItem
// ─────────────────────────────────────────────────────────────────────────────

function NotificationItem({ notif, onRead, onDelete }) {
  const meta = TYPE_META[notif.type] ?? FALLBACK_META;
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
  };

  return (
    <div
      className={`
        group relative flex items-start gap-3 rounded-2xl border px-4 py-3.5 mb-2
        transition-all duration-200
        ${deleting ? "scale-95 opacity-0 pointer-events-none" : "scale-100 opacity-100"}
        ${
          notif.isRead
            ? "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
            : "border-[#5b8523]/20 bg-[#f8fdf3] shadow-sm hover:shadow-md hover:border-[#5b8523]/30"
        }
      `}
    >
      {/* Unread indicator */}
      <span
        className={`mt-[18px] h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
          notif.isRead ? "bg-gray-200" : meta.dot
        }`}
      />

      {/* Avatar */}
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
          text-xs font-bold ring-2 ring-offset-1
          ${notif.isRead ? "bg-gray-100 text-gray-500 ring-gray-100" : `${meta.bg} ${meta.text} ${meta.ring}`}
        `}
      >
        {avatarInitials(notif.senderId)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-snug ${
              notif.isRead
                ? "font-normal text-gray-600"
                : "font-semibold text-gray-900"
            }`}
          >
            {notif.title}
          </p>
          {/* Type badge */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${meta.bg} ${meta.text}`}
          >
            {meta.icon} {meta.label}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
          {notif.message}
        </p>

        {/* Footer row */}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[11px] text-gray-400">
            {formatRelative(notif.createdAt)}
          </span>

          {!notif.isRead && (
            <>
              <span className="text-gray-200">·</span>
              <button
                onClick={onRead}
                className="text-[11px] font-medium text-[#5b8523] hover:underline transition-colors"
              >
                Marquer comme lu
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete button — visible on hover */}
      <button
        onClick={handleDelete}
        aria-label="Supprimer"
        className="
          absolute right-3 top-3 flex h-6 w-6 items-center justify-center
          rounded-lg border border-gray-200 bg-white text-gray-400
          opacity-0 shadow-sm transition-all duration-150
          hover:border-red-200 hover:bg-red-50 hover:text-red-500
          group-hover:opacity-100
        "
      >
        <XIcon />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category tab button
// ─────────────────────────────────────────────────────────────────────────────

function CategoryTab({ cat, active, unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5
        text-sm transition-all duration-150
        ${
          active
            ? "bg-[#5b8523] font-semibold text-white shadow-md shadow-[#5b8523]/20"
            : "font-medium text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <span className="text-base leading-none">{cat.icon}</span>
      <span className="flex-1 text-left">{cat.label}</span>
      {cat.key !== "all" && unreadCount > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active ? "bg-white/25 text-white" : "bg-[#d57a2a]/10 text-[#d57a2a]"
          }`}
        >
          {unreadCount}
        </span>
      )}
    </button>
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
  const error = useSelector(selectNotifError);

  // ✅ Utiliser le sélecteur auth en production :
  // const currentUserId = useSelector((state) => state.auth.user?.id);
  const currentUserId = "0de6";

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchNotifications(currentUserId));
  }, [dispatch, status, currentUserId]);

  // ── Unread counts per category ────────────────────────────────────────────
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

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((n) => {
      const catOk =
        activeCategory === "all" || typeKey(n.type) === activeCategory;
      const searchOk =
        !q ||
        n.title?.toLowerCase().includes(q) ||
        n.message?.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [items, activeCategory, search]);

  const unreadList = filtered.filter((n) => !n.isRead);
  const readList = filtered.filter((n) => n.isRead);
  const hasFilter = search.trim() || activeCategory !== "all";

  return (
    <div className="flex min-h-screen bg-gray-50 font-body">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-gray-100 bg-white px-3 py-6 shadow-sm">
        {/* Logo / Title */}
        <div className="mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5b8523] shadow-md shadow-[#5b8523]/20">
              <span className="text-sm">🔔</span>
            </div>
            <h1 className="font-display text-base font-bold text-gray-900">
              Notifications
            </h1>
          </div>
          {unread > 0 && (
            <p className="mt-2 pl-1 text-xs text-gray-400">
              <span className="font-semibold text-[#5b8523]">{unread}</span> non{" "}
              {unread > 1 ? "lues" : "lue"}
            </p>
          )}
        </div>

        {/* Category navigation */}
        <nav className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.key}
              cat={cat}
              active={activeCategory === cat.key}
              unreadCount={unreadByCategory[cat.key] ?? 0}
              onClick={() => setActiveCategory(cat.key)}
            />
          ))}
        </nav>

        {/* Footer actions */}
        <div className="mt-auto space-y-1 border-t border-gray-100 pt-4">
          <button
            onClick={() => dispatch(markAllRead(currentUserId))}
            disabled={unread === 0}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left
                       text-xs font-medium text-gray-500 transition hover:bg-gray-100
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckAllIcon />
            Tout marquer comme lu
          </button>
          <button
            onClick={() => dispatch(deleteAllRead(currentUserId))}
            disabled={
              readList.length === 0 &&
              items.filter((n) => n.isRead).length === 0
            }
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left
                       text-xs font-medium text-red-400 transition hover:bg-red-50
                       disabled:cursor-not-allowed disabled:opacity-40"
          >
            <TrashIcon />
            Supprimer les lues
          </button>
        </div>
      </aside>

      {/* ── Main panel ──────────────────────────────────────────────────── */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center gap-3 border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50
                         pl-9 pr-3 text-sm text-gray-800 outline-none
                         transition placeholder:text-gray-400
                         focus:border-[#5b8523] focus:bg-white focus:ring-2 focus:ring-[#5b8523]/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Active category label */}
          <span className="hidden text-sm font-medium text-gray-500 sm:block">
            {CATEGORIES.find((c) => c.key === activeCategory)?.label}
          </span>

          {/* Mark all read */}
          {unread > 0 && (
            <button
              onClick={() => dispatch(markAllRead(currentUserId))}
              className="flex items-center gap-1.5 rounded-xl bg-[#5b8523] px-4 py-2
                         text-xs font-semibold text-white shadow-sm shadow-[#5b8523]/20
                         transition hover:bg-[#4a6e1b] active:scale-95"
            >
              <CheckAllIcon />
              Tout lu ({unread})
            </button>
          )}
        </header>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-6 pb-10 pt-4">
          {/* Loading skeletons */}
          {status === "loading" && (
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <SkeletonItem key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {status === "failed" && (
            <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
              <p className="text-sm font-medium text-red-600">
                Erreur de chargement
              </p>
              <p className="mt-0.5 text-xs text-red-400">{error}</p>
              <button
                onClick={() => dispatch(fetchNotifications(currentUserId))}
                className="mt-3 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold
                           text-red-600 transition hover:bg-red-200"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Empty */}
          {status === "succeeded" && filtered.length === 0 && (
            <EmptyState filtered={hasFilter} />
          )}

          {/* Unread section */}
          {status === "succeeded" && unreadList.length > 0 && (
            <section>
              <SectionDivider
                label="Non lues"
                count={unreadList.length}
                action="Tout marquer lu"
                onAction={() => dispatch(markAllRead(currentUserId))}
              />
              {unreadList.map((n) => (
                <NotificationItem
                  key={n.id}
                  notif={n}
                  onRead={() => dispatch(markOneAsRead(n.id))}
                  onDelete={() => dispatch(deleteNotif(n.id))}
                />
              ))}
            </section>
          )}

          {/* Read section */}
          {status === "succeeded" && readList.length > 0 && (
            <section className="mt-2">
              <SectionDivider
                label="Lues"
                count={readList.length}
                action="Supprimer les lues"
                onAction={() => dispatch(deleteAllRead(currentUserId))}
              />
              <div className="opacity-55 transition-opacity hover:opacity-75">
                {readList.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notif={n}
                    onDelete={() => dispatch(deleteNotif(n.id))}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function SearchIcon({ className = "" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
      strokeWidth="1.8"
    >
      <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
    </svg>
  );
}

function CheckAllIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M1 8l4 4 9-9" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5 8l4 4 5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
