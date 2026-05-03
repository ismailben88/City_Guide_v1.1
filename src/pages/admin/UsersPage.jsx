import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";
import { Search, Trash2, UserCheck, X, Check, ChevronDown } from "lucide-react";

const ROLES = ["user", "guide", "entrepreneur", "admin", "visitor"];

const ROLE_STYLE = {
  admin:        { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  guide:        { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  entrepreneur: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
  user:         { bg: "#f0f5e0", color: "#6b9c3e", border: "#c8d98a" },
  visitor:      { bg: "#f8fafc", color: "#94a3b8", border: "#e2e8f0" },
};

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

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-pop-in border" style={{ borderColor: "#e8f0d4" }}>
        <h3 className="font-display font-bold text-lg" style={{ color: "#1a2b10" }}>{title}</h3>
        <p className="text-sm mt-2" style={{ color: "#7a6a58" }}>{message}</p>
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-slate-50"
            style={{ borderColor: "#e8f0d4", color: "#7a6a58" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: "#dc2626" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [roleF,   setRoleF]   = useState("");
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(Array.isArray(data) ? data : data.users ?? []);
    } catch (e) { showToast(e.message, "error"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showToast("Role updated");
    } catch (e) { showToast(e.message, "error"); }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      showToast("User deleted");
    } catch (e) { showToast(e.message, "error"); }
    setConfirm(null);
  };

  const filtered = users.filter((u) => {
    const text = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase())) &&
           (!roleF   || u.role === roleF);
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: "#1a2b10" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "#7a6a58" }}>
            {users.length} registered members
          </p>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: "#f0f5e0", color: "#6b9c3e" }}
        >
          <UserCheck size={13} />
          {users.filter((u) => u.isActive).length} active
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap gap-3 p-4 rounded-2xl border"
        style={{ background: "#fff", borderColor: "#e8f0d4" }}
      >
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#b8d48a" }} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-shadow"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", focusRingColor: "#c8d98a" }}
            onFocus={(e) => { e.target.style.borderColor = "#6b9c3e"; e.target.style.boxShadow = "0 0 0 3px rgba(107,156,62,0.15)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#e8f0d4"; e.target.style.boxShadow = "none"; }}
          />
        </div>
        <div className="relative">
          <select
            value={roleF}
            onChange={(e) => setRoleF(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border focus:outline-none cursor-pointer"
            style={{ borderColor: "#e8f0d4", background: "#fafdf5", color: "#3d2b1a" }}
          >
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#b8d48a" }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e8f0d4" }}>
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b last:border-0" style={{ borderColor: "#f0f5e0" }}>
                <div className="w-10 h-10 rounded-full animate-pulse" style={{ background: "#f0f5e0" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded animate-pulse w-40" style={{ background: "#f0f5e0" }} />
                  <div className="h-2.5 rounded animate-pulse w-56" style={{ background: "#f8faf5" }} />
                </div>
              </div>
            ))}
          </div>
        ) : !filtered.length ? (
          <div className="py-16 text-center" style={{ color: "#b8d48a" }}>
            <UserCheck size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-xs font-semibold uppercase tracking-wider border-b"
                  style={{ borderColor: "#e8f0d4", color: "#7a6a58", background: "#fafdf5" }}
                >
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => {
                  const rs = ROLE_STYLE[u.role] || ROLE_STYLE.user;
                  return (
                    <tr
                      key={u._id}
                      className="border-b last:border-0 transition-colors"
                      style={{ borderColor: "#f0f5e0" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fafdf5"}
                      onMouseLeave={(e) => e.currentTarget.style.background = ""}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${u.firstName} ${u.lastName}`)}&size=40&background=e8f0d4&color=6b9c3e`}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-medium" style={{ color: "#1a2b10" }}>
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-xs" style={{ color: "#94a3b8" }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative inline-flex items-center gap-1">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="appearance-none pl-2.5 pr-6 py-1 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none"
                            style={{ background: rs.bg, color: rs.color, borderColor: rs.border }}
                          >
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 pointer-events-none" style={{ color: rs.color }} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={u.isActive
                            ? { background: "#f0f5e0", color: "#6b9c3e" }
                            : { background: "#fef2f2", color: "#dc2626" }
                          }
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs" style={{ color: "#94a3b8" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setConfirm({
                            title:     "Delete user",
                            message:   `Delete ${u.firstName} ${u.lastName}? This action cannot be undone.`,
                            onConfirm: () => handleDelete(u._id),
                          })}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                          style={{ color: "#dc2626" }}
                          title="Delete user"
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

      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
      {toast   && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
