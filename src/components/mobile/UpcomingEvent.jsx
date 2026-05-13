import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #eef7ee;
  padding: 20px 24px 40px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const BackButton = styled.button`
  background: #264a28;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 16px;

  &:hover {
    background: #1e3a20;
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #264a28;
  font-size: 2rem;
  flex: 1;
  text-align: center;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardTop = styled.div`
  height: 160px;
  background: #dceedf;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBody = styled.div`
  padding: 18px;

  h3 {
    margin: 0 0 8px;
    color: #243a20;
  }

  p {
    margin: 0 0 6px;
    color: #556652;
  }
`;

// ✅ Events Data
const eventsData = [
  {
    id: 1,
    title: "Local Farmers Market",
    date: "May 12, 2026",
    location: "Kasarani Grounds",
    description:
      "Browse fresh produce, meet trusted sellers, and enjoy live cooking demos.",
    image: "/market.jpg",
  },
  {
    id: 2,
    title: "Organic Crop Workshop",
    date: "May 20, 2026",
    location: "Nairobi Showground",
    description:
      "Learn modern organic farming techniques from expert agronomists.",
    image: "/workshop.jpg",
  },
  {
    id: 3,
    title: "Agri-Tech Expo 2026",
    date: "June 5, 2026",
    location: "KICC Nairobi",
    description:
      "Explore the latest innovations in agricultural technology.",
    image: "/expo.jpg",
  },
];

const UpcomingEvents = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEventClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <PageTitle>Upcoming Events</PageTitle>
        </Header>

        <CardsGrid>
          {eventsData.map((event) => (
            <Card key={event.id} onClick={() => handleEventClick(event.id)}>
              <CardTop>
                <img src={event.image} alt={event.title} />
              </CardTop>
              <CardBody>
                <h3>{event.title}</h3>
                <p>
                  {event.date} • {event.location}
                </p>
                <p>{event.description}</p>
              </CardBody>
            </Card>
          ))}
        </CardsGrid>
      </Container>
    </>
  );
};

export default UpcomingEvents;