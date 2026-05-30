import styled from "styled-components";
import { formatSmartDate } from "../../hooks/dateFormat";
import {
  useCreateFavorite,
  useFavoriteCheck,
  useFavoriteDelete,
} from "../../hooks/useFavListings";
import { useQueryClient } from "@tanstack/react-query";

export function ListingCardTest({ listingItem, handleCardClick, user_id }) {
  const queryClient = useQueryClient();
  const listing_id = listingItem?.id;

  const { mutate: deleteFavMutate, isPending: isPendinDelete } = useFavoriteDelete();
  const { mutate: addFavMutate,    isPending: isPendingfav   } = useCreateFavorite();
  const { data: isFavorited, isLoading } = useFavoriteCheck({ user_id, listing_id });

  const handleFavourite = () => {
    const key = { queryKey: ["userFavorites", user_id, listing_id] };
    if (isFavorited) {
      deleteFavMutate({ user_id, listing_id }, { onSuccess: () => queryClient.invalidateQueries(key) });
    } else {
      addFavMutate({ user_id, listing_id }, { onSuccess: () => queryClient.invalidateQueries(key) });
    }
  };

  return (
    <Card onClick={() => handleCardClick(listingItem)}>
      {/* ── Image ── */}
      <ImageWrap>
        {listingItem.image_url ? (
          <img src={listingItem.image_url} alt={listingItem.title} loading="lazy" />
        ) : (
          <NoImage>🌱</NoImage>
        )}

        <FavBtn
          disabled={isLoading || isPendingfav || isPendinDelete}
          $active={isFavorited}
          onClick={(e) => { e.stopPropagation(); handleFavourite(); }}
          aria-label={isFavorited ? "Remove from favourites" : "Save to favourites"}
        >
          {isFavorited ? "❤️" : "🤍"}
        </FavBtn>
      </ImageWrap>

      {/* ── Body ── */}
      <Body>
        <Price>
          Kes {listingItem.price}
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
          <Stat>{listingItem.favourites || 0} saves</Stat>
          <Stat style={{ marginLeft: "auto" }}>{formatSmartDate(listingItem.created_at)}</Stat>
        </StatsRow>
      </Body>
    </Card>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Card = styled.div`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: left;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(20, 57, 32, 0.13);
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
    transition: transform 0.35s ease;
  }

  ${Card}:hover img {
    transform: scale(1.05);
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
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s;

  &:hover  { transform: scale(1.15); }
  &:active { transform: scale(0.9); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
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
