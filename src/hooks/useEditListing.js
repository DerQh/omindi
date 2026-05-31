import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches a single listing by ID to pre-populate the edit form.
export function useListing(id) {
  return useQuery({
    queryKey: ["listing", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

// Updates an existing listing's fields. If a new image file is provided it uploads
// it to storage and replaces the image_url, otherwise the existing URL is kept.
export function useEditListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      listingId,
      title,
      description,
      price,
      minimumOrder,
      location,
      category,
      unit,
      phone,
      image,
      existingImageUrl,
      available = true,
    }) => {
      let imageUrl = existingImageUrl;

      // Upload a new image only when the user has selected a new file.
      if (image) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const filePath = `${user.id}/${Date.now()}-${image.name}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      // Apply all field changes to the listing row.
      const { data, error } = await supabase
        .from("listings")
        .update({
          title,
          description,
          price: Number(price),
          location,
          image_url: imageUrl,
          category,
          minimumOrder,
          unit,
          phone: phone || null,
          available,
        })
        .eq("id", listingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // Invalidate both the single listing and the user's listing list so everything reflects the update.
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["listing", data.id] });
      queryClient.invalidateQueries({ queryKey: ["listing", data.seller_id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}
