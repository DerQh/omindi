import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import {
  useAllCartItems,
  useCartItemDeleteId,
  useUpdateCartItem,
} from "../../hooks/useCart";
import { useUser } from "../../hooks/useUser";
import LoadingComponent from "./Loading";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Cart = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { data: cartItems = [], isLoading } = useAllCartItems(user?.id);
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: deleteItem } = useCartItemDeleteId();

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const subtotal = cartItems.reduce(
    (s, i) => s + (i.listings?.price ?? 0) * (i.quantity ?? 1),
    0,
  );
  const TAX_RATE = 0.16;
  const exVat = Math.round((subtotal / (1 + TAX_RATE)) * 100) / 100;
  const vat = Math.round((subtotal - exVat) * 100) / 100;
  const fmt = (n) => `Kes ${n.toLocaleString()}`;

  const handleQty = (type, item) =>
    updateItem({
      user_id: user?.id,
      listing_id: item.listing_id,
      cart_id: item.id,
      type,
    });

  const handleRemove = (item_id) => {
    setRemovingId(item_id);
    deleteItem(
      { item_id, user_id: user?.id },
      { onSettled: () => setRemovingId(null) },
    );
  };

  if (isLoading || isLoadingUser) return <LoadingComponent />;

  return (
    <>
      <Helmet><title>My Cart — AFARMER™</title></Helmet>
            <AppNavbar />
      <Page>
        {/* ── Header ── */}
        <Header>
          <RoundBack onClick={() => navigate(-1)}>←</RoundBack>
        </Header>

        {cartItems.length === 0 ? (
          <EmptyWrap>
            <EmptyIcon>🛒</EmptyIcon>
            <EmptyTitle>Your cart is empty</EmptyTitle>
            <EmptyDesc>Add fresh produce from local farmers.</EmptyDesc>
            <BrowseBtn onClick={() => navigate("/list")}>
              Browse Listings
            </BrowseBtn>
          </EmptyWrap>
        ) : (
          <>
            {/* ── Delivery location bar ── */}
            <LocationBar>
              <LocationLeft>
                <LocationLabel>Delivery Location</LocationLabel>
                <LocationValue>Home</LocationValue>
              </LocationLeft>
              <ChangeLocation onClick={() => navigate("/edit-profile")}>
                Change Location
              </ChangeLocation>
            </LocationBar>

            {/* ── Two-col on desktop, single-col on mobile ── */}
            <ContentGrid>
              {/* Left / main: items list */}
              <ItemsCol>
                <ItemsList>
                  {cartItems.map((item) => (
                    <ItemCard key={item.id} $removing={removingId === item.id}>
                      <ItemImg
                        src={item.listings?.image_url}
                        alt={item.listings?.title}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <ItemContent>
                        <ItemTopRow>
                          <ItemName>{item.listings?.title}</ItemName>
                          <DeleteBtn onClick={() => handleRemove(item.id)}>
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              width="16"
                              height="16"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4h6v2" />
                            </svg>
                          </DeleteBtn>
                        </ItemTopRow>
                        <ItemUnitPrice>
                          Price per {item.listings?.unit ?? "unit"}:{" "}
                          <strong>
                            Kes {item.listings?.price?.toLocaleString()}
                          </strong>
                        </ItemUnitPrice>
                        <ItemBottomRow>
                          <QtyControl>
                            <QtyBtn
                              onClick={() => handleQty("decrement", item)}
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              −
                            </QtyBtn>
                            <QtyLabel>
                              {item.quantity}
                              {item.listings?.unit
                                ? ` ${item.listings.unit}`
                                : ""}
                            </QtyLabel>
                            <QtyBtn
                              onClick={() => handleQty("increment", item)}
                              disabled={isUpdating}
                            >
                              +
                            </QtyBtn>
                          </QtyControl>
                          <ItemTotal>
                            Kes{" "}
                            {(
                              (item.listings?.price ?? 0) * (item.quantity ?? 1)
                            ).toLocaleString()}
                          </ItemTotal>
                        </ItemBottomRow>
                      </ItemContent>
                    </ItemCard>
                  ))}
                </ItemsList>
              </ItemsCol>

              {/* Right / summary: promo + breakdown + checkout */}
              <SummaryCol>
                <SummaryCard>
                  <SummaryHeading>Order Summary</SummaryHeading>

                  <PromoRow>
                    <PromoInput
                      placeholder="Enter Promo Code"
                      value={promo}
                      onChange={(e) => setPromo(e.target.value.toUpperCase())}
                    />
                    <PromoApply
                      onClick={() => {
                        if (promo.trim()) setPromoApplied(true);
                      }}
                      $applied={promoApplied}
                    >
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </PromoApply>
                  </PromoRow>

                  <SummaryLines>
                    <SummaryLine>
                      <SummaryLabel>Subtotal for products</SummaryLabel>
                      <SummaryVal>{fmt(exVat)}</SummaryVal>
                    </SummaryLine>
                    <SummaryLine>
                      <SummaryLabel>VAT @ 16%</SummaryLabel>
                      <SummaryVal>{fmt(vat)}</SummaryVal>
                    </SummaryLine>
                    <SummaryLine>
                      <SummaryLabel>Delivery</SummaryLabel>
                      <SummaryVal style={{ color: "#16a34a" }}>Free</SummaryVal>
                    </SummaryLine>
                    {promoApplied && (
                      <SummaryLine>
                        <SummaryLabel>Discount (promo)</SummaryLabel>
                        <SummaryVal style={{ color: "#16a34a" }}>
                          − Kes 0
                        </SummaryVal>
                      </SummaryLine>
                    )}
                  </SummaryLines>

                  <TotalLine>
                    <TotalLabel>Total</TotalLabel>
                    <TotalVal>{fmt(subtotal)}</TotalVal>
                  </TotalLine>

                  {/* Checkout button visible inside card on desktop */}
                  <DesktopCheckoutBtn
                    onClick={() =>
                      navigate("/checkout", {
                        state: { cartItems, totalCost: subtotal },
                      })
                    }
                  >
                    Checkout
                  </DesktopCheckoutBtn>
                </SummaryCard>
              </SummaryCol>
            </ContentGrid>

            {/* ── Fixed checkout button — mobile only ── */}
            <CheckoutWrap>
              <CheckoutBtn
                onClick={() =>
                  navigate("/checkout", {
                    state: { cartItems, totalCost: subtotal },
                  })
                }
              >
                Checkout
              </CheckoutBtn>
            </CheckoutWrap>
          </>
        )}
      </Page>
    </>
  );
};

export default Cart;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f7faf7;
  display: flex;
  flex-direction: column;
`;

/* ── Header ── */

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

const RoundBack = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #e8f0e8;
  background: white;
  font-size: 1.1rem;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover {
    background: #f0f7ee;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a3318;
  @media (min-width: 768px) {
    text-align: left;
  }
`;

/* ── Location bar ── */

const LocationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #f0f0f0;

  @media (min-width: 768px) {
    padding: 12px calc((100% - 960px) / 2 + 24px);
  }
`;

const LocationLeft = styled.div``;
const LocationLabel = styled.div`
  font-size: 0.72rem;
  color: #9ca3af;
  margin-bottom: 1px;
`;
const LocationValue = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a3318;
`;
const ChangeLocation = styled.button`
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #2f5a2a;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

/* ── Responsive two-column grid ── */

const ContentGrid = styled.div`
  flex: 1;
  padding: 16px 16px 100px;

  @media (min-width: 768px) {
    max-width: 960px;
    margin: 0 auto;
    width: 100%;
    padding: 24px 24px 48px;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: start;
  }
`;

const ItemsCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const SummaryCol = styled.div`
  /* On mobile, summary card sits below the items */
  margin-top: 16px;

  @media (min-width: 768px) {
    margin-top: 0;
    position: sticky;
    top: 80px;
  }
`;

const SummaryCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
`;

const SummaryHeading = styled.h3`
  margin: 0 0 14px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const SummaryLines = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
`;

/* ── Items ── */

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  gap: 14px;
  opacity: ${({ $removing }) => ($removing ? 0.4 : 1)};
  transition: opacity 0.2s;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
`;

const ItemImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  background: #f0f7ee;
  flex-shrink: 0;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const ItemName = styled.p`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  color: #ef4444;
  padding: 2px;
  transition: transform 0.12s;
  &:hover {
    transform: scale(1.15);
  }
`;

const ItemUnitPrice = styled.p`
  margin: 3px 0 0;
  font-size: 0.78rem;
  color: #9ca3af;
  strong {
    color: #1a3318;
  }
`;

const ItemBottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1.5px solid #e0ece0;
  background: white;
  color: #2f5a2a;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
  &:hover:not(:disabled) {
    background: #2f5a2a;
    color: white;
    border-color: #2f5a2a;
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const QtyLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a3318;
  min-width: 36px;
  text-align: center;
`;

const ItemTotal = styled.span`
  font-size: 0.92rem;
  font-weight: 800;
  color: #1a3318;
`;

/* ── Promo ── */

const PromoRow = styled.div`
  display: flex;
  gap: 0;
  background: white;
  border-radius: 12px;
  border: 1.5px solid #e8f0e8;
  overflow: hidden;
  margin-bottom: 16px;
`;

const PromoInput = styled.input`
  flex: 1;
  padding: 13px 16px;
  border: none;
  background: transparent;
  font-size: 0.88rem;
  color: #1a3318;
  outline: none;
  &::placeholder {
    color: #b0c4b0;
  }
`;

const PromoApply = styled.button`
  padding: 0 20px;
  border: none;
  background: ${({ $applied }) => ($applied ? "#f0fdf4" : "white")};
  color: ${({ $applied }) => ($applied ? "#16a34a" : "#2f5a2a")};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border-left: 1.5px solid #e8f0e8;
  transition: background 0.15s;
  white-space: nowrap;
  &:hover {
    background: #f0fdf4;
  }
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const SummaryLabel = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
`;
const SummaryVal = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a3318;
`;

const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 0 10px;
  border-top: 2px solid #f0f0f0;
  margin-top: 4px;
`;

const TotalLabel = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  color: #1a3318;
`;
const TotalVal = styled.span`
  font-size: 0.92rem;
  font-weight: 800;
  color: #1a3318;
`;

/* Checkout button inside summary card — desktop only */
const DesktopCheckoutBtn = styled.button`
  display: none;

  @media (min-width: 768px) {
    display: block;
    width: 100%;
    padding: 14px;
    border-radius: 999px;
    background: #2f5a2a;
    color: white;
    border: none;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    margin-top: 16px;
    box-shadow: 0 4px 14px rgba(47, 90, 42, 0.3);
    transition:
      box-shadow 0.15s,
      transform 0.1s;
    &:hover {
      box-shadow: 0 6px 18px rgba(47, 90, 42, 0.4);
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  }
`;

/* Fixed checkout button — mobile only */
const CheckoutWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 24px calc(16px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(to top, #f7faf7 85%, transparent);
  box-sizing: border-box;

  @media (min-width: 768px) {
    display: none;
  }
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 999px;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(47, 90, 42, 0.3);
  transition:
    box-shadow 0.15s,
    transform 0.1s;
  &:hover {
    box-shadow: 0 6px 20px rgba(47, 90, 42, 0.4);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

/* ── Empty ── */

const EmptyWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
`;
const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`;
const EmptyTitle = styled.p`
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a3318;
`;
const EmptyDesc = styled.p`
  margin: 0 0 24px;
  color: #9ca3af;
  font-size: 0.9rem;
`;
const BrowseBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
`;
