// components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation }    from "react-router-dom";
import { useDispatch, useSelector }    from "react-redux";

import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { HiOutlineUser }                           from "react-icons/hi2";
import { RiMapPinLine, RiLogoutBoxRLine }           from "react-icons/ri";
import { HiOutlineMenuAlt3, HiX }                  from "react-icons/hi";
import { TbChevronDown }                            from "react-icons/tb";

import { selectUser, selectIsLoggedIn, logout } from "../../../store/slices/authSlice";

import {
  Nav, NavInner,
  NavLinks, NavLink, ActiveBar,
  Actions, BellBtn, NotifWrap, NotifDot,
  SignInBtn, BurgerBtn,
  AvatarDropWrap, AvatarTrigger, AvatarImg, AvatarFirstName, ChevronWrap,
  MobileDrawer, MobileLink, DrawerDivider,
  MobileUserRow, MobileAvatarImg, MobileUserName, MobileUserEmail,
} from "./Navbar.styles";

import CityGuideLogo from "./components/CityGuideLogo";
import UserDropdown  from "./components/UserDropdown";

// ─── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: 1, label: "Home",     path: "/"       },
  { id: 2, label: "Guides",   path: "/guides" },
  { id: 3, label: "Places",   path: "/places" },
  { id: 4, label: "Events",   path: "/events" },
  { id: 5, label: "About us", path: "/about"  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Navbar
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar({ setShowLogin }) {
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const dispatch     = useDispatch();

  const user       = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const dropRef = useRef(null);

  // ── shadow on scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const avatarSrc = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=6b9c3e&color=fff&size=128`;

  // ── Navigation helper — closes drawers inline, no useEffect needed ────────
  const goTo = (path) => {
    setMenuOpen(false);
    setDropOpen(false);
    navigate(path);
  };

  return (
    <Nav $scrolled={scrolled}>
      <NavInner>

        <CityGuideLogo onClick={() => goTo("/")} />

        {/* ── Desktop links ── */}
        <NavLinks>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              $active={isActive(link.path)}
              onClick={() => goTo(link.path)}
            >
              {link.label}
              {isActive(link.path) && <ActiveBar />}
            </NavLink>
          ))}
        </NavLinks>

        {/* ── Actions ── */}
        <Actions>

          {isLoggedIn && (
            <BellBtn
              onClick={() => { goTo("/notifications"); setHasNotif(false); }}
              aria-label="Notifications"
            >
              {hasNotif ? (
                <NotifWrap>
                  <IoNotifications size={20} />
                  <NotifDot />
                </NotifWrap>
              ) : (
                <IoNotificationsOutline size={20} />
              )}
            </BellBtn>
          )}

          {isLoggedIn ? (
            <AvatarDropWrap ref={dropRef}>
              <AvatarTrigger
                $open={dropOpen}
                onClick={() => setDropOpen((v) => !v)}
                aria-label="My account"
              >
                <AvatarImg src={avatarSrc} alt={user?.name} />
                <AvatarFirstName>{user?.name?.split(" ")[0]}</AvatarFirstName>
                <ChevronWrap $open={dropOpen}>
                  <TbChevronDown size={14} />
                </ChevronWrap>
              </AvatarTrigger>

              {dropOpen && (
                <UserDropdown
                  user={user}
                  avatarSrc={avatarSrc}
                  onClose={() => setDropOpen(false)}
                />
              )}
            </AvatarDropWrap>

          ) : (
            <SignInBtn onClick={() => setShowLogin(true)} aria-label="Sign in">
              <HiOutlineUser size={17} />
              <span>Sign in</span>
            </SignInBtn>
          )}

          <BurgerBtn
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
          </BurgerBtn>
        </Actions>

      </NavInner>

      {/* ── Mobile drawer ── */}
      <MobileDrawer $open={menuOpen}>
        {NAV_LINKS.map((link) => (
          <MobileLink
            key={link.id}
            $active={isActive(link.path)}
            onClick={() => goTo(link.path)}
          >
            <RiMapPinLine size={15} />
            {link.label}
          </MobileLink>
        ))}

        <DrawerDivider />

        {isLoggedIn ? (
          <>
            <MobileUserRow onClick={() => goTo("/account")}>
              <MobileAvatarImg src={avatarSrc} alt={user?.name} />
              <div>
                <MobileUserName>{user?.name}</MobileUserName>
                <MobileUserEmail>{user?.email}</MobileUserEmail>
              </div>
            </MobileUserRow>
            <MobileLink
              $danger
              onClick={() => { dispatch(logout()); goTo("/"); }}
            >
              <RiLogoutBoxRLine size={15} />
              Sign out
            </MobileLink>
          </>
        ) : (
          <MobileLink onClick={() => { setShowLogin(true); setMenuOpen(false); }}>
            <HiOutlineUser size={15} />
            Sign in
          </MobileLink>
        )}
      </MobileDrawer>
    </Nav>
  );
}
