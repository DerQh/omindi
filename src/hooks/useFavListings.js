import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Adds a listing to the user's favorites, then notifies the seller that their listing was saved.
export function useCreateFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      // Insert the favorite row.
      const { data, error } = await supabase
        .from("listing_favorites")
        .insert({ user_id, listing_id })
        .select()
        .single();

      if (error) throw error;

      const { error: rpcErr } = await supabase.rpc("increment_favourites_count", { listing_id });
      if (rpcErr) console.error("fav rpc:", rpcErr);

      // Fetch the listing's title and seller so we can notify them.
      const { data: listing } = await supabase
        .from("listings")
        .select("title, seller_id")
        .eq("id", listing_id)
        .single();

      if (listing?.seller_id && listing.seller_id !== user_id) {
        // Count how many times this listing has been favorited so far.
        const { count } = await supabase
          .from("listing_favorites")
          .select("*", { count: "exact", head: true })
          .eq("listing_id", listing_id);

        // Check if a favorite notification already exists for this listing.
        const { data: existing } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", listing.seller_id)
          .eq("type", "favorite")
          .contains("detail", { listing_id })
          .maybeSingle();

        const notifPayload = {
          title: "Someone Saved Your Listing",
          body: `A buyer added "${listing.title}" to their favourites.`,
          detail: { listing: listing.title, listing_id, totalSaves: count ?? 1 },
          read: false,
        };

        // Update the existing notification (bumping updated_at) or insert a fresh one.
        if (existing) {
          await supabase
            .from("notifications")
            .update(notifPayload)
            .eq("id", existing.id);
        } else {
          await supabase.from("notifications").insert({
            user_id: listing.seller_id,
            type: "favorite",
            ...notifPayload,
          });
        }
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing_favorites"] });
      queryClient.invalidateQueries({ queryKey: ["userFavorites"] });
      queryClient.invalidateQueries({ queryKey: ["listings"], refetchType: "none" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// Returns a boolean — whether the given user has favorited the given listing.
export function useFavoriteCheck({ user_id, listing_id }) {
  return useQuery({
    queryKey: ["userFavorites", user_id, listing_id],
    enabled: !!user_id && !!listing_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_favorites")
        .select("id")
        .eq("user_id", user_id)
        .eq("listing_id", listing_id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

// Removes a listing from the user's favorites.
export function useFavoriteDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      const { data, error } = await supabase
        .from("listing_favorites")
        .delete()
        .eq("user_id", user_id)
        .eq("listing_id", listing_id);
      if (error) throw error;
      const { error: rpcErr } = await supabase.rpc("decrement_favourites_count", { listing_id });
      if (rpcErr) console.error("unfav rpc:", rpcErr);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing_favorites"] });
      queryClient.invalidateQueries({ queryKey: ["userFavorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteListings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"], refetchType: "none" });
    },
  });
}

// Returns the full listing objects that the given user has saved/favorited.
export function useFavoriteListings(user_id) {
  return useQuery({
    queryKey: ["favoriteListings", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_favorites")
        .select("listing_id, listings(*)")
        .eq("user_id", user_id);
      if (error) throw error;
      return data.map((row) => row.listings).filter(Boolean);
    },
  });
}
