import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches the current loyalty points balance for a user.
export function useLoyaltyPoints(user_id) {
  return useQuery({
    queryKey: ["loyalty", user_id],
    enabled: !!user_id,
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("loyalty_points")
        .eq("id", user_id)
        .single();
      if (error) throw error;
      return data?.loyalty_points ?? 0;
    },
  });
}

// Fetches the loyalty event log for a user.
export function useLoyaltyHistory(user_id) {
  return useQuery({
    queryKey: ["loyaltyHistory", user_id],
    enabled: !!user_id,
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_events")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Awards loyalty points to a user and logs the event.
export function useAwardPoints() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, points, reason }) => {
      // Log event
      await supabase.from("loyalty_events").insert({ user_id, points, reason });
      // Increment balance
      const { data: profile } = await supabase
        .from("profiles")
        .select("loyalty_points")
        .eq("id", user_id)
        .single();
      const current = profile?.loyalty_points ?? 0;
      const { error } = await supabase
        .from("profiles")
        .update({ loyalty_points: current + points })
        .eq("id", user_id);
      if (error) throw error;
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ["loyalty", user_id] });
      queryClient.invalidateQueries({ queryKey: ["loyaltyHistory", user_id] });
    },
  });
}
