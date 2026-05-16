import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";

export function useDeleteListing(id) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ id }) => {
      const { data, error } = await supabase
        .from("listings")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      navigate("/list");
    },
  });
}
