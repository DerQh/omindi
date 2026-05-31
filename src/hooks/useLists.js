import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Uploads an image file to the uploads bucket and inserts a new post row with the file URL and text.
export function useUploadPost() {
  return useMutation({
    mutationKey: ["upload-post"],
    mutationFn: async ({ file, text }) => {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${crypto.randomUUID()}.${ext}`;

      // Upload to public bucket
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Public URL
      const { data } = supabase.storage.from("uploads").getPublicUrl(filePath);
      const imageUrl = data.publicUrl;

      // Insert into table (store both)
      const { data: inserted, error: insertError } = await supabase
        .from("posts")
        .insert({
          text,
          image_path: filePath,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return inserted;
    },
  });
}