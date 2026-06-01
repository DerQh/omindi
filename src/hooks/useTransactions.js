import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// ─── Create ───────────────────────────────────────────────────────────────────

// Inserts a new transaction row with status "pending".
// Called immediately when the user clicks Pay — before the fake simulation starts.
export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, order_id, payment_method, amount, phone }) => {
      // Generate a reference number.
      // M-Pesa: last 4 digits of the phone number (mirrors real STK push behaviour).
      const phoneLast4 = (phone ?? "").replace(/\D/g, "").slice(-4);
      const reference =
        payment_method === "mpesa"
          ? `MPE${phoneLast4}${Date.now().toString().slice(-4)}`
          : payment_method === "card"
          ? `CRD${Date.now().toString().slice(-8)}`
          : `COD${Date.now().toString().slice(-8)}`;

      const { data, error } = await supabase
        .from("transactions")
        .insert({ user_id, order_id, payment_method, amount, phone, status: "pending", reference })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// ─── Approve (fake) ───────────────────────────────────────────────────────────

// Sets a transaction's status to "approved".
// Called at the end of the fake simulation — replaces a real payment gateway callback.
// When Daraja is wired up, this will be called from the webhook instead.
export function useApproveTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("transactions")
        .update({ status: "approved", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// ─── Fail ─────────────────────────────────────────────────────────────────────

// Marks a transaction as "failed" — used if the user cancels or payment times out.
export function useFailTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("transactions")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// ─── Read ─────────────────────────────────────────────────────────────────────

// Fetches all transactions for the current user, most recent first.
export function useUserTransactions(user_id) {
  return useQuery({
    queryKey: ["transactions", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
