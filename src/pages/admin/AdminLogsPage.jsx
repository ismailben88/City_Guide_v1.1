import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import {
  ScrollText, RefreshCw, MapPin, Compass,
  CalendarDays, ClipboardList, User, Flag, Image,
  ChevronDown, Search,
} from "lucide-react";

const ACTION_STYLE = {
  approve:  { bg: "#f0f5e0", color: "#6b9c3e" },
  reject:   { bg: "#fef2f2", color: "#dc2626" },
  delete:   { bg: "#fef2f2", color: "#dc2626" },
  create:   { bg: "#eff6ff", color: "#2563eb" },
  update:   { bg: "#fff7ed", color: "#c8761a" },
  feature:  { bg: "#f5f3ff", color: "#7c3aed" },
  resolve:  { bg: "#ecfeff", color: "#0891b2" },
  review:   { bg: "#fff7ed", color: "#c8761a" },
};

const TYPE_META = {
  Place:          { Icon: MapPin,        color: "#6b9c3e" },
  GuideProfile:   { Icon: Compass,       color: "#2563eb" },
  Event:          { Icon: CalendarDays,  color: "#7c3aed" },
  PendingRequest: { Icon: ClipboardList, color: "#c8761a" },
  User:           { Icon: User,          color: "#94a3b8" },
  Report:         { Icon: Flag,          color: "#dc2626" },
  Media:          { Icon: Image,         color: "#0891b2" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminLogsPage() {
  const [logs,    setLogs]    = useState([]);
  const [actionF, setActionF] = useState("");
  const [typeF,   setTypeF]   = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (actionF) params.action     = actionF;
      if (typeF)   params.targetType = typeF;
      const data = await api.getAdminLogs(params);
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [actionF, typeF]);

  useEffect(() => { load(); }, [load]);

  function getActionStyle(action) {
    const key = Object.keys(ACTION_STYLE).find((k) => action?.toLowerCase().includes(k));
    return ACTION_STYLE[key] || { bg: "#f8fafc", color: "#94a3b8" };
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Activity Logs</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
            Complete audit trail of all admin actions
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:shadow-sm"
          style={{ borderColor: "#e8f0d4", background: "#fff", color: "#6b9c3e" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        <div className="flex-1 min-w-[180px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b8d48a" }} />
          <input
            type="text"
            placeholder="Filter by action…"
            value={actionF}
            onChange={(e) => setActionF(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl text-sm border focus:outline-none"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5" }}
            onFocus={(e) => { e.target.style.borderColor = "#6b9c3e"; e.target.style.boxShadow = "0 0 0 3px rgba(107,156,62,0.15)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#e8f0d4"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <div className="relative">
          <select
            value={typeF}
            onChange={(e) => setTypeF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}
          >
            <option value="">All target types</option>
            <option value="Place">Place</option>
            <option value="GuideProfile">Guide</option>
            <option value="Event">Event</option>
            <option value="PendingRequest">Request</option>
            <option value="User">User</option>
            <option value="Report">Report</option>
            <option value="Media">Media</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        {loading ? (
          <div>{[...Array(6)].map((_, i) => <div key={i} className="h-14 border-b animate-pulse" style={{ borderColor: "#f0f5e0", background: "#fafdf5" }} />)}</div>
        ) : error ? (
          <div className="py-12 text-center" style={{ color: "#dc2626" }}>
            <p className="font-medium">{error}</p>
          </div>
        ) : !logs.length ? (
          <div className="py-16 text-center" style={{ color: "#b8d48a" }}>
            <ScrollText size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider border-b" style={{ borderColor: "#e8f0d4", color: "#7a6a58", background: "#fafdf5" }}>
                  <th className="px-5 py-3.5">Admin</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Target</th>
                  <th className="px-5 py-3.5">Details</th>
                  <th className="px-5 py-3.5">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const as   = getActionStyle(log.action);
                  const meta = TYPE_META[log.targetType] || { Icon: ScrollText, color: "#94a3b8" };
                  const { Icon: TIcon } = meta;
                  return (
                    <tr key={log._id} className="border-b last:border-0 transition-colors" style={{ borderColor: "#f0f5e0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafdf5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-sm" style={{ color: "#1a2b10" }}>
                          {log.adminId?.firstName} {log.adminId?.lastName}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize" style={as}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: "#f0f5e0" }}
                          >
                            <TIcon size={12} style={{ color: meta.color }} />
                          </span>
                          <span className="text-xs font-medium" style={{ color: "#7a6a58" }}>{log.targetType}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <p className="text-xs truncate" style={{ color: "#94a3b8" }}>
                          {log.metadata ? JSON.stringify(log.metadata) : "—"}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs" style={{ color: "#94a3b8" }}>
                        {timeAgo(log.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
