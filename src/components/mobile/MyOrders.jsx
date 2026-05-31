import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../hooks/useOrders";
import { formatSmartDate } from "../../hooks/dateFormat";
import LoadingComponent from "./Loading";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS = {
  pending:    { label: "Pending",    bg: "#fff8e1", color: "#b45309" },
  confirmed:  { label: "Confirmed",  bg: "#eff6ff", color: "#1d4ed8" },
  processing: { label: "Processing", bg: "#f5f3ff", color: "#6d28d9" },
  shipped:    { label: "Shipped",    bg: "#ecfdf5", color: "#065f46" },
  delivering: { label: "Shipping",   bg: "#e5f4ff", color: "#1a5a8a" },
  delivered:  { label: "Delivered",  bg: "#f0fdf4", color: "#166534" },
  cancelled:  { label: "Cancelled",  bg: "#fef2f2", color: "#991b1b" },
  refunded:   { label: "Refunded",   bg: "#fdf2f8", color: "#9d174d" },
};

const STEP_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

const paymentLabels = {
  cash:   "Cash on Delivery",
  mobile: "M-Pesa",
  bank:   "Bank Transfer",
};

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 60px;
`;

const Hero = styled.div`
  padding: 28px 24px 72px;
  max-width: 960px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  margin: 0 0 4px;
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a3318;
`;

const HeroSub = styled.p`
  margin: 0;
  color: #7b9b7b;
  font-size: 0.9rem;
`;

const FilterBarWrap = styled.div`
  max-width: 960px;
  margin: -40px auto 24px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
`;

const FilterBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 5px;
  display: flex;
  gap: 4px;
  box-shadow: 0 8px 28px rgba(20, 57, 32, 0.11);
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const FilterBtn = styled.button`
  flex-shrink: 0;
  padding: 9px 14px;
  border-radius: 10px;
  border: none;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#7b8f7f")};
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  &:hover { background: ${({ $active }) => ($active ? "#2f5a2a" : "#eef7ee")}; color: ${({ $active }) => ($active ? "white" : "#2f5a2a")}; }
`;

const Content = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(20, 57, 32, 0.07);
  margin-bottom: 16px;
  overflow: hidden;
  animation: ${fadeUp} 0.3s ease;
  border: ${({ $expanded }) => ($expanded ? "1.5px solid #cde5cf" : "1.5px solid transparent")};
  background: ${({ $expanded }) => ($expanded ? "#f8fdf8" : "white")};
  transition: all 0.2s;
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  gap: 12px;
  flex-wrap: wrap;
  &:hover { background: #f5fcf5; }
`;

const OrderLeft = styled.div`flex: 1; min-width: 0;`;

const OrderIdRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

const OrderId = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
  color: #1a3318;
  font-family: "SF Mono", monospace;
`;

const OrderDate = styled.span`
  font-size: 0.75rem;
  color: #7b9b7b;
`;

const StatusPill = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ $s }) => STATUS[$s]?.bg ?? "#f0f7ee"};
  color: ${({ $s }) => STATUS[$s]?.color ?? "#2f5a2a"};
`;

const OrderMeta = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #7b9b7b;
`;

const OrderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;

const OrderTotal = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
`;

const ExpandHint = styled.span`
  font-size: 0.72rem;
  color: #7b9b7b;
`;

const OrderExpanded = styled.div`
  margin: 0 16px 16px;
  padding: 18px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8f2e8;
  display: grid;
  gap: 16px;
  animation: ${fadeUp} 0.2s ease;
`;

const SectionLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7b9b7b;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 11px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: ${({ $done }) => ($done ? "#2f5a2a" : "#e8f2e8")};
    z-index: 0;
  }
`;

const StepDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid ${({ $done, $current }) => ($current || $done ? "#2f5a2a" : "#e8f2e8")};
  background: ${({ $current }) => ($current ? "#2f5a2a" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: ${({ $done, $current }) => ($current ? "white" : $done ? "#2f5a2a" : "#7b9b7b")};
  z-index: 1;
  position: relative;
`;

const StepLabel = styled.p`
  margin: 5px 0 0;
  font-size: 0.6rem;
  font-weight: 700;
  text-align: center;
  text-transform: capitalize;
  color: ${({ $current }) => ($current ? "#2f5a2a" : "#7b9b7b")};
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  align-items: center;
  background: #f5f8f5;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 8px;
  &:last-child { margin-bottom: 0; }
`;

const ItemThumb = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 9px;
  object-fit: cover;
  background: #d6ead6;
`;

const ItemName = styled.p`
  margin: 0 0 2px;
  font-size: 0.87rem;
  font-weight: 700;
  color: #1a3318;
`;

const ItemMeta = styled.p`
  margin: 0;
  font-size: 0.76rem;
  color: #7b9b7b;
`;

const ItemPrice = styled.p`
  margin: 0;
  font-size: 0.87rem;
  font-weight: 700;
  color: #1a3318;
  white-space: nowrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const InfoBox = styled.div`
  background: #f5f8f5;
  border: 1px solid #e8f2e8;
  border-radius: 12px;
  padding: 12px 16px;
`;

const InfoLabel = styled.p`
  margin: 0 0 3px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #7b9b7b;
`;

const InfoValue = styled.p`
  margin: 0;
  font-size: 0.87rem;
  font-weight: 600;
  color: #1a3318;
`;

const DisputeBtn = styled.button`
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  background: #fdf0f0;
  color: #a32d2d;
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.15s;
  &:hover { background: #f5c2c2; }
`;

const EmptyWrap = styled.div`
  text-align: center;
  padding: 72px 24px;
`;

const EmptyIcon = styled.div`font-size: 3rem; margin-bottom: 14px;`;
const EmptyTitle = styled.p`margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; color: #1a3318;`;
const EmptyDesc = styled.p`margin: 0 0 22px; color: #7b9b7b; font-size: 0.9rem;`;
const BrowseBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #245026; }
`;

const SkeletonBase = styled.div`
  border-radius: 8px;
  background: linear-gradient(90deg, #e8f0e8 25%, #f0f7f0 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

const ALL_FILTERS = ["all", "pending", "confirmed", "processing", "shipped", "delivering", "delivered", "cancelled"];

// Renders the buyer's full order history with status tracking and dispute option.
const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useOrder(user?.id);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Returns the current step index for the progress stepper.
  const currentStep = (status) => STEP_ORDER.indexOf(status);

  if (isLoading) return <LoadingComponent />;

  return (
    <>
      <AppNavbar />
      <Page>
        <Hero>
          <HeroTitle>My Orders</HeroTitle>
          <HeroSub>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</HeroSub>
        </Hero>

        <FilterBarWrap>
          <FilterBar>
            {ALL_FILTERS.map((f) => {
              const count = f === "all" ? orders.length : orders.filter((o) => o.status === f).length;
              if (f !== "all" && count === 0) return null;
              return (
                <FilterBtn key={f} $active={filter === f} onClick={() => setFilter(f)}>
                  {f === "all" ? "All" : (STATUS[f]?.label ?? f)} ({count})
                </FilterBtn>
              );
            })}
          </FilterBar>
        </FilterBarWrap>

        <Content>
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <SkeletonBase key={i} style={{ height: 80, borderRadius: 18, marginBottom: 16 }} />
              ))}
            </>
          )}

          {!isLoading && filtered.length === 0 && (
            <EmptyWrap>
              <EmptyIcon>🛒</EmptyIcon>
              <EmptyTitle>{filter === "all" ? "No orders yet" : `No ${STATUS[filter]?.label ?? filter} orders`}</EmptyTitle>
              <EmptyDesc>Browse the marketplace and place your first order.</EmptyDesc>
              <BrowseBtn onClick={() => navigate("/list")}>Browse Listings</BrowseBtn>
            </EmptyWrap>
          )}

          {filtered.map((order) => {
            const isOpen = expanded === order.id;
            const step = currentStep(order.status);
            const showStepper = !["cancelled", "refunded"].includes(order.status);

            return (
              <OrderCard key={order.id} $expanded={isOpen}>
                <OrderHeader onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <OrderLeft>
                    <OrderIdRow>
                      <OrderId>#{order.id.slice(0, 8).toUpperCase()}</OrderId>
                      <StatusPill $s={order.status}>{STATUS[order.status]?.label ?? order.status}</StatusPill>
                      <OrderDate>{formatSmartDate(order.created_at)}</OrderDate>
                    </OrderIdRow>
                    <OrderMeta>
                      {order.order_items?.length ?? 0} item{order.order_items?.length !== 1 ? "s" : ""}
                      &nbsp;·&nbsp;{paymentLabels[order.payment_method] ?? order.payment_method}
                      &nbsp;·&nbsp;{order.delivery_address}
                    </OrderMeta>
                  </OrderLeft>
                  <OrderRight>
                    <OrderTotal>Kes {order.total_cost?.toLocaleString()}</OrderTotal>
                    <ExpandHint>{isOpen ? "▲ hide" : "▼ details"}</ExpandHint>
                  </OrderRight>
                </OrderHeader>

                {isOpen && (
                  <OrderExpanded>
                    {/* Progress stepper */}
                    {showStepper && (
                      <div>
                        <SectionLabel>Order Progress</SectionLabel>
                        <Stepper>
                          {STEP_ORDER.map((s, i) => (
                            <Step key={s} $done={i <= step}>
                              <StepDot $done={i < step} $current={i === step}>
                                {i < step ? "✓" : i + 1}
                              </StepDot>
                              <StepLabel $current={i === step}>{s}</StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                      </div>
                    )}

                    {/* Items */}
                    <div>
                      <SectionLabel>Items</SectionLabel>
                      {order.order_items?.map((item) => (
                        <ItemRow key={item.id}>
                          <ItemThumb src={item.listings?.image_url} alt={item.listings?.title} />
                          <div>
                            <ItemName>{item.listings?.title}</ItemName>
                            <ItemMeta>Qty: {item.quantity} · {item.listings?.unit}</ItemMeta>
                          </div>
                          <ItemPrice>Kes {(item.price_at_purchase * item.quantity).toLocaleString()}</ItemPrice>
                        </ItemRow>
                      ))}
                    </div>

                    {/* Delivery + payment info */}
                    <InfoGrid>
                      <InfoBox>
                        <InfoLabel>Delivery Address</InfoLabel>
                        <InfoValue>{order.delivery_address}</InfoValue>
                      </InfoBox>
                      <InfoBox>
                        <InfoLabel>Contact</InfoLabel>
                        <InfoValue>{order.mobile_no}</InfoValue>
                      </InfoBox>
                      <InfoBox>
                        <InfoLabel>Payment</InfoLabel>
                        <InfoValue>{paymentLabels[order.payment_method] ?? order.payment_method}</InfoValue>
                      </InfoBox>
                      <InfoBox>
                        <InfoLabel>Total</InfoLabel>
                        <InfoValue>Kes {order.total_cost?.toLocaleString()}</InfoValue>
                      </InfoBox>
                    </InfoGrid>

                    {/* Dispute button — only for delivered orders */}
                    {order.status === "delivered" && (
                      <DisputeBtn onClick={() => navigate("/messages")}>
                        Raise a Dispute
                      </DisputeBtn>
                    )}
                  </OrderExpanded>
                )}
              </OrderCard>
            );
          })}
        </Content>
      </Page>
    </>
  );
};

export default MyOrders;
