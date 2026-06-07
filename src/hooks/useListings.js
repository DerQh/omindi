import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// fetch all listings
export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price, unit, image_url, category, location, seller_id, seller_name, description, available, favourites, inquiries, created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      // console.log("Fetched listings:", data);
      return data;
    },
  });
}

// Deletes a listing by ID and invalidates the given user's listings cache.
export function useDeleteListing(user_id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", user_id] });
    },
  });
}

// Full-text search listings via Postgres tsvector. Falls back to client-side filtering when query is empty.
export function useSearchListings(query) {
  return useQuery({
    queryKey: ["listings", "search", query],
    enabled: !!query && query.trim().length > 1,
    staleTime: 30000,
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("search_listings", { search_query: query.trim() })
        .eq("approved", true);
      if (error) throw error;
      return data ?? [];
    },
  });
}

// fetch ALL listing by USER_ID
export function useUserListings(user_id) {
  return useQuery({
    queryKey: ["listing", user_id],
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("id, title, price, unit, image_url, category, location, seller_id, seller_name, description, available, approved, created_at")
        .eq("seller_id", user_id);

      if (error) throw error;
      return data;
    },
  });
}
