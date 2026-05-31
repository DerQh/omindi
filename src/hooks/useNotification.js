import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches all notifications for a user, sorted by most recently updated first.
export function useNotifications(user_id) {
  return useQuery({
    queryKey: ["notifications", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// --- UNREAD count
export function useUnreadCount(user_id) {
  return useQuery({
    queryKey: ["notificationsUnread", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user_id)
        .eq("read", false);

      if (error) throw error;
      return count ?? 0;
    },
  });
}

// --- MARK single notification as read
export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsUnread"] });
    },
  });
}

// --- MARK ALL as read
export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user_id) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user_id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsUnread"] });
    },
  });
}

const ORDER_TITLES = {
  pending:   "Order Placed",
  confirmed: "Order Confirmed",
  delivering: "Order Out for Delivery",
  delivered: "Order Delivered",
  cancelled: "Order Cancelled",
};

const ORDER_BODIES = {
  pending:   "Your order has been placed successfully.",
  confirmed: "Your order has been confirmed by the seller.",
  delivering: "Your order is on its way. Expected delivery today.",
  delivered: "Your order has been delivered. Enjoy your purchase!",
  cancelled: "Your order has been cancelled.",
};

// Upserts an order notification — updates the existing row for this order (resetting read to false)
// or inserts a new one if none exists yet. Ensures one notification row per order.
export function useNotifyOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, orderId, status, total, payment }) => {
      const title = ORDER_TITLES[status] ?? "Order Update";
      const body  = ORDER_BODIES[status] ?? "Your order status has been updated.";
      const detail = { orderId, status, total, payment };

      // Check if a notification already exists for this order.
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user_id)
        .eq("type", "order")
        .contains("detail", { orderId })
        .maybeSingle();

      if (existing) {
        // Update the existing row so updated_at bumps and it re-surfaces as unread.
        const { error } = await supabase
          .from("notifications")
          .update({ title, body, detail, read: false })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // First status for this order — insert a fresh row.
        const { error } = await supabase.from("notifications").insert({
          user_id,
          type: "order",
          title,
          body,
          detail,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notificationsUnread"] });
    },
  });
}

// --- INSERT inquiry notification (notify seller when buyer inquires)
export function useNotifyInquiry() {
  return useMutation({
    mutationFn: async ({
      seller_id,
      listing_title,
      listing_id,
      message,
      from,
    }) => {
      const { error } = await supabase.from("notifications").insert({
        user_id: seller_id,
        type: "inquiry",
        title: "New Inquiry on Your Listing",
        body: `${from} asked about "${listing_title}"`,
        detail: { listing: listing_title, listing_id, message, from },
      });
      if (error) throw error;
    },
  });
}

// --- INSERT favorite notification (notify seller when buyer saves listing)
export function useNotifyFavorite() {
  return useMutation({
    mutationFn: async ({
      seller_id,
      listing_title,
      listing_id,
      total_saves,
    }) => {
      const { error } = await supabase.from("notifications").insert({
        user_id: seller_id,
        type: "favorite",
        title: "Someone Saved Your Listing",
        body: `A buyer added "${listing_title}" to their favourites.`,
        detail: { listing: listing_title, listing_id, totalSaves: total_saves },
      });
      if (error) throw error;
    },
  });
}

// Inserts a follow notification for the user who was followed.
export function useNotifyFollow() {
  return useMutation({
    mutationFn: async ({ following_id, follower_id, follower_name }) => {
      const { error } = await supabase.from("notifications").insert({
        user_id: following_id,
        type: "follow",
        title: `${follower_name} followed you`,
        body: "Tap to view their profile.",
        detail: { follower_id, follower_name },
      });
      if (error) throw error;
    },
  });
}

// --- INSERT system notification (manual or from triggers)
export function useNotifySystem() {
  return useMutation({
    mutationFn: async ({ user_id, title, body, action }) => {
      const { error } = await supabase.from("notifications").insert({
        user_id,
        type: "system",
        title,
        body,
        detail: { message: body, action },
      });
      if (error) throw error;
    },
  });
}
