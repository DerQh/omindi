import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Daraja credentials (set these in Supabase Dashboard → Edge Functions → Secrets) ───
// MPESA_CONSUMER_KEY    — from Safaricom Daraja portal
// MPESA_CONSUMER_SECRET — from Safaricom Daraja portal
// MPESA_SHORTCODE       — your Paybill or Till number
// MPESA_PASSKEY         — from Safaricom Daraja portal
// MPESA_CALLBACK_URL    — publicly accessible URL e.g. https://yourproject.supabase.co/functions/v1/mpesa-callback

const CONSUMER_KEY    = Deno.env.get("MPESA_CONSUMER_KEY")!;
const CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET")!;
const SHORTCODE       = Deno.env.get("MPESA_SHORTCODE")!;
const PASSKEY         = Deno.env.get("MPESA_PASSKEY")!;
const CALLBACK_URL    = Deno.env.get("MPESA_CALLBACK_URL")!;

// Use sandbox URL for testing, live URL for production:
// Sandbox: https://sandbox.safaricom.co.ke
// Live:    https://api.safaricom.co.ke
const DARAJA_BASE = Deno.env.get("MPESA_ENV") === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

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
    const { phone, amount, order_id } = await req.json();

    if (!phone || !amount || !order_id) {
      return new Response(JSON.stringify({ error: "phone, amount, and order_id are required" }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Normalise phone: 07XXXXXXXX → 2547XXXXXXXX
    const normalised = phone.replace(/^0/, "254").replace(/^\+/, "");

    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);

    const password = btoa(`${SHORTCODE}${PASSKEY}${timestamp}`);
    const token = await getAccessToken();

    const body = {
      BusinessShortCode: SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: normalised,
      PartyB: SHORTCODE,
      PhoneNumber: normalised,
      CallBackURL: CALLBACK_URL,
      AccountReference: `AFARMER-${order_id}`,
      TransactionDesc: `AFARMER order ${order_id}`,
    };

    const stkRes = await fetch(`${DARAJA_BASE}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const stkJson = await stkRes.json();

    if (stkJson.ResponseCode !== "0") {
      return new Response(JSON.stringify({ error: stkJson.errorMessage || "STK push failed", details: stkJson }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true, CheckoutRequestID: stkJson.CheckoutRequestID }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
