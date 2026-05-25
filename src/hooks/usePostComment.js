import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// FETCH ALL COMMENTS FOR A POST
export function useFetchPostComments(post_id) {
  return useQuery({
    queryKey: ["post_comments", post_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", post_id)
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

      // GET PROFILE DATA
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // ✅ IMPORTANT: Make sure ALL required columns are inserted
      // console.log(profileData);
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id,
          author_id: user.id,
          content,
          author: profileData.full_name,
          image_url: profileData.avatar_url,
        })
        .select();

      if (error) {
        console.log("Insert error:", error);
        throw error;
      }

      return data;
    },

    // onSuccess: () => {
    //   console.log("InsertComment  success:", data);
    //   queryClient.invalidateQueries({ queryKey: ["post_comments", post_id] });
    // },
  });
}
