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
} from "../store/slices/notiifcationSlice";

import { CATEGORIES } from "./Notifications/constants";
import { typeKey } from "./Notifications/utils";
import SkeletonItem    from "./Notifications/components/SkeletonItem";
import EmptyState      from "./Notifications/components/EmptyState";
import SectionDivider  from "./Notifications/components/SectionDivider";
import NotificationItem from "./Notifications/components/NotificationItem";
import CategoryTab     from "./Notifications/components/CategoryTab";
import { SearchIcon, XIcon, CheckAllIcon, TrashIcon } from "./Notifications/components/icons";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const items  = useSelector(selectAllNotifications);
  const unread = useSelector(selectUnreadCount);
  const status = useSelector(selectNotifStatus);
  const error  = useSelector(selectNotifError);

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
  const readList   = filtered.filter((n) => n.isRead);
  const hasFilter  = search.trim() || activeCategory !== "all";

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
