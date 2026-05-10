import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const Card = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
`;

const Content = styled.div`
  padding: 32px;
`;

const ProductName = styled.h2`
  margin: 0 0 12px;
  color: #2f5a2a;
  font-size: 2rem;
`;

const SectionLabel = styled.p`
  margin: 0 0 8px;
  color: #7b8f7f;
  font-size: 0.95rem;
`;

const SectionText = styled.p`
  margin: 0 0 24px;
  color: #2f5a2a;
  font-size: 1.1rem;
  font-weight: 600;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 18px;
  margin-bottom: 30px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

const SummaryItem = styled.div`
  background: #f0f7ee;
  padding: 18px;
  border-radius: 12px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    display: block;
    color: #2f5a2a;
    font-size: 1.1rem;
    font-weight: 700;
  }
`;

const QuantityRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const QuantityInput = styled.input`
  width: 120px;
  padding: 14px 16px;
  border: 2px solid #d7e9ff;
  border-radius: 12px;
  font-size: 1rem;
  color: #2f5a2a;
  background: #f7fbff;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }
`;

const ButtonRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
`;

const ConfirmButton = styled.button`
  background-color: #2f5a2a;
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #245026;
    box-shadow: 0 4px 12px rgba(47, 90, 42, 0.3);
  }
`;

const CancelButton = styled.button`
  background-color: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d7e9ff;
  }
`;

const Message = styled.div`
  background: #eef9f0;
  border: 1px solid #cde5cf;
  border-radius: 14px;
  padding: 22px;
  margin-top: 24px;
  color: #2f5a2a;
  font-size: 1rem;
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 240px;
  border-radius: 18px;
  overflow: hidden;
  background: #d7e9ff;
  display: grid;
  place-items: center;
  margin-bottom: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BuyNow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const listing = location.state?.listing;
  const [quantity, setQuantity] = useState(() => {
    if (!listing) return 1;
    const match = listing.minOrder?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const handleConfirm = () => {
    addToCart(listing, quantity);
    navigate("/checkout");
  };

  const handleContinue = () => {
    navigate("/mobile");
  };

  if (!listing) {
    return (
      <Container>
        <AppNavbar />
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Order unavailable</Title>
        </Header>
        <Card>
          <Content>
            <SectionText>
              No product details were found for checkout. Please go back and
              select a listing again.
            </SectionText>
            <CancelButton onClick={handleContinue}>
              Return to Marketplace
            </CancelButton>
          </Content>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={handleBack}>←</BackButton>
          <Title>Buy Now</Title>
        </Header>

        <Card>
          <Content>
            <ImagePreview>
              <img src={listing.image} alt={listing.name} />
            </ImagePreview>

            <ProductName>{listing.name}</ProductName>
            <SectionLabel>Unit Price</SectionLabel>
            <SectionText>{listing.price}</SectionText>

            <SummaryGrid>
              <SummaryItem>
                <p>Category</p>
                <span>{listing.category}</span>
              </SummaryItem>
              <SummaryItem>
                <p>Seller</p>
                <span>{listing.seller.name}</span>
              </SummaryItem>
              <SummaryItem>
                <p>Location</p>
                <span>{listing.location}</span>
              </SummaryItem>
              <SummaryItem>
                <p>Minimum order</p>
                <span>{listing.minOrder}</span>
              </SummaryItem>
            </SummaryGrid>

            <QuantityRow>
              <div>
                <SectionLabel>Quantity</SectionLabel>
                <QuantityInput
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              <div>
                <SectionLabel>Total estimate</SectionLabel>
                <SectionText>{listing.price}</SectionText>
              </div>
            </QuantityRow>

            <ButtonRow>
              <ConfirmButton onClick={handleConfirm}>
                Add to Cart & Checkout
              </ConfirmButton>
              <CancelButton onClick={handleBack}>Edit Selection</CancelButton>
            </ButtonRow>
          </Content>
        </Card>
      </Container>
    </>
  );
};

export default BuyNow;
