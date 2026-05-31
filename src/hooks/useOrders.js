import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// -- SAVE all ORDERS  for each checkout IN one row ORDERS TABLE
// Inserts a new order row with payment, delivery, and status details for a checkout.
export function useAddOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user_id,
      payment_method,
      delivery_address,
      total_cost,
      mobile_no,
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user_id,
          total_cost,
          payment_method,
          delivery_address,
          status: "pending",
          mobile_no,
        })
        .select();

      if (error) {
        // REMOVE LIKE
        throw error;
      }

      return data;
    },
  });
}

// CHECK IF ORDER EXISTS FOR USER - useQuery
// Fetches all orders for a given user to check if any exist.
export function useOrderCheck({ user_id }) {
  return useQuery({
    // This gives each card its own cache entry, so the query runs independently for each listing and you'll see 10++ logs.
    queryKey: ["cart", user_id, listing_id],
    enabled: !!user_id && !!listing_id,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user_id);
      if (error) throw error;
      return data;
    },
  });
}

// Updates an order's status and upserts the buyer's notification so they see the latest state as unread.
export function useApproveOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ order_id, user_id, status, total, payment }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order_id)
        .select()
        .single();

      if (error) throw error;

      // Upsert the buyer's notification — updates existing row or inserts if first time.
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", user_id)
        .eq("type", "order")
        .contains("detail", { orderId: order_id })
        .maybeSingle();

      const ORDER_TITLES = {
        pending:    "Order Placed",
        confirmed:  "Order Confirmed",
        delivering: "Order Out for Delivery",
        delivered:  "Order Delivered",
        cancelled:  "Order Cancelled",
        shipped:    "Order Shipped",
      };
      const ORDER_BODIES = {
        pending:    "Your order has been placed successfully.",
        confirmed:  "Your order has been confirmed by the seller.",
        delivering: "Your order is on its way. Expected delivery today.",
        delivered:  "Your order has been delivered. Enjoy your purchase!",
        cancelled:  "Your order has been cancelled.",
        shipped:    "Your order has been shipped and is on its way.",
      };

      // Build the notification payload with the correct title and body for this status.
      const notifPayload = {
        title:  ORDER_TITLES[status]  ?? "Order Update",
        body:   ORDER_BODIES[status]  ?? "Your order status has been updated.",
        detail: { orderId: order_id, status, total, payment },
        read:   false, // always reset to unread so the buyer sees the update
      };

      // Update the existing notification row if one exists, otherwise insert a fresh one.
      if (existing) {
        await supabase.from("notifications").update(notifPayload).eq("id", existing.id);
      } else {
        await supabase.from("notifications").insert({ user_id, type: "order", ...notifPayload });
      }

      return data;
    },

    // Invalidate orders and notifications so both lists reflect the latest state.
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.order_id] });
      queryClient.invalidateQueries({ queryKey: ["orders", variables.user_id] });
      queryClient.invalidateQueries({ queryKey: ["notifications", variables.user_id] });
    },
  });
}

//   SAVE ORDERED ITEMS IN ORDERED_ITEMS TABLE
// Inserts a single order item row linking an order to a listing with quantity and price.
export function useAddOrderItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      order_id,
      listing_id,
      quantity,
      price_at_purchase,
    }) => {
      //   seller id should be the same as user_id
      const { data, error } = await supabase
        .from("order_items")
        .insert({
          order_id,
          listing_id,
          quantity,
          price_at_purchase,
        })
        .select();

      if (error) {
        console.log("Insert Order Items Error:", error);
        throw error;
      }
      return data;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.order_id, variables.listing_id],
      });
    },
  });
}

// FETCHES ORDER DETAILS BY ORDER ID , orders table , order_items table , listings table
// Fetches a single order with its items and listing details by order ID.
export function useOrderId(order_id) {
  // console.log(order_id);
  return useQuery({
    queryKey: ["orders", order_id],
    enabled: !!order_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_cost,
          payment_method,
          delivery_address,
          status,
          type,
          created_at,
          order_items ( 
            id,
            quantity,
            price_at_purchase,
            listing_id,
            listings (
              id,
              title,
              image_url,
              unit
            )
          )
        `,
        )
        .eq("id", order_id)
        .single();

      if (error) throw error;

      return data;
    },
  });
}

// FETCHES ORDER DETAILS BY USER ID , orders table , order_items table , listings table
// Fetches all orders for a user with their items and listing details.
export function useOrder(user_id) {
  // console.log(order_id);
  return useQuery({
    queryKey: ["orders", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          total_cost,
          payment_method,
          delivery_address,
          status,
          type,
          created_at,
          order_items ( 
            id,
            quantity,
            price_at_purchase,
            listing_id,
            listings (
              id,
              title,
              image_url,
              unit
            )
          )
        `,
        )
        .eq("user_id", user_id);

      if (error) throw error;

      return data;
    },
  });
}
