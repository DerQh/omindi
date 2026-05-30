import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { shopProducts as staticProducts } from "../../data/shopProducts";
import { useAuth } from "../../context/AuthContext";
import { useIsAdmin, useShopItems, useDeleteShopItem } from "../../hooks/useShopAdmin";
import AddShopItem from "./AddShopItem";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmerMove = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

// Static products are defined in src/data/shopProducts.js
// DB products (added by admins) come from the shop_products Supabase table
// Both are merged into a single list in the component below

const FILTERS = ["All", "Apparel", "Accessories"];

const badgeConfig = {
  Bestseller: { bg: "#2f5a2a", color: "white" },
  New:        { bg: "#1a5a8a", color: "white" },
  Limited:    { bg: "#a32d2d", color: "white" },
};

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) =>
    i < Math.floor(rating) ? "★" : i < rating ? "★" : "☆"
  ).join("");

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f7f9f7;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.div`
  background: linear-gradient(135deg, #0f2210 0%, #1e3d1a 40%, #2f5a2a 75%, #3d7a35 100%);
  padding: 96px 32px 110px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const HeroDecor = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  pointer-events: none;
`;

const HeroEyebrow = styled.p`
  margin: 0 0 16px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
`;

const HeroTitle = styled.h1`
  margin: 0 auto 16px;
  max-width: 680px;
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.04em;
  line-height: 1.05;
`;

const HeroGreen = styled.span`
  color: #6fcf6f;
`;

const HeroSub = styled.p`
  margin: 0 auto 36px;
  max-width: 520px;
  font-size: 1.05rem;
  color: rgba(255,255,255,0.65);
  line-height: 1.7;
`;

const HeroCtas = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

const HeroCtaPrimary = styled.a`
  background: white;
  color: #2f5a2a;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #eef7ee;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
`;

const HeroCtaSecondary = styled.a`
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.3);
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
`;

const HeroChips = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroChip = styled.span`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.8);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// ─── Stats Strip ──────────────────────────────────────────────────────────────

const StatsStrip = styled.div`
  background: white;
  border-bottom: 1px solid #e8f0e8;
  padding: 0 32px;
`;

const StatsInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 700px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatItem = styled.div`
  padding: 22px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-right: 1px solid #e8f0e8;

  &:last-child { border-right: none; }

  @media (max-width: 700px) {
    &:nth-child(2) { border-right: none; }
  }
`;

const StatIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef7ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const StatText = styled.div``;

const StatVal = styled.p`
  margin: 0 0 2px;
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const StatDesc = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #7b8f7f;
`;

// ─── Category Showcase ────────────────────────────────────────────────────────

const ShowcaseWrap = styled.div`
  max-width: 1200px;
  margin: 56px auto 0;
  padding: 0 32px;

  @media (max-width: 600px) { padding: 0 16px; }
`;

const SectionEyebrow = styled.p`
  margin: 0 0 8px;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2f5a2a;
`;

const SectionTitle = styled.h2`
  margin: 0 0 28px;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  color: #1a2e1a;
  letter-spacing: -0.03em;
`;

const CategoryCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const CategoryCard = styled.button`
  position: relative;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  border: none;
  cursor: pointer;
  background: ${({ $bg }) => $bg || "#2f5a2a"};
  display: flex;
  align-items: flex-end;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.16);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%);
  }
`;

const CategoryCardContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: left;
`;

const CategoryCardTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
`;

const CategoryCardCount = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.75);
`;

const CategoryArrow = styled.span`
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 1;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background 0.2s;

  ${CategoryCard}:hover & {
    background: rgba(255,255,255,0.35);
  }
`;

// ─── Bestsellers Section ──────────────────────────────────────────────────────

const SectionWrap = styled.div`
  max-width: 1200px;
  margin: 56px auto 0;
  padding: 0 32px;

  @media (max-width: 600px) { padding: 0 16px; }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
`;

const SeeAllLink = styled.a`
  font-size: 0.85rem;
  font-weight: 700;
  color: #2f5a2a;
  text-decoration: none;
  cursor: pointer;

  &:hover { text-decoration: underline; }
`;

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 4px;
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
`;

const FilterTab = styled.button`
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#7b8f7f")};

  &:hover {
    background: ${({ $active }) => ($active ? "#2f5a2a" : "#f0f7ee")};
    color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  }
`;

const ResultCount = styled.p`
  margin: 0;
  font-size: 0.82rem;
  color: #7b8f7f;
  font-weight: 600;
`;

// ─── Product Grid ─────────────────────────────────────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

// ─── Product Card ─────────────────────────────────────────────────────────────

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => `${$i * 0.07}s`};

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.12);
  }
`;

const CardImageWrap = styled.div`
  position: relative;
  height: 280px;
  background: #e8f0e8;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.06);
  }
`;

const BadgeChip = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  background: ${({ $badge }) => badgeConfig[$badge]?.bg ?? "#2f5a2a"};
  color: ${({ $badge }) => badgeConfig[$badge]?.color ?? "white"};
`;

const LowStockChip = styled.span`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff8e5;
  color: #b07d00;
  border: 1px solid #f0d080;
`;

// Overlay slides up on hover — shows "Quick View" CTA
const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(20,50,20,0.6) 0%, transparent 55%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  opacity: 0;
  transition: opacity 0.25s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const QuickViewBtn = styled.span`
  background: white;
  color: #2f5a2a;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 9px 22px;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;

const CardBody = styled.div`
  padding: 18px 20px 20px;
`;

const CategoryLabel = styled.p`
  margin: 0 0 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7b8f7f;
`;

const ProductName = styled.h3`
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #1a2e1a;
  line-height: 1.35;
`;

const ProductDesc = styled.p`
  margin: 0 0 14px;
  font-size: 0.8rem;
  color: #7b8f7f;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
`;

const Stars = styled.span`
  color: #f0b33d;
  font-size: 0.82rem;
  letter-spacing: 1px;
`;

const RatingVal = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const RatingCount = styled.span`
  font-size: 0.75rem;
  color: #7b8f7f;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Price = styled.p`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const ShopBtn = styled(Link)`
  background: #2f5a2a;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 9px 20px;
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.18s;

  &:hover { background: #1e3d1a; }
`;

// ─── Newsletter CTA ───────────────────────────────────────────────────────────

const NewsletterWrap = styled.div`
  background: linear-gradient(135deg, #1e3d1a 0%, #2f5a2a 100%);
  margin: 72px 32px 0;
  border-radius: 24px;
  max-width: 1136px;
  margin-left: auto;
  margin-right: auto;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    right: -60px; top: -80px;
    pointer-events: none;
  }

  @media (max-width: 600px) {
    margin: 48px 16px 0;
    padding: 40px 24px;
    flex-direction: column;
    text-align: center;
  }
`;

const NewsletterText = styled.div``;

const NewsletterTitle = styled.h2`
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
`;

const NewsletterSub = styled.p`
  margin: 0;
  color: rgba(255,255,255,0.65);
  font-size: 0.9rem;
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 600px) { width: 100%; }
`;

const NewsletterInput = styled.input`
  padding: 13px 18px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  color: #1a2e1a;
  width: 240px;
  outline: none;
  font-family: inherit;

  @media (max-width: 600px) { flex: 1; width: auto; }
`;

const NewsletterBtn = styled.button`
  background: #6fcf6f;
  color: #1a2e1a;
  border: none;
  padding: 13px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s;

  &:hover { background: #8de08d; }
`;

const Spacer = styled.div`
  height: ${({ $h }) => $h || "64px"};
`;

// ─── Component ────────────────────────────────────────────────────────────────

// Admin delete button — shown on each card when the user is an admin
const AdminDeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 52px;
  z-index: 3;
  background: rgba(163, 45, 45, 0.9);
  border: none;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  ${Card}:hover & { opacity: 1; }

  &:hover { background: #a32d2d; }
`;

const AdminAddBtn = styled.button`
  background: white;
  color: #2f5a2a;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover { background: #eef7ee; transform: translateY(-2px); }
`;

function Shop() {
  const { user } = useAuth();
  const { data: isAdmin = false } = useIsAdmin(user?.id);
  const { data: dbProducts = [] } = useShopItems();
  const { mutate: deleteItem } = useDeleteShopItem();

  const [activeFilter, setActiveFilter] = useState("All");
  const [email, setEmail] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Merge static products with admin-added DB products
  // DB products get a dynamic link via their numeric id
  const products = [
    ...staticProducts,
    ...dbProducts.map((p) => ({
      ...p,
      image: p.image_url,
      alt: p.name,
    })),
  ];

  const filtered =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.category === activeFilter);

  const bestsellers = products.filter((p) => p.badge === "Bestseller");
  const apparelCount = products.filter((p) => p.category === "Apparel").length;
  const accessoriesCount = products.filter((p) => p.category === "Accessories").length;

  const scrollToShop = () =>
    document.getElementById("all-products")?.scrollIntoView({ behavior: "smooth" });

  return (
    <Page>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroDecor style={{ width: 600, height: 600, top: -250, right: -150 }} />
        <HeroDecor style={{ width: 300, height: 300, bottom: -100, left: -80 }} />
        <HeroEyebrow>Official Merchandise</HeroEyebrow>
        <HeroTitle>
          Gear Up for <HeroGreen>Local Farming</HeroGreen>
        </HeroTitle>
        <HeroSub>
          Premium Afarmer merchandise. Every item you wear or carry supports
          farmers and buyers connecting across Kenya.
        </HeroSub>
        <HeroCtas>
          <HeroCtaPrimary onClick={scrollToShop}>Shop All Products</HeroCtaPrimary>
          <HeroCtaSecondary onClick={() => setActiveFilter("Apparel")}>
            Browse Apparel
          </HeroCtaSecondary>
          {/* Admin-only: add new item button */}
          {isAdmin && (
            <AdminAddBtn onClick={() => setShowAddModal(true)}>
              ＋ Add Item
            </AdminAddBtn>
          )}
        </HeroCtas>
        <HeroChips>
          <HeroChip>🌿 {products.length} Products</HeroChip>
          <HeroChip>🚚 Nationwide Delivery</HeroChip>
          <HeroChip>✓ Official Gear</HeroChip>
          <HeroChip>↩ Easy Returns</HeroChip>
        </HeroChips>
      </Hero>

      {/* ── Stats strip ── */}
      <StatsStrip>
        <StatsInner>
          <StatItem>
            <StatIconBox>🌿</StatIconBox>
            <StatText>
              <StatVal>100% Authentic</StatVal>
              <StatDesc>Official Afarmer products only</StatDesc>
            </StatText>
          </StatItem>
          <StatItem>
            <StatIconBox>🚚</StatIconBox>
            <StatText>
              <StatVal>Free Delivery</StatVal>
              <StatDesc>On orders over Kes 3,000</StatDesc>
            </StatText>
          </StatItem>
          <StatItem>
            <StatIconBox>↩</StatIconBox>
            <StatText>
              <StatVal>Easy Returns</StatVal>
              <StatDesc>14-day hassle-free returns</StatDesc>
            </StatText>
          </StatItem>
          <StatItem>
            <StatIconBox>🔒</StatIconBox>
            <StatText>
              <StatVal>Secure Checkout</StatVal>
              <StatDesc>M-Pesa, card & cash on delivery</StatDesc>
            </StatText>
          </StatItem>
        </StatsInner>
      </StatsStrip>

      {/* ── Category showcase ── */}
      <ShowcaseWrap>
        <SectionEyebrow>Shop by Category</SectionEyebrow>
        <SectionTitle>What are you looking for?</SectionTitle>
        <CategoryCards>
          <CategoryCard
            $bg="#2f5a2a"
            onClick={() => { setActiveFilter("Apparel"); scrollToShop(); }}
          >
            <CategoryCardContent>
              <CategoryCardTitle>Apparel</CategoryCardTitle>
              <CategoryCardCount>{apparelCount} items — T-shirts, Hoodies, Hats</CategoryCardCount>
            </CategoryCardContent>
            <CategoryArrow>→</CategoryArrow>
          </CategoryCard>
          <CategoryCard
            $bg="#1a3d5a"
            onClick={() => { setActiveFilter("Accessories"); scrollToShop(); }}
          >
            <CategoryCardContent>
              <CategoryCardTitle>Accessories</CategoryCardTitle>
              <CategoryCardCount>{accessoriesCount} items — Mugs, Tote Bags</CategoryCardCount>
            </CategoryCardContent>
            <CategoryArrow>→</CategoryArrow>
          </CategoryCard>
        </CategoryCards>
      </ShowcaseWrap>

      {/* ── Bestsellers ── */}
      {bestsellers.length > 0 && (
        <SectionWrap>
          <SectionHeader>
            <div>
              <SectionEyebrow>Fan Favourites</SectionEyebrow>
              <SectionTitle style={{ marginBottom: 0 }}>Bestsellers</SectionTitle>
            </div>
            <SeeAllLink onClick={scrollToShop}>See all products →</SeeAllLink>
          </SectionHeader>
          <Grid>
            {bestsellers.map((product, i) => (
              <Card key={product.id} $i={i}>
                <CardImageWrap>
                  <img loading="lazy" src={product.image} alt={product.alt} />
                  {product.badge && (
                    <BadgeChip $badge={product.badge}>{product.badge}</BadgeChip>
                  )}
                  {product.stock <= 8 && (
                    <LowStockChip>Only {product.stock} left</LowStockChip>
                  )}
                  {/* Admin-only delete button — visible on card hover */}
                  {isAdmin && !staticProducts.find((s) => s.id === product.id) && (
                    <AdminDeleteBtn onClick={(e) => { e.preventDefault(); deleteItem(product.id); }}>
                      🗑 Remove
                    </AdminDeleteBtn>
                  )}
                  <HoverOverlay>
                    <QuickViewBtn>Quick View</QuickViewBtn>
                  </HoverOverlay>
                </CardImageWrap>
                <CardBody>
                  <CategoryLabel>{product.category}</CategoryLabel>
                  <ProductName>{product.name}</ProductName>
                  <ProductDesc>{product.description}</ProductDesc>
                  <RatingRow>
                    <Stars>{renderStars(product.rating)}</Stars>
                    <RatingVal>{product.rating.toFixed(1)}</RatingVal>
                    <RatingCount>({product.reviews} reviews)</RatingCount>
                  </RatingRow>
                  <CardFooter>
                    <Price>Kes {product.price.toLocaleString()}</Price>
                    <ShopBtn to={`/shop/item/${product.id}`}>Buy Now →</ShopBtn>
                  </CardFooter>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </SectionWrap>
      )}

      {/* ── All products with filter ── */}
      <SectionWrap id="all-products">
        <SectionHeader>
          <div>
            <SectionEyebrow>Full Collection</SectionEyebrow>
            <SectionTitle style={{ marginBottom: 0 }}>All Products</SectionTitle>
          </div>
        </SectionHeader>

        <FilterRow>
          <FilterTabs>
            {FILTERS.map((f) => (
              <FilterTab
                key={f}
                $active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </FilterTab>
            ))}
          </FilterTabs>
          <ResultCount>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "All" ? ` in ${activeFilter}` : ""}
          </ResultCount>
        </FilterRow>

        <Grid>
          {filtered.map((product, i) => (
            <Card key={product.id} $i={i}>
              <CardImageWrap>
                <img loading="lazy" src={product.image} alt={product.alt} />
                {product.badge && (
                  <BadgeChip $badge={product.badge}>{product.badge}</BadgeChip>
                )}
                {product.stock <= 8 && (
                  <LowStockChip>Only {product.stock} left</LowStockChip>
                )}
                {/* Admin-only delete — only for DB products, not static ones */}
                {isAdmin && !staticProducts.find((s) => s.id === product.id) && (
                  <AdminDeleteBtn onClick={(e) => { e.preventDefault(); deleteItem(product.id); }}>
                    🗑 Remove
                  </AdminDeleteBtn>
                )}
                <HoverOverlay>
                  <QuickViewBtn>Quick View</QuickViewBtn>
                </HoverOverlay>
              </CardImageWrap>
              <CardBody>
                <CategoryLabel>{product.category}</CategoryLabel>
                <ProductName>{product.name}</ProductName>
                <ProductDesc>{product.description}</ProductDesc>
                <RatingRow>
                  <Stars>{renderStars(product.rating)}</Stars>
                  <RatingVal>{product.rating.toFixed(1)}</RatingVal>
                  <RatingCount>({product.reviews} reviews)</RatingCount>
                </RatingRow>
                <CardFooter>
                  <Price>Kes {product.price.toLocaleString()}</Price>
                  <ShopBtn to={`/shop/item/${product.id}`}>Shop Now →</ShopBtn>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </SectionWrap>

      {/* ── Newsletter CTA ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <NewsletterWrap>
          <NewsletterText>
            <NewsletterTitle>New drops & exclusive deals</NewsletterTitle>
            <NewsletterSub>
              Join 2,000+ Afarmer fans. Get notified when new merch lands
              and unlock member-only discounts.
            </NewsletterSub>
          </NewsletterText>
          <NewsletterForm onSubmit={(e) => { e.preventDefault(); setEmail(""); }}>
            <NewsletterInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <NewsletterBtn type="submit">Subscribe</NewsletterBtn>
          </NewsletterForm>
        </NewsletterWrap>
      </div>

      <Spacer $h="72px" />
      <FooterContainer />

      {/* Admin modal — only mounts when admin clicks "Add Item" */}
      {showAddModal && (
        <AddShopItem onClose={() => setShowAddModal(false)} />
      )}
    </Page>
  );
}

export default Shop;
