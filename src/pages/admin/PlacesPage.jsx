import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import { Search, Star, Trash2, MapPin, BadgeCheck, ChevronDown, X, Check } from "lucide-react";

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
  active:   { bg: "#f0f5e0", color: "#6b9c3e" },
  pending:  { bg: "#fff7ed", color: "#c8761a" },
  archived: { bg: "#f8fafc", color: "#94a3b8" },
};

export default function PlacesPage() {
  const [places,  setPlaces]  = useState([]);
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPlaces({ limit: 200 });
      setPlaces(Array.isArray(data) ? data : []);
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFeature = async (id, current) => {
    try {
      await api.toggleFeaturePlace(id, !current);
      setPlaces((prev) => prev.map((p) => ((p._id === id || p.id === id) ? { ...p, isFeatured: !current } : p)));
      showToast(current ? "Removed from featured" : "Place featured ✓");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this place permanently?")) return;
    try {
      await api.deletePlace(id);
      setPlaces((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      showToast("Place deleted");
    } catch (e) { showToast(e.message, "error"); }
  };

  const filtered = places.filter((p) => {
    const text = `${p.name} ${p.cityName} ${p.categoryName}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase())) &&
           (!statusF || p.status === statusF);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Places</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>{places.length} places registered</p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: "#f0f5e0", color: "#6b9c3e" }}
        >
          <Star size={12} />
          {places.filter((p) => p.isFeatured).length} featured
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-4 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b8d48a" }} />
          <input
            type="text"
            placeholder="Search places…"
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        {loading ? (
          <div>{[...Array(5)].map((_, i) => <div key={i} className="h-16 border-b animate-pulse" style={{ borderColor: "#f0f5e0", background: i % 2 === 0 ? "#fafdf5" : "#fff" }} />)}</div>
        ) : !filtered.length ? (
          <div className="py-16 text-center" style={{ color: "#b8d48a" }}>
            <MapPin size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No places found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider border-b" style={{ borderColor: "#e8f0d4", color: "#7a6a58", background: "#fafdf5" }}>
                  <th className="px-5 py-3.5">Place</th>
                  <th className="px-5 py-3.5">City</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Rating</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Featured</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const ss = STATUS_STYLE[p.status] || STATUS_STYLE.active;
                  const id = p._id || p.id;
                  return (
                    <tr key={id} className="border-b last:border-0 transition-colors" style={{ borderColor: "#f0f5e0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafdf5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden"
                            style={{ background: "#f0f5e0" }}
                          >
                            {p.images?.[0]
                              ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              : <span>{p.categoryIcon || "📍"}</span>
                            }
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[160px]" style={{ color: "#1a2b10" }}>{p.name}</p>
                            {p.isVerifiedBusiness && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: "#2563eb" }}>
                                <BadgeCheck size={11} /> Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#7a6a58" }}>{p.cityName}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#7a6a58" }}>{p.categoryName}</td>
                      <td className="px-5 py-3.5">
                        {p.averageRating ? (
                          <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#c8761a" }}>
                            <Star size={13} fill="#c8761a" />
                            {p.averageRating.toFixed(1)}
                            <span className="text-xs font-normal" style={{ color: "#94a3b8" }}>({p.reviewCount})</span>
                          </span>
                        ) : <span style={{ color: "#d1d5db" }}>—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" style={ss}>
                          {p.status || "active"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => handleFeature(id, p.isFeatured)}
                          className="transition-all hover:scale-110"
                          title={p.isFeatured ? "Remove from featured" : "Feature this place"}
                        >
                          <Star
                            size={18}
                            fill={p.isFeatured ? "#c8761a" : "none"}
                            style={{ color: p.isFeatured ? "#c8761a" : "#d1d5db" }}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                          style={{ color: "#dc2626" }}
                          title="Delete place"
                        >
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
