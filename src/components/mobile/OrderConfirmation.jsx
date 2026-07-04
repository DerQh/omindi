import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils";
import { Banknote, Smartphone, CreditCard, Landmark, Wallet, Check, Phone, Truck, Home, X, Hourglass, Leaf } from "lucide-react";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, createGlobalStyle } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  70%  { transform: scale(1.12); }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PAYMENT_LABELS = {
  cash: "Cash on Delivery",
  mpesa: "M-Pesa",
  card: "Card Payment",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

const PAYMENT_ICON_MAP = {
  cash: Banknote,
  mpesa: Smartphone,
  card: CreditCard,
  mobile: Smartphone,
  bank: Landmark,
};

const STEPS = [
  { Icon: Check, label: "Order Placed" },
  { Icon: Phone, label: "Seller Confirms" },
  { Icon: Truck, label: "Out for Delivery" },
  { Icon: Home, label: "Delivered" },
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
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleString("en-KE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  const totalCount = groups?.reduce(
    (s, g) => s + g.items.reduce((ss, i) => ss + i.quantity, 0),
    0,
  );
  const totalProducts = groups?.reduce((s, g) => s + g.items.length, 0);
  const estimatedDays = paymentMethod === "cash" ? "2–4" : "1–3";

  const TAX_RATE = 0.16;
  const exVat = totalCost
    ? Math.round((totalCost / (1 + TAX_RATE)) * 100) / 100
    : 0;
  const vatAmount = totalCost ? Math.round((totalCost - exVat) * 100) / 100 : 0;
  const fmt = (n) =>
    n.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const shortId = orderId?.[0]?.slice(0, 8).toUpperCase();

  const handlePrint = () => {
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
      setTimeout(() => {
        win.print();
        win.close();
        setShowReceipt(false);
      }, 500);
    }, 300);
  };

  return (
    <>
      <AppNavbar />
      <Page>
        {/* ── Hero ── */}
        <Hero>
          <CheckCircle><Check size={28} color="white" /></CheckCircle>
          <HeroTitle>Order Placed!</HeroTitle>
          <HeroSub>Thank you — the seller will contact you shortly.</HeroSub>
          {shortId && <OrderIdBadge>Order #{shortId}</OrderIdBadge>}
        </Hero>

        {/* ── Content sheet ── */}
        <Sheet>
          <Inner>
            {/* ── What's next timeline ── */}
            <SectionLabel>What Happens Next</SectionLabel>
            <Timeline>
              {STEPS.map((step, i) => (
                <Step key={i}>
                  <StepDot $done={i === 0}><step.Icon size={14} /></StepDot>
                  {i < STEPS.length - 1 && <StepLine />}
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
                <StatNum>Kes {totalCost?.toLocaleString()}</StatNum>
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
                    &nbsp;
                    {group.items[0]?.listings?.profiles?.farm_name ||
                      group.items[0]?.listings?.profiles?.full_name ||
                      "Farmer"}
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
                      onError={(e) => {
                        e.target.style.background = "#eef7ee";
                        e.target.src = "";
                      }}
                    />
                    <ItemMeta>
                      <ItemName>{item.listings?.title}</ItemName>
                      <ItemSub>
                        Kes {formatPrice(item.listings?.price)}
                        {item.listings?.unit
                          ? ` / ${item.listings.unit}`
                          : ""}{" "}
                        × {item.quantity}
                      </ItemSub>
                    </ItemMeta>
                    <ItemTotal>
                      Kes {formatPrice((item.listings?.price ?? 0) * item.quantity)}
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
                <DeliveryLabel>
                  {(() => { const I = PAYMENT_ICON_MAP[paymentMethod] ?? Wallet; return <I size={14} style={{marginRight:4,verticalAlign:"middle"}} />; })()} Payment
                </DeliveryLabel>
                <DeliveryValue>
                  {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
                </DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Address</DeliveryLabel>
                <DeliveryValue>{address}</DeliveryValue>
              </DeliveryRow>
              <DeliveryRow>
                <DeliveryLabel>Est. delivery</DeliveryLabel>
                <DeliveryValue>{estimatedDays} business days</DeliveryValue>
              </DeliveryRow>
              <DeliveryRow $last>
                <DeliveryLabel>Next step</DeliveryLabel>
                <DeliveryValue>Seller will call to confirm</DeliveryValue>
              </DeliveryRow>
            </DeliveryCard>

            <Divider />

            {/* ── Actions ── */}
            <Actions id="receipt-actions">
              <ActionBtn $variant="ghost" onClick={() => setShowReceipt(true)}>
                View Receipt
              </ActionBtn>
              <ActionBtn $variant="ghost" onClick={handlePrint}>
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
            <ModalBox
              onClick={(e) => e.stopPropagation()}
              id="receipt-printable"
            >
              <DragHandle onClick={() => setShowReceipt(false)} title="Close" />

              <ReceiptBand>
                <ReceiptCloseX
                  onClick={() => setShowReceipt(false)}
                  title="Close"
                >
                  <X size={18} />
                </ReceiptCloseX>
                <ReceiptLogoRow>
                  <ReceiptLogoImg src="/afarmer.webp" alt="Omindi" />
                  <ReceiptLogoText>
                    <ReceiptBrandName>Omindi FarmHouse</ReceiptBrandName>
                    <ReceiptBrandSub>Alendu, Kisumu · Kenya</ReceiptBrandSub>
                  </ReceiptLogoText>
                  <ReceiptStatusBadge $cash={paymentMethod === "cash"}>
                    {paymentMethod === "cash" ? <><Hourglass size={12} style={{marginRight:3}} /> Pending</> : <><Check size={12} style={{marginRight:3}} /> Paid</>}
                  </ReceiptStatusBadge>
                </ReceiptLogoRow>
                <ReceiptTitle>TAX INVOICE</ReceiptTitle>
                <ReceiptKraPIN>
                  KRA PIN: P051234567X · VAT Reg. No. 0123456Z
                </ReceiptKraPIN>
              </ReceiptBand>

              <TearEdge />

              <ReceiptBody>
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
                    <ReceiptMetaValue>
                      {PAYMENT_ICONS[paymentMethod]}{" "}
                      {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
                    </ReceiptMetaValue>
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
                      <ReceiptMetaValue>
                        {String(txnId).slice(0, 16).toUpperCase()}
                      </ReceiptMetaValue>
                    </ReceiptMetaItem>
                  )}
                </ReceiptMetaGrid>

                <ReceiptDivider />

                <ReceiptSectionLabel>Items Purchased</ReceiptSectionLabel>
                {groups?.map((group) => (
                  <div key={group.seller_id}>
                    <ReceiptSellerRow>
                      {group.items[0]?.listings?.profiles?.farm_name ||
                        group.items[0]?.listings?.profiles?.full_name ||
                        "Farmer"}
                    </ReceiptSellerRow>
                    {group.items.map((item) => (
                      <ReceiptLine key={item.id}>
                        <ReceiptItemName>
                          {item.listings?.title}
                        </ReceiptItemName>
                        <ReceiptItemQty>×{item.quantity}</ReceiptItemQty>
                        <ReceiptItemPrice>
                          Kes {formatPrice((item.listings?.price ?? 0) * item.quantity)}
                        </ReceiptItemPrice>
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
                <ReceiptVatNote>
                  VAT Amount: Kes {fmt(vatAmount)} · Rate 16% · Standard Rated
                </ReceiptVatNote>

                <ReceiptDivider />

                <ReceiptSectionLabel>Delivery</ReceiptSectionLabel>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Address</ReceiptInfoLabel>
                  <ReceiptInfoValue>{address}</ReceiptInfoValue>
                </ReceiptInfoRow>
                <ReceiptInfoRow>
                  <ReceiptInfoLabel>Est. Arrival</ReceiptInfoLabel>
                  <ReceiptInfoValue>
                    {estimatedDays} business days
                  </ReceiptInfoValue>
                </ReceiptInfoRow>

                <ReceiptBarcodeWrap>
                  <ReceiptBarcode>
                    {Array.from({ length: 60 }).map((_, i) => {
                      const seed =
                        (shortId?.charCodeAt(i % (shortId?.length || 1)) ??
                          65) + i;
                      const isBar = seed % 3 !== 0;
                      const width = seed % 5 === 0 ? 3 : seed % 7 === 0 ? 2 : 1;
                      return isBar ? (
                        <ReceiptBar key={i} $w={width} />
                      ) : (
                        <ReceiptGap key={i} $w={width} />
                      );
                    })}
                  </ReceiptBarcode>
                  <ReceiptBarcodeNum>{shortId}</ReceiptBarcodeNum>
                </ReceiptBarcodeWrap>
              </ReceiptBody>

              <ReceiptFooter>
                <Leaf size={14} color="#4a7c45" />
                <span>Thank you for supporting local farmers!</span>
                <span>omindi.farm</span>
              </ReceiptFooter>

              {/* Close / Print buttons inside the modal */}
              <ReceiptActionsRow id="receipt-actions">
                <ReceiptActionBtn $ghost onClick={() => setShowReceipt(false)}>
                  Close
                </ReceiptActionBtn>
                <ReceiptActionBtn onClick={handlePrint}>Print</ReceiptActionBtn>
              </ReceiptActionsRow>
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
  background: #f4f8f4;
`;

// ── Hero ──

const Hero = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%);
  padding: 48px 24px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
`;

const CheckCircle = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #fff;
  color: #2f5a2a;
  font-size: 2.1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  animation: ${popIn} 0.45s ease forwards;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.14);
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
`;

const HeroSub = styled.p`
  margin: 0;
  font-size: 0.93rem;
  color: rgba(255, 255, 255, 0.82);
  max-width: 280px;
  line-height: 1.45;
`;

const OrderIdBadge = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px 16px;
  border-radius: 999px;
  letter-spacing: 0.08em;
  margin-top: 6px;
`;

// ── Sheet ──

const Sheet = styled.div`
  background: #fff;
  border-radius: 24px 24px 0 0;
  margin-top: -22px;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 260px);
  padding-bottom: 56px;
`;

const Inner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 0;
  animation: ${fadeUp} 0.35s ease;
`;

const SectionLabel = styled.h3`
  margin: 0 0 16px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #8ea88e;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "";
    width: 3px;
    height: 12px;
    background: #2f5a2a;
    border-radius: 999px;
    flex-shrink: 0;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 28px 0;
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
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ $done }) => ($done ? "#2f5a2a" : "#f4f9f2")};
  border: 2px solid ${({ $done }) => ($done ? "#2f5a2a" : "#d7ead7")};
  color: ${({ $done }) => ($done ? "#fff" : "#b0c8b0")};
  font-size: ${({ $done }) => ($done ? "1rem" : "0.88rem")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
  box-shadow: ${({ $done }) =>
    $done ? "0 2px 10px rgba(47, 90, 42, 0.28)" : "none"};
`;

const StepLine = styled.div`
  position: absolute;
  top: 19px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e0ece0;
  z-index: 0;
`;

const StepLabel = styled.span`
  margin-top: 8px;
  font-size: 0.68rem;
  font-weight: ${({ $done }) => ($done ? "700" : "500")};
  color: ${({ $done }) => ($done ? "#2f5a2a" : "#8ea88e")};
  text-align: center;
  line-height: 1.3;
`;

// ── Stats ──

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const StatBlock = styled.div`
  background: ${({ $green }) => ($green ? "#eef7ee" : "#f8faf6")};
  border: 1px solid ${({ $green }) => ($green ? "#cde5cf" : "#edf0ed")};
  border-radius: 14px;
  padding: 14px 10px;
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #2f5a2a;
  margin-bottom: 4px;
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 0.68rem;
  font-weight: 600;
  color: #8ea88e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ── Items ──

const SellerGroup = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e8f0e8;
  overflow: hidden;
  margin-bottom: 12px;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  background: #f7fbf4;
  border-bottom: 1px solid #f0f7ee;
`;

const GroupSellerName = styled.span`
  flex: 1;
  font-size: 0.86rem;
  font-weight: 700;
  color: #1a3318;
`;

const GroupSubtotal = styled.span`
  font-weight: 700;
  color: #2f5a2a;
  font-size: 0.84rem;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f5f9f5")};
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
  color: #8ea88e;
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
  border-radius: 14px;
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
  color: #8ea88e;
  font-weight: 500;
  flex-shrink: 0;
`;

const DeliveryValue = styled.span`
  font-size: 0.84rem;
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
  padding: 14px;
  border-radius: 14px;
  font-size: 0.93rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.15s,
    border-color 0.15s;

  ${({ $variant }) =>
    $variant === "primary" &&
    `
    background: #2f5a2a; color: white; border: none;
    &:hover { background: #245026; }
  `}
  ${({ $variant }) =>
    $variant === "ghost" &&
    `
    background: #f4f9f2; color: #2f5a2a;
    border: 1.5px solid #d0e5cd;
    &:hover { background: #e8f5e6; border-color: #2f5a2a; }
  `}
`;

// ── Receipt modal ──

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: ${fadeIn} 0.18s ease;
`;

const ModalBox = styled.div`
  background: #fafcfa;
  border-radius: 20px;
  max-width: 400px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
  animation: ${fadeUp} 0.22s ease;
`;

const DragHandle = styled.div`
  width: 38px;
  height: 4px;
  background: #d1d5db;
  border-radius: 999px;
  margin: 10px auto 0;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #9ca3af;
  }
`;

const ReceiptBand = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 100%);
  padding: 18px 20px 20px;
  position: relative;
`;

const ReceiptLogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const ReceiptLogoImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.4);
`;

const ReceiptLogoText = styled.div`
  flex: 1;
`;
const ReceiptBrandName = styled.div`
  font-size: 0.93rem;
  font-weight: 800;
  color: #fff;
`;
const ReceiptBrandSub = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.68);
  margin-top: 1px;
`;

const ReceiptStatusBadge = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $cash }) =>
    $cash ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.22)"};
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  white-space: nowrap;
`;

const ReceiptTitle = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: rgba(255, 255, 255, 0.62);
  text-transform: uppercase;
  text-align: center;
`;

const ReceiptKraPIN = styled.div`
  font-size: 0.63rem;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  margin-top: 3px;
  letter-spacing: 0.03em;
`;

const ReceiptCloseX = styled.button`
  position: absolute;
  top: 12px;
  right: 14px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: rgba(255, 255, 255, 0.7);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s,
    color 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.28);
    color: #fff;
  }
`;

const TearEdge = styled.div`
  height: 12px;
  background: repeating-linear-gradient(
    90deg,
    #fafcfa 0px,
    #fafcfa 10px,
    transparent 10px,
    transparent 12px
  );
  margin-top: -1px;
`;

const ReceiptBody = styled.div`
  padding: 14px 20px 4px;
`;

const ReceiptMetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 4px;
`;

const ReceiptMetaItem = styled.div`
  background: #fff;
  border: 1px solid #e8f0e8;
  border-radius: 10px;
  padding: 8px 10px;
`;

const ReceiptMetaLabel = styled.div`
  font-size: 0.65rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
`;

const ReceiptMetaValue = styled.div`
  font-size: 0.81rem;
  color: #1a3318;
  font-weight: 700;
`;

const ReceiptDivider = styled.div`
  border: none;
  border-top: 2px dashed #e0ece0;
  margin: 12px 0;
`;

const ReceiptSectionLabel = styled.p`
  margin: 0 0 8px;
  font-size: 0.65rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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

const ReceiptItemName = styled.span`
  flex: 1;
  font-size: 0.84rem;
  color: #1a3318;
`;
const ReceiptItemQty = styled.span`
  font-size: 0.76rem;
  color: #9ca3af;
  margin: 0 10px;
`;
const ReceiptItemPrice = styled.span`
  font-size: 0.84rem;
  font-weight: 700;
  color: #2f5a2a;
`;

const ReceiptTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 0.84rem;
  color: #6b7280;
`;

const ReceiptFree = styled.span`
  color: #16a34a;
  font-weight: 700;
`;

const ReceiptVatNote = styled.div`
  font-size: 0.66rem;
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

const ReceiptInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
`;
const ReceiptInfoLabel = styled.span`
  font-size: 0.81rem;
  color: #9ca3af;
`;
const ReceiptInfoValue = styled.span`
  font-size: 0.81rem;
  font-weight: 600;
  color: #1a3318;
  text-align: right;
  max-width: 55%;
`;

const ReceiptBarcodeWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0 6px;
  gap: 6px;
`;

const ReceiptBarcode = styled.div`
  display: flex;
  align-items: stretch;
  height: 68px;
  background: #fff;
  padding: 0 2px;
`;

const ReceiptBar = styled.div`
  width: ${({ $w }) => $w ?? 1}px;
  background: #1a3318;
  flex-shrink: 0;
`;

const ReceiptGap = styled.div`
  width: ${({ $w }) => ($w ?? 1) + 1}px;
  background: #fff;
  flex-shrink: 0;
`;

const ReceiptBarcodeNum = styled.div`
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  color: #9ca3af;
  font-weight: 600;
`;

const ReceiptFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 14px;
  border-top: 2px dashed #e0ece0;
  font-size: 0.7rem;
  color: #9ca3af;
  gap: 8px;
`;

const ReceiptActionsRow = styled.div`
  display: flex;
  gap: 10px;
  padding: 0 20px 18px;
`;

const ReceiptActionBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  ${({ $ghost }) =>
    $ghost
      ? `background: #f4f9f2; color: #2f5a2a; border: 1.5px solid #d0e5cd;
         &:hover { background: #e8f5e6; }`
      : `background: #2f5a2a; color: white; border: none;
         &:hover { background: #245026; }`}
`;
