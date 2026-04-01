// pages/NotificationsPage.jsx
import { useState, useMemo } from "react";
import {
  RiSearchLine, RiNotification3Line, RiMapPin2Line,
  RiCalendarEventLine, RiShieldCheckLine, RiMegaphoneLine,
} from "react-icons/ri";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { HiXMark, HiCheck } from "react-icons/hi2";
import { TbTrash, TbClock } from "react-icons/tb";

import { notifications, notificationCategories } from "../../data/index";
import { DateTimePicker } from "../../components/ui/DateTimePicker";
import { SortDropdown }   from "../../components/ui/SortDropdown";

import {
  PageWrap, PageHeader, HeaderLeft, PageEyebrow, PageTitle,
  UnreadBadge, MarkAllBtn,
  Container, Sidebar, SidebarLabel, CatBtn, CatCount,
  Content, Toolbar, ToolSearchWrap, ToolSearchIcon,
  ToolSearchInput, ToolDivider, ToolBtn, DeleteBtn, DateChip,
  NotifItem, NotifIconWrap, NotifBody, NotifText, NotifMeta,
  NotifTime, UnreadDot, NotifActions, SmallActionBtn,
  EmptyState, EmptyIcon, EmptyText,
} from "./NotificationsPage.styles";

// ─── Category icon map ────────────────────────────────────────────────────────
const CAT_ICONS = {
  "All":                    <RiNotification3Line size={14} />,
  "Places":                 <RiMapPin2Line       size={14} />,
  "Events":                 <RiCalendarEventLine size={14} />,
  "Guides":                 <RiShieldCheckLine   size={14} />,
  "Updates":                <RiMegaphoneLine     size={14} />,
};

const CAT_COLORS = {
  "Places":  { bg: "rgba(107,156,62,0.12)",  icon: "#6b9c3e"  },
  "Events":  { bg: "rgba(200,118,26,0.12)",  icon: "#c8761a"  },
  "Guides":  { bg: "rgba(61,43,26,0.09)",    icon: "#3d2b1a"  },
  "Updates": { bg: "rgba(100,120,200,0.1)",  icon: "#6478c8"  },
};

const SORT_OPTIONS = [
  { value: "recent",  label: "Most Recent",  icon: "🕐" },
  { value: "oldest",  label: "Oldest First", icon: "🕰" },
  { value: "unread",  label: "Unread First", icon: "🔵" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query,          setQuery]          = useState("");
  const [liked,          setLiked]          = useState(new Set());
  const [deleted,        setDeleted]        = useState(new Set());
  const [readAll,        setReadAll]        = useState(false);

  // ── new state for the two toolbar controls ────────────────────────────────
  const [dateFilter, setDateFilter] = useState(null);   // { date, timeStr } | null
  const [sortBy,     setSortBy]     = useState("recent");

  // ── filter + sort ─────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = notifications.filter((n) => !deleted.has(n.id));

    if (activeCategory !== "All")
      list = list.filter((n) => n.category === activeCategory);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) => n.text?.toLowerCase().includes(q));
    }

    // date filter — keep only notifications whose date matches selected date
    if (dateFilter?.date) {
      const sel = dateFilter.date;
      list = list.filter((n) => {
        const d = new Date(n.date);
        return (
          d.getFullYear() === sel.getFullYear() &&
          d.getMonth()    === sel.getMonth()    &&
          d.getDate()     === sel.getDate()
        );
      });
    }

    // sort
    if (sortBy === "recent") {
      list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "unread") {
      list = [...list].sort((a, b) => {
        const au = !a.read && !readAll ? 0 : 1;
        const bu = !b.read && !readAll ? 0 : 1;
        return au - bu;
      });
    }

    return list;
  }, [activeCategory, query, deleted, dateFilter, sortBy, readAll]);

  // ── counts ────────────────────────────────────────────────────────────────
  const countFor = (cat) =>
    cat === "All"
      ? notifications.filter((n) => !deleted.has(n.id)).length
      : notifications.filter((n) => !deleted.has(n.id) && n.category === cat).length;

  const unreadCount = readAll ? 0 : visible.filter((n) => !n.read).length;

  // ── label shown on the DateChip ───────────────────────────────────────────
  const chipLabel = dateFilter?.date
    ? dateFilter.date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    : "Apr 05";

  const toggleLike  = (id) => setLiked((s)  => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const deleteNotif = (id) => setDeleted((s) => new Set(s).add(id));
  const clearAll    = ()   => setDeleted(new Set(notifications.map((n) => n.id)));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageWrap>

      {/* ── Header ── */}
      <PageHeader>
        <HeaderLeft>
          <PageEyebrow>Inbox</PageEyebrow>
          <PageTitle>Notifications</PageTitle>
        </HeaderLeft>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {unreadCount > 0 && (
            <UnreadBadge>
              <RiNotification3Line size={11} />
              {unreadCount} unread
            </UnreadBadge>
          )}
          <MarkAllBtn onClick={() => setReadAll(true)}>
            <HiCheck size={13} /> Mark all as read
          </MarkAllBtn>
        </div>
      </PageHeader>

      <Container>

        {/* ── Sidebar ── */}
        <Sidebar>
          <SidebarLabel>Categories</SidebarLabel>
          {notificationCategories.map((cat) => (
            <CatBtn
              key={cat}
              $active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {CAT_ICONS[cat] || <RiNotification3Line size={14} />}
                {cat}
              </span>
              <CatCount $active={activeCategory === cat}>
                {countFor(cat)}
              </CatCount>
            </CatBtn>
          ))}
        </Sidebar>

        {/* ── Content ── */}
        <Content>

          {/* ── Toolbar ── */}
          <Toolbar>
            <ToolSearchWrap>
              <ToolSearchIcon><RiSearchLine size={15} /></ToolSearchIcon>
              <ToolSearchInput
                placeholder="Search notifications…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <ToolBtn onClick={() => setQuery("")} aria-label="Clear search">
                  <HiXMark size={13} />
                </ToolBtn>
              )}
            </ToolSearchWrap>

            <ToolDivider />

            {/* ── Calendar picker ── */}
            <DateTimePicker
              value={dateFilter?.date}
              onChange={(val) => setDateFilter(val)}
            >
              <DateChip
                $active={!!dateFilter}
                title={dateFilter ? "Click to change date filter" : "Filter by date"}
              >
                <RiCalendarEventLine size={12} />
                {chipLabel}
                {dateFilter && (
                  <span
                    onClick={(e) => { e.stopPropagation(); setDateFilter(null); }}
                    style={{ marginLeft: 4, opacity: 0.7, fontSize: 11 }}
                    title="Clear date filter"
                  >
                    ✕
                  </span>
                )}
              </DateChip>
            </DateTimePicker>

            {/* ── Sort dropdown ── */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              label="Sort by"
            >
              <ToolBtn
                aria-label="Sort"
                title="Sort notifications"
                style={{ color: sortBy !== "recent" ? "var(--color-primary)" : undefined }}
              >
                <TbClock size={15} />
              </ToolBtn>
            </SortDropdown>

            <DeleteBtn
              aria-label="Clear all"
              onClick={clearAll}
              disabled={visible.length === 0}
            >
              <TbTrash size={15} />
            </DeleteBtn>
          </Toolbar>

          {/* ── Notification list ── */}
          {visible.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔔</EmptyIcon>
              <EmptyText>
                {query
                  ? "No notifications match your search."
                  : dateFilter
                  ? "No notifications for this date."
                  : "No notifications in this category."}
              </EmptyText>
            </EmptyState>
          ) : (
            visible.map((n, i) => {
              const colors   = CAT_COLORS[n.category] || CAT_COLORS["Places"];
              const isUnread = !n.read && !readAll;
              const isLiked  = liked.has(n.id);

              return (
                <NotifItem key={n.id} $unread={isUnread} $index={i}>

                  <NotifIconWrap $color={colors.bg} $iconColor={colors.icon}>
                    {n.icon || <RiNotification3Line size={18} />}
                  </NotifIconWrap>

                  <NotifBody>
                    <NotifText $unread={isUnread}>{n.text}</NotifText>
                    <NotifMeta>
                      <NotifTime><TbClock size={11} />{n.time}</NotifTime>
                      <NotifTime><RiCalendarEventLine size={11} />{n.date}</NotifTime>
                    </NotifMeta>
                  </NotifBody>

                  {isUnread && <UnreadDot />}

                  <NotifActions>
                    <SmallActionBtn onClick={() => toggleLike(n.id)} aria-label={isLiked ? "Unlike" : "Like"}>
                      {isLiked
                        ? <IoHeart size={14} style={{ color: "#e05a5a" }} />
                        : <IoHeartOutline size={14} />
                      }
                    </SmallActionBtn>
                    <SmallActionBtn $danger onClick={() => deleteNotif(n.id)} aria-label="Delete">
                      <TbTrash size={14} />
                    </SmallActionBtn>
                  </NotifActions>

                </NotifItem>
              );
            })
          )}

        </Content>
      </Container>
    </PageWrap>
  );
}
