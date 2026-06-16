import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches the referral code and stats for the current user.
export function useReferralInfo(user_id) {
  return useQuery({
    queryKey: ["referral", user_id],
    enabled: !!user_id,
    staleTime: 120000,
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("referral_code, loyalty_points")
        .eq("id", user_id)
        .single();
      if (error) throw error;

      // Count how many users this user has referred
      const { count } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", user_id);

      return {
        referral_code: profile?.referral_code ?? null,
        loyalty_points: profile?.loyalty_points ?? 0,
        referral_count: count ?? 0,
      };
    },
  });
}

// Records a referral when a new user signs up with a referral code.
// Call this once after the user's profile is created.
export function useApplyReferralCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ new_user_id, referral_code }) => {
      // Find the referrer by their code
      const { data: referrer, error: findError } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", referral_code.toUpperCase())
        .maybeSingle();

      if (findError || !referrer) throw new Error("Invalid referral code");

      // Record the referral
      const { error: refError } = await supabase
        .from("referrals")
        .insert({ referrer_id: referrer.id, referred_id: new_user_id });
      if (refError) throw refError;

      // Mark the new user's referred_by
      await supabase
        .from("profiles")
        .update({ referred_by: referral_code.toUpperCase() })
        .eq("id", new_user_id);

      // Award 50 loyalty points to both parties
      await supabase.rpc("increment_loyalty_points", { uid: referrer.id, amount: 50 });
      await supabase.rpc("increment_loyalty_points", { uid: new_user_id,  amount: 25 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral"] });
    },
  });
}
