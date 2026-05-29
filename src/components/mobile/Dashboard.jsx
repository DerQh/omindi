import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import AppNavbar from "./AppNavbar";
import { useAuth } from "../../context/AuthContext";
import {
  useSellerListings,
  useSellerOrders,
  useUpdateOrderStatus,
  useDeleteListing,
  useDashboardStats,
} from "../../hooks/useDashboard";
import { formatSmartDate } from "../../hooks/dateFormat";

// --- animations
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- layout
const Page = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding-bottom: 40px;
`;

const Wrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TitleBlock = styled.div``;

const PageTitle = styled.h1`
  margin: 0 0 4px;
  color: #2f5a2a;
  font-size: 1.6rem;
`;

const PageSub = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.9rem;
`;

const AddBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #245026;
  }
`;

// --- stat cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(20, 57, 32, 0.07);
  animation: ${fadeUp} 0.3s ease;
  border-left: 4px solid ${({ $color }) => $color || "#2f5a2a"};
`;

const StatLabel = styled.p`
  margin: 0 0 6px;
  color: #7b8f7f;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const StatValue = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-size: 1.8rem;
  font-weight: 800;
`;

const StatSub = styled.p`
  margin: 4px 0 0;
  color: #aac4aa;
  font-size: 0.78rem;
`;

// --- tabs
const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ebf2eb;
  padding-bottom: 0;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#7b8f7f")};
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  margin-bottom: -2px;
  transition: all 0.15s;
  &:hover {
    color: #2f5a2a;
  }
`;

// --- card container
const Card = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(20, 57, 32, 0.07);
  overflow: hidden;
`;

// --- listings tab
const ListingGrid = styled.div`
  display: grid;
  gap: 0;
`;

const ListingRow = styled.div`
  display: grid;
  grid-template-columns: 70px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f7ee;
  animation: ${fadeUp} 0.3s ease;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: #f7fbf7;
  }

  @media (max-width: 500px) {
    grid-template-columns: 56px 1fr;
  }
`;

const ListingThumb = styled.img`
  width: 70px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
  background: #d7e9d7;
`;

const ListingInfo = styled.div``;

const ListingTitle = styled.p`
  margin: 0 0 3px;
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ListingMeta = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.82rem;
`;

const ListingActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const SmallBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${({ $variant }) =>
    $variant === "danger"
      ? "#fdf0f0"
      : $variant === "edit"
        ? "#f0f7ee"
        : "#f0f7ee"};
  color: ${({ $variant }) => ($variant === "danger" ? "#a32d2d" : "#2f5a2a")};
  &:hover {
    background: ${({ $variant }) =>
      $variant === "danger" ? "#f5d5d5" : "#d7efd7"};
  }
`;

// --- orders tab
const OrderList = styled.div``;

const OrderCard = styled.div`
  border-bottom: 1px solid #f0f7ee;
  animation: ${fadeUp} 0.3s ease;
  &:last-child {
    border-bottom: none;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px 20px 12px;
  gap: 12px;
  flex-wrap: wrap;
  cursor: pointer;
  &:hover {
    background: #f7fbf7;
  }
`;

const OrderMeta = styled.div``;

const OrderId = styled.p`
  margin: 0 0 3px;
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.9rem;
  font-family: monospace;
`;

const OrderInfo = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.82rem;
`;

const OrderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const OrderTotal = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 700;
  font-size: 1rem;
`;

const statusColors = {
  pending: { bg: "#fff8e5", color: "#b07d00" },
  confirmed: { bg: "#eef9f0", color: "#2f5a2a" },
  delivering: { bg: "#e5f4ff", color: "#1a5a8a" },
  delivered: { bg: "#eef9f0", color: "#2f5a2a" },
  cancelled: { bg: "#fdf0f0", color: "#a32d2d" },
  refunded: { bg: "#f5f0ff", color: "#5a2a8a" },
};

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: capitalize;
  background: ${({ $s }) => statusColors[$s]?.bg ?? "#f0f7ee"};
  color: ${({ $s }) => statusColors[$s]?.color ?? "#2f5a2a"};
`;

const OrderExpanded = styled.div`
  padding: 0 20px 18px;
  display: grid;
  gap: 12px;
`;

const OrderItemRow = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr auto;
  gap: 12px;
  align-items: center;
  background: #f0f7ee;
  border-radius: 12px;
  padding: 10px 14px;
`;

const OrderItemImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  background: #d7e9d7;
`;

const OrderItemInfo = styled.div``;
const OrderItemName = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.88rem;
`;
const OrderItemMeta = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.8rem;
`;
const OrderItemPrice = styled.p`
  margin: 0;
  color: #2f5a2a;
  font-weight: 700;
  font-size: 0.88rem;
  white-space: nowrap;
`;

const DeliveryInfo = styled.div`
  background: #f7fbff;
  border: 1px solid #d7e9ff;
  border-radius: 12px;
  padding: 14px;
  display: grid;
  gap: 8px;
`;

const DelivRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
`;
const DelivLabel = styled.span`
  color: #7b8f7f;
`;
const DelivValue = styled.span`
  color: #2f5a2a;
  font-weight: 600;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${({ $variant }) =>
    $variant === "danger"
      ? "#fdf0f0"
      : $variant === "primary"
        ? "#2f5a2a"
        : "#f0f7ee"};
  color: ${({ $variant }) =>
    $variant === "danger"
      ? "#a32d2d"
      : $variant === "primary"
        ? "white"
        : "#2f5a2a"};
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7b8f7f;
`;

const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

// ─── DASHBOARD COMPONENT ────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const seller_id = user?.id;

  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { data: stats } = useDashboardStats(seller_id);
  const { data: listings = [], isLoading: loadingListings } =
    useSellerListings(seller_id);
  const { data: orderItems = [], isLoading: loadingOrders } =
    useSellerOrders(seller_id);
  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateOrderStatus();
  const { mutate: deleteListing } = useDeleteListing();

  // group order items by order_id
  const orders = Object.values(
    orderItems.reduce((acc, item) => {
      const oid = item.orders?.id;
      if (!oid) return acc;
      if (!acc[oid]) acc[oid] = { ...item.orders, items: [] };
      acc[oid].items.push(item);
      return acc;
    }, {}),
  );

  const handleStatusUpdate = (order_id, status) => {
    updateStatus({ order_id, status });
  };

  const nextActions = (status) => {
    switch (status) {
      case "pending":
        return [
          {
            label: "✅ Confirm Order",
            status: "confirmed",
            variant: "primary",
          },
          { label: "✗ Cancel", status: "cancelled", variant: "danger" },
        ];
      case "confirmed":
        return [
          {
            label: "🚚 Mark as Shipped",
            status: "delivering",
            variant: "primary",
          },
        ];
      case "delivering":
        return [
          {
            label: "📦 Mark as Delivered",
            status: "delivered",
            variant: "primary",
          },
        ];
      case "delivered":
        return [{ label: "↩ Refund", status: "refunded", variant: "danger" }];
      default:
        return [];
    }
  };

  return (
    <Page>
      <AppNavbar />
      <Wrapper>
        {/* Header */}
        <Header>
          <TitleBlock>
            <PageTitle>My Store</PageTitle>
            <PageSub>Manage your listings and incoming orders</PageSub>
          </TitleBlock>
          <AddBtn onClick={() => navigate("/newlist")}>+ Add Listing</AddBtn>
        </Header>

        {/* Stats */}
        <StatsGrid>
          <StatCard $color="#2f5a2a">
            <StatLabel>Total Revenue</StatLabel>
            <StatValue>
              Kes {stats?.totalRevenue?.toLocaleString() ?? 0}
            </StatValue>
            <StatSub>all time</StatSub>
          </StatCard>
          <StatCard $color="#1a5a8a">
            <StatLabel>Orders Received</StatLabel>
            <StatValue>{stats?.totalOrders ?? 0}</StatValue>
            <StatSub>total orders</StatSub>
          </StatCard>
          <StatCard $color="#b07d00">
            <StatLabel>Pending Orders</StatLabel>
            <StatValue>{stats?.pendingOrders ?? 0}</StatValue>
            <StatSub>need action</StatSub>
          </StatCard>
          <StatCard $color="#5a2a8a">
            <StatLabel>Active Listings</StatLabel>
            <StatValue>{stats?.totalListings ?? 0}</StatValue>
            <StatSub>live on marketplace</StatSub>
          </StatCard>
        </StatsGrid>

        {/* Tabs */}
        <TabRow>
          <Tab
            $active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          >
            Orders {orders.length > 0 && `(${orders.length})`}
          </Tab>
          <Tab
            $active={activeTab === "listings"}
            onClick={() => setActiveTab("listings")}
          >
            Listings {listings.length > 0 && `(${listings.length})`}
          </Tab>
        </TabRow>

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <Card>
            {loadingOrders ? (
              <EmptyState>Loading orders...</EmptyState>
            ) : orders.length === 0 ? (
              <EmptyState>No orders received yet.</EmptyState>
            ) : (
              <OrderList>
                {orders.map((order) => (
                  <OrderCard key={order.id}>
                    <OrderHeader
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id,
                        )
                      }
                    >
                      <OrderMeta>
                        <OrderId>#{order.id.slice(0, 8).toUpperCase()}</OrderId>
                        <OrderInfo>
                          {formatSmartDate(order.created_at)} ·{" "}
                          {paymentLabels[order.payment_method] ??
                            order.payment_method}
                        </OrderInfo>
                        <OrderInfo>
                          📍 {order.delivery_address} · 📞 {order.mobile_no}
                        </OrderInfo>
                      </OrderMeta>
                      <OrderRight>
                        <OrderTotal>
                          Kes {order.total_cost?.toLocaleString()}
                        </OrderTotal>
                        <StatusBadge $s={order.status}>
                          {order.status}
                        </StatusBadge>
                        <span style={{ color: "#aac4aa", fontSize: "0.75rem" }}>
                          {expandedOrder === order.id ? "▲ hide" : "▼ details"}
                        </span>
                      </OrderRight>
                    </OrderHeader>

                    {expandedOrder === order.id && (
                      <OrderExpanded>
                        {/* items */}
                        {order.items.map((item) => (
                          <OrderItemRow key={item.id}>
                            <OrderItemImg
                              src={item.listings?.image_url}
                              alt={item.listings?.title}
                            />
                            <OrderItemInfo>
                              <OrderItemName>
                                {item.listings?.title}
                              </OrderItemName>
                              <OrderItemMeta>
                                Qty: {item.quantity} · {item.listings?.unit}
                              </OrderItemMeta>
                            </OrderItemInfo>
                            <OrderItemPrice>
                              Kes{" "}
                              {(
                                item.price_at_purchase * item.quantity
                              ).toLocaleString()}
                            </OrderItemPrice>
                          </OrderItemRow>
                        ))}

                        {/* delivery info */}
                        <DeliveryInfo>
                          <DelivRow>
                            <DelivLabel>Delivery Address</DelivLabel>
                            <DelivValue>{order.delivery_address}</DelivValue>
                          </DelivRow>
                          <DelivRow>
                            <DelivLabel>Mobile</DelivLabel>
                            <DelivValue>{order.mobile_no}</DelivValue>
                          </DelivRow>
                          <DelivRow>
                            <DelivLabel>Payment</DelivLabel>
                            <DelivValue>
                              {paymentLabels[order.payment_method]}
                            </DelivValue>
                          </DelivRow>
                        </DeliveryInfo>

                        {/* action buttons */}
                        {nextActions(order.status).length > 0 && (
                          <ActionBar>
                            {nextActions(order.status).map((action) => (
                              <ActionBtn
                                key={action.status}
                                $variant={action.variant}
                                disabled={updatingStatus}
                                onClick={() =>
                                  handleStatusUpdate(order.id, action.status)
                                }
                              >
                                {action.label}
                              </ActionBtn>
                            ))}
                          </ActionBar>
                        )}
                      </OrderExpanded>
                    )}
                  </OrderCard>
                ))}
              </OrderList>
            )}
          </Card>
        )}

        {/* LISTINGS TAB */}
        {activeTab === "listings" && (
          <Card>
            {loadingListings ? (
              <EmptyState>Loading listings...</EmptyState>
            ) : listings.length === 0 ? (
              <EmptyState>
                No listings yet.{" "}
                <span
                  style={{
                    color: "#2f5a2a",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate("/add-listing")}
                >
                  Add your first listing →
                </span>
              </EmptyState>
            ) : (
              <ListingGrid>
                {listings.map((listing) => (
                  <ListingRow key={listing.id}>
                    <ListingThumb src={listing.image_url} alt={listing.title} />
                    <ListingInfo>
                      <ListingTitle>{listing.title}</ListingTitle>
                      <ListingMeta>
                        Kes {listing.price} / {listing.unit} ·{" "}
                        {listing.category} · {listing.location}
                      </ListingMeta>
                      <ListingMeta>
                        {formatSmartDate(listing.created_at)}
                      </ListingMeta>
                    </ListingInfo>
                    <ListingActions>
                      <SmallBtn
                        $variant="edit"
                        onClick={() =>
                          navigate("/edit-listing", { state: { listing } })
                        }
                      >
                        Edit
                      </SmallBtn>
                      <SmallBtn
                        $variant="danger"
                        onClick={() => {
                          if (window.confirm("Delete this listing?"))
                            deleteListing({ id: listing?.id });
                        }}
                      >
                        Delete
                      </SmallBtn>
                    </ListingActions>
                  </ListingRow>
                ))}
              </ListingGrid>
            )}
          </Card>
        )}
      </Wrapper>
    </Page>
  );
};

export default Dashboard;
