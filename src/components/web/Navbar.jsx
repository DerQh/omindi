import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { useAuth } from "../../context/AuthContext";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeInBackdrop = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; }
  to   { opacity: 1; max-height: 600px; }
`;

// ─── Nav structure ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "How it works",
    children: [
      { label: "For Farmers",  path: "/forfarms" },
      { label: "For Buyers",   path: "/forbuyers" },
      { label: "Agritourism",  path: "/agritourism" },
    ],
  },
  { label: "Pricing",        path: "/pricing" },
  {
    label: "Local Sourcing",
    children: [
      { label: "Wholesalers", path: "/wholesale" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "Our Story", path: "/aboutus" },
      { label: "News",      path: "/news" },
      { label: "FAQ",       path: "/faq" },
      { label: "Contact",   path: "/contactus" },
    ],
  },
  { label: "Shop", path: "/shop" },
];

// ─── Styled components ────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 200;
  background: #e5f4ff;
  border-bottom: 1px solid #d7ead7;
  box-shadow: ${({ $scrolled }) =>
    $scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none"};
  transition: box-shadow 0.25s ease;
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) { padding: 0 20px; }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
  text-decoration: none;
`;

const LogoImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
`;

const LogoText = styled.span`
  font-size: 1.15rem;
  font-weight: 900;
  color: #2f5a2a;
  letter-spacing: -0.5px;
`;

// ─── Desktop nav links ────────────────────────────────────────────────────────

// Hidden on mobile — only shows on wider screens
const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;

  @media (max-width: 960px) { display: none; }
`;

// Each top-level nav item — highlights when the current path matches
const NavItem = styled.div`
  position: relative;
`;

const NavBtn = styled.button`
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#44554c")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: #eef7ee;
    color: #2f5a2a;
  }
`;

const NavLink = styled(Link)`
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#44554c")};
  text-decoration: none;
  display: block;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  &:hover {
    background: #eef7ee;
    color: #2f5a2a;
  }
`;

// Chevron icon — rotates when dropdown is open
const Chevron = styled.span`
  font-size: 0.6rem;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  color: #7b9b7b;
`;

// ─── Backdrop ────────────────────────────────────────────────────────────────

// Blurs and dims the page content when a dropdown is open.
// backdrop-filter applies the blur to whatever is rendered behind this div.
// Clicking it closes the open dropdown.
const Backdrop = styled.div`
  position: fixed;
  inset: 68px 0 0 0;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 199;
  animation: ${fadeInBackdrop} 0.2s ease;
  cursor: pointer;
`;

// ─── Desktop dropdown ─────────────────────────────────────────────────────────

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e0ece0;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  min-width: 180px;
  overflow: hidden;
  animation: ${fadeDown} 0.18s ease;
  z-index: 300;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 11px 18px;
  font-size: 0.88rem;
  font-weight: 500;
  color: #1a3318;
  text-decoration: none;
  transition: background 0.12s;
  border-bottom: 1px solid #f0f7ee;

  &:last-child { border-bottom: none; }

  &:hover {
    background: #eef7ee;
    color: #2f5a2a;
    font-weight: 600;
  }
`;

// ─── Right-side actions ───────────────────────────────────────────────────────

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const SignInBtn = styled.button`
  background: none;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #44554c;
  cursor: pointer;
  transition: all 0.15s;

  &:hover { background: #eef7ee; color: #2f5a2a; }

  @media (max-width: 480px) { display: none; }
`;

// Primary CTA — "Get App" or "Open App" depending on auth state
const CtaBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 9px 20px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;

  &:hover { background: #1e3d1a; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

// ─── Hamburger button ─────────────────────────────────────────────────────────

// Only visible on mobile — three bars animate into an X when menu is open
const HamburgerBtn = styled.button`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background 0.15s;

  &:hover { background: #eef7ee; }

  @media (max-width: 960px) { display: flex; }
`;

const Bar = styled.span`
  display: block;
  width: 22px;
  height: 2px;
  background: #2f5a2a;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;

  ${({ $open, $pos }) =>
    $open &&
    $pos === "top" &&
    css`transform: translateY(7px) rotate(45deg);`}

  ${({ $open, $pos }) =>
    $open && $pos === "mid" && css`opacity: 0; transform: scaleX(0);`}

  ${({ $open, $pos }) =>
    $open &&
    $pos === "bot" &&
    css`transform: translateY(-7px) rotate(-45deg);`}
`;

// ─── Mobile drawer ────────────────────────────────────────────────────────────

const MobileDrawer = styled.div`
  display: none;
  overflow: hidden;
  border-top: 1px solid #d7ead7;
  background: #e5f4ff;
  animation: ${slideDown} 0.3s ease;

  @media (max-width: 960px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;

const DrawerInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 20px 20px;
`;

const DrawerSection = styled.div`
  margin-bottom: 4px;
`;

// Top-level mobile nav item — label + expand toggle
const DrawerItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: none;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a3318;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover { background: #f0f7ee; }
`;

const DrawerLink = styled(Link)`
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a3318;
  text-decoration: none;
  transition: background 0.15s;

  &:hover { background: #f0f7ee; color: #2f5a2a; }
`;

// Sub-items that expand under a parent drawer item
const DrawerSub = styled.div`
  padding-left: 12px;
  border-left: 2px solid #d7edd9;
  margin: 4px 0 8px 14px;
`;

const DrawerSubLink = styled(Link)`
  display: block;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  color: #44554c;
  text-decoration: none;
  transition: background 0.12s;

  &:hover { background: #eef7ee; color: #2f5a2a; }
`;

const DrawerDivider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 8px 0;
`;

const DrawerCtaRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;

  button {
    flex: 1;
    padding: 13px;
    border-radius: 12px;
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
  }
`;

const DrawerSignIn = styled.button`
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  transition: all 0.15s;

  &:hover { background: #eef7ee; border-color: #2f5a2a; }
`;

const DrawerGetApp = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  transition: background 0.15s;

  &:hover { background: #1e3d1a; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // label of open desktop dropdown
  const [openDrawer, setOpenDrawer]     = useState(null); // label of open mobile accordion
  const [scrolled, setScrolled]         = useState(false);
  const navRef = useRef(null);

  // Add shadow when user has scrolled down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdowns when clicking outside the nav
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setMobileOpen(false);
    setOpenDrawer(null);
  }, [location.pathname]);

  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };


  const handleCta = () => {
    go(user ? "/mobile" : "/sign-up");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
    {/* Backdrop fades the page when a desktop dropdown is open */}
    {openDropdown && <Backdrop onClick={() => setOpenDropdown(null)} />}
    <Nav $scrolled={scrolled} ref={navRef}>
      <Inner>
        {/* ── Logo ── */}
        <LogoWrap onClick={() => go("/")}>
          <LogoImg src="/afarmer.webp" alt="Afarmer™ logo" />
          <LogoText>AFARMER™</LogoText>
        </LogoWrap>

        {/* ── Desktop nav links ── */}
        <DesktopLinks>
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <NavItem key={item.label}>
                <NavBtn
                  $active={item.children.some((c) => isActive(c.path))}
                  onClick={() =>
                    setOpenDropdown((p) => (p === item.label ? null : item.label))
                  }
                >
                  {item.label}
                  <Chevron $open={openDropdown === item.label}>▼</Chevron>
                </NavBtn>
                {openDropdown === item.label && (
                  <Dropdown>
                    {item.children.map((child) => (
                      <DropdownItem
                        key={child.path}
                        to={child.path}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                )}
              </NavItem>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                $active={isActive(item.path) ? 1 : 0}
              >
                {item.label}
              </NavLink>
            )
          )}
        </DesktopLinks>

        {/* ── Right side ── */}
        <RightSide>
          <CtaBtn onClick={handleCta}>
            {user ? "Open App" : "Get Started"}
          </CtaBtn>
          <HamburgerBtn
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <Bar $open={mobileOpen} $pos="top" />
            <Bar $open={mobileOpen} $pos="mid" />
            <Bar $open={mobileOpen} $pos="bot" />
          </HamburgerBtn>
        </RightSide>
      </Inner>

      {/* ── Mobile drawer ── */}
      <MobileDrawer $open={mobileOpen}>
        <DrawerInner>
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <DrawerSection key={item.label}>
                <DrawerItem
                  onClick={() =>
                    setOpenDrawer((p) => (p === item.label ? null : item.label))
                  }
                >
                  {item.label}
                  <Chevron $open={openDrawer === item.label}>▼</Chevron>
                </DrawerItem>
                {openDrawer === item.label && (
                  <DrawerSub>
                    {item.children.map((child) => (
                      <DrawerSubLink
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </DrawerSubLink>
                    ))}
                  </DrawerSub>
                )}
              </DrawerSection>
            ) : (
              <DrawerLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </DrawerLink>
            )
          )}

        </DrawerInner>
      </MobileDrawer>
    </Nav>
    </>
  );
}
