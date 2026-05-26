import styled from "styled-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropDownApp from "./DropDownApp";
import { useUser } from "../../hooks/useUser";

const Nav = styled.nav`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px;
  background-color: #e5f4ff;
  color: #5c9132;
  @media (max-width: 1200px) {
    padding: 60px;
    /* Padding for medium screens */
  }

  @media (max-width: 768px) {
    padding: 50px;
    /* Padding for small screens */
  }

  @media (max-width: 480px) {
    padding: 30px; /* Padding for extra small screens */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  h1 {
    font-size: 1.5rem;
    padding-left: 4px;
    margin: 0;
  }
`;

const MenuContainer = styled.div``;

const ToggleIcons = styled.div`
  cursor: pointer;

  div {
    width: 20px;
    height: 2px;
    background-color: #5c9132;
    margin: 4px 0;
    border-radius: 10px;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export default function AppNavbar({ pageOne }) {
  const { data, isLoading } = useUser();
  const [isOpen, setisOpen] = useState(false);
  const navigate = useNavigate();

  const image_url = data?.profile.avatar_url;

  const toggleMenu = () => {
    setisOpen(!isOpen);
    // console.log("Menu toggled:", !isOpen);
  };

  const closeNav = () => {
    setisOpen(false);
  };

  const handleNavigation = (path) => {
    setisOpen(false);
    navigate(path);
  };

  return (
    <Nav>
      <LogoContainer onClick={() => handleNavigation("/mobile")}>
        <img loading="lazy" src="/logo1.jpg" alt="logo" />
        <h1>AFARMER</h1>
      </LogoContainer>
      <MenuContainer>
        <ToggleIcons onClick={toggleMenu}>
          {pageOne ? (
            <button>List & Sell </button>
          ) : (
            <img
              loading="lazy"
              src={image_url || "/user.jpg"}
              alt="profile image"
            />
          )}
        </ToggleIcons>
      </MenuContainer>
      <DropDownApp isOpen={isOpen} toggleMenu={closeNav}></DropDownApp>
    </Nav>
  );
}
