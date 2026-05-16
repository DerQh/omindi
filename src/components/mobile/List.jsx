import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListings } from "../../hooks/useListings";
import { formatSmartDate } from "../../hooks/dateFormat";
import LoadingComponent from "./Loading";

const List = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch  listings from subapase and replace the hardcoded goods with real data
  const { data, isLoading, error } = useListings();
  if (isLoading)
    return (
      <>
        <LoadingComponent />
      </>
    );

  if (error)
    return (
      <>
        <AppNavbar />
        <StateContainer>
          <StateCard>
            <ErrorText>Something went wrong loading listings.</ErrorText>
          </StateCard>
        </StateContainer>
      </>
    );

  // Filter listings based on search term, checking title, description, category and location for matches
  const filteredGoods = data?.filter((listingItem) => {
    const search = searchTerm.toLowerCase();

    return (
      listingItem.title?.toLowerCase().includes(search) ||
      listingItem.description?.toLowerCase().includes(search) ||
      listingItem.category?.toLowerCase().includes(search) ||
      listingItem.location?.toLowerCase().includes(search)
    );
  });

  const handleCardClick = (listingItem) => {
    navigate(`/listing/${listingItem.id}`, { state: { listing: listingItem } });
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <h1>List & Sell</h1>
          <Button to="/newlist">Add a New Listing</Button>
        </Header>
        <SearchContainer>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <ListingsGrid>
          {filteredGoods.map((listingItem) => (
            <ListingCard
              key={listingItem.id}
              onClick={() => handleCardClick(listingItem)}
            >
              <ImageWrapper>
                <img src={listingItem.image_url} alt={listingItem.name} />
              </ImageWrapper>
              <Content>
                <h2>{listingItem.title}</h2>
                <p>
                  Kes {listingItem.price}
                  {listingItem.unit ? ` / ${listingItem.unit}` : ""}
                </p>
                <p>{listingItem.description}</p>
                <p>
                  <strong>Category:</strong> {listingItem.category} •{" "}
                  <strong>Location:</strong> {listingItem.location}
                </p>
                <Meta>
                  <div className="stats">
                    <span>{listingItem.inquiries || 0} inquiries</span>
                    <span>{listingItem.favourites || 0} favourites</span>
                  </div>
                  <div className="updated">
                    Updated {formatSmartDate(listingItem.created_at)}
                  </div>
                </Meta>
              </Content>
            </ListingCard>
          ))}
        </ListingsGrid>
      </Container>
    </>
  );
};

export default List;

const Container = styled.div`
  padding: 20px 30px;
  text-align: center;
  min-height: 100vh;
  background: #f7fbff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  h1 {
    margin: 0;
    font-size: 2rem;
    color: #2f5a2a;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #ddd;
    min-width: 300px;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #2f5a2a;
      box-shadow: 0 0 4px rgba(47, 90, 42, 0.2);
    }
  }
`;

const Button = styled(Link)`
  background-color: #2f5a2a;
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 12px 22px;
  border-radius: 10px;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    background-color: #245026;
    transform: translateY(-1px);
  }
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 9px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageWrapper = styled.div`
  height: 220px;
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

const Content = styled.div`
  padding: 18px;

  h2 {
    margin: 0 0 8px;
    font-size: 1.4rem;
    color: #273a25;
  }

  p {
    margin: 8px 0;
    color: #44554c;
    line-height: 1.5;
  }
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  margin-top: 16px;
  align-items: center;

  .stats,
  .controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .stats span,
  .controls button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
    color: #536358;
  }

  .controls button {
    border: none;
    background: #e5f4ff;
    color: #2f5a2a;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
  }

  .updated {
    font-size: 0.88rem;
    color: #7b8f7f;
  }
`;

const StateContainer = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StateCard = styled.div`
  background: white;
  padding: 40px 60px;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  text-align: center;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #2f5a2a;
  font-weight: 600;
`;

const ErrorText = styled.p`
  font-size: 1.1rem;
  color: #b42318;
  font-weight: 600;
`;

// const goods_mock = [
//   {
//     id: 1,
//     title: "Organic Cherry Tomatoes",
//     price: "$12 / kg",
//     description:
//       "Fresh locally grown cherry tomatoes, sweet and ready for market.",
//     category: "Produce",
//     location: "Nairobi",
//     inquiries: 3,
//     favourites: 9,
//     updated: "05/02/2026",
//     image_url: "/tomatoes.jpg",
//   },
//   {
//     id: 2,
//     title: "Raw Honey Jar",
//     price: "$18",
//     description: "Cold-pressed wildflower honey in a 500g glass jar.",
//     category: "Honey",
//     location: "Kiambu",
//     inquiries: 6,
//     favourites: 12,
//     updated: "04/30/2026",
//     image_url: "/honey.jpg",
//   },
//   {
//     id: 3,
//     title: "Free-Range Eggs",
//     price: "$5 / dozen",
//     description:
//       "Fresh free-range eggs from local farms, rich in flavor and nutrients.",
//     category: "Dairy",
//     location: "Nanyuki",
//     inquiries: 9,
//     favourites: 18,
//     updated: "05/01/2026",
//     image_url: "/eggs.jpg",
//   },
// ];
