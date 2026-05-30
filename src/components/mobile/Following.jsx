import { useState } from "react";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 48px;
`;

// ─── Hero Header ──────────────────────────────────────────────────────────────

const Hero = styled.div`
  background: linear-gradient(135deg, #2f5a2a 0%, #3d7a35 60%, #4e9643 100%);
  padding: 36px 24px 80px;
  position: relative;
  overflow: hidden;

  /* Decorative background circle */
  &::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    top: -80px;
    right: -60px;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: 20px;
    left: -40px;
    pointer-events: none;
  }
`;

const HeroTitle = styled.h1`
  margin: 0 0 4px;
  color: white;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const HeroSub = styled.p`
  margin: 0 0 28px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
`;

// Three stat chips in the hero — following count, events, saved
const StatRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const StatChip = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;

const StatIcon = styled.span`
  font-size: 1rem;
`;

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

// Floats over the hero bottom edge, visually connecting hero to content
const TabBarWrapper = styled.div`
  position: relative;
  margin-top: -44px;
  padding: 0 20px;
  z-index: 10;
`;

const TabBar = styled.div`
  background: white;
  border-radius: 18px;
  padding: 6px;
  display: flex;
  box-shadow: 0 8px 32px rgba(20, 57, 32, 0.12);
`;

const Tab = styled.button`
  flex: 1;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  color: ${({ $active }) => ($active ? "white" : "#7b8f7f")};
  border: none;
  padding: 12px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
    background: ${({ $active }) => ($active ? "#2f5a2a" : "#eef7ee")};
  }
`;

const TabCount = styled.span`
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.25)" : "#eef7ee"};
  color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 0.78rem;
  font-weight: 800;
`;

// ─── Tab Content Area ─────────────────────────────────────────────────────────

const ContentArea = styled.div`
  padding: 28px 20px 0;
  animation: ${slideUp} 0.3s ease;
`;

const SectionLabel = styled.p`
  color: #7b8f7f;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
`;

// ─── Seller Cards ─────────────────────────────────────────────────────────────

const SellerCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(20, 57, 32, 0.13);
  }
`;

const SellerCover = styled.div`
  position: relative;
  height: 130px;
  background: #d7edd9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Gradient to make the bottom of the image readable */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.35));
  }
`;

// Category chip overlaid on the cover image (top-left)
const CategoryChip = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.92);
  color: #2f5a2a;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
`;

const SellerBody = styled.div`
  padding: 16px 18px 18px;
`;

const SellerName = styled.h3`
  margin: 0 0 4px;
  font-size: 1.05rem;
  color: #1a3318;
  font-weight: 700;
`;

const SellerMeta = styled.p`
  margin: 0 0 12px;
  color: #7b8f7f;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const Stars = styled.span`
  color: #f0b33d;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const RatingText = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3318;
`;

const ReviewText = styled.span`
  font-size: 0.82rem;
  color: #7b8f7f;
`;

// Unfollow button — turns red on hover to signal destructive action
const UnfollowBtn = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $unfollowed }) =>
    $unfollowed
      ? css`
          background: #f0f7ee;
          color: #2f5a2a;
          border: 2px solid #2f5a2a;
        `
      : css`
          background: #eef7ee;
          color: #2f5a2a;
          border: 2px solid #cde5cf;

          &:hover {
            background: #fff0f0;
            color: #c0392b;
            border-color: #f5c6c2;
          }
        `}
`;

// ─── Event Cards ──────────────────────────────────────────────────────────────

const EventCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(20, 57, 32, 0.13);
  }
`;

const EventCover = styled.div`
  position: relative;
  height: 150px;
  background: #d7edd9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Date badge overlaid on the event image (top-right)
const DateBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: white;
  border-radius: 12px;
  padding: 8px 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 52px;
`;

const DateDay = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: #2f5a2a;
  line-height: 1;
`;

const DateMonth = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const EventBody = styled.div`
  padding: 18px;
`;

const EventTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 1.05rem;
  color: #1a3318;
  font-weight: 700;
`;

const LocationPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eef7ee;
  color: #2f5a2a;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
`;

const EventDesc = styled.p`
  margin: 0 0 14px;
  color: #556652;
  font-size: 0.88rem;
  line-height: 1.6;
`;

const InterestedBtn = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? css`
          background: #2f5a2a;
          color: white;
          border: 2px solid #2f5a2a;
        `
      : css`
          background: #eef7ee;
          color: #2f5a2a;
          border: 2px solid #cde5cf;

          &:hover {
            background: #d7edd9;
            border-color: #2f5a2a;
          }
        `}
`;

// ─── Favorites Cards ──────────────────────────────────────────────────────────

const FavCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(20, 57, 32, 0.13);
  }
`;

const FavCover = styled.div`
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

// Price badge overlaid on the bottom-left of the product image
const PriceBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 2;
  background: #2f5a2a;
  color: white;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 999px;
`;

// Heart button to remove from favorites (top-right of image)
const HeartBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.15);
  }
`;

const FavBody = styled.div`
  padding: 16px 18px 18px;
`;

const FavTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 1rem;
  color: #1a3318;
  font-weight: 700;
`;

const FavMeta = styled.p`
  margin: 0 0 10px;
  color: #7b8f7f;
  font-size: 0.85rem;
`;

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
  animation: ${fadeIn} 0.4s ease;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.p`
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.9rem;
`;

// ─── Static data ──────────────────────────────────────────────────────────────
// Replace with real API data (Supabase/context) when ready

const followData = {
  sellers: [
    { id: 1, name: "Amina's Farm", category: "Vegetables", location: "Nairobi", rating: 4.8, reviews: 42, image: "/amina.jpg" },
    { id: 2, name: "Maziwa Organics", category: "Dairy", location: "Kiambu", rating: 4.6, reviews: 30, image: "/maziwa.png" },
    { id: 3, name: "Honey Harvest", category: "Honey", location: "Nanyuki", rating: 4.9, reviews: 55, image: "/honeyfarm.jpg" },
  ],
  events: [
    { id: 1, title: "Local Farmers Market", date: "May 12, 2026", day: "12", month: "May", location: "Kasarani Grounds", description: "Browse fresh produce, meet followed sellers, and save favourite market finds." },
    { id: 2, title: "Organic Crop Workshop", date: "May 20, 2026", day: "20", month: "May", location: "Nairobi Showground", description: "Discover new growing tips and join experts from the local farming community." },
  ],
  favorites: [
    { id: 1, title: "Green Pepper Bundle", price: "Kes 14 / kg", seller: "Amina's Farm", location: "Nairobi", rating: 4.7, reviews: 18, image: "/pepper.png" },
    { id: 2, title: "Wildflower Honey Jar", price: "Kes 19", seller: "Honey Harvest", location: "Kiambu", rating: 4.9, reviews: 26, image: "/honeyjar.jpeg" },
  ],
};

const renderStars = (rating) => {
  const full = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => (i < full ? "★" : "☆")).join("");
};

// ─── Component ────────────────────────────────────────────────────────────────

const Following = () => {
  const navigate = useNavigate();

  // Active tab: 'sellers' | 'events' | 'favorites'
  const [activeTab, setActiveTab] = useState("sellers");

  // Track which sellers the user has unfollowed locally
  const [unfollowed, setUnfollowed] = useState(new Set());

  // Track event interest toggles locally
  const [interested, setInterested] = useState(new Set());

  // Track removed favorites locally
  const [removed, setRemovedFavs] = useState(new Set());

  const toggleUnfollow = (e, id) => {
    e.stopPropagation(); // prevent card click navigating when pressing button
    setUnfollowed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleInterested = (id) => {
    setInterested((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFav = (e, id) => {
    e.stopPropagation();
    setRemovedFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visibleFavs = followData.favorites.filter((f) => !removed.has(f.id));

  return (
    <>
      <AppNavbar />
      <Container>
        {/* ── Hero ── */}
        <Hero>
          <HeroTitle>Following</HeroTitle>
          <HeroSub>Your sellers, events & saved listings</HeroSub>
          <StatRow>
            <StatChip>
              <StatIcon>🌿</StatIcon>
              {followData.sellers.length} Sellers
            </StatChip>
            <StatChip>
              <StatIcon>📅</StatIcon>
              {followData.events.length} Events
            </StatChip>
            <StatChip>
              <StatIcon>❤️</StatIcon>
              {visibleFavs.length} Saved
            </StatChip>
          </StatRow>
        </Hero>

        {/* ── Tab bar floats over the hero bottom edge ── */}
        <TabBarWrapper>
          <TabBar>
            {[
              { key: "sellers", label: "Sellers", icon: "🌿", count: followData.sellers.length },
              { key: "events",  label: "Events",  icon: "📅", count: followData.events.length },
              { key: "favorites", label: "Saved", icon: "❤️", count: visibleFavs.length },
            ].map(({ key, label, icon, count }) => (
              <Tab
                key={key}
                $active={activeTab === key}
                onClick={() => setActiveTab(key)}
              >
                {icon} {label}
                <TabCount $active={activeTab === key}>{count}</TabCount>
              </Tab>
            ))}
          </TabBar>
        </TabBarWrapper>

        {/* ── Sellers tab ── */}
        {activeTab === "sellers" && (
          <ContentArea key="sellers">
            <SectionLabel>
              {followData.sellers.length} trusted sellers you follow
            </SectionLabel>
            <Grid>
              {followData.sellers.map((seller) => (
                <SellerCard
                  key={seller.id}
                  onClick={() => navigate(`/follower/${seller.id}`)}
                >
                  <SellerCover>
                    <img src={seller.image} alt={seller.name} />
                    <CategoryChip>{seller.category}</CategoryChip>
                  </SellerCover>
                  <SellerBody>
                    <SellerName>{seller.name}</SellerName>
                    <SellerMeta>📍 {seller.location}</SellerMeta>
                    <RatingRow>
                      <Stars>{renderStars(seller.rating)}</Stars>
                      <RatingText>{seller.rating.toFixed(1)}</RatingText>
                      <ReviewText>({seller.reviews} reviews)</ReviewText>
                    </RatingRow>
                    <UnfollowBtn
                      $unfollowed={unfollowed.has(seller.id)}
                      onClick={(e) => toggleUnfollow(e, seller.id)}
                    >
                      {unfollowed.has(seller.id) ? "✓ Following" : "Unfollow"}
                    </UnfollowBtn>
                  </SellerBody>
                </SellerCard>
              ))}
            </Grid>
          </ContentArea>
        )}

        {/* ── Events tab ── */}
        {activeTab === "events" && (
          <ContentArea key="events">
            <SectionLabel>
              {followData.events.length} upcoming events near you
            </SectionLabel>
            <Grid>
              {followData.events.map((event) => (
                <EventCard key={event.id}>
                  <EventCover>
                    <img src={event.image} alt={event.title} />
                    <DateBadge>
                      <DateDay>{event.day}</DateDay>
                      <DateMonth>{event.month}</DateMonth>
                    </DateBadge>
                  </EventCover>
                  <EventBody>
                    <EventTitle>{event.title}</EventTitle>
                    <LocationPill>📍 {event.location}</LocationPill>
                    <EventDesc>{event.description}</EventDesc>
                    <InterestedBtn
                      $active={interested.has(event.id)}
                      onClick={() => toggleInterested(event.id)}
                    >
                      {interested.has(event.id) ? "✓ Interested" : "Mark as Interested"}
                    </InterestedBtn>
                  </EventBody>
                </EventCard>
              ))}
            </Grid>
          </ContentArea>
        )}

        {/* ── Favorites tab ── */}
        {activeTab === "favorites" && (
          <ContentArea key="favorites">
            <SectionLabel>
              {visibleFavs.length} saved listings
            </SectionLabel>
            {visibleFavs.length === 0 ? (
              <EmptyState>
                <EmptyIcon>💔</EmptyIcon>
                <EmptyTitle>No saved listings</EmptyTitle>
                <EmptyDesc>Browse listings and tap the heart to save them here.</EmptyDesc>
              </EmptyState>
            ) : (
              <Grid>
                {visibleFavs.map((item) => (
                  <FavCard
                    key={item.id}
                    onClick={() => navigate(`/listing/${item.id}`)}
                  >
                    <FavCover>
                      <img src={item.image} alt={item.title} />
                      <PriceBadge>{item.price}</PriceBadge>
                      {/* Heart button removes from saved list */}
                      <HeartBtn onClick={(e) => toggleFav(e, item.id)}>
                        ❤️
                      </HeartBtn>
                    </FavCover>
                    <FavBody>
                      <FavTitle>{item.title}</FavTitle>
                      <FavMeta>by {item.seller} · 📍 {item.location}</FavMeta>
                      <RatingRow>
                        <Stars>{renderStars(item.rating)}</Stars>
                        <RatingText>{item.rating.toFixed(1)}</RatingText>
                        <ReviewText>({item.reviews} reviews)</ReviewText>
                      </RatingRow>
                    </FavBody>
                  </FavCard>
                ))}
              </Grid>
            )}
          </ContentArea>
        )}
      </Container>
    </>
  );
};

export default Following;
