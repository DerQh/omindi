import { useQuery } from "@tanstack/react-query";
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
