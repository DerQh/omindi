import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// ─── Stats ────────────────────────────────────────────────────────────────────

// Fetches aggregate platform stats: total users, listings, orders, revenue, pending, and disputed order counts.
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [usersRes, listingsRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("listings").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_cost, created_at, status"),
      ]);
      const orders = ordersRes.data ?? [];
      return {
        userCount:     usersRes.count    ?? 0,
        listingCount:  listingsRes.count ?? 0,
        orderCount:    orders.length,
        totalRevenue:  orders.reduce((s, o) => s + (o.total_cost || 0), 0),
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        disputedOrders: orders.filter((o) => o.status === "disputed").length,
        ordersRaw:     orders,
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
