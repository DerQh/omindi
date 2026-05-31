import { Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useOrderId } from "../../hooks/useOrders";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_STEPS = ["pending", "confirmed", "delivering", "delivered"];

const statusConfig = {
  pending: { bg: "#fff8e5", color: "#b07d00", label: "Pending" },
  confirmed: { bg: "#eef9f0", color: "#2f5a2a", label: "Confirmed" },
  delivering: { bg: "#e5f4ff", color: "#1a5a8a", label: "Out for Delivery" },
  delivered: { bg: "#eef9f0", color: "#2f5a2a", label: "Delivered" },
  cancelled: { bg: "#fdf0f0", color: "#a32d2d", label: "Cancelled" },
};

// Icon shown in each step dot
const stepIcons = {
  pending: "📋",
  confirmed: "✅",
  delivering: "🚚",
  delivered: "📦",
};

const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

const formatDate = (s) =>
  new Date(s).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 48px;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%);
  padding: 32px 24px 56px;
  position: relative;
  overflow: hidden;

  /* Decorative circles */
  &::before {
    content: "";
    position: absolute;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    top: -80px;
    right: -50px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: -20px;
    left: -30px;
    pointer-events: none;
  }
`;

const BackBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  margin-bottom: 20px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;

const HeroMeta = styled.p`
  margin: 0 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const HeroOrderId = styled.h1`
  margin: 0 0 6px;
  color: white;
  font-size: 1.6rem;
  font-weight: 800;
  font-family: "SF Mono", "Fira Code", monospace;
  letter-spacing: 0.04em;
`;

const HeroDate = styled.p`
  margin: 0 0 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.88rem;
`;

const HeroStatusBadge = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 999px;
  letter-spacing: 0.03em;
`;

// ─── Content ──────────────────────────────────────────────────────────────────

const ContentArea = styled.div`
  max-width: 960px;
  margin: -24px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 5;
`;

// ─── Section Card ─────────────────────────────────────────────────────────────

const SectionCard = styled.div`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  margin-bottom: 16px;
  animation: ${slideUp} 0.35s ease;
`;

const SectionHeader = styled.div`
  padding: 18px 20px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ─── Cancelled Banner ─────────────────────────────────────────────────────────

// Shown instead of the stepper when an order is cancelled
const CancelledBanner = styled.div`
  background: #fdf0f0;
  border: 1.5px solid #f5c6c2;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  animation: ${slideUp} 0.3s ease;
`;

const CancelledIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const CancelledText = styled.div``;

const CancelledTitle = styled.p`
  margin: 0 0 4px;
  font-weight: 700;
  color: #a32d2d;
  font-size: 0.95rem;
`;

const CancelledDesc = styled.p`
  margin: 0;
  color: #c97070;
  font-size: 0.85rem;
`;

// ─── Progress Stepper ─────────────────────────────────────────────────────────

const StepperWrap = styled.div`
  padding: 4px 20px 20px;
`;

const StepsRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

const StepCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;

  /* Connecting line to the right — drawn as ::after on all but the last step */
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 3px;
    background: ${({ $done }) => ($done ? "#2f5a2a" : "#d7e9d7")};
    z-index: 0;
  }
`;

const StepDot = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $done, $current }) =>
    $current ? "#2f5a2a" : $done ? "#eef9f0" : "#e8f2e8"};
  border: 2.5px solid
    ${({ $done, $current }) => ($current || $done ? "#2f5a2a" : "#d7e9d7")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $done, $current }) =>
    $done || $current ? "0.85rem" : "0.75rem"};
  color: ${({ $done, $current }) =>
    $current || $done ? "#2f5a2a" : "#aac4aa"};
  z-index: 1;
  position: relative;
`;

const StepLabel = styled.p`
  margin: 7px 0 0;
  font-size: 0.65rem;
  font-weight: ${({ $done, $current }) => ($current || $done ? "700" : "400")};
  color: ${({ $done, $current }) =>
    $current ? "#2f5a2a" : $done ? "#5a8a5a" : "#aac4aa"};
  text-align: center;
  text-transform: capitalize;
  line-height: 1.3;
`;

// ─── Order Items ──────────────────────────────────────────────────────────────

const ItemList = styled.div`
  display: grid;
  gap: 0;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f7ee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    grid-template-columns: 60px 1fr;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  background: #d7edd9;
`;

const ItemInfo = styled.div`
  display: grid;
  gap: 3px;
`;

const ItemName = styled.p`
  margin: 0;
  color: #1a3318;
  font-weight: 700;
  font-size: 0.93rem;
`;

const ItemMeta = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.82rem;
`;

const ItemSubtotal = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 800;
  font-size: 0.93rem;
  white-space: nowrap;

  @media (max-width: 480px) {
    display: none;
  }
`;

// ─── Delivery & Payment ───────────────────────────────────────────────────────

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 20px 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  background: #f5f8f5;
  border: 1px solid #e8f0e8;
  border-radius: 12px;
  padding: 12px 16px;
`;

const InfoLabel = styled.p`
  margin: 0 0 4px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #7b8f7f;
`;

const InfoValue = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a3318;
`;

// ─── Total Row ────────────────────────────────────────────────────────────────

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #2f5a2a;
  margin: 0 20px 20px;
  border-radius: 14px;
`;

const TotalLabel = styled.span`
  color: #a8d5ac;
  font-size: 0.95rem;
  font-weight: 600;
`;

const TotalValue = styled.span`
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
`;

// ─── Action Buttons ───────────────────────────────────────────────────────────

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
`;

const PrimaryBtn = styled.button`
  flex: 2;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #245026;
  }
`;

const SecondaryBtn = styled.button`
  flex: 1;
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  padding: 14px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eef7ee;
    border-color: #2f5a2a;
  }
`;

const ContactBtn = styled.button`
  width: 100%;
  background: #e5f4ff;
  color: #1a5a8a;
  border: 2px solid #b8d9f5;
  padding: 13px;
  border-radius: 14px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: #d0eaff;
  }
`;

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const SkeletonBase = styled.div`
  border-radius: 8px;
  background: linear-gradient(90deg, #e8f0e8 25%, #f0f7f0 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

const SkeletonHero = styled.div`
  height: 160px;
  background: linear-gradient(135deg, #3a6a35, #4a8a40);
  padding: 32px 24px;
  display: grid;
  gap: 10px;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: ${({ $h }) => $h || "14px"};
  width: ${({ $w }) => $w || "100%"};
  opacity: 0.35;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 20px;
  margin: 0 20px 16px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  display: grid;
  gap: 12px;
`;

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorWrap = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  margin: 20px;
`;

const ErrorIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const ErrorTitle = styled.p`
  margin: 0 0 8px;
  font-weight: 700;
  color: #a32d2d;
  font-size: 1rem;
`;

const ErrorDesc = styled.p`
  margin: 0 0 18px;
  color: #7b8f7f;
  font-size: 0.88rem;
`;

const RetryBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #245026;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const ViewOrder = () => {
  const { order_id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading, isError, refetch } = useOrderId(order_id);

  const stepIndex = STATUS_STEPS.indexOf(order?.status);
  const isCancelled = order?.status === "cancelled";

  // ── Loading state ──
  if (isLoading) {
    return (
      <>
        <AppNavbar />
        <Container>
          <SkeletonHero>
            <SkeletonLine $h="10px" $w="80px" />
            <SkeletonLine $h="20px" $w="160px" />
            <SkeletonLine $h="12px" $w="200px" />
          </SkeletonHero>
          <SkeletonCard
            style={{
              margin: "-24px 20px 16px",
              position: "relative",
              zIndex: 5,
            }}
          >
            <SkeletonLine $h="12px" $w="60%" />
            <SkeletonLine $h="12px" $w="85%" />
            <SkeletonLine $h="12px" $w="40%" />
          </SkeletonCard>
          <SkeletonCard style={{ margin: "0 20px 16px" }}>
            <SkeletonLine $h="60px" />
            <SkeletonLine $h="60px" />
          </SkeletonCard>
        </Container>
      </>
    );
  }

  // ── Error state ──
  if (isError || !order) {
    return (
      <>
        <AppNavbar />
        <Container>
          <Hero style={{ paddingBottom: "32px" }}>
            <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
          </Hero>
          <ErrorWrap>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>Couldn't load order</ErrorTitle>
            <ErrorDesc>
              There was a problem fetching this order. Please try again.
            </ErrorDesc>
            <RetryBtn onClick={refetch}>Retry</RetryBtn>
          </ErrorWrap>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container>
        {/* ── Hero — order ID, date, status badge ── */}
        <Hero>
          <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
          <HeroMeta>Order Reference</HeroMeta>
          <HeroOrderId>#{order.id.slice(0, 8).toUpperCase()}</HeroOrderId>
          <HeroDate>Placed on {formatDate(order.created_at)}</HeroDate>
          <HeroStatusBadge>
            {statusConfig[order.status]?.label ?? order.status}
          </HeroStatusBadge>
        </Hero>

        <ContentArea>
          {/* ── Cancelled banner ── */}
          {isCancelled && (
            <CancelledBanner>
              <CancelledIcon>❌</CancelledIcon>
              <CancelledText>
                <CancelledTitle>Order Cancelled</CancelledTitle>
                <CancelledDesc>
                  This order was cancelled. Contact the seller if you have
                  questions.
                </CancelledDesc>
              </CancelledText>
            </CancelledBanner>
          )}

          {/* ── Progress stepper (hidden for cancelled orders) ── */}
          {!isCancelled && (
            <SectionCard>
              <SectionHeader>
                <SectionTitle>Order Progress</SectionTitle>
              </SectionHeader>
              <StepperWrap>
                <StepsRow>
                  {STATUS_STEPS.map((step, i) => {
                    const done = i < stepIndex;
                    const current = i === stepIndex;
                    return (
                      <StepCol key={step} $done={done || current}>
                        <StepDot $done={done} $current={current}>
                          {done ? "✓" : stepIcons[step]}
                        </StepDot>
                        <StepLabel $done={done} $current={current}>
                          {step}
                        </StepLabel>
                      </StepCol>
                    );
                  })}
                </StepsRow>
              </StepperWrap>
            </SectionCard>
          )}

          {/* ── Items ordered ── */}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Items Ordered</SectionTitle>
              <span style={{ color: "#7b8f7f", fontSize: "0.82rem" }}>
                {order.order_items?.length} item
                {order.order_items?.length !== 1 ? "s" : ""}
              </span>
            </SectionHeader>
            <ItemList>
              {order.order_items?.map((item) => (
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
                    {(item.price_at_purchase * item.quantity).toLocaleString()}
                  </ItemSubtotal>
                </OrderItem>
              ))}
            </ItemList>

            {/* Total pinned at the bottom of the items card */}
            <TotalRow>
              <TotalLabel>Total Paid</TotalLabel>
              <TotalValue>Kes {order.total_cost?.toLocaleString()}</TotalValue>
            </TotalRow>
          </SectionCard>

          {/* ── Delivery & payment details ── */}
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Delivery & Payment</SectionTitle>
            </SectionHeader>
            <InfoGrid>
              <InfoBox>
                <InfoLabel>Payment Method</InfoLabel>
                <InfoValue>
                  {paymentLabels[order.payment_method] ?? order.payment_method}
                </InfoValue>
              </InfoBox>
              <InfoBox>
                <InfoLabel>Delivery Address</InfoLabel>
                <InfoValue>{order.delivery_address}</InfoValue>
              </InfoBox>
              {order.mobile_no && (
                <InfoBox>
                  <InfoLabel>Contact Number</InfoLabel>
                  <InfoValue>{order.mobile_no}</InfoValue>
                </InfoBox>
              )}
              <InfoBox>
                <InfoLabel>Order Status</InfoLabel>
                <InfoValue style={{ color: statusConfig[order.status]?.color }}>
                  {statusConfig[order.status]?.label ?? order.status}
                </InfoValue>
              </InfoBox>
            </InfoGrid>
          </SectionCard>

          {/* ── Actions ── */}
          <ButtonRow>
            <PrimaryBtn onClick={() => navigate("/list")}>
              Continue Shopping
            </PrimaryBtn>
          </ButtonRow>
          <ContactBtn onClick={() => navigate("/messages")}>
            Contact Seller about this Order
          </ContactBtn>
        </ContentArea>
      </Container>
    </>
  );
};

export default ViewOrder;
