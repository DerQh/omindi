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

// fetch single listing by id
// export function useListing(id) {
//   return useQuery({
//     queryKey: ["listing", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("listings")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (error) throw error;
//       return data;
//     },
//   });
// }
