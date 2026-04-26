// components/layout/navBar/components/UserDropdown.jsx
import { useRef, useEffect } from "react";
import {
  TbUserCircle,
  TbBookmark,
  TbCompass,
  TbSettings,
  TbShieldCheck,
  TbMapPin,
  TbStar,
  TbChevronRight,
  TbHeart,
  TbLogout,
} from "react-icons/tb";

// ─── menu structure ───────────────────────────────────────────────────────────
const MENU_GROUPS = [
  {
    items: [
      {
        icon: TbUserCircle,
        label: "My Profile",
        sub: "View & edit account",
        path: "/account",
      },
      {
        icon: TbHeart,
        label: "Favorites",
        sub: "Places you love",
        path: "/favorites",
        accent: true,
      },
      {
        icon: TbBookmark,
        label: "Saved Places",
        sub: "Your saved list",
        path: "/saved",
      },
      {
        icon: TbCompass,
        label: "My Tours",
        sub: "Booked & past tours",
        path: "/my-tours",
      },
    ],
  },
  {
    items: [
      {
        icon: TbStar,
        label: "Reviews",
        sub: "Your ratings & reviews",
        path: "/reviews",
      },
      {
        icon: TbSettings,
        label: "Settings",
        sub: "Preferences & privacy",
        path: "/settings",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function UserDropdown({ user, avatarSrc, onNavigate, onLogout }) {
  const panelRef = useRef(null);
  const isAdmin  = user?.role === "admin";
  const isGuide  = user?.role === "guide";

  useEffect(() => {
    panelRef.current?.querySelector("button")?.focus();
  }, []);

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-label="Account menu"
      className="
        absolute top-[calc(100%+10px)] right-0 w-[272px] z-50
        bg-white rounded-2xl overflow-hidden
        border border-[#e8e2da]
        shadow-[0_24px_64px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.05)]
        animate-scale-in origin-top-right
      "
    >
      {/* ── User header ──────────────────────────────────────────────────── */}
      <button
        role="menuitem"
        onClick={() => onNavigate("/account")}
        className="
          flex items-center gap-3 w-full px-4 py-[14px]
          bg-gradient-to-br from-[#f7f3ee] via-[#faf8f5] to-white
          border-b border-[#ede8e0]
          hover:from-[#f0ebe3] hover:to-[#f7f4ef]
          transition-colors duration-150 text-left group
        "
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={avatarSrc}
            alt={user?.name || "User"}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-offset-[3px] ring-offset-[#f7f3ee] ring-primary/20"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-white" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-display text-[13.5px] font-bold text-ink leading-tight">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.name || "My Account"}
            </p>
            {(isAdmin || isGuide) && (
              <span className="
                inline-flex items-center gap-0.5
                bg-green-light text-primary border border-primary/20
                font-body text-[9.5px] font-bold
                px-1.5 py-[1.5px] rounded-full flex-shrink-0
              ">
                <TbShieldCheck size={9} />
                {isAdmin ? "Admin" : "Guide"}
              </span>
            )}
          </div>
          <p className="font-body text-[11px] text-ink3 truncate mt-0.5 leading-tight">
            {user?.email}
          </p>
          {user?.city && (
            <p className="flex items-center gap-0.5 font-body text-[10.5px] text-ink3/60 mt-1 leading-tight">
              <TbMapPin size={10} />
              {user.city}
            </p>
          )}
        </div>

        <TbChevronRight
          size={13}
          className="text-ink3/30 flex-shrink-0 group-hover:text-primary/60 transition-colors"
        />
      </button>

      {/* ── Menu groups ──────────────────────────────────────────────────── */}
      <div className="p-1.5">
        {MENU_GROUPS.map((group, gi) => (
          <div key={gi}>
            {gi > 0 && <div className="my-1 mx-1 h-px bg-[#f0ebe4]" />}
            {group.items.map(({ icon: Icon, label, sub, path, accent }) => (
              <button
                key={path}
                role="menuitem"
                onClick={() => onNavigate(path)}
                className={[
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left",
                  "transition-all duration-150 group",
                  accent ? "hover:bg-rose-50/70" : "hover:bg-sand",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-[30px] h-[30px] rounded-[9px] flex items-center justify-center flex-shrink-0 transition-all duration-150",
                    accent
                      ? "bg-rose-50 text-rose-400 group-hover:bg-rose-100 group-hover:text-rose-500"
                      : "bg-sand2 text-ink3 group-hover:bg-primary/[0.08] group-hover:text-primary",
                  ].join(" ")}
                >
                  <Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={[
                    "font-body text-[12.5px] font-semibold leading-tight",
                    accent ? "text-rose-500" : "text-ink",
                  ].join(" ")}>
                    {label}
                  </p>
                  <p className="font-body text-[10.5px] text-ink3/65 leading-tight mt-0.5">
                    {sub}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ))}

        {/* ── Sign out ─────────────────────────────────────────────────── */}
        <div className="mt-1 pt-1 mx-1 border-t border-[#f0ebe4]">
          <button
            role="menuitem"
            onClick={onLogout}
            className="
              w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left
              hover:bg-red-50/80 transition-all duration-150 group
            "
          >
            <span className="
              w-[30px] h-[30px] rounded-[9px] flex items-center justify-center flex-shrink-0
              bg-red-50 text-red-400
              group-hover:bg-red-100 group-hover:text-red-500
              transition-all duration-150
            ">
              <TbLogout size={15} />
            </span>
            <div className="min-w-0">
              <p className="font-body text-[12.5px] font-semibold text-red-500 leading-tight">
                Sign out
              </p>
              <p className="font-body text-[10.5px] text-red-400/55 leading-tight mt-0.5">
                See you next time!
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
