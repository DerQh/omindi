import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`;

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
  animation: ${fadeIn} 0.4s ease;
`;

const Content = styled.div`
  padding: 32px;
`;

const SuccessBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 20px;
  background: linear-gradient(135deg, #eef9f0, #d7f0db);
  border-radius: 16px;
  margin-bottom: 32px;
  text-align: center;
`;

const CheckCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #2f5a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  animation: ${popIn} 0.5s ease forwards;
`;

const SuccessTitle = styled.h2`
  margin: 0;
  color: #2f5a2a;
  font-size: 1.6rem;
`;

const SuccessSub = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 1rem;
`;

const OrderId = styled.div`
  display: inline-block;
  background: #f0f7ee;
  border: 1px solid #cde5cf;
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 6px 16px;
  border-radius: 999px;
  letter-spacing: 0.04em;
`;

const SectionTitle = styled.h3`
  color: #2f5a2a;
  margin: 0 0 16px;
  font-size: 1.1rem;
`;

const SummaryRow = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 26px;
`;

const SummaryBlock = styled.div`
  padding: 20px;
  background: #f0f7ee;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryLabel = styled.span`
  color: #7b8f7f;
  font-size: 1rem;
`;

const SummaryValue = styled.span`
  color: #2f5a2a;
  font-weight: 700;
  font-size: 1.1rem;
`;

const TotalBlock = styled(SummaryBlock)`
  background: #2f5a2a;
  ${SummaryLabel} {
    color: #a8d5ac;
  }
  ${SummaryValue} {
    color: white;
    font-size: 1.3rem;
  }
`;

const ItemList = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
`;

const CheckoutItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 16px;
  align-items: start;
  padding: 18px;
  border: 1px solid #ebf2eb;
  border-radius: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  background: #d7e9ff;
`;

const ItemDetails = styled.div`
  display: grid;
  gap: 6px;
`;

const ItemName = styled.h2`
  margin: 0;
  color: #2f5a2a;
  font-size: 1.1rem;
`;

const ItemMeta = styled.p`
  margin: 0;
  color: #7b8f7f;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const ItemTotal = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 700;
`;

const DeliveryBlock = styled.div`
  padding: 20px;
  background: #f7fbff;
  border: 1px solid #d7e9ff;
  border-radius: 16px;
  margin-bottom: 28px;
  display: grid;
  gap: 10px;
`;

const DeliveryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeliveryLabel = styled.span`
  color: #7b8f7f;
  font-size: 0.95rem;
`;

const DeliveryValue = styled.span`
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.95rem;
`;

const PrimaryButton = styled.button`
  width: 100%;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #245026;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  background: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 18px 24px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #d7e9ff;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #ebf2eb;
  margin: 28px 0;
`;

const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { cartItems, totalCost, paymentMethod, address } = state || {};

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  const totalCount = cartItems?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );
  const estimatedDays = paymentMethod === "cash" ? "2–4" : "1–3";

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <Title>Order Confirmation</Title>
        </Header>

        <Card>
          <Content>
            {/* Success banner */}
            <SuccessBanner>
              <CheckCircle>✓</CheckCircle>
              <SuccessTitle>Order Placed Successfully!</SuccessTitle>
              <SuccessSub>
                Thank you for your purchase. The seller will contact you
                shortly.
              </SuccessSub>
              <OrderId>Order ID: {orderId}</OrderId>
            </SuccessBanner>

            {/* Order summary */}
            <SectionTitle>Order Summary</SectionTitle>
            <SummaryRow>
              <SummaryBlock>
                <SummaryLabel>Items purchased</SummaryLabel>
                <SummaryValue>{totalCount}</SummaryValue>
              </SummaryBlock>
              <SummaryBlock>
                <SummaryLabel>Products</SummaryLabel>
                <SummaryValue>{cartItems?.length}</SummaryValue>
              </SummaryBlock>
              <TotalBlock>
                <SummaryLabel>Total Paid</SummaryLabel>
                <SummaryValue>Kes {totalCost?.toLocaleString()}</SummaryValue>
              </TotalBlock>
            </SummaryRow>

            {/* Items */}
            <SectionTitle>Items</SectionTitle>
            <ItemList>
              {cartItems?.map((item) => (
                <CheckoutItem key={item.id}>
                  <ItemImage
                    src={item.listings?.image_url}
                    alt={item.listings?.title}
                  />
                  <ItemDetails>
                    <ItemName>{item.listings?.title}</ItemName>
                    <ItemMeta>Kes {item.listings?.price} per unit</ItemMeta>
                    <ItemMeta>Quantity: {item.quantity}</ItemMeta>
                    <ItemTotal>
                      Subtotal: Kes{" "}
                      {(item.listings?.price * item.quantity).toLocaleString()}
                    </ItemTotal>
                  </ItemDetails>
                </CheckoutItem>
              ))}
            </ItemList>

            <Divider />

            {/* Delivery info */}
            <SectionTitle>Delivery Details</SectionTitle>
            <DeliveryBlock>
              <DeliveryRow>
                <DeliveryLabel>Payment Method</DeliveryLabel>
                <DeliveryValue>
                  {paymentLabels[paymentMethod] ?? paymentMethod}
                </DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Delivery Address</DeliveryLabel>
                <DeliveryValue>{address}</DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Estimated Delivery</DeliveryLabel>
                <DeliveryValue>{estimatedDays} business days</DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Next Steps</DeliveryLabel>
                <DeliveryValue>
                  Seller will contact you to confirm
                </DeliveryValue>
              </DeliveryRow>
            </DeliveryBlock>

            <PrimaryButton onClick={() => navigate("/list")}>
              Continue Shopping
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate("/mobile")}>
              Go Home
            </SecondaryButton>
          </Content>
        </Card>
      </Container>
    </>
  );
};

export default OrderConfirmation;
