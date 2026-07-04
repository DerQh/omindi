import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { formatPrice } from "../../utils";
import { Star, Leaf, RefreshCw, Check, Camera, Search } from "lucide-react";
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
import { useIsOnWaitlist, useWaitlistCount, useJoinWaitlist, useLeaveWaitlist } from "../../hooks/useWaitlist";
import { useCreateRecurringOrder } from "../../hooks/useRecurringOrders";
import { useLanguage } from "../../context/LanguageContext";

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
      <Star size={14} fill={i < Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" />
    </StarIcon>
  ));

// ─── Component ────────────────────────────────────────────────────────────────

const ListingDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useLanguage();

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
  const [reviewImage, setReviewImage]     = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState(null);
  const [quantity, setQuantity]           = useState(1);
  const [activeTab, setActiveTab]         = useState("description");
  const [activeThumb, setActiveThumb]     = useState(0);
  const [cartMsg, setCartMsg]             = useState({ text: "", error: false });
  const [hoverStar, setHoverStar]         = useState(0);

  const { data: isOnWaitlist }   = useIsOnWaitlist(user?.id, listing?.id);
  const { data: waitlistCount }  = useWaitlistCount(listing?.id);
  const { mutate: joinWaitlist,  isPending: joiningWaitlist  } = useJoinWaitlist();
  const { mutate: leaveWaitlist, isPending: leavingWaitlist  } = useLeaveWaitlist();
  const { mutate: createRecurring, isPending: creatingRecurring } = useCreateRecurringOrder();
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState("weekly");
  const [recurringQty, setRecurringQty]   = useState(1);
  const [recurringDone, setRecurringDone] = useState(false);

  const { data: isFavourited } = useFavoriteCheck({ user_id: user?.id, listing_id: listing?.id });
  const { mutate: addFav }     = useCreateFavorite();
  const { mutate: removeFav }  = useFavoriteDelete();

  const { data: allListings = [] } = useListings();
  const otherSellers = allListings.filter(
    (l) =>
      l.id !== listing?.id &&
      l.seller_id !== listing?.seller_id &&
      l.seller_id !== user?.id
  );
  const related = otherSellers
    .filter((l) => l.category === listing?.category)
    .slice(0, 4)
    .concat(
      otherSellers
        .filter((l) => l.category !== listing?.category)
        .slice(0, Math.max(0, 4 - otherSellers.filter((l) => l.category === listing?.category).length))
    )
    .slice(0, 4);

  const { data: reviews = [] } = useListingReviews(listing?.id);
  const { data: sellerRating }  = useSellerRating(listing?.seller_id);
  const { data: hasReviewed }   = useHasReviewed(user?.id, listing?.id);
  const { mutate: addReview, isPending: submittingReview } = useAddReview();

  useEffect(() => {
    if (!listing?.id) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    setQuantity(1);
    setActiveTab("description");
    setActiveThumb(0);
    setCartMsg({ text: "", error: false });
    setHoverStar(0);
    setReviewRating(0);
    setReviewComment("");
    supabase.rpc("increment_listing_views", { listing_id: listing.id }).then(null, () => {});
  }, [listing?.id]);

  const isSeller = user?.id === listing?.seller_id;

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const images = [
    listing?.image_url || "/afarmer.webp",
    listing?.image_url || "/afarmer.webp",
    listing?.image_url || "/afarmer.webp",
  ];

  const handleGreenBtn = () => {
    if (isSeller) {
      navigate(`/edit-listing/${listing.id}`);
    } else {
      if (isItemInCart) {
        navigate("/cart");
      } else {
        mutateAddItem(
          { user_id: user?.id, listing_id: listing?.id, quantity: Number(quantity) || 1 },
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
          { user_id: user?.id, listing_id: listing?.id, quantity: Number(quantity) || 1 },
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
            <Search size={28} color="#4a7c45" />
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

      {/* Recurring order modal */}
      {showRecurringModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRecurringModal(false); }}>
          <div style={{ background: "white", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 520 }}>
            <p style={{ margin: "0 0 4px", fontSize: "1.05rem", fontWeight: 800, color: "#1a2e1a", display: "flex", alignItems: "center", gap: 6 }}><RefreshCw size={16} /> Set Recurring Order</p>
            <p style={{ margin: "0 0 20px", fontSize: "0.83rem", color: "#7b8f7f" }}>Get {listing.title} delivered automatically.</p>
            {recurringDone ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ marginBottom: 10 }}><Check size={32} color="#2f5a2a" /></div>
                <p style={{ fontWeight: 700, color: "#2f5a2a" }}>Recurring order set!</p>
                <p style={{ fontSize: "0.83rem", color: "#7b8f7f" }}>You can manage it under Dashboard → Settings → Recurring Orders.</p>
                <button onClick={() => setShowRecurringModal(false)} style={{ marginTop: 14, background: "#2f5a2a", color: "white", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 700, cursor: "pointer" }}>Done</button>
              </div>
            ) : (
              <>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7b8f7f", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Frequency</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                  {[["weekly","Weekly"],["biweekly","Every 2 weeks"],["monthly","Monthly"]].map(([val,lbl]) => (
                    <button key={val} type="button"
                      onClick={() => setRecurringFreq(val)}
                      style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: `1.5px solid ${recurringFreq === val ? "#2f5a2a" : "#e5e7eb"}`, background: recurringFreq === val ? "#eef7ee" : "white", color: recurringFreq === val ? "#2f5a2a" : "#556652", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                      {lbl}
                    </button>
                  ))}
                </div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7b8f7f", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Quantity ({listing.unit})</label>
                <input type="number" min="1" value={recurringQty} onChange={(e) => setRecurringQty(Number(e.target.value))}
                  style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: "1rem", marginBottom: 20, fontFamily: "inherit" }} />
                <button
                  disabled={creatingRecurring}
                  onClick={() => {
                    createRecurring({
                      user_id: user.id,
                      listing_id: listing.id,
                      quantity: recurringQty,
                      frequency: recurringFreq,
                    }, { onSuccess: () => setRecurringDone(true) });
                  }}
                  style={{ width: "100%", background: "#2f5a2a", color: "white", border: "none", padding: "13px", borderRadius: 12, fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>
                  {creatingRecurring ? "Saving…" : "Confirm Recurring Order"}
                </button>
              </>
            )}
          </div>
        </div>
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
                    decoding="async"
                    onError={(e) => { e.target.src = "/afarmer.webp"; }}
                  />
                ) : (
                  <NoImage><Leaf size={36} color="#4a7c45" /></NoImage>
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
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.target.src = "/afarmer.webp"; }}
                    />
                  </Thumb>
                ))}
              </ThumbRow>
            </ImageSection>

            {/* Right: product summary */}
            <Summary>
              {listing.category && <CategoryChip>{listing.category}</CategoryChip>}

              {/* Quality badges */}
              {listing.badges?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {listing.badges.map((b) => (
                    <span key={b} style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "#eef7ee", color: "#2f5a2a", border: "1px solid #cde5cf" }}>
                      <Check size={12} style={{marginRight:3}} /> {b}
                    </span>
                  ))}
                </div>
              )}

              <ProductTitle>{listing.title}</ProductTitle>

              <RatingRow>
                {renderStars(avgRating)}
                <RatingText>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</RatingText>
                <RatingCount>({reviews.length} review{reviews.length !== 1 ? "s" : ""})</RatingCount>
              </RatingRow>

              <Price>
                Kes {formatPrice(listing.price)}
                {listing.unit ? ` / ${listing.unit}` : ""}
              </Price>

              {listing.available === false && <AvailBadge>{t.outOfStock}</AvailBadge>}

              {/* Bulk pricing tiers */}
              {listing.price_tiers?.length > 0 && (
                <div style={{ background: "#eef7ee", borderRadius: 12, padding: "12px 16px", marginTop: 10, marginBottom: 4 }}>
                  <p style={{ margin: "0 0 8px", fontSize: "0.73rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2f5a2a" }}>Bulk Pricing</p>
                  {listing.price_tiers.map((tier, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                      <span style={{ color: "#556652" }}>{tier.min_qty}+ {listing.unit}</span>
                      <span style={{ fontWeight: 700, color: "#1a2e1a" }}>Kes {formatPrice(tier.price)} / {listing.unit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Waitlist for out-of-stock listings */}
              {listing.available === false && !isSeller && user && (
                <div style={{ background: "#fff8e5", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px", marginTop: 10 }}>
                  <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: "#92400e" }}>
                    {waitlistCount > 0 ? `${waitlistCount} buyer${waitlistCount !== 1 ? "s" : ""} waiting for this item.` : "Join the waitlist to get notified when this is back in stock."}
                  </p>
                  <button
                    onClick={() => {
                      if (isOnWaitlist) {
                        leaveWaitlist({ user_id: user.id, listing_id: listing.id });
                      } else {
                        joinWaitlist({ user_id: user.id, listing_id: listing.id });
                      }
                    }}
                    disabled={joiningWaitlist || leavingWaitlist}
                    style={{ background: isOnWaitlist ? "#fdf0f0" : "#d97706", color: isOnWaitlist ? "#a32d2d" : "white", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    {joiningWaitlist || leavingWaitlist ? "…" : isOnWaitlist ? t.onWaitlistLeave : t.notifyWhenAvailable}
                  </button>
                </div>
              )}

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
                  <QtyInput
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) setQuantity(val);
                      else if (e.target.value === "") setQuantity("");
                    }}
                    onBlur={() => {
                      if (!quantity || quantity < 1) setQuantity(1);
                    }}
                  />
                  <QtyBtn onClick={() => setQuantity((q) => (Number(q) || 0) + 1)}>+</QtyBtn>
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
                      {isPending ? "…" : isItemInCart ? t.viewCart : t.buyNow}
                    </AddBtn>
                    <CtaSecRow>
                      <WishBtn onClick={handleOrangeBtn} disabled={isPending}>
                        {isItemInCart ? t.inCart : t.addToCart}
                      </WishBtn>
                      <InquiryBtn onClick={handleInquire} disabled={isStarting}>
                        {isStarting ? "Opening…" : "Inquiry"}
                      </InquiryBtn>
                      <InquiryBtn
                        onClick={() => { setShowRecurringModal(true); setRecurringDone(false); }}
                        style={{ background: "#eef7ee", color: "#2f5a2a" }}
                      >
                        <RefreshCw size={14} style={{marginRight:4}} /> {t.recurring}
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

              {/* Share */}
              <ShareRow>
                <ShareBtn
                  onClick={() => {
                    const url = `${window.location.origin}/listing/${listing.id}`;
                    const text = `Check out ${listing.title} on AFARMER™ — Kes ${formatPrice(listing.price)}${listing.unit ? ` / ${listing.unit}` : ""}${listing.location ? ` · ${listing.location}` : ""}.\n${url}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Share on WhatsApp
                </ShareBtn>
              </ShareRow>

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
                        ? `★ ${sellerRating.avg} · ${sellerRating.count} review${sellerRating.count !== 1 ? "s" : ""}`
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
                            {listing.available === false ? t.outOfStock : t.inStock}
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
                            ? `★ ${sellerRating.avg} · ${sellerRating.count} review${sellerRating.count !== 1 ? "s" : ""}`
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
                              {Array.from({length:5},(_,i)=><Star key={i} size={18} fill={i<Math.round(avg)?"#f59e0b":"none"} stroke="#f59e0b" />)}
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
                      <AlreadyReviewed>{t.alreadyReviewed}</AlreadyReviewed>
                    )}

                    {!isSeller && user && !hasReviewed && (
                      <ReviewForm>
                        <ReviewLabel>{t.rateThisListing}</ReviewLabel>
                        <StarBtnRow>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <StarBtn
                              key={n}
                              $active={n <= (hoverStar || reviewRating)}
                              onMouseEnter={() => setHoverStar(n)}
                              onMouseLeave={() => setHoverStar(0)}
                              onClick={() => setReviewRating(n)}
                            >
                              <Star size={20} fill={n <= (hoverStar || reviewRating) ? "#f59e0b" : "none"} stroke="#f59e0b" />
                            </StarBtn>
                          ))}
                        </StarBtnRow>
                        <ReviewInput
                          placeholder={t.shareExperience}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={3}
                        />

                        {/* Review photo upload */}
                        {reviewImagePreview ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0" }}>
                            <img src={reviewImagePreview} alt="review" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e8f5e9" }} />
                            <button type="button" onClick={() => { setReviewImage(null); setReviewImagePreview(null); }} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>Remove photo</button>
                          </div>
                        ) : (
                          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: 6, cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, color: "#2f5a2a" }}>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                              const f = e.target.files[0];
                              if (!f) return;
                              setReviewImage(f);
                              setReviewImagePreview(URL.createObjectURL(f));
                            }} />
                            <Camera size={14} style={{marginRight:4}} /> {t.addPhoto}
                          </label>
                        )}

                        {reviewError && (
                          <ReviewErrorMsg>{reviewError}</ReviewErrorMsg>
                        )}
                        <SubmitReviewBtn
                          disabled={reviewRating === 0 || submittingReview}
                          onClick={async () => {
                            setReviewError("");
                            let imageUrl = null;
                            if (reviewImage) {
                              const { data: { user: authUser } } = await supabase.auth.getUser();
                              const path = `reviews/${authUser.id}/${Date.now()}-${reviewImage.name}`;
                              const { error: upErr } = await supabase.storage.from("listing-images").upload(path, reviewImage);
                              if (!upErr) {
                                imageUrl = supabase.storage.from("listing-images").getPublicUrl(path).data.publicUrl;
                              }
                            }
                            addReview(
                              {
                                listing_id: listing.id,
                                seller_id: listing.seller_id,
                                rating: reviewRating,
                                comment: reviewComment,
                                image_url: imageUrl,
                              },
                              {
                                onSuccess: () => {
                                  setReviewRating(0);
                                  setReviewComment("");
                                  setHoverStar(0);
                                  setReviewImage(null);
                                  setReviewImagePreview(null);
                                },
                                onError: (err) => {
                                  setReviewError(err.message ?? "Could not submit review. Please try again.");
                                },
                              },
                            );
                          }}
                        >
                          {submittingReview ? t.submitting : t.submitReview}
                        </SubmitReviewBtn>
                      </ReviewForm>
                    )}

                    {reviews.length === 0 ? (
                      <NoReviews>
                        <NoReviewsIcon><Leaf size={28} color="#4a7c45" /></NoReviewsIcon>
                        {t.noReviews}
                      </NoReviews>
                    ) : (
                      reviews.map((r) => (
                        <ReviewItem key={r.id}>
                          <ReviewAvatar>
                            {r.profiles?.avatar_url ? (
                              <img src={r.profiles.avatar_url} alt="" loading="lazy" decoding="async" />
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
                                {Array.from({length:5},(_,i)=><Star key={i} size={12} fill={i<r.rating?"#f59e0b":"none"} stroke="#f59e0b" />)}
                              </ReviewStars>
                            </ReviewHeader>
                            {r.comment && <ReviewText>{r.comment}</ReviewText>}
                            {r.image_url && (
                              <img src={r.image_url} alt="review photo" loading="lazy" style={{ width: "100%", maxWidth: 200, borderRadius: 10, marginTop: 8, border: "1.5px solid #e8f5e9" }} />
                            )}
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
                      src={l.image_url || "/afarmer.webp"}
                      alt={l.title}
                      onError={(e) => { e.target.src = "/afarmer.webp"; }}
                    />
                    <RelatedBody>
                      {l.category && <RelatedCategory>{l.category}</RelatedCategory>}
                      <RelatedName>{l.title}</RelatedName>
                      <RelatedPrice>
                        Kes {formatPrice(l.price)}
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

const QtyInput = styled.input`
  width: 56px;
  height: 44px;
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #1a2e1a;
  border: none;
  border-left: 1px solid #e8f0e8;
  border-right: 1px solid #e8f0e8;
  outline: none;
  background: white;
  font-family: inherit;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  &:focus { background: #f5fef5; }
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

const ShareRow = styled.div`
  margin-bottom: 16px;
`;

const ShareBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1.5px solid #25d366;
  background: white;
  color: #25d366;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #25d366;
    color: white;
  }
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
