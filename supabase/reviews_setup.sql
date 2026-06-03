-- ─────────────────────────────────────────────────────────────────────────────
-- Reviews table setup
-- Run this in your Supabase dashboard → SQL Editor
-- Safe to run on a fresh DB or an existing one (uses IF NOT EXISTS / IF NOT EXISTS guards)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create the table (no-op if it already exists)
CREATE TABLE IF NOT EXISTS public.reviews (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id   uuid REFERENCES public.listings(id) ON DELETE CASCADE,
  shop_item_id text,
  seller_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating       smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. Add shop_item_id if the table existed before without it
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS shop_item_id text;

-- 3. Unique partial indexes — one review per user per target
CREATE UNIQUE INDEX IF NOT EXISTS reviews_reviewer_listing_uniq
  ON public.reviews (reviewer_id, listing_id)
  WHERE listing_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reviews_reviewer_shop_item_uniq
  ON public.reviews (reviewer_id, shop_item_id)
  WHERE shop_item_id IS NOT NULL;

-- 4. Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 5. RLS policies (drop first so re-running is safe)
DROP POLICY IF EXISTS "reviews_select_all"   ON public.reviews;
DROP POLICY IF EXISTS "reviews_insert_own"   ON public.reviews;
DROP POLICY IF EXISTS "reviews_delete_own"   ON public.reviews;

-- Everyone (incl. anonymous) can read reviews
CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  USING (true);

-- Logged-in users can only insert reviews where they are the reviewer
CREATE POLICY "reviews_insert_own"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id);

-- Reviewer can delete their own; admins (is_admin = true on profiles) can delete any
CREATE POLICY "reviews_delete_own"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (
    auth.uid() = reviewer_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
