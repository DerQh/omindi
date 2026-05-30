import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useAddOrder, useAddOrderItems } from "../../hooks/useOrders";
import { useCartItemsAllDelete } from "../../hooks/useCart";
import { useNotifyOrder } from "../../hooks/useNotification";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Payment options ──────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { value: "cash",   label: "Cash on Delivery", icon: "💵" },
  { value: "mobile", label: "Mobile Money",      icon: "📱" },
  { value: "bank",   label: "Bank Transfer",     icon: "🏦" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Checkout = () => {
  const navigate        = useNavigate();
  const { state }       = useLocation();
  const { user }        = useAuth();
  const { cartItems, totalCost } = state;

  const { mutate:      mutateDeleteAllOrders } = useCartItemsAllDelete();
  const { mutateAsync: mutateAddOrder,   isPending: isPendingOrder } = useAddOrder();
  const { mutateAsync: mutateAddItems  }                             = useAddOrderItems();
  const { mutateAsync: mutateNotify    }                             = useNotifyOrder();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address,       setAddress]       = useState("");
  const [phone,         setPhone]         = useState("");
  const [notes,         setNotes]         = useState("");
  const [errors,        setErrors]        = useState({});

  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const orderGroupedBySeller = Object.values(
    cartItems.reduce((acc, row) => {
      const sid = row.listings.seller_id;
      if (!acc[sid]) acc[sid] = { seller_id: sid, items: [], totalCost: 0 };
      acc[sid].items.push(row);
      acc[sid].totalCost += (row.listings.price ?? 0) * (row.quantity ?? 0);
      return acc;
    }, {}),
  );

  const validate = () => {
    const e = {};
    if (!address.trim())    e.address = "Delivery address is required.";
    if (!phone.trim())      e.phone   = "Mobile number is required.";
    else if (!/^(07|01)\d{8}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Kenyan number e.g. 0712 345 678";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;

    const orderIds = [];
    for (const group of orderGroupedBySeller) {
      const rows = await mutateAddOrder({
        user_id:          user?.id,
        payment_method:   paymentMethod,
        delivery_address: address,
        total_cost:       group.totalCost,
        mobile_no:        phone,
      });
      const orderId = rows?.[0]?.id;
      orderIds.push(orderId);

      mutateNotify({
        user_id: user?.id,
        orderId,
        status:  "pending",
        total:   group.totalCost,
        payment: paymentMethod,
      });

      for (const item of group.items) {
        await mutateAddItems({
          order_id:          orderId,
          listing_id:        item.listing_id,
          quantity:          item.quantity,
          price_at_purchase: item.listings?.price,
        });
      }
    }

    mutateDeleteAllOrders({ user_id: user?.id });

    navigate("/order-confirmation", {
      state: { orderGroupedBySeller, totalCost, paymentMethod, address, orderId: orderIds },
    });
  };

  if (cartItems?.length === 0)
    return (
      <>
        <AppNavbar />
        <EmptyWrap>
          <EmptyCard>
            <span>🛒</span>
            <p>No items ready for checkout.</p>
            <GoBackBtn onClick={() => navigate("/list")}>Browse Listings</GoBackBtn>
          </EmptyCard>
        </EmptyWrap>
      </>
    );

  return (
    <>
      <AppNavbar />
      <Page>

        {/* ── Header ── */}
        <PageHeader>
          <HeaderInner>
            <RoundBack onClick={() => navigate(-1)} aria-label="Go back">←</RoundBack>
            <HeaderTitle>Checkout</HeaderTitle>
            <HeaderMeta>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</HeaderMeta>
          </HeaderInner>
        </PageHeader>

        {/* ── Body ── */}
        <Body>
          <TwoCol>

            {/* ── Left: order items grouped by seller ── */}
            <LeftCol>
              <ColTitle>
                Your Order
                {orderGroupedBySeller.length > 1 && (
                  <SellerCountNote> · {orderGroupedBySeller.length} sellers</SellerCountNote>
                )}
              </ColTitle>

              {orderGroupedBySeller.map((group, gi) => (
                <ItemsCard key={group.seller_id}>
                  <SellerHeader>
                    <SellerIcon>🏪</SellerIcon>
                    <SellerHeaderName>
                      {group.items[0]?.listings?.seller_name || "Farmer"}
                    </SellerHeaderName>
                    <SellerSubtotal>Kes {group.totalCost.toLocaleString()}</SellerSubtotal>
                  </SellerHeader>

                  {group.items.map((item, idx) => (
                    <OrderRow key={item.id} $last={idx === group.items.length - 1}>
                      <OrderImg src={item.listings?.image_url} alt={item.listings?.title} />
                      <OrderMeta>
                        <OrderName>{item.listings?.title}</OrderName>
                        <OrderSub>Kes {item.listings?.price} × {item.quantity}</OrderSub>
                      </OrderMeta>
                      <OrderLineTotal>
                        Kes {((item.listings?.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                      </OrderLineTotal>
                    </OrderRow>
                  ))}
                </ItemsCard>
              ))}

              <TotalCard>
                <TotalRow>
                  <TotalLabel>Total ({totalCount} items)</TotalLabel>
                  <TotalAmount>Kes {totalCost?.toLocaleString()}</TotalAmount>
                </TotalRow>
              </TotalCard>
            </LeftCol>

            {/* ── Right: form ── */}
            <RightCol>

              {/* Payment method */}
              <FormCard>
                <ColTitle>Payment Method</ColTitle>
                <PaymentGrid>
                  {PAYMENT_METHODS.map((method) => (
                    <PaymentCard
                      key={method.value}
                      $active={paymentMethod === method.value}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <PayIcon>{method.icon}</PayIcon>
                      <PayLabel>{method.label}</PayLabel>
                      <PayRadio
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value)}
                      />
                    </PaymentCard>
                  ))}
                </PaymentGrid>
              </FormCard>

              {/* Delivery details */}
              <FormCard>
                <ColTitle>Delivery Details</ColTitle>

                <Field>
                  <FieldLabel htmlFor="address">Delivery Address</FieldLabel>
                  <FieldTextarea
                    id="address"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
                    placeholder="Enter your full delivery address…"
                    $error={!!errors.address}
                  />
                  {errors.address && <FieldError>{errors.address}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Mobile Number</FieldLabel>
                  <FieldInput
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                    placeholder="e.g. 0712 345 678"
                    $error={!!errors.phone}
                  />
                  {errors.phone && <FieldError>{errors.phone}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="notes">
                    Delivery Notes <OptionalTag>(optional)</OptionalTag>
                  </FieldLabel>
                  <FieldTextarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave at the gate, call on arrival…"
                  />
                </Field>
              </FormCard>

              {/* Confirm */}
              <ConfirmBtn onClick={handleCheckout} disabled={isPendingOrder}>
                {isPendingOrder ? "Placing order…" : `Confirm Order `}
              </ConfirmBtn>
              <CancelBtn onClick={() => navigate(-1)}>Back to Cart</CancelBtn>

            </RightCol>
          </TwoCol>
        </Body>
      </Page>
    </>
  );
};

export default Checkout;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
`;

const PageHeader = styled.div`
  background: white;
  border-bottom: 1px solid #e8f0e8;
  padding: 0 24px;
`;

const HeaderInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RoundBack = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid #e8f0e8;
  background: white;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover { background: #f0f7ee; }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a3318;
  flex: 1;
`;

const HeaderMeta = styled.span`
  background: #eef7ee;
  color: #2f5a2a;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #cde5cf;
`;

const Body = styled.div`
  padding: 24px;
  padding-bottom: 56px;
`;

const TwoCol = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol  = styled.div`display: flex; flex-direction: column; gap: 16px;`;
const RightCol = styled.div`display: flex; flex-direction: column; gap: 16px;`;

const ColTitle = styled.h2`
  margin: 0 0 14px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

/* ── Order items ── */

const SellerCountNote = styled.span`
  font-size: 0.78rem;
  font-weight: 500;
  color: #7b8f7f;
  text-transform: none;
  letter-spacing: 0;
`;

const ItemsCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  overflow: hidden;
  margin-bottom: 12px;
`;

const SellerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: #f8faf6;
  border-bottom: 1px solid #f0f7ee;
`;

const SellerIcon = styled.span`font-size: 0.95rem;`;

const SellerHeaderName = styled.span`
  flex: 1;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a3318;
`;

const SellerSubtotal = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: #2f5a2a;
`;

const TotalCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  overflow: hidden;
`;

const OrderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f0f7ee")};
`;

const OrderImg = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  background: #eef7ee;
  flex-shrink: 0;
`;

const OrderMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderName = styled.p`
  margin: 0 0 3px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderSub = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #7b8f7f;
`;

const OrderLineTotal = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: #2f5a2a;
  flex-shrink: 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background: #f8faf6;
`;

const TotalLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #7b8f7f;
`;

const TotalAmount = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: #2f5a2a;
`;

/* ── Form ── */

const FormCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  padding: 20px;
`;

const PaymentGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PaymentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid ${({ $active }) => ($active ? "#2f5a2a" : "#e8f0e8")};
  background: ${({ $active }) => ($active ? "#eef7ee" : "white")};
  cursor: pointer;
  transition: all 0.15s;

  &:hover { border-color: #2f5a2a; }
`;

const PayIcon = styled.span`font-size: 1.2rem; flex-shrink: 0;`;

const PayLabel = styled.span`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a3318;
`;

const PayRadio = styled.input`
  accent-color: #2f5a2a;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

const Field = styled.div`
  margin-bottom: 16px;
  &:last-child { margin-bottom: 0; }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a3318;
  margin-bottom: 8px;
`;

const inputBase = `
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid;
  font-size: 0.95rem;
  color: #1a3318;
  background: #fafcfa;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
  font-family: inherit;
`;

const FieldInput = styled.input`
  ${inputBase}
  border-color: ${({ $error }) => ($error ? "#e63946" : "#e8f0e8")};
  &:focus { border-color: ${({ $error }) => ($error ? "#e63946" : "#2f5a2a")}; }
`;

const FieldTextarea = styled.textarea`
  ${inputBase}
  border-color: ${({ $error }) => ($error ? "#e63946" : "#e8f0e8")};
  &:focus { border-color: ${({ $error }) => ($error ? "#e63946" : "#2f5a2a")}; }
  min-height: 88px;
  resize: vertical;
`;

const OptionalTag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #7b8f7f;
`;

const FieldError = styled.p`
  margin: 6px 0 0;
  font-size: 0.78rem;
  color: #e63946;
  font-weight: 600;
`;

/* ── CTA ── */

const ConfirmBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) { background: #245026; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const CancelBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: white;
  color: #2f5a2a;
  border: 1.5px solid #cde5cf;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #eef7ee; border-color: #2f5a2a; }
`;

/* ── Empty state ── */

const EmptyWrap = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyCard = styled.div`
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);

  span { font-size: 2.5rem; }
  p { color: #7b8f7f; margin: 12px 0 20px; }
`;

const GoBackBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #245026; }
`;
