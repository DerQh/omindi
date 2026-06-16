-- ═══════════════════════════════════════════════════════════════════════════
-- AFARMER™ — Complete Database Schema
-- Run this in your Supabase Dashboard → SQL Editor
-- Safe to re-run on an existing DB (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES
-- Auto-created by Supabase Auth trigger; we extend it here.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        text,
  farm_name        text,
  avatar_url       text,
  description      text,
  location         text,
  location_link    text,
  is_admin         boolean      NOT NULL DEFAULT false,
  is_banned        boolean      NOT NULL DEFAULT false,
  -- holiday mode
  on_holiday       boolean      NOT NULL DEFAULT false,
  holiday_until    date,
  holiday_message  text,
  -- referral & loyalty
  referral_code    text UNIQUE,
  referred_by      text,
  loyalty_points   integer      NOT NULL DEFAULT 0,
  created_at       timestamptz  NOT NULL DEFAULT now(),
  updated_at       timestamptz  NOT NULL DEFAULT now()
);

-- Back-fill referral codes for any profiles that don't have one yet
UPDATE public.profiles
SET referral_code = upper(substring(md5(id::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_all"   ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"   ON public.profiles;
CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. LISTINGS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.listings (
  id               uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id        uuid         REFERENCES public.profiles(id) ON DELETE CASCADE,
  title            text         NOT NULL,
  description      text,
  price            numeric      NOT NULL,
  unit             text,
  minimum_order    integer      DEFAULT 1,
  location         text,
  image_url        text,
  category         text,
  phone            text,
  available        boolean      NOT NULL DEFAULT true,
  approved         boolean      NOT NULL DEFAULT false,
  seller_name      text,
  seller_image_url text,
  favourites       integer      NOT NULL DEFAULT 0,
  inquiries        integer      NOT NULL DEFAULT 0,
  badges           text[]       NOT NULL DEFAULT '{}',
  price_tiers      jsonb        NOT NULL DEFAULT '[]',
  created_at       timestamptz  NOT NULL DEFAULT now()
);

-- Legacy column alias used by older code
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS "minimumOrder" integer;

CREATE INDEX IF NOT EXISTS listings_seller_idx    ON public.listings (seller_id);
CREATE INDEX IF NOT EXISTS listings_category_idx  ON public.listings (category);
CREATE INDEX IF NOT EXISTS listings_approved_idx  ON public.listings (approved);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "listings_select_approved"  ON public.listings;
DROP POLICY IF EXISTS "listings_insert_own"       ON public.listings;
DROP POLICY IF EXISTS "listings_update_own"       ON public.listings;
DROP POLICY IF EXISTS "listings_delete_own"       ON public.listings;
CREATE POLICY "listings_select_approved" ON public.listings FOR SELECT
  USING (approved = true OR auth.uid() = seller_id);
CREATE POLICY "listings_insert_own"      ON public.listings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_update_own"      ON public.listings FOR UPDATE TO authenticated
  USING (auth.uid() = seller_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));
CREATE POLICY "listings_delete_own"      ON public.listings FOR DELETE TO authenticated
  USING (auth.uid() = seller_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- Full-text search function referenced by useSearchListings
CREATE OR REPLACE FUNCTION public.search_listings(search_query text)
RETURNS SETOF public.listings LANGUAGE sql STABLE AS $$
  SELECT * FROM public.listings
  WHERE to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(category,'') || ' ' || coalesce(location,''))
        @@ plainto_tsquery('english', search_query)
  ORDER BY created_at DESC;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. ORDERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               uuid         DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid         REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_cost       numeric      NOT NULL DEFAULT 0,
  payment_method   text,
  delivery_address text,
  mobile_no        text,
  status           text         NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','confirmed','delivering','delivered','cancelled','shipped','disputed')),
  type             text,
  admin_note       text,
  -- M-Pesa fields
  mpesa_checkout_id text,
  mpesa_receipt     text,
  mpesa_result_desc text,
  paid_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_idx    ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx  ON public.orders (status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "orders_select_own"   ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own"   ON public.orders;
DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
CREATE POLICY "orders_select_own"   ON public.orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));
CREATE POLICY "orders_insert_own"   ON public.orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin" ON public.orders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ORDER ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                uuid     DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id          uuid     NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  listing_id        uuid     REFERENCES public.listings(id) ON DELETE SET NULL,
  quantity          integer  NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_at_purchase numeric  NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_idx   ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_listing_idx ON public.order_items (listing_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "order_items_select_own" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid()));

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CART
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cart (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid        REFERENCES public.listings(id) ON DELETE CASCADE,
  quantity   integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);

ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "cart_own" ON public.cart;
CREATE POLICY "cart_own" ON public.cart
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. TRANSACTIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_id       uuid        REFERENCES public.orders(id)   ON DELETE SET NULL,
  payment_method text        NOT NULL,
  amount         numeric     NOT NULL,
  phone          text,
  status         text        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','approved','failed')),
  reference      text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_user_idx  ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS transactions_order_idx ON public.transactions (order_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "transactions_own" ON public.transactions;
CREATE POLICY "transactions_own" ON public.transactions
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. REVIEWS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id   uuid        REFERENCES public.listings(id) ON DELETE CASCADE,
  shop_item_id text,
  seller_id    uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      text,
  image_url    text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS reviews_reviewer_listing_uniq
  ON public.reviews (reviewer_id, listing_id)
  WHERE listing_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_reviewer_shop_item_uniq
  ON public.reviews (reviewer_id, shop_item_id)
  WHERE shop_item_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS reviews_seller_idx ON public.reviews (seller_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reviews_select_all"  ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_own"  ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_own"  ON public.reviews;
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = reviewer_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       text        NOT NULL
             CHECK (type IN ('order','follow','favorite','inquiry','system','broadcast')),
  title      text        NOT NULL,
  body       text,
  detail     jsonb       NOT NULL DEFAULT '{}',
  read       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_idx  ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx  ON public.notifications (user_id, read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
CREATE POLICY "notifications_own" ON public.notifications
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. FOLLOWS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.follows (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS follows_follower_idx  ON public.follows (follower_id);
CREATE INDEX IF NOT EXISTS follows_following_idx ON public.follows (following_id);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "follows_select_all" ON public.follows;
DROP POLICY IF EXISTS "follows_own"        ON public.follows;
CREATE POLICY "follows_select_all" ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_own"        ON public.follows FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = follower_id);
-- DELETE: users can only unfollow themselves
DROP POLICY IF EXISTS "follows_delete_own" ON public.follows;
CREATE POLICY "follows_delete_own" ON public.follows FOR DELETE TO authenticated
  USING (auth.uid() = follower_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. LISTING FAVORITES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.listing_favorites (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id uuid        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);

ALTER TABLE public.listing_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "listing_favorites_own" ON public.listing_favorites;
CREATE POLICY "listing_favorites_own" ON public.listing_favorites
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. CONVERSATIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversations (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id   uuid        REFERENCES public.listings(id) ON DELETE SET NULL,
  unread_count integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS conversations_buyer_idx  ON public.conversations (buyer_id);
CREATE INDEX IF NOT EXISTS conversations_seller_idx ON public.conversations (seller_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conversations_participant" ON public.conversations;
CREATE POLICY "conversations_participant" ON public.conversations
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         text        NOT NULL,
  read            boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation_idx ON public.messages (conversation_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "messages_participant" ON public.messages;
CREATE POLICY "messages_participant" ON public.messages
  USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id
      AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  ))
  WITH CHECK (auth.uid() = sender_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. POSTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid        REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         text        NOT NULL,
  content       text,
  type          text,
  image_url     text,
  author        text,
  user_image_url text,
  likes         integer     NOT NULL DEFAULT 0,
  shares        integer     NOT NULL DEFAULT 0,
  approved      boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_user_idx     ON public.posts (user_id);
CREATE INDEX IF NOT EXISTS posts_approved_idx ON public.posts (approved);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "posts_select_approved" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_own"      ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own"      ON public.posts;
CREATE POLICY "posts_select_approved" ON public.posts FOR SELECT
  USING (approved = true OR auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- 14. POST COMMENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_comments (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id  uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  content    text        NOT NULL,
  author     text,
  image_url  text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS post_comments_post_idx ON public.post_comments (post_id);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "post_comments_select_all" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_insert_own" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_delete_own" ON public.post_comments;
CREATE POLICY "post_comments_select_all" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "post_comments_insert_own" ON public.post_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "post_comments_delete_own" ON public.post_comments FOR DELETE TO authenticated
  USING (auth.uid() = author_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 15. COMMENTS (legacy — comment counts used by usePosts)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_select_all" ON public.comments;
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 16. POST LIKES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_likes (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    uuid        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "post_likes_select_all" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_own"        ON public.post_likes;
CREATE POLICY "post_likes_select_all" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes_own"        ON public.post_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "post_likes_delete_own" ON public.post_likes;
CREATE POLICY "post_likes_delete_own" ON public.post_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 17. SHOP PRODUCTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shop_products (
  id          bigserial   PRIMARY KEY,
  name        text        NOT NULL,
  price       integer     NOT NULL,
  category    text        NOT NULL,
  badge       text,
  description text,
  image_url   text,
  stock       integer     NOT NULL DEFAULT 0,
  sku         text,
  rating      numeric     NOT NULL DEFAULT 0,
  reviews     integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "shop_products_select_all"   ON public.shop_products;
DROP POLICY IF EXISTS "shop_products_admin_write"  ON public.shop_products;
CREATE POLICY "shop_products_select_all"  ON public.shop_products FOR SELECT USING (true);
CREATE POLICY "shop_products_admin_write" ON public.shop_products FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- ─────────────────────────────────────────────────────────────────────────────
-- 18. USER RATINGS (peer-to-peer seller rating, separate from listing reviews)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id             uuid     DEFAULT gen_random_uuid() PRIMARY KEY,
  rater_id       uuid     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rated_user_id  uuid     NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating         smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (rater_id, rated_user_id)
);

ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_ratings_select_all" ON public.user_ratings;
DROP POLICY IF EXISTS "user_ratings_own"        ON public.user_ratings;
CREATE POLICY "user_ratings_select_all" ON public.user_ratings FOR SELECT USING (true);
CREATE POLICY "user_ratings_own"        ON public.user_ratings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = rater_id);
DROP POLICY IF EXISTS "user_ratings_update_own" ON public.user_ratings;
CREATE POLICY "user_ratings_update_own" ON public.user_ratings FOR UPDATE TO authenticated
  USING (auth.uid() = rater_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 19. LISTING WAITLIST
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.listing_waitlist (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  notified   boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (listing_id, user_id)
);

ALTER TABLE public.listing_waitlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waitlist_own" ON public.listing_waitlist;
CREATE POLICY "waitlist_own" ON public.listing_waitlist
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 20. SAVED SEARCHES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label      text        NOT NULL,
  query      text        NOT NULL DEFAULT '',
  category   text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_searches_own" ON public.saved_searches;
CREATE POLICY "saved_searches_own" ON public.saved_searches
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 21. REFERRALS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id  uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  referred_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rewarded     boolean     NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referred_id)
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "referrals_own" ON public.referrals;
CREATE POLICY "referrals_own" ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 22. RECURRING ORDERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.recurring_orders (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id       uuid        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  quantity         integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  frequency        text        NOT NULL DEFAULT 'weekly'
                               CHECK (frequency IN ('weekly','biweekly','monthly')),
  delivery_address text,
  mobile_no        text,
  next_order_date  date        NOT NULL,
  active           boolean     NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recurring_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "recurring_orders_own" ON public.recurring_orders;
CREATE POLICY "recurring_orders_own" ON public.recurring_orders
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 23. LOYALTY EVENTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.loyalty_events (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points     integer     NOT NULL,
  reason     text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "loyalty_events_own" ON public.loyalty_events;
CREATE POLICY "loyalty_events_own" ON public.loyalty_events FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 24. WHOLESALE INQUIRIES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wholesale_inquiries (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name  text,
  last_name   text,
  email       text,
  institution text,
  interest    text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.wholesale_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "wholesale_inquiries_insert" ON public.wholesale_inquiries;
CREATE POLICY "wholesale_inquiries_insert" ON public.wholesale_inquiries FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 25. NEWSLETTER SUBSCRIBERS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      text        NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "newsletter_insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_insert" ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC HELPER FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- Atomically increment listings.favourites (called when a user favorites a listing)
CREATE OR REPLACE FUNCTION public.increment_favourites_count(listing_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE public.listings SET favourites = favourites + 1 WHERE id = listing_id;
$$;

-- Atomically decrement listings.favourites (never below 0)
CREATE OR REPLACE FUNCTION public.decrement_favourites_count(listing_id uuid)
RETURNS void LANGUAGE sql AS $$
  UPDATE public.listings SET favourites = GREATEST(favourites - 1, 0) WHERE id = listing_id;
$$;

-- Atomically add loyalty points to a profile
CREATE OR REPLACE FUNCTION public.increment_loyalty_points(uid uuid, amount integer)
RETURNS void LANGUAGE sql AS $$
  UPDATE public.profiles SET loyalty_points = loyalty_points + amount WHERE id = uid;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (run once; safe to skip if already exists)
-- ─────────────────────────────────────────────────────────────────────────────
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('avatars',        'avatars',        true),
--   ('listing-images', 'listing-images', true),
--   ('post-images',    'post-images',    true),
--   ('shop-products',  'shop-products',  true)
-- ON CONFLICT (id) DO NOTHING;
