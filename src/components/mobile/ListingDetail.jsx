import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useListing } from "../../hooks/useEditListing";
import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useUser } from "../../hooks/useUser";
import { useDeleteListing } from "../../hooks/useDeleteListing";
import LoadingComponent from "./Loading";
import ConfirmModule from "./ConfirmModule";
import { useAddItem, useCartItemCheck } from "../../hooks/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { useStartConversation } from "../../hooks/useMessages";
import { useProfile } from "../../hooks/useProfile";
import { supabase } from "../../../supabase";
import { useListingReviews, useAddReview, useHasReviewed, useCanReview, useSellerRating } from "../../hooks/useReviews";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

// Displays the full detail view of a listing with seller info, cart actions, and an inquiry button.
const ListingDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { id } = useParams();

  // Use listing from navigation state when available (faster — no extra fetch).
  // Fall back to fetching by ID from Supabase when navigating directly to the URL.
  const stateListng = location.state?.listing;
  const { data: fetchedListing, isLoading: isFetchingListing } = useListing(
    stateListng ? null : id
  );
  const listing = stateListng ?? fetchedListing;

  const { data: user, isLoading } = useUser();

  // Fetch seller profile to get their avatar when seller_image_url is missing from the listing.
  const { data: sellerProfile } = useProfile(listing?.seller_id);
  const sellerAvatar = listing?.seller_image_url || sellerProfile?.avatar_url || "/user.jpg";
  const { mutate: deleteListing, isLoading: isDeleting } = useDeleteListing();
  const { mutate: mutateAddItem, isPending } = useAddItem();
  const { mutate: startConversation } = useStartConversation();

  const { data: isItemInCart } = useCartItemCheck({
    user_id: user?.id,
    listing_id: listing?.id,
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { data: reviews = [] } = useListingReviews(listing?.id);
  const { data: sellerRating } = useSellerRating(listing?.seller_id);
  const { data: hasReviewed } = useHasReviewed(user?.id, listing?.id);
  const { data: canReview } = useCanReview(user?.id, listing?.id);
  const { mutate: addReview, isPending: submittingReview } = useAddReview();

  // Increments the listing's view counter once when the page mounts.
  useEffect(() => {
    if (!listing?.id) return;
    supabase.rpc("increment_listing_views", { listing_id: listing.id }).catch(() => {});
  }, [listing?.id]);

  const isSeller = user?.id === listing?.seller_id;

  const handleGreenBtn = () => {
    if (isSeller) {
      alert("Edit functionality coming soon!");
    } else {
      if (isItemInCart) {
        navigate("/cart");
      } else {
        mutateAddItem(
          { user_id: user?.id, listing_id: listing?.id },
          { onSuccess: () => navigate("/cart", { state: { listing } }) },
        );
      }
    }
  };

  const handleOrangeBtn = () => {
    if (isSeller) {
      setShowConfirm(true);
    } else {
      if (isItemInCart) {
        alert("Item is already in the cart");
      } else {
        mutateAddItem({ user_id: user?.id, listing_id: listing?.id });
      }
    }
  };

  const handleConfirmDelete = () => {
    deleteListing({ id: listing?.id });
    setShowConfirm(false);
  };

  const handleInquire = () => {
    startConversation(
      {
        buyer_id: user?.id,
        seller_id: listing?.seller_id,
        listing_id: listing?.id,
      },
      {
        onSuccess: (conversation) =>
          navigate("/messages", { state: { conversationId: conversation.id } }),
        onError: (e) => console.log("error:", e),
      },
    );
  };

  if (isLoading || isFetchingListing) return <LoadingComponent />;

  if (!listing)
    return (
      <>
        <AppNavbar />
        <NotFoundWrap>
          <NotFoundCard>
            <span>🔍</span>
            <p>Listing not found.</p>
            <BackBtn onClick={() => navigate(-1)}>Go back</BackBtn>
          </NotFoundCard>
        </NotFoundWrap>
      </>
    );

  return (
    <>
      {showConfirm && (
        <ConfirmModule
          text="Do you want to delete this listing?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <AppNavbar />

      <Page>
        {/* ── Hero image ── */}
        <HeroWrap>
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.title} />
          ) : (
            <NoImage>🌱</NoImage>
          )}
          <FloatBack onClick={() => navigate(-1)} aria-label="Go back">
            ←
          </FloatBack>
          {listing.category && (
            <FloatCategory>{listing.category}</FloatCategory>
          )}
        </HeroWrap>

        {/* ── Content ── */}
        <ContentSheet>
          <Inner>
            {/* Title + price */}
            <TitleRow>
              <ProductTitle>{listing.title}</ProductTitle>
              <PriceTag>
                Kes {listing.price}
                {listing.unit ? ` / ${listing.unit}` : ""}
              </PriceTag>
            </TitleRow>

            {/* Only shown when out of stock */}
            {listing.available === false && (
              <AvailBadge>Out of Stock</AvailBadge>
            )}

            {/* Info chips */}
            <ChipRow>
              {listing.location && <InfoChip>📍 {listing.location}</InfoChip>}
              {listing.minimumOrder && (
                <InfoChip>Min: {listing.minimumOrder}</InfoChip>
              )}
            </ChipRow>

            <Divider />

            {/* Description */}
            {listing.description && (
              <Section>
                <SectionTitle>Description</SectionTitle>
                <DescText>{listing.description}</DescText>
              </Section>
            )}

            <Divider />

            {/* Seller */}
            <Section>
              <SectionTitle>Seller</SectionTitle>
              <SellerCard
                onClick={() => navigate(`/follower/${listing.seller_id}`)}
              >
                <SellerAvatar
                  src={sellerAvatar}
                  alt={listing.seller_name}
                />
                <SellerInfo>
                  <SellerName>{listing.seller_name || sellerProfile?.farm_name || "Farmer"}</SellerName>
                  <SellerMeta>
                    {sellerRating?.count > 0
                      ? `⭐ ${sellerRating.avg} · ${sellerRating.count} review${sellerRating.count !== 1 ? "s" : ""}`
                      : "No reviews yet"}
                  </SellerMeta>
                </SellerInfo>
                <SellerArrow>›</SellerArrow>
              </SellerCard>
            </Section>

            <Divider />

            {/* Actions */}
            <Actions>
              {isSeller ? (
                <>
                  <ActionBtn $variant="primary" onClick={handleGreenBtn}>
                    Edit Listing
                  </ActionBtn>
                  <ActionBtn
                    $variant="danger"
                    onClick={handleOrangeBtn}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting…" : "🗑 Delete"}
                  </ActionBtn>
                </>
              ) : (
                <>
                  <ActionBtn
                    $variant="primary"
                    onClick={handleGreenBtn}
                    disabled={isPending}
                  >
                    {isPending
                      ? "Adding…"
                      : isItemInCart
                        ? "View Cart"
                        : "Buy Now"}
                  </ActionBtn>
                  <ActionBtn
                    $variant="secondary"
                    onClick={handleOrangeBtn}
                    disabled={isPending}
                  >
                    {isItemInCart ? "Already in Cart" : "Add to Cart"}
                  </ActionBtn>
                  <ActionBtn $variant="outline" onClick={handleInquire}>
                    Send Inquiry
                  </ActionBtn>
                </>
              )}
            </Actions>

            <Divider />

            {/* Reviews section */}
            <Section>
              <SectionTitle>Reviews ({reviews.length})</SectionTitle>

              {/* Write a review — only buyers who received this listing can review */}
              {!isSeller && canReview && !hasReviewed && (
                <ReviewForm>
                  <ReviewLabel>Rate this listing</ReviewLabel>
                  <StarRow>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarBtn key={n} $active={n <= reviewRating} onClick={() => setReviewRating(n)}>★</StarBtn>
                    ))}
                  </StarRow>
                  <ReviewInput
                    placeholder="Share your experience…"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                  />
                  <SubmitReviewBtn
                    disabled={reviewRating === 0 || submittingReview}
                    onClick={() => addReview(
                      { listing_id: listing.id, seller_id: listing.seller_id, rating: reviewRating, comment: reviewComment },
                      { onSuccess: () => { setReviewRating(0); setReviewComment(""); } }
                    )}
                  >
                    {submittingReview ? "Submitting…" : "Submit Review"}
                  </SubmitReviewBtn>
                </ReviewForm>
              )}

              {reviews.length === 0 ? (
                <NoReviews>No reviews yet for this listing.</NoReviews>
              ) : (
                reviews.map((r) => (
                  <ReviewItem key={r.id}>
                    <ReviewHeader>
                      <ReviewerName>{r.profiles?.full_name || r.profiles?.farm_name || "Buyer"}</ReviewerName>
                      <ReviewStars>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</ReviewStars>
                    </ReviewHeader>
                    {r.comment && <ReviewText>{r.comment}</ReviewText>}
                    <ReviewDate>{new Date(r.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</ReviewDate>
                  </ReviewItem>
                ))
              )}
            </Section>
          </Inner>
        </ContentSheet>
      </Page>
    </>
  );
};

export default ListingDetail;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: white;
`;

const HeroWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  height: 380px;
  background: white;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 600px) {
    height: 260px;
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
`;

const FloatBack = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  transition: background 0.15s;

  &:hover {
    background: white;
  }
`;

const FloatCategory = styled.span`
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #2f5a2a;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  backdrop-filter: blur(4px);
`;

const ContentSheet = styled.div`
  background: white;
  border-radius: 24px 24px 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 340px);
  padding-bottom: 40px;
`;

const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 28px 0;
  animation: ${fadeUp} 0.35s ease;

  @media (max-width: 600px) {
    padding: 22px 20px 0;
  }
`;

const TitleRow = styled.div`
  margin-bottom: 16px;
`;

const ProductTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a3318;
  letter-spacing: -0.3px;

  @media (max-width: 600px) {
    font-size: 1.35rem;
  }
`;

const PriceTag = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const AvailBadge = styled.div`
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 4px 14px;
  border-radius: 999px;
  background: #fdf0f0;
  color: #a32d2d;
  border: 1px solid #f5c2c2;
`;

// ─── Review styled components ─────────────────────────────────────────────────

const ReviewForm = styled.div`
  background: #f5f8f5;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
`;

const ReviewLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a3318;
`;

const StarRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#f0b33d" : "#cde5cf")};
  padding: 0;
  transition: color 0.15s;
  &:hover { color: #f0b33d; }
`;

const ReviewInput = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #cde5cf;
  border-radius: 10px;
  font-size: 0.88rem;
  font-family: inherit;
  color: #1a3318;
  background: white;
  resize: none;
  outline: none;
  &:focus { border-color: #2f5a2a; }
  margin-bottom: 10px;
`;

const SubmitReviewBtn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background: #2f5a2a;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #245026; }
`;

const ReviewItem = styled.div`
  padding: 14px 0;
  border-bottom: 1px solid #f0f7ee;
  &:last-child { border-bottom: none; }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const ReviewerName = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3318;
`;

const ReviewStars = styled.span`
  color: #f0b33d;
  font-size: 0.85rem;
  letter-spacing: 1px;
`;

const ReviewText = styled.p`
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: #556652;
  line-height: 1.6;
`;

const ReviewDate = styled.span`
  font-size: 0.75rem;
  color: #aac4aa;
`;

const NoReviews = styled.p`
  color: #7b9b7b;
  font-size: 0.88rem;
  padding: 12px 0;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const InfoChip = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  background: ${({ $green }) => ($green ? "#eef7ee" : "#f5f8f5")};
  color: ${({ $green }) => ($green ? "#2f5a2a" : "#44554c")};
  border: 1.5px solid ${({ $green }) => ($green ? "#cde5cf" : "#e2ebe2")};
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 24px 0;
`;

const Section = styled.div``;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const DescText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #44554c;
  line-height: 1.75;
`;

const SellerCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #f8faf6;
  border-radius: 14px;
  border: 1px solid #e8f0e8;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #eef7ee;
  }
`;

const SellerAvatar = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d7ead7;
  flex-shrink: 0;
`;

const SellerInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SellerName = styled.p`
  margin: 0 0 3px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3318;
`;

const SellerMeta = styled.span`
  font-size: 0.82rem;
  color: #7b8f7f;
`;

const SellerArrow = styled.span`
  font-size: 1.4rem;
  color: #b0c4b0;
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ $variant }) =>
    $variant === "primary" &&
    `
      background: #2f5a2a;
      color: white;
      border: none;
      &:hover:not(:disabled) { background: #245026; box-shadow: 0 4px 16px rgba(47,90,42,0.3); }
    `}

  ${({ $variant }) =>
    $variant === "secondary" &&
    `
      background: #ffc107;
      color: #2f5a2a;
      border: none;
      &:hover:not(:disabled) { background: #e0a800; }
    `}

  ${({ $variant }) =>
    $variant === "outline" &&
    `
      background: white;
      color: #2f5a2a;
      border: 2px solid #cde5cf;
      &:hover:not(:disabled) { background: #eef7ee; border-color: #2f5a2a; }
    `}

  ${({ $variant }) =>
    $variant === "danger" &&
    `
      background: #fff0f0;
      color: #a32d2d;
      border: 2px solid #f5c2c2;
      &:hover:not(:disabled) { background: #a32d2d; color: white; border-color: #a32d2d; }
    `}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const NotFoundWrap = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFoundCard = styled.div`
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);

  span {
    font-size: 2.5rem;
  }
  p {
    color: #7b8f7f;
    margin: 12px 0 20px;
  }
`;

const BackBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #245026;
  }
`;
