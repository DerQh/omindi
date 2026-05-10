import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import { CartContext } from "../../context/CartContext";
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

const DetailCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 400px;
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

const ContentSection = styled.div`
  padding: 32px;
`;

const ProductName = styled.h2`
  margin: 0 0 16px;
  color: #2f5a2a;
  font-size: 2rem;
`;

const Price = styled.p`
  font-size: 1.8rem;
  color: #2f5a2a;
  font-weight: 700;
  margin: 0 0 24px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f0f7ee;
  border-radius: 12px;
`;

const InfoItem = styled.div`
  p {
    margin: 0 0 8px;
    color: #7b8f7f;
    font-size: 0.95rem;
  }

  span {
    display: block;
    color: #2f5a2a;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const DescriptionSection = styled.div`
  margin-bottom: 32px;

  h3 {
    color: #2f5a2a;
    margin: 0 0 12px;
    font-size: 1.3rem;
  }

  p {
    color: #44554c;
    line-height: 1.7;
    margin: 0;
  }
`;

const SellerSection = styled.div`
  background: #f0f7ee;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;

  h3 {
    color: #2f5a2a;
    margin: 0 0 16px;
    font-size: 1.2rem;
  }
`;

const SellerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    p {
      margin: 0;
      color: #2f5a2a;
      font-weight: 600;
    }

    span {
      font-size: 0.95rem;
      color: #7b8f7f;
    }
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CartButton = styled.button`
  background-color: #ffc107;
  color: #2f5a2a;
  border: none;
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e0a800;
  }
`;

const BuyButton = styled.button`
  background-color: #2f5a2a;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #245026;
    box-shadow: 0 4px 12px rgba(47, 90, 42, 0.3);
  }
`;

const InquireButton = styled.button`
  background-color: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d7e9ff;
  }
`;

// Sample listings data
const goods = [
  {
    id: 1,
    name: "Organic Cherry Tomatoes",
    price: "Kes 12 / kg",
    description:
      "Fresh locally grown cherry tomatoes, sweet and ready for market. These tomatoes are grown without any chemical pesticides and are perfect for salads, cooking, or canning. Harvested fresh daily and available year-round.",
    category: "Produce",
    location: "Alendu",
    inquiries: 3,
    favourites: 9,
    updated: "05/02/2026",
    image: "/tomatoes.jpg",
    seller: {
      name: "Kevin  Otieno",
      rating: 4.8,
      reviews: 24,
      image: "https://picsum.photos/200",
    },
    fullDescription:
      "We specialize in organic farming practices. Our cherry tomatoes are grown in rich, nutrient-dense soil without synthetic fertilizers. Each batch is carefully monitored and harvested at peak ripeness to ensure maximum flavor and nutrition.",
    availability: "Year-round",
    minOrder: "1 kg",
  },
  {
    id: 2,
    name: "Raw Honey Jar",
    price: "Kes 18",
    description:
      "Cold-pressed wildflower honey in a 500g glass jar. Pure, unfiltered, and unpasteurized to retain all natural enzymes and nutrients.",
    category: "Honey",
    location: "Nyamasaria",
    inquiries: 6,
    favourites: 12,
    updated: "04/30/2026",
    image: "/honey.jpg",
    seller: {
      name: "Sarah Kipchoge",
      rating: 4.9,
      reviews: 42,
      image: "https://picsum.photos/200",
    },
    fullDescription:
      "Our honey comes from beehives located in pristine wildflower fields. We practice sustainable beekeeping and never use antibiotics or chemicals. The honey is raw, unheated, and retains all its beneficial properties.",
    availability: "Available",
    minOrder: "1 jar",
  },
  {
    id: 3,
    name: "Free-Range Eggs",
    price: "Kes 5 / dozen",
    description:
      "Fresh free-range eggs from local farms, rich in flavor and nutrients.",
    category: "Dairy",
    location: "NanyNyamware",
    inquiries: 9,
    favourites: 18,
    updated: "05/01/2026",
    image: "/eggs.jpg",
    seller: {
      name: "Steven Odhiambo",
      rating: 4.7,
      reviews: 56,
      image: "https://picsum.photos/200",
    },
    fullDescription:
      "Our hens are raised on open pasture with access to natural grasses and insects. No cage confinement or artificial supplements. The eggs have deep orange yolks and superior taste due to the hens' natural diet.",
    availability: "Daily",
    minOrder: "1 dozen",
  },
];

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const listing = goods.find((item) => item.id === parseInt(id));

  const handleBack = () => {
    navigate(-1);
  };

  const handleBuy = () => {
    navigate("/buy-now", { state: { listing } });
  };

  const handleAddToCart = () => {
    addToCart(listing);
  };

  const handleInquire = () => {
    navigate("/inquire", { state: { listing } });
  };

  if (!listing) {
    return (
      <Container>
        <AppNavbar />
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Listing Not Found</Title>
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
          <Title>Product Details</Title>
        </Header>

        <DetailCard>
          <ImageSection>
            <img src={listing.image} alt={listing.name} />
          </ImageSection>

          <ContentSection>
            <ProductName>{listing.name}</ProductName>
            <Price>{listing.price}</Price>

            <InfoGrid>
              <InfoItem>
                <p>Category</p>
                <span>{listing.category}</span>
              </InfoItem>
              <InfoItem>
                <p>Location</p>
                <span>{listing.location}</span>
              </InfoItem>
              <InfoItem>
                <p>Availability</p>
                <span>{listing.availability}</span>
              </InfoItem>
              <InfoItem>
                <p>Minimum Order</p>
                <span>{listing.minOrder}</span>
              </InfoItem>
            </InfoGrid>

            <DescriptionSection>
              <h3>Description</h3>
              <p>{listing.fullDescription}</p>
            </DescriptionSection>

            <SellerSection>
              <h3>Seller Information</h3>
              <SellerInfo>
                <img src={listing.seller.image} alt={listing.seller.name} />
                <div>
                  <p>{listing.seller.name}</p>
                  <span>
                    ⭐ {listing.seller.rating} ({listing.seller.reviews}{" "}
                    reviews)
                  </span>
                </div>
              </SellerInfo>
            </SellerSection>

            <ActionButtons>
              <BuyButton onClick={handleBuy}>Buy Now</BuyButton>
              <CartButton onClick={handleAddToCart}>Add to Cart</CartButton>
              <InquireButton onClick={handleInquire}>
                Send Inquiry
              </InquireButton>
            </ActionButtons>
          </ContentSection>
        </DetailCard>
      </Container>
    </>
  );
};

export default ListingDetail;
