import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import {
  useMarkAllRead,
  useMarkRead,
  useNotifications,
} from "../../hooks/useNotification";
import { formatSmartDate } from "../../hooks/dateFormat";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const expandDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: white;
  padding-bottom: 48px;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  /* background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%); */
  padding: 32px 24px 72px;
  position: relative;
  overflow: hidden;
  max-width: 960px;
  margin: 0 auto;
  border-radius: 0 0 24px 24px;

  &::before {
    content: "";
    position: absolute;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    top: -70px;
    right: -50px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: 10px;
    left: -30px;
    pointer-events: none;
  }
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(19, 18, 18, 0.3);
  color: black;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;

const HeroTitle = styled.h1`
  margin: 0;
  color: black;
  font-size: 1.5rem;
  font-weight: 600;
`;

const MarkAllBtn = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: black;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 999px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
`;

const HeroStats = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StatChip = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(2, 2, 2, 0.25);
  border-radius: 999px;
  padding: 7px 14px;
  color: black;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// ─── Filter Bar ───────────────────────────────────────────────────────────────

// Floats over the hero bottom edge — same pattern as Following.jsx tab bar
const FilterBarWrap = styled.div`
  position: relative;
  max-width: 960px;
  margin: -40px auto 20px;
  padding: 0 20px;
  z-index: 10;
`;

const FilterBar = styled.div`
  background: white;
  border-radius: 16px;
  padding: 5px;
  display: flex;
  gap: 4px;
  box-shadow: 0 8px 28px rgba(20, 57, 32, 0.11);
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterBtn = styled.button`
  flex-shrink: 0;
  padding: 9px 14px;
  border-radius: 10px;
  border: none;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#7b8f7f")};
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: ${({ $active }) => ($active ? "#2f5a2a" : "#eef7ee")};
    color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  }
`;

const FilterCount = styled.span`
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.25)" : "#eef7ee"};
  color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  border-radius: 999px;
  padding: 1px 6px;
  font-size: 0.72rem;
  font-weight: 800;
`;

// ─── Content ──────────────────────────────────────────────────────────────────

const ContentArea = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
`;

// ─── Date Groups ──────────────────────────────────────────────────────────────

// Groups notifications visually under Today / Yesterday / Earlier
const DateGroup = styled.div`
  margin-bottom: 18px;
  animation: ${slideUp} 0.3s ease;
`;

const DateLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const NotifCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(20, 57, 32, 0.07);
`;

// ─── Notification Row ─────────────────────────────────────────────────────────

const NotifItem = styled.div`
  border-bottom: 1px solid #f0f7ee;
  background: ${({ $unread }) => ($unread ? "#fafff8" : "white")};
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }
`;

const NotifRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 16px 18px;
  cursor: pointer;

  &:hover {
    background: #f0f9f0;
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || "#eef9f0"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
`;

const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotifTitle = styled.p`
  margin: 0 0 3px;
  color: #1a3318;
  font-weight: ${({ $unread }) => ($unread ? "700" : "500")};
  font-size: 0.93rem;
`;

// Clamp body to 2 lines — old code used white-space:nowrap which cut messages off entirely
const NotifBody = styled.p`
  margin: 0 0 5px;
  color: #7b8f7f;
  font-size: 0.85rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const NotifTime = styled.span`
  font-size: 0.75rem;
  color: #aac4aa;
`;

const NotifRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
`;

// Green dot shown on unread notifications
const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2f5a2a;
`;

const ChevronWrap = styled.div`
  color: #aac4aa;
  font-size: 0.75rem;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
`;

// ─── Expanded Detail Panel ────────────────────────────────────────────────────

const DetailPanel = styled.div`
  padding: 0 18px 18px 75px;
  animation: ${expandDown} 0.2s ease;

  @media (max-width: 500px) {
    padding-left: 18px;
  }
`;

const DetailCard = styled.div`
  background: #f0f7ee;
  border-radius: 14px;
  padding: 16px;
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
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const DetailValue = styled.span`
  color: #2f5a2a;
  font-weight: 600;
  font-size: 0.85rem;
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
  padding: 10px 18px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
  margin-top: 2px;
  transition: background 0.2s;

  &:hover {
    background: #245026;
  }
`;

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const SkeletonBase = styled.div`
  border-radius: 8px;
  background: linear-gradient(90deg, #e8f0e8 25%, #f0f7f0 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 16px 18px;
  border-bottom: 1px solid #f0f7ee;
  &:last-child {
    border-bottom: none;
  }
`;

const SkeletonCircle = styled(SkeletonBase)`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const SkeletonLines = styled.div`
  flex: 1;
  display: grid;
  gap: 8px;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: 12px;
  width: ${({ $w }) => $w || "100%"};
`;

const LoadingSkeleton = () => (
  <NotifCard>
    {Array.from({ length: 5 }).map((_, i) => (
      <SkeletonRow key={i}>
        <SkeletonCircle />
        <SkeletonLines>
          <SkeletonLine $w="50%" />
          <SkeletonLine $w="80%" />
          <SkeletonLine $w="28%" />
        </SkeletonLines>
      </SkeletonRow>
    ))}
  </NotifCard>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyWrap = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(20, 57, 32, 0.07);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.p`
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.88rem;
`;

// ─── Static config ────────────────────────────────────────────────────────────

// Maps notification type to icon + background colour
const NOTIF_META = {
  order: { icon: "🛒", iconBg: "#eef9f0" },
  inquiry: { icon: "💬", iconBg: "#e5f4ff" },
  favorite: { icon: "❤️", iconBg: "#fdf0f0" },
  price: { icon: "📉", iconBg: "#f0f7ee" },
  system: { icon: "🌿", iconBg: "#eef9f0" },
  follow: { icon: "👤", iconBg: "#f0f4ff" },
};

const FILTERS = [
  { label: "All", type: null },
  { label: "Orders", type: "order" },
  { label: "Inquiries", type: "inquiry" },
  { label: "Saved", type: "favorite" },
  { label: "Follows", type: "follow" },
  { label: "System", type: ["price", "system"] },
];

// Per-filter empty state messages
const EMPTY_MSG = {
  All: {
    icon: "🔔",
    title: "No notifications yet",
    desc: "You're all caught up!",
  },
  Orders: {
    icon: "🛒",
    title: "No order notifications",
    desc: "Order updates will appear here.",
  },
  Inquiries: {
    icon: "💬",
    title: "No inquiries yet",
    desc: "Buyer messages about your listings will show here.",
  },
  Saved: {
    icon: "❤️",
    title: "No saves yet",
    desc: "When buyers save your listings you'll see it here.",
  },
  System: {
    icon: "🌿",
    title: "No system notifications",
    desc: "Platform updates and alerts will appear here.",
  },
  Follows: {
    icon: "👤",
    title: "No follow notifications",
    desc: "When someone follows you, it will appear here.",
  },
};

const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "Mobile Money",
  bank: "Bank Transfer",
};

// Groups notifications into Today / Yesterday / Earlier using updated_at (falls back to created_at).
// Order notifications re-surface under Today whenever their status changes.
const groupByDate = (items) => {
  const todayStr = new Date().toDateString();
  const yday = new Date();
  yday.setDate(yday.getDate() - 1);
  const ydayStr = yday.toDateString();

  const groups = { Today: [], Yesterday: [], Earlier: [] };
  items.forEach((n) => {
    const d = new Date(n.updated_at || n.created_at).toDateString();
    if (d === todayStr) groups.Today.push(n);
    else if (d === ydayStr) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });
  return groups;
};

// ─── Component ────────────────────────────────────────────────────────────────

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { mutate: markRead } = useMarkRead();
  const { mutate: markAllRead } = useMarkAllRead();
  const { data: notifications, isLoading } = useNotifications(user?.id);

  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const totalCount = notifications?.length ?? 0;

  // Filter list based on active tab
  const filtered =
    notifications?.filter((n) => {
      const f = FILTERS.find((x) => x.label === activeFilter)?.type;
      if (!f) return true;
      if (Array.isArray(f)) return f.includes(n.type);
      return n.type === f;
    }) ?? [];

  // Count per tab for badge numbers
  const countFor = (label) => {
    const f = FILTERS.find((x) => x.label === label)?.type;
    if (!f) return totalCount;
    return (
      notifications?.filter((n) => {
        if (Array.isArray(f)) return f.includes(n.type);
        return n.type === f;
      }).length ?? 0
    );
  };

  const handleClick = (n) => {
    setExpandedId((prev) => (prev === n.id ? null : n.id));
    if (!n.read) markRead(n.id);
  };

  // Detail panel rendered per notification type when a row is expanded
  const renderDetail = (n) => {
    switch (n.type) {
      case "order":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Order ID</DetailLabel>
              <DetailValue>
                {n.detail?.orderId?.slice(0, 8).toUpperCase()}
              </DetailValue>
            </DetailRow>
            <DetailDivider />
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{n.detail?.status}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Total</DetailLabel>
              <DetailValue>Kes {n.detail?.total?.toLocaleString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Payment</DetailLabel>
              <DetailValue>
                {paymentLabels[n.detail?.payment] ?? n.detail?.payment}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Date</DetailLabel>
              <DetailValue>
                {new Date(n.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DetailValue>
            </DetailRow>
            <DetailActionBtn
              onClick={() => navigate(`/order/${n.detail?.orderId}`)}
            >
              View Order →
            </DetailActionBtn>
          </DetailCard>
        );

      case "inquiry":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>From</DetailLabel>
              <DetailValue>{n.detail?.from}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Listing</DetailLabel>
              <DetailValue>{n.detail?.listing}</DetailValue>
            </DetailRow>
            <DetailDivider />
            <DetailRow>
              <DetailLabel>Message</DetailLabel>
              <DetailValue style={{ maxWidth: "62%", lineHeight: 1.55 }}>
                "{n.detail?.message}"
              </DetailValue>
            </DetailRow>
            <DetailActionBtn onClick={() => navigate("/messages")}>
              Reply
            </DetailActionBtn>
          </DetailCard>
        );

      case "favorite":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Listing</DetailLabel>
              <DetailValue>{n.detail?.listing}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Total saves</DetailLabel>
              <DetailValue>{n.detail?.totalSaves}</DetailValue>
            </DetailRow>
            <DetailActionBtn onClick={() => navigate(`/listing/${n.detail?.listing_id}`)}>
              View Listing →
            </DetailActionBtn>
          </DetailCard>
        );

      case "price":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Listing</DetailLabel>
              <DetailValue>{n.detail?.listing}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Was</DetailLabel>
              <DetailValue
                style={{ textDecoration: "line-through", color: "#aaa" }}
              >
                Kes {n.detail?.oldPrice}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Now</DetailLabel>
              <DetailValue>Kes {n.detail?.newPrice}</DetailValue>
            </DetailRow>
            <DetailActionBtn onClick={() => navigate(`/listing/${n.detail?.listing_id}`)}>
              View Listing →
            </DetailActionBtn>
          </DetailCard>
        );

      case "system":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>Message </DetailLabel>
              <DetailValue style={{ maxWidth: "68%", lineHeight: 1.55 }}>
                {n.detail?.message}
              </DetailValue>
            </DetailRow>
            {n.detail?.action && (
              <DetailActionBtn onClick={() => navigate("/list")}>
                {n.detail.action} →
              </DetailActionBtn>
            )}
          </DetailCard>
        );

      case "follow":
        return (
          <DetailCard>
            <DetailRow>
              <DetailLabel>From</DetailLabel>
              <DetailValue>{n.detail?.follower_name}</DetailValue>
            </DetailRow>
            <DetailActionBtn
              onClick={() => navigate(`/follower/${n.detail?.follower_id}`)}
            >
              View Profile
            </DetailActionBtn>
          </DetailCard>
        );

      default:
        return null;
    }
  };

  const groups = groupByDate(filtered);
  const hasAny = filtered.length > 0;
  const emptyMsg = EMPTY_MSG[activeFilter] ?? EMPTY_MSG.All;

  return (
    <>
      <AppNavbar />
      <Container>
        {/* ── Hero ── */}
        <Hero>
          <HeroStats>
            <StatChip>{totalCount} Notifications </StatChip>
            {unreadCount > 0 && <StatChip> {unreadCount} unread</StatChip>}
            {unreadCount > 0 && (
              <StatChip onClick={() => markAllRead(user?.id)}>
                Mark all read
              </StatChip>
            )}
          </HeroStats>
        </Hero>

        {/* ── Filter bar floats over the hero bottom ── */}
        <FilterBarWrap>
          <FilterBar>
            {FILTERS.map(({ label }) => {
              const count = countFor(label);
              return (
                <FilterBtn
                  key={label}
                  $active={activeFilter === label}
                  onClick={() => setActiveFilter(label)}
                >
                  {label}
                  {count > 0 && (
                    <FilterCount $active={activeFilter === label}>
                      {count}
                    </FilterCount>
                  )}
                </FilterBtn>
              );
            })}
          </FilterBar>
        </FilterBarWrap>

        {/* ── Content ── */}
        <ContentArea>
          {isLoading && <LoadingSkeleton />}

          {!isLoading && !hasAny && (
            <EmptyWrap>
              <EmptyIcon>{emptyMsg.icon}</EmptyIcon>
              <EmptyTitle>{emptyMsg.title}</EmptyTitle>
              <EmptyDesc>{emptyMsg.desc}</EmptyDesc>
            </EmptyWrap>
          )}

          {/* Notifications grouped by Today / Yesterday / Earlier */}
          {!isLoading &&
            hasAny &&
            Object.entries(groups).map(([label, items]) => {
              if (!items.length) return null;
              return (
                <DateGroup key={label}>
                  <DateLabel>{label}</DateLabel>
                  <NotifCard>
                    {items.map((n) => {
                      const meta = NOTIF_META[n.type] ?? {
                        icon: "🔔",
                        iconBg: "#f0f7ee",
                      };
                      const isOpen = expandedId === n.id;

                      return (
                        <NotifItem key={n.id} $unread={!n.read}>
                          <NotifRow onClick={() => handleClick(n)}>
                            <IconWrap $bg={meta.iconBg}>{meta.icon}</IconWrap>
                            <NotifContent>
                              <NotifTitle $unread={!n.read}>
                                {n.title}
                              </NotifTitle>
                              <NotifBody>{n.body}</NotifBody>
                              <NotifTime>
                                {formatSmartDate(n.updated_at || n.created_at)}
                              </NotifTime>
                            </NotifContent>
                            <NotifRight>
                              {!n.read && <UnreadDot />}
                              <ChevronWrap $open={isOpen}>▼</ChevronWrap>
                            </NotifRight>
                          </NotifRow>

                          {isOpen && (
                            <DetailPanel>{renderDetail(n)}</DetailPanel>
                          )}
                        </NotifItem>
                      );
                    })}
                  </NotifCard>
                </DateGroup>
              );
            })}
        </ContentArea>
      </Container>
    </>
  );
};

export default Notifications;
