import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// FETCH ALL COMMENTS FOR A POST
export function useFetchComments(postId) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

//  CREATE A COMMENT
export function useCreateComment() {
  // ✅ no params here
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ post_id, content }) => {
      // ✅ one object, destructured
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log(user);
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          author_id: user.id,
          content,
          post_id,
          author: user.user_metadata?.full_name || "Anonymous",
        })
        .select();

      if (error) throw error;
      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post_comments", variables.post_id],
      });
    },
  });
}
