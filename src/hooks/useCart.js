import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// CREATE FAVORITE
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
    //   alert("Item added to your Cart ");
      queryClient.invalidateQueries({
        queryKey: ["cart", variables.user_id, variables.listing_id],
      });
    },
  });
}

// check if fav exists for a user - useQuery
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
  });
}

// ---UPDATE THE QUANTITY CELL IN CART TABLE
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

export function useAllCartItems(user_id) {
  return useQuery({
    // This gives each card its own cache entry, so the query runs independently for each listing and you'll see 10++ logs.
    queryKey: ["cart", user_id],
    refetchType: "all",
    // enabled: !!user_id,

    // You need to join the cart table with the listings table. In Supabase you can do this in one query:
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
      id,
      quantity,
      listing_id,
      listings (
        id,
        title,
        price,
        image_url,
        unit,
        seller_id
      )
    `,
        )
        .eq("user_id", user_id)
        .order("created_at", { ascending: true }); // keeps order stable

      if (error) throw error;
      //   console.log("Cart:", data);

      return data;
    },
  });
}
