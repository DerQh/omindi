import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      price,
      location,
      image,
      category,
      minimumOrder,
      unit,
      seller_name,
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;
      console.log("Current user in useCreateListing:", user);

      // ✅ Upload image
      if (image) {
        const filePath = `${user.id}/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // ✅ IMPORTANT: Make sure ALL required columns are inserted
      console.log(user);
      const { data, error } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          title,
          description,
          price: Number(price), // 🔥 force number
          location,
          image_url: imageUrl,
          category,
          minimumOrder,
          unit,
          seller_name:
            user?.user_metadata?.full_name || user?.user_metadata?.username,
        })
        .select(); // 🔥 THIS IS IMPORTANT FOR DEBUGGING

      if (error) {
        console.log("Insert error:", error);
        throw error;
      }

      console.log("Insert success:", data);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
