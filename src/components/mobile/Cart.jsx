import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import {
  useAllCartItems,
  useCartItemDeleteId,
  useUpdateCartItem,
} from "../../hooks/useCart";
import { useUser } from "../../hooks/useUser";
import LoadingComponent from "./Loading";
import ConfirmModule from "./ConfirmModule";

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding: 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

const BackButton = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  &:hover {
    background: #245026;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  flex: 1;
  text-align: center;
`;

const Card = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
`;

const Content = styled.div`
  padding: 32px;
`;

const CartSummary = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const SummaryBlock = styled.div`
  background: #f0f7ee;
  padding: 18px 20px;
  border-radius: 14px;
  min-width: 180px;
  text-align: center;

  h3 {
    margin: 0 0 8px;
    color: #2f5a2a;
  }

  p {
    margin: 0;
    color: #2f5a2a;
    font-weight: 700;
    font-size: 1.2rem;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 20px;
  align-items: start;
  padding: 24px;
  border-bottom: 1px solid #ebf2eb;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  background: #d7e9ff;
`;

const ItemMeta = styled.div`
  display: grid;
  gap: 12px;
`;

const ItemName = styled.h2`
  margin: 0;
  color: #2f5a2a;
  font-size: 1.4rem;
`;

const ItemPrice = styled.span`
  color: #2f5a2a;
  font-weight: 700;
`;

const QuantityControls = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const QuantityButton = styled.button`
  background: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: #d7e9ff;
  }
`;

const QuantityLabel = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: 700;
  color: #2f5a2a;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #d7e9ff;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const TotalLabel = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #7b8f7f;
`;

const TotalValue = styled.p`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2f5a2a;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #2f5a2a;
`;

const PrimaryButton = styled.button`
  background-color: #2f5a2a;
  color: white;
  border: none;
  padding: 16px 22px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #245026;
  }
`;

const Cart = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { data: cartItems, isLoading } = useAllCartItems(user?.id);
  const { mutate: mutateUpdateItem, isPending: isPendingUpdate } =
    useUpdateCartItem();
  const { mutate: mutateDeleteItem, isPending: isDeletingItem } =
    useCartItemDeleteId();
  const [showConfirm, setShowConfirm] = useState(false);

  const totalItems = cartItems?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  const totalCost = cartItems?.reduce((sum, item) => {
    return sum + (item.listings?.price ?? 0) * (item.quantity ?? 1);
  }, 0);

  // FUNCTIONS

  const handleUpdateNum = (type, item) => {
    const user_id = user?.id;
    const listing_id = item?.listing_id;
    const cart_id = item?.id;

    if (type === "increment") {
      mutateUpdateItem({ user_id, listing_id, cart_id, type: "increment" });
    } else {
      mutateUpdateItem({ user_id, listing_id, cart_id, type: "decrement" });
    }
  };
  const handleContinueShopping = () => {
    navigate("/list");
  };

  // sets the confrim module ON and deletes/Cancels delete  item
  const handleConfirmDelete = (item_id) => {
    setShowConfirm(false);
    console.log("remove item from cart", item_id, cartItems);
    mutateDeleteItem({ item_id, user_id: user?.id });
  };

  const removeFromCart = () => {
    setShowConfirm(true);
  };
  return (
    <>
      {isLoading || isLoadingUser ? (
        <>
          <LoadingComponent></LoadingComponent>
        </>
      ) : (
        <>
          <AppNavbar />
          <Container>
            <Header>
              <BackButton onClick={() => navigate(-1)}>←</BackButton>
              <Title>My Cart</Title>
            </Header>

            <Card>
              <Content>
                {cartItems?.length === 0 ? (
                  <EmptyMessage>
                    <h2>Your cart is empty</h2>
                    <p>
                      Browse listings and add items to your cart to see them
                      here.
                    </p>
                    <PrimaryButton
                      onClick={handleContinueShopping}
                      style={{ marginTop: "24px" }}
                    >
                      Browse Listings
                    </PrimaryButton>
                  </EmptyMessage>
                ) : (
                  <>
                    <CartSummary>
                      <SummaryBlock>
                        <h3>Total items</h3>
                        <p>{totalItems}</p>
                      </SummaryBlock>
                      <SummaryBlock>
                        <h3>Products</h3>
                        <p>{cartItems?.length}</p>
                      </SummaryBlock>
                    </CartSummary>

                    {cartItems?.map((item) => (
                      <CartItem key={item.id}>
                        {showConfirm && (
                          <ConfirmModule
                            text="Do you want to delete the item in the cart ? "
                            onConfirm={() => handleConfirmDelete(item.id)}
                            onCancel={() => setShowConfirm(false)}
                          />
                        )}
                        <ItemImage
                          src={item.listings?.image_url}
                          alt={item.listings.title}
                        />
                        <ItemMeta>
                          <ItemName>{item.listings?.title} </ItemName>
                          <ItemPrice>Kes {item.listings?.price}</ItemPrice>
                          <QuantityControls>
                            <QuantityButton
                              onClick={() => handleUpdateNum("decrement", item)}
                              disable={isPendingUpdate}
                            >
                              -
                            </QuantityButton>
                            <QuantityLabel>{item?.quantity}</QuantityLabel>
                            <QuantityButton
                              disable={isPendingUpdate}
                              onClick={() => handleUpdateNum("increment", item)}
                            >
                              +
                            </QuantityButton>
                          </QuantityControls>
                          <ItemActions>
                            <ActionButton
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </ActionButton>
                          </ItemActions>
                        </ItemMeta>
                      </CartItem>
                    ))}

                    <TotalRow>
                      <TotalLabel>TOTAL COST </TotalLabel>
                      <TotalValue>Kes {totalCost?.toLocaleString()}</TotalValue>
                    </TotalRow>

                    <ItemActions style={{ marginTop: "24px" }}>
                      <PrimaryButton onClick={handleContinueShopping}>
                        Continue shopping
                      </PrimaryButton>
                      <ActionButton>Clear cart</ActionButton>
                    </ItemActions>
                    <ItemActions style={{ marginTop: "16px" }}>
                      <PrimaryButton
                        onClick={() =>
                          navigate("/checkout", {
                            state: { cartItems, totalCost },
                          })
                        }
                      >
                        Proceed to Checkout
                      </PrimaryButton>
                    </ItemActions>
                  </>
                )}
              </Content>
            </Card>
          </Container>
        </>
      )}
    </>
  );
};

export default Cart;
