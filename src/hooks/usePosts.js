import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

/* =========================
   ✅ CREATE POST
========================= */

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-post"],

    mutationFn: async ({ title, content, type, image }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;

      if (image) {
        const filePath = `${user.id}/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("post-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      let user_image_url = profileData.avatar_url;

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          title,
          content,
          type,
          image_url: imageUrl,
          author: user.user_metadata?.full_name || "Anonymous",
          user_image_url,
          likes: Math.floor(Math.random() * 14) + 1,
          shares: Math.floor(Math.random() * 14) + 1,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

/* =========================
   ✅ GET ALL POSTS
========================= */

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

// usePosts.js
// export function usePosts() {
//   return useQuery({
//     queryKey: ["posts"],
//     queryFn: async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       // console.log(user);

//       const { data, error } = await supabase
//         .from("posts")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) throw error;

//       console.log(data);

//       return data.map((post) => ({
//         ...post,
//         likes: post.likes[0].count,
//         liked: post.liked_by_me.length > 0, // ✅ true/false per post
//       }));
//     },
//   });
// }

/* =========================
   ✅ GET SINGLE POST
========================= */

export function usePost(id) {
  return useQuery({
    queryKey: ["post", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data;
    },
  });
}

/* =========================
   ✅ GET SINGLE POST LIKE STATUS
========================= */

export function useLikeStatus(postId) {
  return useQuery({
    queryKey: ["like-status", postId],
    enabled: !!postId,
    staleTime: Infinity, // ✅ don't refetch in background, we manage it manually
    queryFn: async () => {
      // get user from auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      return !!data; // Return true if like exists, false otherwise
    },
  });
}

/* =========================
   ✅ TOGGLE LIKE
========================= */

export function useToggleLike(postId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-like", postId],

    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");
      // console.log("Toggling like for postId:", postId, "by user:", user.id);

      const { data: existingLike, error } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (existingLike) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
        // console.log("Unliking postId:", postId, "by user:", user.id);
      }

      if (!existingLike || null) {
        // console.log("Liking postId:", postId, "by user:", user.id);
        const { error } = await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: user.id,
        });

        if (error) throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["like-status", postId] });
    },
  });
}

/* =========================
   ✅ LIKE COUNT (Optimized)
========================= */

export function useLikeCount(postId) {
  return useQuery({
    queryKey: ["like-count", postId],
    enabled: !!postId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      if (error) throw error;

      return count;
    },
  });
}

/* =========================
   ✅ COMMENT COUNT (Optimized)
========================= */

export function useCommentCount(postId) {
  return useQuery({
    queryKey: ["comment-count", postId],
    enabled: !!postId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      if (error) throw error;

      return count;
    },
  });
}

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "../../supabase";

// // ✅ CREATE a new post with optional image upload
// function createPost() {
//   const queryClient = useQueryClient();
//   let imageUrl = null;

//   return useMutation({
//     mutationKey: ["create-post"],
//     mutationFn: async ({ title, content, type, image, author }) => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) throw new Error("Not authenticated");

//       console.log("user:", user?.user_metadata?.full_name);

//       // ✅ Upload image
//       if (image) {
//         const filePath = `${user.id}/${Date.now()}-${image.name}`;

//         const { error: uploadError } = await supabase.storage
//           .from("post-images")
//           .upload(filePath, image);

//         if (uploadError) throw uploadError;

//         const { data } = supabase.storage
//           .from("post-images")
//           .getPublicUrl(filePath);

//         imageUrl = data.publicUrl;
//       }

//       // ✅ IMPORTANT: Make sure ALL required columns are inserted
//       const { data: insertedPost, error } = await supabase
//         .from("posts")
//         .insert({
//           user_id: user.id,
//           title,
//           content,
//           image_url: imageUrl,
//           author: user?.user_metadata?.full_name || "Anonymous",
//           type,
//         })
//         .select(); // 🔥 THIS IS IMPORTANT FOR DEBUGGING

//       if (error) {
//         // console.log("Insert error:", error);
//         throw error;
//       }

//       // console.log("Insert success:", insertedPost);
//       return insertedPost;
//     },

//     onSuccess: () => {
//       // Invalidate and refetch posts after creating a new one
//       queryClient.invalidateQueries(["posts"]);
//     },
//   });
// }

// // ✅ Fetch all posts
// function getPosts() {
//   const queryClient = useQueryClient();

//   return useQuery({
//     queryKey: ["posts"],
//     queryFn: async () => {
//       const { data, error } = await supabase.from("posts").select();
//       if (error) throw error;
//       return data;
//     },
//   });
// }

// // ✅ Fetch a single post by ID
// function getPostById(id) {
//   return useQuery({
//     queryKey: ["post", id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("posts")
//         .select("*")
//         .eq("id", id)
//         .single();
//       if (error) throw error;
//       // console.log("Fetched post:", data);
//       return data;
//     },
//   });
// }

// // ✅ LIKE AND UNLIKE  A POST

// function useToggleLike(postId) {
//   const queryClient = useQueryClient();

//   console.log("useToggleLike called with postId:", postId);
//   return useMutation({
//     mutationKey: ["toggle-like", postId],

//     mutationFn: async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) throw new Error("Not authenticated");

//       // CHECK IF USER HAS ALREADY LIKED THE POST
//       const { data: isLiked, error: fetchError } = await supabase
//         .from("post_likes")
//         .select("*")
//         .eq("post_id", postId)
//         .eq("user_id", user.id)
//         .maybeSingle();

//       if (fetchError) throw fetchError;

//       // Unlike: delete the like record if it exists
//       if (isLiked) {
//         const { error } = await supabase
//           .from("post_likes")
//           .delete()
//           .eq("post_id", postId)
//           .eq("user_id", user.id);
//         if (error) throw error;
//         // Like: insert a new like record
//       } else {
//         const { error } = await supabase.from("post_likes").insert({
//           post_id: postId,
//           user_id: user.id,
//           created_at: new Date().toISOString(),
//         });
//         if (error) throw error;
//       }
//     },
//     onSuccess: () => {
//       // Invalidate and refetch the specific post to update like count and status
//       queryClient.invalidateQueries(["post", postId]);
//     },
//   });
// }

// // ✅ LIKE COUNT FUNCTION - This is a helper function to get the like count for a post. You can use this in your Post component to display the number of likes.

// function getLikeCount(postId) {
//   return useQuery({
//     queryKey: ["like-count", postId],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("post_likes")
//         .select("*", { count: "exact" })
//         .eq("post_id", postId);
//       if (error) throw error;
//       return data.length; // Return the count of likes
//     },
//   });
// }

// // ✅ COMMENT COUNT FUNCTION - This is a helper function to get the comment count for a post. You can use this in your Post component to display the number of comments.
// function getCommentCount(postId) {
//   return useQuery({
//     queryKey: ["comment-count", postId],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("comments")
//         .select("*", { count: "exact" })
//         .eq("post_id", postId);
//       if (error) throw error;
//       return data.length; // Return the count of comments
//     },
//   });
// }

// export {
//   useToggleLike,
//   getLikeCount,
//   getCommentCount,
//   createPost,
//   getPosts,
//   getPostById,
// };
