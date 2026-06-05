import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import AppNavbar from "./AppNavbar";
import { useAuth } from "../../context/AuthContext";
import {
  useSellerListings,
  useSellerOrders,
  useUpdateOrderStatus,
  useDeleteListing,
  useDashboardStats,
  useToggleAvailability,
} from "../../hooks/useDashboard";
import { useProfile } from "../../hooks/useProfile";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { formatSmartDate } from "../../hooks/dateFormat";

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
  from { opacity: 0; transform: translateY(16px); }
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
  max-width: 1000px;
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

const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: ${C.green};
  color: white;
  border: none;
  border-radius: 11px;
  padding: 11px 22px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 14px rgba(47, 90, 42, 0.35);
  transition:
    background 0.15s,
    box-shadow 0.15s,
    transform 0.1s;

  &:hover {
    background: ${C.forest};
    box-shadow: 0 6px 20px rgba(47, 90, 42, 0.45);
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

// ─── REVENUE HERO CARD ───────────────────────────────────────────────────────
const RevenueCard = styled.div`
  ${animated}
  grid-column: 1 / -1;
  background: linear-gradient(135deg, ${C.forest} 0%, ${C.greenMid} 100%);
  border-radius: 16px;
  padding: 24px 28px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(47, 90, 42, 0.35);
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  &:hover {
    box-shadow: 0 8px 32px rgba(47, 90, 42, 0.45);
    transform: translateY(-2px);
  }
`;

const RevenueLabel = styled.p`
  margin: 0 0 6px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
`;

const RevenueValue = styled.p`
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  font-weight: 800;
  color: white;
  letter-spacing: -1.5px;
  line-height: 1;
`;

const RevenueLink = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 8px 18px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
  transition: background 0.2s;

  ${RevenueCard}:hover & {
    background: rgba(255, 255, 255, 0.25);
  }
`;

// ─── STAT CARDS ──────────────────────────────────────────────────────────────
const ProfileBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(135deg, #fff8e5, #fef3c7);
  border: 1.5px solid #fde68a;
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ProfileBannerLeft = styled.div`flex: 1;`;

const ProfileBannerTitle = styled.p`
  margin: 0 0 3px;
  font-size: 0.93rem;
  font-weight: 800;
  color: #92400e;
`;

const ProfileBannerSub = styled.p`
  margin: 0 0 10px;
  font-size: 0.8rem;
  color: #b45309;
`;

const ProfileProgress = styled.div`
  height: 6px;
  background: #fde68a;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 5px;
`;

const ProfileProgressBar = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #d97706;
  border-radius: 999px;
  transition: width 0.6s ease;
`;

const ProfileBannerPct = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #b45309;
  font-weight: 700;
`;

const ProfileBannerBtn = styled.button`
  padding: 9px 18px;
  border-radius: 10px;
  background: #d97706;
  color: white;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover { background: #b45309; }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px 20px 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(20,57,32,0.06);
  border: 1px solid ${C.border};
`;

const ChartTitle = styled.p`
  margin: 0 0 14px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${C.textMuted};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  ${animated}
  background: ${C.white};
  border-radius: 16px;
  padding: 20px 22px 18px;

  @media (max-width: 480px) {
    padding: 13px 12px 12px;
    border-radius: 12px;
  }
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition:
    box-shadow 0.2s,
    transform 0.2s;

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
    transform: ${({ $clickable }) =>
      $clickable ? "translateY(-2px)" : "none"};
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
    width: 28px; height: 28px; font-size: 0.85rem;
    border-radius: 7px; margin-bottom: 8px;
  }
`;

const StatLabel = styled.p`
  margin: 0 0 5px;
  font-size: 0.73rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: ${C.textMuted};
  @media (max-width: 480px) { font-size: 0.62rem; }
`;

const StatValue = styled.p`
  margin: 0 0 5px;
  font-size: 1.85rem;
  font-weight: 800;
  color: ${C.text};
  letter-spacing: -1px;
  line-height: 1;
  @media (max-width: 480px) { font-size: 1.25rem; letter-spacing: -0.5px; }
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

// ─── TABS ────────────────────────────────────────────────────────────────────
const TabRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 2px solid ${C.border};
  padding-bottom: 0;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => ($active ? C.green : C.textMuted)};
  border-bottom: 3px solid
    ${({ $active }) => ($active ? C.green : "transparent")};
  margin-bottom: -2px;
  transition:
    color 0.15s,
    border-color 0.15s;
  display: flex;
  align-items: center;
  gap: 7px;

  &:hover {
    color: ${C.green};
  }
`;

const TabBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? C.green : C.border)};
  color: ${({ $active }) => ($active ? C.white : C.textMuted)};
  transition:
    background 0.15s,
    color 0.15s;
`;

// ─── FILTER BAR ──────────────────────────────────────────────────────────────
const FilterBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => ($active ? C.green : C.border)};
  background: ${({ $active }) => ($active ? C.mint : C.white)};
  color: ${({ $active }) => ($active ? C.green : C.textMuted)};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${C.green};
    color: ${C.green};
  }
`;

// ─── CARD SHELL ──────────────────────────────────────────────────────────────
const Card = styled.div`
  ${animated}
  background: ${C.white};
  border-radius: 18px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 20px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

// ─── ORDER CARD ──────────────────────────────────────────────────────────────
const OrderCard = styled.div`
  border-bottom: 1px solid ${C.border};
  background: ${({ $expanded }) => ($expanded ? "#e8f5e8" : C.white)};
  transition: background 0.2s, border-color 0.2s;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.12s;
  align-items: center;

  &:hover {
    background: ${({ $expanded }) => ($expanded ? "#edf7ed" : "#f7fbf7")};
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

const OrderLeft = styled.div``;

const OrderIdRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

const OrderId = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
  color: ${C.text};
  font-family: "SF Mono", "Fira Code", monospace;
`;

const OrderDate = styled.span`
  font-size: 0.75rem;
  color: ${C.textMuted};
`;

const OrderMeta = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: ${C.textMuted};
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const MetaDot = styled.span`
  color: ${C.border};
`;

const OrderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;

  @media (max-width: 540px) {
    flex-direction: row;
    align-items: center;
  }
`;

const OrderTotal = styled.span`
  font-size: 1rem;
  font-weight: 800;
  color: ${C.text};
`;

const ExpandToggle = styled.span`
  font-size: 0.7rem;
  color: ${C.textMuted};
  font-weight: 600;
`;

const statusMap = {
  pending:    { bg: C.goldLight,   color: C.gold,   label: "Pending"    },
  confirmed:  { bg: C.mint,        color: C.green,  label: "Confirmed"  },
  processing: { bg: C.purpleLight, color: C.purple, label: "Processing" },
  shipped:    { bg: C.blueLight,   color: C.blue,   label: "Shipped"    },
  delivering: { bg: C.blueLight,   color: C.blue,   label: "Shipping"   },
  delivered:  { bg: C.mint,        color: C.green,  label: "Delivered"  },
  cancelled:  { bg: C.redLight,    color: C.red,    label: "Cancelled"  },
  refunded:   { bg: C.purpleLight, color: C.purple, label: "Refunded"   },
};

const StatusBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 11px;
  border-radius: 999px;
  letter-spacing: 0.02em;
  background: ${({ $s }) => statusMap[$s]?.bg ?? C.mint};
  color: ${({ $s }) => statusMap[$s]?.color ?? C.green};
`;

// ─── EXPANDED ORDER ──────────────────────────────────────────────────────────
const OrderExpanded = styled.div`
  margin: 0 16px 16px;
  padding: 18px 20px;
  display: grid;
  gap: 14px;
  background: white;
  border-radius: 12px;
  border: 1px solid ${C.border};
  animation: ${fadeUp} 0.25s ease;
`;

const SectionLabel = styled.p`
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${C.textMuted};
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  align-items: center;
  background: ${C.bg};
  border-radius: 12px;
  padding: 10px 14px;
`;

const ItemThumb = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 9px;
  object-fit: cover;
  background: ${C.mintDark};
`;

const ItemInfo = styled.div``;
const ItemName = styled.p`
  margin: 0 0 2px;
  font-size: 0.87rem;
  font-weight: 700;
  color: ${C.text};
`;
const ItemMeta = styled.p`
  margin: 0;
  font-size: 0.76rem;
  color: ${C.textMuted};
`;
const ItemPrice = styled.p`
  margin: 0;
  font-size: 0.87rem;
  font-weight: 700;
  color: ${C.text};
  white-space: nowrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBox = styled.div`
  background: ${C.bg};
  border: 1px solid ${C.border};
  border-radius: 12px;
  padding: 12px 16px;
`;

const InfoLabel = styled.p`
  margin: 0 0 3px;
  font-size: 0.71rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: ${C.textMuted};
`;

const InfoValue = styled.p`
  margin: 0;
  font-size: 0.87rem;
  font-weight: 600;
  color: ${C.text};
`;

// ─── STATUS STEPPER ──────────────────────────────────────────────────────────
const stepOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  padding: 12px 0 4px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 11px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: ${({ $done }) => ($done ? C.green : C.border)};
    z-index: 0;
  }
`;

const StepDot = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $done, $current }) =>
    $current ? C.green : $done ? C.mintDark : C.border};
  border: 2px solid
    ${({ $done, $current }) =>
      $current ? C.green : $done ? C.greenMid : C.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: ${({ $done, $current }) =>
    $current || $done ? C.green : C.textMuted};
  z-index: 1;
  position: relative;
`;

const StepLabel = styled.p`
  margin: 5px 0 0;
  font-size: 0.65rem;
  font-weight: 700;
  color: ${({ $done, $current }) =>
    $current ? C.green : $done ? C.textMid : C.textMuted};
  text-align: center;
  text-transform: capitalize;
`;

// ─── ACTION BUTTONS ──────────────────────────────────────────────────────────
const ActionBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition:
    opacity 0.15s,
    transform 0.1s;
  background: ${({ $variant }) =>
    $variant === "danger"
      ? C.redLight
      : $variant === "primary"
        ? C.green
        : C.mint};
  color: ${({ $variant }) =>
    $variant === "danger" ? C.red : $variant === "primary" ? C.white : C.green};

  &:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    transform: none;
  }
`;

// ─── LISTINGS TAB ────────────────────────────────────────────────────────────
const ListingGrid = styled.div``;

const ListingRow = styled.div`
  display: grid;
  grid-template-columns: 68px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid ${C.border};
  transition: background 0.12s;
  animation: ${fadeUp} 0.3s ease both;

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
  width: 68px;
  height: 58px;
  object-fit: cover;
  border-radius: 11px;
  background: ${C.mintDark};
`;

const ListingInfo = styled.div``;

const ListingTitle = styled.p`
  margin: 0 0 3px;
  font-size: 0.92rem;
  font-weight: 700;
  color: ${C.text};
`;

const ListingMeta = styled.p`
  margin: 0 0 2px;
  font-size: 0.78rem;
  color: ${C.textMuted};
`;

const ListingActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 500px) {
    display: none;
  }
`;

const SmallBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: ${({ $variant }) =>
    $variant === "danger" ? C.redLight : C.mint};
  color: ${({ $variant }) => ($variant === "danger" ? C.red : C.green)};
  transition: background 0.15s;

  &:hover {
    background: ${({ $variant }) =>
      $variant === "danger" ? "#f5d5d5" : C.mintDark};
  }
`;

const AvailPill = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 999px;
  background: ${({ $available }) => ($available ? "#eef7ee" : "#fdf0f0")};
  color: ${({ $available }) => ($available ? "#2f5a2a" : "#a32d2d")};
  border: 1px solid ${({ $available }) => ($available ? "#cde5cf" : "#f5c2c2")};
`;

// ─── MISC ────────────────────────────────────────────────────────────────────
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${C.textMuted};
  font-size: 0.9rem;
`;

const EmptyIcon = styled.div`
  font-size: 2.2rem;
  margin-bottom: 10px;
`;

const SkeletonRow = styled.div`
  height: 72px;
  border-radius: 0;
  background: linear-gradient(
    90deg,
    ${C.border} 25%,
    #f7faf7 50%,
    ${C.border} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-bottom: 1px solid ${C.border};
`;

const paymentLabels = {
  cash: "Cash on Delivery",
  mobile: "M-Pesa",
  bank: "Bank Transfer",
};

const ALL_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivering",
  "delivered",
  "cancelled",
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const seller_id = user?.id;

  const [activeTab, setActiveTab] = useState("orders");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: stats } = useDashboardStats(seller_id);
  const { data: profile } = useProfile(seller_id);

  // Profile completion check
  const profileFields = [
    { key: "avatar_url",  label: "Profile photo",  path: "/edit-profile" },
    { key: "farm_name",   label: "Farm name",       path: "/edit-profile" },
    { key: "location",    label: "Location",         path: "/edit-profile" },
    { key: "description", label: "Bio / description", path: "/edit-profile" },
  ];
  const missingFields = profileFields.filter((f) => !profile?.[f.key]);
  const completionPct = Math.round(((profileFields.length - missingFields.length) / profileFields.length) * 100);

  // Revenue chart — last 7 days from ordersRaw
  const revenueChart = (() => {
    const raw = stats?.ordersRaw ?? [];
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    return days.map((d) => {
      const label = d.toLocaleDateString("en-KE", { weekday: "short" });
      const rev = raw
        .filter((item) => item.orders?.created_at &&
          new Date(item.orders.created_at).toDateString() === d.toDateString())
        .reduce((s, item) => s + (item.price_at_purchase * item.quantity || 0), 0);
      return { day: label, revenue: rev };
    });
  })();
  const { data: listings = [], isLoading: loadingListings } =
    useSellerListings(seller_id);
  const { data: orderItems = [], isLoading: loadingOrders } =
    useSellerOrders(seller_id);
  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateOrderStatus();
  const { mutate: deleteListing } = useDeleteListing();
  const { mutate: toggleAvailability } = useToggleAvailability();

  // group items → orders
  const orders = Object.values(
    orderItems.reduce((acc, item) => {
      const oid = item.orders?.id;
      if (!oid) return acc;
      if (!acc[oid]) acc[oid] = { ...item.orders, items: [] };
      acc[oid].items.push(item);
      return acc;
    }, {}),
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const handleStatusUpdate = (order_id, status) =>
    updateStatus({ order_id, status });

  // Returns the available action buttons for a given order status.
  const nextActions = (status) => {
    switch (status) {
      case "pending":
        return [
          { label: "✅ Confirm Order",    status: "confirmed",  variant: "primary" },
          { label: "✗ Cancel",           status: "cancelled",  variant: "danger"  },
        ];
      case "confirmed":
        return [
          { label: "⚙️ Mark as Processing", status: "processing", variant: "primary" },
          { label: "✗ Cancel",              status: "cancelled",  variant: "danger"  },
        ];
      case "processing":
        return [
          { label: "🚚 Mark as Shipped", status: "shipped",   variant: "primary" },
        ];
      case "shipped":
        return [
          { label: "📦 Mark as Delivered", status: "delivered", variant: "primary" },
        ];
      case "delivering":
        return [
          { label: "📦 Mark as Delivered", status: "delivered", variant: "primary" },
        ];
      case "delivered":
        return [
          { label: "↩ Issue Refund", status: "refunded", variant: "danger" },
        ];
      default:
        return [];
    }
  };

  const currentStep = (status) => stepOrder.indexOf(status);

  return (
    <Page>
      <AppNavbar />
      <Wrapper>
        {/* TOP BAR */}
        <TopBar>
          <TitleGroup>
            <Eyebrow>Store Management</Eyebrow>
            <PageSub>Manage your listings and fulfil incoming orders.</PageSub>
          </TitleGroup>
          {/* <AddBtn onClick={() => navigate("/newlist")}>+ New Listing</AddBtn> */}
        </TopBar>

        {/* PROFILE COMPLETION BANNER */}
        {missingFields.length > 0 && (
          <ProfileBanner>
            <ProfileBannerLeft>
              <ProfileBannerTitle>Complete your profile</ProfileBannerTitle>
              <ProfileBannerSub>
                Missing: {missingFields.map((f) => f.label).join(", ")}
              </ProfileBannerSub>
              <ProfileProgress>
                <ProfileProgressBar $pct={completionPct} />
              </ProfileProgress>
              <ProfileBannerPct>{completionPct}% complete</ProfileBannerPct>
            </ProfileBannerLeft>
            <ProfileBannerBtn onClick={() => navigate("/edit-profile")}>
              Complete →
            </ProfileBannerBtn>
          </ProfileBanner>
        )}

        {/* STATS */}
        <StatsGrid>
          <RevenueCard $delay="0s" onClick={() => navigate("/sales")}>
            <div>
              <RevenueLabel>Total Revenue</RevenueLabel>
              <RevenueValue>
                Kes {(stats?.totalRevenue ?? 0).toLocaleString()}
              </RevenueValue>
            </div>
            <RevenueLink>View full report</RevenueLink>
          </RevenueCard>

          <StatCard $color={C.blue} $delay="0.07s">
            <StatIcon $bg={C.blueLight} $color={C.blue}>
              📦
            </StatIcon>
            <StatLabel>Orders Received</StatLabel>
            <StatValue>{stats?.totalOrders ?? 0}</StatValue>
            <StatTag $up>All time</StatTag>
          </StatCard>

          <StatCard $color={C.gold} $delay="0.14s">
            <StatIcon $bg={C.goldLight} $color={C.gold}>
              ⏳
            </StatIcon>
            <StatLabel>Pending Orders</StatLabel>
            <StatValue>{stats?.pendingOrders ?? 0}</StatValue>
            <StatTag>Needs action</StatTag>
          </StatCard>

        </StatsGrid>

        {/* REVENUE CHART */}
        <ChartCard>
          <ChartTitle>Revenue — Last 7 Days</ChartTitle>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueChart} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2f5a2a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2f5a2a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f2e8" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#7b9b7b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#7b9b7b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e8f2e8", fontSize: 12 }}
                formatter={(v) => [`Kes ${v.toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2f5a2a" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: "#2f5a2a" }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* TABS */}
        <TabRow>
          <Tab
            $active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          >
            Orders
            {orders.length > 0 && (
              <TabBadge $active={activeTab === "orders"}>
                {orders.length}
              </TabBadge>
            )}
            {pendingCount > 0 && activeTab !== "orders" && (
              <TabBadge style={{ background: C.gold, color: C.white }}>
                {pendingCount} pending
              </TabBadge>
            )}
          </Tab>
          <Tab
            $active={activeTab === "listings"}
            onClick={() => setActiveTab("listings")}
          >
            Listings
            {listings.length > 0 && (
              <TabBadge $active={activeTab === "listings"}>
                {listings.length}
              </TabBadge>
            )}
          </Tab>
        </TabRow>

        {/* ── ORDERS TAB ─────────────────────────────────────────────── */}
        {activeTab === "orders" && (
          <>
            {/* status filter chips */}
            {orders.length > 0 && (
              <FilterBar>
                {ALL_STATUSES.map((s) => {
                  const count =
                    s === "all"
                      ? orders.length
                      : orders.filter((o) => o.status === s).length;
                  if (s !== "all" && count === 0) return null;
                  return (
                    <FilterChip
                      key={s}
                      $active={statusFilter === s}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s === "all" ? "All" : (statusMap[s]?.label ?? s)} (
                      {count})
                    </FilterChip>
                  );
                })}
              </FilterBar>
            )}

            <Card $delay="0.28s">
              {loadingOrders ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow style={{ opacity: 0.6 }} />
                  <SkeletonRow style={{ opacity: 0.35 }} />
                </>
              ) : filteredOrders.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>📭</EmptyIcon>
                  {statusFilter === "all"
                    ? "No orders received yet."
                    : `No ${statusFilter} orders.`}
                </EmptyState>
              ) : (
                filteredOrders.map((order) => (
                  <OrderCard key={order.id} $expanded={expandedOrder === order.id}>
                    <OrderHeader
                      $expanded={expandedOrder === order.id}
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id,
                        )
                      }
                    >
                      <OrderLeft>
                        <OrderIdRow>
                          <OrderId>
                            #{order.id.slice(0, 8).toUpperCase()}
                          </OrderId>
                          <StatusBadge $s={order.status}>
                            {statusMap[order.status]?.label ?? order.status}
                          </StatusBadge>
                          <OrderDate>
                            {formatSmartDate(order.created_at)}
                          </OrderDate>
                        </OrderIdRow>
                        <OrderMeta>
                          <span>📍 {order.delivery_address}</span>
                          <MetaDot>·</MetaDot>
                          <span>📞 {order.mobile_no}</span>
                          <MetaDot>·</MetaDot>
                          <span>
                            {paymentLabels[order.payment_method] ??
                              order.payment_method}
                          </span>
                          <MetaDot>·</MetaDot>
                          <span>
                            {order.items?.length} item
                            {order.items?.length !== 1 ? "s" : ""}
                          </span>
                        </OrderMeta>
                      </OrderLeft>

                      <OrderRight>
                        <OrderTotal>
                          Kes {order.total_cost?.toLocaleString()}
                        </OrderTotal>
                        <ExpandToggle>
                          {expandedOrder === order.id ? "▲ hide" : "▼ details"}
                        </ExpandToggle>
                      </OrderRight>
                    </OrderHeader>

                    {expandedOrder === order.id && (
                      <OrderExpanded>
                        {/* status stepper */}
                        {!["cancelled", "refunded"].includes(order.status) && (
                          <div>
                            <SectionLabel>Order Progress</SectionLabel>
                            <Stepper>
                              {stepOrder.map((step, i) => {
                                const cur = currentStep(order.status);
                                const done = i < cur;
                                const current = i === cur;
                                return (
                                  <Step key={step} $done={done || current}>
                                    <StepDot $done={done} $current={current}>
                                      {done ? "✓" : i + 1}
                                    </StepDot>
                                    <StepLabel $done={done} $current={current}>
                                      {step}
                                    </StepLabel>
                                  </Step>
                                );
                              })}
                            </Stepper>
                          </div>
                        )}

                        {/* order items */}
                        <div>
                          <SectionLabel>Items Ordered</SectionLabel>
                          {order.items.map((item) => (
                            <ItemRow key={item.id}>
                              <ItemThumb
                                src={item.listings?.image_url}
                                alt={item.listings?.title}
                              />
                              <ItemInfo>
                                <ItemName>{item.listings?.title}</ItemName>
                                <ItemMeta>
                                  Qty: {item.quantity} · {item.listings?.unit} ·{" "}
                                  {item.listings?.category}
                                </ItemMeta>
                              </ItemInfo>
                              <ItemPrice>
                                Kes{" "}
                                {(
                                  item.price_at_purchase * item.quantity
                                ).toLocaleString()}
                              </ItemPrice>
                            </ItemRow>
                          ))}
                        </div>

                        {/* delivery + payment info */}
                        <InfoGrid>
                          <InfoBox>
                            <InfoLabel>Delivery Address</InfoLabel>
                            <InfoValue>{order.delivery_address}</InfoValue>
                          </InfoBox>
                          <InfoBox>
                            <InfoLabel>Contact</InfoLabel>
                            <InfoValue>{order.mobile_no}</InfoValue>
                          </InfoBox>
                          <InfoBox>
                            <InfoLabel>Payment Method</InfoLabel>
                            <InfoValue>
                              {paymentLabels[order.payment_method] ??
                                order.payment_method}
                            </InfoValue>
                          </InfoBox>
                          <InfoBox>
                            <InfoLabel>Order Total</InfoLabel>
                            <InfoValue>
                              Kes {order.total_cost?.toLocaleString()}
                            </InfoValue>
                          </InfoBox>
                        </InfoGrid>

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
                ))
              )}
            </Card>
          </>
        )}

        {/* ── LISTINGS TAB ───────────────────────────────────────────── */}
        {activeTab === "listings" && (
          <Card $delay="0.28s">
            {loadingListings ? (
              <>
                <SkeletonRow />
                <SkeletonRow style={{ opacity: 0.6 }} />
                <SkeletonRow style={{ opacity: 0.35 }} />
              </>
            ) : listings.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🌱</EmptyIcon>
                <p>No listings yet.</p>
                <SmallBtn
                  style={{ margin: "8px auto 0", display: "block" }}
                  onClick={() => navigate("/newlist")}
                >
                  Add your first listing →
                </SmallBtn>
              </EmptyState>
            ) : (
              <ListingGrid>
                {listings.map((listing) => (
                  <ListingRow
                    key={listing.id}
                    onClick={() => navigate(`/listing/${listing.id}`, { state: { listing } })}
                    style={{ cursor: "pointer" }}
                  >
                    <ListingThumb src={listing.image_url} alt={listing.title} />
                    <ListingInfo>
                      <ListingTitle>{listing.title}</ListingTitle>
                      <ListingMeta>
                        Kes {listing.price?.toLocaleString()} / {listing.unit}
                        &nbsp;·&nbsp;{listing.category}
                        &nbsp;·&nbsp;{listing.location}
                      </ListingMeta>
                      {listing.available === false && (
                        <ListingMeta style={{ marginTop: 4 }}>
                          <AvailPill $available={false}>Out of Stock</AvailPill>
                        </ListingMeta>
                      )}
                    </ListingInfo>
                    <ListingActions onClick={(e) => e.stopPropagation()}>
                      <SmallBtn
                        onClick={() =>
                          toggleAvailability({
                            listing_id: listing.id,
                            available: listing.available === false,
                          })
                        }
                        style={listing.available !== false
                          ? {}
                          : { background: "#fdf0f0", color: "#a32d2d" }}
                      >
                        {listing.available !== false ? "Mark Out of Stock" : "Mark Available"}
                      </SmallBtn>
                      <SmallBtn
                        onClick={() =>
                          navigate(`/edit-listing/${listing.id}`, { state: { listing } })
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
