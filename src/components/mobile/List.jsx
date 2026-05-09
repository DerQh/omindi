import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

const goods = [
  {
    id: 1,
    name: "Organic Cherry Tomatoes",
    price: "$12 / kg",
    description:
      "Fresh locally grown cherry tomatoes, sweet and ready for market.",
    category: "Produce",
    location: "Nairobi",
    inquiries: 3,
    favourites: 9,
    updated: "05/02/2026",
    image: "/tomatoes.jpg",
  },
  {
    id: 2,
    name: "Raw Honey Jar",
    price: "$18",
    description: "Cold-pressed wildflower honey in a 500g glass jar.",
    category: "Honey",
    location: "Kiambu",
    inquiries: 6,
    favourites: 12,
    updated: "04/30/2026",
    image: "/honey.jpg",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    price: "$5 / dozen",
    description:
      "Fresh free-range eggs from local farms, rich in flavor and nutrients.",
    category: "Dairy",
    location: "Nanyuki",
    inquiries: 9,
    favourites: 18,
    updated: "05/01/2026",
    image: "/eggs.jpg",
  },
];

const List = () => {
  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <h1>List & Sell</h1>
          <Button to="/newlist">Add a New Listing</Button>
        </Header>
        <ListingsGrid>
          {goods.map((item) => (
            <ListingCard key={item.id}>
              <ImageWrapper>
                <img src={item.image} alt={item.name} />
              </ImageWrapper>
              <Content>
                <h2>{item.name}</h2>
                <p>{item.price}</p>
                <p>{item.description}</p>
                <p>
                  <strong>Category:</strong> {item.category} •{" "}
                  <strong>Location:</strong> {item.location}
                </p>
                <Meta>
                  <div className="stats">
                    <span>{item.inquiries} inquiries</span>
                    <span>{item.favourites} favourites</span>
                  </div>
                  <div className="updated">Updated {item.updated}</div>
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
