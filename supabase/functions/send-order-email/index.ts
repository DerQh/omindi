import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Uses Resend (resend.com) — free tier is 3,000 emails/month.
// Set RESEND_API_KEY in Supabase Dashboard → Edge Functions → Secrets.
// Set SENDER_EMAIL to a verified domain email e.g. orders@afarmer.co.ke

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const REPLY_TO       = "difffred@gmail.com";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { order_id } = await req.json();
    if (!order_id) throw new Error("order_id is required");

    // Fetch order with items
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*, order_items(*, listings(title, price, unit, image_url))")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) throw new Error("Order not found");

    // Get user email from Supabase Auth
    const { data: { user }, error: userErr } = await supabase.auth.admin.getUserById(order.user_id);
    if (userErr || !user?.email) throw new Error("User email not found");

    const itemsHtml = (order.order_items ?? [])
      .map((item: any) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f5f0;font-size:14px;color:#1a3318;">
            ${item.listings?.title ?? "Item"}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f5f0;font-size:14px;color:#7b8f7f;text-align:center;">
            ${item.quantity ?? 1}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f5f0;font-size:14px;color:#2f5a2a;text-align:right;font-weight:700;">
            Kes ${((item.listings?.price ?? 0) * (item.quantity ?? 1)).toLocaleString()}
          </td>
        </tr>
      `)
      .join("");

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(20,57,32,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3d1a,#2f5a2a);padding:32px 40px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;font-weight:900;letter-spacing:-0.5px;">AFARMER™</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Kenya's Farm Marketplace</p>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <h2 style="color:#1a3318;margin:0 0 8px;font-size:20px;font-weight:800;">Order Confirmed ✓</h2>
      <p style="color:#7b8f7f;margin:0 0 24px;font-size:14px;line-height:1.6;">
        Hi there! Your order <strong style="color:#2f5a2a;">#${order_id.slice(0, 8).toUpperCase()}</strong>
        has been received and is being processed.
      </p>

      <!-- Order items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;color:#aabcaa;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:8px;border-bottom:2px solid #f0f5f0;">Item</th>
            <th style="text-align:center;font-size:11px;color:#aabcaa;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:8px;border-bottom:2px solid #f0f5f0;">Qty</th>
            <th style="text-align:right;font-size:11px;color:#aabcaa;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:8px;border-bottom:2px solid #f0f5f0;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="background:#f5f8f5;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#7b8f7f;">Delivery</span>
          <span style="font-size:13px;color:#2f5a2a;font-weight:700;">Free</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="font-size:15px;font-weight:800;color:#1a3318;">Total</span>
          <span style="font-size:15px;font-weight:800;color:#2f5a2a;">Kes ${(order.total_cost ?? 0).toLocaleString()}</span>
        </div>
      </div>

      <!-- Delivery address -->
      ${order.delivery_address ? `
      <div style="margin-bottom:24px;">
        <p style="font-size:11px;color:#aabcaa;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px;">Delivery to</p>
        <p style="font-size:14px;color:#44554c;margin:0;">${order.delivery_address}</p>
      </div>` : ""}

      <!-- CTA -->
      <a href="https://afarmer.co.ke/order/${order_id}"
         style="display:block;text-align:center;background:#2f5a2a;color:white;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;margin-bottom:24px;">
        View Order Status
      </a>

      <p style="font-size:12px;color:#aabcaa;text-align:center;margin:0;line-height:1.6;">
        Questions? Reply to this email or visit
        <a href="https://afarmer.co.ke/contactus" style="color:#2f5a2a;">afarmer.co.ke/contactus</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f5f8f5;padding:20px 40px;text-align:center;border-top:1px solid #e8f0e8;">
      <p style="font-size:11px;color:#aabcaa;margin:0;">
        © ${new Date().getFullYear()} AFARMER™ · Kenya's Farm Marketplace ·
        <a href="https://afarmer.co.ke/privacy-policy" style="color:#aabcaa;">Privacy Policy</a> ·
        <a href="https://afarmer.co.ke/terms" style="color:#aabcaa;">Terms</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AFARMER™ <onboarding@resend.dev>",
        reply_to: REPLY_TO,
        to: [user.email],
        subject: `Order confirmed #${order_id.slice(0, 8).toUpperCase()} — AFARMER™`,
        html: emailHtml,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-order-email error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
