import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useAddOrder, useAddOrderItems } from "../../hooks/useOrders";
import { useCartItemsAllDelete } from "../../hooks/useCart";
import { useNotifyOrder } from "../../hooks/useNotification";

const Checkout = () => {
  const navigate = useNavigate();
  // --- HOOKS
  const { state } = useLocation();
  const { user } = useAuth(); // context that fetches user information that is alreadt fetched on the database
  const { cartItems, totalCost } = state;
  const { mutate: mutateDeleteAllOrders, isPending: isPendingDeleteOrders } =
    useCartItemsAllDelete();

  const { mutateAsync: mutateAddOrder, isPending: isPendingAddOrder } =
    useAddOrder();
  const { mutateAsync: mutateddOrderItems } = useAddOrderItems();
  const { mutateAsync: mutateAsyncAddNotification, isPending } =
    useNotifyOrder();

  // ----- STATES ---------
  const [completed, setCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // console.log(cartItems, totalCost);
  const totalCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  let user_id = user?.id;

  // --------TEST FUNCTION FOR CARTITEMS TO GROUP THE ORDERS  THEM BY SELLERS
  const orderGroupedBySeller = Object.values(
    cartItems?.reduce((acc, row) => {
      const sellerId = row.listings.seller_id;

      if (!acc[sellerId]) {
        acc[sellerId] = {
          seller_id: sellerId,
          items: [],
          totalCost: 0,
        };
      }

      acc[sellerId].items.push(row);

      const price = row.listings.price ?? 0;
      const qty = row.quantity ?? 0;

      acc[sellerId].totalCost += price * qty;

      return acc;
    }, {}),
  );
  // console.log(orderGroupedBySeller);

  // --------- FUNCTIONS

  //  -- VALIDATE  phone functions
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^(07|01)\d{8}$/.test(cleaned); // Kenyan format
  };

  // --- CHECKOUT FUNCTION USE ASYNC  function
  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter your mobile number.");
      return;
    }
    if (!validatePhone(phone)) {
      alert("Please enter a valid Kenyan mobile number e.g. 0712 345 678");
      return;
    }
    let orderIds = []; // collect all order ids

    for (const group of orderGroupedBySeller) {
      const orderRows = await mutateAddOrder({
        user_id,
        payment_method: paymentMethod,
        delivery_address: address,
        total_cost: group.totalCost,
        mobile_no: phone,
      });
      let orderDataId = orderRows?.[0]?.id;
      orderIds.push(orderDataId); // save it

      // --- INSERT order notification (call after order is created)
      mutateAsyncAddNotification({
        user_id,
        orderId: orderDataId,
        status: "pending",
        total: group.totalCost,
        payment: paymentMethod,
      });

      for (const item of group.items) {
        await mutateddOrderItems({
          order_id: orderDataId,
          listing_id: item.listing_id,
          quantity: item.quantity,
          price_at_purchase: item.listings?.price,
        });
      }
    }
    // CLEAR CART
    mutateDeleteAllOrders({ user_id });
    // console.log(orderIds);

    // navigate with the first order id (or all of them)
    navigate("/order-confirmation", {
      state: {
        orderGroupedBySeller,
        totalCost,
        paymentMethod,
        address,
        orderId: orderIds, // first order id
      },
    });

    // mutateAddOrder(
    //   {
    //     user_id,
    //     payment_method: paymentMethod,
    //     delivery_address: address,
    //     total_cost: totalCost,
    //     mobile_no: phone,
    //   },
    //   {
    //     // FETCH THE MUTATED DATA ABOVE AS (DATA)
    //     onSuccess: (data) => {
    //       let orderDataId = data[0]?.id;
    //       navigate("/order-confirmation", {
    //         state: { cartItems, totalCost, paymentMethod, address },
    //       });
    //       mutateDeleteAllOrders({
    //         user_id,
    //       });
    //       cartItems?.forEach((item) => {
    //         mutateddOrderItems({
    //           order_id: orderDataId,
    //           listing_id: item.listing_id,
    //           quantity: item.quantity,
    //           price_at_purchase: item.listings?.price,
    //         });
    //       });
    //       alert("✅ Order successfully, ®AFARMER");
    //     },
    //   },
    // );
  };

  const handleContinueShopping = () => {
    navigate("/list");
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <Title>Checkout</Title>
        </Header>

        <Card>
          <Content>
            {cartItems?.length === 0 ? (
              <EmptyMessage>
                <h2>No items ready for checkout</h2>
                <p>
                  Add something to your cart first, then come back to complete
                  your order.
                </p>
                <CheckoutButton onClick={handleContinueShopping}>
                  Browse listings
                </CheckoutButton>
              </EmptyMessage>
            ) : (
              <>
                <SummaryRow>
                  <SummaryBlock>
                    <SummaryLabel>Items to purchase</SummaryLabel>
                    <SummaryValue>{totalCount}</SummaryValue>
                  </SummaryBlock>
                  <SummaryBlock>
                    <SummaryLabel>Products</SummaryLabel>
                    <SummaryValue>{cartItems.length}</SummaryValue>
                  </SummaryBlock>
                </SummaryRow>

                <ItemList>
                  {cartItems?.map((item) => (
                    <CheckoutItem key={item.id}>
                      <ItemImage
                        src={item.listings?.image_url}
                        alt={item.listings?.title}
                      />
                      <ItemDetails>
                        <ItemName>{item.listings?.title}</ItemName>
                        <ItemMeta>Kes {item.listings?.price}</ItemMeta>
                        <ItemMeta>Quantity: {item.quantity}</ItemMeta>
                      </ItemDetails>
                    </CheckoutItem>
                  ))}
                </ItemList>

                <FormSection>
                  <FormLabel>Payment Method</FormLabel>
                  <PaymentOptions>
                    <PaymentOption>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Cash on Delivery
                    </PaymentOption>
                    <PaymentOption>
                      <input
                        type="radio"
                        name="payment"
                        value="mobile"
                        checked={paymentMethod === "mobile"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Mobile Money
                    </PaymentOption>
                    <PaymentOption>
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Bank Transfer
                    </PaymentOption>
                  </PaymentOptions>
                  <FormLabel htmlFor="address">Delivery Address</FormLabel>
                  <FormTextarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                  />
                  <FormLabel htmlFor="phone">Mobile Number</FormLabel>
                  <FormInput
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0712 345 678"
                  />
                </FormSection>

                <CheckoutButton onClick={handleCheckout}>
                  Confirm purchase
                </CheckoutButton>
                <CancelButton
                  onClick={handleContinueShopping}
                  style={{ marginTop: "16px" }}
                >
                  Continue browsing
                </CancelButton>

                {completed && (
                  <Confirmation>
                    <strong>Success!</strong> Your order is complete. The seller
                    will contact you about pickup or delivery.
                  </Confirmation>
                )}
              </>
            )}
          </Content>
        </Card>
      </Container>
    </>
  );
};

export default Checkout;
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

const ItemList = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 28px;
`;

const CheckoutItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 18px;
  align-items: start;
  padding: 22px;
  border: 1px solid #ebf2eb;
  border-radius: 18px;

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

const ItemDetails = styled.div`
  display: grid;
  gap: 8px;
`;

const ItemName = styled.h2`
  margin: 0;
  color: #2f5a2a;
  font-size: 1.3rem;
`;

const ItemMeta = styled.p`
  margin: 0;
  color: #7b8f7f;
  line-height: 1.6;
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

const FormSection = styled.div`
  margin-bottom: 28px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2f5a2a;
`;

const FormInput = styled.input`
  width: 90%;
  padding: 16px;
  border: 2px solid #d7e9ff;
  border-radius: 14px;
  background: #f7fbff;
  color: #2f5a2a;
  font-size: 1rem;
  margin-bottom: 16px;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }
`;

const FormTextarea = styled.textarea`
  width: 90%;
  min-height: 80px;
  padding: 16px;
  border: 2px solid #d7e9ff;
  border-radius: 14px;
  background: #f7fbff;
  color: #2f5a2a;
  font-size: 1rem;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }
`;

const PaymentOptions = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
`;

const PaymentOption = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #d7e9ff;
  border-radius: 12px;
  background: #f7fbff;
  cursor: pointer;

  input {
    margin: 0;
  }

  &:hover {
    border-color: #2f5a2a;
  }
`;

const CheckoutButton = styled.button`
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

const CancelButton = styled.button`
  width: 100%;
  background: #e5f4ff;
  color: #2f5a2a;
  border: 2px solid #2f5a2a;
  padding: 18px 24px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #d7e9ff;
  }
`;

const Confirmation = styled.div`
  margin-top: 24px;
  padding: 22px;
  background: #eef9f0;
  border: 1px solid #cde5cf;
  border-radius: 16px;
  color: #2f5a2a;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #2f5a2a;
`;
