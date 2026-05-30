import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, createGlobalStyle } from "styled-components";

// ─── Animations ──────────────────────────────────────────────────────────────

// Slides the card in from below on page load
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Bounces the checkmark circle into view — gives a satisfying "success" feel
const popIn = keyframes`
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`;

// ─── Page Layout ─────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding: 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
`;

// Main white card that wraps all confirmation content
const Card = styled.div`
  max-width: 960px;
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

// ─── Success Banner ───────────────────────────────────────────────────────────

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

// Pill badge showing the short order ID (first 8 chars of UUID)
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

// ─── Order Summary ────────────────────────────────────────────────────────────

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

// Extends SummaryBlock with a dark green background for the total row
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

// ─── Item Cards ───────────────────────────────────────────────────────────────

const ItemList = styled.div`
  display: grid;
  gap: 16px;
  margin-bottom: 28px;
`;

// Two-column on desktop, single column on mobile
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

// ─── Delivery Details ─────────────────────────────────────────────────────────

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

// ─── Action Buttons ───────────────────────────────────────────────────────────

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

// Opens the receipt modal
const ReceiptButton = styled.button`
  width: 100%;
  background: #f0f7ee;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  &:hover { background: #d7efd9; }
`;

const Divider = styled.div`
  height: 1px;
  background: #ebf2eb;
  margin: 28px 0;
`;

// ─── Receipt Modal ────────────────────────────────────────────────────────────

// When window.print() is called, this hides everything on the page except
// the receipt content. #receipt-actions (the Print/Close buttons) is explicitly
// hidden so they don't appear in the printed output.
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
    #receipt-actions {
      display: none;
    }
  }
`;

// Dark semi-transparent backdrop — clicking it closes the modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

// The scrollable receipt card — id="receipt-printable" ties it to PrintStyles
const ModalBox = styled.div`
  background: white;
  border-radius: 18px;
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  animation: ${fadeIn} 0.3s ease;
`;

// Receipt header — mimics a physical receipt top (store name, order ref)
const ReceiptHeader = styled.div`
  padding: 28px 28px 0;
  text-align: center;
  border-bottom: 2px dashed #e0ece0;
  padding-bottom: 20px;
`;

const ReceiptLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #2f5a2a;
  margin-bottom: 4px;
`;

const ReceiptTitle = styled.p`
  margin: 0 0 4px;
  color: #7b8f7f;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const ReceiptMeta = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-size: 0.9rem;
  font-weight: 600;
`;

const ReceiptBody = styled.div`
  padding: 20px 28px;
`;

const ReceiptSection = styled.div`
  margin-bottom: 18px;
`;

// Small uppercase label above each receipt section (e.g. "ITEMS PURCHASED")
const ReceiptSectionLabel = styled.p`
  margin: 0 0 8px;
  font-size: 0.78rem;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
`;

// One row per cart item: name | qty | line total
const ReceiptLineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const ReceiptItemName = styled.span`
  color: #2f5a2a;
  font-size: 0.95rem;
  flex: 1;
`;

const ReceiptItemQty = styled.span`
  color: #7b8f7f;
  font-size: 0.85rem;
  margin: 0 12px;
`;

const ReceiptItemPrice = styled.span`
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.95rem;
`;

// Dashed line separator — gives a physical receipt look
const ReceiptDivider = styled.div`
  height: 2px;
  border-top: 2px dashed #e0ece0;
  margin: 16px 0;
`;

const ReceiptTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

const ReceiptTotalLabel = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: #2f5a2a;
`;

const ReceiptTotalAmount = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: #2f5a2a;
`;

// Delivery info rows (payment method, address, estimated days)
const ReceiptInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
`;

const ReceiptInfoLabel = styled.span`
  color: #7b8f7f;
  font-size: 0.9rem;
`;

// max-width + right-align prevents long addresses from overflowing
const ReceiptInfoValue = styled.span`
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
  max-width: 55%;
`;

// Receipt footer — thank-you message at the bottom of the receipt
const ReceiptFooter = styled.div`
  text-align: center;
  padding: 16px 28px 24px;
  color: #7b8f7f;
  font-size: 0.85rem;
  border-top: 2px dashed #e0ece0;
`;

// Row that holds the Print and Close buttons inside the modal
const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 28px 24px;
`;

const ModalPrintBtn = styled.button`
  flex: 1;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #245026; }
`;

const ModalCloseBtn = styled.button`
  flex: 1;
  background: #f0f7ee;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #d7efd9; }
`;

// ─── Payment label map ────────────────────────────────────────────────────────
// Maps the internal paymentMethod key (stored in DB/state) to a human-readable label
const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

// ─── Component ────────────────────────────────────────────────────────────────
// Receives order data via react-router location.state (passed from the checkout page).
// Expected state shape:
//   { orderGroupedBySeller: [{sellerId, items: [{id, quantity, listings: {...}}]}],
//     totalCost: number, paymentMethod: string, address: string, orderId: string[] }
const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Controls visibility of the receipt modal
  const [showReceipt, setShowReceipt] = useState(false);

  const {
    orderGroupedBySeller: cartItems,
    totalCost,
    paymentMethod,
    address,
    orderId,
  } = state || {};

  // Sum of all quantities across every seller group
  const totalCount = cartItems?.reduce(
    (sum, group) => sum + group.items.reduce((s, item) => s + item.quantity, 0),
    0,
  );

  // Number of distinct product lines (not total units)
  const totalProducts = cartItems?.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  // Cash orders take longer because payment is collected on delivery
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
            {/* ── Success banner ── */}
            <SuccessBanner>
              <CheckCircle>✓</CheckCircle>
              <SuccessTitle>Order Placed Successfully!</SuccessTitle>
              <SuccessSub>
                Thank you for your purchase. The seller will contact you
                shortly.
              </SuccessSub>
              {/* orderId is an array of UUIDs (one per seller); show only the first.
                  Slice to 8 chars so it stays readable as a short reference code. */}
              <OrderId>Order ID: {orderId[0]?.slice(0, 8).toUpperCase()}</OrderId>
            </SuccessBanner>

            {/* ── Order summary stats ── */}
            <SectionTitle>Order Summary</SectionTitle>
            <SummaryRow>
              <SummaryBlock>
                <SummaryLabel>Items purchased</SummaryLabel>
                <SummaryValue>{totalCount}</SummaryValue>
              </SummaryBlock>
              <SummaryBlock>
                <SummaryLabel>Products</SummaryLabel>
                <SummaryValue>{totalProducts}</SummaryValue>
              </SummaryBlock>
              <TotalBlock>
                <SummaryLabel>Total Paid</SummaryLabel>
                <SummaryValue>Kes {totalCost?.toLocaleString()}</SummaryValue>
              </TotalBlock>
            </SummaryRow>

            {/* ── Purchased items list ── */}
            <SectionTitle>Items</SectionTitle>
            <ItemList>
              {/* cartItems is grouped by seller — flatten with a nested map */}
              {cartItems?.map((group) =>
                group.items.map((item) => (
                  <CheckoutItem key={item.id}>
                    <ItemImage
                      src={item.listings?.image_url}
                      alt={item.listings?.title}
                    />
                    <ItemDetails>
                      <ItemName>{item.listings?.title}</ItemName>
                      <ItemMeta>
                        Kes {item.listings?.price} per {item.listings?.unit}
                      </ItemMeta>
                      <ItemMeta>Quantity: {item.quantity}</ItemMeta>
                      <ItemTotal>
                        Subtotal: Kes{" "}
                        {(
                          item.listings?.price * item.quantity
                        ).toLocaleString()}
                      </ItemTotal>
                    </ItemDetails>
                  </CheckoutItem>
                )),
              )}
            </ItemList>

            <Divider />

            {/* ── Delivery & payment details ── */}
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

            {/* Opens the receipt modal */}
            <ReceiptButton onClick={() => setShowReceipt(true)}>
              🧾 View Receipt
            </ReceiptButton>
            <PrimaryButton onClick={() => navigate("/list")}>
              Continue Shopping
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate("/mobile")}>
              Go Home
            </SecondaryButton>
          </Content>
        </Card>
      </Container>

      {/* ── Receipt modal ── rendered outside the card so it overlays the full page */}
      {showReceipt && (
        <>
          {/* Injects @media print styles that isolate #receipt-printable for printing */}
          <PrintStyles />

          {/* Clicking the backdrop closes the modal */}
          <ModalOverlay onClick={() => setShowReceipt(false)}>
            {/* stopPropagation prevents clicks inside the box from closing the modal */}
            <ModalBox onClick={(e) => e.stopPropagation()} id="receipt-printable">

              {/* Receipt top — store name + order reference */}
              <ReceiptHeader>
                <ReceiptLogo>Omindi</ReceiptLogo>
                <ReceiptTitle>Official Receipt</ReceiptTitle>
                <ReceiptMeta>Order #{orderId?.[0]?.slice(0, 8).toUpperCase()}</ReceiptMeta>
              </ReceiptHeader>

              <ReceiptBody>
                {/* Line items — same data as the confirmation page, compact format */}
                <ReceiptSection>
                  <ReceiptSectionLabel>Items Purchased</ReceiptSectionLabel>
                  {cartItems?.map((group) =>
                    group.items.map((item) => (
                      <ReceiptLineItem key={item.id}>
                        <ReceiptItemName>{item.listings?.title}</ReceiptItemName>
                        <ReceiptItemQty>x{item.quantity}</ReceiptItemQty>
                        <ReceiptItemPrice>
                          Kes {(item.listings?.price * item.quantity).toLocaleString()}
                        </ReceiptItemPrice>
                      </ReceiptLineItem>
                    ))
                  )}
                </ReceiptSection>

                <ReceiptDivider />

                {/* Grand total */}
                <ReceiptTotalRow>
                  <ReceiptTotalLabel>Total</ReceiptTotalLabel>
                  <ReceiptTotalAmount>Kes {totalCost?.toLocaleString()}</ReceiptTotalAmount>
                </ReceiptTotalRow>

                <ReceiptDivider />

                {/* Delivery info section */}
                <ReceiptSection>
                  <ReceiptSectionLabel>Delivery Info</ReceiptSectionLabel>
                  <ReceiptInfoRow>
                    <ReceiptInfoLabel>Payment</ReceiptInfoLabel>
                    <ReceiptInfoValue>{paymentLabels[paymentMethod] ?? paymentMethod}</ReceiptInfoValue>
                  </ReceiptInfoRow>
                  <ReceiptInfoRow>
                    <ReceiptInfoLabel>Address</ReceiptInfoLabel>
                    <ReceiptInfoValue>{address}</ReceiptInfoValue>
                  </ReceiptInfoRow>
                  <ReceiptInfoRow>
                    <ReceiptInfoLabel>Est. Delivery</ReceiptInfoLabel>
                    <ReceiptInfoValue>{estimatedDays} business days</ReceiptInfoValue>
                  </ReceiptInfoRow>
                </ReceiptSection>
              </ReceiptBody>

              <ReceiptFooter>Thank you for shopping with Omindi!</ReceiptFooter>

              {/* Print triggers window.print(); PrintStyles ensures only this modal prints */}
              <ModalActions id="receipt-actions">
                <ModalPrintBtn onClick={() => window.print()}>Print</ModalPrintBtn>
                <ModalCloseBtn onClick={() => setShowReceipt(false)}>Close</ModalCloseBtn>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        </>
      )}
    </>
  );
};

export default OrderConfirmation;
