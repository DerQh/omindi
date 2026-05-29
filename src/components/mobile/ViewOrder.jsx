import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useOrder, useOrderId } from "../../hooks/useOrders";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const statusColors = {
  pending: { bg: "#fff8e5", color: "#b07d00" },
  confirmed: { bg: "#eef9f0", color: "#2f5a2a" },
  delivering: { bg: "#e5f4ff", color: "#1a5a8a" },
  delivered: { bg: "#eef9f0", color: "#2f5a2a" },
  cancelled: { bg: "#fdf0f0", color: "#a32d2d" },
};

const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

// --- Styled components ---
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
  flex-shrink: 0;
  &:hover {
    background: #245026;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
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

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
`;

const OrderIdBlock = styled.div``;

const OrderIdLabel = styled.p`
  margin: 0 0 4px;
  font-size: 0.8rem;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const OrderIdValue = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #2f5a2a;
  font-family: monospace;
`;

const OrderDate = styled.p`
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #7b8f7f;
`;

const StatusBadge = styled.span`
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  background: ${({ $status }) => statusColors[$status]?.bg ?? "#f0f7ee"};
  color: ${({ $status }) => statusColors[$status]?.color ?? "#2f5a2a"};
`;

const SectionTitle = styled.h3`
  color: #2f5a2a;
  margin: 0 0 14px;
  font-size: 1rem;
`;

const Divider = styled.div`
  height: 1px;
  background: #ebf2eb;
  margin: 24px 0;
`;

const ItemList = styled.div`
  display: grid;
  gap: 14px;
  margin-bottom: 4px;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid #ebf2eb;
  border-radius: 14px;

  @media (max-width: 500px) {
    grid-template-columns: 64px 1fr;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  background: #d7e9ff;
`;

const ItemInfo = styled.div`
  display: grid;
  gap: 4px;
`;

const ItemName = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ItemMeta = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.85rem;
`;

const ItemSubtotal = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.95rem;
  text-align: right;
  white-space: nowrap;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
`;

const SummaryBlock = styled.div`
  padding: 16px 20px;
  background: #f0f7ee;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryLabel = styled.span`
  color: #7b8f7f;
  font-size: 0.95rem;
`;

const SummaryValue = styled.span`
  color: #2f5a2a;
  font-weight: 700;
  font-size: 1rem;
`;

const TotalBlock = styled(SummaryBlock)`
  background: #2f5a2a;
  ${SummaryLabel} {
    color: #a8d5ac;
  }
  ${SummaryValue} {
    color: white;
    font-size: 1.2rem;
  }
`;

const StepsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 8px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const StepDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $done }) => ($done ? "#2f5a2a" : "#d7e9d7")};
  color: ${({ $done }) => ($done ? "white" : "#aac4aa")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  z-index: 1;
`;

const StepLine = styled.div`
  flex: 1;
  height: 3px;
  background: ${({ $done }) => ($done ? "#2f5a2a" : "#d7e9d7")};
  margin: 0 -2px;
  margin-top: -28px;
  position: relative;
  z-index: 0;
`;

const StepLabel = styled.p`
  margin: 6px 0 0;
  font-size: 0.72rem;
  color: ${({ $done }) => ($done ? "#2f5a2a" : "#aac4aa")};
  font-weight: ${({ $done }) => ($done ? "600" : "400")};
  text-align: center;
`;

const PrimaryButton = styled.button`
  width: 100%;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #245026;
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  background: transparent;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.2s;
  &:hover {
    background: #eef9f0;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7b8f7f;
  font-size: 1rem;
`;

const ErrorState = styled(LoadingState)`
  color: #a32d2d;
`;

// --- Status steps
const STATUS_STEPS = ["pending", "confirmed", "delivering", "delivered"];

const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// --- Component
const ViewOrder = () => {
  const { order_id } = useParams();

  let order_id_Test = "02ff8fde-fba0-4d9c-b398-53d5f757cdc3";
  const navigate = useNavigate();
  const { data: order, isLoading, isError } = useOrderId(order_id_Test);

  const stepIndex = getStepIndex(order?.status);

  //   console.log(order);

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <Title>Order Details</Title>
        </Header>

        <Card>
          <Content>
            {isLoading && <LoadingState>Loading order...</LoadingState>}
            {isError && (
              <ErrorState>Could not load order. Please try again.</ErrorState>
            )}

            {order && (
              <>
                {/* Order ID + Status */}
                <OrderHeader>
                  <OrderIdBlock>
                    <OrderIdLabel>Order ID</OrderIdLabel>
                    <OrderIdValue>
                      {order?.id?.slice(0, 8).toUpperCase()}
                    </OrderIdValue>
                    <OrderDate>
                      Placed on {formatDate(order.created_at)}
                    </OrderDate>
                  </OrderIdBlock>
                  <StatusBadge $status={order?.status}>
                    {order?.status}
                  </StatusBadge>
                </OrderHeader>

                {/* Progress tracker */}
                {order?.status !== "cancelled" && (
                  <>
                    <SectionTitle>Order Progress</SectionTitle>
                    <StepsRow>
                      {STATUS_STEPS?.map((step, i) => (
                        <>
                          <Step key={step}>
                            <StepDot $done={i <= stepIndex}>
                              {i < stepIndex ? "✓" : i + 1}
                            </StepDot>
                            <StepLabel $done={i <= stepIndex}>
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </StepLabel>
                          </Step>
                          {i < STATUS_STEPS.length - 1 && (
                            <StepLine key={`line-${i}`} $done={i < stepIndex} />
                          )}
                        </>
                      ))}
                    </StepsRow>
                    <Divider />
                  </>
                )}

                {/* Items */}
                <SectionTitle>Items Ordered</SectionTitle>
                <ItemList>
                  {order?.order_items?.map((item) => (
                    <OrderItem key={item.id}>
                      <ItemImage
                        src={item.listings?.image_url}
                        alt={item.listings?.title}
                      />
                      <ItemInfo>
                        <ItemName>{item.listings?.title}</ItemName>
                        <ItemMeta>
                          Kes {item.price_at_purchase} per{" "}
                          {item.listings?.unit || "unit"}
                        </ItemMeta>
                        <ItemMeta>Qty: {item.quantity}</ItemMeta>
                      </ItemInfo>
                      <ItemSubtotal>
                        Kes{" "}
                        {(
                          item.price_at_purchase * item.quantity
                        ).toLocaleString()}
                      </ItemSubtotal>
                    </OrderItem>
                  ))}
                </ItemList>

                <Divider />

                {/* Summary */}
                <SectionTitle>Payment Summary</SectionTitle>
                <SummaryGrid>
                  <SummaryBlock>
                    <SummaryLabel>Payment Method</SummaryLabel>
                    <SummaryValue>
                      {paymentLabels[order.payment_method] ??
                        order.payment_method}
                    </SummaryValue>
                  </SummaryBlock>
                  <SummaryBlock>
                    <SummaryLabel>Delivery Address</SummaryLabel>
                    <SummaryValue>{order.delivery_address}</SummaryValue>
                  </SummaryBlock>
                  <TotalBlock>
                    <SummaryLabel>Total Paid</SummaryLabel>
                    <SummaryValue>
                      Kes {order.total_cost?.toLocaleString()}
                    </SummaryValue>
                  </TotalBlock>
                </SummaryGrid>

                <PrimaryButton onClick={() => navigate("/list")}>
                  Continue Shopping
                </PrimaryButton>
                <SecondaryButton onClick={() => navigate("/")}>
                  Go Home
                </SecondaryButton>
              </>
            )}
          </Content>
        </Card>
      </Container>
    </>
  );
};

export default ViewOrder;
