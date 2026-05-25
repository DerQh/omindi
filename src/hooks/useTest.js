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
