import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, createGlobalStyle } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAYMENT_LABELS = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

const STEPS = [
  { icon: "✓", label: "Order Placed" },
  { icon: "📞", label: "Seller Confirms" },
  { icon: "🚚", label: "Out for Delivery" },
  { icon: "🏠", label: "Delivered" },
];

// ─── Print styles ─────────────────────────────────────────────────────────────

const PrintStyles = createGlobalStyle`
  @media print {
    body * { visibility: hidden; }
    #receipt-printable, #receipt-printable * { visibility: visible; }
    #receipt-printable {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      padding: 24px;
    }
    #receipt-actions { display: none; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showReceipt, setShowReceipt] = useState(false);

  const {
    orderGroupedBySeller: groups,
    totalCost,
    paymentMethod,
    address,
    orderId,
  } = state || {};

  const totalCount = groups?.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );
  const totalProducts = groups?.reduce((s, g) => s + g.items.length, 0);
  const estimatedDays = paymentMethod === "cash" ? "2–4" : "1–3";

  const shortId = orderId?.[0]?.slice(0, 8).toUpperCase();

  return (
    <>
      <AppNavbar />
      <Page>
        {/* ── Hero ── */}
        <Hero>
          <CheckCircle>✓</CheckCircle>
          <HeroTitle>Order Placed!</HeroTitle>
          <HeroSub>Thank you. The seller will contact you shortly.</HeroSub>
          {shortId && <OrderIdBadge>Order # {shortId}</OrderIdBadge>}
        </Hero>

        {/* ── Content sheet ── */}
        <Sheet>
          <Inner>
            {/* ── What's next timeline ── */}
            <SectionLabel>What Happens Next</SectionLabel>
            <Timeline>
              {STEPS.map((step, i) => (
                <Step key={i}>
                  <StepDot $done={i === 0}>{i === 0 ? "✓" : step.icon}</StepDot>
                  {i < STEPS.length - 1 && <StepLine $done={false} />}
                  <StepLabel $done={i === 0}>{step.label}</StepLabel>
                </Step>
              ))}
            </Timeline>

            <Divider />

            {/* ── Order stats ── */}
            <SectionLabel>Order Summary</SectionLabel>
            <StatsRow>
              <StatBlock>
                <StatNum>{totalProducts}</StatNum>
                <StatLabel>Products</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatNum>{totalCount}</StatNum>
                <StatLabel>Total qty</StatLabel>
              </StatBlock>
              <StatBlock $green>
                <StatNum $green>Kes {totalCost?.toLocaleString()}</StatNum>
                <StatLabel>Total paid</StatLabel>
              </StatBlock>
            </StatsRow>

            <Divider />

            {/* ── Items grouped by seller ── */}
            <SectionLabel>Items Ordered</SectionLabel>
            {groups?.map((group) => (
              <SellerGroup key={group.seller_id}>
                <GroupHeader>
                  <span>🏪</span>
                  <GroupSellerName>
                    {group.items[0]?.listings?.seller_name || "Farmer"}
                  </GroupSellerName>
                  <GroupSubtotal>
                    Kes {group.totalCost.toLocaleString()}
                  </GroupSubtotal>
                </GroupHeader>
                {group.items.map((item, idx) => (
                  <ItemRow key={item.id} $last={idx === group.items.length - 1}>
                    <ItemImg
                      src={item.listings?.image_url}
                      alt={item.listings?.title}
                    />
                    <ItemMeta>
                      <ItemName>{item.listings?.title}</ItemName>
                      <ItemSub>
                        Kes {item.listings?.price}
                        {item.listings?.unit
                          ? ` / ${item.listings.unit}`
                          : ""}{" "}
                        × {item.quantity}
                      </ItemSub>
                    </ItemMeta>
                    <ItemTotal>
                      Kes{" "}
                      {(
                        (item.listings?.price ?? 0) * item.quantity
                      ).toLocaleString()}
                    </ItemTotal>
                  </ItemRow>
                ))}
              </SellerGroup>
            ))}

            <Divider />

            {/* ── Delivery details ── */}
            <SectionLabel>Delivery Details</SectionLabel>
            <DeliveryCard>
              <DeliveryRow>
                <DeliveryLabel>Payment</DeliveryLabel>
                <DeliveryValue>
                  {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
                </DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Address</DeliveryLabel>
                <DeliveryValue>{address}</DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Estimated delivery</DeliveryLabel>
                <DeliveryValue>{estimatedDays} business days</DeliveryValue>
              </DeliveryRow>
              <DeliveryRow $last>
                <DeliveryLabel>Next step</DeliveryLabel>
                <DeliveryValue>Seller will call to confirm</DeliveryValue>
              </DeliveryRow>
            </DeliveryCard>

            <Divider />

            {/* ── Actions ── */}
            <Actions>
              <ActionBtn $variant="ghost" onClick={() => setShowReceipt(true)}>
                View Receipt
              </ActionBtn>
              <ActionBtn $variant="primary" onClick={() => navigate("/list")}>
                Continue Shopping
              </ActionBtn>
              <ActionBtn $variant="outline" onClick={() => navigate("/mobile")}>
                Go Home
              </ActionBtn>
            </Actions>
          </Inner>
        </Sheet>
      </Page>

      {/* ── Receipt modal ── */}
      {showReceipt && (
        <>
          <PrintStyles />
          <ModalOverlay onClick={() => setShowReceipt(false)}>
            <ModalBox
              onClick={(e) => e.stopPropagation()}
              id="receipt-printable"
            >
              <ReceiptHeader>
                <ReceiptLogo>AFARMER</ReceiptLogo>
                <ReceiptSub>Official Receipt</ReceiptSub>
                <ReceiptRef>Order # {shortId}</ReceiptRef>
              </ReceiptHeader>

              <ReceiptBody>
                <ReceiptSectionLabel>Items Purchased</ReceiptSectionLabel>
                {groups?.map((group) =>
                  group.items.map((item) => (
                    <ReceiptLine key={item.id}>
                      <ReceiptItemName>{item.listings?.title}</ReceiptItemName>
                      <ReceiptItemQty>×{item.quantity}</ReceiptItemQty>
                      <ReceiptItemPrice>
                        Kes{" "}
                        {(
                          item.listings?.price * item.quantity
                        ).toLocaleString()}
                      </ReceiptItemPrice>
                    </ReceiptLine>
                  )),
                )}

                <ReceiptDivider />

                <ReceiptTotalRow>
                  <span>Total</span>
                  <ReceiptTotalAmt>
                    Kes {totalCost?.toLocaleString()}
                  </ReceiptTotalAmt>
                </ReceiptTotalRow>

                <ReceiptDivider />

                <ReceiptSectionLabel>Delivery Info</ReceiptSectionLabel>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Payment</ReceiptInfoLabel>
                  <ReceiptInfoValue>
                    {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
                  </ReceiptInfoValue>
                </ReceiptInfoRow>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Address</ReceiptInfoLabel>
                  <ReceiptInfoValue>{address}</ReceiptInfoValue>
                </ReceiptInfoRow>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Est. Delivery</ReceiptInfoLabel>
                  <ReceiptInfoValue>
                    {estimatedDays} business days
                  </ReceiptInfoValue>
                </ReceiptInfoRow>
              </ReceiptBody>

              <ReceiptFooter>
                Thank you for shopping with AFARMER!
              </ReceiptFooter>

              <ModalActions id="receipt-actions">
                <ModalPrintBtn onClick={() => window.print()}>
                  🖨 Print
                </ModalPrintBtn>
                <ModalCloseBtn onClick={() => setShowReceipt(false)}>
                  Close
                </ModalCloseBtn>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        </>
      )}
    </>
  );
};

export default OrderConfirmation;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
`;

// ── Hero ──

const Hero = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%);
  padding: 48px 24px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
`;

const CheckCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.6);
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  animation: ${popIn} 0.5s ease forwards;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.3px;
`;

const HeroSub = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
`;

const OrderIdBadge = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 999px;
  letter-spacing: 0.06em;
  margin-top: 4px;
`;

// ── Sheet ──

const Sheet = styled.div`
  background: white;
  border-radius: 24px 24px 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 260px);
  padding-bottom: 48px;
`;

const Inner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 28px 24px 0;
  animation: ${fadeUp} 0.35s ease;
`;

const SectionLabel = styled.h3`
  margin: 0 0 14px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 24px 0;
`;

// ── Timeline ──

const Timeline = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
`;

const StepDot = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $done }) => ($done ? "#2f5a2a" : "#f0f7ee")};
  border: 2px solid ${({ $done }) => ($done ? "#2f5a2a" : "#d7ead7")};
  color: ${({ $done }) => ($done ? "white" : "#b0c4b0")};
  font-size: ${({ $done }) => ($done ? "1rem" : "0.9rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
`;

const StepLine = styled.div`
  position: absolute;
  top: 18px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #d7ead7;
  z-index: 0;
`;

const StepLabel = styled.span`
  margin-top: 8px;
  font-size: 0.7rem;
  font-weight: ${({ $done }) => ($done ? "700" : "500")};
  color: ${({ $done }) => ($done ? "#2f5a2a" : "#7b8f7f")};
  text-align: center;
`;

// ── Stats ──

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const StatBlock = styled.div`
  background: ${({ $green }) => ($green ? "#eef7ee" : "#f8faf6")};
  border: 1px solid ${({ $green }) => ($green ? "#cde5cf" : "#eef0ee")};
  border-radius: 14px;
  padding: 14px 12px;
  text-align: center;
`;

const StatNum = styled.div`
  font-size: ${({ $green }) => ($green ? "0.9rem" : "1.3rem")};
  font-weight: 800;
  color: #2f5a2a;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

// ── Items ──

const SellerGroup = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e8f0e8;
  overflow: hidden;
  margin-bottom: 12px;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8faf6;
  border-bottom: 1px solid #f0f7ee;
  font-size: 0.88rem;
`;

const GroupSellerName = styled.span`
  flex: 1;
  font-weight: 700;
  color: #1a3318;
`;

const GroupSubtotal = styled.span`
  font-weight: 700;
  color: #2f5a2a;
  font-size: 0.82rem;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f0f7ee")};
`;

const ItemImg = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
  background: #eef7ee;
  flex-shrink: 0;
`;

const ItemMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.p`
  margin: 0 0 2px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemSub = styled.p`
  margin: 0;
  font-size: 0.76rem;
  color: #7b8f7f;
`;

const ItemTotal = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #2f5a2a;
  flex-shrink: 0;
`;

// ── Delivery ──

const DeliveryCard = styled.div`
  background: #f8faf6;
  border: 1px solid #e8f0e8;
  border-radius: 16px;
  overflow: hidden;
`;

const DeliveryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f0f7ee")};
`;

const DeliveryLabel = styled.span`
  font-size: 0.82rem;
  color: #7b8f7f;
  font-weight: 500;
  flex-shrink: 0;
`;

const DeliveryValue = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a3318;
  text-align: right;
`;

// ── Actions ──

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.18s;

  ${({ $variant }) =>
    $variant === "primary" &&
    `
    background: #2f5a2a; color: white; border: none;
    &:hover { background: #245026; }
  `}
  ${({ $variant }) =>
    $variant === "outline" &&
    `
    background: white; color: #2f5a2a;
    border: 1.5px solid #cde5cf;
    &:hover { background: #eef7ee; border-color: #2f5a2a; }
  `}
  ${({ $variant }) =>
    $variant === "ghost" &&
    `
    background: #eef7ee; color: #2f5a2a;
    border: 1.5px solid #cde5cf;
    &:hover { background: #d7edd7; }
  `}
`;

// ── Receipt modal ──

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 18px;
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: ${fadeUp} 0.25s ease;
`;

const ReceiptHeader = styled.div`
  padding: 24px 24px 18px;
  text-align: center;
  border-bottom: 2px dashed #e0ece0;
`;

const ReceiptLogo = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: #2f5a2a;
  margin-bottom: 2px;
`;

const ReceiptSub = styled.p`
  margin: 0 0 4px;
  color: #7b8f7f;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const ReceiptRef = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-size: 0.88rem;
  font-weight: 700;
`;

const ReceiptBody = styled.div`
  padding: 18px 24px;
`;

const ReceiptSectionLabel = styled.p`
  margin: 0 0 8px;
  font-size: 0.72rem;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
`;

const ReceiptLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const ReceiptItemName = styled.span`
  color: #1a3318;
  font-size: 0.88rem;
  flex: 1;
`;
const ReceiptItemQty = styled.span`
  color: #7b8f7f;
  font-size: 0.8rem;
  margin: 0 10px;
`;
const ReceiptItemPrice = styled.span`
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.88rem;
`;

const ReceiptDivider = styled.div`
  height: 2px;
  border-top: 2px dashed #e0ece0;
  margin: 14px 0;
`;

const ReceiptTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a3318;
`;

const ReceiptTotalAmt = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const ReceiptInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const ReceiptInfoLabel = styled.span`
  color: #7b8f7f;
  font-size: 0.85rem;
`;
const ReceiptInfoValue = styled.span`
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: right;
  max-width: 55%;
`;

const ReceiptFooter = styled.div`
  text-align: center;
  padding: 14px 24px 18px;
  color: #7b8f7f;
  font-size: 0.82rem;
  border-top: 2px dashed #e0ece0;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 24px 20px;
`;

const ModalPrintBtn = styled.button`
  flex: 1;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 13px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #245026;
  }
`;

const ModalCloseBtn = styled.button`
  flex: 1;
  background: #f0f7ee;
  color: #2f5a2a;
  border: 1.5px solid #cde5cf;
  padding: 13px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #d7edd7;
  }
`;
