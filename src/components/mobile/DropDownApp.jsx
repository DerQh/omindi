import { Link } from "react-router-dom";
import styled from "styled-components";

function DropDownApp({ isOpen, toggleMenu }) {
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
      <Link to="/account">
        <li>
          <h4 onClick={() => toggleMenu()}>Account Info</h4>
        </li>
      </Link>
      <Link to="/community">
        <li>
          <h4 onClick={() => toggleMenu()}>Community</h4>
        </li>
      </Link>
      <Link to="/">
        <li>
          <h4 onClick={() => toggleMenu()}>Sign Out</h4>
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
  /* left: 30px; */
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
      font-size: 18px;
      color: #000000;
      font-weight: 600;
      width: 100%;
      padding-left: 8px;
      border-radius: 4px;
      margin: 0;
      /* background-color: red; */

      &:hover {
        /* background-color: #dde8f0; */
        color: #777777;
      }
    }
  }
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
