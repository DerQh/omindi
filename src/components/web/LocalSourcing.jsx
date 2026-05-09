import styled from "styled-components";
import React, { useState } from "react";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { Outlet } from "react-router-dom";

const MainContainer = styled.div`
  padding: 20px 40px;
  background-color: ${(props) =>
    props.bgcolor === "white" ? "#f0f4f6" : "#e5f4ff"};

  color: #000000;
  @media (max-width: 1200px) {
    padding: 60px;
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 30px;
  }

  p {
    font-size: 16px;
    letter-spacing: 3px;
    font-weight: 500;
    line-height: 27.2px;
    margin-bottom: 45px;
    font-family: "Montserrat", sans-serif;
    &:nth-child(3) {
      font-size: 20px;
      line-height: 32px;
      font-weight: 500;
      letter-spacing: 1px;
      margin-bottom: 45px;
    }
  }
  h1 {
    font-size: 42px;
    line-height: 43.2px;
    font-weight: 700;
    line-height: 54.2px;
    font-family: "Dosis", sans-serif;
    text-transform: uppercase;
  }
`;

const HowItWorksContainer = styled.div`
  background-color: #fcfbfb;
  text-align: center;
  padding: 40px;
  h2 {
    font-size: 32px;
    line-height: 38.4px;
    font-weight: 700;
    font-family: "Dosis", sans-serif;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    line-height: 27.2px;
    font-weight: 600;
    letter-spacing: 1px;
    font-family: "Montserrat", sans-serif;
    max-width: 600px;
    margin: 0 auto;
    span {
      color: #5c9132;
      font-weight: 700;
      cursor: pointer;
    }
  }

  @media (max-width: 1200px) {
    padding: 40px;
  }

  @media (max-width: 768px) {
    padding: 40px;
  }

  @media (max-width: 480px) {
    padding: 40px;
    h2 {
      font-size: 24px;
      line-height: 28.8px;
    }
    p {
      font-size: 16px;
      line-height: 24px;
    }
  }
`;

const DownloadContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 5px;
  button {
    background-color: #3c7a49;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    font-family: "Dosis", sans-serif;
    letter-spacing: 1px;

    &:hover {
      background-color: #218838;
    }
  }
  a {
    img {
      max-width: 110px;
      height: auto;
    }
  }
`;
const ImageDiv = styled.div`
  background-color: #fff;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;
const HowitWorks = styled.div`
  h2 {
    font-size: 42px;
    line-height: 43.2px;
    font-weight: 700;
  }
`;
const BuySellGrowContainers = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  color: #362f2f;
  background-color: #fff;
  font-family: "Montserrat", sans-serif;
  padding: 20px 40px;
  @media (max-width: 1200px) {
    padding: 60px;
    /* Padding for medium screens */
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 40px; /* Padding for extra small screens */
    flex-direction: column;
    gap: 20px;
  }
`;

const BuySellGrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 10px; */
  margin-top: 30px;
  img {
    max-width: 100px;
    height: auto;
  }
  h2 {
    font-size: 24px;
    line-height: 28.8px;
    font-weight: 700;
  }
  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 500;
    letter-spacing: 1px;
    max-width: 300px;
    color: #5e5d5d;
  }
`;

const LearnButton = styled.button`
  background-color: #5c9132;
  color: #fff;
  border: 2px solid #ffffff;
  padding: 10px 20px;
  letter-spacing: 1px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 30px;
  max-width: 200px;
  &:hover {
    background-color: #ffffff;
    color: #5c9132;
    border: 2px solid #5c9132;
  }
`;

function LocalSourcing() {
  return (
    <>
      {/* // This is where the nested routes will be rendered */}
      <Navbar></Navbar>
      <MainContainer>
        <h1>STREAMLINE LOCAL PROCUREMENT</h1>
        <p>
          Afarmer connects healthcare and community partners to our nationwide
          network of 28,000+ farms, making it simple to source, redeem, and
          track local produce through one streamlined platform
        </p>
        <DownloadContainer>
          <button>Get Started</button>
        </DownloadContainer>
      </MainContainer>

      <HowItWorksContainer>
        <HowitWorks>
          <h2>HOW IT WORKS</h2>
          <p>
            We are on a mission to empower local farms and strengthen local food
            supply chain across Kisumu and it's environs.
          </p>
        </HowitWorks>
        <BuySellGrowContainers>
          <BuySellGrowContainer>
            <img loading="lazy" src="/buy.png" alt="buy image" />
            <h2>Buy</h2>
            <p>
              Search on a map using a keyword for produce that is on sale.
              Message the seller and arrange a pickup, meetup, or delivery.
            </p>
          </BuySellGrowContainer>
          <BuySellGrowContainer>
            <img loading="lazy" src="/sell.png" alt="sell image" />
            <h2>Sell</h2>
            <p>
              Create a free listing to sell your homegrown produce, chicken
              eggs, supplies, plant trees, and more.
            </p>
          </BuySellGrowContainer>
          <BuySellGrowContainer>
            <img loading="lazy" src="/grow.png" alt="grow image" />
            <h2>Grow</h2>
            <p>
              Connect with the consumer and wholesale buyers for your homegrown
              produce without the hassle of branding, a website, or advertising.
            </p>
          </BuySellGrowContainer>
        </BuySellGrowContainers>

        <div>
          <LearnButton>LEARN MORE </LearnButton>
        </div>
      </HowItWorksContainer>
      <FooterContainer></FooterContainer>
    </>
  );
}

export default LocalSourcing;
