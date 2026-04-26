// components/layout/Navbar.jsx
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import {
  TbChevronDown,
  TbSearch,
  TbX,
  TbHome,
  TbCompass,
  TbMapPin,
  TbCalendarEvent,
  TbInfoCircle,
} from "react-icons/tb";

import {
  selectUser,
  selectIsLoggedIn,
  logout,
} from "../../../store/slices/authSlice";

import CityGuideLogo from "./components/CityGuideLogo";
import UserDropdown from "./components/UserDropdown";

// ─── constants ───────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: 1, label: "Home",   path: "/",       icon: TbHome },
  { id: 2, label: "Guides", path: "/guides", icon: TbCompass },
  { id: 3, label: "Places", path: "/places", icon: TbMapPin },
  { id: 4, label: "Events", path: "/events", icon: TbCalendarEvent },
  { id: 5, label: "About",  path: "/about",  icon: TbInfoCircle },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar({ setShowLogin }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [hasNotif, setHasNotif]       = useState(true);
  const [scrolled, setScrolled]       = useState(false);
  const [dropOpen, setDropOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dropRef         = useRef(null);
  const searchInputRef  = useRef(null);

  // ── scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── lock body scroll when drawer open ────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // ── focus search input when opened ───────────────────────────────────────
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // ── close on route change ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    setDrawerOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isActive = useCallback(
    (path) => (path === "/" ? pathname === "/" : pathname.startsWith(path)),
    [pathname],
  );

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.name || "U",
    )}&background=5b8523&color=fff&size=128&bold=true`;

  const goTo = (path) => {
    setDrawerOpen(false);
    setDropOpen(false);
    setSearchOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    goTo("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      goTo(`/places?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Fixed navbar ─────────────────────────────────────────────────── */}
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-ink2/[0.97] backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_4px_32px_rgba(0,0,0,0.35)]"
            : "bg-ink2",
        ].join(" ")}
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 h-[68px] flex items-center gap-4 lg:gap-6">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <CityGuideLogo onClick={() => goTo("/")} />

          {/* ── Center area: nav links ↔ search bar ──────────────────────── */}
          <div className="hidden lg:flex flex-1 items-center justify-center relative min-w-0">

            {/* Desktop nav links */}
            <nav
              aria-label="Main navigation"
              className={[
                "flex items-center gap-0.5 transition-all duration-200",
                searchOpen ? "opacity-0 pointer-events-none" : "opacity-100",
              ].join(" ")}
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => goTo(link.path)}
                    className={[
                      "relative flex items-center gap-1.5",
                      "font-body text-[13.5px] font-semibold px-4 py-2.5 rounded-xl",
                      "transition-all duration-200 group",
                      active ? "text-white" : "text-white/50 hover:text-white/85",
                    ].join(" ")}
                  >
                    {/* Hover / active bg */}
                    <span
                      className={[
                        "absolute inset-0 rounded-xl transition-opacity duration-200",
                        active
                          ? "bg-white/[0.07] opacity-100"
                          : "bg-white/[0.05] opacity-0 group-hover:opacity-100",
                      ].join(" ")}
                    />

                    {/* Icon */}
                    <Icon
                      size={14}
                      className={[
                        "relative flex-shrink-0 transition-colors duration-200",
                        active
                          ? "text-accent"
                          : "text-white/30 group-hover:text-white/60",
                      ].join(" ")}
                    />

                    <span className="relative">{link.label}</span>

                    {/* Active underline */}
                    <span
                      className={[
                        "absolute bottom-[3px] left-4 right-4 h-[1.5px] rounded-full",
                        "bg-accent/80 transition-all duration-200",
                        active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
                      ].join(" ")}
                      style={{ transformOrigin: "center" }}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Inline search bar (overlays nav when open) */}
            <div
              className={[
                "absolute inset-0 flex items-center justify-center",
                "transition-all duration-200",
                searchOpen ? "opacity-100" : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2.5 w-full max-w-[480px] bg-white/[0.08] border border-white/[0.14] rounded-2xl px-4 py-2.5 focus-within:border-primary/50 transition-colors duration-200"
              >
                <TbSearch size={15} className="text-white/40 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities, places, events…"
                  className="flex-1 bg-transparent text-white placeholder-white/35 font-body text-[13.5px] outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                  >
                    <TbX size={14} />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* ── Right actions ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0 flex-shrink-0">

            {/* Search toggle — desktop only */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? "Close search" : "Search"}
              className={[
                "hidden lg:flex w-9 h-9 rounded-xl items-center justify-center",
                "border transition-all duration-200",
                searchOpen
                  ? "border-accent/50 bg-accent/[0.12] text-accent"
                  : "border-white/[0.09] bg-white/[0.05] text-white/65 hover:text-white hover:bg-white/[0.10] hover:border-white/[0.16]",
              ].join(" ")}
            >
              {searchOpen ? <TbX size={17} /> : <TbSearch size={16} />}
            </button>

            {/* Notification bell */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  goTo("/notifications");
                  setHasNotif(false);
                }}
                aria-label="Notifications"
                className="
                  relative w-9 h-9 rounded-xl flex items-center justify-center
                  border border-white/[0.09] bg-white/[0.05]
                  text-white/65 hover:text-white
                  hover:bg-white/[0.10] hover:border-white/[0.16]
                  transition-all duration-200
                "
              >
                {hasNotif ? (
                  <IoNotifications size={18} />
                ) : (
                  <IoNotificationsOutline size={18} />
                )}
                {hasNotif && (
                  <span
                    className="
                      absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full
                      bg-accent border-[1.5px] border-ink2
                      animate-pulse-soft
                    "
                  />
                )}
              </button>
            )}

            {/* Avatar pill — desktop, logged in */}
            {isLoggedIn ? (
              <div ref={dropRef} className="relative hidden md:block">
                <button
                  onClick={() => setDropOpen((v) => !v)}
                  aria-label="My account"
                  aria-expanded={dropOpen}
                  aria-haspopup="true"
                  className={[
                    "flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full",
                    "border transition-all duration-200",
                    dropOpen
                      ? "border-primary/60 bg-primary/[0.12] shadow-[0_0_0_3px_rgba(91,133,35,0.12)]"
                      : "border-white/[0.10] bg-white/[0.06] hover:border-primary/40 hover:bg-primary/[0.08]",
                  ].join(" ")}
                >
                  <div className="relative">
                    <img
                      src={avatarSrc}
                      alt={user?.name || "User"}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-green-mid/40"
                    />
                    <span className="absolute -bottom-px -right-px w-2.5 h-2.5 rounded-full bg-primary border-2 border-ink2" />
                  </div>
                  <span className="font-body text-[13px] font-semibold text-white/90 max-w-[80px] truncate leading-none">
                    {user?.firstName || user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <TbChevronDown
                    size={13}
                    className={[
                      "text-white/40 transition-transform duration-200 flex-shrink-0",
                      dropOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>

                {dropOpen && (
                  <UserDropdown
                    user={user}
                    avatarSrc={avatarSrc}
                    onNavigate={goTo}
                    onLogout={handleLogout}
                    onClose={() => setDropOpen(false)}
                  />
                )}
              </div>
            ) : (
              /* Sign in button */
              <button
                onClick={() => setShowLogin(true)}
                aria-label="Sign in"
                className="
                  hidden md:flex items-center gap-2 px-4 h-9 rounded-xl
                  bg-primary hover:bg-[#4a6e1b]
                  text-white font-body text-[13.5px] font-semibold
                  shadow-[0_2px_14px_rgba(91,133,35,0.32)]
                  hover:shadow-[0_4px_22px_rgba(91,133,35,0.45)]
                  hover:-translate-y-[1px] active:translate-y-0
                  transition-all duration-200
                "
              >
                <HiOutlineUser size={15} />
                Sign in
              </button>
            )}

            {/* Burger — mobile only */}
            <button
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              className="
                lg:hidden w-9 h-9 rounded-xl flex items-center justify-center
                border border-white/[0.09] bg-white/[0.05]
                text-white hover:bg-white/[0.10] hover:border-white/[0.16]
                transition-all duration-200
              "
            >
              <span
                className={[
                  "transition-all duration-200",
                  drawerOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100",
                ].join(" ")}
              >
                <HiOutlineMenuAlt3 size={19} />
              </span>
              <span
                className={[
                  "transition-all duration-200",
                  !drawerOpen ? "rotate-90 opacity-0 absolute" : "rotate-0 opacity-100",
                ].join(" ")}
              >
                <HiX size={19} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Spacer ─────────────────────────────────────────────────────────── */}
      <div className="h-[68px]" />

      {/* ── Mobile overlay backdrop ───────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={[
          "fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* ── Mobile slide-in drawer ────────────────────────────────────────── */}
      <aside
        aria-label="Mobile navigation"
        aria-hidden={!drawerOpen}
        className={[
          "fixed top-0 right-0 bottom-0 z-50 w-[300px] lg:hidden",
          "bg-ink2 flex flex-col",
          "shadow-[-8px_0_48px_rgba(0,0,0,0.45)]",
          "transition-transform duration-300 ease-in-out",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-[68px] border-b border-white/[0.07] flex-shrink-0">
          <CityGuideLogo onClick={() => goTo("/")} />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="
              w-9 h-9 rounded-xl flex items-center justify-center
              border border-white/[0.09] bg-white/[0.05]
              text-white hover:bg-white/[0.10]
              transition-all duration-200
            "
          >
            <HiX size={18} />
          </button>
        </div>

        {/* Drawer search input */}
        <div className="px-4 pt-4 pb-1 flex-shrink-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2.5 bg-white/[0.07] border border-white/[0.09] rounded-xl px-3.5 py-2.5 focus-within:border-primary/40 transition-colors duration-200"
          >
            <TbSearch size={15} className="text-white/35 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cities, places…"
              className="flex-1 bg-transparent text-white placeholder-white/30 font-body text-[13px] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <TbX size={13} />
              </button>
            )}
          </form>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link, i) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => goTo(link.path)}
                tabIndex={drawerOpen ? 0 : -1}
                style={{ animationDelay: drawerOpen ? `${i * 40}ms` : "0ms" }}
                className={[
                  "flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left",
                  "font-body text-[14px] font-semibold",
                  "transition-all duration-150",
                  drawerOpen ? "animate-slide-right" : "",
                  active
                    ? "bg-primary/[0.13] text-white"
                    : "text-white/60 hover:bg-white/[0.06] hover:text-white",
                ].join(" ")}
              >
                {/* Icon container */}
                <span
                  className={[
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150",
                    active
                      ? "bg-primary/[0.18] text-accent"
                      : "bg-white/[0.06] text-white/35",
                  ].join(" ")}
                >
                  <Icon size={16} />
                </span>

                <span className="flex-1">{link.label}</span>

                {/* Active dot */}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 pb-6 pt-3 border-t border-white/[0.07] flex-shrink-0 flex flex-col gap-2">
          {isLoggedIn ? (
            <>
              {/* User card */}
              <button
                onClick={() => goTo("/account")}
                tabIndex={drawerOpen ? 0 : -1}
                className="
                  flex items-center gap-3 w-full p-3 rounded-xl text-left
                  border border-white/[0.08] bg-white/[0.04]
                  hover:bg-white/[0.07] hover:border-white/[0.14]
                  transition-all duration-150 group
                "
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={avatarSrc}
                    alt={user?.name || "User"}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <span className="absolute -bottom-px -right-px w-3 h-3 rounded-full bg-primary border-2 border-ink2" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-[13.5px] font-bold text-white truncate leading-tight">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.name || "My Account"}
                  </p>
                  <p className="font-body text-[11px] text-white/40 truncate mt-0.5">
                    {user?.email}
                  </p>
                </div>
                <TbChevronDown
                  size={14}
                  className="text-white/25 -rotate-90 flex-shrink-0 group-hover:text-white/50 transition-colors"
                />
              </button>

              {/* Notifications + logout row */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    goTo("/notifications");
                    setHasNotif(false);
                  }}
                  tabIndex={drawerOpen ? 0 : -1}
                  className="
                    relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                    border border-white/[0.09] bg-white/[0.05]
                    font-body text-[13px] font-semibold text-white/70
                    hover:bg-white/[0.09] hover:text-white
                    transition-all duration-150
                  "
                >
                  {hasNotif ? (
                    <IoNotifications size={16} />
                  ) : (
                    <IoNotificationsOutline size={16} />
                  )}
                  Notifications
                  {hasNotif && (
                    <span className="absolute top-2 right-10 w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  tabIndex={drawerOpen ? 0 : -1}
                  aria-label="Sign out"
                  className="
                    w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                    border border-red-500/20 bg-red-500/[0.07]
                    text-red-400 hover:bg-red-500/[0.14] hover:border-red-500/30
                    transition-all duration-150
                  "
                >
                  <svg
                    width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowLogin(true);
                  setDrawerOpen(false);
                }}
                tabIndex={drawerOpen ? 0 : -1}
                className="
                  flex items-center justify-center gap-2 w-full py-3 rounded-xl
                  bg-primary hover:bg-[#4a6e1b]
                  text-white font-body text-[14px] font-bold
                  shadow-[0_2px_16px_rgba(91,133,35,0.3)]
                  hover:shadow-[0_4px_22px_rgba(91,133,35,0.42)]
                  transition-all duration-200
                "
              >
                <HiOutlineUser size={16} />
                Sign in
              </button>
              <p className="text-center font-body text-[11.5px] text-white/30 mt-1">
                Join thousands of city explorers
              </p>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
