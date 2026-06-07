import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, css } from "styled-components";
import { useProfile } from "../../hooks/useProfile";
import { useUserListings } from "../../hooks/useListings";
import { useIsFollowing, useFollowToggle } from "../../hooks/useFollows";
import { useStartConversation } from "../../hooks/useMessages";
import { useAuth } from "../../context/AuthContext";
import LoadingComponent from "./Loading";
import { useUserRating, useMyRating, useRateUser } from "../../hooks/useUserRatings";

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

const ProfileSection = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
`;

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

const AvatarFallback = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: #2f5a2a;
  color: white;
  font-size: 2.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-top: -55px;
  text-transform: uppercase;
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

const LocationRow = styled.p`
  margin: 0 0 10px;
  color: #7b8f7f;
  font-size: 0.95rem;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 16px 0 28px;
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
  grid-template-columns: repeat(3, 1fr);
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  animation: ${slideUp} 0.35s ease;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 4px 0;

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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

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

// ─── Component ────────────────────────────────────────────────────────────────

const Follower = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { data: seller, isLoading: isLoadingProfile } = useProfile(id);
  const { data: allListings, isLoading: isLoadingListings } = useUserListings(id);
  const { data: isFollowing, isLoading: isLoadingFollow } = useIsFollowing(user?.id, id);
  const { mutate: toggleFollow, isPending: isToggling } = useFollowToggle(user?.id, id);
  const { mutate: startConversation, isPending: isStarting } = useStartConversation();
  const { data: ratingData } = useUserRating(id);
  const { data: myRating } = useMyRating(user?.id, id);
  const { mutate: rateUser, isPending: isRating } = useRateUser();
  const [hovered, setHovered] = useState(0);

  if (isLoadingProfile || isLoadingListings || isLoadingFollow) return <LoadingComponent />;

  if (!seller) {
    return (
      <>
        <AppNavbar />
        <Container>
          <NotFound>
            <NotFoundTitle>Seller not found</NotFoundTitle>
            <NotFoundDesc>This seller profile doesn't exist or may have been removed.</NotFoundDesc>
            <GoBackBtn onClick={() => navigate(-1)}>Go Back</GoBackBtn>
          </NotFound>
        </Container>
      </>
    );
  }

  // Creates or retrieves a direct conversation with this seller, then opens it in Messages.
  const handleMessage = () => {
    startConversation(
      { buyer_id: user?.id, seller_id: id },
      { onSuccess: (conv) => navigate("/messages", { state: { conversationId: conv.id } }) },
    );
  };

  const farmName = seller.farm_name || "Unknown Farm";
  const location = seller.location;
  const description = seller.description;
  const avatarUrl = seller.avatar_url;
  const listings = (allListings || []).slice(0, 3);
  const listingsCount = allListings?.length ?? 0;

  return (
    <>
      <AppNavbar />
      <Container>

        <Cover>
          <BackBtn onClick={() => navigate(-1)}>←</BackBtn>
        </Cover>

        <ProfileSection>
          {avatarUrl ? (
            <Avatar src={avatarUrl} alt={farmName} />
          ) : (
            <AvatarFallback>{farmName[0]}</AvatarFallback>
          )}

          <NameRow>
            <SellerName>{farmName}</SellerName>
          </NameRow>

          {location && <LocationRow>{location}</LocationRow>}

          <ActionRow>
            <FollowBtn
              $following={isFollowing}
              disabled={isToggling || !user}
              onClick={() => toggleFollow(isFollowing)}
            >
              {isToggling ? "..." : isFollowing ? "Following" : "+ Follow"}
            </FollowBtn>
            <MessageBtn disabled={isStarting || !user} onClick={handleMessage}>
              {isStarting ? "Opening…" : "Message"}
            </MessageBtn>
          </ActionRow>
        </ProfileSection>

        <StatsBar>
          <StatsCard>
            <StatItem>
              <StatNumber>{listingsCount}</StatNumber>
              <StatLabel>Listings</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber style={{ fontSize: "0.88rem" }}>
                {location ? location.split(",")[0] : "–"}
              </StatNumber>
              <StatLabel>Location</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber style={{ fontSize: "0.88rem" }}>
                {ratingData?.count ? `⭐ ${ratingData.avg}` : "–"}
              </StatNumber>
              <StatLabel>Rating ({ratingData?.count ?? 0})</StatLabel>
            </StatItem>
          </StatsCard>
        </StatsBar>

        {/* ── Rate this seller ── */}
        {user && user.id !== id && (
          <RatingSection>
            <RatingLabel>
              {myRating ? `Your rating: ` : "Rate this seller:"}
            </RatingLabel>
            <Stars>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  $filled={star <= (hovered || myRating || 0)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() =>
                    rateUser({ rater_id: user.id, rated_user_id: id, rating: star })
                  }
                  disabled={isRating}
                >
                  ★
                </Star>
              ))}
            </Stars>
            {myRating && <RatingNote>Tap a star to update</RatingNote>}
          </RatingSection>
        )}

        {description && (
          <Section>
            <SectionCard>
              <SectionTitle>About</SectionTitle>
              <AboutText>{description}</AboutText>
            </SectionCard>
          </Section>
        )}

        {listings.length > 0 && (
          <Section>
            <SectionTitle>
              Products
              <span style={{ color: "#7b8f7f", fontWeight: 400, fontSize: "0.88rem", marginLeft: 6 }}>
                · {listingsCount} listing{listingsCount !== 1 ? "s" : ""}
              </span>
            </SectionTitle>
            <ProductsGrid>
              {listings.map((item) => (
                <ProductCard
                  key={item.id}
                  onClick={() => navigate(`/listing/${item.id}`, { state: { listing: item } })}
                >
                  <ProductImageWrap>
                    {item.image_url && <img src={item.image_url} alt={item.title} loading="lazy" decoding="async" />}
                    <PriceBadge>Kes {item.price}/{item.unit}</PriceBadge>
                  </ProductImageWrap>
                  <ProductBody>
                    <ProductName>{item.title}</ProductName>
                    <ViewBtn onClick={(e) => { e.stopPropagation(); navigate(`/listing/${item.id}`, { state: { listing: item } }); }}>
                      View Listing
                    </ViewBtn>
                  </ProductBody>
                </ProductCard>
              ))}
            </ProductsGrid>
          </Section>
        )}

      </Container>
    </>
  );
};

const RatingSection = styled.div`
  max-width: 960px;
  margin: 0 auto 20px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const RatingLabel = styled.span`
  font-size: 0.88rem;
  font-weight: 600;
  color: #556652;
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
`;

const Star = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  color: ${({ $filled }) => ($filled ? "#f59e0b" : "#d1d5db")};
  transition: color 0.1s, transform 0.1s;
  &:hover { transform: scale(1.15); }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

const RatingNote = styled.span`
  font-size: 0.78rem;
  color: #9ca3af;
`;

export default Follower;
