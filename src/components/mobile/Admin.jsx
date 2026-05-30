import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import AppNavbar from "./AppNavbar";
import LoadingComponent from "./Loading";
import ConfirmModule from "./ConfirmModule";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { useIsAdmin } from "../../hooks/useShopAdmin";
import { useUser } from "../../hooks/useUser";
import {
  useAdminStats, useAdminUsers, useAdminToggleAdmin,
  useAdminDeleteUser, useAdminListings, useAdminDeleteListing,
  useAdminOrders, useAdminUpdateOrderStatus,
} from "../../hooks/useAdmin";
import { formatSmartDate } from "../../hooks/dateFormat";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV = [
  { id: "overview",  label: "Overview",  icon: "📊" },
  { id: "users",     label: "Users",     icon: "👥" },
  { id: "listings",  label: "Listings",  icon: "🌿" },
  { id: "orders",    label: "Orders",    icon: "📦" },
  { id: "disputes",  label: "Disputes",  icon: "⚠️"  },
];

const PERIODS = [
  { id: "day", label: "Day" }, { id: "week", label: "Week" },
  { id: "month", label: "Month" }, { id: "year", label: "Year" },
];

const ORDER_STATUSES = [
  "pending","confirmed","processing","shipped","delivered","cancelled","disputed",
];

const STATUS_META = {
  pending:    { bg: "#fff8e1", color: "#b45309", dot: "#f59e0b" },
  confirmed:  { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  processing: { bg: "#f5f3ff", color: "#6d28d9", dot: "#8b5cf6" },
  shipped:    { bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  delivered:  { bg: "#f0fdf4", color: "#166534", dot: "#22c55e" },
  cancelled:  { bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  disputed:   { bg: "#fdf2f8", color: "#9d174d", dot: "#ec4899" },
};

const CAT_COLORS = ["#2f5a2a","#3b82f6","#f59e0b","#8b5cf6","#10b981","#ef4444","#06b6d4"];

// Maximum number of admin accounts allowed at one time.
// Attempting to grant admin when this limit is reached is blocked in the UI.
const MAX_ADMINS = 4;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByPeriod(orders, period) {
  if (!orders?.length) return [];
  const map = new Map();
  [...orders]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .forEach((o) => {
      const d = new Date(o.created_at);
      let key;
      if      (period === "day")   key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      else if (period === "week")  { const w = new Date(d); w.setDate(d.getDate() - d.getDay()); key = w.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
      else if (period === "month") key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      else                         key = String(d.getFullYear());
      if (!map.has(key)) map.set(key, { name: key, revenue: 0, orders: 0 });
      map.get(key).revenue += o.total_cost || 0;
      map.get(key).orders  += 1;
    });
  return [...map.values()];
}

const shortId = (id) => id ? String(id).slice(0, 8).toUpperCase() : "—";

const initials = (name) =>
  (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <TooltipLabel>{label}</TooltipLabel>
      {payload.map((p) => (
        <TooltipRow key={p.dataKey}>
          <TooltipDot style={{ background: p.color }} />
          <span>{p.name}:</span>
          <strong>
            {p.dataKey === "revenue"
              ? `Kes ${Number(p.value).toLocaleString()}`
              : p.value}
          </strong>
        </TooltipRow>
      ))}
    </TooltipBox>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const Admin = () => {
  const navigate = useNavigate();
  const [tab,           setTab]           = useState("overview");
  const [period,        setPeriod]        = useState("month");
  const [userSearch,    setUserSearch]    = useState("");
  const [listSearch,    setListSearch]    = useState("");
  const [orderSearch,   setOrderSearch]   = useState("");
  const [orderStatus,   setOrderStatus]   = useState("all");
  const [confirmAction, setConfirmAction] = useState(null);

  const { data: currentUser }                        = useUser();
  const { data: isAdmin, isLoading: checkingAdmin }  = useIsAdmin(currentUser?.id);
  const { data: stats,   isLoading: loadingStats  }  = useAdminStats();
  const { data: users,   isLoading: loadingUsers  }  = useAdminUsers();
  const { data: listings,isLoading: loadingLists  }  = useAdminListings();
  const { data: orders,  isLoading: loadingOrders }  = useAdminOrders();

  const { mutate: toggleAdmin   } = useAdminToggleAdmin();
  const { mutate: deleteUser    } = useAdminDeleteUser();
  const { mutate: deleteListing } = useAdminDeleteListing();
  const { mutate: updateStatus  } = useAdminUpdateOrderStatus();

  // ── Computed ──────────────────────────────────────────────────────────────

  const chartData = useMemo(() => groupByPeriod(stats?.ordersRaw, period), [stats?.ordersRaw, period]);

  const statusDistribution = useMemo(() =>
    ORDER_STATUSES.map((s) => ({
      name: s,
      count: (orders ?? []).filter((o) => o.status === s).length,
    })).filter((s) => s.count > 0),
  [orders]);

  const topCategories = useMemo(() => {
    const map = {};
    (listings ?? []).forEach((l) => { if (l.category) map[l.category] = (map[l.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [listings]);

  const listingsByUser = useMemo(() => {
    const map = {};
    (listings ?? []).forEach((l) => { map[l.seller_id] = (map[l.seller_id] || 0) + 1; });
    return map;
  }, [listings]);

  const avgOrderValue = useMemo(() => {
    const ords = stats?.ordersRaw ?? [];
    return ords.length ? Math.round((stats?.totalRevenue ?? 0) / ords.length) : 0;
  }, [stats]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase();
    return (users ?? []).filter((u) =>
      (u.farm_name ?? "").toLowerCase().includes(q) ||
      (u.full_name ?? "").toLowerCase().includes(q) ||
      (u.email     ?? "").toLowerCase().includes(q));
  }, [users, userSearch]);

  const filteredListings = useMemo(() => {
    const q = listSearch.toLowerCase();
    return (listings ?? []).filter((l) =>
      (l.title    ?? "").toLowerCase().includes(q) ||
      (l.category ?? "").toLowerCase().includes(q) ||
      (l.location ?? "").toLowerCase().includes(q));
  }, [listings, listSearch]);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.toLowerCase();
    return (orders ?? []).filter((o) => {
      const matchSt = orderStatus === "all" || o.status === orderStatus;
      const matchQ  = String(o.id ?? "").toLowerCase().includes(q) ||
                      (o.delivery_address ?? "").toLowerCase().includes(q) ||
                      (o.mobile_no ?? "").toLowerCase().includes(q);
      return matchSt && matchQ;
    });
  }, [orders, orderSearch, orderStatus]);

  const disputedOrders = useMemo(
    () => (orders ?? []).filter((o) => o.status === "disputed"), [orders]);

  // Count how many profiles currently have is_admin = true.
  // Used to enforce the MAX_ADMINS cap before granting admin to a new user.
  const currentAdminCount = useMemo(
    () => (users ?? []).filter((u) => u.is_admin).length, [users]);

  // Returns true when the cap is reached AND the target user is not already admin.
  // Granting → blocked if cap hit. Revoking → always allowed.
  const isAdminCapReached = (user) =>
    !user.is_admin && currentAdminCount >= MAX_ADMINS;

  // ── Guards ────────────────────────────────────────────────────────────────

  if (checkingAdmin || (!currentUser && !isAdmin)) return <LoadingComponent />;

  if (!isAdmin)
    return (
      <>
        <AppNavbar />
        <AccessWrap>
          <AccessCard>
            <AccessIcon>🔒</AccessIcon>
            <AccessTitle>Admin access required</AccessTitle>
            <AccessSub>You don't have permission to view this page.</AccessSub>
            <AccessBtn onClick={() => navigate("/mobile")}>Go Home</AccessBtn>
          </AccessCard>
        </AccessWrap>
      </>
    );

  // ── Confirm handler ───────────────────────────────────────────────────────

  const handleConfirm = () => {
    if (!confirmAction) return;
    const { type, id } = confirmAction;
    if (type === "deleteUser")    deleteUser(id,    { onSuccess: () => setConfirmAction(null) });
    if (type === "deleteListing") deleteListing(id, { onSuccess: () => setConfirmAction(null) });
    setConfirmAction(null);
  };

  // ── Active tab badge counts ───────────────────────────────────────────────

  const badges = { disputes: disputedOrders.length };

  return (
    <>
      {confirmAction && (
        <ConfirmModule
          text={confirmAction.label}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <AppNavbar />

      <Shell>
        {/* ── Sidebar (desktop) / Tab bar (mobile) ── */}
        <Sidebar>
          <SidebarTop>
            <SideBrand>
              <div>
                <SideBrandName>AFARMER</SideBrandName>
                <SideBrandSub>Admin Panel</SideBrandSub>
              </div>
            </SideBrand>

            <SideNav>
              {NAV.map((n) => (
                <SideNavItem
                  key={n.id}
                  $active={tab === n.id}
                  onClick={() => setTab(n.id)}
                >
                  <SideNavLabel>{n.label}</SideNavLabel>
                  {badges[n.id] > 0 && <SideNavBadge>{badges[n.id]}</SideNavBadge>}
                </SideNavItem>
              ))}
            </SideNav>
          </SidebarTop>

          <SidebarBottom>
            <SideNavItem onClick={() => navigate("/mobile")}>
              <SideNavLabel>Back to App</SideNavLabel>
            </SideNavItem>
          </SidebarBottom>
        </Sidebar>

        {/* Mobile tab bar */}
        <MobileTabBar>
          {NAV.map((n) => (
            <MobileTab key={n.id} $active={tab === n.id} onClick={() => setTab(n.id)}>
              {n.icon}
              <MobileTabLabel $active={tab === n.id}>{n.label}</MobileTabLabel>
              {badges[n.id] > 0 && <MobileTabBadge>{badges[n.id]}</MobileTabBadge>}
            </MobileTab>
          ))}
        </MobileTabBar>

        {/* ── Main content ── */}
        <Main>
          <MainInner>

            {/* ══════════════════════════════════════════════════════════════
                OVERVIEW
            ══════════════════════════════════════════════════════════════ */}
            {tab === "overview" && (
              <Fade key="overview">
                <PageHeading>Dashboard Overview</PageHeading>

                {/* Stat cards */}
                <StatGrid>
                  {[
                    { icon: "👥", label: "Total Users",    value: stats?.userCount,     color: "#3b82f6", light: "#eff6ff" },
                    { icon: "🌿", label: "Active Listings",value: stats?.listingCount,  color: "#10b981", light: "#ecfdf5" },
                    { icon: "📦", label: "Total Orders",   value: stats?.orderCount,    color: "#8b5cf6", light: "#f5f3ff" },
                    { icon: "💰", label: "Total Revenue",  value: `Kes ${(stats?.totalRevenue ?? 0).toLocaleString()}`, color: "#f59e0b", light: "#fffbeb", wide: true },
                    { icon: "📈", label: "Avg Order Value",value: `Kes ${avgOrderValue.toLocaleString()}`, color: "#06b6d4", light: "#ecfeff" },
                    { icon: "🕐", label: "Pending",        value: stats?.pendingOrders, color: "#f97316", light: "#fff7ed" },
                    { icon: "⚠️", label: "Disputes",       value: stats?.disputedOrders,color: "#ec4899", light: "#fdf2f8" },
                  ].map((c) => (
                    <StatCard key={c.label} $light={c.light} $wide={c.wide}>
                      <StatCardIcon style={{ background: c.light, color: c.color }}>{c.icon}</StatCardIcon>
                      <StatCardBody>
                        <StatCardValue style={{ color: c.color }}>
                          {loadingStats ? "—" : c.value ?? 0}
                        </StatCardValue>
                        <StatCardLabel>{c.label}</StatCardLabel>
                      </StatCardBody>
                    </StatCard>
                  ))}
                </StatGrid>

                {/* Revenue chart */}
                <ChartCard>
                  <ChartCardHeader>
                    <ChartCardTitle>Revenue Over Time</ChartCardTitle>
                    <PeriodGroup>
                      {PERIODS.map((p) => (
                        <PeriodBtn key={p.id} $active={period === p.id} onClick={() => setPeriod(p.id)}>
                          {p.label}
                        </PeriodBtn>
                      ))}
                    </PeriodGroup>
                  </ChartCardHeader>
                  {loadingStats || !chartData.length ? (
                    <ChartEmpty>{loadingStats ? "Loading…" : "No data yet."}</ChartEmpty>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#2f5a2a" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#2f5a2a" stopOpacity={0}   />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#2f5a2a" strokeWidth={2.5} fill="url(#rev)" dot={false} activeDot={{ r: 5, fill: "#2f5a2a" }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </ChartCard>

                {/* Bottom row: Orders volume + Status dist + Top categories */}
                <TwoColGrid>
                  <ChartCard>
                    <ChartCardHeader>
                      <ChartCardTitle>Orders Volume</ChartCardTitle>
                    </ChartCardHeader>
                    {!loadingStats && chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="orders" name="Orders" fill="#4e9643" radius={[4,4,0,0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ChartEmpty>{loadingStats ? "Loading…" : "No data."}</ChartEmpty>
                    )}
                  </ChartCard>

                  <ChartCard>
                    <ChartCardHeader>
                      <ChartCardTitle>Order Status</ChartCardTitle>
                    </ChartCardHeader>
                    {loadingOrders ? <ChartEmpty>Loading…</ChartEmpty> : (
                      statusDistribution.length === 0 ? <ChartEmpty>No orders yet.</ChartEmpty> : (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={statusDistribution} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={72} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Orders" radius={[0,4,4,0]} maxBarSize={16}>
                              {statusDistribution.map((s, i) => (
                                <Cell key={s.name} fill={STATUS_META[s.name]?.dot ?? "#9ca3af"} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )
                    )}
                  </ChartCard>
                </TwoColGrid>

                {/* Top categories */}
                {topCategories.length > 0 && (
                  <ChartCard>
                    <ChartCardHeader><ChartCardTitle>Top Listing Categories</ChartCardTitle></ChartCardHeader>
                    <CatGrid>
                      {topCategories.map((c, i) => (
                        <CatRow key={c.name}>
                          <CatDot style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                          <CatName>{c.name}</CatName>
                          <CatBar>
                            <CatFill style={{ width: `${(c.count / topCategories[0].count) * 100}%`, background: CAT_COLORS[i % CAT_COLORS.length] }} />
                          </CatBar>
                          <CatCount>{c.count}</CatCount>
                        </CatRow>
                      ))}
                    </CatGrid>
                  </ChartCard>
                )}

                {/* Recent orders */}
                <SectionHeading>Recent Orders</SectionHeading>
                <DataCard>
                  <DataScroll>
                    <DataTable>
                      <thead>
                        <tr>
                          <TH>Order ID</TH><TH>Amount</TH><TH>Payment</TH>
                          <TH>Status</TH><TH>Date</TH>
                        </tr>
                      </thead>
                      <tbody>
                        {(orders ?? []).slice(0, 10).map((o) => (
                          <TR key={o.id}>
                            <TD><Mono>{shortId(o.id)}</Mono></TD>
                            <TD><strong>Kes {(o.total_cost ?? 0).toLocaleString()}</strong></TD>
                            <TD><PayBadge>{o.payment_method ?? "—"}</PayBadge></TD>
                            <TD><StatusPill $s={o.status}>{o.status ?? "—"}</StatusPill></TD>
                            <TD><Muted>{formatSmartDate(o.created_at)}</Muted></TD>
                          </TR>
                        ))}
                        {!orders?.length && <tr><TD colSpan={5} style={{ textAlign:"center", padding:"32px", color:"#9ca3af" }}>No orders yet.</TD></tr>}
                      </tbody>
                    </DataTable>
                  </DataScroll>
                </DataCard>
              </Fade>
            )}

            {/* ══════════════════════════════════════════════════════════════
                USERS
            ══════════════════════════════════════════════════════════════ */}
            {tab === "users" && (
              <Fade key="users">
                {/* Header row: title + live admin seat counter */}
                <HeadingRow>
                  <PageHeading style={{ margin: 0 }}>User Management</PageHeading>
                  <AdminCapBadge $atCap={currentAdminCount >= MAX_ADMINS}>
                    {currentAdminCount} / {MAX_ADMINS} admin seats used
                  </AdminCapBadge>
                </HeadingRow>

                {/* Warning strip shown when all admin seats are filled */}
                {currentAdminCount >= MAX_ADMINS && (
                  <CapWarning>
                    ⚠️ Admin limit reached ({MAX_ADMINS}/{MAX_ADMINS}). Revoke an existing admin before granting access to another user.
                  </CapWarning>
                )}

                <ToolBar>
                  <SearchWrap>
                    <SearchIcon>🔍</SearchIcon>
                    <SearchBox
                      placeholder="Search name, farm, or email…"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                    {userSearch && <ClearBtn onClick={() => setUserSearch("")}>✕</ClearBtn>}
                  </SearchWrap>
                  <CountPill>{filteredUsers.length} users</CountPill>
                </ToolBar>

                {loadingUsers ? <LoadMsg>Loading users…</LoadMsg> : (
                  <DataCard>
                    <DataScroll>
                      <DataTable>
                        <thead>
                          <tr>
                            <TH>User</TH><TH>Farm</TH><TH>Location</TH>
                            <TH>Listings</TH><TH>Joined</TH><TH>Role</TH><TH>Remove</TH>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => {
                            const listCount = listingsByUser[u.id] ?? 0;
                            const isSeller  = listCount > 0;
                            return (
                              <TR key={u.id}>
                                <TD>
                                  <UserCell>
                                    {u.avatar_url
                                      ? <UserImg src={u.avatar_url} alt={u.full_name} />
                                      : <UserInitials>{initials(u.full_name || u.farm_name)}</UserInitials>
                                    }
                                    <UserInfo>
                                      <UserPrimary>{u.full_name || u.username || "—"}</UserPrimary>
                                      {u.email && <UserSecondary>{u.email}</UserSecondary>}
                                    </UserInfo>
                                  </UserCell>
                                </TD>
                                <TD><Muted>{u.farm_name || "—"}</Muted></TD>
                                <TD><Muted>{u.location ? String(u.location).split(",")[0] : "—"}</Muted></TD>
                                <TD>
                                  <ListingCountBadge $zero={listCount === 0}>
                                    {listCount}
                                  </ListingCountBadge>
                                </TD>
                                <TD><Muted>{formatSmartDate(u.created_at)}</Muted></TD>
                                <TD>
                                  <RoleGroup>
                                    {u.is_admin && <RoleBadge $admin>Admin</RoleBadge>}
                                    {isSeller   && <RoleBadge $seller>Seller</RoleBadge>}
                                    {!u.is_admin && !isSeller && <RoleBadge>Buyer</RoleBadge>}
                                    {/* Toggle admin role.
                                        Disabled when cap is hit and user is not yet admin —
                                        revoking is always permitted. */}
                                    <ToggleBtn
                                      $on={u.is_admin}
                                      $blocked={isAdminCapReached(u)}
                                      disabled={isAdminCapReached(u)}
                                      onClick={() => toggleAdmin({ id: u.id, is_admin: !u.is_admin })}
                                      title={
                                        isAdminCapReached(u)
                                          ? `Admin limit reached (${MAX_ADMINS}/${MAX_ADMINS})`
                                          : u.is_admin ? "Revoke admin" : "Grant admin"
                                      }
                                    >
                                      {u.is_admin ? "✓" : "+"}
                                    </ToggleBtn>
                                  </RoleGroup>
                                </TD>
                                <TD>
                                  <DangerBtn onClick={() => setConfirmAction({
                                    type: "deleteUser", id: u.id,
                                    label: `Permanently remove user "${u.full_name || u.farm_name || "this user"}"?`,
                                  })}>
                                    Remove
                                  </DangerBtn>
                                </TD>
                              </TR>
                            );
                          })}
                          {!filteredUsers.length && (
                            <tr><TD colSpan={7} style={{ textAlign:"center", padding:"40px", color:"#9ca3af" }}>No users found.</TD></tr>
                          )}
                        </tbody>
                      </DataTable>
                    </DataScroll>
                    <TableFooter>Showing {filteredUsers.length} of {users?.length ?? 0} users</TableFooter>
                  </DataCard>
                )}
              </Fade>
            )}

            {/* ══════════════════════════════════════════════════════════════
                LISTINGS
            ══════════════════════════════════════════════════════════════ */}
            {tab === "listings" && (
              <Fade key="listings">
                <PageHeading>Listing Management</PageHeading>

                <ToolBar>
                  <SearchWrap>
                    <SearchIcon>🔍</SearchIcon>
                    <SearchBox
                      placeholder="Search title, category, location…"
                      value={listSearch}
                      onChange={(e) => setListSearch(e.target.value)}
                    />
                    {listSearch && <ClearBtn onClick={() => setListSearch("")}>✕</ClearBtn>}
                  </SearchWrap>
                  <CountPill>{filteredListings.length} listings</CountPill>
                </ToolBar>

                {loadingLists ? <LoadMsg>Loading listings…</LoadMsg> : (
                  <DataCard>
                    <DataScroll>
                      <DataTable>
                        <thead>
                          <tr>
                            <TH>Product</TH><TH>Seller ID</TH><TH>Category</TH>
                            <TH>Price</TH><TH>Location</TH><TH>Posted</TH><TH>Remove</TH>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredListings.map((l) => (
                            <TR key={l.id}>
                              <TD>
                                <ListingCell>
                                  <ListingThumb
                                    src={l.image_url || "/afarmer.jpg"}
                                    alt={l.title}
                                    onError={(e) => { e.target.src = "/afarmer.jpg"; }}
                                  />
                                  <ListingTitle>{l.title}</ListingTitle>
                                </ListingCell>
                              </TD>
                              <TD><Mono>{shortId(l.seller_id)}</Mono></TD>
                              <TD>
                                {l.category
                                  ? <CatTag style={{ background: CAT_COLORS[topCategories.findIndex(c => c.name === l.category) % CAT_COLORS.length] + "22", color: CAT_COLORS[topCategories.findIndex(c => c.name === l.category) % CAT_COLORS.length] }}>{l.category}</CatTag>
                                  : <Muted>—</Muted>}
                              </TD>
                              <TD><PriceText>Kes {l.price}{l.unit ? ` / ${l.unit}` : ""}</PriceText></TD>
                              <TD><Muted>{l.location || "—"}</Muted></TD>
                              <TD><Muted>{formatSmartDate(l.created_at)}</Muted></TD>
                              <TD>
                                <DangerBtn onClick={() => setConfirmAction({
                                  type: "deleteListing", id: l.id,
                                  label: `Remove listing "${l.title}"?`,
                                })}>Remove</DangerBtn>
                              </TD>
                            </TR>
                          ))}
                          {!filteredListings.length && (
                            <tr><TD colSpan={7} style={{ textAlign:"center", padding:"40px", color:"#9ca3af" }}>No listings found.</TD></tr>
                          )}
                        </tbody>
                      </DataTable>
                    </DataScroll>
                    <TableFooter>Showing {filteredListings.length} of {listings?.length ?? 0} listings</TableFooter>
                  </DataCard>
                )}
              </Fade>
            )}

            {/* ══════════════════════════════════════════════════════════════
                ORDERS
            ══════════════════════════════════════════════════════════════ */}
            {tab === "orders" && (
              <Fade key="orders">
                <PageHeading>Order Management</PageHeading>

                {/* Status summary chips */}
                <StatusSummary>
                  <StatusSummaryChip
                    $active={orderStatus === "all"}
                    onClick={() => setOrderStatus("all")}
                  >
                    All <strong>{orders?.length ?? 0}</strong>
                  </StatusSummaryChip>
                  {ORDER_STATUSES.map((s) => {
                    const cnt = (orders ?? []).filter((o) => o.status === s).length;
                    if (!cnt) return null;
                    return (
                      <StatusSummaryChip
                        key={s}
                        $active={orderStatus === s}
                        $dot={STATUS_META[s]?.dot}
                        onClick={() => setOrderStatus(s)}
                      >
                        {s} <strong>{cnt}</strong>
                      </StatusSummaryChip>
                    );
                  })}
                </StatusSummary>

                <ToolBar>
                  <SearchWrap>
                    <SearchIcon>🔍</SearchIcon>
                    <SearchBox
                      placeholder="Search ID, address, phone…"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                    {orderSearch && <ClearBtn onClick={() => setOrderSearch("")}>✕</ClearBtn>}
                  </SearchWrap>
                  <CountPill>{filteredOrders.length} orders</CountPill>
                </ToolBar>

                {loadingOrders ? <LoadMsg>Loading orders…</LoadMsg> : (
                  <DataCard>
                    <DataScroll>
                      <DataTable>
                        <thead>
                          <tr>
                            <TH>Order ID</TH><TH>Amount</TH><TH>Payment</TH>
                            <TH>Address</TH><TH>Phone</TH><TH>Date</TH><TH>Status</TH>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((o) => (
                            <TR key={o.id}>
                              <TD><Mono>{shortId(o.id)}</Mono></TD>
                              <TD><strong>Kes {(o.total_cost ?? 0).toLocaleString()}</strong></TD>
                              <TD><PayBadge>{o.payment_method ?? "—"}</PayBadge></TD>
                              <TD>
                                <AddressTrunc title={o.delivery_address}>
                                  {(o.delivery_address ?? "—").slice(0, 30)}{(o.delivery_address?.length > 30) ? "…" : ""}
                                </AddressTrunc>
                              </TD>
                              <TD><Muted>{o.mobile_no ?? "—"}</Muted></TD>
                              <TD><Muted>{formatSmartDate(o.created_at)}</Muted></TD>
                              <TD>
                                <StatusSelect
                                  value={o.status ?? "pending"}
                                  $s={o.status}
                                  onChange={(e) => updateStatus({ id: o.id, status: e.target.value })}
                                >
                                  {ORDER_STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </StatusSelect>
                              </TD>
                            </TR>
                          ))}
                          {!filteredOrders.length && (
                            <tr><TD colSpan={7} style={{ textAlign:"center", padding:"40px", color:"#9ca3af" }}>No orders found.</TD></tr>
                          )}
                        </tbody>
                      </DataTable>
                    </DataScroll>
                    <TableFooter>Showing {filteredOrders.length} of {orders?.length ?? 0} orders</TableFooter>
                  </DataCard>
                )}
              </Fade>
            )}

            {/* ══════════════════════════════════════════════════════════════
                DISPUTES
            ══════════════════════════════════════════════════════════════ */}
            {tab === "disputes" && (
              <Fade key="disputes">
                <PageHeading>Disputes</PageHeading>

                {disputedOrders.length === 0 ? (
                  <EmptyCard>
                    <EmptyIcon>✅</EmptyIcon>
                    <EmptyTitle>No active disputes</EmptyTitle>
                    <EmptySub>
                      Orders marked as <em>disputed</em> from the Orders tab appear here.
                      Resolve them by updating their status.
                    </EmptySub>
                  </EmptyCard>
                ) : (
                  <>
                    <DisputeBanner>
                      ⚠️ {disputedOrders.length} order{disputedOrders.length !== 1 ? "s" : ""} flagged as disputed — review and resolve below.
                    </DisputeBanner>
                    <DataCard>
                      <DataScroll>
                        <DataTable>
                          <thead>
                            <tr>
                              <TH>Order ID</TH><TH>Amount</TH><TH>Payment</TH>
                              <TH>Address</TH><TH>Phone</TH><TH>Date</TH><TH>Resolve</TH>
                            </tr>
                          </thead>
                          <tbody>
                            {disputedOrders.map((o) => (
                              <TR key={o.id} $highlight>
                                <TD><Mono>{shortId(o.id)}</Mono></TD>
                                <TD><strong>Kes {(o.total_cost ?? 0).toLocaleString()}</strong></TD>
                                <TD><PayBadge>{o.payment_method ?? "—"}</PayBadge></TD>
                                <TD>
                                  <AddressTrunc title={o.delivery_address}>
                                    {(o.delivery_address ?? "—").slice(0, 30)}{(o.delivery_address?.length > 30) ? "…" : ""}
                                  </AddressTrunc>
                                </TD>
                                <TD><Muted>{o.mobile_no ?? "—"}</Muted></TD>
                                <TD><Muted>{formatSmartDate(o.created_at)}</Muted></TD>
                                <TD>
                                  <ResolveSelect
                                    defaultValue="disputed"
                                    onChange={(e) => updateStatus({ id: o.id, status: e.target.value })}
                                  >
                                    <option value="disputed">Disputed</option>
                                    <option value="confirmed">Mark Confirmed</option>
                                    <option value="cancelled">Mark Cancelled</option>
                                    <option value="delivered">Mark Delivered</option>
                                  </ResolveSelect>
                                </TD>
                              </TR>
                            ))}
                          </tbody>
                        </DataTable>
                      </DataScroll>
                    </DataCard>
                  </>
                )}
              </Fade>
            )}

          </MainInner>
        </Main>
      </Shell>
    </>
  );
};

export default Admin;

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
`;

const Fade = styled.div`animation: ${fadeUp} 0.3s ease;`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Shell = styled.div`
  display: flex;
  flex-direction: row;        /* sidebar left, content right on desktop */
  min-height: calc(100vh - 60px);
  background: #f8fafc;

  /* On mobile the sidebar is hidden and the tab bar sits above the content,
     so the flex direction must be column so content falls below the tab bar. */
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  background: #111827;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;

  @media (max-width: 768px) { display: none; }
`;

const SidebarTop = styled.div`padding: 20px 12px;`;
const SidebarBottom = styled.div`padding: 12px; border-top: 1px solid #1f2937;`;

const SideBrand = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 8px 8px 20px;
  border-bottom: 1px solid #1f2937;
  margin-bottom: 16px;
`;
const SideBrandName = styled.div`font-size: 0.9rem; font-weight: 800; color: white; letter-spacing: 0.05em;`;
const SideBrandSub  = styled.div`font-size: 0.68rem; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em;`;

const SideNav = styled.nav`display: flex; flex-direction: column; gap: 2px;`;

const SideNavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#9ca3af")};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  position: relative;

  &:hover {
    background: ${({ $active }) => ($active ? "#2f5a2a" : "#1f2937")};
    color: white;
  }
`;
const SideNavIcon  = styled.span`font-size: 1rem; width: 20px; text-align: center;`;
const SideNavLabel = styled.span`flex: 1;`;
const SideNavBadge = styled.span`
  background: #ef4444; color: white;
  font-size: 0.62rem; font-weight: 700;
  padding: 1px 6px; border-radius: 999px;
  min-width: 18px; text-align: center;
`;

// Mobile tab bar
const MobileTabBar = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    background: #111827;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    position: sticky;
    top: 60px;
    z-index: 40;
  }
`;
const MobileTab = styled.button`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 16px;
  border: none;
  background: none;
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  border-bottom: 2px solid ${({ $active }) => ($active ? "#4e9643" : "transparent")};
  cursor: pointer;
  font-size: 1.1rem;
  position: relative;
`;
const MobileTabLabel = styled.span`
  font-size: 0.6rem;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  white-space: nowrap;
`;
const MobileTabBadge = styled.span`
  position: absolute; top: 6px; right: 8px;
  background: #ef4444; color: white;
  font-size: 0.55rem; font-weight: 700;
  padding: 1px 4px; border-radius: 999px;
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  overflow-x: hidden;
`;

const MainInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px 60px;

  @media (max-width: 600px) { padding: 16px 12px 48px; }
`;

// ── Page heading ──

const PageHeading = styled.h1`
  margin: 0 0 24px;
  font-size: 1.35rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
`;

const SectionHeading = styled.h2`
  margin: 28px 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// ── Stat cards ──

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid #f3f4f6;
  ${({ $wide }) => $wide && css`grid-column: span 2; @media (max-width: 480px) { grid-column: span 1; }`}
`;

const StatCardIcon = styled.div`
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const StatCardBody = styled.div``;
const StatCardValue = styled.div`font-size: 1.4rem; font-weight: 800; line-height: 1.1;`;
const StatCardLabel = styled.div`font-size: 0.72rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 4px;`;

// ── Charts ──

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid #f3f4f6;
`;

const ChartCardHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; margin-bottom: 20px;
`;
const ChartCardTitle = styled.h3`
  margin: 0; font-size: 0.95rem; font-weight: 700; color: #111827;
`;
const ChartEmpty = styled.div`
  height: 160px; display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 0.88rem;
`;

const PeriodGroup = styled.div`display: flex; gap: 4px;`;
const PeriodBtn = styled.button`
  padding: 5px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 600;
  border: 1.5px solid ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#6b7280")};
  cursor: pointer; transition: all 0.15s;
  &:hover { border-color: #2f5a2a; }
`;

const TwoColGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

// ── Tooltip ──

const TooltipBox = styled.div`
  background: white; border-radius: 10px; padding: 10px 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12); border: 1px solid #f3f4f6;
  font-size: 0.82rem;
`;
const TooltipLabel = styled.div`font-weight: 700; color: #111827; margin-bottom: 6px;`;
const TooltipRow   = styled.div`display: flex; align-items: center; gap: 6px; color: #374151;`;
const TooltipDot   = styled.div`width: 8px; height: 8px; border-radius: 50%;`;

// ── Categories ──

const CatGrid = styled.div`display: flex; flex-direction: column; gap: 10px;`;
const CatRow  = styled.div`display: flex; align-items: center; gap: 10px;`;
const CatDot  = styled.div`width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;`;
const CatName = styled.span`font-size: 0.82rem; color: #374151; font-weight: 600; width: 90px; flex-shrink: 0;`;
const CatBar  = styled.div`flex: 1; height: 8px; background: #f3f4f6; border-radius: 999px; overflow: hidden;`;
const CatFill = styled.div`height: 100%; border-radius: 999px; transition: width 0.3s ease;`;
const CatCount = styled.span`font-size: 0.78rem; color: #9ca3af; font-weight: 600; width: 28px; text-align: right; flex-shrink: 0;`;

// ── Toolbar ──

const ToolBar = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
`;
const SearchWrap = styled.div`
  flex: 1; min-width: 200px; position: relative; display: flex; align-items: center;
`;
const SearchIcon = styled.span`
  position: absolute; left: 12px; font-size: 0.9rem; pointer-events: none;
`;
const SearchBox = styled.input`
  width: 100%; padding: 9px 36px; border-radius: 10px;
  border: 1.5px solid #e5e7eb; font-size: 0.88rem;
  color: #111827; background: white; outline: none;
  &:focus { border-color: #2f5a2a; }
  &::placeholder { color: #d1d5db; }
`;
const ClearBtn = styled.button`
  position: absolute; right: 10px; background: #e5e7eb; border: none;
  color: #6b7280; width: 20px; height: 20px; border-radius: 50%;
  cursor: pointer; font-size: 0.65rem; display: flex; align-items: center; justify-content: center;
`;
const CountPill = styled.span`
  background: #f0fdf4; color: #166534; font-size: 0.78rem; font-weight: 700;
  padding: 6px 12px; border-radius: 999px; border: 1px solid #bbf7d0; white-space: nowrap;
`;

// ── Status summary ──

const StatusSummary = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;
`;
const StatusSummaryChip = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 600;
  border: 1.5px solid ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#f0fdf4" : "white")};
  color: ${({ $active }) => ($active ? "#166534" : "#6b7280")};
  cursor: pointer; transition: all 0.15s; white-space: nowrap;
  &:hover { border-color: #2f5a2a; }

  &::before {
    content: '';
    display: ${({ $dot }) => ($dot ? "block" : "none")};
    width: 7px; height: 7px; border-radius: 50%;
    background: ${({ $dot }) => $dot || "transparent"};
  }

  strong { font-weight: 800; color: #111827; }
`;

// ── Table ──

const DataCard = styled.div`
  background: white; border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  border: 1px solid #f3f4f6;
`;
const DataScroll = styled.div`overflow-x: auto; -webkit-overflow-scrolling: touch;`;
const DataTable  = styled.table`width: 100%; border-collapse: collapse; font-size: 0.855rem;`;

const TH = styled.th`
  padding: 11px 14px; text-align: left;
  font-size: 0.7rem; font-weight: 700; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.06em;
  background: #f9fafb; border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
`;
const TR = styled.tr`
  transition: background 0.1s;
  background: ${({ $highlight }) => ($highlight ? "#fdf2f8" : "transparent")};
  &:hover { background: #f9fafb; }
`;
const TD = styled.td`
  padding: 12px 14px; color: #111827;
  border-bottom: 1px solid #f9fafb; vertical-align: middle; white-space: nowrap;
  tr:last-child & { border-bottom: none; }
`;
const TableFooter = styled.div`
  padding: 10px 16px; font-size: 0.78rem; color: #9ca3af;
  background: #f9fafb; border-top: 1px solid #f3f4f6; font-weight: 500;
`;

const Mono = styled.span`font-family: monospace; font-size: 0.78rem; color: #9ca3af;`;
const Muted = styled.span`color: #6b7280; font-size: 0.82rem;`;

// ── User cell ──

const UserCell = styled.div`display: flex; align-items: center; gap: 10px;`;
const UserImg  = styled.img`width: 34px; height: 34px; border-radius: 50%; object-fit: cover; flex-shrink: 0;`;
const UserInitials = styled.div`
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  background: #2f5a2a; color: white;
  font-size: 0.72rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
`;
const UserInfo      = styled.div`min-width: 0;`;
const UserPrimary   = styled.div`font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;`;
const UserSecondary = styled.div`font-size: 0.72rem; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;`;

const ListingCountBadge = styled.span`
  display: inline-block; padding: 2px 10px; border-radius: 999px;
  font-size: 0.75rem; font-weight: 700;
  background: ${({ $zero }) => ($zero ? "#f3f4f6" : "#f0fdf4")};
  color: ${({ $zero }) => ($zero ? "#9ca3af" : "#166534")};
`;

const RoleGroup = styled.div`display: flex; align-items: center; gap: 5px;`;
const RoleBadge = styled.span`
  padding: 2px 8px; border-radius: 999px; font-size: 0.68rem; font-weight: 700;
  background: ${({ $admin, $seller }) => $admin ? "#fef2f2" : $seller ? "#eff6ff" : "#f3f4f6"};
  color: ${({ $admin, $seller }) => $admin ? "#991b1b" : $seller ? "#1e40af" : "#6b7280"};
`;
const ToggleBtn = styled.button`
  width: 24px; height: 24px; border-radius: 6px; font-size: 0.8rem; font-weight: 700;
  border: 1.5px solid ${({ $on, $blocked }) => $blocked ? "#e5e7eb" : $on ? "#2f5a2a" : "#e5e7eb"};
  background: ${({ $on, $blocked }) => $blocked ? "#f9fafb" : $on ? "#f0fdf4" : "white"};
  color: ${({ $on, $blocked }) => $blocked ? "#d1d5db" : $on ? "#2f5a2a" : "#9ca3af"};
  cursor: ${({ $blocked }) => ($blocked ? "not-allowed" : "pointer")};
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  &:hover:not(:disabled) { border-color: #2f5a2a; color: #2f5a2a; }
`;

// ── Admin cap UI ──

/* Row that holds the Users page heading and the seat-counter badge */
const HeadingRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px; margin-bottom: 16px;
`;

/* Pill badge showing X / MAX admin seats. Turns amber when full. */
const AdminCapBadge = styled.span`
  padding: 5px 14px; border-radius: 999px;
  font-size: 0.78rem; font-weight: 700;
  background: ${({ $atCap }) => ($atCap ? "#fff7ed" : "#f0fdf4")};
  color:      ${({ $atCap }) => ($atCap ? "#b45309" : "#166534")};
  border: 1.5px solid ${({ $atCap }) => ($atCap ? "#fed7aa" : "#bbf7d0")};
`;

/* Orange warning strip shown when all admin seats are occupied */
const CapWarning = styled.div`
  padding: 10px 14px; border-radius: 10px; margin-bottom: 14px;
  background: #fff7ed; color: #b45309;
  border: 1px solid #fed7aa; font-size: 0.82rem; font-weight: 600;
`;

// ── Listing cell ──

const ListingCell  = styled.div`display: flex; align-items: center; gap: 10px;`;
const ListingThumb = styled.img`
  width: 40px; height: 40px; border-radius: 8px; object-fit: cover;
  background: #f3f4f6; flex-shrink: 0;
`;
const ListingTitle = styled.span`
  font-weight: 600; max-width: 180px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const CatTag = styled.span`
  padding: 3px 10px; border-radius: 999px;
  font-size: 0.72rem; font-weight: 700; white-space: nowrap;
`;
const PriceText = styled.span`font-weight: 700; color: #166534;`;

// ── Status ──

const StatusPill = styled.span`
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 999px;
  font-size: 0.72rem; font-weight: 700; text-transform: capitalize; white-space: nowrap;
  background: ${({ $s }) => STATUS_META[$s]?.bg  ?? "#f3f4f6"};
  color:      ${({ $s }) => STATUS_META[$s]?.color ?? "#6b7280"};

  &::before {
    content: '';
    width: 6px; height: 6px; border-radius: 50%;
    background: ${({ $s }) => STATUS_META[$s]?.dot ?? "#9ca3af"};
  }
`;

const StatusSelect = styled.select`
  padding: 5px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 600;
  cursor: pointer; outline: none; border: 1.5px solid #e5e7eb;
  background: ${({ $s }) => STATUS_META[$s]?.bg  ?? "white"};
  color:      ${({ $s }) => STATUS_META[$s]?.color ?? "#374151"};
  &:focus { border-color: #2f5a2a; }
`;

const PayBadge = styled.span`
  padding: 3px 10px; border-radius: 999px; font-size: 0.72rem; font-weight: 600;
  background: #f3f4f6; color: #374151; white-space: nowrap;
  text-transform: capitalize;
`;

const AddressTrunc = styled.span`color: #6b7280; font-size: 0.8rem;`;

// ── Action buttons ──

const DangerBtn = styled.button`
  padding: 5px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700;
  cursor: pointer; background: #fef2f2; color: #991b1b;
  border: 1px solid #fecaca; transition: all 0.15s;
  &:hover { background: #991b1b; color: white; border-color: #991b1b; }
`;

// ── Disputes ──

const DisputeBanner = styled.div`
  padding: 12px 16px; background: #fdf2f8; color: #9d174d;
  border: 1px solid #fbcfe8; border-radius: 12px;
  font-size: 0.88rem; font-weight: 600; margin-bottom: 16px;
`;

const ResolveSelect = styled.select`
  padding: 5px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 700;
  cursor: pointer; outline: none;
  border: 1.5px solid #fbcfe8; background: #fdf2f8; color: #9d174d;
  &:focus { border-color: #ec4899; }
`;

// ── Empty ──

const EmptyCard  = styled.div`
  text-align: center; padding: 80px 24px; background: white;
  border-radius: 18px; border: 1px solid #f3f4f6;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
`;
const EmptyIcon  = styled.div`font-size: 3.5rem; margin-bottom: 16px;`;
const EmptyTitle = styled.p`margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; color: #111827;`;
const EmptySub   = styled.p`margin: 0 auto; color: #9ca3af; font-size: 0.88rem; line-height: 1.6; max-width: 360px;`;

// ── Loading ──

const LoadMsg = styled.div`padding: 48px; text-align: center; color: #9ca3af; font-size: 0.88rem;`;

// ── Access denied ──

const AccessWrap  = styled.div`min-height: 80vh; display: flex; align-items: center; justify-content: center;`;
const AccessCard  = styled.div`text-align: center; padding: 56px 40px; background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);`;
const AccessIcon  = styled.div`font-size: 3rem; margin-bottom: 14px;`;
const AccessTitle = styled.h2`margin: 0 0 8px; font-size: 1.2rem; font-weight: 800; color: #111827;`;
const AccessSub   = styled.p`margin: 0 0 20px; color: #9ca3af;`;
const AccessBtn   = styled.button`
  background: #111827; color: white; border: none; padding: 11px 28px;
  border-radius: 10px; font-size: 0.9rem; font-weight: 700; cursor: pointer;
  &:hover { background: #1f2937; }
`;
