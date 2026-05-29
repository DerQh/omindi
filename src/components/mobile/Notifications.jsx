import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../hooks/useOrders";
import { formatSmartDate } from "../../hooks/dateFormat";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const expandDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #f7fbff;
  padding: 20px 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  max-width: 700px;
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
  flex-shrink: 0;
  &:hover {
    background: #245026;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const Title = styled.h1`
  margin: 0;
  color: #2f5a2a;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UnreadBadge = styled.span`
  background: #2f5a2a;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
`;

const MarkAllBtn = styled.button`
  background: none;
  border: none;
  color: #2f5a2a;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  &:hover {
    color: #245026;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  max-width: 700px;
  margin: 0 auto 20px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 6px 16px;
  border-radius: 999px;
  border: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "#d7e9d7")};
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #2f5a2a;
    color: white;
    border-color: #2f5a2a;
  }
`;

const Card = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(20, 57, 32, 0.08);
  overflow: hidden;
`;

const NotifList = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotifItem = styled.div`
  border-bottom: 1px solid #f0f7ee;
  background: ${({ $unread }) => ($unread ? "#f7fbf7" : "white")};
  transition: background 0.15s;
  animation: ${fadeIn} 0.3s ease;
  &:last-child {
    border-bottom: none;
  }
`;

const NotifRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 22px;
  cursor: pointer;
  &:hover {
    background: #eef9f0;
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $color }) => $color || "#eef9f0"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotifTitle = styled.p`
  margin: 0 0 3px;
  color: #2f5a2a;
  font-weight: ${({ $unread }) => ($unread ? "700" : "500")};
  font-size: 0.95rem;
`;

const NotifBody = styled.p`
  margin: 0 0 5px;
  color: #7b8f7f;
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotifTime = styled.span`
  font-size: 0.78rem;
  color: #aac4aa;
`;

const ChevronWrap = styled.div`
  color: #aac4aa;
  font-size: 0.8rem;
  margin-top: 4px;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

const UnreadDot = styled.div`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #2f5a2a;
  flex-shrink: 0;
  margin-top: 6px;
`;

// --- Expanded detail panel
const DetailPanel = styled.div`
  padding: 0 22px 20px 80px;
  animation: ${expandDown} 0.2s ease;

  @media (max-width: 500px) {
    padding-left: 22px;
  }
`;

const DetailCard = styled.div`
  background: #f0f7ee;
  border-radius: 14px;
  padding: 18px;
  display: grid;
  gap: 10px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const DetailLabel = styled.span`
  color: #7b8f7f;
  font-size: 0.88rem;
  flex-shrink: 0;
`;

const DetailValue = styled.span`
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.88rem;
  text-align: right;
`;

const DetailDivider = styled.div`
  height: 1px;
  background: #cde5cf;
`;

const DetailActionBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  align-self: flex-start;
  &:hover {
    background: #245026;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #7b8f7f;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;
const EmptyText = styled.p`
  margin: 0;
  font-size: 1rem;
`;

// --- Mock data with detail objects
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmed",
    body: "Your order ORD-K8X2F for Fresh Tomatoes has been confirmed.",
    time: "2 min ago",
    unread: true,
    icon: "🛒",
    iconBg: "#eef9f0",
    detail: {
      orderId: "ORD-K8X2F",
      items: [
        { name: "Fresh Tomatoes", qty: 2, price: 200 },
        { name: "Onion ", qty: 3, price: 525 },
      ],
      total: 400,
      payment: "Cash on Delivery",
      status: "Confirmed",
      delivery: "2–4 business days",
    },
  },
  {
    id: 2,
    type: "inquiry",
    title: "New Inquiry on Your Listing",
    body: "John Kamau asked: 'Is this still available? Can you deliver to Westlands?'",
    time: "15 min ago",
    unread: true,
    icon: "💬",
    iconBg: "#e5f4ff",
    detail: {
      from: "John Kamau",
      listing: "Organic Avocados — 1kg",
      message: "Is this still available? Can you deliver to Westlands?",
      sent: "15 min ago",
    },
  },
  {
    id: 3,
    type: "order",
    title: "Order Out for Delivery",
    body: "Your order ORD-A3T7P is on its way. Expected delivery today.",
    time: "1 hr ago",
    unread: true,
    icon: "🚚",
    iconBg: "#fff8e5",
    detail: {
      orderId: "ORD-A3T7P",
      items: [{ name: "Fresh Spinach", qty: 3, price: 100 }],
      total: 300,
      payment: "Mobile Money",
      status: "Out for Delivery",
      delivery: "Today",
    },
  },
  {
    id: 4,
    type: "favorite",
    title: "Someone Saved Your Listing",
    body: "A buyer added 'Organic Avocados — 1kg' to their favourites.",
    time: "3 hrs ago",
    unread: false,
    icon: "❤️",
    iconBg: "#fdf0f0",
    detail: { listing: "Organic Avocados — 1kg", totalSaves: 12 },
  },
  {
    id: 5,
    type: "inquiry",
    title: "New Inquiry on Your Listing",
    body: "Grace Wanjiru asked: 'What is the minimum order quantity?'",
    time: "5 hrs ago",
    unread: false,
    icon: "💬",
    iconBg: "#e5f4ff",
    detail: {
      from: "Grace Wanjiru",
      listing: "Fresh Tomatoes — 2kg",
      message: "What is the minimum order quantity?",
      sent: "5 hrs ago",
    },
  },
  {
    id: 6,
    type: "order",
    title: "Order Delivered",
    body: "Your order ORD-B9W1Q has been marked as delivered.",
    time: "Yesterday",
    unread: false,
    icon: "✅",
    iconBg: "#eef9f0",
    detail: {
      orderId: "ORD-B9W1Q",
      items: [{ name: "Ugali Flour 2kg", qty: 1, price: 180 }],
      total: 180,
      payment: "Bank Transfer",
      status: "Delivered",
      delivery: "Completed",
    },
  },
  {
    id: 7,
    type: "price",
    title: "Price Drop Alert",
    body: "Fresh Spinach Bundle dropped from Kes 150 to Kes 100.",
    time: "Yesterday",
    unread: false,
    icon: "📉",
    iconBg: "#f0f7ee",
    detail: { listing: "Fresh Spinach Bundle", oldPrice: 150, newPrice: 100 },
  },
  {
    id: 8,
    type: "system",
    title: "Welcome to the Marketplace!",
    body: "Your account is set up. Start browsing listings or add your own products.",
    time: "2 days ago",
    unread: false,
    icon: "🌿",
    iconBg: "#eef9f0",
    detail: {
      message:
        "Your account is ready. Browse listings or post your own products to start selling.",
      action: "Browse Listings",
    },
  },
];

const NOTIF_META = {
  order: { icon: "🛒", iconBg: "#eef9f0" },
  inquiry: { icon: "💬", iconBg: "#e5f4ff" },
  favorite: { icon: "❤️", iconBg: "#fdf0f0" },
  price: { icon: "📉", iconBg: "#f0f7ee" },
  system: { icon: "🌿", iconBg: "#eef9f0" },
};
const FILTERS = ["All", "Orders", "Inquiries", "Favourites", "System"];
const filterMap = {
  All: null,
  Orders: "order",
  Inquiries: "inquiry",
  Favourites: "favorite",
  System: ["price", "system"],
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  // --- Detail content per notification type
  const renderDetail = (n) => {
    switch (n.type) {
      case "order":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Order ID</DetailLabel>
              <DetailValue>{n.detail.orderId}</DetailValue>
            </DetailRow>
            <DetailDivider />
            {n.detail.items?.map((item, i) => (
              <DetailRow key={i}>
                <DetailLabel>{item.name}</DetailLabel>
                <DetailValue>
                  x{item.qty} — Kes {item.price}
                </DetailValue>
              </DetailRow>
            ))}
            <DetailDivider />
            <DetailRow>
              <DetailLabel>Total</DetailLabel>
              <DetailValue>Kes {n.detail.total?.toLocaleString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment</DetailLabel>
              <DetailValue>{n.detail.payment}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{n.detail.status}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Estimated Delivery</DetailLabel>
              <DetailValue>{n.detail.delivery}</DetailValue>
            </DetailRow>
            <DetailActionBtn
              onClick={() => navigate(`/order/${n.detail.orderId}`)}
            >
              View Order →
            </DetailActionBtn>{" "}
          </DetailCard>
        );

      case "inquiry":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>From</DetailLabel>
              <DetailValue>{n.detail.from}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Listing</DetailLabel>
              <DetailValue>{n.detail.listing}</DetailValue>
            </DetailRow>
            <DetailDivider />
            <DetailRow>
              <DetailLabel>Message</DetailLabel>
              <DetailValue style={{ maxWidth: "60%", lineHeight: 1.5 }}>
                {n.detail.message}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Sent</DetailLabel>
              <DetailValue>{n.detail.sent}</DetailValue>
            </DetailRow>
            <DetailActionBtn>Reply →</DetailActionBtn>
          </DetailCard>
        );

      case "favorite":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Listing</DetailLabel>
              <DetailValue>{n.detail.listing}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Total saves</DetailLabel>
              <DetailValue>{n.detail.totalSaves}</DetailValue>
            </DetailRow>
            <DetailActionBtn>View Listing →</DetailActionBtn>
          </DetailCard>
        );

      case "price":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Listing</DetailLabel>
              <DetailValue>{n.detail.listing}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Old Price</DetailLabel>
              <DetailValue
                style={{ textDecoration: "line-through", color: "#aaa" }}
              >
                Kes {n.detail.oldPrice}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>New Price</DetailLabel>
              <DetailValue>Kes {n.detail.newPrice}</DetailValue>
            </DetailRow>
            <DetailActionBtn>View Listing →</DetailActionBtn>
          </DetailCard>
        );

      case "system":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Message</DetailLabel>
              <DetailValue style={{ maxWidth: "70%", lineHeight: 1.5 }}>
                {n.detail.message}
              </DetailValue>
            </DetailRow>
            {n.detail.action && (
              <DetailActionBtn>{n.detail.action} →</DetailActionBtn>
            )}
          </DetailCard>
        );

      default:
        return null;
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const handleClick = (n) => {
    setExpandedId((prev) => (prev === n.id ? null : n.id));
    if (n.unread) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === n.id ? { ...item, unread: false } : item,
        ),
      );
    }
  };

  const filtered = notifications.filter((n) => {
    const f = filterMap[activeFilter];
    if (!f) return true;
    if (Array.isArray(f)) return f.includes(n.type);
    return n.type === f;
  });

  return (
    <>
      <AppNavbar />
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>←</BackButton>
          <TitleRow>
            <Title>
              Notifications
              {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
            </Title>
            {unreadCount > 0 && (
              <MarkAllBtn onClick={markAllRead}>Mark all read</MarkAllBtn>
            )}
          </TitleRow>
        </Header>

        <FilterRow>
          {FILTERS.map((f) => (
            <FilterBtn
              key={f}
              $active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </FilterBtn>
          ))}
        </FilterRow>

        <Card>
          <NotifList>
            {filtered.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🔔</EmptyIcon>
                <EmptyText>No notifications here yet.</EmptyText>
              </EmptyState>
            ) : (
              filtered.map((n) => {
                const meta = NOTIF_META[n.type] ?? {
                  icon: "🔔",
                  iconBg: "#f0f7ee",
                };

                return (
                  <NotifItem key={n.id} $unread={!n.read}>
                    <NotifRow onClick={() => handleClick(n)}>
                      <IconWrap $color={meta.iconBg}>{meta.icon}</IconWrap>
                      <NotifContent>
                        <NotifTitle $unread={!n.read}>{n.title}</NotifTitle>
                        <NotifBody>{n.body}</NotifBody>
                        <NotifTime>{formatSmartDate(n.created_at)}</NotifTime>
                      </NotifContent>
                      {!n.read && <UnreadDot />}
                      <ChevronWrap $open={expandedId === n.id}>▼</ChevronWrap>
                    </NotifRow>

                    {expandedId === n.id && (
                      <DetailPanel>{renderDetail(n)}</DetailPanel>
                    )}
                  </NotifItem>
                );
              })
            )}
          </NotifList>
        </Card>
      </Container>
    </>
  );
};

export default Notifications;
