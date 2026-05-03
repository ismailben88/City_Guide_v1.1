import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import { Search, Star, Trash2, CalendarDays, ChevronDown, X, Check } from "lucide-react";

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-pop-in"
      style={{ background: type === "error" ? "#dc2626" : "#6b9c3e", color: "#fff" }}
    >
      {type === "error" ? <X size={15} /> : <Check size={15} />}
      {msg}
    </div>
  );
}

const STATUS_STYLE = {
  upcoming:  { bg: "#eff6ff", color: "#2563eb" },
  ongoing:   { bg: "#f0f5e0", color: "#6b9c3e" },
  past:      { bg: "#f8fafc", color: "#94a3b8" },
  cancelled: { bg: "#fef2f2", color: "#dc2626" },
};

export default function EventsPage() {
  const [events,  setEvents]  = useState([]);
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAllEvents({ limit: 200 });
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFeature = async (id, current) => {
    try {
      await api.toggleFeatureEvent(id, !current);
      setEvents((prev) => prev.map((e) => ((e._id === id || e.id === id) ? { ...e, isFeatured: !current } : e)));
      showToast(current ? "Removed from featured" : "Event featured ✓");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id && e.id !== id));
      showToast("Event deleted");
    } catch (e) { showToast(e.message, "error"); }
  };

  const filtered = events.filter((e) => {
    const text = `${e.title} ${e.cityId?.name || ""}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase())) &&
           (!statusF || e.status === statusF);
  });

  function fmt(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Events</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>{events.length} events total</p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: "#eff6ff", color: "#2563eb" }}
        >
          <CalendarDays size={12} />
          {events.filter((e) => e.status === "upcoming").length} upcoming
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-4 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b8d48a" }} />
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5" }}
            onFocus={(e) => { e.target.style.borderColor = "#6b9c3e"; e.target.style.boxShadow = "0 0 0 3px rgba(107,156,62,0.15)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#e8f0d4"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <div className="relative">
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}
          >
            <option value="">All statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        {loading ? (
          <div>{[...Array(5)].map((_, i) => <div key={i} className="h-16 border-b animate-pulse" style={{ borderColor: "#f0f5e0", background: "#fafdf5" }} />)}</div>
        ) : !filtered.length ? (
          <div className="py-16 text-center" style={{ color: "#b8d48a" }}>
            <CalendarDays size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider border-b" style={{ borderColor: "#e8f0d4", color: "#7a6a58", background: "#fafdf5" }}>
                  <th className="px-5 py-3.5">Event</th>
                  <th className="px-5 py-3.5">City</th>
                  <th className="px-5 py-3.5">Dates</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Featured</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const ss = STATUS_STYLE[e.status] || STATUS_STYLE.upcoming;
                  const id = e._id || e.id;
                  return (
                    <tr key={id} className="border-b last:border-0 transition-colors" style={{ borderColor: "#f0f5e0" }}
                      onMouseEnter={(ev) => ev.currentTarget.style.background = "#fafdf5"}
                      onMouseLeave={(ev) => ev.currentTarget.style.background = ""}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium truncate max-w-[200px]" style={{ color: "#1a2b10" }}>{e.title}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#7a6a58" }}>
                        {e.cityId?.name || e.city?.name || "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: "#7a6a58" }}>
                        {fmt(e.dateRange?.from)} → {fmt(e.dateRange?.to)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" style={ss}>
                          {e.status || "upcoming"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={() => handleFeature(id, e.isFeatured)} className="transition-all hover:scale-110">
                          <Star size={18} fill={e.isFeatured ? "#c8761a" : "none"} style={{ color: e.isFeatured ? "#c8761a" : "#d1d5db" }} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleDelete(id)} className="p-1.5 rounded-lg transition-colors hover:bg-red-50" style={{ color: "#dc2626" }}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
