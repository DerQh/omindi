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
  cash:   "Cash on Delivery",
  mpesa:  "M-Pesa",
  card:   "Card Payment",
  mobile: "Mobile Money",
  bank:   "Bank Transfer",
};

const PAYMENT_ICONS = {
  cash:   "💵",
  mpesa:  "📱",
  card:   "💳",
  mobile: "📲",
  bank:   "🏦",
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
    phone,
    purchaseDate,
    txnId,
  } = state || {};

  const formattedDate = purchaseDate
    ? new Date(purchaseDate).toLocaleString("en-KE", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : new Date().toLocaleString("en-KE", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });

  const totalCount = groups?.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );
  const totalProducts = groups?.reduce((s, g) => s + g.items.length, 0);
  const estimatedDays = paymentMethod === "cash" ? "2–4" : "1–3";

  // VAT calculation — prices are VAT-inclusive at Kenya's standard 16% rate.
  const TAX_RATE   = 0.16;
  const exVat      = totalCost ? Math.round((totalCost / (1 + TAX_RATE)) * 100) / 100 : 0;
  const vatAmount  = totalCost ? Math.round((totalCost - exVat) * 100) / 100 : 0;
  const fmt        = (n) => n.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                  <GroupSellerName>
                    Sold by, {group.items[0]?.listings?.profiles?.farm_name || group.items[0]?.listings?.profiles?.full_name || "Farmer"}
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
              <ActionBtn $variant="ghost" onClick={() => {
                setShowReceipt(true);
                setTimeout(() => {
                  const el = document.getElementById("receipt-printable");
                  if (!el) return;
                  const win = window.open("", "_blank");
                  win.document.write(`<html><head><title>Receipt-${shortId}</title>
                    <style>body{margin:0;font-family:sans-serif;background:#fafcfa;}
                    #receipt-printable{max-width:400px;margin:0 auto;}</style></head>
                    <body>${el.innerHTML}</body></html>`);
                  win.document.close();
                  win.focus();
                  setTimeout(() => { win.print(); win.close(); setShowReceipt(false); }, 500);
                }, 300);
              }}>
                 Download Receipt PDF
              </ActionBtn>
              <ActionBtn $variant="primary" onClick={() => navigate("/list")}>
                Continue Shopping
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
            <ModalBox onClick={(e) => e.stopPropagation()} id="receipt-printable">

              {/* Drag handle — tap/click to close, visually signals dismissal */}
              <DragHandle onClick={() => setShowReceipt(false)} title="Close" />

              {/* Green header band with logo */}
              <ReceiptBand>
                <ReceiptCloseX onClick={() => setShowReceipt(false)} title="Close">✕</ReceiptCloseX>
                <ReceiptLogoRow>
                  <ReceiptLogoImg src="/afarmer.webp" alt="Omindi" />
                  <ReceiptLogoText>
                    <ReceiptBrandName>Omindi FarmHouse</ReceiptBrandName>
                    <ReceiptBrandSub>Alendu, Kisumu · Kenya</ReceiptBrandSub>
                  </ReceiptLogoText>
                  <ReceiptStatusBadge $cash={paymentMethod === "cash"}>
                    {paymentMethod === "cash" ? "⏳ Pending" : "✓ Paid"}
                  </ReceiptStatusBadge>
                </ReceiptLogoRow>
                <ReceiptTitle>TAX INVOICE</ReceiptTitle>
                <ReceiptKraPIN>KRA PIN: P051234567X · VAT Reg. No. 0123456Z</ReceiptKraPIN>
              </ReceiptBand>

              {/* Jagged tear edge */}
              <TearEdge />

              <ReceiptBody>
                {/* Meta grid */}
                <ReceiptMetaGrid>
                  <ReceiptMetaItem>
                    <ReceiptMetaLabel>Order No.</ReceiptMetaLabel>
                    <ReceiptMetaValue># {shortId}</ReceiptMetaValue>
                  </ReceiptMetaItem>
                  <ReceiptMetaItem>
                    <ReceiptMetaLabel>Date</ReceiptMetaLabel>
                    <ReceiptMetaValue>{formattedDate}</ReceiptMetaValue>
                  </ReceiptMetaItem>
                  <ReceiptMetaItem>
                    <ReceiptMetaLabel>Payment</ReceiptMetaLabel>
                    <ReceiptMetaValue>{PAYMENT_ICONS[paymentMethod]} {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}</ReceiptMetaValue>
                  </ReceiptMetaItem>
                  {phone && (
                    <ReceiptMetaItem>
                      <ReceiptMetaLabel>Phone</ReceiptMetaLabel>
                      <ReceiptMetaValue>{phone}</ReceiptMetaValue>
                    </ReceiptMetaItem>
                  )}
                  {txnId && (
                    <ReceiptMetaItem style={{ gridColumn: "1 / -1" }}>
                      <ReceiptMetaLabel>Txn Reference</ReceiptMetaLabel>
                      <ReceiptMetaValue>{String(txnId).slice(0, 16).toUpperCase()}</ReceiptMetaValue>
                    </ReceiptMetaItem>
                  )}
                </ReceiptMetaGrid>

                <ReceiptDivider />

                {/* Items */}
                <ReceiptSectionLabel>Items Purchased</ReceiptSectionLabel>
                {groups?.map((group) => (
                  <div key={group.seller_id}>
                    <ReceiptSellerRow>🏪 {group.items[0]?.listings?.profiles?.farm_name || group.items[0]?.listings?.profiles?.full_name || "Farmer"}</ReceiptSellerRow>
                    {group.items.map((item) => (
                      <ReceiptLine key={item.id}>
                        <ReceiptItemName>{item.listings?.title}</ReceiptItemName>
                        <ReceiptItemQty>×{item.quantity}</ReceiptItemQty>
                        <ReceiptItemPrice>Kes {(item.listings?.price * item.quantity).toLocaleString()}</ReceiptItemPrice>
                      </ReceiptLine>
                    ))}
                  </div>
                ))}

                <ReceiptDivider />

                <ReceiptTotalRow>
                  <span>Subtotal (ex-VAT)</span>
                  <span>Kes {fmt(exVat)}</span>
                </ReceiptTotalRow>
                <ReceiptTotalRow>
                  <span>VAT @ 16%</span>
                  <span>Kes {fmt(vatAmount)}</span>
                </ReceiptTotalRow>
                <ReceiptTotalRow>
                  <span>Delivery</span>
                  <ReceiptFree>Free</ReceiptFree>
                </ReceiptTotalRow>
                <ReceiptGrandRow>
                  <span>Total (inc. VAT)</span>
                  <ReceiptTotalAmt>Kes {fmt(totalCost ?? 0)}</ReceiptTotalAmt>
                </ReceiptGrandRow>
                <ReceiptVatNote>VAT Amount: Kes {fmt(vatAmount)} · Rate 16% · Standard Rated</ReceiptVatNote>

                <ReceiptDivider />

                <ReceiptSectionLabel>Delivery</ReceiptSectionLabel>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Address</ReceiptInfoLabel>
                  <ReceiptInfoValue>{address}</ReceiptInfoValue>
                </ReceiptInfoRow>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Est. Arrival</ReceiptInfoLabel>
                  <ReceiptInfoValue>{estimatedDays} business days</ReceiptInfoValue>
                </ReceiptInfoRow>

                {/* Barcode strip */}
                <ReceiptBarcodeWrap>
                  <ReceiptBarcode>
                    {/* Deterministic bar/space pattern seeded from shortId — mimics Code128 */}
                    {Array.from({ length: 60 }).map((_, i) => {
                      const seed = (shortId?.charCodeAt(i % (shortId?.length || 1)) ?? 65) + i;
                      const isBar = seed % 3 !== 0; // ~2/3 bars, 1/3 gaps
                      const width = seed % 5 === 0 ? 3 : seed % 7 === 0 ? 2 : 1;
                      return isBar ? <ReceiptBar key={i} $w={width} /> : <ReceiptGap key={i} $w={width} />;
                    })}
                  </ReceiptBarcode>
                  <ReceiptBarcodeNum>{shortId}</ReceiptBarcodeNum>
                </ReceiptBarcodeWrap>
              </ReceiptBody>

              <ReceiptFooter>
                <span>🌿</span>
                <span>Thank you for supporting local farmers!</span>
                <span>omindi.farm</span>
              </ReceiptFooter>

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
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalBox = styled.div`
  background: #fafcfa;
  border-radius: 18px;
  max-width: 400px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.22);
  animation: ${fadeUp} 0.25s ease;
`;

/* Green header band */
const ReceiptBand = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 100%);
  padding: 20px 20px 22px;
  border-radius: 18px 18px 0 0;
  position: relative;
`;

const ReceiptLogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const ReceiptLogoImg = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.4);
`;

const ReceiptLogoText = styled.div`flex: 1;`;
const ReceiptBrandName = styled.div`font-size: 0.95rem; font-weight: 800; color: white;`;
const ReceiptBrandSub  = styled.div`font-size: 0.72rem; color: rgba(255,255,255,0.7); margin-top: 1px;`;

const ReceiptStatusBadge = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $cash }) => ($cash ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)")};
  color: white;
  border: 1px solid rgba(255,255,255,0.35);
  white-space: nowrap;
`;

const ReceiptTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  text-align: center;
`;

const ReceiptKraPIN = styled.div`
  font-size: 0.65rem;
  color: rgba(255,255,255,0.5);
  text-align: center;
  margin-top: 3px;
  letter-spacing: 0.03em;
`;

/* Tear edge — simulates a torn receipt */
const TearEdge = styled.div`
  height: 12px;
  background: repeating-linear-gradient(
    90deg,
    #fafcfa 0px, #fafcfa 10px,
    transparent 10px, transparent 12px
  );
  margin-top: -1px;
`;

const ReceiptBody = styled.div`padding: 16px 20px 4px;`;

const ReceiptMetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 4px;
`;

const ReceiptMetaItem = styled.div`
  background: white;
  border: 1px solid #e8f0e8;
  border-radius: 10px;
  padding: 8px 10px;
`;

const ReceiptMetaLabel = styled.div`font-size: 0.68rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;`;
const ReceiptMetaValue = styled.div`font-size: 0.82rem; color: #1a3318; font-weight: 700;`;

const ReceiptDivider = styled.div`
  border: none;
  border-top: 2px dashed #e0ece0;
  margin: 14px 0;
`;

const ReceiptSectionLabel = styled.p`
  margin: 0 0 8px;
  font-size: 0.68rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
`;

const ReceiptSellerRow = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  color: #2f5a2a;
  padding: 4px 0 6px;
`;

const ReceiptLine = styled.div`
  display: flex;
  align-items: baseline;
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const ReceiptItemName  = styled.span`flex: 1; font-size: 0.85rem; color: #1a3318;`;
const ReceiptItemQty   = styled.span`font-size: 0.78rem; color: #9ca3af; margin: 0 10px;`;
const ReceiptItemPrice = styled.span`font-size: 0.85rem; font-weight: 700; color: #2f5a2a;`;

const ReceiptTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 0.85rem;
  color: #6b7280;
`;

const ReceiptFree = styled.span`color: #16a34a; font-weight: 700;`;

const ReceiptVatNote = styled.div`
  font-size: 0.68rem;
  color: #9ca3af;
  background: #f8faf6;
  border: 1px dashed #d7edd9;
  border-radius: 6px;
  padding: 5px 8px;
  margin-top: 8px;
  text-align: center;
`;

const ReceiptGrandRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 4px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a3318;
  border-top: 2px solid #e8f0e8;
  margin-top: 4px;
`;

const ReceiptTotalAmt = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const ReceiptInfoRow = styled.div`display: flex; justify-content: space-between; padding: 4px 0;`;
const ReceiptInfoLabel = styled.span`font-size: 0.82rem; color: #9ca3af;`;
const ReceiptInfoValue = styled.span`font-size: 0.82rem; font-weight: 600; color: #1a3318; text-align: right; max-width: 55%;`;

/* Barcode strip */
const ReceiptBarcodeWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 18px 0 8px;
  gap: 6px;
`;

const ReceiptBarcode = styled.div`
  display: flex;
  align-items: stretch;
  height: 72px;
  background: white;
  padding: 0 2px;
`;

const ReceiptBar = styled.div`
  width: ${({ $w }) => $w ?? 1}px;
  background: #1a3318;
  flex-shrink: 0;
`;

const ReceiptGap = styled.div`
  width: ${({ $w }) => ($w ?? 1) + 1}px;
  background: white;
  flex-shrink: 0;
`;

const ReceiptBarcodeNum = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  color: #9ca3af;
  font-weight: 600;
`;

const ReceiptFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 16px;
  border-top: 2px dashed #e0ece0;
  font-size: 0.72rem;
  color: #9ca3af;
  gap: 8px;
`;

// Pill handle at top of modal — subtle close affordance like a bottom sheet
const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #d1d5db;
  border-radius: 999px;
  margin: 10px auto 0;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #9ca3af; }
`;

// Tiny ✕ floating in top-right of the green band
const ReceiptCloseX = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  background: rgba(255,255,255,0.15);
  border: none;
  color: rgba(255,255,255,0.7);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  &:hover { background: rgba(255,255,255,0.3); color: white; }
`;

const ModalPdfBtn = styled.button`
  flex: 1;
  background: #1d4ed8;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #1e40af; }
`;

const ModalCloseBtn = styled.button`
  flex: 1;
  background: white;
  color: #2f5a2a;
  border: 1.5px solid #cde5cf;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #eef7ee; }
`;
