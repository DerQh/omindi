-- Run this in Supabase Dashboard → SQL Editor
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mpesa_checkout_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mpesa_receipt      text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at            timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS mpesa_result_desc  text;
