import Navbar from "../web/Navbar";
import styled from "styled-components";
import AppNavbar from "./AppNavbar";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const PageHeader = styled.h2`
  margin: 0;
  padding: 20px 24px;
  color: #2f5a2a;
  font-size: 1.5rem;
  background: #eef7ee;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #5c9132;
`;

const MapContainer = styled.div`
  position: relative;
  height: calc(100vh - 200px);
  width: 100%;
  color: #000000;
  background: white;

  iframe {
    height: 100%;
    width: 100%;
    border: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    min-width: 250px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #5c9132;
      box-shadow: 0 0 4px rgba(92, 145, 50, 0.2);
    }
  }

  button {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    background-color: #5c9132;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      background-color: #4a7329;
      box-shadow: 0 4px 12px rgba(92, 145, 50, 0.3);
    }

    &:active {
      background-color: #3e5f22;
    }
  }
`;

const HeaderText = styled.h2`
  margin: 0;
  padding: 20px 24px;
  color: #2f5a2a;
  font-size: 1.5rem;
  background: #eef7ee;
  font-weight: 600;
  text-align: center;
  border-bottom: 2px solid #5c9132;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #5c9132;
  cursor: pointer;
  font-weight: 700;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;
  transition: color 0.3s ease;

  &:hover {
    color: #4a7329;
  }
`;

export default function Map() {
  const navigate = useNavigate();

  return (
    <Container>
      <AppNavbar />
      <HeaderText>
        Start <LinkButton onClick={() => navigate("/list")}>listing</LinkButton> or{" "}
        <LinkButton onClick={() => navigate("/list")}>buying</LinkButton> farm products
      </HeaderText>
      <MapContainer>
        <iframe
          title="Farm Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5028.815388190825!2d34.805867768719445!3d-0.15380842781345577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182abd001a9ece4d%3A0xa3711c9f9653759d!2sOmindi%20FarmHouse!5e1!3m2!1sen!2sbh!4v1774555786905!5m2!1sen!2sbh"
          loading="lazy"
        ></iframe>
      </MapContainer>
    </Container>
  );
}