import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

export function useUserRating(userId) {
  return useQuery({
    queryKey: ["user_rating", userId],
    staleTime: 300000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_ratings")
        .select("rating")
        .eq("rated_user_id", userId);
      if (error) throw error;
      if (!data.length) return { avg: 0, count: 0 };
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      return { avg: Math.round(avg * 10) / 10, count: data.length };
    },
    enabled: !!userId,
  });
}

export function useMyRating(raterId, ratedUserId) {
  return useQuery({
    queryKey: ["my_rating", raterId, ratedUserId],
    staleTime: 300000,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_ratings")
        .select("rating")
        .eq("rater_id", raterId)
        .eq("rated_user_id", ratedUserId)
        .maybeSingle();
      return data?.rating ?? null;
    },
    enabled: !!raterId && !!ratedUserId,
  });
}

export function useRateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ rater_id, rated_user_id, rating }) => {
      const { error } = await supabase
        .from("user_ratings")
        .upsert({ rater_id, rated_user_id, rating }, { onConflict: "rater_id,rated_user_id" });
      if (error) throw error;
    },
    onSuccess: (_, { rated_user_id, rater_id }) => {
      queryClient.invalidateQueries({ queryKey: ["user_rating", rated_user_id] });
      queryClient.invalidateQueries({ queryKey: ["my_rating", rater_id, rated_user_id] });
    },
  });
}
