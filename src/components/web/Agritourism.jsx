import styled from "styled-components";
import BodyComponent from "./BodyUpComponent";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

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

const FaqSection = styled.section`
  margin-top: 50px;
  padding: 20px 40px;
  background-color: #f0f4f6;
  font-family: "Dosis", sans-serif;

  @media (max-width: 1200px) {
    padding: 60px;
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 30px;
  }
  h2 {
    font-size: 28px;
    line-height: 33.6px;
    font-weight: 800;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 400;
    letter-spacing: 1px;
    margin-bottom: 30px;
  }
`;

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
  }

  @media (max-width: 768px) {
    padding: 50px;
  }

  @media (max-width: 480px) {
    padding: 40px;
  }
`;
const HowitWorks = styled.div`
  padding: 20px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  p {
    font-size: 16px;
    line-height: 27.2px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #5e5d5d;
    margin-bottom: 30px;
  }
`;

const Heading = styled.h2`
  font-size: 42px;
  line-height: 48px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Agritourism = () => {
  const heading = "DISCOVER THE WORLD OF AGRITOURISM";
  const subheading =
    "EXPERIENCE THE CHARM OF RURAL LIFE AND CONNECT WITH NATURE";
  const description =
    "Explore seasonal events, from farm tours to workshops, and set up your own listings to promote your agritourism activities to local customers.";
  const bgcolor = "white";

  return (
    <>
      <Navbar />
      <BodyComponent
        heading={heading}
        subheading={subheading}
        description={description}
        bgcolor={bgcolor}
      />

      <HowitWorks>
        <HowitWorks>
          <Heading>HOW IT WORKS</Heading>
          <p>
            Afarmer allows you to effortlessly share, discover, and connect with
            local agritourism events in your neighborhood.
          </p>
        </HowitWorks>
        <BuySellGrowContainers>
          <BuySellGrowContainer>
            <img src="/create.png" alt="buy image" />
            <h2>Create</h2>
            <p>
              Promote your farm events to the local community. Create free
              listings for tours, U-pick days, workshops, and more.
            </p>
          </BuySellGrowContainer>
          <BuySellGrowContainer>
            <img src="/discover.png" alt="sell image" />
            <h2>Discover</h2>
            <p>
              Find local farm events near you. Check out seasonal festivals,
              hands-on farm experiences, and more, all in one place
            </p>
          </BuySellGrowContainer>
          <BuySellGrowContainer>
            <img src="/connect.png" alt="grow image" />
            <h2>Connect</h2>
            <p>
              Attend events, follow your favorite farms, and build meaningful
              connections with your community.
            </p>
          </BuySellGrowContainer>
          <div>
            <LearnButton>GET STARTED </LearnButton>
          </div>
        </BuySellGrowContainers>
      </HowitWorks>

      <FaqSection>
        <h2>FAQ</h2>

        <div>
          <h3>How can I find local agritourism events near me?</h3>
          <p>
            Search the Afarmer app to discover local events like farm tours,
            U-pick days, and seasonal festivals. You can also follow farms to
            stay updated on their latest activities.
          </p>
        </div>

        <div>
          <h3>What types of events can I list on Afarmer?</h3>
          <p>
            You can create listings for any event that connects the community to
            local agriculture. Popular options include U-pick days, farm tours,
            seasonal festivals, workshops, or educational experiences. Farmers
            markets and pop-up events are also welcome.
          </p>
        </div>

        <div>
          <h3>Can I charge admission for my event?</h3>
          <p>
            Yes! Afarmer helps you promote your event, but you handle payments
            offline or through your preferred method.
          </p>
        </div>

        <div>
          <h3>What kinds of details should I include in my event listing?</h3>
          <p>
            Include the date, time, location, and a brief description of what
            attendees can expect. High-quality photos and notes about unique
            activities, like live music or kid-friendly options, make your
            listing more appealing.
          </p>
        </div>

        <div>
          <h3>What happens if I need to cancel my event?</h3>
          <p>
            If your event changes or is canceled, update or remove your listing
            to keep attendees informed.
          </p>
        </div>

        <div>
          <h3>Do I need to create an account to attend events?</h3>
          <p>
            No, you don’t need an account to browse events, but creating one
            lets you follow farms, save listings, and get notifications when new
            events are posted.
          </p>
        </div>

        <div>
          <h3>Can I use event listings to promote a recurring event?</h3>
          <p>
            Yes, you can list recurring events like weekly farmers markets or
            seasonal offerings. Either create separate listings for each date or
            mention the schedule in the description.
          </p>
        </div>

        <div>
          <h3>Can I sell farm products during my event?</h3>
          <p>
            Yes, many farms offer produce, honey, baked goods, and more during
            their events. Mention in your listing if items will be available for
            purchase.
          </p>
        </div>

        <div>
          <h3>What if I don’t own a farm but want to host an event?</h3>
          <p>
            Afarmer event listings aren’t limited to farms. If you’re organizing
            a farmers market, educational workshop, or another community-focused
            food event, you can create a listing to share it with local
            customers.
          </p>
        </div>

        <div>
          <h3>How much does it cost to create or attend an event listing?</h3>
          <p>
            Creating event listings is free on Afarmer. Costs for attending
            events are set by the organizer, and you can contact them directly
            for details.
          </p>
        </div>
      </FaqSection>
      <FooterContainer />
    </>
  );
};

export default Agritourism;
