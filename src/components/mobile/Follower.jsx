import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding: 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  &:hover {
    background: #245026;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
`;

const ProfileCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
  margin-bottom: 32px;
`;

const ProfileHeader = styled.div`
  background: #f0f7ee;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
  flex: 1;

  h2 {
    margin: 0 0 8px;
    color: #2f5a2a;
    font-size: 2rem;
  }

  p {
    margin: 0 0 12px;
    color: #44554c;
    font-size: 1.1rem;
  }
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  .rating {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.1rem;
    color: #2f5a2a;
    font-weight: 600;
  }

  .stars {
    color: #f0b33d;
  }

  .reviews {
    color: #7b8f7f;
    font-size: 0.95rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 0 32px 32px;
`;

const StatItem = styled.div`
  text-align: center;

  .number {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: #2f5a2a;
  }

  .label {
    font-size: 0.95rem;
    color: #7b8f7f;
    margin-top: 4px;
  }
`;

const ListingsSection = styled.div`
  max-width: 900px;
  margin: 0 auto;

  h3 {
    color: #2f5a2a;
    font-size: 1.5rem;
    margin-bottom: 24px;
    text-align: center;
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 9px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ListingImage = styled.div`
  height: 180px;
  background: #d7e9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ListingContent = styled.div`
  padding: 18px;

  h4 {
    margin: 0 0 8px;
    font-size: 1.2rem;
    color: #273a25;
  }

  p {
    margin: 0 0 8px;
    color: #44554c;
  }

  .price {
    font-weight: 600;
    color: #2f5a2a;
  }
`;

const FollowButton = styled.button`
  margin-top: 12px;
  padding: 10px 20px;
  background: ${(props) => (props.following ? "#d9e6d5" : "#2f5a2a")};
  color: ${(props) => (props.following ? "#2f5a2a" : "white")};
  border: 2px solid #2f5a2a;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

// Sample sellers data (matching Following.jsx)
const sellers = [
  {
    id: 1,
    name: "Amina's Farm",
    category: "Vegetables",
    location: "Nairobi",
    rating: 4.8,
    reviews: 42,
    image: "/amina.jpg",
    description:
      "Specializing in organic vegetables grown with sustainable practices. We focus on quality and freshness.",
    followers: 156,
    listings: 24,
    joined: "January 2024",
    products: [
      {
        id: 1,
        name: "Organic Tomatoes",
        price: "$12 / kg",
        image: "/tomatoes.jpg",
      },
      {
        id: 2,
        name: "Fresh Lettuce",
        price: "$8 / bunch",
        image: "/kales.jpg",
      },
      {
        id: 3,
        name: "Bell Peppers",
        price: "$15 / kg",
        image: "/pepper.png",
      },
    ],
  },
  {
    id: 2,
    name: "Maziwa Organics",
    category: "Dairy",
    location: "Kiambu",
    rating: 4.6,
    reviews: 30,
    image: "/maziwa.png",
    description:
      "Providing fresh, organic dairy products from grass-fed cows. Committed to animal welfare and quality.",
    followers: 89,
    listings: 12,
    joined: "March 2024",
    products: [
      {
        id: 4,
        name: "Organic Milk",
        price: "$6 / liter",
        image: "https://picsum.photos/200",
      },
      {
        id: 5,
        name: "Free-Range Eggs",
        price: "$5 / dozen",
        image: "/eggs.jpg",
      },
    ],
  },
  {
    id: 3,
    name: "Honey Harvest",
    category: "Honey",
    location: "Nanyuki",
    rating: 4.9,
    reviews: 55,
    image: "/honeyfarm.jpg",
    description:
      "Producing pure, raw honey from local beehives. Sustainable beekeeping practices for the best quality.",
    followers: 203,
    listings: 8,
    joined: "December 2023",
    products: [
      {
        id: 6,
        name: "Wildflower Honey",
        price: "$18 / jar",
        image: "/honey.jpg",
      },
    ],
  },
];

const renderStars = (rating) => {
  const fullCount = Math.round(rating);
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index}>{index < fullCount ? "★" : "☆"}</span>
  ));
};

const Follower = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the seller based on the ID from the URL
  const seller = sellers.find((s) => s.id === parseInt(id));
  // State to manage follow status and followers count
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(
    seller ? seller.followers : 0,
  );

  const handleBack = () => {
    navigate(-1);
  };

  // Toggle follow status and update followers count
  const handleFollowToggle = () => {
    if (!isFollowing) {
      setFollowersCount((prev) => prev + 1);
    } else {
      setFollowersCount((prev) => prev - 1);
    }
    setIsFollowing(!isFollowing);
  };

  const handleListingClick = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  if (!seller) {
    return (
      <Container>
        <AppNavbar />
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Seller Not Found</Title>
        </Header>
      </Container>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Seller Profile</Title>
        </Header>

        <ProfileCard>
          <ProfileHeader>
            <ProfileImage src={seller.image} alt={seller.name} />
            <ProfileInfo>
              <h2>
                {seller.name}
                <span></span>
              </h2>
              <p>
                {seller.category} • {seller.location}
              </p>
              <p>{seller.description}</p>
              <RatingSection>
                <div className="rating">
                  <span className="stars">{renderStars(seller.rating)}</span>
                  {seller.rating.toFixed(1)}
                </div>
                <span className="reviews">({seller.reviews} reviews)</span>
              </RatingSection>
            </ProfileInfo>
          </ProfileHeader>

          <StatsGrid>
            <StatItem>
              <span onClick={() => navigate("/followers")} className="number">
                {followersCount}
              </span>
              <span className="label">Followers</span>
            </StatItem>
            <StatItem>
              <span className="number">{seller.listings}</span>
              <span className="label">Listings</span>
            </StatItem>
            <StatItem>
              <span className="number">{seller.joined}</span>
              <span className="label">Joined</span>
            </StatItem>
            <FollowButton following={isFollowing} onClick={handleFollowToggle}>
              {isFollowing ? "Following" : "Follow"}
            </FollowButton>
          </StatsGrid>
        </ProfileCard>

        <ListingsSection>
          <h3>Products from {seller.name}</h3>
          <ListingsGrid>
            {seller.products.map((product) => (
              <ListingCard
                key={product.id}
                onClick={() => handleListingClick(product.id)}
              >
                <ListingImage>
                  <img src={product.image} alt={product.name} />
                </ListingImage>
                <ListingContent>
                  <h4>{product.name}</h4>
                  <p className="price">{product.price}</p>
                </ListingContent>
              </ListingCard>
            ))}
          </ListingsGrid>
        </ListingsSection>
      </Container>
    </>
  );
};

export default Follower;
