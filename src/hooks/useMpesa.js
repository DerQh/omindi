import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Initiates an M-Pesa STK Push for a given order.
// On success, Safaricom sends a push prompt to the customer's phone.
// Payment confirmation arrives via the mpesa-callback Edge Function which
// updates orders.status to "confirmed".
export function useMpesaPay() {
  return useMutation({
    mutationFn: async ({ phone, amount, order_id }) => {
      const { data, error } = await supabase.functions.invoke("mpesa-stk-push", {
        body: { phone, amount, order_id },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data; // { success: true, CheckoutRequestID }
    },
  });
}

// Polls orders table until status changes from "pending" to "confirmed" or "payment_failed".
// Call after useMpesaPay succeeds to know when payment is done.
export function usePollOrderStatus(order_id, { enabled = false, onConfirmed, onFailed } = {}) {
  return useQuery({
    queryKey: ["order-status", order_id],
    enabled: enabled && !!order_id,
    refetchInterval: 3000, // poll every 3 seconds
    refetchIntervalInBackground: false,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("status, mpesa_receipt")
        .eq("id", order_id)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.status === "confirmed") onConfirmed?.(data);
      if (data.status === "payment_failed") onFailed?.(data);
    },
  });
}
