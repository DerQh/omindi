import styled from "styled-components";
import BodyComponent from "./BodyUpComponent";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const ImageContainer = styled.div`
  background-image: url("/farming.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  img {
    max-width: 80%;
    height: auto;
  }
`;
// HOW IT WORKS CONTAINER
const HowItWorksContainer = styled.div`
  display: grid;
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
    /* Padding for small screens */
  }

  @media (max-width: 480px) {
    padding: 40px; /* Padding for extra small screens */
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

const InquiryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #362f2f;
  background-color: #f6f6f6;
  font-family: "Montserrat", sans-serif;
  padding: 20px 40px;
  @media (max-width: 1200px) {
    padding: 60px;
    /* Padding for medium screens */
  }

  @media (max-width: 768px) {
    padding: 50px;
    /* Padding for small screens */
  }

  @media (max-width: 480px) {
    padding: 40px; /* Padding for extra small screens */
  }

  h2 {
    font-size: 42px;
    line-height: 46px;
    font-weight: 700;
  }
  p {
    font-family: "Dosis", sans-serif;
    font-size: 18px;
  }
`;
const InquiryParagraph = styled.p`
  font-family: "Dosis", sans-serif;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 45px;
  font-style: italic;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;

  button {
    background-color: #5c9132;
    color: #fff;
    border: none;
    padding: 10px 20px;
    letter-spacing: 1px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    align-self: center;
    margin-top: 20px;
    max-width: 200px;
    border: 2px solid #5c9132;

    &:hover {
      background-color: #ffffff;
      color: #5c9132;
      border: 2px solid #5c9132;
    }
  }
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 10px; */
  text-align: left;

  p {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #000000;
    margin-bottom: 5px;
  }

  input,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: transparent;
    }

    &::placeholder {
      color: #999;
      font-size: 14px;
    }
  }
  div {
    display: flex;
    gap: 10px;

    input {
      flex: 1;
    }
  }
`;

const InputDiv2 = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 10px; */
  text-align: left;
  width: 100%;

  p {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #000000;
    margin-bottom: 5px;

    a {
      color: #000000;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  input,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    max-width: 100%;
    width: 100%;
    min-height: 40px;
    box-sizing: border-box;
    &:focus {
      outline: none;
      border-color: transparent;
    }

    &::placeholder {
      color: #999;
      font-size: 14px;
    }
  }
`;

const FeedbackContainer = styled.div`
  color: #313131;
  text-align: center;
  font-size: 24px;
  font-family: "Dosis", sans-serif;
  font-style: italic;
  padding: 20px 40px;
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

function Body() {
  const heading = "THE MARKETPLACE APP FOR LOCAL FOOD & FARMS";
  const subheading = "DIRECT FROM THE FARM";
  const description =
    "Discover and connect with local food and farms near you.";
  const bgcolor = "blue";
  return (
    <>
      <Navbar />
      <BodyComponent
        heading={heading}
        subheading={subheading}
        description={description}
        bgcolor={bgcolor}
      />

      <ImageContainer>
        <img
          loading="lazy"
          src="/app screenshot.png"
          alt=" app phone screenshot"
        />
      </ImageContainer>
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
      <InquiryContainer>
        <h2>LOCAL FARM INSTITUTIONAL PURCHASING</h2>
        <p>
          Are you a food buyer for an institution, retailer,or restaurant? Join
          our wholesale program to source directly from a diverse network of
          hundreds of farms across Kisumu and its environs.
        </p>
        <InquiryParagraph>
          If you are looking to buy local food for personla use, please download
          the Puodho app to find farms near you.
        </InquiryParagraph>
        <FormContainer>
          <InputDiv>
            <p>Name</p>
            <div>
              <input placeholder="First Name" type="text" />
              <input placeholder="Last Name" type="text" />
            </div>
          </InputDiv>
          <InputDiv>
            <p>Email</p>
            <div>
              <input placeholder="First Name" type="text" />
              <input placeholder="Last Name" type="text" />
            </div>
          </InputDiv>

          <InputDiv2>
            <p>Institution/Company</p>
            <input placeholder="Institution Name" type="text" />
          </InputDiv2>
          <InputDiv2>
            <p>
              What are you interested in selling or purchasing from
              <a href=""> Afarmer </a> that are in the local farms ?
            </p>
            <textarea rows="4"></textarea>
          </InputDiv2>
          <button>Submit Inquiry</button>
        </FormContainer>
      </InquiryContainer>
      <FeedbackContainer>
        "Afarmer has resulted in both professional and personal relationships
        with increible customes an people in my local community. Not only have I
        been able to network and make sales but I never eaten better or cleaner
        in my life! I downloaded it when I was the only producer within 50 kms
        and now there are over 30 in my village alone! I can't wait to see what
        else Puodo has up their sleeve!" - Jeff Ondoro.
      </FeedbackContainer>
      <FooterContainer />
    </>
  );
}

export default Body;
