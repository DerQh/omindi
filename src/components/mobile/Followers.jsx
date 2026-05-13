import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #f4faf4;
  padding: 20px 24px 40px;
`;

const Header = styled.div`
  max-width: 1000px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
  color: #264a28;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #244b22;
  }
`;

const FollowersList = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 18px;
`;

const FollowerCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(30, 60, 30, 0.06);
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  h3 {
    margin: 0;
    color: #2f5a2a;
  }

  p {
    margin: 4px 0;
    color: #6b806b;
    font-size: 0.9rem;
  }
`;

const Rating = styled.div`
  color: #f0b33d;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const UnfollowButton = styled.button`
  background: #ffc107;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #2f5a2a;

  &:hover {
    background: #e0a800;
  }
`;

const BlockButton = styled.button`
  background: #e53935;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: white;

  &:hover {
    background: #c62828;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  margin-top: 60px;
  color: #6b806b;
`;

const initialFollowers = [
  {
    id: 1,
    name: "Amina's Farm",
    category: "Vegetables",
    location: "Nairobi",
    rating: 4.8,
    image: "/amina.jpg",
  },
  {
    id: 2,
    name: "Maziwa Organics",
    category: "Dairy",
    location: "Kiambu",
    rating: 4.6,
    image: "/maziwa.png",
  },
  {
    id: 3,
    name: "Honey Harvest",
    category: "Honey",
    location: "Nanyuki",
    rating: 4.9,
    image: "/honeyfarm.jpg",
  },
];

const renderStars = (rating) => {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => (i < rounded ? "★" : "☆")).join(
    " ",
  );
};

const Followers = () => {
  const [followers, setFollowers] = useState(initialFollowers);
  const navigate = useNavigate();

  const handleUnfollow = (id) => {
    setFollowers((prev) => prev.filter((f) => f.id !== id));
  };

  const handleBlock = (id) => {
    const confirmBlock = window.confirm(
      "Are you sure you want to block this follower?",
    );

    if (confirmBlock) {
      setFollowers((prev) => prev.filter((f) => f.id !== id));
    }
  };

  return (
    <>
      <AppNavbar />

      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>← Back</BackButton>
          <Title>My Followers</Title>
        </Header>

        {followers.length === 0 ? (
          <EmptyState>
            <h3>No followers found</h3>
            <p>You currently have no followers.</p>
          </EmptyState>
        ) : (
          <FollowersList>
            {followers.map((follower) => (
              <FollowerCard key={follower.id}>
                <ProfileSection
                  onClick={() => navigate(`/follower/${follower.id}`)}
                >
                  <img src={follower.image} alt={follower.name} />
                  <Info>
                    <h3>{follower.name}</h3>
                    <p>
                      {follower.category} • {follower.location}
                    </p>
                    <Rating>
                      {renderStars(follower.rating)} ({follower.rating})
                    </Rating>
                  </Info>
                </ProfileSection>

                <ActionButtons>
                  <UnfollowButton onClick={() => handleUnfollow(follower.id)}>
                    Unfollow
                  </UnfollowButton>
                  <BlockButton onClick={() => handleBlock(follower.id)}>
                    Block
                  </BlockButton>
                </ActionButtons>
              </FollowerCard>
            ))}
          </FollowersList>
        )}
      </Container>
    </>
  );
};

export default Followers;
