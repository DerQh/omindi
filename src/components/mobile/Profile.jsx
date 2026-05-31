import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import LoadingComponent from "./Loading";
import { useUserListings, useDeleteListing } from "../../hooks/useListings";
import { useFavoriteListings, useFavoriteDelete } from "../../hooks/useFavListings";
import { useUserRating } from "../../hooks/useUserRatings";

// ─── Animations ───────────────────────────────────────────────────────────────

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0.8); opacity: 0; }
  70%  { transform: scale(1.06); }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Page Shell ───────────────────────────────────────────────────────────────

const Container = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  padding-bottom: 56px;
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
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    top: -80px;
    right: -50px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    bottom: -40px;
    left: 24px;
  }
`;

// ─── Profile Identity ─────────────────────────────────────────────────────────

const ProfileSection = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  animation: ${slideUp} 0.35s ease;
`;

// Avatar overlaps the cover/content boundary
const Avatar = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-top: -55px;
  display: block;
  background: #d7edd9;
  animation: ${popIn} 0.5s ease forwards;
`;

// Fallback avatar shown when no image is available — shows first letter of farm name
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
  margin: 14px 0 4px;
  flex-wrap: wrap;
`;

const FarmName = styled.h1`
  margin: 0;
  font-size: 1.65rem;
  font-weight: 800;
  color: #1a3318;
`;

// Shown when description + location are both filled — signals a complete profile
const CompleteBadge = styled.span`
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

const LocationRow = styled.p`
  margin: 0 0 10px;
  color: #7b8f7f;
  font-size: 0.93rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BioText = styled.p`
  margin: 0 0 18px;
  color: #556652;
  font-size: 0.93rem;
  line-height: 1.7;
  max-width: 600px;
`;

// Edit Profile + Add Listing CTAs side by side
const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  background: #2f5a2a;
  color: white;
  border: 2px solid #2f5a2a;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: #245026;
  }
`;

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBarWrap = styled.div`
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
  animation: ${slideUp} 0.4s ease;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 4px 0;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:not(:last-child) {
    border-right: 1px solid #eef7ee;
  }

  &:hover {
    ${({ $clickable }) => $clickable && "opacity: 0.75;"}
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

// ─── Section Wrapper ──────────────────────────────────────────────────────────

const Section = styled.div`
  max-width: 960px;
  margin: 0 auto 24px;
  padding: 0 24px;
  animation: ${slideUp} 0.45s ease;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
`;

const SectionHeader = styled.div`
  padding: 20px 22px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1a3318;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionCount = styled.span`
  color: #7b8f7f;
  font-weight: 400;
  font-size: 0.88rem;
`;

const AddListingLink = styled.button`
  background: none;
  border: none;
  color: #2f5a2a;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

// ─── Map ──────────────────────────────────────────────────────────────────────

const MapFrame = styled.div`
  height: 260px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
`;

const MapPlaceholder = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #7b8f7f;
  background: #f5f8f5;
  font-size: 0.92rem;
`;

// ─── Listing Cards ────────────────────────────────────────────────────────────

const ListingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 0 22px 22px;
`;

const ListingCard = styled.div`
  background: #f8faf6;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 3px 14px rgba(20, 57, 32, 0.07);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(20, 57, 32, 0.12);
  }
`;

const ListingImageWrap = styled.div`
  position: relative;
  height: 140px;
  background: #d7edd9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Price badge overlaid on the listing image
const PriceBadge = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: #2f5a2a;
  color: white;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
`;

const ListingBody = styled.div`
  padding: 12px 14px 14px;
`;

const ListingTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 0.93rem;
  color: #1a3318;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardActions = styled.div`
  display: flex;
  gap: 6px;
`;

const EditListingBtn = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.82rem;
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

const DeleteListingBtn = styled.button`
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  background: #fff0f0;
  color: #a32d2d;
  border: 1px solid #f5c2c2;
  transition: all 0.2s ease;

  &:hover {
    background: #a32d2d;
    color: white;
    border-color: #a32d2d;
  }
`;

const ConfirmRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ConfirmText = styled.p`
  margin: 0 0 4px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #a32d2d;
  text-align: center;
`;

const ConfirmActions = styled.div`
  display: flex;
  gap: 6px;
`;

const ConfirmYes = styled.button`
  flex: 1;
  padding: 7px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: #a32d2d;
  color: white;
  border: none;
  transition: background 0.2s;

  &:hover {
    background: #8a2020;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ConfirmNo = styled.button`
  flex: 1;
  padding: 7px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: #f0f7ee;
  color: #2f5a2a;
  border: 1px solid #cde5cf;
  transition: background 0.2s;

  &:hover {
    background: #d7edd7;
  }
`;

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  animation: ${fadeIn} 0.4s ease;
`;

const EmptyIcon = styled.div`
  font-size: 2.8rem;
  margin-bottom: 12px;
`;

const EmptyTitle = styled.p`
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0 0 18px;
  color: #7b8f7f;
  font-size: 0.88rem;
`;

const EmptyBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #245026;
  }
`;

// Static map embed URL — replace with a dynamic one based on profileData?.location when geocoding is wired up
const DEFAULT_MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3990.2205496690306!2d36.78964937498744!3d-1.2832537999446297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1732c9ba8cac%3A0x912a6aae081f4fd1!2sKilimani%2C%20Nairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

// ─── Component ────────────────────────────────────────────────────────────────

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // profileData shape: { farm_name, description, location, avatar_url, ... }
  const { data: profileData, isLoading } = useProfile(user?.id);

  // userListings: array of listing objects from Supabase
  const { data: userListings, isLoading: isLoadingListings } = useUserListings(
    user?.id,
  );

  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing(
    user?.id,
  );

  // Listings the user has saved/hearted across the marketplace.
  const { data: favoriteListings = [] } = useFavoriteListings(user?.id);
  const { mutate: removeFavorite } = useFavoriteDelete();
  const { data: ratingData } = useUserRating(user?.id);

  if (isLoading || isLoadingListings) return <LoadingComponent />;

  // Profile is considered "complete" when both description and location are filled
  const isComplete = !!(profileData?.description && profileData?.location);

  const farmName = profileData?.farm_name || "My Farm";
  const location = profileData?.location;
  const description = profileData?.description;
  const avatarUrl = profileData?.avatar_url;
  const listingsCount = userListings?.length ?? 0;

  return (
    <>
      <AppNavbar />
      <Container>
        {/* ── Cover ── */}
        <Cover />

        {/* ── Profile identity ── */}
        <ProfileSection>
          {/* Show avatar image if available, otherwise fallback to initial */}
          {avatarUrl ? (
            <Avatar src={avatarUrl} alt={farmName} />
          ) : (
            <AvatarFallback>{farmName[0]}</AvatarFallback>
          )}

          <NameRow>
            <FarmName>{farmName}</FarmName>
            {isComplete && <CompleteBadge>✓</CompleteBadge>}
          </NameRow>

          {location && <LocationRow>📍 {location}</LocationRow>}

          <BioText>
            {description ||
              "No farm description yet. Click Edit Profile to add one."}
          </BioText>

          <ActionRow>
            <PrimaryBtn onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </PrimaryBtn>
          </ActionRow>
        </ProfileSection>

        {/* ── Stats bar ── */}
        <StatsBarWrap>
          <StatsCard>
            <StatItem $clickable onClick={() => navigate("/followers")}>
              <StatNumber>–</StatNumber>
              <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem $clickable onClick={() => navigate("/list")}>
              <StatNumber>{listingsCount}</StatNumber>
              <StatLabel>Listings</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber style={{ fontSize: "0.88rem" }}>
                {ratingData?.count ? `⭐ ${ratingData.avg}` : "–"}
              </StatNumber>
              <StatLabel>Rating ({ratingData?.count ?? 0})</StatLabel>
            </StatItem>
          </StatsCard>
        </StatsBarWrap>

        {/* ── Posted listings ── */}
        <Section>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                Posted Listings
                <SectionCount>· {listingsCount}</SectionCount>
              </SectionTitle>
              <AddListingLink onClick={() => navigate("/add-listing")}>
                + Add
              </AddListingLink>
            </SectionHeader>

            {listingsCount > 0 ? (
              <ListingGrid>
                {userListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    onClick={() => navigate(`/listing/${item.id}`)}
                  >
                    <ListingImageWrap>
                      <img src={item.image_url} alt={item.title} />
                      <PriceBadge>
                        Kes {item.price}/{item.unit}
                      </PriceBadge>
                    </ListingImageWrap>
                    <ListingBody>
                      <ListingTitle>{item.title}</ListingTitle>
                      {confirmDeleteId === item.id ? (
                        <ConfirmRow onClick={(e) => e.stopPropagation()}>
                          <ConfirmText>Delete this listing?</ConfirmText>
                          <ConfirmActions>
                            <ConfirmYes
                              disabled={isDeleting}
                              onClick={() =>
                                deleteListing(item.id, {
                                  onSuccess: () => setConfirmDeleteId(null),
                                })
                              }
                            >
                              {isDeleting ? "Deleting…" : "Yes, delete"}
                            </ConfirmYes>
                            <ConfirmNo onClick={() => setConfirmDeleteId(null)}>
                              Cancel
                            </ConfirmNo>
                          </ConfirmActions>
                        </ConfirmRow>
                      ) : (
                        <CardActions onClick={(e) => e.stopPropagation()}>
                          <EditListingBtn
                            onClick={() => navigate(`/edit-listing/${item.id}`)}
                          >
                            ✏️ Edit
                          </EditListingBtn>
                          <DeleteListingBtn
                            onClick={() => setConfirmDeleteId(item.id)}
                          >
                            🗑 Delete
                          </DeleteListingBtn>
                        </CardActions>
                      )}
                    </ListingBody>
                  </ListingCard>
                ))}
              </ListingGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>🌱</EmptyIcon>
                <EmptyTitle>No listings yet</EmptyTitle>
                <EmptyDesc>
                  Post your first product so buyers can find you.
                </EmptyDesc>
                <EmptyBtn onClick={() => navigate("/add-listing")}>
                  + Add First Listing
                </EmptyBtn>
              </EmptyState>
            )}
          </SectionCard>
        </Section>

        {/* ── Saved listings ── */}
        <Section>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>
                Saved Listings
                <SectionCount>· {favoriteListings.length}</SectionCount>
              </SectionTitle>
            </SectionHeader>

            {favoriteListings.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🤍</EmptyIcon>
                <EmptyTitle>No saved listings</EmptyTitle>
                <EmptyDesc>
                  Tap the heart on any listing to save it here.
                </EmptyDesc>
              </EmptyState>
            ) : (
              <ListingGrid>
                {favoriteListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    onClick={() => navigate(`/listing/${item.id}`)}
                  >
                    <ListingImageWrap>
                      <img src={item.image_url} alt={item.title} />
                      <PriceBadge>
                        Kes {item.price}/{item.unit}
                      </PriceBadge>
                    </ListingImageWrap>
                    <ListingBody>
                      <ListingTitle>{item.title}</ListingTitle>
                      {/* Unsave button — removes the favorite without navigating away */}
                      <CardActions onClick={(e) => e.stopPropagation()}>
                        <DeleteListingBtn
                          onClick={() =>
                            removeFavorite({ user_id: user?.id, listing_id: item.id })
                          }
                        >
                          Remove
                        </DeleteListingBtn>
                      </CardActions>
                    </ListingBody>
                  </ListingCard>
                ))}
              </ListingGrid>
            )}
          </SectionCard>
        </Section>

        {/* ── Location map ── */}
        <Section>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>📍 Location</SectionTitle>
            </SectionHeader>

            {location ? (
              <MapFrame>
                <iframe
                  title="Farm location"
                  src={DEFAULT_MAP_URL}
                  loading="lazy"
                  allowFullScreen
                />
              </MapFrame>
            ) : (
              <MapPlaceholder>
                <span style={{ fontSize: "2rem" }}>🗺️</span>
                <span>No location set — add one in Edit Profile</span>
              </MapPlaceholder>
            )}
          </SectionCard>
        </Section>
      </Container>
    </>
  );
};

export default Profile;
