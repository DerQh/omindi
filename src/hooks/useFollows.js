import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Returns the total number of followers for a given user (rows where following_id = userId).
export function useFollowerCount(userId) {
  return useQuery({
    queryKey: ["followerCount", userId],
    enabled: !!userId,
    staleTime: 120000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

// Checks whether the current user (followerId) is following a specific seller (followingId), returns a boolean.
export function useIsFollowing(followerId, followingId) {
  return useQuery({
    queryKey: ["isFollowing", followerId, followingId],
    enabled: !!followerId && !!followingId,
    staleTime: 120000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

// Fetches all seller profiles that the given user is currently following.
export function useFollowedSellers(userId) {
  return useQuery({
    queryKey: ["followedSellers", userId],
    enabled: !!userId,
    staleTime: 120000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("profiles!following_id(*)")
        .eq("follower_id", userId);
      if (error) throw error;
      return data.map((row) => row.profiles).filter(Boolean);
    },
  });
}

// Toggles follow state for a specific seller — inserts a follow row if not following, deletes it if already following.
// Also inserts a follow notification for the followed user when a new follow is created.
export function useFollowToggle(followerId, followingId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isCurrentlyFollowing) => {
      if (isCurrentlyFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", followerId)
          .eq("following_id", followingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: followerId, following_id: followingId });
        if (error) throw error;

        // Fetch the follower's farm name to use in the notification message.
        const { data: profile } = await supabase
          .from("profiles")
          .select("farm_name")
          .eq("id", followerId)
          .single();

        const followerName = profile?.farm_name || "Someone";

        // Insert a notification for the seller who was followed.
        await supabase.from("notifications").insert({
          user_id: followingId,
          type: "follow",
          title: `${followerName} followed you`,
          body: "Tap to view their profile.",
          detail: { follower_id: followerId, follower_name: followerName },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", followerId, followingId] });
      queryClient.invalidateQueries({ queryKey: ["followedSellers", followerId] });
      queryClient.invalidateQueries({ queryKey: ["notifications", followingId] });
    },
  });
}

// Removes a follow relationship — the mutation receives the followingId to unfollow and updates the sellers list.
export function useUnfollow(followerId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (followingId) => {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);
      if (error) throw error;
    },
    onSuccess: (_, followingId) => {
      queryClient.invalidateQueries({ queryKey: ["followedSellers", followerId] });
      queryClient.invalidateQueries({ queryKey: ["isFollowing", followerId, followingId] });
    },
  });
}
