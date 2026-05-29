import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../hooks/useUser";
import { useAllCartItems } from "../../hooks/useCart";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Nav
const Nav = styled.nav`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #e5f4ff;
  border-bottom: 1px solid #d7ead7;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 1.1rem;
    font-weight: 800;
    color: #2f5a2a;
    letter-spacing: -0.5px;
  }
`;

const AvatarBtn = styled.button`
  width: 40px;
  height: 40px;
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

// --- Dropdown
const DropdownWrap = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 16px;
  width: 240px;
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

const Divider = styled.div`
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
  font-size: 0.92rem;
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

const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CartBtn = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #d7ead7;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #e63946;
  color: white;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MENU_ITEMS = [
  { label: "Following", icon: "👥", path: "/following" },
  { label: "Messages", icon: "💬", path: "/messages" },
  { label: "View Profile", icon: "👤", path: "/profile" },
  { label: "Notifications", icon: "🔔", path: "/notifications" },
  { label: "My Store", icon: "🏪", path: "/dashboard" },
  { label: "Community", icon: "🌿", path: "/community" },
];

export default function AppNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: userData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const { data: cartItems } = useAllCartItems(userData?.id);
  const cartCount = cartItems?.length ?? 0;
  const fullName =
    userData?.user_metadata?.full_name ||
    userData?.user_metadata?.username ||
    "User";
  const email = userData?.email ?? "";

  const image_url = userData?.profile.avatar_url;

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
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

  return (
    <Nav>
      <Logo onClick={() => navigate("/mobile")}>
        <img loading="lazy" src="afarmer.jpg" alt="logo" />
        <span>AFARMER</span>
      </Logo>

      <RightSide>
        <CartBtn onClick={() => navigate("/cart")}>
          🛒
          {cartCount > 0 && <CartBadge>{cartCount}</CartBadge>}
        </CartBtn>

        <div ref={ref} style={{ position: "relative" }}>
          <AvatarBtn onClick={() => setIsOpen((p) => !p)}>
            <img loading="lazy" src={image_url || "/user.jpg"} alt="profile" />
          </AvatarBtn>

          {isOpen && (
            <DropdownWrap>
              {/* user info */}
              <UserBlock>
                <UserAvatar>{fullName[0]}</UserAvatar>
                <UserInfo>
                  <UserName>{fullName}</UserName>
                  <UserEmail>{email}</UserEmail>
                </UserInfo>
              </UserBlock>

              <Divider />

              {/* menu items */}
              {MENU_ITEMS.map((item) => (
                <MenuItem key={item.path} onClick={() => go(item.path)}>
                  <MenuIcon>{item.icon}</MenuIcon>
                  {item.label}
                </MenuItem>
              ))}

              <Divider />

              <MenuItem $danger onClick={handleSignOut}>
                <MenuIcon>↩</MenuIcon>
                Sign Out
              </MenuItem>
            </DropdownWrap>
          )}
        </div>
      </RightSide>
    </Nav>
  );
}

// --------------------------------------------------------------

// import styled from "styled-components";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import DropDownApp from "./DropDownApp";
// import { useUser } from "../../hooks/useUser";

// const Nav = styled.nav`
//   position: relative;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 40px;
//   background-color: #e5f4ff;
//   color: #5c9132;
//   @media (max-width: 1200px) {
//     padding: 60px;
//     /* Padding for medium screens */
//   }

//   @media (max-width: 768px) {
//     padding: 50px;
//     /* Padding for small screens */
//   }

//   @media (max-width: 480px) {
//     padding: 30px; /* Padding for extra small screens */
//   }
// `;

// const LogoContainer = styled.div`
//   display: flex;
//   align-items: center;
//   border-radius: 50%;
//   cursor: pointer;

//   img {
//     width: 60px;
//     height: 60px;
//     border-radius: 50%;
//   }

//   h1 {
//     font-size: 1.5rem;
//     padding-left: 4px;
//     margin: 0;
//   }
// `;

// const MenuContainer = styled.div``;

// const ToggleIcons = styled.div`
//   cursor: pointer;

//   div {
//     width: 20px;
//     height: 2px;
//     background-color: #5c9132;
//     margin: 4px 0;
//     border-radius: 10px;
//   }
//   img {
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     object-fit: cover;
//   }
// `;

// export default function AppNavbar({ pageOne }) {
//   const { data, isLoading } = useUser();
//   const [isOpen, setisOpen] = useState(false);
//   const navigate = useNavigate();

//   const image_url = data?.profile.avatar_url;

//   const toggleMenu = () => {
//     setisOpen(!isOpen);
//     // console.log("Menu toggled:", !isOpen);
//   };

//   const closeNav = () => {
//     setisOpen(false);
//   };

//   const handleNavigation = (path) => {
//     setisOpen(false);
//     navigate(path);
//   };

//   return (
//     <Nav>
//       <LogoContainer onClick={() => handleNavigation("/mobile")}>
//         <img loading="lazy" src="/logo1.jpg" alt="logo" />
//         <h1>AFARMER</h1>
//       </LogoContainer>
//       <MenuContainer>
//         <ToggleIcons onClick={toggleMenu}>
//           {pageOne ? (
//             <button>List & Sell </button>
//           ) : (
//             <img
//               loading="lazy"
//               src={image_url || "/user.jpg"}
//               alt="profile image"
//             />
//           )}
//         </ToggleIcons>
//       </MenuContainer>
//       <DropDownApp isOpen={isOpen} toggleMenu={closeNav}></DropDownApp>
//     </Nav>
//   );
// }
