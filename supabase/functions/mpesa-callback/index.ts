import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  try {
    const payload = await req.json();
    const callback = payload?.Body?.stkCallback;

    if (!callback) {
      return new Response("Invalid payload", { status: 400 });
    }

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callback;

    // Extract order_id from AccountReference (format: AFARMER-<order_id>)
    const metaItems: Record<string, unknown> = {};
    if (CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        metaItems[item.Name] = item.Value;
      }
    }

    // Find the order by CheckoutRequestID stored during STK push
    const { data: order } = await supabase
      .from("orders")
      .select("id, status")
      .eq("mpesa_checkout_id", CheckoutRequestID)
      .single();

    if (!order) {
      console.error("No order found for CheckoutRequestID:", CheckoutRequestID);
      return new Response("Order not found", { status: 404 });
    }

    if (ResultCode === 0) {
      // Payment successful
      await supabase
        .from("orders")
        .update({
          status: "confirmed",
          mpesa_receipt: metaItems["MpesaReceiptNumber"] ?? null,
          paid_at: new Date().toISOString(),
        })
        .eq("id", order.id);
    } else {
      // Payment failed or cancelled
      await supabase
        .from("orders")
        .update({ status: "payment_failed", mpesa_result_desc: ResultDesc })
        .eq("id", order.id);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("M-Pesa callback error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
