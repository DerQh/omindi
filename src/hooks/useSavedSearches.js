import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches all saved searches for a user.
export function useSavedSearches(user_id) {
  return useQuery({
    queryKey: ["savedSearches", user_id],
    enabled: !!user_id,
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_searches")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Saves a new search for the current user.
export function useSaveSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, label, query, category }) => {
      const { data, error } = await supabase
        .from("saved_searches")
        .insert({ user_id, label: label || query || category || "Search", query: query ?? "", category: category ?? "" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savedSearches", data.user_id] });
    },
  });
}

// Deletes a saved search by ID.
export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, user_id }) => {
      const { error } = await supabase
        .from("saved_searches")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { user_id };
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ["savedSearches", user_id] });
    },
  });
}
