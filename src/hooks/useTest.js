import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

export function useTestComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ post_id, content }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // ✅ IMPORTANT: Make sure ALL required columns are inserted
      console.log(user);
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id,
          author_id: user.id,
          content,
          author:
            user?.user_metadata?.full_name || user?.user_metadata?.username,
        })
        .select();

      if (error) {
        console.log("Insert error:", error);
        throw error;
      }

      console.log("InsertComment  success:", data);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post_comments", post_id] });
    },
  });
}

// FETCH ALL COMMENTS FOR A POST
export function useFetchPostComments(postId) {
  return useQuery({
    queryKey: ["post_comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      //   console.log(data);
      return data;
    },
  });
}

//  CREATE A COMMENT
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ post_id, content }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // ✅ IMPORTANT: Make sure ALL required columns are inserted
      console.log(user);
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id,
          author_id: user.id,
          content,
        })
        .select();

      if (error) {
        console.log("Insert error:", error);
        throw error;
      }

      console.log("InsertComment  success:", data);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post_comments"] });
    },
  });
}

// CREATE FAVORITE

export function useCreateFavTEST() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      const { data, error } = await supabase
        .from("listing_favorites")
        .insert({
          user_id: user_id,
          listing_id,
        })
        .select(); // 🔥 THIS IS IMPORTANT FOR DEBUGGING

      if (error) {
        // REMOVE LIKE
        console.log("Insert error:", error);
        throw error;
      }

      // console.log("Favourite success:", data);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing_favorites"] });
    },
  });
}

// check if fav exists for a user - useQuery
export function useFavCheck({ user_id, listing_id }) {
  return useQuery({
    // This gives each card its own cache entry, so the query runs independently for each listing and you'll see 10++ logs.
    queryKey: ["userFavorites", user_id, listing_id],
    enabled: !!user_id && !!listing_id,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("listing_favorites")
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

// DELETE LIKE - useMutation
export function useFavDelete() {
  const queryClient = useQueryClient();
  // console.log(listing_id);
  return useMutation({
    mutationFn: async ({ user_id, listing_id }) => {
      // const { data: existing } = await supabase
      //   .from("listing_favorites")
      //   .select("*")
      //   .eq("user_id", user_id)
      //   .eq("listing_id", listing_id);

      // console.log("exists:", existing);
      const { data, error } = await supabase
        .from("listing_favorites")
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
