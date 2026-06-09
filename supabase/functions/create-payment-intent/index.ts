import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY secret is not set");

    const { amount, currency = "kes" } = await req.json();
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "A positive amount is required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const body = new URLSearchParams({
      amount: String(Math.ceil(amount * 100)),
      currency,
      "payment_method_types[]": "card",
    });

    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("Stripe error:", json.error);
      return new Response(
        JSON.stringify({ error: json.error?.message || "Stripe API error" }),
        { headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ clientSecret: json.client_secret }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-payment-intent error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
