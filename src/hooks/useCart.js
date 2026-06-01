import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// ADD  CART ITEM
// Adds a listing to the user's cart with a quantity of 1 and invalidates the cart cache.
export function useAddItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      const { data, error } = await supabase
        .from("cart")
        .insert({
          user_id: user_id,
          listing_id,
          quantity: 1,
        })
        .select(); // 🔥 THIS IS IMPORTANT FOR DEBUGGING

      if (error) {
        // REMOVE LIKE
        console.log("Insert error:", error);
        throw error;
      }
      return data;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cart", variables.user_id, variables.listing_id],
      });
    },
  });
}

// check if fav exists for a user - useQuery
// Checks whether a specific listing is already in the user's cart, returning a boolean.
export function useCartItemCheck({ user_id, listing_id }) {
  return useQuery({
    // This gives each card its own cache entry, so the query runs independently for each listing and you'll see 10++ logs.
    queryKey: ["cart", user_id, listing_id],
    enabled: !!user_id && !!listing_id,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", user_id)
        .eq("listing_id", listing_id)
        .maybeSingle(); // use maybeSingle instead of single — returns null instead of error
      if (error) throw error;
      // console.log("Fav listings:", !!data);
      return !!data;
    },
  });
}

// DELETE CART ITEM  - useMutation
// Removes a specific listing from the user's cart and refetches the cart cache.
export function useCartItemDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      const { data, error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user_id)
        .eq("listing_id", listing_id);

      if (error) {
        console.log("Delete error:", error);
        throw error;
      }
      // console.log("Delete:", data);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: ["cart", variables.user_id, variables.listing_id], // this should be changed
      });
    },
  });
}

// DELETE ALL CART ITEMS BY USER, AFTER CHECKING OUT   - useMutation
// Deletes all cart items belonging to a user, typically called after a successful checkout.
export function useCartItemsAllDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id }) => {
      const { data, error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user_id);

      if (error) {
        console.log("Delete error:", error);
        throw error;
      }
      // console.log("Delete:", data);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: ["cart", variables.user_id, variables.listing_id], // this should be changed
      });
    },
  });
}

// DELETE CART ITEM  by id  - useMutation
// Deletes a single cart item by its cart row ID and refetches the user's cart.
export function useCartItemDeleteId() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ item_id, user_id }) => {
      const { data, error } = await supabase
        .from("cart")
        .delete()
        .eq("id", item_id);

      if (error) {
        console.log("Delete error:", error);
        throw error;
      }
      // console.log("Delete:", data);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({ queryKey: ["cart", variables.user_id] });
    },
  });
}

// ---UPDATE THE QUANTITY CELL IN CART TABLE
// Increments or decrements a cart item's quantity, deleting the row when quantity reaches zero.
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, listing_id, cart_id, type }) => {
      const { data: cartItem } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user_id)
        .eq("listing_id", listing_id);

      //   console.log(cartItem);
      // only delete if decrementing AND quantity is 1
      if (type === "decrement" && cartItem[0]?.quantity <= 1) {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("id", cart_id);
        if (error) throw error;
        return { deleted: true };
      }

      //   DECREASE ITEM COUNT
      if (type === "decrement") {
        // ---------ADD ITEM COUNT IN CART
        const { data, error } = await supabase
          .from("cart")
          .update({
            quantity: (cartItem[0]?.quantity ?? 1) - 1,
          })
          .eq("user_id", user_id)
          .eq("listing_id", listing_id)
          .select();

        if (error) {
          throw error;
        }
        return data;
      }

      //   INCREASE ITEM NO.
      if (type === "increment") {
        // ---------ADD ITEM COUNT IN CART
        const { data, error } = await supabase
          .from("cart")
          .update({
            quantity: (cartItem[0]?.quantity ?? 1) + 1,
          })
          .eq("user_id", user_id)
          .eq("listing_id", listing_id)
          .select();

        if (error) {
          throw error;
        }
        return data;
      }
    },

    onSuccess: (data, variables) => {
      queryClient.refetchQueries({ queryKey: ["cart", variables.user_id] });
    },
  });
}

// ---- GET ALL ITEMS OF USER IN THE CART

// Fetches all cart items for a user, joined with listing details, ordered by when they were added.
export function useAllCartItems(user_id) {
  return useQuery({
    // This gives each card its own cache entry, so the query runs independently for each listing and you'll see 10++ logs.
    queryKey: ["cart", user_id],
    refetchType: "all",
    // enabled: !!user_id,

    // You need to join the cart table with the listings table. In Supabase you can do this in one query:
    queryFn: async () => {
      // Step 1: fetch cart items with listing data
      const { data, error } = await supabase
        .from("cart")
        .select(`
          id, quantity, listing_id,
          listings ( id, title, price, image_url, unit, seller_id )
        `)
        .eq("user_id", user_id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Step 2: fetch seller profiles for all unique seller_ids in one query
      const sellerIds = [...new Set(
        (data ?? []).map((row) => row.listings?.seller_id).filter(Boolean)
      )];

      let profileMap = {};
      if (sellerIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, farm_name, full_name")
          .in("id", sellerIds);
        profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
      }

      // Step 3: merge profile into each listing
      return (data ?? []).map((row) => ({
        ...row,
        listings: row.listings
          ? { ...row.listings, profiles: profileMap[row.listings.seller_id] ?? null }
          : null,
      }));
    },
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({ queryKey: ["cart", variables.user_id] });
    },
  });
}
