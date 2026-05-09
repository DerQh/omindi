import styled from "styled-components";
import FooterContainer from "./Footer";
import Navbar from "./Navbar";

const ForFarms = () => {
  return (
    <>
      <Navbar />
      <MainContainer>
        <HowItWorksContainer>
          <h2>How It Works</h2>
          <p>
            Have up to 3 active listings at a time for free. Update or swap them
            anytime, or upgrade to <span>unlimited listings</span> for just
            Kes10/month!
          </p>
        </HowItWorksContainer>

        <ImageDiv>
          <img src="/For Consumers.png" alt="" />
        </ImageDiv>

        <Section>
          <SubSection>
            <h2>Sell Your Products</h2>
            <p>
              List your fresh produce and connect with local buyers. Our
              platform makes it easy to showcase your products and manage
              sales.You can also create event listings for farm tours, U-pick
              events, classes, plant sales, and any other agriculture-related
              event.
            </p>
          </SubSection>
          <SubSection>
            <Container>
              <img src="/chat.png" alt="" />
              <div>
                <h2>Message with customers</h2>
                <p>
                  Engage with your buyers using our in-app messaging feature.
                  Avoid sharing irrelevant personal details, but feel free to
                  respond to pertinent inquiries and coordinate an in-person
                  transaction.
                </p>
              </div>
            </Container>
            <Container>
              <img src="/deal.png" alt="" />
              <div>
                <h2>Make the Sale</h2>
                <p>
                  Set up your sale as a meetup, porch pickup, roadside
                  farmstand, or another form of in-person exchange. Currently,
                  shipping goods is not available. During the sale, you can
                  receive payment in whichever method suits you best (cash,
                  Venmo, PayPal, etc.).
                </p>
              </div>
            </Container>
          </SubSection>
        </Section>
        <ImageDiv>
          <img src="/salepic.png" alt="" />
        </ImageDiv>
        <BuyLocalContainer>
          <h2>Buy Local </h2>
          <p>
            Search for products by keyword or location, and then contact the
            seller to arrange a purchase. Payments are processed outside of the
            app.
          </p>
        </BuyLocalContainer>
      </MainContainer>
      <FooterContainer />
    </>
  );
};

export default ForFarms;



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

const MainContainer = styled.div`
  padding: 20px 40px;
  background-color: #e5f4ff;
  color: #000000;
  @media (max-width: 1200px) {
    padding: 60px;
  }

  @media (max-width: 768px) {
    padding: 40px;
  }

  @media (max-width: 480px) {
    padding: 30px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Container = styled.div`
  /* border: 2px solid #9c7474; */
  display: flex;
  gap: 14px;
  img {
    width: 40px;
    height: 40px;
  }
`;

const ImageDiv = styled.div`
  width: 100%;
  height: auto;
  padding: 40px 0;
  img {
    width: 100%;
    height: auto;
  }
`;

const SubSection = styled.div`
  h2 {
    font-size: 18px;
    line-height: 33.6px;
    font-weight: 700;
    font-family: "Dosis", sans-serif;
    margin-top: 0;
  }
  p {
    font-size: 12px;
    line-height: 27px;
    font-weight: 500;
    /* letter-spacing: px; */
    font-family: "Montserrat", sans-serif;
  }
`;

const BuyLocalContainer = styled.div`
  background-color: #fcfbfb;
  text-align: center;
  padding: 30px 40px;
  h2 {
    font-size: 22px;
    line-height: 38.4px;
    font-weight: 700;
    font-family: "Dosis", sans-serif;
  }
  p {
    font-size: 14px;
    line-height: 27px;
    font-weight: 500;
    font-family: "Montserrat", sans-serif;
  }
`;
