import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// --- FETCH all notifications for a user
export function useNotifications(user_id) {
  console.log(user_id)
  return useQuery({
    queryKey: ["notifications", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

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

// --- INSERT order notification (call after order is created)
export function useNotifyOrder() {
  return useMutation({
    mutationFn: async ({ user_id, orderId, status, total, payment }) => {
      const titles = {
        pending: "Order Placed",
        confirmed: "Order Confirmed",
        delivering: "Order Out for Delivery",
        delivered: "Order Delivered",
        cancelled: "Order Cancelled",
      };
      const bodies = {
        pending: "Your order has been placed successfully.",
        confirmed: "Your order has been confirmed by the seller.",
        delivering: "Your order is on its way. Expected delivery today.",
        delivered: "Your order has been delivered. Enjoy your purchase!",
        cancelled: "Your order has been cancelled.",
      };

      const { error } = await supabase.from("notifications").insert({
        user_id,
        type: "order",
        title: titles[status] ?? "Order Update",
        body: bodies[status] ?? "Your order status has been updated.",
        detail: { orderId, status, total, payment },
      });
      if (error) throw error;
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
