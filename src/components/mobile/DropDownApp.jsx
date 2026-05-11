import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function DropDownApp({ isOpen, toggleMenu }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate("/"); // or "/login"
  };
  const { cartCount } = useContext(CartContext);
  // console.log("DropDownApp rendered with isOpen:", isOpen);

  return (
    <DropDown isopen={isOpen}>
      <Link to="/list">
        <li>
          <h4 onClick={() => toggleMenu()}>List & Sell</h4>
        </li>
      </Link>
      <Link to="/following">
        <li>
          <h4 onClick={() => toggleMenu()}>Following</h4>
        </li>
      </Link>
      <Link to="/messages">
        <li>
          <h4 onClick={() => toggleMenu()}>Messages</h4>
        </li>
      </Link>
      <Link to="/profile">
        <li>
          <h4 onClick={() => toggleMenu()}>View Profile</h4>
        </li>
      </Link>
      <Link to="/cart">
        <li>
          <h4 onClick={() => toggleMenu()}>
            Cart
            {cartCount > 0 && <Badge>{cartCount}</Badge>}
          </h4>
        </li>
      </Link>
      <Link to="/community">
        <li>
          <h4 onClick={() => toggleMenu()}>Community</h4>
        </li>
      </Link>
      <Link to="/">
        <li>
          <h4
            onClick={() => {
              toggleMenu();
              handleSignOut();
            }}
          >
            Sign Out
          </h4>
        </li>
      </Link>
    </DropDown>
  );
}

export default DropDownApp;

const DropDown = styled.ul`
  z-index: 1000;
  list-style: none;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 80%;
  right: 30px;
  background-color: #e5f4ff;
  color: #000000;
  border: 1px solid #ccc;
  border-radius: 5px;
  border-top: 2px solid #5c9132;
  display: ${({ isopen }) => (isopen ? "block" : "none")};
  opacity: ${({ isopen }) => (isopen ? "1" : "0")};

  li {
    padding: 8px 12px;
    cursor: pointer;
    text-decoration: none;
    list-style: none;

    h4 {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      color: #000000;
      font-weight: 600;
      width: 100%;
      padding-left: 8px;
      border-radius: 4px;
      margin: 0;

      &:hover {
        color: #777777;
      }
    }
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 8px;
  color: white;
  background: #e63946;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
`;

const SubDrop = styled.ul`
  list-style: none;
  li {
    padding: 8px 12px;
    cursor: pointer;
    text-decoration: none;
    list-style: none;

    &:hover {
      background-color: #dde8f0;
      color: #777777;
    }
  }
`;
