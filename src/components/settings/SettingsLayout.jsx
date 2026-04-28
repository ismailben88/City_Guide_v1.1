import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import { IoStarSharp } from "react-icons/io5";
import {
  RiShieldLine, RiUserLine, RiBellLine, RiCompassLine, RiBriefcaseLine,
} from "react-icons/ri";
import "../../styles/profile-settings.css";

const NAV = [
  { path: "/settings/account",          icon: <RiShieldLine size={15} />,    label: "Account"           },
  { path: "/settings/personal",         icon: <RiUserLine size={15} />,      label: "Personal info"     },
  { path: "/settings/notifications",    icon: <RiBellLine size={15} />,      label: "Notifications"     },
  null,
  { path: "/settings/profile/guide",    icon: <RiCompassLine size={15} />,   label: "Guide profile"     },
  { path: "/settings/profile/business", icon: <RiBriefcaseLine size={15} />, label: "Business profiles" },
];

const PAGE_META = {
  "/settings/account":          { title: "Account & Security",      sub: "Manage sign-in credentials and account protection" },
  "/settings/personal":         { title: "Personal Information",     sub: "Legal details used for payouts and verification" },
  "/settings/notifications":    { title: "Notifications",            sub: "Control how and when you hear from us" },
  "/settings/profile/guide":    { title: "Guide Profile",            sub: "Your public-facing guide identity" },
  "/settings/profile/business": { title: "Business Profiles",        sub: "Manage your listed businesses" },
};

export default function SettingsLayout() {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);

  const avatarSrc = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Guide")}&background=7DA635&color=fff&size=128`;

  const meta     = PAGE_META[location.pathname] || { title: "Settings", sub: "" };
  const isGuide  = location.pathname === "/settings/profile/guide";
  const isBiz    = location.pathname === "/settings/profile/business";

  return (
    <div className="min-h-screen" style={{ background: "var(--ps-bg)", fontFamily: "var(--ps-font-ui)" }}>

      {/* ── Page-title band ─────────────────────────────────── */}
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
            <p className="m-0 mt-1 text-[13px]" style={{ color: "var(--ps-ink-3)" }}>{meta.sub}</p>
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
                  border:     "none", cursor: "pointer",
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

      {/* ── Two-col layout ──────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-8 py-8 flex gap-6 items-start max-[880px]:flex-col max-[880px]:px-4">

        {/* ── Sidebar ───────────────────────────────────────── */}
        <aside
          className="w-[240px] flex-shrink-0 rounded-[18px] overflow-hidden sticky top-[88px] max-[880px]:w-full max-[880px]:static"
          style={{ background: "var(--ps-card)", border: "1px solid var(--ps-line)", boxShadow: "var(--ps-shadow-sm)" }}
        >
          {/* Identity card */}
          <div
            className="px-5 py-6 flex flex-col items-center text-center gap-2"
            style={{ background: "linear-gradient(135deg, var(--ps-dark) 0%, var(--ps-dark-2) 100%)" }}
          >
            <div className="relative">
              <img
                src={avatarSrc}
                alt={user?.name || "Guide"}
                className="w-14 h-14 rounded-full object-cover border-2 block"
                style={{ borderColor: "rgba(125,166,53,0.5)" }}
              />
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{ background: "var(--ps-green)" }}
              />
            </div>
            <div>
              <div
                className="text-[15px] font-medium text-white leading-tight"
                style={{ fontFamily: "var(--ps-font-display)" }}
              >
                {user?.name || "Tarik Amrani"}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                @{user?.username || "tarik.guide"}
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              <span className="flex items-center gap-0.5">
                <IoStarSharp size={11} style={{ color: "#f4b942" }} /> 4.9
              </span>
              <span>·</span>
              <span>32 tours</span>
            </div>
          </div>

          {/* Nav */}
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
                const isActive = location.pathname === item.path;
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
                      {item.icon} {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* ── Main content ──────────────────────────────────── */}
        <main className="flex-1 min-w-0 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
