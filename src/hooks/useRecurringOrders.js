import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Fetches all recurring orders for the current user.
export function useRecurringOrders(user_id) {
  return useQuery({
    queryKey: ["recurringOrders", user_id],
    enabled: !!user_id,
    staleTime: 60000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_orders")
        .select("*, listings(id, title, image_url, price, unit, available, seller_name)")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Creates a new recurring order.
export function useCreateRecurringOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, listing_id, quantity, frequency, delivery_address, mobile_no }) => {
      const today = new Date();
      const next = new Date(today);
      if (frequency === "weekly")    next.setDate(today.getDate() + 7);
      if (frequency === "biweekly")  next.setDate(today.getDate() + 14);
      if (frequency === "monthly")   next.setMonth(today.getMonth() + 1);

      const { data, error } = await supabase
        .from("recurring_orders")
        .insert({
          user_id,
          listing_id,
          quantity,
          frequency,
          delivery_address,
          mobile_no,
          next_order_date: next.toISOString().split("T")[0],
          active: true,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ["recurringOrders", user_id] });
    },
  });
}

// Toggles a recurring order active/paused.
export function useToggleRecurringOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active, user_id }) => {
      const { error } = await supabase
        .from("recurring_orders")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
      return { user_id };
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ["recurringOrders", user_id] });
    },
  });
}

// Deletes a recurring order.
export function useDeleteRecurringOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, user_id }) => {
      const { error } = await supabase
        .from("recurring_orders")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { user_id };
    },
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ["recurringOrders", user_id] });
    },
  });
}
