import { Link } from "react-router-dom";
import styled from "styled-components";

function DropDownMenu({ isOpen, toggleMenu }) {
  // console.log("DropDownMenu rendered with isOpen:", isOpen);

  return (
    <DropDown isopen={isOpen}>
      <li>
        <h4>How it works</h4>
        <SubDrop>
          <Link to="/forfarms">
            <li onClick={() => toggleMenu()}>For Farmers</li>
          </Link>
          <Link to="/for farmersmarket">
            <li onClick={() => toggleMenu()}>For Buyers</li>
          </Link>
          <Link to="/agritourism">
            <li onClick={() => toggleMenu()}>Agritourism</li>
          </Link>
        </SubDrop>
      </li>
      <li>
        <Link to="/pricing">
          <h4 onClick={() => toggleMenu()}>Pricing</h4>
        </Link>
      </li>
      <li>
        <Link to="/localsourcing">
          <h4 onClick={() => toggleMenu()}>Local Sourcing</h4>
        </Link>
        <SubDrop>
          <Link to="/wholesale">
            <li onClick={() => toggleMenu()}>Wholesalers</li>
          </Link>
        </SubDrop>
      </li>
      <li>
        <h4>Seller's Guide</h4>
      </li>
      <li>
        <h4>About Us</h4>
        <SubDrop>
          <Link to="/aboutus">
            <li onClick={() => toggleMenu()}>Our Story</li>
          </Link>
          <Link to="/news">
            <li onClick={() => toggleMenu()}>News</li>
          </Link>
          <Link to="/faq">
            <li onClick={() => toggleMenu()}>FAQ</li>
          </Link>
          <Link to="/contactus">
            <li onClick={() => toggleMenu()}>Contact</li>
          </Link>
        </SubDrop>
      </li>
      <Link to="/shop">
        <li>
          <h4 onClick={() => toggleMenu()}>Shop</h4>
        </li>
      </Link>
      <Link to="/sign-up">
        <li>
          <h4 onClick={() => toggleMenu()}>Desktop Version of the App</h4>
        </li>
      </Link>
    </DropDown>
  );
}

export default DropDownMenu;

const DropDown = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 80%;
  right: 30px;
  left: 30px;
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
