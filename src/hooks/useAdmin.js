import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// ─── Stats ────────────────────────────────────────────────────────────────────

// Fetches aggregate platform stats: total users, listings, orders, revenue, pending, and disputed order counts.
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [usersRes, listingsRes, ordersRes, statsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("listings").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_cost, created_at, status"),
        supabase.from("listings").select("inquiries, favourites"),
      ]);
      const orders = ordersRes.data ?? [];
      const listingStats = statsRes.data ?? [];
      return {
        userCount:      usersRes.count   ?? 0,
        listingCount:   listingsRes.count ?? 0,
        orderCount:     orders.length,
        totalRevenue:   orders.reduce((s, o) => s + (o.total_cost || 0), 0),
        pendingOrders:  orders.filter((o) => o.status === "pending").length,
        disputedOrders: orders.filter((o) => o.status === "disputed").length,
        totalInquiries: listingStats.reduce((s, l) => s + (l.inquiries || 0), 0),
        totalFavourites: listingStats.reduce((s, l) => s + (l.favourites || 0), 0),
        ordersRaw:      orders,
      };
    },
  });
}

// ─── Users ────────────────────────────────────────────────────────────────────

// Fetches all user profiles ordered by most recently created, for the admin users panel.
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Toggles the is_admin flag on a user's profile and invalidates the admin cache.
export function useAdminToggleAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_admin }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// Deletes a user profile by ID and invalidates the admin cache.
export function useAdminDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// ─── Listings ─────────────────────────────────────────────────────────────────

// Fetches all listings ordered by most recently created, for the admin listings panel.
export function useAdminListings() {
  return useQuery({
    queryKey: ["admin", "listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Deletes a listing by ID (admin action) and invalidates the admin cache.
export function useAdminDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

// Fetches all orders ordered by most recently created, for the admin orders panel.
export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Updates an order's status by ID (admin action) and invalidates the admin cache.
export function useAdminUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// Bulk-updates status for multiple orders in a single DB call.
// Accepts an array of order IDs and a target status string.
// Used by the bulk-select toolbar in the Orders tab.
export function useAdminBulkUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, status }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// Saves a free-text admin note on an order row (admin_note column).
// Displayed inline in the Disputes tab so admins can record resolution context.
// Requires: ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note text;
export function useAdminUpdateOrderNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, admin_note }) => {
      const { error } = await supabase
        .from("orders")
        .update({ admin_note })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// Bans or unbans a user by toggling the is_banned flag on their profile.
// Requires: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;
// Banned users can still log in — enforce ban checks at the app/RLS level as needed.
export function useAdminBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_banned }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

// Fetches all reviews across every listing, joining the listing title for display.
// Used in the Reviews moderation tab so admins can read and remove any review.
export function useAdminReviews() {
  return useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, listings(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Permanently deletes a review by ID. Invalidates the admin reviews cache.
export function useAdminDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });
}

// ─── Broadcast notification ───────────────────────────────────────────────────

// Sends a notification to every user on the platform in a single batch insert.
// Fetches all profile IDs first, then inserts one notification row per user.
// The notification type is "broadcast" so the frontend can style it distinctly.
export function useAdminBroadcast() {
  return useMutation({
    mutationFn: async ({ title, body }) => {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id");
      if (pErr) throw pErr;
      const rows = profiles.map((p) => ({
        user_id: p.id,
        type: "broadcast",
        title,
        body,
        detail: {},
        read: false,
      }));
      const { error } = await supabase.from("notifications").insert(rows);
      if (error) throw error;
    },
  });
}
