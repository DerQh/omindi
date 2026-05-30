// ─── Supabase setup required ──────────────────────────────────────────────────
//
// Run this SQL in your Supabase SQL editor before using these hooks:
//
//   -- 1. Add is_admin flag to profiles
//   ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
//
//   -- 2. Create the shop_products table
//   CREATE TABLE IF NOT EXISTS shop_products (
//     id          BIGSERIAL PRIMARY KEY,
//     name        TEXT NOT NULL,
//     price       INTEGER NOT NULL,
//     category    TEXT NOT NULL,
//     badge       TEXT,
//     description TEXT,
//     image_url   TEXT,
//     stock       INTEGER DEFAULT 0,
//     sku         TEXT,
//     rating      NUMERIC DEFAULT 0,
//     reviews     INTEGER DEFAULT 0,
//     created_at  TIMESTAMPTZ DEFAULT NOW()
//   );
//
//   -- 3. Grant admin to a user (replace the UUID with the user's ID)
//   UPDATE profiles SET is_admin = true WHERE id = '<user-uuid>';
//
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Check if the logged-in user is an admin via the profiles table
export function useIsAdmin(userId) {
  return useQuery({
    queryKey: ["is_admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();

      if (error) return false;
      return data?.is_admin === true;
    },
  });
}

// Fetch all shop products stored in Supabase (admin-added items)
export function useShopItems() {
  return useQuery({
    queryKey: ["shop_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });
}

// Add a new shop product — uploads image to the shop-products storage bucket
export function useAddShopItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, price, category, badge, description, stock, sku, image }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;

      if (image) {
        const filePath = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("shop-products")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("shop-products")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("shop_products")
        .insert({
          name,
          price: Number(price),
          category,
          badge: badge || null,
          description,
          stock: Number(stock),
          sku,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop_products"] });
    },
  });
}

// Delete a shop product by ID (admin only)
export function useDeleteShopItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("shop_products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop_products"] });
    },
  });
}
