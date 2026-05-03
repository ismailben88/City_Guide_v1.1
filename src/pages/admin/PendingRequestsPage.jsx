import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import {
  ClipboardList, CheckCircle, XCircle, Clock,
  Compass, Building2, X, Check, ChevronDown, Filter,
} from "lucide-react";

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

function RejectModal({ request, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-pop-in border" style={{ borderColor: "#e8f0d4" }}>
        <h3 className="font-display font-bold text-lg" style={{ color: "#1a2b10" }}>Reject Request</h3>
        <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
          Request from <span className="font-semibold">{request.requestedBy?.firstName} {request.requestedBy?.lastName}</span>
        </p>
        <textarea
          placeholder="Rejection reason (optional)…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="mt-4 w-full rounded-xl px-3 py-2.5 text-sm resize-none border focus:outline-none transition-shadow"
          style={{ borderColor: "#e8f0d4", background: "#fafdf5" }}
          onFocus={(e) => { e.target.style.borderColor = "#c8761a"; e.target.style.boxShadow = "0 0 0 3px rgba(200,118,26,0.15)"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#e8f0d4"; e.target.style.boxShadow = "none"; }}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors" style={{ borderColor: "#e8f0d4", color: "#7a6a58" }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)} className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors" style={{ background: "#dc2626" }}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

const TYPE_META = {
  guide_application:     { label: "Tour Guide",         Icon: Compass,   bg: "#eff6ff", color: "#2563eb" },
  business_verification: { label: "Business Verification", Icon: Building2, bg: "#f5f3ff", color: "#7c3aed" },
};

const STATUS_STYLE = {
  pending:  { bg: "#fff7ed", color: "#c8761a" },
  approved: { bg: "#f0f5e0", color: "#6b9c3e" },
  rejected: { bg: "#fef2f2", color: "#dc2626" },
};

export default function PendingRequestsPage() {
  const [requests,     setRequests]     = useState([]);
  const [typeF,        setTypeF]        = useState("");
  const [statusF,      setStatusF]      = useState("pending");
  const [loading,      setLoading]      = useState(true);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusF) params.status = statusF;
      if (typeF)   params.requestType = typeF;
      const data = await api.getPendingRequests(params);
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(false); }
  }, [typeF, statusF]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    try {
      await api.approvePendingRequest(id);
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "approved" } : r)));
      showToast("Request approved successfully");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleReject = async (id, reason) => {
    try {
      await api.rejectPendingRequest(id, reason);
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: "rejected" } : r)));
      showToast("Request rejected");
    } catch (e) { showToast(e.message, "error"); }
    setRejectTarget(null);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Pending Requests</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
            {pendingCount > 0
              ? `${pendingCount} request${pendingCount > 1 ? "s" : ""} awaiting review`
              : "All requests reviewed"}
          </p>
        </div>
        {pendingCount > 0 && (
          <div
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#fff7ed", color: "#c8761a" }}
          >
            <Clock size={12} />
            {pendingCount} pending
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl border" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        <div className="flex items-center gap-2" style={{ color: "#7a6a58" }}>
          <Filter size={14} />
          <span className="text-xs font-medium">Filters:</span>
        </div>
        <div className="relative">
          <select
            value={typeF}
            onChange={(e) => setTypeF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}
          >
            <option value="">All types</option>
            <option value="guide_application">Tour guide</option>
            <option value="business_verification">Business</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
        <div className="relative">
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "#f0f5e0" }} />
          ))}
        </div>
      ) : !requests.length ? (
        <div
          className="py-16 text-center rounded-2xl border"
          style={{ background: "#fff", borderColor: "#e8f0d4", color: "#b8d48a" }}
        >
          <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No requests for these filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((r) => {
            const meta = TYPE_META[r.requestType] || { label: r.requestType, Icon: ClipboardList, bg: "#f8fafc", color: "#64748b" };
            const ss   = STATUS_STYLE[r.status]   || STATUS_STYLE.pending;
            const { Icon: TypeIcon } = meta;
            return (
              <div
                key={r._id}
                className="rounded-2xl border p-5 transition-all hover:shadow-md"
                style={{ background: "#fff", borderColor: "#e8f0d4" }}
              >
                {/* Top: avatar + status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.requestedBy?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${r.requestedBy?.firstName || "U"} ${r.requestedBy?.lastName || ""}`)}&size=40&background=e8f0d4&color=6b9c3e`}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#1a2b10" }}>
                        {r.requestedBy?.firstName} {r.requestedBy?.lastName}
                      </p>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>{r.requestedBy?.email}</p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 capitalize"
                    style={ss}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Type badge + place */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    <TypeIcon size={11} />
                    {meta.label}
                  </span>
                  {r.placeId && (
                    <span
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: "#f0f5e0", color: "#6b9c3e" }}
                    >
                      📍 {r.placeId.name}
                    </span>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs mb-4 flex items-center gap-1.5" style={{ color: "#94a3b8" }}>
                  <Clock size={11} />
                  Submitted {new Date(r.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {/* Actions */}
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(r._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "#6b9c3e" }}
                    >
                      <CheckCircle size={15} />
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectTarget(r)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:text-white"
                      style={{ background: "#fff", color: "#dc2626", borderColor: "#fecaca" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#dc2626"; }}
                    >
                      <XCircle size={15} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          request={rejectTarget}
          onConfirm={(reason) => handleReject(rejectTarget._id, reason)}
          onCancel={() => setRejectTarget(null)}
        />
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
