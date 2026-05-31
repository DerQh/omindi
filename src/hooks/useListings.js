import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// fetch all listings
export function useListings() {
  return useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
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

// fetch ALL listing by USER_ID
export function useUserListings(user_id) {
  return useQuery({
    queryKey: ["listing", user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", user_id);

      if (error) throw error;
      return data;
    },
  });
}
