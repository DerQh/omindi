import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches the currently authenticated user along with their profile data from the profiles table.
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return { ...user, profile };
    },
  });
}
