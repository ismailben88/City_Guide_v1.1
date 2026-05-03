import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import { Image, CheckCircle, XCircle, Trash2, X, Check, ChevronDown } from "lucide-react";

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
  pending:  { bg: "#fff7ed", color: "#c8761a" },
  approved: { bg: "#f0f5e0", color: "#6b9c3e" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
};

function MediaCard({ item, onApprove, onReject, onDelete }) {
  const BASE = (import.meta.env.VITE_API_URL || "").replace("/api/v1", "");
  const src  = item.filePath?.startsWith("http") ? item.filePath : `${BASE}/${item.filePath}`;
  const ss   = STATUS_STYLE[item.status] || STATUS_STYLE.pending;

  return (
    <div className="rounded-2xl border overflow-hidden transition-all hover:shadow-md" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
      {/* Image */}
      <div className="aspect-video relative overflow-hidden" style={{ background: "#f0f5e0" }}>
        {item.fileType?.startsWith("image") !== false ? (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div
          className="absolute inset-0 hidden items-center justify-center"
          style={{ background: "#f0f5e0" }}
        >
          <Image size={32} style={{ color: "#b8d48a" }} />
        </div>
        {/* Status pill */}
        <span
          className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
          style={ss}
        >
          {item.status || "pending"}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span
            className="px-2 py-0.5 rounded-md text-xs font-medium"
            style={{ background: "#f0f5e0", color: "#6b9c3e" }}
          >
            {item.parentType}
          </span>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
          </span>
        </div>
        <p className="text-xs font-medium truncate" style={{ color: "#7a6a58" }}>
          {item.uploadedBy?.firstName} {item.uploadedBy?.lastName}
        </p>

        {/* Actions */}
        {item.status === "pending" ? (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onApprove(item._id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#6b9c3e" }}
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => onReject(item._id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border transition-all"
              style={{ background: "#fff", color: "#dc2626", borderColor: "#fecaca" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#dc2626"; }}
            >
              <XCircle size={13} /> Reject
            </button>
          </div>
        ) : (
          <button
            onClick={() => onDelete(item._id)}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-xs transition-colors"
            style={{ color: "#94a3b8" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#94a3b8"; }}
          >
            <Trash2 size={12} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function MediaPage() {
  const [media,   setMedia]   = useState([]);
  const [statusF, setStatusF] = useState("pending");
  const [typeF,   setTypeF]   = useState("");
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data  = await api.getMedia(undefined, undefined);
      const items = Array.isArray(data) ? data : [];
      setMedia(items.filter(
        (m) => (!statusF || m.status === statusF) && (!typeF || m.parentType === typeF)
      ));
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(false); }
  }, [statusF, typeF]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    try {
      await api.approveMedia(id);
      setMedia((prev) => prev.map((m) => (m._id === id ? { ...m, status: "approved" } : m)));
      showToast("Media approved ✓");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectMedia(id);
      setMedia((prev) => prev.map((m) => (m._id === id ? { ...m, status: "rejected" } : m)));
      showToast("Media rejected");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media permanently?")) return;
    try {
      await api.deleteMedia(id);
      setMedia((prev) => prev.filter((m) => m._id !== id));
      showToast("Media deleted");
    } catch (e) { showToast(e.message, "error"); }
  };

  const pendingCount = media.filter((m) => m.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Media</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
            {pendingCount > 0 ? `${pendingCount} file${pendingCount > 1 ? "s" : ""} awaiting approval` : "Media approval queue"}
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#fff7ed", color: "#c8761a" }}>
            <Image size={12} />
            {pendingCount} pending
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 p-4 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        <div className="relative">
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
        <div className="relative">
          <select value={typeF} onChange={(e) => setTypeF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}>
            <option value="">All types</option>
            <option value="Place">Places</option>
            <option value="GuideProfile">Guides</option>
            <option value="Event">Events</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl h-56 animate-pulse" style={{ background: "#f0f5e0" }} />
          ))}
        </div>
      ) : !media.length ? (
        <div className="py-16 text-center rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4", color: "#b8d48a" }}>
          <Image size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No media for these filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <MediaCard key={item._id} item={item} onApprove={handleApprove} onReject={handleReject} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
