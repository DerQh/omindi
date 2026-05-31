import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Uploads a new avatar if provided, then updates the profile row with all supplied fields.
// Keeps the existing avatar_url unchanged when no new image file is selected.
export function useEditProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      farm_name,
      description,
      location,
      location_link,
      image,
      existingAvatarUrl,
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // Use the existing URL as default — only overwrite it if a new file was selected.
      let avatarUrl = existingAvatarUrl ?? null;

      if (image) {
        const filePath = `${user.id}/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          farm_name,
          description,
          location,
          location_link,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    // Invalidate the profile cache so Profile.jsx re-fetches the updated data.
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
    },
  });
}
