import { useState } from "react";
import styled from "styled-components";
import { formatSmartDate } from "../../hooks/dateFormat";
import {
  useAddFavorite,
  useFavorite,
  useFavoriteCount,
  useToggleFavorite,
} from "../../hooks/useFavListings";
import {
  useCreateFavTEST,
  useFavCheck,
  useFavDelete,
} from "../../hooks/useTest";
import { useQueryClient } from "@tanstack/react-query";

export function ListingCardTest({ listingItem, handleCardClick, user_id }) {
  const queryClient = useQueryClient();

  const listing_id = listingItem?.id;
  const { data: count } = useFavoriteCount(listing_id);

  const { mutate: deleteFavMutate, isPending: isPendinDelete } = useFavDelete();
  const { mutate: addFavMutate, isPending: isPendingfav } = useCreateFavTEST();
  const { data: isFavorited, isLoading } = useFavCheck({ user_id, listing_id });

  const handleFavourite = () => {
    if (isFavorited) {
      // UNLIKE A LISTING
      deleteFavMutate(
        {
          user_id,
          listing_id,
        },
        {
          onSuccess: () => {
            // console.log("fav delete");
            queryClient.invalidateQueries({
              queryKey: ["userFavorites", user_id, listing_id],
            });
          },
        },
      );
    } else {
      // LIKE A LISTING
      addFavMutate(
        {
          user_id,
          listing_id,
        },
        {
          onSuccess: () => {
            // console.log("fav sucess");
            queryClient.invalidateQueries({
              queryKey: ["userFavorites", user_id, listing_id],
            });
          },
        },
      );
    }
  };

  return (
    <ListingCard onClick={() => handleCardClick(listingItem)}>
      <ImageWrapper>
        {/* fav floating */}
        <FavouriteButton
          disabled={isLoading || isPendingfav || isPendinDelete}
          $active={isFavorited}
          onClick={(e) => {
            e.stopPropagation();
            handleFavourite();
          }}
        >
          {isFavorited ? "❤️ Saved" : "🤍 Favourite"}
        </FavouriteButton>
        <img src={listingItem.image_url} alt={listingItem.name} />
      </ImageWrapper>
      <Content>
        {/*  */}

        {/*  */}
        <h2>{listingItem.title}</h2>
        <p>
          Kes {listingItem.price}
          {listingItem.unit ? ` / ${listingItem.unit}` : ""}
        </p>
        <p>{listingItem.description}</p>
        <p>
          <strong>Category:</strong> {listingItem.category} •{" "}
          <strong>Location:</strong> {listingItem.location}
        </p>
        <Meta>
          <div className="stats">
            <span>{listingItem.inquiries || 0} inquiries</span>
            <span>{listingItem.favourites || 0} favourites</span>
          </div>
          <div className="updated">
            Updated {formatSmartDate(listingItem.created_at)}
          </div>
        </Meta>
      </Content>
    </ListingCard>
  );
}

const ListingCard = styled.div`
  background: white;
  border-radius: 18px;
  box-shadow: 0 9px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 220px;
  background: #d7e9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  padding: 18px;

  h2 {
    margin: 0 0 8px;
    font-size: 1.4rem;
    color: #273a25;
  }

  p {
    margin: 8px 0;
    color: #44554c;
    line-height: 1.5;
  }
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  margin-top: 16px;
  align-items: center;

  .stats,
  .controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .stats span,
  .controls button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.95rem;
    color: #536358;
  }

  .controls button {
    border: none;
    background: #e5f4ff;
    color: #2f5a2a;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
  }

  .updated {
    font-size: 0.88rem;
    color: #7b8f7f;
  }
`;

const FavouriteButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  backdrop-filter: blur(1px);
  border: none;
  padding: 8px 14px;
  border-radius: 18px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  background: ${({ $active }) => ($active ? "#ffe6e6" : "#e5f4ff")};

  color: ${({ $active }) => ($active ? "#d11a2a" : "#2f5a2a")};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;
