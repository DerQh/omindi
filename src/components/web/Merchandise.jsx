import { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { shopProducts } from "../../data/shopProducts";
import { useShopItem } from "../../hooks/useShopAdmin";
import { useShopItemReviews, useHasReviewedShopItem, useAddShopItemReview } from "../../hooks/useReviews";
import { useUser } from "../../hooks/useUser";
import { supabase } from "../../../supabase";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const toastIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: translateY(32px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const dotBlink = keyframes`
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
  40%            { opacity: 1;    transform: scale(1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const confettiDrop = keyframes`
  0%   { transform: translateY(-40px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(280px) rotate(720deg); opacity: 0; }
`;

const checkPop = keyframes`
  0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
  60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(47,90,42,0.4); }
  50%       { box-shadow: 0 0 0 18px rgba(47,90,42,0); }
`;

// ─── Static option data ───────────────────────────────────────────────────────

const colors = [
  { value: "black", label: "Black", hex: "#1a1a1a" },
  { value: "white", label: "White", hex: "#f0f0f0" },
  { value: "green", label: "Green", hex: "#2f5a2a" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];

const renderStars = (rating, interactive = false, hover = 0, onClick) =>
  Array.from({ length: 5 }, (_, i) => {
    const filled = interactive ? i < (hover || rating) : i < Math.round(rating);
    return (
      <StarIcon
        key={i}
        $filled={filled}
        $interactive={interactive}
        onMouseEnter={interactive ? () => onClick("hover", i + 1) : undefined}
        onMouseLeave={interactive ? () => onClick("hover", 0) : undefined}
        onClick={interactive ? () => onClick("set", i + 1) : undefined}
      >
        {filled ? "★" : "☆"}
      </StarIcon>
    );
  });

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #f7f9f7;
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 32px 80px;

  @media (max-width: 600px) {
    padding: 20px 16px 60px;
  }
`;

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  margin-bottom: 28px;
  color: #7b8f7f;

  a {
    color: #2f5a2a;
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const BreadSep = styled.span`
  color: #cde5cf;
`;

// ─── Product Layout ───────────────────────────────────────────────────────────

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: start;
  margin-bottom: 56px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

// ─── Image Section ────────────────────────────────────────────────────────────

const ImageSection = styled.div`
  position: sticky;
  top: 100px;

  @media (max-width: 900px) {
    position: static;
  }
`;

const MainImage = styled.div`
  border-radius: 20px;
  overflow: hidden;
  background: #e8f0e8;
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;

    &:hover {
      transform: scale(1.03);
    }
  }
`;

// Thumbnail row — clicking would switch the main image in a real implementation
const ThumbRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

const Thumb = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  cursor: pointer;
  background: #e8f0e8;
  transition: border-color 0.15s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: #2f5a2a;
  }
`;

// ─── Product Summary ──────────────────────────────────────────────────────────

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeUp} 0.4s ease;
`;

const CategoryChip = styled.span`
  display: inline-block;
  background: #eef7ee;
  color: #2f5a2a;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

const ProductTitle = styled.h1`
  margin: 0 0 10px;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 900;
  color: #1a2e1a;
  letter-spacing: -0.03em;
  line-height: 1.15;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const StarIcon = styled.span`
  font-size: ${({ $interactive }) => ($interactive ? "1.6rem" : "0.95rem")};
  color: ${({ $filled }) => ($filled ? "#f0b33d" : "#d0d8d0")};
  cursor: ${({ $interactive }) => ($interactive ? "pointer" : "default")};
  transition: color 0.12s;
  line-height: 1;
  user-select: none;
`;

const RatingText = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const RatingCount = styled.span`
  font-size: 0.82rem;
  color: #7b8f7f;
`;

const Price = styled.p`
  margin: 0 0 18px;
  font-size: 2rem;
  font-weight: 900;
  color: #2f5a2a;
  letter-spacing: -0.03em;
`;

const HRule = styled.div`
  height: 1px;
  background: #e8f0e8;
  margin: 4px 0 22px;
`;

const DescText = styled.p`
  margin: 0 0 24px;
  font-size: 0.93rem;
  color: #556652;
  line-height: 1.75;
`;

// ─── Options ──────────────────────────────────────────────────────────────────

const OptionBlock = styled.div`
  margin-bottom: 22px;
`;

const OptionLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SizeGuideLink = styled.a`
  font-size: 0.75rem;
  font-weight: 600;
  color: #2f5a2a;
  text-decoration: underline;
  text-transform: none;
  letter-spacing: 0;
  cursor: pointer;
`;

// Color swatches — circular buttons with the actual colour
const SwatchRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Swatch = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $hex }) => $hex};
  border: 3px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  outline: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "#e0ece0")};
  cursor: pointer;
  transition:
    outline-color 0.15s,
    border-color 0.15s,
    transform 0.15s;
  position: relative;

  &:hover {
    transform: scale(1.12);
  }
  &::after {
    content: "${({ $label }) => $label}";
    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.65rem;
    color: #7b8f7f;
    white-space: nowrap;
  }
`;

// Size pill buttons
const SizePills = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SizePill = styled.button`
  min-width: 48px;
  padding: 8px 14px;
  border-radius: 9px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#556652")};
  border: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "#d7edd9")};

  &:hover {
    border-color: #2f5a2a;
    color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  }
`;

// Quantity stepper — − / count / + instead of a plain number input
const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #d7edd9;
  border-radius: 12px;
  overflow: hidden;
  width: fit-content;
`;

const QtyBtn = styled.button`
  width: 42px;
  height: 44px;
  border: none;
  background: white;
  color: #2f5a2a;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #eef7ee;
  }
  &:disabled {
    color: #cde5cf;
    cursor: not-allowed;
  }
`;

const QtyVal = styled.span`
  min-width: 44px;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #1a2e1a;
  border-left: 1px solid #e8f0e8;
  border-right: 1px solid #e8f0e8;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// ─── CTA Buttons ──────────────────────────────────────────────────────────────

const CtaRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0 16px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddBtn = styled.button`
  flex: 2;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 15px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.18s,
    transform 0.12s;
  letter-spacing: 0.01em;

  &:hover {
    background: #1e3d1a;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const WishBtn = styled.button`
  flex: 1;
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  padding: 15px 18px;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #eef7ee;
    border-color: #2f5a2a;
  }
`;

// ─── Cart Toast ───────────────────────────────────────────────────────────────

const CartToast = styled.div`
  background: #eef7ee;
  border: 1.5px solid #a8d5ac;
  border-radius: 12px;
  padding: 13px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #2f5a2a;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${toastIn} 0.3s ease;
`;

const CartToastError = styled(CartToast)`
  background: #fdf0f0;
  border-color: #f5c6c2;
  color: #a32d2d;
`;

// ─── Trust Badges ─────────────────────────────────────────────────────────────

const TrustRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f8f5;
  border-radius: 10px;
  padding: 10px 12px;
`;

const TrustIcon = styled.span`
  font-size: 1.1rem;
`;

const TrustText = styled.p`
  margin: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #556652;
  line-height: 1.35;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: #7b8f7f;
  border-top: 1px solid #e8f0e8;
  padding-top: 16px;
  margin-top: 4px;
`;

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TabsWrap = styled.div`
  margin-bottom: 56px;
`;

const TabBar = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e8f0e8;
  margin-bottom: 28px;
`;

const TabBtn = styled.button`
  padding: 13px 28px;
  border: none;
  background: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#7b8f7f")};
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  margin-bottom: -2px;
  transition:
    color 0.15s,
    border-color 0.15s;

  &:hover {
    color: #2f5a2a;
  }
`;

const TabContent = styled.div`
  animation: ${slideIn} 0.25s ease;
`;

const TabCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    border-bottom: 1px solid #f0f7ee;
    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 12px 16px;
    font-size: 0.9rem;

    &:first-child {
      color: #7b8f7f;
      font-weight: 600;
      width: 180px;
    }

    &:last-child {
      color: #1a2e1a;
      font-weight: 500;
    }
  }
`;

// ─── Review Form ──────────────────────────────────────────────────────────────

const ReviewIntro = styled.p`
  margin: 0 0 20px;
  color: #7b8f7f;
  font-size: 0.9rem;
  line-height: 1.65;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  &.full {
    grid-column: 1 / -1;
  }
`;

const FieldLabel = styled.label`
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const inputStyles = css`
  padding: 12px 16px;
  border: 1.5px solid #d7edd9;
  border-radius: 10px;
  font-size: 16px;
  color: #1a2e1a;
  background: #f8faf6;
  outline: none;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &::placeholder {
    color: #aac4aa;
  }
  &:focus {
    border-color: #2f5a2a;
    background: white;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;
const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 110px;
  line-height: 1.6;
`;

const StarRatingRow = styled.div`
  display: flex;
  gap: 4px;
  margin: 4px 0;
`;

const CheckRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  grid-column: 1 / -1;
  font-size: 0.88rem;
  color: #556652;
`;

const SubmitBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 13px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  grid-column: 1 / -1;
  width: fit-content;
  transition: background 0.18s;

  &:hover {
    background: #1e3d1a;
  }
`;

const StatusMsg = styled.div`
  padding: 13px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  grid-column: 1 / -1;
  background: ${({ $error }) => ($error ? "#fdf0f0" : "#eef7ee")};
  color: ${({ $error }) => ($error ? "#a32d2d" : "#2f5a2a")};
  border: 1px solid ${({ $error }) => ($error ? "#f5c6c2" : "#a8d5ac")};
`;

// ─── Related Products ─────────────────────────────────────────────────────────

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const RelatedCard = styled(Link)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  display: block;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
    background: #e8f0e8;
  }
`;

const RelatedBody = styled.div`
  padding: 14px 16px 18px;
`;

const RelatedName = styled.p`
  margin: 0 0 6px;
  font-size: 0.93rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const RelatedPrice = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const SectionEyebrow = styled.p`
  margin: 0 0 6px;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2f5a2a;
`;

const SectionTitle = styled.h2`
  margin: 0 0 24px;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2e1a;
  letter-spacing: -0.03em;
`;

// ─── Shop review list items ───────────────────────────────────────────────────

const ShopReviewItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f7ee;
  &:last-child { border-bottom: none; }
`;

const ShopReviewAvatar = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #d7edd9;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ShopReviewInitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const ShopReviewBody = styled.div`flex: 1; min-width: 0;`;

const ShopReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const ShopReviewName = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const ShopReviewStars = styled.span`
  color: #f0b33d;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const ShopReviewText = styled.p`
  margin: 0 0 4px;
  font-size: 0.88rem;
  color: #556652;
  line-height: 1.6;
`;

const ShopReviewDate = styled.span`
  font-size: 0.75rem;
  color: #aac4aa;
`;

// ─── Buy Now Button ───────────────────────────────────────────────────────────

const BuyNowBtn = styled.button`
  flex: 2;
  background: linear-gradient(135deg, #2f5a2a 0%, #1e3d1a 100%);
  color: white;
  border: none;
  padding: 15px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.18s;
  letter-spacing: 0.01em;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0);
    transition: background 0.15s;
  }
  &:hover::before { background: rgba(255,255,255,0.08); }
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(47,90,42,0.35); }
  &:active { transform: translateY(0); }
`;

// ─── Buy Now Modal ────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 10, 0.72);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 700px) {
    align-items: center;
  }
`;

const ModalSheet = styled.div`
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 24px 24px 0 0;
  animation: ${modalIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  @media (min-width: 700px) {
    border-radius: 24px;
    max-height: 85vh;
  }

  /* hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #f1f5f1;
  color: #556652;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.15s;
  &:hover { background: #e0eee0; }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f0f7ee;
`;

const ModalTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 900;
  color: #1a2e1a;
  letter-spacing: -0.02em;
`;

const ModalSub = styled.p`
  margin: 0;
  font-size: 0.83rem;
  color: #8a9e87;
`;

const ModalBody = styled.div`
  padding: 20px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderSummaryCard = styled.div`
  background: #f7fbf4;
  border: 1.5px solid #d7edd9;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

const OrderThumb = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8f0e8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OrderName = styled.p`
  margin: 0 0 3px;
  font-size: 0.9rem;
  font-weight: 800;
  color: #1a2e1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OrderMeta = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #7b8f7f;
`;

const OrderPrice = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 900;
  color: #2f5a2a;
  white-space: nowrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.78rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const BuyInput = styled.input`
  padding: 12px 14px;
  border: 1.5px solid ${({ $error }) => ($error ? "#e07070" : "#d7edd9")};
  border-radius: 10px;
  font-size: 0.95rem;
  color: #1a2e1a;
  background: #f8faf6;
  outline: none;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;

  &::placeholder { color: #aac4aa; }
  &:focus {
    border-color: ${({ $error }) => ($error ? "#e07070" : "#2f5a2a")};
    background: white;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FieldErr = styled.p`
  margin: 0;
  font-size: 0.74rem;
  color: #c0392b;
  font-weight: 600;
`;

const PayBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2f5a2a 0%, #1a3d1a 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: all 0.18s;

  &:hover { box-shadow: 0 6px 20px rgba(47,90,42,0.3); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;

/* ── Processing state ── */

const ProcessingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 56px 24px;
  text-align: center;
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border: 4px solid #d7edd9;
  border-top-color: #2f5a2a;
  border-right-color: #2f5a2a;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ProcessingTitle = styled.p`
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const ProcessingNote = styled.p`
  margin: 0;
  font-size: 0.83rem;
  color: #8a9e87;
  max-width: 280px;
`;

/* ── STK Sent state ── */

const StkWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px 24px 36px;
  text-align: center;
`;

const StkRingWrap = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const CountdownNum = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  font-weight: 900;
  color: ${({ $urgent }) => ($urgent ? "#c0392b" : "#2f5a2a")};
`;

const StkTitle = styled.p`
  margin: 0 0 4px;
  font-size: 1.05rem;
  font-weight: 900;
  color: #1a2e1a;
`;

const StkNote = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #7b8f7f;
  max-width: 300px;
  line-height: 1.6;
`;

const StkSteps = styled.div`
  background: #f7fbf4;
  border: 1.5px solid #d7edd9;
  border-radius: 14px;
  padding: 16px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StkStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.83rem;
  color: #556652;
  line-height: 1.45;
`;

const StkStepNum = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: #2f5a2a;
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StkPhone = styled.div`
  font-size: 2.2rem;
  animation: ${css`${keyframes`
    0%,100% { transform: rotate(-6deg); }
    50%      { transform: rotate(6deg); }
  `} 0.6s ease-in-out infinite`};
`;

const LiveDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #27ae60;
  margin-right: 6px;
  animation: ${glowPulse} 1.4s ease infinite;
`;

const StkCancelBtn = styled.button`
  background: none;
  border: 1.5px solid #d7edd9;
  color: #8a9e87;
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #c0392b; color: #c0392b; }
`;

const StkErrorMsg = styled.p`
  margin: 0;
  font-size: 0.83rem;
  color: #c0392b;
  font-weight: 600;
  background: #fdf0f0;
  border: 1px solid #f5c6c2;
  border-radius: 8px;
  padding: 10px 14px;
  width: 100%;
`;

/* ── Confirmed state ── */

const ConfirmedWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 24px 44px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const CONFETTI_PIECES = [
  { color: "#2f5a2a", left: "12%", delay: "0s", size: 8 },
  { color: "#f0b33d", left: "25%", delay: "0.1s", size: 6 },
  { color: "#1a7a4a", left: "38%", delay: "0.05s", size: 10 },
  { color: "#e55a2b", left: "50%", delay: "0.2s", size: 7 },
  { color: "#2f5a2a", left: "62%", delay: "0.15s", size: 9 },
  { color: "#f0b33d", left: "75%", delay: "0s", size: 6 },
  { color: "#3a8a5a", left: "88%", delay: "0.08s", size: 8 },
  { color: "#e55a2b", left: "5%", delay: "0.25s", size: 7 },
  { color: "#1a7a4a", left: "95%", delay: "0.18s", size: 9 },
];

const ConfettiPiece = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size * 1.6}px;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  animation: ${confettiDrop} 1.8s ease forwards;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
`;

const SuccessCircle = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2f5a2a, #1a7a4a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  animation: ${checkPop} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, ${glowPulse} 2s ease 0.5s infinite;
  position: relative;
  z-index: 1;
`;

const ConfirmedTitle = styled.p`
  margin: 0 0 4px;
  font-size: 1.2rem;
  font-weight: 900;
  color: #1a2e1a;
`;

const ConfirmedSub = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #7b8f7f;
  max-width: 280px;
  line-height: 1.6;
`;

const ConfirmedDetails = styled.div`
  background: #f7fbf4;
  border: 1.5px solid #d7edd9;
  border-radius: 14px;
  padding: 16px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ConfirmedRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
`;

const ConfirmedLabel = styled.span`
  color: #8a9e87;
  font-weight: 600;
`;

const ConfirmedVal = styled.span`
  color: #1a2e1a;
  font-weight: 700;
`;

const DoneBtn = styled.button`
  width: 100%;
  background: #f1f8f0;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: #e0f0de; border-color: #2f5a2a; }
`;

// ─── Not-found state ──────────────────────────────────────────────────────────

const NotFoundWrap = styled.div`
  text-align: center;
  padding: 100px 24px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

function Merchandise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Use product from navigation state when available — avoids ID collision between
  // static products (IDs 1–6) and DB products (BIGSERIAL also starting from 1).
  const stateProduct = location.state?.product;

  // Only fetch from DB when no state was passed (e.g. direct URL access).
  const { data: dbProduct, isLoading: isLoadingDb } = useShopItem(
    stateProduct ? null : id
  );

  const product = stateProduct
    ?? dbProduct
    ?? shopProducts.find((p) => p.id === parseInt(id));

  // Related products: up to 3 others in the same category, excluding the current one
  const related = shopProducts
    .filter((p) => p.id !== product?.id && p.category === product?.category)
    .slice(0, 3)
    // If same-category doesn't fill 3, backfill from other products
    .concat(
      shopProducts
        .filter((p) => p.id !== product?.id && p.category !== product?.category)
        .slice(
          0,
          Math.max(
            0,
            3 -
              shopProducts.filter(
                (p) => p.id !== product?.id && p.category === product?.category,
              ).length,
          ),
        ),
    );

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [cartMsg, setCartMsg] = useState({ text: "", error: false });
  const [activeTab, setActiveTab] = useState("description");

  // Buy Now modal state
  const [buyStep, setBuyStep] = useState("idle"); // idle | form | processing | stk_sent | confirmed
  const [buyForm, setBuyForm] = useState({ name: "", phone: "", address: "" });
  const [buyErrors, setBuyErrors] = useState({});
  const [stkCheckoutId, setStkCheckoutId] = useState(null);
  const [stkSecondsLeft, setStkSecondsLeft] = useState(60);
  const [stkError, setStkError] = useState("");
  const [confirmedDetails, setConfirmedDetails] = useState(null);
  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  // Interactive star rating for the review form
  const [hoverStar, setHoverStar] = useState(0);
  const [review, setReview] = useState({ rating: 0, comment: "" });
  const [reviewMsg, setReviewMsg] = useState({ text: "", error: false });

  const { data: user } = useUser();
  const shopItemId = product?.id ?? null;
  const { data: shopReviews = [] } = useShopItemReviews(shopItemId);
  const { data: hasReviewedShop } = useHasReviewedShopItem(user?.id, shopItemId);
  const { mutate: addShopReview, isPending: submittingShopReview } = useAddShopItemReview();

  if (isLoadingDb) return null;

  // Show a clean not-found page if the ID doesn't match any product
  if (!product) {
    return (
      <>
        <Navbar />
        <Page>
          <NotFoundWrap>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌿</div>
            <h2 style={{ color: "#1a2e1a", marginBottom: 8 }}>
              Product not found
            </h2>
            <p style={{ color: "#7b8f7f", marginBottom: 24 }}>
              This item doesn't exist or may have been removed.
            </p>
            <button
              onClick={() => navigate("/shop")}
              style={{
                background: "#2f5a2a",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Back to Shop
            </button>
          </NotFoundWrap>
        </Page>
        <FooterContainer />
      </>
    );
  }

  const handleStarInteraction = (type, val) => {
    if (type === "hover") setHoverStar(val);
    if (type === "set") setReview((p) => ({ ...p, rating: val }));
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setCartMsg({
        text: "Please choose a colour and size before adding to cart.",
        error: true,
      });
      return;
    }
    setCartMsg({
      text: `✓ Added ${quantity} × ${product.name} (${selectedColor}, ${selectedSize}) to your cart.`,
      error: false,
    });
  };

  // ── Buy Now: M-Pesa polling effect ─────────────────────────────────────────
  useEffect(() => {
    if (buyStep !== "stk_sent" || !stkCheckoutId) return;

    let elapsed = 0;
    const TIMEOUT = 60;

    const confirm = () => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
      setConfirmedDetails({
        name: buyForm.name,
        phone: buyForm.phone,
        address: buyForm.address,
        item: product.name,
        color: selectedColor,
        size: selectedSize,
        quantity,
        total: product.price * quantity,
      });
      setBuyStep("confirmed");
    };

    const fail = (msg) => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
      setStkError(msg || "Payment was cancelled or failed. Please try again.");
      setBuyStep("stk_sent");
    };

    countdownRef.current = setInterval(() => {
      elapsed += 1;
      setStkSecondsLeft(TIMEOUT - elapsed);
      if (elapsed >= TIMEOUT) {
        clearInterval(countdownRef.current);
        clearInterval(pollRef.current);
        setStkError("Payment timed out. Please try again.");
        setBuyStep("form");
        setStkCheckoutId(null);
      }
    }, 1000);

    pollRef.current = setInterval(async () => {
      if (elapsed >= 10 && stkCheckoutId) {
        try {
          const { data: qData } = await supabase.functions.invoke("mpesa-stk-query", {
            body: { checkout_request_id: stkCheckoutId, order_id: null },
          });
          if (qData?.status === "confirmed") { confirm(); return; }
          if (qData?.status === "failed") { fail("Payment was declined. Please try again."); return; }
        } catch { /* keep polling */ }
      }
    }, 3000);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(countdownRef.current);
    };
  }, [buyStep, stkCheckoutId]);

  // ── Buy Now: form validation + STK push ────────────────────────────────────
  const validateBuyForm = () => {
    const errs = {};
    if (!buyForm.name.trim()) errs.name = "Name is required";
    if (!/^(07|01|2547|2541)\d{8}$/.test(buyForm.phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid Safaricom number (07xx or 01xx)";
    if (!buyForm.address.trim()) errs.address = "Delivery address is required";
    setBuyErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBuyNow = async () => {
    if (!validateBuyForm()) return;
    setBuyStep("processing");
    setStkError("");

    const phone = buyForm.phone.replace(/\s/g, "");
    const amount = product.price * quantity;

    try {
      const { data, error: fnErr } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { phone, amount: 1, order_id: null }, // amount:1 for testing; swap to `amount` for live
      });
      if (fnErr || data?.error) throw new Error(data?.error || fnErr?.message || "STK Push failed");

      setStkCheckoutId(data.CheckoutRequestID);
      setStkSecondsLeft(60);
      setBuyStep("stk_sent");
    } catch (err) {
      setStkError(err.message || "Failed to initiate M-Pesa payment. Please try again.");
      setBuyStep("form");
    }
  };

  const closeBuyModal = () => {
    clearInterval(pollRef.current);
    clearInterval(countdownRef.current);
    setBuyStep("idle");
    setStkCheckoutId(null);
    setStkSecondsLeft(60);
    setStkError("");
    setBuyErrors({});
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg({ text: "Please log in to leave a review.", error: true });
      return;
    }
    if (!review.rating || !review.comment.trim()) {
      setReviewMsg({ text: "Please provide a star rating and a written review.", error: true });
      return;
    }
    addShopReview(
      { shop_item_id: shopItemId, rating: review.rating, comment: review.comment },
      {
        onSuccess: () => {
          setReviewMsg({ text: "Thank you! Your review has been submitted.", error: false });
          setReview({ rating: 0, comment: "" });
          setHoverStar(0);
        },
        onError: (err) => {
          setReviewMsg({ text: err.message ?? "Could not save review. Please try again.", error: true });
        },
      },
    );
  };

  return (
    <>
      <Navbar />
      <Page>
        <Container>
          {/* ── Breadcrumb ── */}
          {/* <Breadcrumb>
            <Link to="/">Home</Link>
            <BreadSep>/</BreadSep>
            <Link to="/shop">Shop</Link>
            <BreadSep>/</BreadSep>
            <span>{product.category}</span>
            <BreadSep>/</BreadSep>
            <strong style={{ color: "#1a2e1a" }}>{product.name}</strong>
          </Breadcrumb> */}

          {/* ── Product layout ── */}
          <ProductLayout>
            {/* Left: sticky image gallery */}
            <ImageSection>
              <MainImage>
                <img loading="lazy" src={product.image} alt={product.name} />
              </MainImage>
              {/* Thumbnail row — clicking would switch main image in a real gallery */}
              <ThumbRow>
                {[1, 2, 3].map((_, i) => (
                  <Thumb key={i} $active={i === 0}>
                    <img loading="lazy" src={product.image} alt="" />
                  </Thumb>
                ))}
              </ThumbRow>
            </ImageSection>

            {/* Right: product summary */}
            <Summary>
              <CategoryChip>{product.category}</CategoryChip>
              <ProductTitle>{product.name}</ProductTitle>

              <RatingRow>
                {renderStars(product.rating)}
                <RatingText>{product.rating.toFixed(1)}</RatingText>
                <RatingCount>({product.reviews} reviews)</RatingCount>
              </RatingRow>

              <Price>Kes {product.price.toLocaleString()}</Price>
              <HRule />
              <DescText>{product.description}</DescText>

              {/* Colour swatches */}
              <OptionBlock>
                <OptionLabel>
                  Colour
                  {selectedColor && (
                    <span
                      style={{
                        color: "#2f5a2a",
                        fontWeight: 600,
                        textTransform: "none",
                        letterSpacing: 0,
                      }}
                    >
                      — {colors.find((c) => c.value === selectedColor)?.label}
                    </span>
                  )}
                </OptionLabel>
                <SwatchRow>
                  {colors.map((c) => (
                    <Swatch
                      key={c.value}
                      $hex={c.hex}
                      $active={selectedColor === c.value}
                      $label={c.label}
                      onClick={() => setSelectedColor(c.value)}
                      title={c.label}
                    />
                  ))}
                </SwatchRow>
              </OptionBlock>

              {/* Size pills */}
              <OptionBlock style={{ marginTop: 18 }}>
                <OptionLabel>
                  Size
                  <SizeGuideLink href="#">Size guide </SizeGuideLink>
                </OptionLabel>
                <SizePills>
                  {sizes.map((s) => (
                    <SizePill
                      key={s}
                      $active={selectedSize === s}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </SizePill>
                  ))}
                </SizePills>
              </OptionBlock>

              {/* Quantity stepper */}
              <OptionBlock>
                <OptionLabel>Quantity</OptionLabel>
                <QuantityRow>
                  <QtyBtn
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </QtyBtn>
                  <QtyVal>{quantity}</QtyVal>
                  <QtyBtn onClick={() => setQuantity((q) => q + 1)}>+</QtyBtn>
                </QuantityRow>
              </OptionBlock>

              {/* CTA buttons */}
              <CtaRow>
                <BuyNowBtn onClick={() => setBuyStep("form")}>
                  Buy Now
                </BuyNowBtn>
                <WishBtn onClick={() => setWishlist((w) => !w)}>
                  {wishlist ? "❤️" : "🤍"} Save
                </WishBtn>
              </CtaRow>
              <AddBtn onClick={handleAddToCart} style={{ marginTop: -8 }}>🛒 Add to Cart</AddBtn>

              {/* Cart feedback toast */}
              {cartMsg.text &&
                (cartMsg.error ? (
                  <CartToastError>{cartMsg.text}</CartToastError>
                ) : (
                  <CartToast>{cartMsg.text}</CartToast>
                ))}

              {/* Trust badges */}
              <TrustRow>
                <TrustBadge>
                  <TrustIcon>🚚</TrustIcon>
                  <TrustText>Free delivery over Kes 3,000</TrustText>
                </TrustBadge>
                <TrustBadge>
                  <TrustIcon>↩</TrustIcon>
                  <TrustText>14-day easy returns</TrustText>
                </TrustBadge>
                <TrustBadge>
                  <TrustIcon>🔒</TrustIcon>
                  <TrustText>Secure M-Pesa checkout</TrustText>
                </TrustBadge>
              </TrustRow>

              <MetaRow>
                <span>SKU: {product.sku}</span>
                <span>Category: {product.category}</span>
              </MetaRow>
            </Summary>
          </ProductLayout>

          {/* ── Tabs: Description | Details | Reviews ── */}
          <TabsWrap>
            <TabBar>
              {["description", "details", "reviews"].map((tab) => (
                <TabBtn
                  key={tab}
                  $active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "reviews" && ` (${shopReviews.length})`}
                </TabBtn>
              ))}
            </TabBar>

            <TabContent key={activeTab}>
              <TabCard>
                {activeTab === "description" && (
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.8,
                      color: "#556652",
                      fontSize: "0.95rem",
                    }}
                  >
                    {product.description}
                  </p>
                )}

                {activeTab === "details" && (
                  product.details?.length > 0 ? (
                    <InfoTable>
                      <tbody>
                        {product.details.map((d) => (
                          <tr key={d.label}>
                            <td>{d.label}</td>
                            <td>{d.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </InfoTable>
                  ) : (
                    <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>No additional details available.</p>
                  )
                )}

                {activeTab === "reviews" && (
                  <>
                    {/* Existing reviews list */}
                    {shopReviews.length > 0 && (
                      <div style={{ marginBottom: 32 }}>
                        {shopReviews.map((r) => (
                          <ShopReviewItem key={r.id}>
                            <ShopReviewAvatar>
                              {r.profiles?.avatar_url
                                ? <img src={r.profiles.avatar_url} alt="" />
                                : <ShopReviewInitial>
                                    {(r.profiles?.full_name || "?")[0].toUpperCase()}
                                  </ShopReviewInitial>
                              }
                            </ShopReviewAvatar>
                            <ShopReviewBody>
                              <ShopReviewHeader>
                                <ShopReviewName>
                                  {r.profiles?.full_name || "Customer"}
                                </ShopReviewName>
                                <ShopReviewStars>
                                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                </ShopReviewStars>
                              </ShopReviewHeader>
                              {r.comment && <ShopReviewText>{r.comment}</ShopReviewText>}
                              <ShopReviewDate>
                                {new Date(r.created_at).toLocaleDateString("en-KE", {
                                  month: "short", day: "numeric", year: "numeric",
                                })}
                              </ShopReviewDate>
                            </ShopReviewBody>
                          </ShopReviewItem>
                        ))}
                      </div>
                    )}

                    {/* Already reviewed */}
                    {hasReviewedShop && (
                      <StatusMsg style={{ marginBottom: 16 }}>
                        ✓ You've already reviewed this product.
                      </StatusMsg>
                    )}

                    {/* Write a review form */}
                    {!hasReviewedShop && (
                      <>
                        <ReviewIntro>
                          {shopReviews.length === 0
                            ? `Be the first to review "${product.name}".`
                            : `Share your experience with "${product.name}".`}
                        </ReviewIntro>

                        <form onSubmit={handleReviewSubmit}>
                          <FormGrid>
                            <FieldWrap className="full">
                              <FieldLabel>Your rating *</FieldLabel>
                              <StarRatingRow>
                                {renderStars(review.rating, true, hoverStar, handleStarInteraction)}
                              </StarRatingRow>
                            </FieldWrap>

                            <FieldWrap className="full">
                              <FieldLabel>Your review *</FieldLabel>
                              <Textarea
                                name="comment"
                                value={review.comment}
                                onChange={(e) => setReview((p) => ({ ...p, comment: e.target.value }))}
                                placeholder="Share your experience with this product…"
                                required
                              />
                            </FieldWrap>

                            {reviewMsg.text && (
                              <StatusMsg $error={reviewMsg.error} className="full">
                                {reviewMsg.text}
                              </StatusMsg>
                            )}

                            <SubmitBtn type="submit" disabled={submittingShopReview}>
                              {submittingShopReview ? "Submitting…" : "Submit Review"}
                            </SubmitBtn>
                          </FormGrid>
                        </form>
                      </>
                    )}
                  </>
                )}
              </TabCard>
            </TabContent>
          </TabsWrap>

          {/* ── Related products ── */}
          <div>
            <SectionEyebrow>You might also like</SectionEyebrow>
            <SectionTitle>Related Products</SectionTitle>
            <RelatedGrid>
              {related.map((item) => (
                <RelatedCard key={item.id} to={`/shop/item/${item.id}`} state={{ product: item }}>
                  <img loading="lazy" src={item.image} alt={item.name} />
                  <RelatedBody>
                    <RelatedName>{item.name}</RelatedName>
                    <RelatedPrice>
                      Kes {item.price.toLocaleString()}
                    </RelatedPrice>
                  </RelatedBody>
                </RelatedCard>
              ))}
            </RelatedGrid>
          </div>
        </Container>
      </Page>
      <FooterContainer />

      {/* ── Buy Now Modal ── */}
      {buyStep !== "idle" && (
        <Overlay onClick={(e) => { if (e.target === e.currentTarget) closeBuyModal(); }}>
          <ModalSheet>
            {buyStep === "form" && (
              <>
                <ModalHeader>
                  <ModalTitle>Complete your purchase</ModalTitle>
                  <ModalSub>No account needed — M-Pesa payment only</ModalSub>
                  <ModalClose onClick={closeBuyModal} aria-label="Close">✕</ModalClose>
                </ModalHeader>

                <ModalBody>
                  {/* Order summary */}
                  <OrderSummaryCard>
                    <OrderThumb>
                      <img src={product.image} alt={product.name} />
                    </OrderThumb>
                    <OrderInfo>
                      <OrderName>{product.name}</OrderName>
                      <OrderMeta>
                        {selectedColor
                          ? `${colors.find((c) => c.value === selectedColor)?.label ?? selectedColor}`
                          : "No colour selected"}
                        {selectedSize ? ` · Size ${selectedSize}` : ""}
                        {` · Qty ${quantity}`}
                      </OrderMeta>
                    </OrderInfo>
                    <OrderPrice>Kes {(product.price * quantity).toLocaleString()}</OrderPrice>
                  </OrderSummaryCard>

                  {/* Contact fields */}
                  <FormGroup>
                    <Label>Your name</Label>
                    <BuyInput
                      placeholder="e.g. John Kamau"
                      value={buyForm.name}
                      onChange={(e) => setBuyForm((p) => ({ ...p, name: e.target.value }))}
                      $error={!!buyErrors.name}
                    />
                    {buyErrors.name && <FieldErr>{buyErrors.name}</FieldErr>}
                  </FormGroup>

                  <FormGroup>
                    <Label>M-Pesa phone number</Label>
                    <BuyInput
                      placeholder="0712 345 678"
                      value={buyForm.phone}
                      onChange={(e) => setBuyForm((p) => ({ ...p, phone: e.target.value }))}
                      $error={!!buyErrors.phone}
                      type="tel"
                    />
                    {buyErrors.phone && <FieldErr>{buyErrors.phone}</FieldErr>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Delivery address</Label>
                    <BuyInput
                      placeholder="e.g. Westlands, Nairobi"
                      value={buyForm.address}
                      onChange={(e) => setBuyForm((p) => ({ ...p, address: e.target.value }))}
                      $error={!!buyErrors.address}
                    />
                    {buyErrors.address && <FieldErr>{buyErrors.address}</FieldErr>}
                  </FormGroup>

                  {stkError && <StkErrorMsg>{stkError}</StkErrorMsg>}

                  <PayBtn onClick={handleBuyNow}>
                    📱 Pay Kes {(product.price * quantity).toLocaleString()} via M-Pesa
                  </PayBtn>

                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#aac4aa", textAlign: "center" }}>
                    🔒 Secured by Safaricom M-Pesa · No card required
                  </p>
                </ModalBody>
              </>
            )}

            {buyStep === "processing" && (
              <ProcessingWrap>
                <Spinner />
                <ProcessingTitle>Sending STK Push…</ProcessingTitle>
                <ProcessingNote>
                  Connecting to M-Pesa. A payment prompt will appear on your phone shortly.
                </ProcessingNote>
              </ProcessingWrap>
            )}

            {buyStep === "stk_sent" && (
              <>
                <ModalClose onClick={closeBuyModal} aria-label="Close" style={{ top: 12, right: 12 }}>✕</ModalClose>
                <StkWrap>
                  {/* Countdown SVG ring */}
                  <StkRingWrap>
                    <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#e8f0e8" strokeWidth="6" />
                      <circle
                        cx="50" cy="50" r="44"
                        fill="none"
                        stroke={stkSecondsLeft <= 15 ? "#c0392b" : "#2f5a2a"}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 44}`}
                        strokeDashoffset={`${2 * Math.PI * 44 * (1 - stkSecondsLeft / 60)}`}
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                      />
                    </svg>
                    <CountdownNum $urgent={stkSecondsLeft <= 15}>{stkSecondsLeft}</CountdownNum>
                  </StkRingWrap>

                  <StkPhone>📱</StkPhone>

                  <StkTitle>Check your phone</StkTitle>
                  <StkNote>
                    An M-Pesa prompt has been sent to{" "}
                    <strong style={{ color: "#1a2e1a" }}>{buyForm.phone}</strong>.
                    Enter your PIN to complete the purchase.
                  </StkNote>

                  <StkSteps>
                    <StkStep>
                      <StkStepNum>1</StkStepNum>
                      A pop-up has appeared on your phone
                    </StkStep>
                    <StkStep>
                      <StkStepNum>2</StkStepNum>
                      Enter your M-Pesa PIN when prompted
                    </StkStep>
                    <StkStep>
                      <StkStepNum>3</StkStepNum>
                      We'll confirm your order automatically
                    </StkStep>
                  </StkSteps>

                  <div style={{ display: "flex", alignItems: "center", fontSize: "0.8rem", color: "#8a9e87" }}>
                    <LiveDot />
                    Waiting for confirmation…
                  </div>

                  {stkError && <StkErrorMsg>{stkError}</StkErrorMsg>}

                  <StkCancelBtn onClick={closeBuyModal}>Cancel payment</StkCancelBtn>
                </StkWrap>
              </>
            )}

            {buyStep === "confirmed" && confirmedDetails && (
              <ConfirmedWrap>
                {CONFETTI_PIECES.map((p, i) => (
                  <ConfettiPiece key={i} $color={p.color} $left={p.left} $delay={p.delay} $size={p.size} />
                ))}

                <SuccessCircle>✓</SuccessCircle>

                <div>
                  <ConfirmedTitle>Payment confirmed!</ConfirmedTitle>
                  <ConfirmedSub>
                    Your order is on its way. We'll reach out to{" "}
                    <strong style={{ color: "#1a2e1a" }}>{confirmedDetails.name}</strong> to arrange delivery.
                  </ConfirmedSub>
                </div>

                <ConfirmedDetails>
                  <ConfirmedRow>
                    <ConfirmedLabel>Item</ConfirmedLabel>
                    <ConfirmedVal>{confirmedDetails.item}</ConfirmedVal>
                  </ConfirmedRow>
                  {confirmedDetails.color && (
                    <ConfirmedRow>
                      <ConfirmedLabel>Colour / Size</ConfirmedLabel>
                      <ConfirmedVal>
                        {confirmedDetails.color}
                        {confirmedDetails.size ? ` / ${confirmedDetails.size}` : ""}
                      </ConfirmedVal>
                    </ConfirmedRow>
                  )}
                  <ConfirmedRow>
                    <ConfirmedLabel>Quantity</ConfirmedLabel>
                    <ConfirmedVal>×{confirmedDetails.quantity}</ConfirmedVal>
                  </ConfirmedRow>
                  <ConfirmedRow>
                    <ConfirmedLabel>Total paid</ConfirmedLabel>
                    <ConfirmedVal style={{ color: "#2f5a2a" }}>
                      Kes {confirmedDetails.total.toLocaleString()}
                    </ConfirmedVal>
                  </ConfirmedRow>
                  <ConfirmedRow>
                    <ConfirmedLabel>Deliver to</ConfirmedLabel>
                    <ConfirmedVal>{confirmedDetails.address}</ConfirmedVal>
                  </ConfirmedRow>
                </ConfirmedDetails>

                <DoneBtn onClick={closeBuyModal}>Done</DoneBtn>
              </ConfirmedWrap>
            )}
          </ModalSheet>
        </Overlay>
      )}
    </>
  );
}

export default Merchandise;
