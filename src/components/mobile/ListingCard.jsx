import styled, { keyframes, css } from "styled-components";
import { formatSmartDate } from "../../hooks/dateFormat";
import { formatPrice } from "../../utils";
import {
  useCreateFavorite,
  useFavoriteCheck,
  useFavoriteDelete,
} from "../../hooks/useFavListings";
import { useQueryClient } from "@tanstack/react-query";
import { useState, memo } from "react";
import { Leaf } from "lucide-react";

// Renders a single listing card with image, price, details, and a favourite toggle button.
function ListingCardTestBase({ listingItem, handleCardClick, user_id, index }) {
  const queryClient = useQueryClient();
  const listing_id = listingItem?.id;
  const [popHeart, setPopHeart] = useState(false);

  const { mutate: deleteFavMutate } = useFavoriteDelete();
  const { mutate: addFavMutate } = useCreateFavorite();
  const { data: isFavorited } = useFavoriteCheck({ user_id, listing_id });

  const handleFavourite = () => {
    setPopHeart(true);
    setTimeout(() => setPopHeart(false), 420);
    const key = { queryKey: ["userFavorites", user_id, listing_id] };
    if (isFavorited) {
      deleteFavMutate({ user_id, listing_id }, { onSuccess: () => queryClient.invalidateQueries(key) });
    } else {
      addFavMutate({ user_id, listing_id }, { onSuccess: () => queryClient.invalidateQueries(key) });
    }
  };

  return (
    <Card $index={index} onClick={() => handleCardClick(listingItem)}>
      {/* ── Image ── */}
      <ImageWrap>
        {listingItem.image_url ? (
          <img
            src={listingItem.image_url}
            alt={listingItem.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <NoImage><Leaf size={32} color="#4a7c45" /></NoImage>
        )}

        {/* Only shown when the listing is out of stock */}
        {listingItem.available === false && (
          <AvailBadge>Out of Stock</AvailBadge>
        )}

        <FavBtn
          $active={isFavorited}
          $pop={popHeart}
          onClick={(e) => {
            e.stopPropagation();
            handleFavourite();
          }}
          aria-label={
            isFavorited ? "Remove from saved" : "Save listing"
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill={isFavorited ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </FavBtn>
      </ImageWrap>

      {/* ── Body ── */}
      <Body>
        <Price>
          Kes {formatPrice(listingItem.price)}
          {listingItem.unit ? ` / ${listingItem.unit}` : ""}
        </Price>

        <Title>{listingItem.title}</Title>

        {listingItem.description && (
          <Description>{listingItem.description}</Description>
        )}

        <DetailRow>
          {listingItem.category && (
            <>
              <DetailLabel>Category</DetailLabel>
              <DetailValue>{listingItem.category}</DetailValue>
            </>
          )}
          {listingItem.category && listingItem.location && (
            <DetailSep>·</DetailSep>
          )}
          {listingItem.location && (
            <>
              <DetailLabel>Location</DetailLabel>
              <DetailValue>{listingItem.location}</DetailValue>
            </>
          )}
        </DetailRow>

        <Divider />

        <StatsRow>
          <Stat>{listingItem.inquiries || 0} inquiries</Stat>
          <Stat>{listingItem.favourites || 0} bookmarks</Stat>
          <Stat style={{ marginLeft: "auto" }}>
            {formatSmartDate(listingItem.created_at)}
          </Stat>
        </StatsRow>
      </Body>
    </Card>
  );
}

export const ListingCardTest = memo(ListingCardTestBase);

// ─── Styled components ────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const heartPop = keyframes`
  0%   { transform: scale(1); }
  25%  { transform: scale(1.45); }
  50%  { transform: scale(0.88); }
  75%  { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const Card = styled.div`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
  text-align: left;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $index }) => ($index ?? 0) * 0.07}s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(20, 57, 32, 0.14);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ImageWrap = styled.div`
  position: relative;
  height: 200px;
  background: #eef7ee;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  ${Card}:hover img {
    transform: scale(1.09);
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: #eef7ee;
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #2f5a2a;
  margin-bottom: 6px;
`;

const AvailBadge = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  background: #a32d2d;
  color: white;
  letter-spacing: 0.02em;
  pointer-events: none;
`;

const FavBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active }) => ($active ? "#ef4444" : "#7b9b7b")};
  transition: color 0.15s;

  &:hover {
    color: #ef4444;
  }

  ${({ $pop }) => $pop && css`animation: ${heartPop} 0.4s ease;`}

  &:active {
    transform: scale(0.88);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Body = styled.div`
  padding: 16px 18px 18px;
`;

const Title = styled.h3`
  margin: 0 0 6px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a3318;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  margin: 0 0 12px;
  font-size: 0.85rem;
  color: #556652;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DetailRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  align-items: baseline;
`;

const DetailSep = styled.span`
  font-size: 0.85rem;
  color: #b0c4b0;
  margin: 0 4px;
`;

const DetailLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a3318;
  flex-shrink: 0;
`;

const DetailValue = styled.span`
  font-size: 0.85rem;
  color: #556652;
  line-height: 1.55;
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f7ee;
  margin: 10px 0 12px;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 14px;
`;

const Stat = styled.span`
  font-size: 0.78rem;
  color: #7b8f7f;
  font-weight: 600;
`;
