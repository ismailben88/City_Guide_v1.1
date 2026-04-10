import { useEffect, useState, useMemo } from "react";
import {
  RiSearchLine, RiNotification3Line, RiMapPin2Line,
  RiCalendarEventLine, RiShieldCheckLine, RiMegaphoneLine,
} from "react-icons/ri";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { HiXMark, HiCheck } from "react-icons/hi2";
import { TbTrash, TbClock } from "react-icons/tb";

import { api } from "../../services/api"; 
import { DateTimePicker } from "../../components/ui/DateTimePicker";
import { SortDropdown } from "../../components/ui/SortDropdown";

// Mapping des types de l'API vers tes icônes et couleurs
const TYPE_CONFIG = {
  "SYSTEM_BROADCAST": { icon: <RiMegaphoneLine size={14} />, label: "Updates", bg: "bg-blue-50", text: "text-blue-600" },
  "BOOKING_CONFIRMATION": { icon: <RiCalendarEventLine size={14} />, label: "Events", bg: "bg-emerald-50", text: "text-emerald-600" },
  "GUIDE_ALERT": { icon: <RiShieldCheckLine size={14} />, label: "Guides", bg: "bg-amber-50", text: "text-amber-600" },
  "LOCATION_UPDATE": { icon: <RiMapPin2Line size={14} />, label: "Places", bg: "bg-orange-50", text: "text-orange-600" },
};

const CATEGORIES = ["All", "SYSTEM_BROADCAST", "BOOKING_CONFIRMATION", "GUIDE_ALERT", "LOCATION_UPDATE"];

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent", icon: "🕐" },
  { value: "oldest", label: "Oldest First", icon: "🕰" },
  { value: "unread", label: "Unread First", icon: "🔵" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(null);
  const [sortBy, setSortBy] = useState("recent");

  // 1. Fetch data from API
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        setLoading(true);
        const data = await api.getNotifications(); // Assure-toi que cette méthode existe dans api.js
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  // 2. Logic de filtrage mise à jour
  const visible = useMemo(() => {
    let list = [...notifications];

    if (activeCategory !== "All") {
      list = list.filter((n) => n.type === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) => 
        n.title?.toLowerCase().includes(q) || 
        n.message?.toLowerCase().includes(q)
      );
    }

    if (dateFilter?.date) {
      const sel = dateFilter.date.toDateString();
      list = list.filter((n) => new Date(n.createdAt).toDateString() === sel);
    }

    list.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortBy === "recent") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      if (sortBy === "unread") return (a.isRead === b.isRead) ? 0 : a.isRead ? 1 : -1;
      return 0;
    });

    return list;
  }, [notifications, activeCategory, query, dateFilter, sortBy]);

  // Actions API
  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-[#3d2b1a] px-5 py-6 md:px-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-bold tracking-widest uppercase text-[#6b9c3e] text-[10px]">Portal 2026</span>
          <h1 className="font-display text-3xl font-bold text-white">Notifications</h1>
        </div>
        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <span className="bg-[#6b9c3e]/20 border border-[#6b9c3e]/40 text-[#c8d98a] text-[11px] font-bold px-3 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        {/* SIDEBAR */}
        <aside className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl border-2 transition-all text-sm
                ${activeCategory === cat ? 'border-[#6b9c3e] bg-[#6b9c3e]/5 text-[#6b9c3e] font-bold' : 'border-transparent text-ink3 hover:bg-sand'}`}
            >
              <span>{TYPE_CONFIG[cat]?.label || cat}</span>
              <span className="text-[10px] opacity-60">
                {cat === "All" ? notifications.length : notifications.filter(n => n.type === cat).length}
              </span>
            </button>
          ))}
        </aside>

        {/* LIST */}
        <div className="space-y-3">
          {/* TOOLBAR */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-sand3 shadow-sm">
            <RiSearchLine className="ml-2 text-ink3" />
            <input 
              className="flex-1 bg-transparent outline-none text-sm font-medium" 
              placeholder="Search in messages..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <DateTimePicker value={dateFilter?.date} onChange={setDateFilter} />
            <SortDropdown value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} />
          </div>

          {loading ? (
             <div className="text-center py-20 animate-pulse text-ink3">Syncing with server...</div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-sand3">
              <p className="text-ink3 text-sm">No notifications found.</p>
            </div>
          ) : (
            visible.map((n) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG["SYSTEM_BROADCAST"];
              return (
                <div 
                  key={n.id} 
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer
                    ${!n.isRead ? 'bg-[#f8fdf2] border-[#6b9c3e]/30 shadow-md shadow-emerald-900/5' : 'bg-white border-sand3'}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${config.bg} ${config.text}`}>
                    {config.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${!n.isRead ? 'font-bold' : 'font-semibold text-ink2'}`}>{n.title}</h4>
                      <span className="text-[10px] text-ink3 font-bold">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-ink3 leading-relaxed mb-2">{n.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-ink3 font-bold uppercase tracking-tighter">
                       <span className="flex items-center gap-1"><TbClock /> {new Date(n.createdAt).toLocaleDateString()}</span>
                       <span>•</span>
                       <span>{n.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }} className="p-2 hover:bg-red-50 text-ink3 hover:text-red-500 rounded-lg">
                      <TbTrash size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}