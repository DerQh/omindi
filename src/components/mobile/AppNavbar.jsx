import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import { useAllCartItems } from "../../hooks/useCart";
import { useIsAdmin } from "../../hooks/useShopAdmin";
import { useUnreadConversationsCount } from "../../hooks/useMessages";
import { useUnreadCount } from "../../hooks/useNotification";
import { useLanguage } from "../../context/LanguageContext";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)  scale(1); }
`;

// ─── Nav shell ────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 62px;
  background: #fff;
  border-bottom: 1px solid #e4ede4;
  box-shadow: 0 1px 12px rgba(47, 90, 42, 0.07);
`;

const NavInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  flex-shrink: 0;
  user-select: none;

  img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 1rem;
    font-weight: 800;
    color: #2f5a2a;
    letter-spacing: -0.3px;
    white-space: nowrap;
  }
`;

// ─── Desktop inline nav links ─────────────────────────────────────────────────

const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: ${({ $admin, $active }) =>
    $admin ? ($active ? "#1a3318" : "#1f2937") : $active ? "#edf6eb" : "none"};
  border: none;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 0.87rem;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  color: ${({ $admin, $active }) =>
    $admin ? "white" : $active ? "#2f5a2a" : "#4a5e47"};
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ $admin, $active }) =>
      $admin ? "#374151" : $active ? "#dff0db" : "#f3f8f1"};
    color: ${({ $admin }) => ($admin ? "white" : "#2f5a2a")};
  }
`;

// Inline superscript badge for message / notification counts
const NavBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e63946;
  color: white;
  border-radius: 999px;
  font-size: 0.57rem;
  font-weight: 800;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  line-height: 1;
  position: relative;
  top: -5px;
  margin-left: 1px;
  pointer-events: none;
`;

// ─── Right side ───────────────────────────────────────────────────────────────

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const IconBtn = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #f0f7ee;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  background: #e63946;
  color: white;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  border: 1.5px solid #fff;
`;

const AvatarBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #d0e5cd;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  background: none;
  flex-shrink: 0;
  transition:
    border-color 0.15s,
    transform 0.15s;

  &:hover {
    border-color: #2f5a2a;
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }
`;

// ─── Dropdown ─────────────────────────────────────────────────────────────────

const DropdownWrap = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(200px, calc(100vw - 32px));
  background: #fff;
  border-radius: 14px;
  box-shadow:
    0 8px 36px rgba(20, 57, 32, 0.13),
    0 2px 8px rgba(20, 57, 32, 0.05);
  border: 1px solid #e4ede4;
  overflow: hidden;
  animation: ${fadeIn} 0.15s ease;
  z-index: 999;
`;

const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 12px;
  background: #f7fbf4;
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2f5a2a;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
`;

const UserInfo = styled.div`
  min-width: 0;
`;

const UserName = styled.p`
  margin: 0 0 1px;
  color: #1e3a1a;
  font-weight: 700;
  font-size: 0.83rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #8a9e87;
  font-size: 0.7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DDivider = styled.div`
  height: 1px;
  background: #edf3ec;
  margin: 2px 0;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? "#b03a3a" : "#2c3e2a")};
  text-align: left;
  transition: background 0.1s;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fdf1f1" : "#f4f9f2")};
  }
`;

const MenuIcon = styled.span`
  font-size: 0.95rem;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.75;
`;

// ─── Nav data (built inside component so they react to language changes) ──────

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { data: userData } = useUser();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const { data: cartItems } = useAllCartItems(userData?.id);
  const { data: isAdminUser } = useIsAdmin(userData?.id);
  const { data: unreadMessages = 0 } = useUnreadConversationsCount(
    userData?.id,
  );
  const { data: unreadNotifs = 0 } = useUnreadCount(userData?.id);
  const cartCount = cartItems?.length ?? 0;
  const fullName =
    userData?.user_metadata?.full_name ||
    userData?.user_metadata?.username ||
    "User";
  const email = userData?.email ?? "";
  const image_url = userData?.profile?.avatar_url;

  const DESKTOP_LINKS = [
    { label: t.browse,        icon: "", path: "/list" },
    { label: t.messages,      icon: "", path: "/messages" },
    { label: t.notifications, icon: "", path: "/notifications" },
    { label: t.following,     icon: "", path: "/following" },
    { label: t.myStore,       icon: "", path: "/dashboard" },
    { label: t.shop,          icon: "", path: "/shop" },
  ];

  const isDesktop = window.innerWidth > 768;
  const desktopMenuBase = [
    { label: t.viewProfile, icon: "", path: "/profile" },
    { label: t.community,   icon: "", path: "/community" },
  ];
  const mobileMenuBase = [
    { label: t.viewProfile,     icon: "", path: "/profile" },
    { label: t.myOrders,        icon: "", path: "/my-orders" },
    { label: t.messages,        icon: "", path: "/messages" },
    { label: t.following,       icon: "", path: "/following" },
    { label: t.notifications,   icon: "", path: "/notifications" },
    { label: t.myStore,         icon: "", path: "/dashboard" },
    { label: t.recurringOrders, icon: "🔄", path: "/recurring-orders" },
    { label: t.referral,        icon: "🎁", path: "/referral" },
    { label: t.community,       icon: "", path: "/community" },
    { label: t.shop,            icon: "", path: "/shop" },
  ];
  const baseItems = isDesktop ? desktopMenuBase : mobileMenuBase;
  const menuItems = isAdminUser
    ? [...baseItems, { label: "Admin Panel", icon: "⚙️", path: "/admin" }]
    : baseItems;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const getBadge = (path) => {
    if (path === "/messages" && unreadMessages > 0) return unreadMessages;
    if (path === "/notifications" && unreadNotifs > 0) return unreadNotifs;
    return null;
  };

  return (
    <Nav>
      <NavInner>
        {/* Logo */}
        <Logo onClick={() => navigate("/mobile")}>
          <img loading="lazy" src="/afarmer.webp" alt="Afarmer™ logo" />
          <span>AFARMER™</span>
        </Logo>

        {/* Desktop inline links */}
        <DesktopLinks>
          {DESKTOP_LINKS.map((item) => {
            const badge = getBadge(item.path);
            return (
              <NavLink
                key={item.path}
                $active={isActive(item.path)}
                onClick={() => navigate(item.path)}
              >
                {item.label}
                {badge && <NavBadge>{badge > 99 ? "99+" : badge}</NavBadge>}
              </NavLink>
            );
          })}

          {isAdminUser && (
            <NavLink
              $active={isActive("/admin")}
              onClick={() => navigate("/admin")}
              $admin
            >
              ⚙️ Admin
            </NavLink>
          )}
        </DesktopLinks>

        {/* Cart + avatar */}
        <RightSide>
          <LanguageSwitcher />
          <IconBtn onClick={() => navigate("/cart")} aria-label="Cart">
            🛒
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </IconBtn>

          <div ref={ref} style={{ position: "relative" }}>
            <AvatarBtn
              onClick={() => setIsOpen((p) => !p)}
              aria-label="Open menu"
            >
              <img
                loading="lazy"
                src={image_url || "/user.jpg"}
                alt="Profile"
              />
            </AvatarBtn>

            {isOpen && (
              <DropdownWrap>
                <UserBlock>
                  <UserAvatar>{fullName[0]}</UserAvatar>
                  <UserInfo>
                    <UserName>{fullName}</UserName>
                    <UserEmail>{email}</UserEmail>
                  </UserInfo>
                </UserBlock>

                <DDivider />

                {menuItems.map((item) => {
                  const badge = getBadge(item.path);
                  return (
                    <MenuItem key={item.path} onClick={() => go(item.path)}>
                      <MenuIcon>{item.icon}</MenuIcon>
                      {item.label}
                      {badge && (
                        <NavBadge style={{ marginLeft: "auto" }}>
                          {badge > 99 ? "99+" : badge}
                        </NavBadge>
                      )}
                    </MenuItem>
                  );
                })}

                <DDivider />

                <MenuItem $danger onClick={handleSignOut}>
                  <MenuIcon></MenuIcon>
                  {t.signOut}
                </MenuItem>
              </DropdownWrap>
            )}
          </div>
        </RightSide>
      </NavInner>
    </Nav>
  );
}
