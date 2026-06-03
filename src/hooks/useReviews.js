import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches all reviews for a specific listing, ordered by most recent.
export function useListingReviews(listing_id) {
  return useQuery({
    queryKey: ["reviews", listing_id],
    enabled: !!listing_id,
    staleTime: 120000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviewer_id(full_name, avatar_url, farm_name)")
        .eq("listing_id", listing_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Fetches all reviews received by a seller across all their listings, with reviewer profile info.
// Used in Profile.jsx to show the "Reviews Received" section.
export function useSellerReviews(seller_id) {
  return useQuery({
    queryKey: ["sellerReviews", seller_id],
    enabled: !!seller_id,
    staleTime: 120000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviewer_id(full_name, avatar_url, farm_name), listings(title)")
        .eq("seller_id", seller_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Returns the average rating and review count for a seller across all their listings.
export function useSellerRating(seller_id) {
  return useQuery({
    queryKey: ["sellerRating", seller_id],
    enabled: !!seller_id,
    staleTime: 120000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("seller_id", seller_id);
      if (error) throw error;
      if (!data?.length) return { avg: 0, count: 0 };
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      return { avg: Math.round(avg * 10) / 10, count: data.length };
    },
  });
}

// Checks whether the current user has already reviewed a specific listing.
export function useHasReviewed(user_id, listing_id) {
  return useQuery({
    queryKey: ["hasReviewed", user_id, listing_id],
    enabled: !!user_id && !!listing_id,
    staleTime: 120000,
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id")
        .eq("reviewer_id", user_id)
        .eq("listing_id", listing_id)
        .maybeSingle();
      return !!data;
    },
  });
}

// Checks whether the user has ordered a listing — only buyers who ordered can review.
export function useCanReview(user_id, listing_id) {
  return useQuery({
    queryKey: ["canReview", user_id, listing_id],
    enabled: !!user_id && !!listing_id,
    staleTime: 120000,
    queryFn: async () => {
      const { data } = await supabase
        .from("order_items")
        .select("id, orders!inner(user_id, status)")
        .eq("listing_id", listing_id)
        .eq("orders.user_id", user_id)
        .eq("orders.status", "delivered")
        .maybeSingle();
      return !!data;
    },
  });
}

// Inserts a new review for a listing and invalidates related review caches.
export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listing_id, seller_id, rating, comment }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("reviews")
        .insert({ listing_id, seller_id, reviewer_id: user.id, rating, comment })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", data.listing_id] });
      queryClient.invalidateQueries({ queryKey: ["sellerRating", data.seller_id] });
      queryClient.invalidateQueries({ queryKey: ["sellerReviews", data.seller_id] });
      queryClient.invalidateQueries({ queryKey: ["hasReviewed"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}

// Fetches reviews for a shop item stored in the reviews table via shop_item_id.
export function useShopItemReviews(shop_item_id) {
  const key = shop_item_id != null ? String(shop_item_id) : null;
  return useQuery({
    queryKey: ["shopReviews", key],
    enabled: !!key,
    staleTime: 120000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles!reviewer_id(full_name, avatar_url)")
        .eq("shop_item_id", key)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Checks if the current user has already reviewed a specific shop item.
export function useHasReviewedShopItem(user_id, shop_item_id) {
  const key = shop_item_id != null ? String(shop_item_id) : null;
  return useQuery({
    queryKey: ["hasReviewedShop", user_id, key],
    enabled: !!user_id && !!key,
    staleTime: 120000,
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id")
        .eq("reviewer_id", user_id)
        .eq("shop_item_id", key)
        .maybeSingle();
      return !!data;
    },
  });
}

// Inserts a review for a shop item.
// Requires: ALTER TABLE reviews ADD COLUMN IF NOT EXISTS shop_item_id bigint REFERENCES shop_items(id);
export function useAddShopItemReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ shop_item_id, rating, comment, reviewer_name }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("reviews")
        .insert({ shop_item_id: String(shop_item_id), reviewer_id: user.id, rating, comment })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shopReviews", String(data.shop_item_id)] });
      queryClient.invalidateQueries({ queryKey: ["hasReviewedShop"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}

// Deletes a review by ID and refreshes the reviews list for that listing.
export function useDeleteReview(listing_id, seller_id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review_id) => {
      const { error } = await supabase.from("reviews").delete().eq("id", review_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", listing_id] });
      queryClient.invalidateQueries({ queryKey: ["sellerRating", seller_id] });
      queryClient.invalidateQueries({ queryKey: ["sellerReviews", seller_id] });
      queryClient.invalidateQueries({ queryKey: ["hasReviewed"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });
}
