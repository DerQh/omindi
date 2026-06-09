import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CONSUMER_KEY    = Deno.env.get("MPESA_CONSUMER_KEY")!;
const CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET")!;
const SHORTCODE       = Deno.env.get("MPESA_SHORTCODE")!;
const PASSKEY         = Deno.env.get("MPESA_PASSKEY")!;
const DARAJA_BASE     = Deno.env.get("MPESA_ENV") === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function getAccessToken(): Promise<string> {
  const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  const res = await fetch(`${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  const json = await res.json();
  if (!json.access_token) throw new Error("Failed to get M-Pesa access token");
  return json.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { checkout_request_id, order_id } = await req.json();
    if (!checkout_request_id) {
      return new Response(JSON.stringify({ error: "checkout_request_id is required" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = btoa(`${SHORTCODE}${PASSKEY}${timestamp}`);
    const token    = await getAccessToken();

    const res = await fetch(`${DARAJA_BASE}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkout_request_id,
      }),
    });

    const json = await res.json();
    const resultCode = json.ResultCode ?? json.errorCode;

    // ResultCode 0 = success
    if (resultCode === "0" || resultCode === 0) {
      // Update order status in DB so polling detects it
      if (order_id) {
        await supabase
          .from("orders")
          .update({ status: "confirmed", paid_at: new Date().toISOString() })
          .eq("id", order_id);
      }
      return new Response(JSON.stringify({ status: "confirmed" }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // ResultCode 1032 = cancelled, 1037 = timeout
    if (resultCode === "1032" || resultCode === 1032 ||
        resultCode === "1037" || resultCode === 1037) {
      if (order_id) {
        await supabase
          .from("orders")
          .update({ status: "payment_failed" })
          .eq("id", order_id);
      }
      return new Response(JSON.stringify({ status: "failed", reason: json.ResultDesc }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Still pending / processing
    return new Response(JSON.stringify({ status: "pending", raw: json }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mpesa-stk-query error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
