import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { use } from "react";
export function useEditProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      farm_name,
      description,
      location,
      location_link,
      image,
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      let imageUrl = null;

      // ✅ Upload image if exists
      if (image) {
        const filePath = `${user.id}/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      console.log("Updating profile with:", {
        userId: user.id,
        farm_name,
        description,
        location,
        location_link,
        imageUrl,
      });

      // ✅ Update instead of insert
      const { data, error } = await supabase
        .from("profiles")
        .update({
          farm_name,
          description,
          location,
          location_link,
          ...(imageUrl && { avatar_url: imageUrl }),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
}
