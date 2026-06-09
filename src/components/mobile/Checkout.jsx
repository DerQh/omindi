import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, css } from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51TgTrb2I2gjYkw0zZLgoiQb85ndnyDWsms3pgG7Zs6IEVORSlXumyTaZ2mPuY8pgoR5Ugjj8RxWFsDfIBJIqosdp003nKg0TDy");
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../../supabase";
import { useAddOrder, useAddOrderItems } from "../../hooks/useOrders";
import { useCartItemsAllDelete } from "../../hooks/useCart";
import { useNotifyOrder } from "../../hooks/useNotification";
import { useCreateTransaction, useApproveTransaction, useFailTransaction } from "../../hooks/useTransactions";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

const checkPop = keyframes`
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

// ─── Payment methods ──────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    value: "mpesa",
    label: "M-Pesa",
    sub: "Lipa Na M-Pesa · STK Push",
    icon: "📱",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#86efac",
  },
  {
    value: "card",
    label: "Card",
    sub: "Visa / Mastercard",
    icon: "💳",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#93c5fd",
  },
  {
    value: "cash",
    label: "Cash on Delivery",
    sub: "Pay when your order arrives",
    icon: "💵",
    color: "#374151",
    bg: "#f9fafb",
    border: "#d1d5db",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const CheckoutInner = () => {
  const stripe   = useStripe();
  const elements = useElements();
  const navigate  = useNavigate();
  const { state } = useLocation();
  const { user }  = useAuth();
  const { cartItems, totalCost } = state;

  const { mutate: mutateDeleteAllOrders }               = useCartItemsAllDelete();
  const { mutateAsync: mutateAddOrder, isPending: isPendingOrder } = useAddOrder();
  const { mutateAsync: mutateAddItems }                 = useAddOrderItems();
  const { mutateAsync: mutateNotify }                   = useNotifyOrder();
  const { mutateAsync: createTransaction }              = useCreateTransaction();
  const { mutateAsync: approveTransaction }             = useApproveTransaction();
  const { mutateAsync: failTransaction }                = useFailTransaction();

  // ── Form state ────────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [address, setAddress]             = useState("");
  const [phone, setPhone]                 = useState("");
  const [notes, setNotes]                 = useState("");
  const [errors, setErrors]               = useState({});

  // Card fields
  const [cardName, setCardName]         = useState("");
  const [cardElementError, setCardElementError] = useState("");

  // Card payments use inline loading so CardElement stays mounted during Stripe call
  const [isCardProcessing, setIsCardProcessing] = useState(false);

  // Payment state: idle → processing → stk_sent (mpesa) → confirmed → done
  const [payStep, setPayStep]       = useState("idle");
  const [stkOrderId, setStkOrderId] = useState(null);
  const [stkError, setStkError]     = useState("");
  const [stkSecondsLeft, setStkSecondsLeft] = useState(60);
  const [pendingTxnId, setPendingTxnId]     = useState(null);

  // ── Computed ──────────────────────────────────────────────────────────────
  const totalCount = cartItems.reduce((s, i) => s + (i.quantity || 0), 0);

  const orderGroupedBySeller = Object.values(
    cartItems.reduce((acc, row) => {
      const sid = row.listings.seller_id;
      if (!acc[sid]) acc[sid] = { seller_id: sid, items: [], totalCost: 0 };
      acc[sid].items.push(row);
      acc[sid].totalCost += (row.listings.price ?? 0) * (row.quantity ?? 0);
      return acc;
    }, {}),
  );

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!address.trim()) e.address = "Delivery address is required.";
    if (!phone.trim()) e.phone = "Mobile number is required.";
    else if (!/^(07|01)\d{8}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Kenyan number e.g. 0712 345 678";
    if (paymentMethod === "card") {
      if (!cardName.trim()) e.cardName = "Name on card is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Place order in DB ─────────────────────────────────────────────────────
  const placeOrder = async () => {
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
      mutateNotify({ user_id: user?.id, orderId, status: "pending", total: group.totalCost, payment: paymentMethod });
      for (const item of group.items) {
        await mutateAddItems({
          order_id:           orderId,
          listing_id:         item.listing_id,
          quantity:           item.quantity,
          price_at_purchase:  item.listings?.price,
        });
      }
    }
    mutateDeleteAllOrders({ user_id: user?.id });
    return orderIds;
  };

  // ── Poll order status until Daraja callback arrives ──────────────────────
  useEffect(() => {
    if (payStep !== "stk_sent" || !stkOrderId) return;

    let elapsed = 0;
    const TIMEOUT = 60;

    const countdown = setInterval(() => {
      elapsed += 1;
      setStkSecondsLeft(TIMEOUT - elapsed);
      if (elapsed >= TIMEOUT) {
        clearInterval(countdown);
        clearInterval(poll);
        setStkError("Payment timed out. Please try again.");
        setPayStep("idle");
        setStkOrderId(null);
      }
    }, 1000);

    const poll = setInterval(async () => {
      const { data } = await supabase
        .from("orders")
        .select("status")
        .eq("id", stkOrderId)
        .single();

      if (data?.status === "confirmed") {
        clearInterval(poll);
        clearInterval(countdown);
        if (pendingTxnId) await approveTransaction(pendingTxnId).then(null, () => {});
        setPayStep("confirmed");
        setTimeout(() => navigate("/order-confirmation", {
          state: { orderGroupedBySeller, totalCost, paymentMethod, address, orderId: [stkOrderId], phone, purchaseDate: new Date().toISOString(), txnId: pendingTxnId },
        }), 2000);
      } else if (data?.status === "payment_failed") {
        clearInterval(poll);
        clearInterval(countdown);
        if (pendingTxnId) await failTransaction(pendingTxnId).then(null, () => {});
        setStkError("Payment was cancelled or failed. Please try again.");
        setPayStep("idle");
        setStkOrderId(null);
      }
    }, 3000);

    return () => { clearInterval(poll); clearInterval(countdown); };
  }, [payStep, stkOrderId]);

  // ── Checkout handler ──────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!validate()) return;

    // Card: use inline button loading — never show the full overlay while CardElement
    // must stay mounted for stripe.confirmCardPayment to work.
    if (paymentMethod === "card") {
      setIsCardProcessing(true);
    } else {
      setPayStep("processing");
    }

    let txnId = null;
    try {
      const txn = await createTransaction({
        user_id:        user?.id,
        order_id:       null,
        payment_method: paymentMethod,
        amount:         totalCost,
        phone:          phone,
      });
      txnId = txn.id;
      setPendingTxnId(txn.id);
    } catch {
      // Non-fatal
    }

    if (paymentMethod === "mpesa") {
      try {
        // 1. Create order first (need order_id for STK push reference)
        const orderIds = await placeOrder();
        const orderId  = orderIds[0];
        if (txnId) await supabase.from("transactions").update({ order_id: orderId }).eq("id", txnId).then(null, () => {});

        // 2. Call Daraja STK Push via Edge Function
        const { data, error: fnErr } = await supabase.functions.invoke("mpesa-stk-push", {
          body: { phone, amount: 1, order_id: orderId }, // TODO: change back to totalCost before go-live
        });
        if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || "STK Push failed");

        // 3. Save CheckoutRequestID to order so callback can match it
        const checkoutId = data.CheckoutRequestID;
        await supabase.from("orders").update({ mpesa_checkout_id: checkoutId }).eq("id", orderId).then(null, () => {});

        // 4. Start polling — useEffect handles the rest
        setStkOrderId(orderId);
        setStkSecondsLeft(60);
        setStkError("");
        setPayStep("stk_sent");
      } catch (err) {
        setStkError(err.message || "Could not send payment prompt. Please try again.");
        setPayStep("idle");
      }

    } else if (paymentMethod === "card") {
      try {
        // 1. Create PaymentIntent on the server
        const { data, error: fnErr } = await supabase.functions.invoke("create-payment-intent", {
          body: { amount: totalCost, currency: "kes" },
        });
        if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || "Could not initialize payment");

        // 2. Confirm card payment — CardElement is still mounted because we never
        //    called setPayStep("processing") for card payments.
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name: cardName },
          },
        });
        if (stripeError) throw new Error(stripeError.message);
        if (paymentIntent.status !== "succeeded") throw new Error("Payment was not completed");

        // 3. Payment confirmed — persist order in DB then show confirmation overlay
        setIsCardProcessing(false);
        setPayStep("confirmed");
        const orderIds = await placeOrder();
        if (txnId) {
          await approveTransaction(txnId).then(null, () => {});
          if (orderIds[0]) {
            await supabase.from("transactions").update({ order_id: orderIds[0] }).eq("id", txnId);
          }
        }
        setTimeout(() => navigate("/order-confirmation", {
          state: { orderGroupedBySeller, totalCost, paymentMethod, address, orderId: orderIds, phone, purchaseDate: new Date().toISOString(), txnId },
        }), 2500);
      } catch (err) {
        setStkError(err.message || "Card payment failed. Please try again.");
        setIsCardProcessing(false);
      }

    } else {
      // Cash — approve immediately (no waiting)
      const orderIds = await placeOrder();
      if (txnId) {
        await approveTransaction(txnId).then(null, () => {});
        if (orderIds[0]) {
          await supabase.from("transactions").update({ order_id: orderIds[0] }).eq("id", txnId);
        }
      }
      navigate("/order-confirmation", {
        state: { orderGroupedBySeller, totalCost, paymentMethod, address, orderId: orderIds, phone, purchaseDate: new Date().toISOString(), txnId },
      });
    }
  };

  // ── Payment overlay ───────────────────────────────────────────────────────
  if (payStep !== "idle") {
    return (
      <>
        <AppNavbar />
        <PayOverlay>
          {payStep === "processing" && (
            <PayModal>
              <Spinner />
              <PayModalTitle>
                {paymentMethod === "mpesa" ? "Sending STK Push…" : "Processing Payment…"}
              </PayModalTitle>
              <PayModalSub>
                {paymentMethod === "mpesa"
                  ? `Requesting payment from ${phone}`
                  : "Please wait while we process your card."}
              </PayModalSub>
            </PayModal>
          )}
          {payStep === "stk_sent" && (
            <PayModal>
              <PhoneAnim>📲</PhoneAnim>
              <PayModalTitle>Check Your Phone</PayModalTitle>
              <PayModalSub>
                A payment prompt was sent to <strong>{phone}</strong>.
                Open M-Pesa and enter your PIN to complete the payment.
              </PayModalSub>
              <StkCountdown $urgent={stkSecondsLeft <= 15}>
                Expires in {stkSecondsLeft}s
              </StkCountdown>
              <Spinner style={{ margin: "8px auto 0" }} />
              <StkNote>Waiting for Safaricom confirmation…</StkNote>
              <OtpCancel onClick={() => { setPayStep("idle"); setStkOrderId(null); setStkError(""); }}>
                Cancel
              </OtpCancel>
            </PayModal>
          )}
          {payStep === "confirmed" && (
            <PayModal>
              <CheckIcon>✓</CheckIcon>
              <PayModalTitle>Payment Confirmed!</PayModalTitle>
              <PayModalSub>Your order has been placed successfully.</PayModalSub>
            </PayModal>
          )}
        </PayOverlay>
      </>
    );
  }

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (!cartItems?.length)
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
        <PageHeader>
          <HeaderInner>
            <RoundBack onClick={() => navigate(-1)} aria-label="Go back">←</RoundBack>
            <HeaderTitle>Checkout</HeaderTitle>
            <HeaderMeta>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</HeaderMeta>
          </HeaderInner>
        </PageHeader>

        <Body>
          <TwoCol>
            {/* ── Left: order summary ── */}
            <LeftCol>
              <ColTitle>
                Your Order
                {orderGroupedBySeller.length > 1 && (
                  <SellerCountNote> · {orderGroupedBySeller.length} sellers</SellerCountNote>
                )}
              </ColTitle>

              {orderGroupedBySeller.map((group) => (
                <ItemsCard key={group.seller_id}>
                  <SellerHeader>
                    <SellerHeaderName>{group.items[0]?.listings?.profiles?.farm_name || group.items[0]?.listings?.profiles?.full_name || "Farmer"}</SellerHeaderName>
                    <SellerSubtotal>Kes {group.totalCost.toLocaleString()}</SellerSubtotal>
                  </SellerHeader>
                  {group.items.map((item, idx) => (
                    <OrderRow key={item.id} $last={idx === group.items.length - 1}>
                      <OrderImg src={item.listings?.image_url} alt={item.listings?.title} />
                      <OrderMeta>
                        <OrderName>{item.listings?.title}</OrderName>
                        <OrderSub>Kes {item.listings?.price} × {item.quantity}</OrderSub>
                      </OrderMeta>
                      <OrderLineTotal>Kes {((item.listings?.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}</OrderLineTotal>
                    </OrderRow>
                  ))}
                </ItemsCard>
              ))}

              <TotalCard>
                <TotalRow>
                  <TotalLabel>Subtotal ({totalCount} items)</TotalLabel>
                  <TotalAmount>Kes {totalCost?.toLocaleString()}</TotalAmount>
                </TotalRow>
                <TotalRow style={{ borderTop: "1px solid #f0f7ee", paddingTop: 12 }}>
                  <TotalLabel style={{ color: "#1a3318", fontWeight: 800 }}>Total</TotalLabel>
                  <GrandTotal>Kes {totalCost?.toLocaleString()}</GrandTotal>
                </TotalRow>
              </TotalCard>
            </LeftCol>

            {/* ── Right: payment + delivery ── */}
            <RightCol>
              {/* Payment method */}
              <FormCard>
                <ColTitle>Payment Method</ColTitle>
                <PaymentGrid>
                  {PAYMENT_METHODS.map((m) => (
                    <PaymentCard
                      key={m.value}
                      $active={paymentMethod === m.value}
                      $color={m.color}
                      $bg={m.bg}
                      $border={m.border}
                      onClick={() => { setPaymentMethod(m.value); setErrors({}); }}
                    >
                      <PayIconWrap $bg={m.bg} $color={m.color}>{m.icon}</PayIconWrap>
                      <PayText>
                        <PayLabel>{m.label}</PayLabel>
                        <PaySub>{m.sub}</PaySub>
                      </PayText>
                      <PayRadio
                        type="radio"
                        name="payment"
                        value={m.value}
                        checked={paymentMethod === m.value}
                        onChange={() => setPaymentMethod(m.value)}
                      />
                    </PaymentCard>
                  ))}
                </PaymentGrid>

                {/* M-Pesa extra: phone pre-filled from delivery */}
                {paymentMethod === "mpesa" && (
                  <MpesaNote>
                    📲 An STK push will be sent to your mobile number after you confirm.
                  </MpesaNote>
                )}

                {/* Card fields */}
                {paymentMethod === "card" && (
                  <CardFields>
                    <Field>
                      <FieldLabel>Name on Card</FieldLabel>
                      <FieldInput
                        placeholder="e.g. Jane Doe"
                        value={cardName}
                        onChange={(e) => { setCardName(e.target.value); setErrors((p) => ({ ...p, cardName: "" })); }}
                        $error={!!errors.cardName}
                      />
                      {errors.cardName && <FieldError>{errors.cardName}</FieldError>}
                    </Field>
                    <Field>
                      <FieldLabel>Card Details</FieldLabel>
                      <StripeCardWrapper>
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#1a3318",
                                fontFamily: "inherit",
                                "::placeholder": { color: "#9ca3af" },
                              },
                              invalid: { color: "#e63946" },
                            },
                          }}
                          onChange={(e) => setCardElementError(e.error?.message || "")}
                        />
                      </StripeCardWrapper>
                      {cardElementError && <FieldError>{cardElementError}</FieldError>}
                    </Field>
                    <CardDisclaimer>🔒 Powered by Stripe · Card details never touch our servers.</CardDisclaimer>
                  </CardFields>
                )}
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
                  <FieldLabel htmlFor="phone">
                    Mobile Number
                    {paymentMethod === "mpesa" && <MpesaTag>Used for M-Pesa</MpesaTag>}
                  </FieldLabel>
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
                  <FieldLabel htmlFor="notes">Delivery Notes <OptionalTag>(optional)</OptionalTag></FieldLabel>
                  <FieldTextarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave at the gate, call on arrival…"
                  />
                </Field>
              </FormCard>

              {stkError && (
                <StkErrorMsg>{stkError}</StkErrorMsg>
              )}
              <ConfirmBtn onClick={handleCheckout} disabled={isPendingOrder || isCardProcessing}>
                {paymentMethod === "mpesa" && "📱 "}
                {paymentMethod === "card"  && "💳 "}
                {paymentMethod === "cash"  && "💵 "}
                {isPendingOrder
                  ? "Placing order…"
                  : isCardProcessing
                  ? "Processing payment…"
                  : `Pay Kes ${totalCost?.toLocaleString()}`}
              </ConfirmBtn>
              <CancelBtn onClick={() => navigate(-1)}>Back to Cart</CancelBtn>
            </RightCol>
          </TwoCol>
        </Body>
      </Page>
    </>
  );
};

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutInner />
  </Elements>
);

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
  position: sticky;
  top: 60px;
  z-index: 10;
`;

const HeaderInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RoundBack = styled.button`
  width: 36px;
  height: 36px;
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
  font-size: 1.1rem;
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
  padding-bottom: 64px;
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

const LeftCol  = styled.div`display: flex; flex-direction: column; gap: 14px;`;
const RightCol = styled.div`display: flex; flex-direction: column; gap: 14px;`;

const ColTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 0.73rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SellerCountNote = styled.span`
  font-size: 0.73rem; font-weight: 500; color: #7b8f7f;
  text-transform: none; letter-spacing: 0;
`;

const ItemsCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(20,57,32,0.07);
  overflow: hidden;
`;

const SellerHeader = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px;
  background: #f8faf6;
  border-bottom: 1px solid #f0f7ee;
`;

const SellerIcon        = styled.span`font-size: 0.9rem;`;
const SellerHeaderName  = styled.span`flex:1; font-size: 0.82rem; font-weight: 700; color: #1a3318;`;
const SellerSubtotal    = styled.span`font-size: 0.82rem; font-weight: 700; color: #2f5a2a;`;

const OrderRow = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f0f7ee")};
`;

const OrderImg = styled.img`
  width: 48px; height: 48px; border-radius: 10px;
  object-fit: cover; background: #eef7ee; flex-shrink: 0;
`;

const OrderMeta     = styled.div`flex: 1; min-width: 0;`;
const OrderName     = styled.p`margin:0 0 3px; font-size:0.85rem; font-weight:700; color:#1a3318; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`;
const OrderSub      = styled.p`margin:0; font-size:0.75rem; color:#7b8f7f;`;
const OrderLineTotal= styled.span`font-size:0.85rem; font-weight:700; color:#2f5a2a; flex-shrink:0;`;

const TotalCard = styled.div`
  background: white; border-radius: 18px;
  box-shadow: 0 2px 12px rgba(20,57,32,0.07); overflow: hidden;
`;

const TotalRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 18px;
`;

const TotalLabel  = styled.span`font-size:0.85rem; font-weight:600; color:#7b8f7f;`;
const TotalAmount = styled.span`font-size:1rem; font-weight:700; color:#2f5a2a;`;
const GrandTotal  = styled.span`font-size:1.2rem; font-weight:800; color:#2f5a2a;`;

/* ── Payment ── */

const FormCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(20,57,32,0.07);
  padding: 20px;
`;

const PaymentGrid = styled.div`display: flex; flex-direction: column; gap: 8px;`;

const PaymentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1.5px solid ${({ $active, $border }) => ($active ? $border : "#e8f0e8")};
  background: ${({ $active, $bg }) => ($active ? $bg : "white")};
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${({ $border }) => $border}; }
`;

const PayIconWrap = styled.div`
  width: 36px; height: 36px; border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
`;

const PayText  = styled.div`flex: 1;`;
const PayLabel = styled.div`font-size: 0.9rem; font-weight: 700; color: #1a3318;`;
const PaySub   = styled.div`font-size: 0.75rem; color: #7b8f7f; margin-top: 1px;`;
const PayRadio = styled.input`accent-color: #2f5a2a; width: 16px; height: 16px; flex-shrink: 0;`;

const MpesaNote = styled.div`
  margin-top: 12px;
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  font-size: 0.8rem;
  color: #166534;
  line-height: 1.5;
`;

const MpesaTag = styled.span`
  margin-left: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 2px 7px;
  border-radius: 999px;
`;

const CardFields = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f7ee;
`;

const StripeCardWrapper = styled.div`
  padding: 11px 13px;
  border-radius: 11px;
  border: 1.5px solid #e8f0e8;
  background: #fafcfa;
  transition: border-color 0.15s;
  &:focus-within { border-color: #2f5a2a; }
`;

const CardRow = styled.div`display: flex; gap: 12px;`;

const CardDisclaimer = styled.p`
  margin: 10px 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
`;

/* ── Delivery form ── */

const Field = styled.div`margin-bottom: 14px; &:last-child { margin-bottom: 0; }`;

const FieldLabel = styled.label`
  display: block; font-size: 0.82rem; font-weight: 700;
  color: #1a3318; margin-bottom: 6px;
`;

const inputBase = css`
  width: 100%; padding: 11px 13px; border-radius: 11px;
  border: 1.5px solid ${({ $error }) => ($error ? "#e63946" : "#e8f0e8")};
  font-size: 16px; color: #1a3318; background: #fafcfa;
  outline: none; box-sizing: border-box;
  transition: border-color 0.15s; font-family: inherit;
  &:focus { border-color: ${({ $error }) => ($error ? "#e63946" : "#2f5a2a")}; }
`;

const FieldInput    = styled.input`${inputBase}`;
const FieldTextarea = styled.textarea`${inputBase} min-height: 80px; resize: vertical;`;
const OptionalTag   = styled.span`font-size: 0.75rem; font-weight: 500; color: #7b8f7f;`;
const FieldError    = styled.p`margin: 5px 0 0; font-size: 0.75rem; color: #e63946; font-weight: 600;`;

/* ── CTA ── */

const ConfirmBtn = styled.button`
  width: 100%; padding: 16px; border-radius: 14px;
  background: linear-gradient(135deg, #3a6e34, #2f5a2a);
  color: white; border: none; font-size: 1rem; font-weight: 700;
  cursor: pointer; letter-spacing: 0.3px;
  box-shadow: 0 4px 14px rgba(47,90,42,0.35);
  transition: box-shadow 0.15s, transform 0.1s;
  &:hover:not(:disabled) { box-shadow: 0 6px 18px rgba(47,90,42,0.45); transform: translateY(-1px); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
`;

const CancelBtn = styled.button`
  width: 100%; padding: 13px; border-radius: 14px;
  background: white; color: #7b8f7f; border: 1.5px solid #e8f0e8;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #f5f8f5; border-color: #cde5cf; color: #2f5a2a; }
`;

/* ── Payment overlay ── */

const PayOverlay = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const PayModal = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px 36px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  animation: ${fadeUp} 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Spinner = styled.div`
  width: 48px; height: 48px;
  border: 3px solid #e8f0e8;
  border-top-color: #2f5a2a;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  margin-bottom: 8px;
`;

const PhoneAnim = styled.div`
  font-size: 3rem;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

const PayModalTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a3318;
`;

const PayModalSub = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #7b8f7f;
  line-height: 1.6;
`;

const StkPin = styled.div`
  font-size: 0.82rem;
  color: #374151;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 6px 14px;
`;

const StkNote = styled.div`
  font-size: 0.78rem;
  color: #16a34a;
  font-weight: 600;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const CheckIcon = styled.div`
  width: 64px; height: 64px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 2px solid #86efac;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
  color: #16a34a;
  animation: ${checkPop} 0.4s ease forwards;
`;

/* ── Empty state ── */

const EmptyWrap = styled.div`
  min-height: 100vh; background: #f5f8f5;
  display: flex; align-items: center; justify-content: center;
`;

const EmptyCard = styled.div`
  text-align: center; padding: 48px; background: white;
  border-radius: 18px; box-shadow: 0 4px 20px rgba(20,57,32,0.07);
  span { font-size: 2.5rem; }
  p { color: #7b8f7f; margin: 12px 0 20px; }
`;

const GoBackBtn = styled.button`
  background: #2f5a2a; color: white; border: none;
  padding: 11px 24px; border-radius: 10px;
  font-size: 0.9rem; font-weight: 700; cursor: pointer;
  &:hover { background: #245026; }
`;

const StkCountdown = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ $urgent }) => ($urgent ? "#ef4444" : "#7b8f7f")};
  margin: 4px 0 8px;
  transition: color 0.3s;
`;

const OtpCancel = styled.button`
  background: none; border: none; color: #9ca3af;
  font-size: 0.82rem; cursor: pointer;
  &:hover { color: #6b7280; }
`;

const StkErrorMsg = styled.p`
  margin: 0 0 8px;
  font-size: 0.83rem;
  font-weight: 700;
  color: #ef4444;
  text-align: center;
`;
