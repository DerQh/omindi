import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// -- SAVE all ORDERS  for each checkout IN one row ORDERS TABLE
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

// ORDER APPROVAL BY SELLER
export function useApproveOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, seller_id }) => {
      //   seller id should be the same as user_id
      const { data, error } = await supabase
        .from("orders")
        .update({
          status: "shipped",
        })
        .select();

      if (error) {
        console.log("Insert Order Error:", error);
        throw error;
      }
      return data;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.user_id, variables.total_cost],
      });
    },
  });
}

//   SAVE ORDERED ITEMS IN ORDERED_ITEMS TABLE
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
