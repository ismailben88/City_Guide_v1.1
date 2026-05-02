// components/settings/SettingsLayout.jsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import {
  RiShieldLine, RiUserLine, RiBellLine, RiCompassLine,
  RiBriefcaseLine, RiVerifiedBadgeLine,
} from "react-icons/ri";
import "../../styles/profile-settings.css";

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { path: "/settings/account",          icon: <RiShieldLine size={15} />,    label: "Account & Security" },
  { path: "/settings/personal",         icon: <RiUserLine size={15} />,      label: "Personal info"      },
  { path: "/settings/notifications",    icon: <RiBellLine size={15} />,      label: "Notifications"      },
  null,
  { path: "/settings/profile/guide",    icon: <RiCompassLine size={15} />,   label: "Guide profile"      },
  { path: "/settings/profile/business", icon: <RiBriefcaseLine size={15} />, label: "Business profiles"  },
];

const PAGE_META = {
  "/settings/account":          { title: "Account & Security",   sub: "Manage sign-in credentials and account protection" },
  "/settings/personal":         { title: "Personal Information",  sub: "Legal details used for payouts and verification"  },
  "/settings/notifications":    { title: "Notifications",         sub: "Control how and when you hear from us"            },
  "/settings/profile/guide":    { title: "Guide Profile",         sub: "Your public-facing guide identity"                },
  "/settings/profile/business": { title: "Business Profiles",     sub: "Manage your listed businesses"                   },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const toDisplayName = (u) =>
  u?.name || [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "User";

const toAvatar = (u) =>
  u?.avatar || u?.avatarUrl ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(toDisplayName(u))}&background=7DA635&color=fff&size=128`;

// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);

  const meta    = PAGE_META[location.pathname] || { title: "Settings", sub: "" };
  const isGuide = location.pathname === "/settings/profile/guide";
  const isBiz   = location.pathname === "/settings/profile/business";

  const displayName = toDisplayName(user);
  const avatarSrc   = toAvatar(user);
  const roleLabel   = user?.role === "admin" ? "Admin" : user?.isGuide || user?.role === "guide" ? "Guide" : "Member";
  const roleColor   = user?.role === "admin" ? "var(--ps-orange)" : "var(--ps-green)";

  const joinedDate = (() => {
    const raw = user?.joinedAt || user?.createdAt;
    if (!raw) return null;
    return new Date(raw).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  })();

  return (
    <div className="min-h-screen" style={{ background: "var(--ps-bg)", fontFamily: "var(--ps-font-ui)" }}>

      {/* ── Page-title band ─────────────────────────────────────────────── */}
      <div style={{ background: "var(--ps-bg-2)", borderBottom: "1px solid var(--ps-line)" }}>
        <div className="max-w-[1200px] mx-auto px-8 py-6 flex items-end justify-between gap-4 flex-wrap max-[640px]:px-4">
          <div>
            <p className="m-0 mb-1.5 text-[11px]" style={{ color: "var(--ps-ink-3)" }}>
              Settings / {meta.title}
            </p>
            <h1
              className="m-0 text-[28px] font-semibold leading-tight"
              style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
            >
              {meta.title}
            </h1>
            <p className="m-0 mt-1 text-[13px]" style={{ color: "var(--ps-ink-3)" }}>
              {meta.sub}
            </p>
          </div>

          {/* Guide / Business segmented pill */}
          <div
            className="flex items-center p-1 rounded-full gap-1"
            style={{ background: "var(--ps-line)" }}
          >
            {[
              { label: "Guide",    active: isGuide, path: "/settings/profile/guide"    },
              { label: "Business", active: isBiz,   path: "/settings/profile/business" },
            ].map(({ label, active, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150"
                style={{
                  background: active ? "var(--ps-ink)" : "transparent",
                  color:      active ? "#fff"           : "var(--ps-ink-3)",
                  border: "none", cursor: "pointer",
                }}
              >
                {label}
                {active && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--ps-green)", color: "#fff" }}
                  >
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-col layout ──────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-8 py-8 flex gap-6 items-start max-[880px]:flex-col max-[880px]:px-4">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside
          className="w-[240px] flex-shrink-0 rounded-[18px] overflow-hidden sticky top-[88px] max-[880px]:w-full max-[880px]:static"
          style={{
            background:  "var(--ps-card)",
            border:      "1px solid var(--ps-line)",
            boxShadow:   "var(--ps-shadow-sm)",
          }}
        >
          {/* ── Identity card ─────────────────────────────────────── */}
          <div
            className="px-5 py-6 flex flex-col items-center text-center gap-3"
            style={{ background: "linear-gradient(135deg, var(--ps-dark) 0%, var(--ps-dark-2) 100%)" }}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={avatarSrc}
                alt={displayName}
                className="w-[60px] h-[60px] rounded-full object-cover border-2 block"
                style={{ borderColor: "rgba(125,166,53,0.55)" }}
              />
              {/* Online dot */}
              <span
                className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{ background: "var(--ps-green)", borderColor: "var(--ps-dark)" }}
              />
            </div>

            {/* Name + role */}
            <div>
              <div
                className="text-[15px] font-semibold text-white leading-tight"
                style={{ fontFamily: "var(--ps-font-display)" }}
              >
                {displayName}
              </div>

              {/* Role badge */}
              <span
                className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", color: roleColor }}
              >
                {user?.isVerified && <RiVerifiedBadgeLine size={9} />}
                {roleLabel}
              </span>
            </div>

            {/* Email + join date */}
            <div className="flex flex-col items-center gap-0.5">
              {user?.email && (
                <div
                  className="text-[11px] truncate max-w-[180px]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {user.email}
                </div>
              )}
              {joinedDate && (
                <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Joined {joinedDate}
                </div>
              )}
            </div>
          </div>

          {/* ── Navigation ────────────────────────────────────────── */}
          <nav aria-label="Settings navigation">
            <ul
              className="list-none m-0 p-2.5 pb-3 flex flex-col gap-0.5 max-[880px]:flex-row max-[880px]:overflow-x-auto"
              role="list"
            >
              {NAV.map((item, idx) => {
                if (!item) return (
                  <li key={idx} role="separator" aria-hidden="true">
                    <hr className="my-1.5 border-0 border-t" style={{ borderColor: "var(--ps-line)" }} />
                  </li>
                );
                const isActive   = location.pathname === item.path;
                const showJoinBadge =
                  (item.path === "/settings/profile/guide"    && !user?.isGuide) ||
                  (item.path === "/settings/profile/business" && user?.role !== "entrepreneur" && user?.role !== "admin");
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      aria-current={isActive ? "page" : undefined}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-150 text-left whitespace-nowrap"
                      style={{
                        background:  isActive ? "var(--ps-green-soft)" : "transparent",
                        color:       isActive ? "var(--ps-green-2)"    : "var(--ps-ink-2)",
                        border:      "none",
                        borderLeft:  `2px solid ${isActive ? "var(--ps-green-2)" : "transparent"}`,
                        cursor:      "pointer",
                      }}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {showJoinBadge && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: "var(--ps-orange)", color: "#fff" }}
                        >
                          Join
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* ── Main content ────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 pb-20">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
