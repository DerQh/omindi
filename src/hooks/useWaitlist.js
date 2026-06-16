import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Checks if the current user is on the waitlist for a listing.
export function useIsOnWaitlist(user_id, listing_id) {
  return useQuery({
    queryKey: ["waitlist", "check", user_id, listing_id],
    enabled: !!user_id && !!listing_id,
    staleTime: 60000,
    queryFn: async () => {
      const { data } = await supabase
        .from("listing_waitlist")
        .select("id")
        .eq("user_id", user_id)
        .eq("listing_id", listing_id)
        .maybeSingle();
      return !!data;
    },
  });
}

// Returns the count of users on the waitlist for a listing.
export function useWaitlistCount(listing_id) {
  return useQuery({
    queryKey: ["waitlist", "count", listing_id],
    enabled: !!listing_id,
    staleTime: 60000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("listing_waitlist")
        .select("*", { count: "exact", head: true })
        .eq("listing_id", listing_id);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

// Adds the current user to the waitlist for a listing.
export function useJoinWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      const { error } = await supabase
        .from("listing_waitlist")
        .insert({ user_id, listing_id });
      if (error) throw error;
    },
    onSuccess: (_, { user_id, listing_id }) => {
      queryClient.invalidateQueries({ queryKey: ["waitlist", "check", user_id, listing_id] });
      queryClient.invalidateQueries({ queryKey: ["waitlist", "count", listing_id] });
    },
  });
}

// Removes the current user from the waitlist for a listing.
export function useLeaveWaitlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      const { error } = await supabase
        .from("listing_waitlist")
        .delete()
        .eq("user_id", user_id)
        .eq("listing_id", listing_id);
      if (error) throw error;
    },
    onSuccess: (_, { user_id, listing_id }) => {
      queryClient.invalidateQueries({ queryKey: ["waitlist", "check", user_id, listing_id] });
      queryClient.invalidateQueries({ queryKey: ["waitlist", "count", listing_id] });
    },
  });
}
