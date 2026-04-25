import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RiUserLine, RiHeartLine, RiSettingsLine, RiShieldCheckLine, RiLogoutBoxRLine } from "react-icons/ri";
import { logout } from "../../../../store/slices/authSlice";
import {
  DropdownWrap, DropdownHeader, DropdownAvatar, DropdownUserInfo,
  DropdownName, DropdownEmail, AdminBadge,
  DropdownDivider, DropdownItem, DropdownIcon,
} from "../Navbar.styles";

const MENU_ITEMS = [
  { icon: <RiUserLine        size={15} />, label: "My Profile",         path: "/account"          },
  { icon: <RiHeartLine       size={15} />, label: "Favorites",          path: "/favorites"        },
  { icon: <RiSettingsLine    size={15} />, label: "Settings",           path: "/account#settings" },
  { icon: <RiShieldCheckLine size={15} />, label: "Privacy & Security", path: "/account#privacy"  },
];

export default function UserDropdown({ user, avatarSrc, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const go = (path) => { navigate(path); onClose(); };

  return (
    <DropdownWrap>
      <DropdownHeader onClick={() => go("/account")}>
        <DropdownAvatar src={avatarSrc} alt={user?.name} />
        <DropdownUserInfo>
          <DropdownName>{user?.name}</DropdownName>
          <DropdownEmail>{user?.email}</DropdownEmail>
          {user?.role === "admin" && (
            <AdminBadge><RiShieldCheckLine size={9} /> Admin</AdminBadge>
          )}
        </DropdownUserInfo>
      </DropdownHeader>

      <DropdownDivider />

      {MENU_ITEMS.map((item) => (
        <DropdownItem key={item.label} onClick={() => go(item.path)}>
          <DropdownIcon>{item.icon}</DropdownIcon>
          {item.label}
        </DropdownItem>
      ))}

      <DropdownDivider />

      <DropdownItem
        $danger
        onClick={() => { dispatch(logout()); navigate("/"); onClose(); }}
      >
        <DropdownIcon><RiLogoutBoxRLine size={15} /></DropdownIcon>
        Sign out
      </DropdownItem>
    </DropdownWrap>
  );
}
