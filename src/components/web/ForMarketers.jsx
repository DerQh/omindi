import styled from "styled-components";
import BodyComponent from "./BodyUpComponent";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const MainContainer = styled.div`
  /* display: flex;
  flex-direction: column;
  gap: 20px; */
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

const Container = styled.div`
  padding: 20px 40px;
  background-color: #f0f4f6;
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
    /* font-family: "Montserrat", sans-serif; */
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
  }
  button {
    font-family: "Dosis", sans-serif;
    padding: 10px 20px;
    background-color: #5c9132;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #37b3e3;
    }
  }
`;

const FaqContainer = styled.div`
  padding: 20px 40px;
  background-color: #f0f4f6;
  color: #000000;

  div {
    margin-bottom: 30px;
    p {
      font-size: 16px;
      letter-spacing: 3px;
      font-weight: 700;
      line-height: 27.2px;
      margin-bottom: 15px;
    }
    ul {
      list-style-type: disc;
      padding-left: 20px;
      li {
        font-size: 16px;
        letter-spacing: 1px;
        font-weight: 400;
        line-height: 27.2px;
        margin-bottom: 10px;
      }
    }
  }

  @media (max-width: 1200px) {
    padding: 60px;
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 30px;
  }
`;

const HowToUseContainer = styled.div`
  padding: 20px 40px;
  color: #000000;
  h2 {
    text-align: center;
    font-size: 32px;
    line-height: 43.2px;
    font-weight: 700;
    line-height: 54.2px;
    font-family: "Dosis", sans-serif;
    margin-bottom: 30px;
  }
`;

const FeedbackContainer = styled.div`
  padding: 20px 40px;
  background-color: #fff;
  color: #000000;
  p {
    text-align: center;
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
`;

const ForMarketers = () => {
  const subheading = "FOR EVERYONE IN THE FARMERS MARKET COMMUNITY";
  const heading = "GROW YOUR FARMERS MARKET";
  const description =
    "Grow your local food community and stay connected beyond market days.";
  const bgcolor = "white";

  return (
    <>
      <Navbar />
      <MainContainer>
        <BodyComponent
          subheading={subheading}
          heading={heading}
          description={description}
          bgcolor={bgcolor}
        />

        <ImageDiv>
          <img src="/market.png" alt="market picture" />
        </ImageDiv>

        <Container>
          <p>AFARMER MAKES IT EASY</p>
          <h2>BEGIN YOUR JOURNEY TODAY AT NO COST!</h2>
          <p>
            Set up your free profile and list up to 3 items simultaneously. If
            you require additional listings, upgrade to unlimited for only $10
            per month.
          </p>
          <button>Get Started Today </button>
        </Container>
      </MainContainer>

      <HowToUseContainer>
        <h2>How to use Afarmer</h2>
        <ImageDiv>
          <img src="/howtouse1.png" alt="how to use  picture" />
        </ImageDiv>
        <ImageDiv>
          <img src="/howtouse2.png" alt="how to use picture" />
        </ImageDiv>
      </HowToUseContainer>
      <FaqContainer>
        <h2>FAQ</h2>
        <div>
          <p>
            Q: How do I list my products on Afarmer? <br />
          </p>
          <ul>
            <li>
              Afarmer helps buyers and sellers connect. Transactions occur in
              person and outside the app, with no transaction fees involved!
            </li>
          </ul>
        </div>

        <div>
          <p>
            Q: I’m a Market Manager, can I use Afarmer? <br />
          </p>
          <ul>
            <li>
              Absolutely! You can create a profile and listings for your market!
              This profile can also be used to connect with your market vendors,
              both on and off the app. We encourage market managers to use
              Afarmer as a tool to connect with their vendors and customers, and
              to promote their market and events.
            </li>
          </ul>
        </div>

        <div>
          <p>
            Q: What kinds of products are available for wholesale purchase and
            sale on Afarmer? <br />
          </p>
          <ul>
            <li>
              Afarmer supports a wide range of locally sourced and produced
              goods, including but not limited to fresh produce, meat, dairy,
              honey, baked goods, and specialty food items. Our platform is
              flexible to accommodate the diverse offerings of farms and
              producers. Whether you’re a small-scale farmer, artisanal
              producer, or commercial grower, Afarmer provides a space to
              showcase your products and connect with consumer and wholesale
              buyers who value locally sourced goods.
            </li>
          </ul>
        </div>
      </FaqContainer>
      <FeedbackContainer>
        <p>
          "I began using Afarmer about a month ago when we struggled to attract
          new customers in our area. Already, several people have contacted us,
          mentioning they discovered us on Afarmer and inquiring about our
          animal raising practices and produce care. I will keep using Afarmer
          to help promote our new small homestead." - Benard Onyango
        </p>
      </FeedbackContainer>
      <FooterContainer />
    </>
  );
};

export default ForMarketers;
