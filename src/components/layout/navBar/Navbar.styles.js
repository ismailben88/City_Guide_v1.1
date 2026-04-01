// components/layout/Navbar.styles.js
import styled, { css, keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const dropFadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Nav shell
// ─────────────────────────────────────────────────────────────────────────────

export const Nav = styled.nav`
  background: #3d2b1a;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 4px 24px rgba(0,0,0,0.38)" : "0 2px 12px rgba(0,0,0,0.25)"};
  transition: box-shadow 0.3s ease;
`;

export const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 62px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 0 20px;
    height: 58px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Logo
// ─────────────────────────────────────────────────────────────────────────────

export const LogoWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
`;

export const LogoText = styled.div`
  display: flex;
  align-items: baseline;
  line-height: 1;
`;

export const LogoCity = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: #6b9c3e;
  letter-spacing: -0.01em;
`;

export const LogoGuide = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: #c8d98a;
  letter-spacing: -0.01em;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Desktop nav links
// ─────────────────────────────────────────────────────────────────────────────

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) { display: none; }
`;

export const NavLink = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 9999px;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "700" : "600")};
  color: ${({ $active }) => ($active ? "#c8d98a" : "#fff")};
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: #c8d98a;
    background: rgba(255, 255, 255, 0.08);
  }

  ${({ $active }) => $active && css`
    background: rgba(107, 156, 62, 0.18);
  `}
`;

export const ActiveBar = styled.span`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 2.5px;
  border-radius: 9999px;
  background: #6b9c3e;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Action buttons
// ─────────────────────────────────────────────────────────────────────────────

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const BellBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: 1.5px solid rgba(200, 217, 138, 0.3);
  background: transparent;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }
`;

export const NotifWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NotifDot = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c8761a;
  border: 1.5px solid #3d2b1a;
`;

export const SignInBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 16px 7px 12px;
  border-radius: 9999px;
  border: 2px solid #6b9c3e;
  background: #6b9c3e;
  color: #fff;
  cursor: pointer;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover { background: #c8761a; border-color: #c8761a; }

  @media (max-width: 768px) { display: none; }
`;

export const BurgerBtn = styled.button`
  display: none;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  border: 1.5px solid rgba(200, 217, 138, 0.3);
  background: transparent;
  color: #fff;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover { background: rgba(255, 255, 255, 0.1); }
  @media (max-width: 768px) { display: flex; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Avatar trigger (logged-in)
// ─────────────────────────────────────────────────────────────────────────────

export const AvatarDropWrap = styled.div`
  position: relative;
`;

export const AvatarTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 9999px;
  border: 2px solid ${({ $open }) => ($open ? "#c8d98a" : "rgba(200,217,138,0.4)")};
  background: ${({ $open }) => ($open ? "rgba(107,156,62,0.22)" : "rgba(255,255,255,0.08)")};
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: #c8d98a;
    background: rgba(107, 156, 62, 0.18);
  }

  @media (max-width: 768px) { display: none; }
`;

export const AvatarImg = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 1.5px solid rgba(200, 217, 138, 0.5);
`;

export const AvatarFirstName = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChevronWrap = styled.span`
  display: flex;
  align-items: center;
  color: #c8d98a;
  transition: transform 0.22s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Dropdown panel
// ─────────────────────────────────────────────────────────────────────────────

export const DropdownWrap = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 265px;
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #ede8e0;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
  padding: 8px;
  z-index: 200;
  animation: ${dropFadeIn} 0.22s cubic-bezier(.25, .8, .25, 1);
`;

export const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.18s ease;

  &:hover { background: #f7f3ee; }
`;

export const DropdownAvatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dde8cc;
  flex-shrink: 0;
`;

export const DropdownUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const DropdownName = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DropdownEmail = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #9e8e80;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AdminBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: rgba(107, 156, 62, 0.12);
  color: #6b9c3e;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(107, 156, 62, 0.25);
  width: fit-content;
  margin-top: 2px;
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: #f0ebe4;
  margin: 4px 0;
`;

export const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: ${({ $danger }) => ($danger ? "#e05a5a" : "#3d2b1a")};
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background 0.16s ease, color 0.16s ease;

  &:hover {
    background: ${({ $danger }) => ($danger ? "rgba(224,90,90,0.08)" : "#f7f3ee")};
    color: ${({ $danger }) => ($danger ? "#e05a5a" : "#6b9c3e")};
  }
`;

export const DropdownIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Mobile drawer
// ─────────────────────────────────────────────────────────────────────────────

export const MobileDrawer = styled.div`
  display: none;
  flex-direction: column;
  padding: 10px 24px 18px;
  border-top: 1px solid rgba(200, 217, 138, 0.15);
  background: #3d2b1a;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
  }
`;

export const MobileLink = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? "700" : "600")};
  color: ${({ $active, $danger }) =>
    $danger ? "#ff7070" : $active ? "#c8d98a" : "#fff"};
  text-align: left;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(255,100,100,0.1)" : "rgba(107,156,62,0.18)"};
    color: ${({ $danger }) => ($danger ? "#ff9090" : "#c8d98a")};
  }
`;

export const DrawerDivider = styled.hr`
  border: none;
  border-top: 1px solid rgba(200, 217, 138, 0.15);
  margin: 6px 0;
`;

export const MobileUserRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(107, 156, 62, 0.1);
  border: 1px solid rgba(200, 217, 138, 0.2);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  margin-bottom: 6px;
  transition: background 0.2s ease;

  &:hover { background: rgba(107, 156, 62, 0.18); }
`;

export const MobileAvatarImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(200, 217, 138, 0.4);
  flex-shrink: 0;
`;

export const MobileUserName = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-align: left;
`;

export const MobileUserEmail = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  text-align: left;
`;
