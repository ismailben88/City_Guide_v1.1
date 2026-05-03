import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logout } from "../../store/slices/authSlice";
import {
  LayoutDashboard, Users, ClipboardList, MapPin,
  CalendarDays, Flag, Image, ScrollText, LogOut,
  Menu, Globe, ChevronLeft,
} from "lucide-react";

const NAV = [
  { to: "/admin",           label: "Dashboard",        Icon: LayoutDashboard, end: true },
  { to: "/admin/users",     label: "Users",            Icon: Users },
  { to: "/admin/requests",  label: "Pending Requests", Icon: ClipboardList },
  { to: "/admin/places",    label: "Places",           Icon: MapPin },
  { to: "/admin/events",    label: "Events",           Icon: CalendarDays },
  { to: "/admin/reports",   label: "Reports",          Icon: Flag },
  { to: "/admin/media",     label: "Media",            Icon: Image },
  { to: "/admin/logs",      label: "Activity Logs",    Icon: ScrollText },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const user     = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatarUrl = user?.avatarUrl || user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=6b9c3e&color=fff&size=64`;

  return (
    <div className="flex h-screen overflow-hidden font-body" style={{ background: "#f3f6ee" }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 shadow-lg"
        style={{
          width: collapsed ? 64 : 240,
          background: "#1a2b10",
          color: "#e8f0d4",
        }}
      >
        {/* Brand */}
        <div
          className="flex items-center gap-3 px-4 border-b shrink-0"
          style={{ height: 64, borderColor: "#2e4a1c" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
            style={{ background: "#6b9c3e", color: "#fff" }}
          >
            CG
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-white text-sm leading-none truncate">
                CityGuide
              </p>
              <p className="text-xs mt-0.5 truncate" style={{ color: "#8ab870" }}>
                Admin Panel
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto p-1 rounded-md transition-colors hover:bg-white/10"
            style={{ color: "#8ab870" }}
          >
            {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 my-0.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "hover:bg-white/8"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: "#6b9c3e", color: "#fff" }
                  : { color: "#b8d48a" }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className="shrink-0" style={{ opacity: isActive ? 1 : 0.85 }} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #2e4a1c" }} />

        {/* User section */}
        <div className="p-3 space-y-1">
          {/* View site link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-white/10"
            style={{ color: "#8ab870" }}
            title={collapsed ? "View site" : undefined}
          >
            <Globe size={16} className="shrink-0" />
            {!collapsed && <span>View site</span>}
          </a>

          {/* Logout */}
          <button
            onClick={() => { dispatch(logout()); navigate("/"); }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-colors hover:bg-red-600/20"
            style={{ color: "#f87171" }}
            title={collapsed ? "Sign out" : undefined}
          >
            <LogOut size={16} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>

          {/* Avatar + name */}
          {!collapsed && (
            <div
              className="flex items-center gap-3 mt-2 px-3 py-2.5 rounded-xl"
              style={{ background: "#2e4a1c" }}
            >
              <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || `${user?.firstName} ${user?.lastName}`}
                </p>
                <p className="text-xs truncate" style={{ color: "#8ab870" }}>Admin</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center px-6 gap-4 shrink-0 border-b"
          style={{ height: 64, background: "#fff", borderColor: "#dde8cc" }}
        >
          <div className="flex-1">
            <span
              className="font-display font-bold text-base"
              style={{ color: "#2e4a1c" }}
            >
              Administration
            </span>
          </div>
          <div
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ background: "#f0f5e0", color: "#6b9c3e" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#6b9c3e" }}
            />
            Admin
          </div>
          <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
