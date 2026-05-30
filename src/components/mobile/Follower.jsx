import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, css } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  70%  { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 48px;
`;

// ─── Cover Banner ─────────────────────────────────────────────────────────────

const Cover = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%);
  overflow: hidden;

  /* Decorative circles on the cover */
  &::before {
    content: "";
    position: absolute;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    top: -80px;
    right: -40px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    bottom: -30px;
    left: 30px;
  }
`;

// Back button floats over the cover image
const BackBtn = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }
`;

// ─── Profile Identity ─────────────────────────────────────────────────────────

// Wraps avatar + name + follow — floats below the cover
const ProfileSection = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
`;

// Avatar sits on the boundary between cover and white area
const Avatar = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-top: -55px;
  display: block;
  animation: ${popIn} 0.5s ease forwards;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 4px;
  flex-wrap: wrap;
`;

const SellerName = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a3318;
`;

// Verified badge shown when rating >= 4.7
const VerifiedBadge = styled.span`
  background: #eef7ee;
  color: #2f5a2a;
  border: 1px solid #cde5cf;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const CategoryRow = styled.p`
  margin: 0 0 10px;
  color: #7b8f7f;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
`;

const Stars = styled.span`
  color: #f0b33d;
  font-size: 1rem;
  letter-spacing: 1px;
`;

const RatingVal = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
`;

const ReviewCount = styled.span`
  font-size: 0.88rem;
  color: #7b8f7f;
`;

// Follow + Message buttons side by side
const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
`;

const FollowBtn = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $following }) =>
    $following
      ? css`
          background: #eef7ee;
          color: #2f5a2a;
          border: 2px solid #2f5a2a;
          &:hover {
            background: #fff0f0;
            color: #c0392b;
            border-color: #f5c6c2;
          }
        `
      : css`
          background: #2f5a2a;
          color: white;
          border: 2px solid #2f5a2a;
          &:hover {
            background: #245026;
          }
        `}
`;

const MessageBtn = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #eef7ee;
    border-color: #2f5a2a;
  }
`;

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBar = styled.div`
  max-width: 960px;
  margin: 0 auto 24px;
  padding: 0 24px;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  animation: ${slideUp} 0.35s ease;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 0;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 4px 0;

  /* Vertical divider between stats (except last) */
  &:not(:last-child) {
    border-right: 1px solid #eef7ee;
  }
`;

const StatNumber = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #2f5a2a;
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: 0.78rem;
  color: #7b8f7f;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4px;
`;

// ─── About Section ────────────────────────────────────────────────────────────

const Section = styled.div`
  max-width: 960px;
  margin: 0 auto 24px;
  padding: 0 24px;
  animation: ${slideUp} 0.4s ease;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 700;
  color: #1a3318;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AboutText = styled.p`
  margin: 0;
  color: #556652;
  font-size: 0.93rem;
  line-height: 1.7;
`;

// ─── Products Section ─────────────────────────────────────────────────────────

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(20, 57, 32, 0.07);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(20, 57, 32, 0.13);
  }
`;

const ProductImageWrap = styled.div`
  position: relative;
  height: 160px;
  background: #d7edd9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Price badge overlaid on bottom-left of product image
const PriceBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: #2f5a2a;
  color: white;
  font-size: 0.82rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
`;

const ProductBody = styled.div`
  padding: 14px 16px 16px;
`;

const ProductName = styled.h4`
  margin: 0 0 10px;
  font-size: 0.98rem;
  color: #1a3318;
  font-weight: 700;
`;

// "View Listing" CTA on each product card
const ViewBtn = styled.button`
  width: 100%;
  padding: 9px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  background: #eef7ee;
  color: #2f5a2a;
  border: 1px solid #cde5cf;
  transition: all 0.2s ease;

  &:hover {
    background: #2f5a2a;
    color: white;
    border-color: #2f5a2a;
  }
`;

// ─── Not Found State ──────────────────────────────────────────────────────────

const NotFound = styled.div`
  text-align: center;
  padding: 80px 24px;
`;

const NotFoundIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const NotFoundTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a3318;
  margin: 0 0 8px;
`;

const NotFoundDesc = styled.p`
  color: #7b8f7f;
  margin: 0 0 20px;
  font-size: 0.9rem;
`;

const GoBackBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #245026; }
`;

// ─── Sellers data ─────────────────────────────────────────────────────────────
// Replace with a real Supabase fetch keyed by seller ID when the API is ready

const sellers = [
  {
    id: 1,
    name: "Amina's Farm",
    category: "Vegetables",
    location: "Nairobi",
    rating: 4.8,
    reviews: 42,
    image: "/amina.jpg",
    description: "Specializing in organic vegetables grown with sustainable practices. We focus on quality and freshness — every harvest is hand-picked and delivered same day.",
    followers: 156,
    listings: 24,
    joined: "Jan 2024",
    products: [
      { id: 1, name: "Organic Tomatoes", price: "Kes 12 / kg", image: "/tomatoes.jpg" },
      { id: 2, name: "Fresh Lettuce", price: "Kes 8 / bunch", image: "/kales.jpg" },
      { id: 3, name: "Bell Peppers", price: "Kes 15 / kg", image: "/pepper.png" },
    ],
  },
  {
    id: 2,
    name: "Maziwa Organics",
    category: "Dairy",
    location: "Kiambu",
    rating: 4.6,
    reviews: 30,
    image: "/maziwa.png",
    description: "Providing fresh, organic dairy products from grass-fed cows. Committed to animal welfare and quality — no hormones, no shortcuts.",
    followers: 89,
    listings: 12,
    joined: "Mar 2024",
    products: [
      { id: 4, name: "Organic Milk", price: "Kes 6 / liter", image: "https://picsum.photos/200" },
      { id: 5, name: "Free-Range Eggs", price: "Kes 5 / dozen", image: "/eggs.jpg" },
    ],
  },
  {
    id: 3,
    name: "Honey Harvest",
    category: "Honey",
    location: "Nanyuki",
    rating: 4.9,
    reviews: 55,
    image: "/honeyfarm.jpg",
    description: "Producing pure, raw honey from local beehives. Sustainable beekeeping practices for the very best flavour and nutritional value.",
    followers: 203,
    listings: 8,
    joined: "Dec 2023",
    products: [
      { id: 6, name: "Wildflower Honey", price: "Kes 18 / jar", image: "/honey.jpg" },
    ],
  },
];

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? "★" : "☆")).join("");

// ─── Component ────────────────────────────────────────────────────────────────
// Reached via /follower/:id — id matches seller.id in the sellers array above.

const Follower = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const seller = sellers.find((s) => s.id === parseInt(id));

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(seller?.followers ?? 0);

  const handleFollowToggle = () => {
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    setIsFollowing((prev) => !prev);
  };

  // Seller qualifies as verified if rating is 4.7+
  const isVerified = seller && seller.rating >= 4.7;

  if (!seller) {
    return (
      <>
        <AppNavbar />
        <Container>
          <NotFound>
            <NotFoundIcon>🌿</NotFoundIcon>
            <NotFoundTitle>Seller not found</NotFoundTitle>
            <NotFoundDesc>This seller profile doesn't exist or may have been removed.</NotFoundDesc>
            <GoBackBtn onClick={() => navigate(-1)}>Go Back</GoBackBtn>
          </NotFound>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container>

        {/* ── Cover banner with back button overlaid ── */}
        <Cover>
          <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
        </Cover>

        {/* ── Profile identity ── */}
        <ProfileSection>
          <Avatar src={seller.image} alt={seller.name} />

          <NameRow>
            <SellerName>{seller.name}</SellerName>
            {isVerified && <VerifiedBadge>✓ Verified</VerifiedBadge>}
          </NameRow>

          <CategoryRow>
            🌿 {seller.category} &nbsp;·&nbsp; 📍 {seller.location}
          </CategoryRow>

          <RatingRow>
            <Stars>{renderStars(seller.rating)}</Stars>
            <RatingVal>{seller.rating.toFixed(1)}</RatingVal>
            <ReviewCount>({seller.reviews} reviews)</ReviewCount>
          </RatingRow>

          {/* Follow and message CTAs side by side */}
          <ActionRow>
            <FollowBtn $following={isFollowing} onClick={handleFollowToggle}>
              {isFollowing ? "✓ Following" : "+ Follow"}
            </FollowBtn>
            <MessageBtn onClick={() => navigate("/messages")}>
              💬 Message
            </MessageBtn>
          </ActionRow>
        </ProfileSection>

        {/* ── Stats bar: followers, listings, rating, since ── */}
        <StatsBar>
          <StatsCard>
            <StatItem>
              <StatNumber>{followersCount}</StatNumber>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{seller.listings}</StatNumber>
              <StatLabel>Listings</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{seller.rating.toFixed(1)}</StatNumber>
              <StatLabel>Rating</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber style={{ fontSize: "0.9rem" }}>{seller.joined}</StatNumber>
              <StatLabel>Since</StatLabel>
            </StatItem>
          </StatsCard>
        </StatsBar>

        {/* ── About section ── */}
        <Section>
          <SectionCard>
            <SectionTitle>📋 About</SectionTitle>
            <AboutText>{seller.description}</AboutText>
          </SectionCard>
        </Section>

        {/* ── Products ── */}
        <Section>
          <SectionTitle style={{ paddingLeft: 0 }}>
            🛒 Products
            <span style={{ color: "#7b8f7f", fontWeight: 400, fontSize: "0.88rem" }}>
              &nbsp;· {seller.products.length} listing{seller.products.length !== 1 ? "s" : ""}
            </span>
          </SectionTitle>
          <ProductsGrid>
            {seller.products.map((product) => (
              <ProductCard
                key={product.id}
                onClick={() => navigate(`/listing/${product.id}`)}
              >
                <ProductImageWrap>
                  <img src={product.image} alt={product.name} />
                  <PriceBadge>{product.price}</PriceBadge>
                </ProductImageWrap>
                <ProductBody>
                  <ProductName>{product.name}</ProductName>
                  <ViewBtn onClick={(e) => { e.stopPropagation(); navigate(`/listing/${product.id}`); }}>
                    View Listing →
                  </ViewBtn>
                </ProductBody>
              </ProductCard>
            ))}
          </ProductsGrid>
        </Section>

      </Container>
    </>
  );
};

export default Follower;
