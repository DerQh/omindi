import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import { useAllCartItems } from "../../hooks/useCart";
import { useIsAdmin } from "../../hooks/useShopAdmin";
import { useUnreadConversationsCount } from "../../hooks/useMessages";
import { useUnreadCount } from "../../hooks/useNotification";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Nav shell ────────────────────────────────────────────────────────────────

// Nav spans full width for the background, but content is capped via NavInner
const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
  background: #e5f4ff;
  border-bottom: 1px solid #d7ead7;
  box-shadow: 0 1px 8px rgba(20, 57, 32, 0.06);
`;

// Inner wrapper limits how wide the nav content grows
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
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 1.05rem;
    font-weight: 800;
    color: #2f5a2a;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }
`;

// ─── Desktop inline nav links (hidden on mobile) ──────────────────────────────

const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;

  /* Hide on mobile — bottom nav covers navigation there */
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.button`
  background: ${({ $admin, $active }) =>
    $admin && $active ? "#1a3318" : $admin ? "#111827" : "none"};
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 400;
  color: ${({ $admin, $active }) =>
    $admin ? "white" : $active ? "#2f5a2a" : "#2c3a32"};
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ $admin }) => ($admin ? "#1f2937" : "#d7ead7")};
    color: ${({ $admin }) => ($admin ? "white" : "#2f5a2a")};
  }
`;

const NavLinkIcon = styled.span`
  font-size: 0.9rem;
`;

// ─── Right side ───────────────────────────────────────────────────────────────

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  flex-shrink: 0;

  &:hover {
    background: #d7ead7;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #e63946;
  color: white;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

// Inline superscript badge shown next to nav link text for messages / notifications
const NavBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e63946;
  color: white;
  border-radius: 999px;
  font-size: 0.58rem;
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

const AvatarBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #d7ead7;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  background: none;
  flex-shrink: 0;
  transition: border-color 0.15s;

  &:hover {
    border-color: #2f5a2a;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }
`;

// ─── Dropdown ────────────────────────────────────────────────────────────────

const DropdownWrap = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: min(190px, calc(100vw - 32px));
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(20, 57, 32, 0.15);
  border: 1px solid #d7ead7;
  overflow: hidden;
  animation: ${fadeIn} 0.15s ease;
  z-index: 999;
`;

const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f0f7ee;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2f5a2a;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
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
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.72rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DDivider = styled.div`
  height: 1px;
  background: #f0f7ee;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? "#a32d2d" : "#2f5a2a")};
  text-align: left;
  transition: background 0.12s;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fdf0f0" : "#f0f7ee")};
  }
`;

const MenuIcon = styled.span`
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

// ─── Nav data ─────────────────────────────────────────────────────────────────

// Shown inline on desktop
const DESKTOP_LINKS = [
  { label: "Browse", icon: "🔍", path: "/list" },
  { label: "Messages", icon: "💬", path: "/messages" },
  { label: "Notifications", icon: "🔔", path: "/notifications" },
  { label: "Following", icon: "👥", path: "/following" },
  { label: "My Store", icon: "🏪", path: "/dashboard" },
  { label: "Shop", icon: "🛍️", path: "/shop" },
];

// Dropdown on desktop — only items NOT already in the inline nav links
const DESKTOP_MENU_ITEMS = [
  { label: "View Profile", icon: "👤", path: "/profile" },
  { label: "Community", icon: "🌿", path: "/community" },
];

// Dropdown on mobile — full list since there are no inline links
const MOBILE_MENU_ITEMS = [
  { label: "View Profile", icon: "👤", path: "/profile" },
  { label: "My Orders", icon: "📦", path: "/my-orders" },
  { label: "Messages", icon: "💬", path: "/messages" },
  { label: "Following", icon: "👥", path: "/following" },
  { label: "Notifications", icon: "🔔", path: "/notifications" },
  { label: "My Store", icon: "🏪", path: "/dashboard" },
  { label: "Community", icon: "🌿", path: "/community" },
  { label: "Shop", icon: "🛍️", path: "/shop" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { data: userData } = useUser();
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

  // Pick the right dropdown list based on screen width, then append the
  // Admin Panel item at the end — only visible to users with is_admin = true.
  const isDesktop = window.innerWidth > 768;
  const baseItems = isDesktop ? DESKTOP_MENU_ITEMS : MOBILE_MENU_ITEMS;
  const menuItems = isAdminUser
    ? [...baseItems, { label: "Admin Panel", icon: "⚙️", path: "/admin" }]
    : baseItems;

  // Close dropdown when clicking outside
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

  return (
    <>
      {/* ── Top bar ── */}
      <Nav>
        <NavInner>
          {/* Logo */}
          <Logo onClick={() => navigate("/mobile")}>
            <img loading="lazy" src="/afarmer.jpg" alt="Afarmer™ logo" />
            <span>AFARMER™</span>
          </Logo>

          {/* Desktop inline links — badges shown on Messages and Notifications when there are unreads */}
          <DesktopLinks>
            {DESKTOP_LINKS.map((item) => {
              const badge =
                item.path === "/messages" && unreadMessages > 0
                  ? unreadMessages
                  : item.path === "/notifications" && unreadNotifs > 0
                    ? unreadNotifs
                    : null;
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
            {/* Admin link — only rendered when the logged-in user is an admin */}

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

          {/* Cart + avatar — always visible */}
          <RightSide>
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
                    const badge =
                      item.path === "/messages" && unreadMessages > 0
                        ? unreadMessages
                        : item.path === "/notifications" && unreadNotifs > 0
                          ? unreadNotifs
                          : null;
                    return (
                      <MenuItem key={item.path} onClick={() => go(item.path)}>
                        {/* <MenuIcon>{item.icon}</MenuIcon> */}
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
                    Sign Out
                  </MenuItem>
                </DropdownWrap>
              )}
            </div>
          </RightSide>
        </NavInner>
      </Nav>
    </>
  );
}
