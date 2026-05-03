import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Users, MapPin, CalendarDays, Compass,
  ClipboardList, MessageSquare, ArrowRight,
  TrendingUp, Clock,
} from "lucide-react";

const STAT_CARDS = [
  { key: "users",           label: "Active Users",        Icon: Users,         to: "/admin/users",    accent: "#6b9c3e", bg: "#f0f5e0" },
  { key: "places",          label: "Active Places",       Icon: MapPin,        to: "/admin/places",   accent: "#2563eb", bg: "#eff6ff" },
  { key: "events",          label: "Upcoming Events",     Icon: CalendarDays,  to: "/admin/events",   accent: "#7c3aed", bg: "#f5f3ff" },
  { key: "guides",          label: "Verified Guides",     Icon: Compass,       to: "/admin/users",    accent: "#c8761a", bg: "#fff7ed" },
  { key: "pendingRequests", label: "Pending Requests",    Icon: ClipboardList, to: "/admin/requests", accent: "#dc2626", bg: "#fef2f2" },
  { key: "comments",        label: "Active Comments",     Icon: MessageSquare, to: "/admin/reports",  accent: "#0891b2", bg: "#ecfeff" },
];

const TYPE_LABEL = {
  guide_application:     "Guide application",
  business_verification: "Business verification",
};

function StatCard({ Icon, label, value, to, accent, bg }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: "#fff", borderColor: "#e8f0d4" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: bg }}
      >
        <Icon size={22} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "#1a2b10" }}>
          {value ?? <span className="text-slate-300">—</span>}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "#7a6a58" }}>{label}</p>
      </div>
      <ArrowRight size={14} className="ml-auto" style={{ color: "#c8d98a" }} />
    </Link>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "#fff7ed", color: "#c8761a" },
    approved: { bg: "#f0f5e0", color: "#6b9c3e" },
    rejected: { bg: "#fef2f2", color: "#dc2626" },
    open:     { bg: "#fef2f2", color: "#dc2626" },
    resolved: { bg: "#f8fafc", color: "#94a3b8" },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [dash,    setDash]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, d] = await Promise.all([api.getAdminStats(), api.getAdminDashboard()]);
        setStats(s);
        setDash(d);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (error) return (
    <div className="rounded-2xl border p-6" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#dc2626" }}>
      <p className="font-semibold">Failed to load dashboard</p>
      <p className="text-sm mt-1">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
            Platform overview · {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: "#f0f5e0", color: "#6b9c3e" }}
        >
          <TrendingUp size={13} />
          Live data
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "#e8f0d4" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {STAT_CARDS.map((c) => (
            <StatCard key={c.key} {...c} value={stats?.[c.key]} />
          ))}
        </div>
      )}

      {/* Two-column detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Pending requests */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: "#fff", borderColor: "#e8f0d4" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={17} style={{ color: "#6b9c3e" }} />
              <h3 className="font-semibold text-sm" style={{ color: "#1a2b10" }}>
                Latest Requests
              </h3>
            </div>
            <Link
              to="/admin/requests"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: "#6b9c3e" }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "#f0f5e0" }} />
              ))}
            </div>
          ) : !dash?.recentRequests?.length ? (
            <p className="text-sm text-center py-8" style={{ color: "#b8d48a" }}>
              No pending requests
            </p>
          ) : (
            <ul className="space-y-3">
              {dash.recentRequests.map((r) => (
                <li
                  key={r._id}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "#fafdf5" }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={r.requestedBy?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${r.requestedBy?.firstName || "U"} ${r.requestedBy?.lastName || ""}`)}&size=32&background=e8f0d4&color=6b9c3e`}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#1a2b10" }}>
                        {r.requestedBy?.firstName} {r.requestedBy?.lastName}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#7a6a58" }}>
                        {TYPE_LABEL[r.requestType] || r.requestType} · {timeAgo(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent activity log */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: "#fff", borderColor: "#e8f0d4" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={17} style={{ color: "#c8761a" }} />
              <h3 className="font-semibold text-sm" style={{ color: "#1a2b10" }}>
                Recent Activity
              </h3>
            </div>
            <Link
              to="/admin/logs"
              className="flex items-center gap-1 text-xs font-medium hover:underline"
              style={{ color: "#6b9c3e" }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: "#f0f5e0" }} />
              ))}
            </div>
          ) : !dash?.recentLogs?.length ? (
            <p className="text-sm text-center py-8" style={{ color: "#b8d48a" }}>
              No recent activity
            </p>
          ) : (
            <ul className="space-y-2">
              {dash.recentLogs.map((l) => (
                <li key={l._id} className="flex items-start gap-3 py-2 border-b last:border-0" style={{ borderColor: "#f0f5e0" }}>
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                    style={{ background: "#6b9c3e" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "#3d2b1a" }}>
                      <span className="font-medium">{l.adminId?.firstName || "Admin"}</span>
                      {" "}
                      <span style={{ color: "#7a6a58" }}>{l.action}</span>
                      {" "}
                      <span style={{ color: "#7a6a58" }}>{l.targetType}</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#b8d48a" }}>
                      {timeAgo(l.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
