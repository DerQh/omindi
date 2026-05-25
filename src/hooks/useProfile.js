import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// fetch single profile by user id
export function useProfile(id) {
  return useQuery({
    queryKey: ["profile", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      return data;
    },
  });
}
