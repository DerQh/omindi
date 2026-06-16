-- ═══════════════════════════════════════════════════════════════════════════
-- AFARMER™ — Feature Additions Migration
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 1. Profiles: holiday mode ───────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS on_holiday       boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS holiday_until    date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS holiday_message  text;

-- ─── 2. Profiles: referral + loyalty ─────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code    text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by      text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_points   integer DEFAULT 0;

-- Auto-generate a unique 8-char referral code for every profile that lacks one
UPDATE profiles
SET referral_code = upper(substring(md5(id::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- ─── 3. Listings: quality badges + price tiers ───────────────────────────────
ALTER TABLE listings ADD COLUMN IF NOT EXISTS badges       text[]  DEFAULT '{}';
ALTER TABLE listings ADD COLUMN IF NOT EXISTS price_tiers  jsonb   DEFAULT '[]';
-- price_tiers shape: [{ min_qty: 10, price: 70 }, { min_qty: 50, price: 55 }]

-- ─── 4. Reviews: optional photo ──────────────────────────────────────────────
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS image_url text;

-- ─── 5. Listing waitlist ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_waitlist (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id  uuid        REFERENCES listings(id)    ON DELETE CASCADE NOT NULL,
  user_id     uuid        REFERENCES auth.users(id)  ON DELETE CASCADE NOT NULL,
  notified    boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (listing_id, user_id)
);
ALTER TABLE listing_waitlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waitlist_own" ON listing_waitlist;
CREATE POLICY "waitlist_own" ON listing_waitlist
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 6. Saved searches ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_searches (
  id        uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label     text        NOT NULL,
  query     text        DEFAULT '',
  category  text        DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_searches_own" ON saved_searches;
CREATE POLICY "saved_searches_own" ON saved_searches
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 7. Referrals ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_id  uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rewarded     boolean     DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (referred_id)
);

-- ─── 8. Recurring orders ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recurring_orders (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid        REFERENCES auth.users(id)  ON DELETE CASCADE NOT NULL,
  listing_id       uuid        REFERENCES listings(id)    ON DELETE CASCADE NOT NULL,
  quantity         integer     DEFAULT 1 CHECK (quantity > 0),
  frequency        text        DEFAULT 'weekly'
                               CHECK (frequency IN ('weekly','biweekly','monthly')),
  delivery_address text,
  mobile_no        text,
  next_order_date  date        NOT NULL,
  active           boolean     DEFAULT true,
  created_at       timestamptz DEFAULT now()
);
ALTER TABLE recurring_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recurring_orders_own" ON recurring_orders;
CREATE POLICY "recurring_orders_own" ON recurring_orders
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── 9. Loyalty events log (optional audit trail) ────────────────────────────
CREATE TABLE IF NOT EXISTS loyalty_events (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points      integer     NOT NULL,
  reason      text        NOT NULL,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE loyalty_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "loyalty_events_own" ON loyalty_events;
CREATE POLICY "loyalty_events_own" ON loyalty_events
  USING (auth.uid() = user_id);

-- ─── 10. Grant service-role access for loyalty/referral reward triggers ──────
-- (Set up in Supabase Edge Functions or DB triggers as needed)
