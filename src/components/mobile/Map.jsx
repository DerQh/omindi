import { useState } from "react";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #5c9132 100%);
  color: white;
  padding: 20px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(47, 90, 42, 0.15);
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SearchContainer = styled.div`
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e8f5e8;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #d7e9ff;
  border-radius: 12px;
  font-size: 1rem;
  background: #f7fbff;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2f5a2a;
    box-shadow: 0 0 8px rgba(47, 90, 42, 0.2);
  }

  &::placeholder {
    color: #7b8f7f;
  }
`;

const SearchButton = styled.button`
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  background: #2f5a2a;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: #245026;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(47, 90, 42, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const MapWrapper = styled.div`
  flex: 1;
  position: relative;
  background: #f0f7ee;
`;

const MapContainer = styled.div`
  position: relative;
  height: 100%;
  /* width: 100%; */
  min-height: 400px;
  border: 13px solid #1e4d86;

  iframe {
    height: 100%;
    width: 100%;
    border: none;
    border-radius: 0;
    /* border: 13px solid #1e4d86; */
  }
`;

const IframeWrapper = styled.iframe`
  position: relative;
  height: 100%;
  /* width: 100%; */
  min-height: 400px;
  border: 13px solid #1e4d86;
  height: 100%;
  width: 100%;
  border: none;
  border-radius: 0;
`;

const FarmCard = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  /* width: 280px; */
  /* max-width: 100%; */
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    /* width: 100%; */
    margin: 16px;
    margin-top: -32px;
  }
`;

const FarmCardHeader = styled.div`
  background: #2f5a2a;
  color: white;
  padding: 16px 20px;
`;

const FarmCardTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 700;
`;

const FarmCardSubtitle = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
`;

const FarmCardContent = styled.div`
  padding: 16px 20px;
`;

const FarmInfo = styled.div`
  display: grid;
  gap: 12px;
`;

const FarmInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e8f5e8;

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    color: #7b8f7f;
    font-size: 0.9rem;
  }

  span:last-child {
    color: #2f5a2a;
    font-weight: 600;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #5c9132;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: #4a7329;
    transform: translateY(-1px);
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
`;

const QuickActionButton = styled.button`
  padding: 10px 12px;
  border: 2px solid #2f5a2a;
  border-radius: 8px;
  background: white;
  color: #2f5a2a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2f5a2a;
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;

  border: 4px solid #e8f5e8;
  border-top: 4px solid #2f5a2a;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export default function Map() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate search delay
      setTimeout(() => {
        setIsLoading(false);
        // In a real app, this would update the map with search results
        console.log("Searching for:", searchQuery);
      }, 1000);
      navigate("/list");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <AppNavbar />
      <Header>
        <Title>Farm Locations</Title>
        <Subtitle>Discover local farms and fresh produce near you</Subtitle>
      </Header>

      <SearchContainer>
        <SearchBar>
          <SearchInput
            type="text"
            placeholder="Search for farms, locations, or products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton onClick={handleSearch}>Search</SearchButton>
        </SearchBar>
      </SearchContainer>

      <ContentWrapper>
        <MapWrapper>
          <>
            <IframeWrapper
              title="Farm Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5028.815388190825!2d34.805867768719445!3d-0.15380842781345577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182abd001a9ece4d%3A0xa3711c9f9653759d!2sOmindi%20FarmHouse!5e1!3m2!1sen!2sbh!4v1774555786905!5m2!1sen!2sbh"
              loading="lazy"
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          </>

          <FarmCard>
            <FarmCardHeader>
              <FarmCardTitle>Omindi FarmHouse</FarmCardTitle>
              <FarmCardSubtitle>Organic Farm & Marketplace</FarmCardSubtitle>
            </FarmCardHeader>
            <FarmCardContent>
              <FarmInfo>
                <FarmInfoItem>
                  <span>Location</span>
                  <span>Kisumu, Kenya</span>
                </FarmInfoItem>
                <FarmInfoItem>
                  <span>Products</span>
                  <span>Vegetables, Fruits</span>
                </FarmInfoItem>
                <FarmInfoItem>
                  <span>Rating</span>
                  <span>⭐⭐⭐⭐⭐ (4.8)</span>
                </FarmInfoItem>
                <FarmInfoItem>
                  <span>Distance</span>
                  <span>2.3 km</span>
                </FarmInfoItem>
              </FarmInfo>

              <ActionButton onClick={() => navigate("/list")}>
                View Products
              </ActionButton>

              <QuickActions>
                <QuickActionButton onClick={() => navigate("/list")}>
                  Shop Now
                </QuickActionButton>
                <QuickActionButton onClick={() => navigate("/inquire")}>
                  Inquire
                </QuickActionButton>
              </QuickActions>
            </FarmCardContent>
          </FarmCard>
        </MapWrapper>
      </ContentWrapper>
    </Container>
  );
}
