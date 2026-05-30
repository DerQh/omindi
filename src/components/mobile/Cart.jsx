import { useState } from "react";
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
import ConfirmModule from "./ConfirmModule";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const Cart = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { data: cartItems, isLoading } = useAllCartItems(user?.id);
  const { mutate: mutateUpdateItem, isPending: isPendingUpdate } = useUpdateCartItem();
  const { mutate: mutateDeleteItem, isPending: isDeletingItem } = useCartItemDeleteId();

  // Track which item is pending removal (null = no confirm open)
  const [confirmItemId, setConfirmItemId] = useState(null);

  const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
  const totalCost  = cartItems?.reduce(
    (sum, item) => sum + (item.listings?.price ?? 0) * (item.quantity ?? 1),
    0,
  ) ?? 0;

  const handleUpdateNum = (type, item) => {
    mutateUpdateItem({
      user_id:    user?.id,
      listing_id: item?.listing_id,
      cart_id:    item?.id,
      type,
    });
  };

  const handleConfirmDelete = (item_id) => {
    mutateDeleteItem({ item_id, user_id: user?.id });
    setConfirmItemId(null);
  };

  if (isLoading || isLoadingUser) return <LoadingComponent />;

  return (
    <>
      {confirmItemId && (
        <ConfirmModule
          text="Remove this item from your cart?"
          onConfirm={() => handleConfirmDelete(confirmItemId)}
          onCancel={() => setConfirmItemId(null)}
        />
      )}

      <AppNavbar />

      <Page>
        {/* ── Page header ── */}
        <PageHeader>
          <HeaderInner>
            <RoundBack onClick={() => navigate(-1)} aria-label="Go back">←</RoundBack>
            <HeaderTitle>My Cart</HeaderTitle>
            {cartItems?.length > 0 && (
              <CountBadge>{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</CountBadge>
            )}
          </HeaderInner>
        </PageHeader>

        <Body>
          <Inner>
            {cartItems?.length === 0 ? (
              /* ── Empty state ── */
              <EmptyWrap>
                <EmptyIcon>🛒</EmptyIcon>
                <EmptyTitle>Your cart is empty</EmptyTitle>
                <EmptyDesc>Browse listings and add items to your cart to see them here.</EmptyDesc>
                <BrowseBtn onClick={() => navigate("/list")}>Browse Listings</BrowseBtn>
              </EmptyWrap>
            ) : (
              <>
                {/* ── Item list ── */}
                <ItemsCard>
                  {cartItems.map((item, idx) => (
                    <CartRow key={item.id} $last={idx === cartItems.length - 1}>
                      <ItemImg
                        src={item.listings?.image_url}
                        alt={item.listings?.title}
                      />
                      <ItemBody>
                        <ItemTitle>{item.listings?.title}</ItemTitle>
                        <ItemPrice>
                          Kes {item.listings?.price}
                          {item.listings?.unit ? ` / ${item.listings.unit}` : ""}
                        </ItemPrice>

                        <QtyRow>
                          <QtyBtn
                            onClick={() => handleUpdateNum("decrement", item)}
                            disabled={isPendingUpdate || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </QtyBtn>
                          <QtyNum>{item.quantity}</QtyNum>
                          <QtyBtn
                            onClick={() => handleUpdateNum("increment", item)}
                            disabled={isPendingUpdate}
                            aria-label="Increase quantity"
                          >
                            +
                          </QtyBtn>
                          <LineTotal>
                            Kes {((item.listings?.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
                          </LineTotal>
                        </QtyRow>

                        <RemoveBtn
                          onClick={() => setConfirmItemId(item.id)}
                          disabled={isDeletingItem}
                        >
                          🗑 Remove
                        </RemoveBtn>
                      </ItemBody>
                    </CartRow>
                  ))}
                </ItemsCard>

                {/* ── Order summary ── */}
                <SummaryCard>
                  <SummaryTitle>Order Summary</SummaryTitle>

                  <SummaryRow>
                    <SummaryLabel>Products</SummaryLabel>
                    <SummaryValue>{cartItems.length}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Total qty</SummaryLabel>
                    <SummaryValue>{totalItems}</SummaryValue>
                  </SummaryRow>

                  <SummaryDivider />

                  <SummaryRow $total>
                    <SummaryLabel $total>Total</SummaryLabel>
                    <SummaryValue $total>Kes {totalCost.toLocaleString()}</SummaryValue>
                  </SummaryRow>

                  <CheckoutBtn
                    onClick={() => navigate("/checkout", { state: { cartItems, totalCost } })}
                  >
                    Proceed to Checkout
                  </CheckoutBtn>
                  <ContinueBtn onClick={() => navigate("/list")}>
                    Continue Shopping
                  </ContinueBtn>
                </SummaryCard>
              </>
            )}
          </Inner>
        </Body>
      </Page>
    </>
  );
};

export default Cart;

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
  max-width: 680px;
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

const CountBadge = styled.span`
  background: #eef7ee;
  color: #2f5a2a;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #cde5cf;
`;

const Body = styled.div`
  padding: 24px 24px 56px;
`;

const Inner = styled.div`
  max-width: 680px;
  margin: 0 auto;
  animation: ${fadeUp} 0.35s ease;
`;

/* ── Empty state ── */

const EmptyWrap = styled.div`
  text-align: center;
  padding: 72px 24px;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.p`
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0 0 24px;
  color: #7b8f7f;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const BrowseBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;

  &:hover { background: #245026; }
`;

/* ── Items ── */

const ItemsCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  overflow: hidden;
  margin-bottom: 16px;
`;

const CartRow = styled.div`
  display: flex;
  gap: 16px;
  padding: 18px 20px;
  border-bottom: ${({ $last }) => ($last ? "none" : "1px solid #f0f7ee")};
  align-items: flex-start;
`;

const ItemImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 12px;
  object-fit: cover;
  background: #eef7ee;
  flex-shrink: 0;

  @media (max-width: 400px) {
    width: 72px;
    height: 72px;
  }
`;

const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ItemTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemPrice = styled.span`
  font-size: 0.88rem;
  color: #2f5a2a;
  font-weight: 700;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const QtyBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1.5px solid #cde5cf;
  background: white;
  color: #2f5a2a;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: #2f5a2a;
    color: white;
    border-color: #2f5a2a;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QtyNum = styled.span`
  min-width: 24px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
`;

const LineTotal = styled.span`
  margin-left: auto;
  font-size: 0.88rem;
  font-weight: 700;
  color: #2f5a2a;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.78rem;
  font-weight: 700;
  color: #a32d2d;
  cursor: pointer;
  width: fit-content;
  transition: opacity 0.15s;

  &:hover:not(:disabled) { opacity: 0.7; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── Order summary ── */

const SummaryCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  padding: 24px;
`;

const SummaryTitle = styled.h3`
  margin: 0 0 18px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ $total }) => ($total ? "20px" : "10px")};
`;

const SummaryLabel = styled.span`
  font-size: ${({ $total }) => ($total ? "1rem" : "0.88rem")};
  font-weight: ${({ $total }) => ($total ? "700" : "500")};
  color: ${({ $total }) => ($total ? "#1a3318" : "#7b8f7f")};
`;

const SummaryValue = styled.span`
  font-size: ${({ $total }) => ($total ? "1.3rem" : "0.88rem")};
  font-weight: 700;
  color: #2f5a2a;
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 14px 0 18px;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;

  &:hover { background: #245026; }
`;

const ContinueBtn = styled.button`
  width: 100%;
  padding: 13px;
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
