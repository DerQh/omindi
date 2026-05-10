import { useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const AboutUsContainer = styled.div`
  padding: 20px 40px;
  background-color: #37b3e3;
  color: #000000;

  div {
    margin-bottom: 30px;
  }
`;

const Heading = styled.h2`
  font-size: 50px;
  letter-spacing: 4px;
  font-weight: 700;
  line-height: 62px;
  color: #fff;
  text-align: center;
`;

const InnerContainer = styled.div`
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  margin-top: 20px;

  /* opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease; */

  /* &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &.initial {
    opacity: 1;
    transform: translateY(0);
    transition: none;
  } */

  h2 {
    font-size: 24px;
    letter-spacing: 2px;
    font-weight: 700;
    line-height: 36px;
    margin-bottom: 15px;
    text-align: center;
  }

  p {
    font-size: 16px;
    letter-spacing: 1px;
    font-weight: 700;
    line-height: 27.2px;
    margin-bottom: 15px;

    span {
      font-weight: 500;
    }
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
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 40px;
    flex-direction: column;
    gap: 20px;
  }
`;

const BuySellGrowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

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

const FounderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px;
  background-color: #e5f4ff;
  color: #5c9132;

  /* opacity: 0;
  transform: translateY(40px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease; */
/* 
  &.visible {
    opacity: 1;
    transform: translateY(0);
  } */

  /* &.initial {
    opacity: 1;
    transform: translateY(0);
    transition: none;
  } */

  img {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    margin: 20px;
    object-fit: cover;
  }

  h4 {
    font-size: 24px;
    line-height: 28.8px;
    font-weight: 700;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 500;
    letter-spacing: 1px;
    max-width: 600px;
    color: #5e5d5d;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  /* opacity: 0; */
  /* transform: translateY(40px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease; */

  /* &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &.initial {
    opacity: 1;
    transform: translateY(0);
    transition: none;
  } */

  img {
    margin: 40px 80px;
    max-width: 100%;
  }
`;

const AboutUs = () => {
  // useEffect(() => {
  //   const revealElements = document.querySelectorAll(".reveal");
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           entry.target.classList.add("visible");
  //           observer.unobserve(entry.target);
  //         }
  //       });
  //     },
  //     { threshold: 0.3 },
  //   );

  //   revealElements.forEach((el) => {
  //     const rect = el.getBoundingClientRect();
  //     const isVisibleOnLoad = rect.top < window.innerHeight && rect.bottom > 0;

  //     if (isVisibleOnLoad) {
  //       el.classList.add("initial", "visible");
  //     } else {
  //       observer.observe(el);
  //     }
  //   });

  //   return () => observer.disconnect();
  // }, []);

  return (
    <>
      <Navbar />
      <AboutUsContainer>
        <div>
          <Heading>About Us</Heading>
        </div>
        <div>
          <InnerContainer>
            <BuySellGrowContainers>
              <BuySellGrowContainer>
                <img src="/objective.png" alt="buy image" />
                <h2>Mission</h2>
                <p>
                  Create economic opportunities for local food growers and
                  connect communities with the economic, environmental, and
                  health benefits of locally grown food
                </p>
              </BuySellGrowContainer>
              <BuySellGrowContainer>
                <img src="/our way.png" alt="sell image" />
                <h2>Our Path</h2>
                <p>
                  Recent events have shown us the fragility of our
                  national/global food systems. Unlike big corporations, local
                  food resources (gardens, farms, etc.) are able to pivot in the
                  face of change.
                </p>
              </BuySellGrowContainer>
              <BuySellGrowContainer>
                <img src="/community.png" alt="grow image" />
                <h2>Community</h2>
                <p>
                  As a mission-driven marketplace, our first priority is
                  community. Bringing people together is the focus of everything
                  we do
                </p>
              </BuySellGrowContainer>
            </BuySellGrowContainers>
          </InnerContainer>
        </div>
      </AboutUsContainer>
      <FounderContainer className="">
        <img src="/founder1.jpg" alt="founder picture" />
        <h4>HI, I'M OMINDI</h4>
        <p>
          I’m the founder of an organic farm in a village near Kisumu. I grow
          healthy crops by using sustainable methods like composting and natural
          soil improvement, without harmful chemicals. I work closely with
          neighbors, share simple farming practices, and encourage responsible
          agriculture so our community can secure better harvests, enjoy cleaner
          land, and build a stronger future.
        </p>
      </FounderContainer>
      <ImageContainer className="">
        <img src="/food-chain.png" alt="" />
      </ImageContainer>
      <FooterContainer />
    </>
  );
};

export default AboutUs;
