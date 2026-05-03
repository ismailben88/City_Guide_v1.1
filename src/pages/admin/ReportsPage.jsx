import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import { Flag, Eye, CheckCircle, ChevronDown, X, Check, MapPin, Compass, CalendarDays, MessageSquare } from "lucide-react";

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
  open:     { bg: "#fef2f2", color: "#dc2626" },
  reviewed: { bg: "#fff7ed", color: "#c8761a" },
  resolved: { bg: "#f0f5e0", color: "#6b9c3e" },
};

const TYPE_ICON = {
  Place:        { Icon: MapPin,        color: "#6b9c3e" },
  GuideProfile: { Icon: Compass,       color: "#2563eb" },
  Event:        { Icon: CalendarDays,  color: "#7c3aed" },
  Comment:      { Icon: MessageSquare, color: "#0891b2" },
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [statusF, setStatusF] = useState("open");
  const [loading, setLoading] = useState(true);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusF ? { status: statusF } : {};
      const data = await api.getReports(params);
      setReports(Array.isArray(data) ? data : []);
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(false); }
  }, [statusF]);

  useEffect(() => { load(); }, [load]);

  const handleReview = async (id) => {
    try {
      await api.reviewReport(id);
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: "reviewed" } : r)));
      showToast("Marked as reviewed");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleResolve = async (id) => {
    try {
      await api.resolveReport(id);
      setReports((prev) => prev.map((r) => (r._id === id ? { ...r, status: "resolved" } : r)));
      showToast("Report resolved ✓");
    } catch (e) { showToast(e.message, "error"); }
  };

  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Reports</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
            {openCount > 0 ? `${openCount} open report${openCount > 1 ? "s" : ""} need attention` : "All reports handled"}
          </p>
        </div>
        {openCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#fef2f2", color: "#dc2626" }}>
            <Flag size={12} />
            {openCount} open
          </div>
        )}
      </div>

      <div className="flex gap-3 p-4 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        <div className="relative">
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}
          >
            <option value="open">Open</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="">All</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        {loading ? (
          <div>{[...Array(4)].map((_, i) => <div key={i} className="h-16 border-b animate-pulse" style={{ borderColor: "#f0f5e0", background: "#fafdf5" }} />)}</div>
        ) : !reports.length ? (
          <div className="py-16 text-center" style={{ color: "#b8d48a" }}>
            <Flag size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No reports found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider border-b" style={{ borderColor: "#e8f0d4", color: "#7a6a58", background: "#fafdf5" }}>
                  <th className="px-5 py-3.5">Target</th>
                  <th className="px-5 py-3.5">Reason</th>
                  <th className="px-5 py-3.5">Reported by</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const ss   = STATUS_STYLE[r.status] || STATUS_STYLE.open;
                  const meta = TYPE_ICON[r.targetType] || { Icon: Flag, color: "#94a3b8" };
                  const { Icon: TIcon } = meta;
                  return (
                    <tr key={r._id} className="border-b last:border-0 transition-colors" style={{ borderColor: "#f0f5e0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafdf5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}
                    >
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "#f0f5e0" }}
                          >
                            <TIcon size={13} style={{ color: meta.color }} />
                          </span>
                          <span className="text-xs font-medium" style={{ color: "#7a6a58" }}>{r.targetType}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium truncate max-w-[140px]" style={{ color: "#1a2b10" }}>{r.reason}</p>
                        {r.description && (
                          <p className="text-xs truncate max-w-[140px]" style={{ color: "#94a3b8" }}>{r.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#7a6a58" }}>
                        {r.reportedBy?.firstName
                          ? `${r.reportedBy.firstName} ${r.reportedBy.lastName}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: "#94a3b8" }}>
                        {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" style={ss}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status === "open" && (
                            <button
                              onClick={() => handleReview(r._id)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-amber-50"
                              style={{ color: "#c8761a" }}
                              title="Mark as reviewed"
                            >
                              <Eye size={15} />
                            </button>
                          )}
                          {(r.status === "open" || r.status === "reviewed") && (
                            <button
                              onClick={() => handleResolve(r._id)}
                              className="p-1.5 rounded-lg transition-colors hover:bg-green-50"
                              style={{ color: "#6b9c3e" }}
                              title="Resolve report"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          {r.status === "resolved" && (
                            <span className="text-xs" style={{ color: "#b8d48a" }}>✓ Done</span>
                          )}
                        </div>
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
