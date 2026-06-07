import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import AppNavbar from "./AppNavbar";
import {
  useSellerListings,
  useSellerOrders,
  useDashboardStats,
  useUpdateOrderStatus,
} from "../../hooks/useDashboard";
import { useAuth } from "../../context/AuthContext";
import { formatSmartDate } from "../../hooks/dateFormat";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  forest: "#1e3d1a",
  green: "#2f5a2a",
  greenMid: "#3d7a36",
  greenLight: "#5c9132",
  mint: "#eef7ee",
  mintDark: "#d6ead6",
  blue: "#1a5a8a",
  blueLight: "#e5f4ff",
  gold: "#b07d00",
  goldLight: "#fff8e5",
  purple: "#5a2a8a",
  purpleLight: "#f0ebff",
  red: "#a32d2d",
  redLight: "#fdf0f0",
  text: "#1a2e1a",
  textMid: "#4a6a4a",
  textMuted: "#7b9b7b",
  border: "#e8f2e8",
  bg: "#f4f7f4",
  white: "#ffffff",
};

// ─── ANIMATIONS ──────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const animated = css`
  animation: ${fadeUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;

// ─── LAYOUT ──────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  padding-bottom: 60px;
`;

const Wrapper = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  padding: 28px 20px 0;
`;

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 14px;
`;

const TitleGroup = styled.div``;

const Eyebrow = styled.p`
  margin: 0 0 4px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.greenLight};
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.65rem;
  font-weight: 800;
  color: ${C.forest};
  letter-spacing: -0.6px;
  line-height: 1.15;
`;

const PageSub = styled.p`
  margin: 5px 0 0;
  font-size: 0.84rem;
  color: ${C.textMuted};
`;

// ─── STAT CARDS ──────────────────────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  ${animated}
  background: ${C.white};
  border-radius: 16px;
  padding: 20px 22px 18px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  @media (max-width: 480px) {
    padding: 13px 12px 12px;
    border-radius: 12px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $color }) => $color || C.green};
    border-radius: 16px 16px 0 0;
  }

  &:hover {
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.05),
      0 10px 28px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg || C.mint};
  color: ${({ $color }) => $color || C.green};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-bottom: 14px;
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
    border-radius: 7px;
    margin-bottom: 8px;
  }
`;

const StatLabel = styled.p`
  margin: 0 0 5px;
  font-size: 0.73rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: ${C.textMuted};
  @media (max-width: 480px) {
    font-size: 0.62rem;
  }
`;

const StatValue = styled.p`
  margin: 0 0 5px;
  font-size: 1.85rem;
  font-weight: 800;
  color: ${C.text};
  letter-spacing: -1px;
  line-height: 1;
  @media (max-width: 480px) {
    font-size: 1.25rem;
    letter-spacing: -0.5px;
  }
`;

const StatTag = styled.span`
  display: inline-block;
  font-size: 0.73rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ $up }) => ($up ? C.mint : C.goldLight)};
  color: ${({ $up }) => ($up ? C.green : C.gold)};
`;

// ─── GRID LAYOUTS ────────────────────────────────────────────────────────────
const Grid3_1 = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// ─── PANEL ───────────────────────────────────────────────────────────────────
const Panel = styled.div`
  ${animated}
  background: ${C.white};
  border-radius: 16px;
  padding: 22px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.06);
  min-width: 0;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: ${C.text};
  letter-spacing: -0.2px;
`;

const PanelAction = styled.button`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${C.mint};
  color: ${C.green};
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${C.mintDark};
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${C.border};
  margin: 0 0 16px;
`;

// ─── REVENUE HERO CARD ───────────────────────────────────────────────────────
const HeroCard = styled(Panel)`
  background: linear-gradient(140deg, ${C.forest} 0%, ${C.greenMid} 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const HeroLabel = styled.p`
  margin: 0 0 4px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.65;
`;

const HeroValue = styled.p`
  margin: 0 0 4px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
`;

const HeroSub = styled.p`
  margin: 0 0 20px;
  font-size: 0.78rem;
  opacity: 0.7;
`;

const HeroChartWrap = styled.div`
  height: 72px;
  margin: 0 -6px;
`;

// ─── ORDER ROWS ──────────────────────────────────────────────────────────────
const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid ${C.border};
  gap: 12px;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderId = styled.p`
  margin: 0 0 2px;
  font-size: 0.87rem;
  font-weight: 700;
  color: ${C.text};
  font-family: "SF Mono", "Fira Code", monospace;
`;

const OrderMeta = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${C.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const OrderAmount = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${C.text};
`;

const statusMap = {
  pending: { bg: C.goldLight, color: C.gold, label: "Pending" },
  confirmed: { bg: C.mint, color: C.green, label: "Confirmed" },
  delivering: { bg: C.blueLight, color: C.blue, label: "Shipping" },
  delivered: { bg: C.mint, color: C.green, label: "Delivered" },
  cancelled: { bg: C.redLight, color: C.red, label: "Cancelled" },
  refunded: { bg: C.purpleLight, color: C.purple, label: "Refunded" },
};

const StatusPill = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ $s }) => statusMap[$s]?.bg ?? C.mint};
  color: ${({ $s }) => statusMap[$s]?.color ?? C.green};
  letter-spacing: 0.02em;
`;

// ─── LISTING ROWS ────────────────────────────────────────────────────────────
const ListingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid ${C.border};
  &:last-child {
    border-bottom: none;
  }
`;

const ListingRank = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: ${C.mint};
  color: ${C.green};
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ListingThumb = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  background: ${C.mintDark};
  flex-shrink: 0;
`;

const ListingInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ListingName = styled.p`
  margin: 0 0 2px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${C.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListingPrice = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${C.textMuted};
`;

// ─── EMPTY / LOADING ─────────────────────────────────────────────────────────
const EmptyText = styled.p`
  margin: 0;
  padding: 24px 0 8px;
  font-size: 0.85rem;
  color: ${C.textMuted};
  text-align: center;
`;

const SkeletonRow = styled.div`
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${C.border} 25%,
    #f7faf7 50%,
    ${C.border} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  margin-bottom: 8px;
`;

// ─── QUICK ACTIONS ───────────────────────────────────────────────────────────
const QuickActions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const QuickBtn = styled.button`
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid ${({ $primary }) => ($primary ? C.green : C.border)};
  background: ${({ $primary }) => ($primary ? C.green : C.white)};
  color: ${({ $primary }) => ($primary ? "white" : C.textMid)};
  transition: all 0.15s;
  &:hover {
    background: ${({ $primary }) => ($primary ? C.greenMid : C.mint)};
    border-color: ${({ $primary }) => ($primary ? C.greenMid : C.green)};
    color: ${({ $primary }) => ($primary ? "white" : C.green)};
  }
`;

// ─── STATUS SELECT ────────────────────────────────────────────────────────────
const StatusSelect = styled.select`
  font-size: 13px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 8px;
  border: 1px solid ${C.border};
  background: ${C.bg};
  color: ${C.text};
  cursor: pointer;
  outline: none;
  &:focus { border-color: ${C.green}; }
`;

// ─── CHART OPTIONS ───────────────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const paymentLabels = { cash: "Cash", mobile: "M-Pesa", bank: "Bank" };


// ─── COMPONENT ───────────────────────────────────────────────────────────────
const SalesDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const seller_id = user?.id;

  const { data: stats } = useDashboardStats(seller_id);
  const { data: listings = [] } = useSellerListings(seller_id);
  const { data: orderItems = [], isLoading: loadingOrders } = useSellerOrders(seller_id);
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const orders = Object.values(
    orderItems.reduce((acc, item) => {
      const oid = item.orders?.id;
      if (!oid) return acc;
      if (!acc[oid]) acc[oid] = { ...item.orders, items: [] };
      acc[oid].items.push(item);
      return acc;
    }, {}),
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const monthlyRevenue = MONTHS.map((_, i) =>
    orders
      .filter((o) => new Date(o.created_at).getMonth() === i)
      .reduce((sum, o) => sum + (o.total_cost || 0), 0),
  );

  const weeklyRevenue = orders
    .filter((o) => (Date.now() - new Date(o.created_at)) / 86_400_000 <= 7)
    .reduce((sum, o) => sum + (o.total_cost || 0), 0);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Sort listings by how many orders they've received — most demanded first.
  const topListings = [...listings]
    .sort((a, b) => (stats?.ordersPerListing?.[b.id] || 0) - (stats?.ordersPerListing?.[a.id] || 0))
    .slice(0, 5);
  const recentOrders = orders.slice(0, 6);

  const barChartData = MONTHS.map((month, i) => ({ month, revenue: monthlyRevenue[i] }));

  const statusLabels = Object.keys(statusCounts);
  const statusChartData = statusLabels.map((s) => ({
    status: statusMap[s]?.label ?? s,
    count: statusCounts[s],
    fill: statusMap[s]?.bg ?? C.mint,
    stroke: statusMap[s]?.color ?? C.green,
  }));

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <Page>
      <AppNavbar />
      <Wrapper>
        {/* TOP BAR */}
        <TopBar>
          <TitleGroup>
            <Eyebrow>
              {greeting}, {user?.user_metadata?.full_name?.split(" ")[0] ?? user?.user_metadata?.username ?? "Seller"}
            </Eyebrow>
            <PageTitle>Sales Overview</PageTitle>
            <PageSub>Here's what's happening in your store today.</PageSub>
          </TitleGroup>
        </TopBar>


        {/* STAT CARDS */}
        <StatsGrid>
          <StatCard $color={C.green} $delay="0s">
            <StatIcon $bg={C.mint} $color={C.green}>💰</StatIcon>
            <StatLabel>Total Revenue</StatLabel>
            <StatValue>Kes {(stats?.totalRevenue ?? 0).toLocaleString()}</StatValue>
            <StatTag $up>↑ All time</StatTag>
          </StatCard>

          <StatCard $color={C.blue} $delay="0.07s">
            <StatIcon $bg={C.blueLight} $color={C.blue}>📦</StatIcon>
            <StatLabel>Total Orders</StatLabel>
            <StatValue>{orders.length}</StatValue>
            <StatTag $up>↑ All time</StatTag>
          </StatCard>

          <StatCard $color={C.gold} $delay="0.14s">
            <StatIcon $bg={C.goldLight} $color={C.gold}>⏳</StatIcon>
            <StatLabel>Pending</StatLabel>
            <StatValue>{stats?.pendingOrders ?? 0}</StatValue>
            <StatTag>Needs action</StatTag>
          </StatCard>

          <StatCard $color={C.purple} $delay="0.21s">
            <StatIcon $bg={C.purpleLight} $color={C.purple}>🌿</StatIcon>
            <StatLabel>Active Listings</StatLabel>
            <StatValue>{stats?.totalListings ?? 0}</StatValue>
            <StatTag $up>↑ Live</StatTag>
          </StatCard>

          <StatCard $color={C.greenMid} $delay="0.28s">
            <StatIcon $bg={C.mint} $color={C.greenMid}>📊</StatIcon>
            <StatLabel>Avg Order Value</StatLabel>
            <StatValue>Kes {(stats?.avgOrderValue ?? 0).toLocaleString()}</StatValue>
            <StatTag $up>Per order</StatTag>
          </StatCard>

          <StatCard $color={C.blue} $delay="0.35s">
            <StatIcon $bg={C.blueLight} $color={C.blue}>🛒</StatIcon>
            <StatLabel>Items Sold</StatLabel>
            <StatValue>{stats?.totalItemsSold ?? 0}</StatValue>
            <StatTag $up>All time</StatTag>
          </StatCard>

          <StatCard $color={C.gold} $delay="0.42s">
            <StatIcon $bg={C.goldLight} $color={C.gold}>📅</StatIcon>
            <StatLabel>Today's Orders</StatLabel>
            <StatValue>{stats?.todayOrders ?? 0}</StatValue>
            <StatTag $up={stats?.todayOrders > 0}>
              Kes {(stats?.todayRevenue ?? 0).toLocaleString()}
            </StatTag>
          </StatCard>
        </StatsGrid>

        {/* REVENUE CHART + WEEKLY HERO */}
        <Grid3_1>
          <Panel $delay="0.28s">
            <PanelHeader>
              <PanelTitle>Monthly Revenue</PanelTitle>
              <PanelAction>This Year</PanelAction>
            </PanelHeader>
            <Divider />
            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barCategoryGap="30%">
                  <CartesianGrid vertical={false} stroke={C.border} />
                  <XAxis dataKey="month" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip formatter={(v) => [`Kes ${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: C.forest, border: "none", borderRadius: 8, color: "white" }} />
                  <Bar dataKey="revenue" fill={C.green} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <HeroCard $delay="0.32s">
            <div>
              <HeroLabel>Weekly Revenue</HeroLabel>
              <HeroValue>Kes {weeklyRevenue.toLocaleString()}</HeroValue>
              <HeroSub>Last 7 days</HeroSub>
            </div>
            <HeroChartWrap>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={barChartData}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="revenue" stroke="rgba(255,255,255,0.7)" fill="url(#heroGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </HeroChartWrap>
          </HeroCard>
        </Grid3_1>

        {/* STATUS BREAKDOWN + TOP LISTINGS */}
        <Grid2>
          <Panel $delay="0.36s">
            <PanelHeader>
              <PanelTitle>Orders by Status</PanelTitle>
              <PanelAction>{orders.length} total</PanelAction>
            </PanelHeader>
            <Divider />
            <div style={{ height: 185 }}>
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} layout="vertical" barCategoryGap="25%">
                    <CartesianGrid horizontal={false} stroke={C.border} />
                    <XAxis type="number" tick={{ fill: C.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="status" tick={{ fill: C.textMuted, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={64} />
                    <Tooltip contentStyle={{ background: C.forest, border: "none", borderRadius: 8, color: "white" }} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {statusChartData.map((entry, i) => <Cell key={i} fill={entry.fill} stroke={entry.stroke} strokeWidth={1.5} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyText>No orders to display yet.</EmptyText>
              )}
            </div>
          </Panel>

          <Panel $delay="0.4s">
            <PanelHeader>
              <PanelTitle>Top Listings</PanelTitle>
              <PanelAction onClick={() => navigate("/list")}>by orders</PanelAction>
            </PanelHeader>
            <Divider />
            {topListings.length === 0 ? (
              <EmptyText>No listings yet.</EmptyText>
            ) : (
              topListings.map((listing, i) => (
                <ListingRow key={listing.id}>
                  <ListingRank>{i + 1}</ListingRank>
                  <ListingThumb src={listing.image_url} alt={listing.title} />
                  <ListingInfo>
                    <ListingName>{listing.title}</ListingName>
                    <ListingPrice>
                      Kes {listing.price?.toLocaleString()} / {listing.unit}
                    </ListingPrice>
                  </ListingInfo>
                </ListingRow>
              ))
            )}
          </Panel>
        </Grid2>

        {/* RECENT ORDERS */}
        <Panel $delay="0.44s" style={{ marginBottom: 0 }}>
          <PanelHeader>
            <PanelTitle>Recent Orders</PanelTitle>
            <PanelAction onClick={() => navigate("/dashboard")}>
              View all
            </PanelAction>
          </PanelHeader>
          <Divider />

          {loadingOrders && (
            <>
              <SkeletonRow />
              <SkeletonRow style={{ opacity: 0.6 }} />
              <SkeletonRow style={{ opacity: 0.35 }} />
            </>
          )}

          {!loadingOrders && recentOrders.length === 0 && (
            <EmptyText>No orders received yet.</EmptyText>
          )}

          {!loadingOrders &&
            recentOrders.map((order) => (
              <OrderRow key={order.id}>
                <OrderLeft>
                  <OrderId>
                    #{order.id.slice(0, 8).toUpperCase()}
                    <span style={{ fontWeight: 400, color: C.textMuted, marginLeft: 6 }}>
                      · {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                    </span>
                  </OrderId>
                  <OrderMeta>
                    {formatSmartDate(order.created_at)}
                    &nbsp;·&nbsp;
                    {paymentLabels[order.payment_method] ?? order.payment_method}
                    &nbsp;·&nbsp;
                    {order.delivery_address}
                  </OrderMeta>
                </OrderLeft>
                <OrderRight>
                  <OrderAmount>Kes {order.total_cost?.toLocaleString()}</OrderAmount>
                  <StatusSelect
                    value={order.status}
                    onChange={(e) => updateOrderStatus({ order_id: order.id, status: e.target.value })}
                  >
                    {["pending","confirmed","delivering","delivered","cancelled"].map((s) => (
                      <option key={s} value={s}>{statusMap[s]?.label ?? s}</option>
                    ))}
                  </StatusSelect>
                </OrderRight>
              </OrderRow>
            ))}
        </Panel>
      </Wrapper>
    </Page>
  );
};

export default SalesDashboard;
