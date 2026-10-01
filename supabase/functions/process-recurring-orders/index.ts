import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fulfills supabase/flows.md section 12 (Recurring Orders).
// Triggered externally by cron-job.org on a daily schedule (not Supabase's
// own pg_cron, which has had reliability issues on this project) —
// GET or POST https://<project>.functions.supabase.co/process-recurring-orders
// with header "x-cron-secret: <CRON_SECRET>".
// Set CRON_SECRET in Supabase Dashboard → Edge Functions → Secrets, and give
// cron-job.org the same value as a custom header.

const CRON_SECRET = Deno.env.get("CRON_SECRET")!;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

function advanceDate(date: Date, frequency: string): Date {
  const next = new Date(date);
  if (frequency === "weekly") next.setDate(next.getDate() + 7);
  else if (frequency === "biweekly") next.setDate(next.getDate() + 14);
  else next.setMonth(next.getMonth() + 1); // monthly
  return next;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  if (req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const results = { processed: 0, skipped: 0, errors: [] as string[] };

  try {
    const { data: due, error: dueErr } = await supabase
      .from("recurring_orders")
      .select("*, listings(price, available, approved, title)")
      .eq("active", true)
      .lte("next_order_date", today);

    if (dueErr) throw dueErr;

    for (const ro of due ?? []) {
      try {
        const listing = ro.listings;
        if (!listing || !listing.available || !listing.approved) {
          results.skipped++;
          continue;
        }

        const totalCost = listing.price * ro.quantity;

        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert({
            user_id: ro.user_id,
            total_cost: totalCost,
            payment_method: "recurring",
            delivery_address: ro.delivery_address,
            mobile_no: ro.mobile_no,
            status: "pending",
            type: "recurring",
          })
          .select()
          .single();
        if (orderErr) throw orderErr;

        const { error: itemErr } = await supabase.from("order_items").insert({
          order_id: order.id,
          listing_id: ro.listing_id,
          quantity: ro.quantity,
          price_at_purchase: listing.price,
        });
        if (itemErr) throw itemErr;

        const nextDate = advanceDate(new Date(ro.next_order_date), ro.frequency)
          .toISOString()
          .slice(0, 10);
        const { error: updateErr } = await supabase
          .from("recurring_orders")
          .update({ next_order_date: nextDate })
          .eq("id", ro.id);
        if (updateErr) throw updateErr;

        await supabase.from("notifications").insert({
          user_id: ro.user_id,
          type: "order",
          title: "Recurring order placed",
          body: `Your subscription for ${listing.title} has been auto-ordered.`,
          detail: { order_id: order.id },
        });

        results.processed++;
      } catch (rowErr) {
        results.errors.push(`recurring_order ${ro.id}: ${rowErr.message}`);
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("process-recurring-orders error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
