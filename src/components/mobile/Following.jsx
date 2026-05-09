import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #eef7ee;
  padding: 20px 24px 40px;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: #264a28;
  font-size: 2.4rem;
  flex: 1;
  text-align: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
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

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    color: #2f5a2a;
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    color: #4f5f4d;
    font-size: 0.95rem;
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(34, 79, 38, 0.08);
  overflow: hidden;
  min-height: 220px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardTop = styled.div`
  position: relative;
  height: 140px;
  background: #dceedf;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBody = styled.div`
  padding: 18px 18px 20px;

  h3 {
    margin: 0 0 10px;
    font-size: 1.2rem;
    color: #243a20;
  }

  p {
    margin: 0 0 10px;
    color: #556652;
    line-height: 1.5;
  }
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 999px;
    background: #eef7ee;
    color: #37532c;
    font-size: 0.9rem;
  }
`;

const Stars = styled.div`
  display: inline-flex;
  gap: 2px;
  color: #f0b33d;
  font-size: 0.95rem;
`;

const EventDetails = styled.div`
  display: grid;
  gap: 8px;
`;

const followData = {
  sellers: [
    {
      id: 1,
      name: "Amina's Farm",
      category: "Vegetables",
      location: "Nairobi",
      rating: 4.8,
      reviews: 42,
      image: "/amina.jpg",
    },
    {
      id: 2,
      name: "Maziwa Organics",
      category: "Dairy",
      location: "Kiambu",
      rating: 4.6,
      reviews: 30,
      image: "/maziwa.png",
    },
    {
      id: 3,
      name: "Honey Harvest",
      category: "Honey",
      location: "Nanyuki",
      rating: 4.9,
      reviews: 55,
      image: "/honeyfarm.jpg",
    },
  ],
  events: [
    {
      id: 1,
      title: "Local Farmers Market",
      date: "May 12, 2026",
      location: "Kasarani Grounds",
      description:
        "Browse fresh produce, meet followed sellers, and save favorite market finds.",
      image: "/market.jpg",
    },
    {
      id: 2,
      title: "Organic Crop Workshop",
      date: "May 20, 2026",
      location: "Nairobi Showground",
      description:
        "Discover new growing tips and join experts from the local farming community.",
      image: "/workshop.jpg",
    },
  ],
  favorites: [
    {
      id: 1,
      title: "Green Pepper Bundle",
      price: "$14 / kg",
      location: "Nairobi",
      rating: 4.7,
      reviews: 18,
      image: "/pepper.png",
    },
    {
      id: 2,
      title: "Wildflower Honey Jar",
      price: "$19",
      location: "Kiambu",
      rating: 4.9,
      reviews: 26,
      image: "/honeyjar.jpeg",
    },
  ],
};

const renderStars = (rating) => {
  const fullCount = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index}>{index < fullCount ? "★" : "☆"}</span>
  ));
};

const Following = () => {
  const navigate = useNavigate();

  const handleSellerClick = (id) => {
    navigate(`/follower/${id}`);
  };

  const handleFavoriteClick = (id) => {
    navigate(`/listing/${id}`);
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Section>
          <SectionHeader>
            <h2>Followed Sellers</h2>
            <p>
              You are following {followData.sellers.length} trusted sellers.
            </p>
          </SectionHeader>
          <CardsGrid>
            {followData.sellers.map((seller) => (
              <Card key={seller.id} onClick={() => handleSellerClick(seller.id)}>
                <CardTop>
                  <img src={seller.image} alt={seller.name} />
                </CardTop>
                <CardBody>
                  <h3>{seller.name}</h3>
                  <p>
                    {seller.category} • {seller.location}
                  </p>
                  <BadgeRow>
                    <span>
                      <Stars>{renderStars(seller.rating)}</Stars>
                      {seller.rating.toFixed(1)}
                    </span>
                    <span>{seller.reviews} reviews</span>
                  </BadgeRow>
                </CardBody>
              </Card>
            ))}
          </CardsGrid>
        </Section>

        <Section>
          <SectionHeader>
            <h2>Upcoming Events</h2>
            <p>Never miss the next community market or workshop.</p>
          </SectionHeader>
          <CardsGrid>
            {followData.events.map((event) => (
              <Card key={event.id}>
                <CardTop>
                  <img src={event.image} alt={event.title} />
                </CardTop>
                <CardBody>
                  <EventDetails>
                    <h3>{event.title}</h3>
                    <p>
                      {event.date} • {event.location}
                    </p>
                    <p>{event.description}</p>
                  </EventDetails>
                </CardBody>
              </Card>
            ))}
          </CardsGrid>
        </Section>

        <Section>
          <SectionHeader>
            <h2>Favourite Listings</h2>
            <p>Your saved products from trusted sellers.</p>
          </SectionHeader>
          <CardsGrid>
            {followData.favorites.map((item) => (
              <Card key={item.id} onClick={() => handleFavoriteClick(item.id)}>
                <CardTop>
                  <img src={item.image} alt={item.title} />
                </CardTop>
                <CardBody>
                  <h3>{item.title}</h3>
                  <p>
                    {item.price} • {item.location}
                  </p>
                  <BadgeRow>
                    <span>
                      <Stars>{renderStars(item.rating)}</Stars>
                      {item.rating.toFixed(1)}
                    </span>
                    <span>{item.reviews} reviews</span>
                  </BadgeRow>
                </CardBody>
              </Card>
            ))}
          </CardsGrid>
        </Section>
      </Container>
    </>
  );
};

export default Following;