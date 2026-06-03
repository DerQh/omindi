import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useListing } from "../../hooks/useEditListing";
import { useListings } from "../../hooks/useListings";
import AppNavbar from "./AppNavbar";
import styled, { keyframes, css } from "styled-components";
import { useUser } from "../../hooks/useUser";
import { useDeleteListing } from "../../hooks/useDeleteListing";
import LoadingComponent from "./Loading";
import ConfirmModule from "./ConfirmModule";
import { useAddItem, useCartItemCheck } from "../../hooks/useCart";
import { useCreateFavorite, useFavoriteCheck, useFavoriteDelete } from "../../hooks/useFavListings";
import { useQueryClient } from "@tanstack/react-query";
import { useStartConversation } from "../../hooks/useMessages";
import { useProfile } from "../../hooks/useProfile";
import { supabase } from "../../../supabase";
import { useListingReviews, useAddReview, useHasReviewed, useSellerRating } from "../../hooks/useReviews";

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

// ─── Helper ───────────────────────────────────────────────────────────────────

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <StarIcon key={i} $filled={i < Math.round(rating)}>
      {i < Math.round(rating) ? "★" : "☆"}
    </StarIcon>
  ));

// ─── Component ────────────────────────────────────────────────────────────────

const ListingDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { id } = useParams();

  const stateListng = location.state?.listing;
  const { data: fetchedListing, isLoading: isFetchingListing } = useListing(
    stateListng ? null : id
  );
  const listing = stateListng ?? fetchedListing;

  const { data: user, isLoading } = useUser();
  const { data: sellerProfile } = useProfile(listing?.seller_id);
  const sellerAvatar = listing?.seller_image_url || sellerProfile?.avatar_url || "/user.jpg";
  const { mutate: deleteListing, isLoading: isDeleting } = useDeleteListing();
  const { mutate: mutateAddItem, isPending } = useAddItem();
  const { mutateAsync: startConversation, isPending: isStarting } = useStartConversation();

  const { data: isItemInCart } = useCartItemCheck({
    user_id: user?.id,
    listing_id: listing?.id,
  });

  const [showConfirm, setShowConfirm]     = useState(false);
  const [reviewRating, setReviewRating]   = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError]     = useState("");
  const [quantity, setQuantity]           = useState(1);
  const [activeTab, setActiveTab]         = useState("description");
  const [activeThumb, setActiveThumb]     = useState(0);
  const [cartMsg, setCartMsg]             = useState({ text: "", error: false });
  const [hoverStar, setHoverStar]         = useState(0);

  const { data: isFavourited } = useFavoriteCheck({ user_id: user?.id, listing_id: listing?.id });
  const { mutate: addFav }     = useCreateFavorite();
  const { mutate: removeFav }  = useFavoriteDelete();

  const { data: allListings = [] } = useListings();
  const related = allListings
    .filter((l) => l.id !== listing?.id && l.category === listing?.category)
    .slice(0, 4)
    .concat(
      allListings
        .filter((l) => l.id !== listing?.id && l.category !== listing?.category)
        .slice(0, Math.max(0, 4 - allListings.filter((l) => l.id !== listing?.id && l.category === listing?.category).length))
    )
    .slice(0, 4);

  const { data: reviews = [] } = useListingReviews(listing?.id);
  const { data: sellerRating }  = useSellerRating(listing?.seller_id);
  const { data: hasReviewed }   = useHasReviewed(user?.id, listing?.id);
  const { mutate: addReview, isPending: submittingReview } = useAddReview();

  useEffect(() => {
    if (!listing?.id) return;
    supabase.rpc("increment_listing_views", { listing_id: listing.id }).then(null, () => {});
  }, [listing?.id]);

  const isSeller = user?.id === listing?.seller_id;

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const images = [
    listing?.image_url || "/afarmer.jpg",
    listing?.image_url || "/afarmer.jpg",
    listing?.image_url || "/afarmer.jpg",
  ];

  const handleGreenBtn = () => {
    if (isSeller) {
      navigate(`/edit-listing/${listing.id}`);
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
        setCartMsg({ text: "Item is already in your cart.", error: true });
      } else {
        mutateAddItem(
          { user_id: user?.id, listing_id: listing?.id },
          { onSuccess: () => setCartMsg({ text: `✓ ${listing.title} added to cart.`, error: false }) },
        );
      }
    }
  };

  const handleConfirmDelete = () => {
    deleteListing({ id: listing?.id });
    setShowConfirm(false);
  };

  const handleInquire = async () => {
    if (!user) {
      alert("Please log in to send an inquiry.");
      return;
    }
    try {
      const conversation = await startConversation({
        buyer_id: user.id,
        seller_id: listing?.seller_id,
        listing_id: listing?.id,
      });
      supabase.rpc("increment_inquiry_count", { listing_id: listing.id }).then(({ error }) => {
        if (error) console.error("inquiry rpc:", error);
      });
      navigate("/messages", { state: { conversationId: conversation.id } });
    } catch (e) {
      console.error("Inquiry error:", e);
      alert("Could not open conversation. Please try again.");
    }
  };

  const handleFav = () => {
    if (!user) return;
    if (isFavourited) {
      removeFav({ user_id: user.id, listing_id: listing.id });
    } else {
      addFav({ user_id: user.id, listing_id: listing.id });
    }
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
        <Container>
          {/* ── Breadcrumb ── */}
          <Breadcrumb>
            <span onClick={() => navigate("/list")}>Listings</span>
            <BreadSep>›</BreadSep>
            {listing.category && (
              <>
                <span onClick={() => navigate("/list")}>{listing.category}</span>
                <BreadSep>›</BreadSep>
              </>
            )}
            <span style={{ color: "#7b8f7f", fontWeight: 400, cursor: "default" }}>
              {listing.title}
            </span>
          </Breadcrumb>

          {/* ── Product layout ── */}
          <ProductLayout>
            {/* Left: image gallery */}
            <ImageSection>
              <MainImage>
                {listing.image_url ? (
                  <img
                    src={images[activeThumb]}
                    alt={listing.title}
                    onError={(e) => { e.target.src = "/afarmer.jpg"; }}
                  />
                ) : (
                  <NoImage>🌱</NoImage>
                )}
                {!isSeller && (
                  <FloatHeart $saved={isFavourited} onClick={handleFav} aria-label={isFavourited ? "Remove bookmark" : "Bookmark listing"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                      fill={isFavourited ? "currentColor" : "none"}
                      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </FloatHeart>
                )}
              </MainImage>
              <ThumbRow>
                {images.map((img, i) => (
                  <Thumb key={i} $active={activeThumb === i} onClick={() => setActiveThumb(i)}>
                    <img
                      src={img}
                      alt=""
                      onError={(e) => { e.target.src = "/afarmer.jpg"; }}
                    />
                  </Thumb>
                ))}
              </ThumbRow>
            </ImageSection>

            {/* Right: product summary */}
            <Summary>
              {listing.category && <CategoryChip>{listing.category}</CategoryChip>}
              <ProductTitle>{listing.title}</ProductTitle>

              <RatingRow>
                {renderStars(avgRating)}
                <RatingText>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</RatingText>
                <RatingCount>({reviews.length} review{reviews.length !== 1 ? "s" : ""})</RatingCount>
              </RatingRow>

              <Price>
                Kes {listing.price}
                {listing.unit ? ` / ${listing.unit}` : ""}
              </Price>

              {listing.available === false && <AvailBadge>Out of Stock</AvailBadge>}

              <HRule />

              {listing.description && (
                <DescText>
                  {listing.description.slice(0, 200)}
                  {listing.description.length > 200 ? "…" : ""}
                </DescText>
              )}

              {/* Location + min order chips */}
              {(listing.location || listing.minimumOrder) && (
                <InfoChipRow>
                  {listing.location && (
                    <InfoChip>Location: {listing.location}</InfoChip>
                  )}
                  {listing.minimumOrder && (
                    <InfoChip>Minimum order: {listing.minimumOrder}</InfoChip>
                  )}
                </InfoChipRow>
              )}

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
              <CtaStack>
                {isSeller ? (
                  <>
                    <AddBtn onClick={handleGreenBtn}>Edit Listing</AddBtn>
                    <CtaSecRow>
                      <WishBtn $danger onClick={handleOrangeBtn} disabled={isDeleting}>
                        {isDeleting ? "Deleting…" : "Delete Listing"}
                      </WishBtn>
                    </CtaSecRow>
                  </>
                ) : (
                  <>
                    <AddBtn onClick={handleGreenBtn} disabled={isPending}>
                      {isPending ? "Adding…" : isItemInCart ? "View Cart" : "Buy Now"}
                    </AddBtn>
                    <CtaSecRow>
                      <WishBtn onClick={handleOrangeBtn} disabled={isPending}>
                        {isItemInCart ? "✓ In Cart" : "Add to Cart"}
                      </WishBtn>
                      <InquiryBtn onClick={handleInquire} disabled={isStarting}>
                        {isStarting ? "Opening…" : "Inquiry"}
                      </InquiryBtn>
                    </CtaSecRow>
                  </>
                )}
              </CtaStack>

              {cartMsg.text &&
                (cartMsg.error ? (
                  <CartToastError>{cartMsg.text}</CartToastError>
                ) : (
                  <CartToast>{cartMsg.text}</CartToast>
                ))}

              {/* Seller */}
              <SellerBlock>
                <SellerBlockTitle>Seller</SellerBlockTitle>
                <SellerCard onClick={() => navigate(`/follower/${listing.seller_id}`)}>
                  <SellerAvatar src={sellerAvatar} alt={listing.seller_name} />
                  <SellerInfo>
                    <SellerName>
                      {listing.seller_name || sellerProfile?.farm_name || "Farmer"}
                    </SellerName>
                    <SellerMeta>
                      {sellerRating?.count > 0
                        ? `⭐ ${sellerRating.avg} · ${sellerRating.count} review${sellerRating.count !== 1 ? "s" : ""}`
                        : "No reviews yet"}
                    </SellerMeta>
                  </SellerInfo>
                  <SellerArrow>›</SellerArrow>
                </SellerCard>
              </SellerBlock>
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
                  {tab === "reviews" && ` (${reviews.length})`}
                </TabBtn>
              ))}
            </TabBar>

            <TabContent key={activeTab}>
              <TabCard>
                {/* ── Description ── */}
                {activeTab === "description" && (
                  <p style={{ margin: 0, lineHeight: 1.8, color: "#556652", fontSize: "0.95rem" }}>
                    {listing.description || "No description available."}
                  </p>
                )}

                {/* ── Details ── */}
                {activeTab === "details" && (
                  <>
                    <InfoTable>
                      <tbody>
                        {listing.category && (
                          <tr>
                            <td>Category</td>
                            <td>{listing.category}</td>
                          </tr>
                        )}
                        {listing.location && (
                          <tr>
                            <td>Location</td>
                            <td>{listing.location}</td>
                          </tr>
                        )}
                        {listing.unit && (
                          <tr>
                            <td>Unit</td>
                            <td>{listing.unit}</td>
                          </tr>
                        )}
                        {listing.minimumOrder && (
                          <tr>
                            <td>Minimum Order</td>
                            <td>{listing.minimumOrder}</td>
                          </tr>
                        )}
                        <tr>
                          <td>Availability</td>
                          <td>
                            {listing.available === false ? "Out of Stock" : "In Stock"}
                          </td>
                        </tr>
                      </tbody>
                    </InfoTable>

                    <SellerDivider />

                    <SellerSectionTitle>Seller</SellerSectionTitle>
                    <SellerCard onClick={() => navigate(`/follower/${listing.seller_id}`)}>
                      <SellerAvatar src={sellerAvatar} alt={listing.seller_name} />
                      <SellerInfo>
                        <SellerName>
                          {listing.seller_name || sellerProfile?.farm_name || "Farmer"}
                        </SellerName>
                        <SellerMeta>
                          {sellerRating?.count > 0
                            ? `⭐ ${sellerRating.avg} · ${sellerRating.count} review${sellerRating.count !== 1 ? "s" : ""}`
                            : "No reviews yet"}
                        </SellerMeta>
                      </SellerInfo>
                      <SellerArrow>›</SellerArrow>
                    </SellerCard>
                  </>
                )}

                {/* ── Reviews ── */}
                {activeTab === "reviews" && (
                  <>
                    {/* Rating summary */}
                    {reviews.length > 0 && (() => {
                      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
                      return (
                        <RatingSummary>
                          <RatingBig>{avg.toFixed(1)}</RatingBig>
                          <RatingSummaryRight>
                            <RatingStarsLarge>
                              {"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}
                            </RatingStarsLarge>
                            <RatingCount2>
                              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                            </RatingCount2>
                            <RatingBars>
                              {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter((r) => r.rating === star).length;
                                const pct = Math.round((count / reviews.length) * 100);
                                return (
                                  <RatingBarRow key={star}>
                                    <RatingBarLabel>{star}★</RatingBarLabel>
                                    <RatingBarTrack>
                                      <RatingBarFill style={{ width: `${pct}%` }} />
                                    </RatingBarTrack>
                                    <RatingBarNum>{count}</RatingBarNum>
                                  </RatingBarRow>
                                );
                              })}
                            </RatingBars>
                          </RatingSummaryRight>
                        </RatingSummary>
                      );
                    })()}

                    {!isSeller && hasReviewed && (
                      <AlreadyReviewed>✓ You've reviewed this listing</AlreadyReviewed>
                    )}

                    {!isSeller && user && !hasReviewed && (
                      <ReviewForm>
                        <ReviewLabel>Rate this listing</ReviewLabel>
                        <StarBtnRow>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <StarBtn
                              key={n}
                              $active={n <= (hoverStar || reviewRating)}
                              onMouseEnter={() => setHoverStar(n)}
                              onMouseLeave={() => setHoverStar(0)}
                              onClick={() => setReviewRating(n)}
                            >
                              ★
                            </StarBtn>
                          ))}
                        </StarBtnRow>
                        <ReviewInput
                          placeholder="Share your experience…"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={3}
                        />
                        {reviewError && (
                          <ReviewErrorMsg>{reviewError}</ReviewErrorMsg>
                        )}
                        <SubmitReviewBtn
                          disabled={reviewRating === 0 || submittingReview}
                          onClick={() => {
                            setReviewError("");
                            addReview(
                              {
                                listing_id: listing.id,
                                seller_id: listing.seller_id,
                                rating: reviewRating,
                                comment: reviewComment,
                              },
                              {
                                onSuccess: () => {
                                  setReviewRating(0);
                                  setReviewComment("");
                                  setHoverStar(0);
                                },
                                onError: (err) => {
                                  setReviewError(err.message ?? "Could not submit review. Please try again.");
                                },
                              },
                            );
                          }}
                        >
                          {submittingReview ? "Submitting…" : "Submit Review"}
                        </SubmitReviewBtn>
                      </ReviewForm>
                    )}

                    {reviews.length === 0 ? (
                      <NoReviews>
                        <NoReviewsIcon>🌱</NoReviewsIcon>
                        No reviews yet — be the first to review this listing.
                      </NoReviews>
                    ) : (
                      reviews.map((r) => (
                        <ReviewItem key={r.id}>
                          <ReviewAvatar>
                            {r.profiles?.avatar_url ? (
                              <img src={r.profiles.avatar_url} alt="" />
                            ) : (
                              <ReviewAvatarFallback>
                                {(r.profiles?.full_name || r.profiles?.farm_name || "?")[0].toUpperCase()}
                              </ReviewAvatarFallback>
                            )}
                          </ReviewAvatar>
                          <ReviewBody>
                            <ReviewHeader>
                              <ReviewerName>
                                {r.profiles?.full_name || r.profiles?.farm_name || "Buyer"}
                              </ReviewerName>
                              <ReviewStars>
                                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                              </ReviewStars>
                            </ReviewHeader>
                            {r.comment && <ReviewText>{r.comment}</ReviewText>}
                            <ReviewDate>
                              {new Date(r.created_at).toLocaleDateString("en-KE", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </ReviewDate>
                          </ReviewBody>
                        </ReviewItem>
                      ))
                    )}
                  </>
                )}
              </TabCard>
            </TabContent>
          </TabsWrap>

          {/* ── Related listings ── */}
          {related.length > 0 && (
            <RelatedSection>
              <SectionEyebrow>You might also like</SectionEyebrow>
              <SectionTitle>Related Listings</SectionTitle>
              <RelatedGrid>
                {related.map((l) => (
                  <RelatedCard
                    key={l.id}
                    onClick={() => navigate(`/listing/${l.id}`, { state: { listing: l } })}
                  >
                    <RelatedImg
                      src={l.image_url || "/afarmer.jpg"}
                      alt={l.title}
                      onError={(e) => { e.target.src = "/afarmer.jpg"; }}
                    />
                    <RelatedBody>
                      {l.category && <RelatedCategory>{l.category}</RelatedCategory>}
                      <RelatedName>{l.title}</RelatedName>
                      <RelatedPrice>
                        Kes {l.price}
                        {l.unit ? ` / ${l.unit}` : ""}
                      </RelatedPrice>
                    </RelatedBody>
                  </RelatedCard>
                ))}
              </RelatedGrid>
            </RelatedSection>
          )}
        </Container>
      </Page>
    </>
  );
};

export default ListingDetail;

// ─── Styled components ────────────────────────────────────────────────────────

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

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  margin-bottom: 28px;
  color: #7b8f7f;

  span {
    cursor: pointer;
    color: #2f5a2a;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

const BreadSep = styled.span`
  color: #cde5cf;
  cursor: default !important;
  text-decoration: none !important;
`;

// ─── Product layout ───────────────────────────────────────────────────────────

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: start;
  margin-bottom: 56px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

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
    &:hover { transform: scale(1.03); }
  }

  @media (max-width: 900px) {
    border-radius: 0;
    aspect-ratio: unset;
    height: 280px;
  }
`;

const FloatHeart = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  color: ${({ $saved }) => ($saved ? "#f59e0b" : "#7b9b7b")};
  transition: background 0.15s, transform 0.15s, color 0.15s;
  z-index: 2;

  &:hover {
    background: white;
    transform: scale(1.1);
    color: #f59e0b;
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

const ThumbRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;

  @media (max-width: 900px) {
    padding: 0 16px;
  }
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
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover { border-color: #2f5a2a; }
`;

// ─── Summary column ───────────────────────────────────────────────────────────

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeUp} 0.4s ease;
  padding: 0;

  @media (max-width: 900px) {
    padding: 20px 16px 0;
  }
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
  gap: 6px;
  margin-bottom: 18px;
`;

const StarIcon = styled.span`
  font-size: 0.95rem;
  color: ${({ $filled }) => ($filled ? "#f0b33d" : "#d0d8d0")};
  line-height: 1;
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
  margin: 0 0 10px;
  font-size: 2rem;
  font-weight: 900;
  color: #2f5a2a;
  letter-spacing: -0.03em;
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

const HRule = styled.div`
  height: 1px;
  background: #e8f0e8;
  margin: 4px 0 18px;
`;

const DescText = styled.p`
  margin: 0 0 20px;
  font-size: 0.93rem;
  color: #556652;
  line-height: 1.75;
`;

// ─── Quantity stepper ─────────────────────────────────────────────────────────

const OptionBlock = styled.div`
  margin-bottom: 20px;
`;

const OptionLabel = styled.p`
  margin: 0 0 10px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;

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

  &:hover { background: #eef7ee; }
  &:disabled { color: #cde5cf; cursor: not-allowed; }
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

// ─── CTA buttons ──────────────────────────────────────────────────────────────

const CtaStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 4px 0 16px;
`;

const CtaSecRow = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddBtn = styled.button`
  flex: 1;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s, transform 0.12s;
  white-space: nowrap;

  &:hover:not(:disabled) { background: #1e3d1a; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

const WishBtn = styled.button`
  flex: 1;
  min-width: 0;
  background: ${({ $danger }) => ($danger ? "#fff0f0" : "#ffc107")};
  color: ${({ $danger }) => ($danger ? "#a32d2d" : "#2f5a2a")};
  border: ${({ $danger }) => ($danger ? "2px solid #f5c2c2" : "none")};
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? "#a32d2d" : "#e0a800")};
    color: ${({ $danger }) => ($danger ? "white" : "#1a2e1a")};
    border-color: ${({ $danger }) => ($danger ? "#a32d2d" : "transparent")};
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

const InquiryBtn = styled.button`
  flex: 1;
  min-width: 0;
  background: white;
  color: #2f5a2a;
  border: 2px solid #cde5cf;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) { background: #eef7ee; border-color: #2f5a2a; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

// ─── Cart toast ───────────────────────────────────────────────────────────────

const CartToast = styled.div`
  background: #eef7ee;
  border: 1.5px solid #a8d5ac;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #2f5a2a;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: ${toastIn} 0.3s ease;
  margin-bottom: 12px;
`;

const CartToastError = styled(CartToast)`
  background: #fdf0f0;
  border-color: #f5c6c2;
  color: #a32d2d;
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
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const TabBtn = styled.button`
  padding: 13px 24px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#7b8f7f")};
  border-bottom: 3px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;

  &:hover { color: #2f5a2a; }
`;

const TabContent = styled.div`
  animation: ${slideIn} 0.25s ease;
`;

const TabCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  @media (max-width: 600px) {
    padding: 20px 16px;
  }
`;


// ─── Info chips ───────────────────────────────────────────────────────────────

const InfoChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const InfoChip = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  background: #f5f8f5;
  color: #44554c;
  border: 1.5px solid #e2ebe2;
`;

// ─── Seller block (in Summary column) ────────────────────────────────────────

const SellerBlock = styled.div`
  margin-top: 16px;
`;

const SellerBlockTitle = styled.p`
  margin: 0 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

// ─── Details tab ──────────────────────────────────────────────────────────────

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    border-bottom: 1px solid #f0f7ee;
    &:last-child { border-bottom: none; }
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

const SellerDivider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 24px 0 20px;
`;

const SellerSectionTitle = styled.p`
  margin: 0 0 12px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #7b8f7f;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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

  &:hover { background: #eef7ee; }
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
  color: #1a2e1a;
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

// ─── Reviews tab ──────────────────────────────────────────────────────────────

const RatingSummary = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: #f8faf6;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 16px;
`;

const RatingBig = styled.div`
  font-size: 2.8rem;
  font-weight: 800;
  color: #1a3318;
  line-height: 1;
`;

const RatingSummaryRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RatingStarsLarge = styled.div`
  color: #f0b33d;
  font-size: 1rem;
  letter-spacing: 2px;
`;

const RatingCount2 = styled.div`
  font-size: 0.78rem;
  color: #7b8f7f;
  margin-bottom: 6px;
`;

const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const RatingBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RatingBarLabel = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
  width: 20px;
  text-align: right;
`;

const RatingBarTrack = styled.div`
  flex: 1;
  height: 5px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
`;

const RatingBarFill = styled.div`
  height: 100%;
  background: #f0b33d;
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const RatingBarNum = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
  width: 12px;
`;

const AlreadyReviewed = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: #2f5a2a;
  background: #f0fdf4;
  border: 1px solid #cde5cf;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
`;

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

const StarBtnRow = styled.div`
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
  font-size: 16px;
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
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #245026; }
`;

const ReviewErrorMsg = styled.p`
  margin: 0 0 10px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #a32d2d;
  background: #fdf0f0;
  border: 1px solid #f5c2c2;
  border-radius: 8px;
  padding: 8px 12px;
`;

const ReviewItem = styled.div`
  display: flex;
  gap: 12px;
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

const ReviewAvatar = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: #d7edd9;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ReviewAvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: #2f5a2a;
`;

const ReviewBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const NoReviews = styled.div`
  color: #7b9b7b;
  font-size: 0.88rem;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

const NoReviewsIcon = styled.span`font-size: 2rem;`;

// ─── Related listings ─────────────────────────────────────────────────────────

const RelatedSection = styled.div``;

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

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const RelatedCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }
`;

const RelatedImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  background: #e8f0e8;
`;

const RelatedBody = styled.div`
  padding: 14px 16px 18px;
`;

const RelatedCategory = styled.p`
  margin: 0 0 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #2f5a2a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
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

// ─── Not found ────────────────────────────────────────────────────────────────

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

  span { font-size: 2.5rem; }
  p { color: #7b8f7f; margin: 12px 0 20px; }
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

  &:hover { background: #245026; }
`;
