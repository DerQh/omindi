import Navbar from "../web/Navbar";
import styled from "styled-components";
import AppNavbar from "./AppNavbar";

const MapContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  color: #000000;
  iframe {
    height: 80%;
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  /* top: -50px; */
  /* left: 50%;
  transform: translateX(-50%); */
  display: flex;
  justify-content: space-between;
  gap: 8px; 
  input {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 300px;
  }
  button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #45a049;
    }
    &:active {
      background-color: #3e8e41;
    }
  }
`;

export default function Map() {
  return (
    <>
      <AppNavbar></AppNavbar>
      <SearchContainer>
        <input type="text" placeholder="Search" />
        <button type="submit">Search</button>
      </SearchContainer>
      <MapContainer>
        <iframe
          title="Farm Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5028.815388190825!2d34.805867768719445!3d-0.15380842781345577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182abd001a9ece4d%3A0xa3711c9f9653759d!2sOmindi%20FarmHouse!5e1!3m2!1sen!2sbh!4v1774555786905!5m2!1sen!2sbh"
          // allowFullScreen=""
          loading="lazy"
        ></iframe>
      </MapContainer>
    </>
  );
}
