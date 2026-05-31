import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// --- fetch seller's listings
// Fetches all listings belonging to the given seller, ordered by most recently created.
export function useSellerListings(seller_id) {
  return useQuery({
    queryKey: ["sellerListings", seller_id],
    enabled: !!seller_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", seller_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// --- fetch orders received by seller (via listings)
// Fetches all order items for listings owned by the seller, with full order and listing details.
export function useSellerOrders(seller_id) {
  return useQuery({
    queryKey: ["sellerOrders", seller_id],
    enabled: !!seller_id,
    queryFn: async () => {
      // get all listing ids owned by this seller
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("id")
        .eq("seller_id", seller_id);

      if (listingsError) throw listingsError;

      const listing_ids = listings.map((l) => l.id);
      if (listing_ids.length === 0) return [];

      // get order_items that reference these listings, with full order + listing info
      const { data, error } = await supabase
        .from("order_items")
        .select(
          `
          id,
          quantity,
          price_at_purchase,
          listing_id,
          listings ( id, title, image_url, unit ),
          order_id,
          orders (
            id,
            user_id,
            total_cost,
            payment_method,
            delivery_address,
            mobile_no,
            status,
            created_at
          )
        `,
        )
        .in("listing_id", listing_ids)
        .order("created_at", { ascending: false, foreignTable: "orders" });

      if (error) throw error;
      return data;
    },
  });
}

// --- update order status
// Updates an order's status by ID and invalidates the seller orders cache.
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ order_id, status }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order_id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
    },
  });
}

// --- delete listing
// Deletes a listing by ID and invalidates the seller's listings cache.
export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listing_id) => {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerListings"] });
    },
  });
}

// Toggles a listing's availability between available and out of stock.
export function useToggleAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ listing_id, available }) => {
      const { error } = await supabase
        .from("listings")
        .update({ available })
        .eq("id", listing_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerListings"] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

// --- dashboard stats
// Calculates seller dashboard stats including revenue, order counts, today's activity, and top listings.
export function useDashboardStats(seller_id) {
  return useQuery({
    queryKey: ["dashboardStats", seller_id],
    enabled: !!seller_id,
    queryFn: async () => {
      const { data: listings } = await supabase
        .from("listings")
        .select("id")
        .eq("seller_id", seller_id);

      const listing_ids = listings?.map((l) => l.id) ?? [];

      if (listing_ids.length === 0) {
        return {
          totalListings: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
        };
      }

      const { data: orderItems } = await supabase
        .from("order_items")
        .select(
          `quantity, price_at_purchase, listing_id, orders ( id, status, total_cost, created_at )`,
        )
        .in("listing_id", listing_ids);

      const totalRevenue =
        orderItems?.reduce(
          (sum, item) => sum + item.price_at_purchase * item.quantity,
          0,
        ) ?? 0;

      const uniqueOrderIds = new Set(
        orderItems?.map((i) => i.orders?.id).filter(Boolean),
      );
      const totalOrders = uniqueOrderIds.size;
      const pendingOrders =
        orderItems?.filter((i) => i.orders?.status === "pending").length ?? 0;

      // Average value per unique order.
      const avgOrderValue =
        totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // Total units sold across all order items.
      const totalItemsSold =
        orderItems?.reduce((sum, i) => sum + (i.quantity || 0), 0) ?? 0;

      // Orders and revenue created today.
      const todayStr = new Date().toDateString();
      const todayItems =
        orderItems?.filter(
          (i) =>
            i.orders?.created_at &&
            new Date(i.orders.created_at).toDateString() === todayStr,
        ) ?? [];
      const todayOrders = new Set(
        todayItems.map((i) => i.orders?.id).filter(Boolean),
      ).size;
      const todayRevenue = todayItems.reduce(
        (sum, i) => sum + i.price_at_purchase * i.quantity,
        0,
      );

      // Orders per listing — used to rank top listings by demand.
      const ordersPerListing = {};
      orderItems?.forEach((i) => {
        if (i.listing_id)
          ordersPerListing[i.listing_id] =
            (ordersPerListing[i.listing_id] || 0) + 1;
      });

      return {
        totalListings: listing_ids.length,
        totalOrders,
        totalRevenue,
        pendingOrders,
        avgOrderValue,
        totalItemsSold,
        todayOrders,
        todayRevenue,
        ordersPerListing,
        ordersRaw: orderItems,
      };
    },
  });
}
