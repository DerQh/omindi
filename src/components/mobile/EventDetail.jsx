import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #f4faf4;
`;

const HeroSection = styled.div`
  position: relative;
  height: 380px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.65);
  }
`;

const TopBar = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #244b22;
  }
`;
const HeroContent = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1000px;
  width: 100%;
  padding: 0 24px;
  color: white;
`;

const EventTitle = styled.h1`
  margin: 0 0 12px;
  font-size: 2.6rem;
  font-weight: 700;
`;

const DateBadge = styled.div`
  display: inline-block;
  padding: 8px 14px;
  background: #ffc107;
  color: #264a28;
  border-radius: 999px;
  font-weight: 600;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: -60px auto 40px;
  padding: 0 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 15px 35px rgba(30, 60, 30, 0.08);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const InfoBox = styled.div`
  background: #eef7ee;
  padding: 18px;
  border-radius: 14px;

  h4 {
    margin: 0 0 6px;
    font-size: 0.95rem;
    color: #6b806b;
  }

  p {
    margin: 0;
    font-weight: 600;
    color: #2f5a2a;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;

  h2 {
    margin: 0 0 12px;
    color: #264a28;
  }

  p {
    margin: 0;
    line-height: 1.7;
    color: #44554c;
  }
`;

const OrganizerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #eef7ee;
  padding: 20px;
  border-radius: 14px;

  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    h4 {
      margin: 0;
      color: #2f5a2a;
    }

    p {
      margin: 4px 0 0;
      font-size: 0.9rem;
      color: #6b806b;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #244b22;
  }
`;

const SecondaryButton = styled.button`
  background: #ffc107;
  color: #2f5a2a;
  border: none;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e0a800;
  }
`;

// const BackButton = styled.button`
//   margin: 24px;
//   background: transparent;
//   border: none;
//   color: #2f5a2a;
//   font-size: 1rem;
//   cursor: pointer;
// `;

// ✅ Sample Event Data (Later replace with database)
const events = [
  {
    id: 1,
    title: "Local Farmers Market",
    date: "May 12, 2026",
    time: "8:00 AM - 4:00 PM",
    location: "Kasarani Grounds, Nairobi",
    image: "/market.jpg",
    description:
      "Join local farmers and food producers for a vibrant community market experience. Discover fresh organic produce, dairy, honey, baked goods, and handmade agricultural products.",
    organizer: {
      name: "Kenya Farmers Cooperative",
      role: "Community Agriculture Network",
      image: "https://picsum.photos/200",
    },
  },
];

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = events.find((e) => e.id === parseInt(id));

  if (!event) {
    return (
      <>
        <AppNavbar />
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
        <h2 style={{ textAlign: "center" }}>Event Not Found</h2>
      </>
    );
  }

  return (
    <>
      <AppNavbar />

      <Container>
        <TopBar>
          <BackButton onClick={() => navigate(-1)}>← Back to Events</BackButton>
        </TopBar>
        <HeroSection>
          <img src={event.image} alt={event.title} />
          <HeroContent>
            <EventTitle>{event.title}</EventTitle>
            <DateBadge>{event.date}</DateBadge>
          </HeroContent>
        </HeroSection>

        <ContentWrapper>
          <Card>
            <InfoGrid>
              <InfoBox>
                <h4>Date</h4>
                <p>{event.date}</p>
              </InfoBox>
              <InfoBox>
                <h4>Time</h4>
                <p>{event.time}</p>
              </InfoBox>
              <InfoBox>
                <h4>Location</h4>
                <p>{event.location}</p>
              </InfoBox>
            </InfoGrid>

            <Section>
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </Section>

            <Section>
              <h2>Organizer</h2>
              <OrganizerCard>
                <img src={event.organizer.image} alt={event.organizer.name} />
                <div>
                  <h4>{event.organizer.name}</h4>
                  <p>{event.organizer.role}</p>
                </div>
              </OrganizerCard>
            </Section>

            <ButtonRow>
              <PrimaryButton>Register Now</PrimaryButton>
              <SecondaryButton>Add to Calendar</SecondaryButton>
            </ButtonRow>
          </Card>
        </ContentWrapper>
      </Container>
    </>
  );
};

export default EventDetail;
