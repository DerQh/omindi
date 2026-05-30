import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import { useAllCartItems } from "../../hooks/useCart";

// ─── Global styles ────────────────────────────────────────────────────────────

// On mobile only: push content up so nothing hides behind the fixed bottom nav
const GlobalBottomPad = createGlobalStyle`
  @media (max-width: 768px) {
    body { padding-bottom: 72px; }
  }
`;

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
  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#44554c")};
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #d7ead7;
    color: #2f5a2a;
  }
`;

const NavLinkIcon = styled.span`font-size: 0.9rem;`;

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

  &:hover { background: #d7ead7; }
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

  &:hover { border-color: #2f5a2a; }

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
  width: min(240px, calc(100vw - 32px));
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

const UserInfo = styled.div`min-width: 0;`;

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

// ─── Bottom nav bar (mobile only) ─────────────────────────────────────────────

// Only shown on screens ≤768px — desktop uses the inline links above
const BottomBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border-top: 1px solid #e8f0e8;
  display: flex;
  align-items: stretch;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -4px 16px rgba(20, 57, 32, 0.07);

  @media (min-width: 769px) { display: none; }
`;

const BottomItem = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  position: relative;
  transition: background 0.15s;

  &:hover { background: #f5f8f5; }
  &:active { background: #eef7ee; }
`;

const BottomIcon = styled.span`
  font-size: 1.3rem;
  line-height: 1;
  filter: ${({ $active }) => ($active ? "none" : "grayscale(40%) opacity(0.65)")};
`;

const BottomLabel = styled.span`
  font-size: 0.6rem;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#7b8f7f")};
`;

const ActiveDot = styled.span`
  position: absolute;
  top: 5px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #2f5a2a;
`;

const BottomBadge = styled.span`
  position: absolute;
  top: 5px;
  right: calc(50% - 18px);
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #e63946;
  color: white;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ─── Nav data ─────────────────────────────────────────────────────────────────

// Shown inline on desktop
const DESKTOP_LINKS = [
  { label: "Browse",       icon: "🔍", path: "/list"          },
  { label: "Messages",     icon: "💬", path: "/messages"      },
  { label: "Notifications",icon: "🔔", path: "/notifications" },
  { label: "Following",    icon: "👥", path: "/following"     },
  { label: "My Store",     icon: "🏪", path: "/dashboard"     },
  { label: "Shop",         icon: "🛍️", path: "/shop"          },
];

// Dropdown on desktop — only items NOT already in the inline nav links
const DESKTOP_MENU_ITEMS = [
  { label: "View Profile", icon: "👤", path: "/profile"   },
  { label: "Community",    icon: "🌿", path: "/community" },
];

// Dropdown on mobile — full list since there are no inline links
const MOBILE_MENU_ITEMS = [
  { label: "View Profile",  icon: "👤", path: "/profile"       },
  { label: "Following",     icon: "👥", path: "/following"     },
  { label: "Notifications", icon: "🔔", path: "/notifications" },
  { label: "My Store",      icon: "🏪", path: "/dashboard"     },
  { label: "Community",     icon: "🌿", path: "/community"     },
  { label: "Shop",          icon: "🛍️", path: "/shop"          },
];

// Shown in the bottom nav on mobile
const BOTTOM_ITEMS = [
  { label: "Home",     icon: "🏠", path: "/mobile"   },
  { label: "Browse",   icon: "🔍", path: "/list"     },
  { label: "Cart",     icon: "🛒", path: "/cart",  cartBadge: true },
  { label: "Messages", icon: "💬", path: "/messages" },
  { label: "Profile",  icon: "👤", path: "/profile"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppNavbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { logout } = useAuth();
  const { data: userData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const { data: cartItems } = useAllCartItems(userData?.id);
  const cartCount  = cartItems?.length ?? 0;
  const fullName   = userData?.user_metadata?.full_name || userData?.user_metadata?.username || "User";
  const email      = userData?.email ?? "";
  const image_url  = userData?.profile?.avatar_url;

  // Pick the right dropdown list based on screen width
  const isDesktop = window.innerWidth > 768;
  const menuItems = isDesktop ? DESKTOP_MENU_ITEMS : MOBILE_MENU_ITEMS;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (path) => { setIsOpen(false); navigate(path); };

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <GlobalBottomPad />

      {/* ── Top bar ── */}
      <Nav>
        <NavInner>
        {/* Logo */}
        <Logo onClick={() => navigate("/mobile")}>
          <img loading="lazy" src="/afarmer.jpg" alt="Afarmer logo" />
          <span>AFARMER</span>
        </Logo>

        {/* Desktop inline links — text only, no icons */}
        <DesktopLinks>
          {DESKTOP_LINKS.map((item) => (
            <NavLink
              key={item.path}
              $active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </NavLink>
          ))}
        </DesktopLinks>

        {/* Cart + avatar — always visible */}
        <RightSide>
          <IconBtn onClick={() => navigate("/cart")} aria-label="Cart">
            🛒
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </IconBtn>

          <div ref={ref} style={{ position: "relative" }}>
            <AvatarBtn onClick={() => setIsOpen((p) => !p)} aria-label="Open menu">
              <img loading="lazy" src={image_url || "/user.jpg"} alt="Profile" />
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

                {menuItems.map((item) => (
                  <MenuItem key={item.path} onClick={() => go(item.path)}>
                    <MenuIcon>{item.icon}</MenuIcon>
                    {item.label}
                  </MenuItem>
                ))}

                <DDivider />

                <MenuItem $danger onClick={handleSignOut}>
                  <MenuIcon>↩</MenuIcon>
                  Sign Out
                </MenuItem>
              </DropdownWrap>
            )}
          </div>
        </RightSide>
        </NavInner>
      </Nav>

      {/* ── Bottom nav — mobile only ── */}
      <BottomBar>
        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <BottomItem key={item.path} onClick={() => navigate(item.path)} aria-label={item.label}>
              {active && <ActiveDot />}
              <BottomIcon $active={active}>{item.icon}</BottomIcon>
              <BottomLabel $active={active}>{item.label}</BottomLabel>
              {item.cartBadge && cartCount > 0 && (
                <BottomBadge>{cartCount}</BottomBadge>
              )}
            </BottomItem>
          );
        })}
      </BottomBar>
    </>
  );
}
