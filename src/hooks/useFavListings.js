import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";
// ------------------------- FETCH , UPDATE , SELECT FUNCTIONS  ------------------------ //


// CREATE FAV - WORKING 
export function useCreateFavTEST() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listing_id }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("listing_favorites")
        .insert({
          user_id: user?.id,
          listing_id,
        })
        .select(); // 🔥 THIS IS IMPORTANT FOR DEBUGGING

      if (error) {
        console.log("Insert error:", error);
        throw error;
      }

      console.log("Favourite success:", data);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing_favorites"] });
    },
  });
}





// check if user has favourited the listing
async function getFavourite({ user_id, listing_id }) {
  const { data } = await supabase
    .from("listing_favorites")
    .select("id")
    .eq("user_id", user_id)
    .eq("listing_id", listing_id)
    .single();
  return data;
}

// get total count of listings

async function getFavoriteCount(listing_id) {
  const { data } = await supabase
    .from("listing_favorites")
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listing_id);

  return data;
}

// Add favorite listing

async function addListToFavourite({ user_id, listing_id }) {
  const { data, error } = await supabase
    .from("listing_favorites")
    .insert({ user_id, listing_id })
    .select()
    .single();
  console.log(error);

  if (error) throw error;

  console.log(data);
  return data;
}

// Remove Favorite listing, you dont return anything because the server is being updated.

async function removeFavouriteList({ user_id, listing_id }) {
  const { data, error } = await supabase
    .from("listing_favorites")
    .delete()
    .eq("user_id", user_id)
    .eq("listing_id", listing_id);
  if (error) throw error;
}

// ------------------------- USING THE HOOKS , useQuery ------------------------ //

//  -----
export function useFavorite({ user_id, listing_id }) {
  //   console.log(user_id, listing_id);
  return useQuery({
    queryKey: ["favorite", user_id, listing_id],
    queryFn: () => getFavoriteCount({ user_id, listing_id }),
  });
}
// -----
export function useFavoriteCount(listing_id) {
  return useQuery({
    queryKey: ["favouriteCount", listing_id],
    queryFn: () => getFavoriteCount(listing_id),
  });
}

// ---- ADD FAV
export function useAddFavorite({ user_id, listing_id }) {
  console.log("called");
  return useMutation({
    mutationFn: () => addFavorite({ user_id, listing_id }),
  });
}

// ----- MAIN ---- //
export function useToggleFavorite({ user_id, listing_id }) {
  const queryClient = useQueryClient();

  //   console.log("use fav clicked ")
  const favoriteKey = ["favorite", user_id, listing_id];
  const countKey = ["favoriteCount", listing_id];

  return useMutation({
    mutationFn: ({ isFavorited }) =>
      isFavorited
        ? removeFavorite({ user_id, listing_id })
        : addFavorite({ user_id, listing_id }),

    onMutate: async ({ isFavorited }) => {
      // cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoriteKey });
      await queryClient.cancelQueries({ queryKey: countKey });

      // snapshot current values in case we need to roll back
      const prevFavorite = queryClient.getQueryData(favoriteKey);
      const prevCount = queryClient.getQueryData(countKey);

      // optimistically update the UI immediately
      queryClient.setQueryData(
        favoriteKey,
        isFavorited ? null : { id: "temp" },
      );
      queryClient.setQueryData(countKey, (old) =>
        isFavorited ? old - 1 : old + 1,
      );

      return { prevFavorite, prevCount };
    },

    // if the mutation fails, roll back to the snapshot
    onError: (err, variables, context) => {
      queryClient.setQueryData(favoriteKey, context.prevFavorite);
      queryClient.setQueryData(countKey, context.prevCount);
    },

    // always refetch after to make sure we're in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKey });
      queryClient.invalidateQueries({ queryKey: countKey });
    },
  });
}

// ▶️ HOW TO USE IN THE USER INTERFACE ------- //

// import { useFavorite, useFavoriteCount, useToggleFavorite } from "../hooks/useFavorites";

// export function FavoriteButton({ listing_id, user_id }) {
//   const { data: isFavorited } = useFavorite({ user_id, listing_id });
//   const { data: count } = useFavoriteCount(listing_id);
//   const { mutate: toggle, isPending } = useToggleFavorite({ user_id, listing_id });

//   return (
{
  /* <button
  onClick={() => toggle({ isFavorited })}
  disabled={isPending}
  style={{ opacity: isPending ? 0.7 : 1 }}
>
  {isFavorited ? "❤️" : "🤍"} {count ?? 0}
</button>; */
}
//   );
// }
