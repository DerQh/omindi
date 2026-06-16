-- ═══════════════════════════════════════════════════════════════════════════
-- AFARMER™ — Full Demo Seed Data
-- Run AFTER schema.sql in Supabase Dashboard → SQL Editor
--
-- Creates 5 users, realistic listings, a complete buy flow, social activity,
-- shop products, conversations, referrals, and loyalty events.
--
-- All passwords: Password123!
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. CLEAN SLATE (comment out if you only want to add data)
-- ─────────────────────────────────────────────────────────────────────────────
-- TRUNCATE public.newsletter_subscribers, public.wholesale_inquiries,
--   public.loyalty_events, public.referrals, public.recurring_orders,
--   public.saved_searches, public.listing_waitlist, public.user_ratings,
--   public.shop_products, public.post_likes, public.post_comments,
--   public.comments, public.posts, public.messages, public.conversations,
--   public.listing_favorites, public.follows, public.notifications,
--   public.reviews, public.transactions, public.cart,
--   public.order_items, public.orders, public.listings, public.profiles
-- CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. AUTH USERS
-- These match what Supabase Auth creates. Password hash = "Password123!"
-- If you prefer, create these via the Auth dashboard and skip this block.
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at, role, aud
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'admin@afarmer.co.ke',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    now(), '{"full_name":"Admin User"}'::jsonb, now(), now(), 'authenticated', 'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'john@afarmer.co.ke',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    now(), '{"full_name":"John Kamau"}'::jsonb, now(), now(), 'authenticated', 'authenticated'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'grace@afarmer.co.ke',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    now(), '{"full_name":"Grace Wanjiku"}'::jsonb, now(), now(), 'authenticated', 'authenticated'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'david@afarmer.co.ke',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    now(), '{"full_name":"David Odhiambo"}'::jsonb, now(), now(), 'authenticated', 'authenticated'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'fatuma@afarmer.co.ke',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    now(), '{"full_name":"Fatuma Hassan"}'::jsonb, now(), now(), 'authenticated', 'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PROFILES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.profiles (
  id, full_name, farm_name, avatar_url, description, location,
  is_admin, referral_code, loyalty_points, created_at
) VALUES
  -- Admin
  (
    '11111111-1111-1111-1111-111111111111',
    'Admin User', 'AFARMER™ Admin', NULL,
    'Platform administrator.',
    'Nairobi, Kenya',
    true, 'ADMIN001', 0,
    now() - interval '6 months'
  ),
  -- Farmer 1 — John Kamau (Kiambu)
  (
    '22222222-2222-2222-2222-222222222222',
    'John Kamau', 'Kamau Fresh Farms',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    'Third-generation tomato and vegetable farmer in Kiambu. Supplying Nairobi hotels and households since 2015.',
    'Kiambu, Kenya',
    false, 'KAMAU001', 150,
    now() - interval '5 months'
  ),
  -- Farmer 2 — Grace Wanjiku (Nakuru)
  (
    '33333333-3333-3333-3333-333333333333',
    'Grace Wanjiku', 'Wanjiku Dairy & Produce',
    'https://images.unsplash.com/photo-1494790108755-2616b1d72f8c?w=200',
    'Organic dairy and maize farmer in Nakuru. Certified organic since 2020. Daily milk deliveries available.',
    'Nakuru, Kenya',
    false, 'GRACE001', 75,
    now() - interval '4 months'
  ),
  -- Buyer 1 — David Odhiambo
  (
    '44444444-4444-4444-4444-444444444444',
    'David Odhiambo', NULL,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    'Home chef and food enthusiast. I buy fresh produce weekly.',
    'Westlands, Nairobi',
    false, 'DAVID001', 225,
    now() - interval '3 months'
  ),
  -- Buyer 2 — Fatuma Hassan (referred by David)
  (
    '55555555-5555-5555-5555-555555555555',
    'Fatuma Hassan', NULL,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    'Restaurant owner looking for reliable fresh suppliers.',
    'Kilimani, Nairobi',
    false, 'FTUMA001', 25,
    now() - interval '1 month'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. LISTINGS (all approved, from the two farmers)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.listings (
  id, seller_id, title, description, price, unit, "minimumOrder",
  location, category, available, approved, seller_name, seller_image_url,
  favourites, inquiries, badges, price_tiers, created_at
) VALUES
  -- John's listings
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'Roma Tomatoes — Grade A',
    'Firm, deep-red Roma tomatoes picked at peak ripeness. No pesticides. Ideal for salsa, pasta sauce, and salads. Harvested Monday and Thursday mornings.',
    85, 'kg', 5,
    'Kiambu, Kenya', 'Vegetables', true, true,
    'John Kamau',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    12, 8,
    ARRAY['Organic','Grade A'],
    '[{"min_qty":20,"price":75},{"min_qty":50,"price":65}]'::jsonb,
    now() - interval '4 months'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'Fresh Spinach Bunches',
    'Tender baby spinach and mature spinach available. Washed and packed in 500g bundles. Harvested twice weekly.',
    40, 'bundle', 10,
    'Kiambu, Kenya', 'Vegetables', true, true,
    'John Kamau',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    5, 3,
    ARRAY['Organic'],
    '[]'::jsonb,
    now() - interval '3 months'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'Hass Avocados',
    'Creamy Hass avocados from mature trees. Ready-to-eat in 2–3 days after harvest. Sold per crate (60 pieces) or per kg.',
    120, 'kg', 3,
    'Kiambu, Kenya', 'Fruits', true, true,
    'John Kamau',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    20, 15,
    ARRAY['Grade A','Bestseller'],
    '[{"min_qty":10,"price":110},{"min_qty":30,"price":95}]'::jsonb,
    now() - interval '3 months'
  ),
  -- Grace's listings
  (
    'aaaaaaaa-0000-0000-0000-000000000004',
    '33333333-3333-3333-3333-333333333333',
    'Fresh Whole Milk',
    'Raw whole milk from Friesian cows. 4% fat. Tested daily. Available for daily or weekly subscription delivery. Delivered chilled by 7 AM.',
    65, 'litre', 5,
    'Nakuru, Kenya', 'Dairy', true, true,
    'Grace Wanjiku',
    'https://images.unsplash.com/photo-1494790108755-2616b1d72f8c?w=200',
    18, 12,
    ARRAY['Organic','Fresh Daily'],
    '[{"min_qty":20,"price":58},{"min_qty":50,"price":52}]'::jsonb,
    now() - interval '4 months'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000005',
    '33333333-3333-3333-3333-333333333333',
    'Dry Maize (White Corn)',
    'Sun-dried white maize. 90kg bags. Moisture content below 13.5%. Ideal for ugali, animal feed, and milling. Stored in airtight facilities.',
    3800, 'bag (90kg)', 1,
    'Nakuru, Kenya', 'Grains', true, true,
    'Grace Wanjiku',
    'https://images.unsplash.com/photo-1494790108755-2616b1d72f8c?w=200',
    7, 6,
    ARRAY['Grade B','Bulk Available'],
    '[{"min_qty":5,"price":3600},{"min_qty":10,"price":3400}]'::jsonb,
    now() - interval '2 months'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000006',
    '33333333-3333-3333-3333-333333333333',
    'Free-Range Eggs (Tray of 30)',
    'Eggs from free-range Kienyeji hens. Rich yolks, strong shells. Collected daily. Supplied in reinforced cardboard trays.',
    480, 'tray (30 eggs)', 2,
    'Nakuru, Kenya', 'Poultry', true, true,
    'Grace Wanjiku',
    'https://images.unsplash.com/photo-1494790108755-2616b1d72f8c?w=200',
    9, 4,
    ARRAY['Free-Range'],
    '[{"min_qty":5,"price":450}]'::jsonb,
    now() - interval '2 months'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. SHOP PRODUCTS (AFARMER™ merchandise)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.shop_products (name, price, category, badge, description, stock, sku, rating, reviews) VALUES
  ('AFARMER™ Canvas Tote Bag',     1200, 'Accessories', 'Bestseller', 'Heavy-duty 100% cotton canvas tote. Features the AFARMER™ logo. Perfect for market runs.',     50, 'SKU-TOTE-001', 4.8, 24),
  ('Stainless Steel Water Bottle', 1800, 'Accessories', 'New',        '500ml double-walled insulated bottle. Keeps drinks cold 24h / hot 12h.',                       30, 'SKU-BTL-001',  4.6, 11),
  ('AFARMER™ Branded Cap',         950,  'Apparel',     NULL,         'Unstructured 6-panel cap in olive green. Embroidered AFARMER™ logo. One size fits all.',        40, 'SKU-CAP-001',  4.5, 8),
  ('Farm Journal (A5 Hardcover)',  650,  'Stationery',  NULL,         '192 pages, dot-grid. Weather-resistant cover. Ideal for farm records and harvest logs.',        60, 'SKU-JNL-001',  4.9, 31),
  ('Produce Weighing Scale (10kg)',4500, 'Equipment',   'Popular',    'Accurate mechanical spring scale. Rust-resistant. Includes two hooks for hanging.',             15, 'SKU-SCL-001',  4.3, 6)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. FOLLOWS
-- David follows both farmers; Fatuma follows Grace
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.follows (follower_id, following_id, created_at) VALUES
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', now() - interval '2 months'),
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', now() - interval '2 months'),
  ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', now() - interval '3 weeks')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. LISTING FAVORITES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.listing_favorites (user_id, listing_id, created_at) VALUES
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000001', now() - interval '2 months'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000003', now() - interval '6 weeks'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000004', now() - interval '1 month'),
  ('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-0000-0000-0000-000000000004', now() - interval '2 weeks'),
  ('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-0000-0000-0000-000000000005', now() - interval '2 weeks')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. ORDERS — Full lifecycle examples
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.orders (
  id, user_id, total_cost, payment_method, delivery_address,
  mobile_no, status, mpesa_checkout_id, mpesa_receipt, paid_at, created_at
) VALUES
  -- Order 1: David bought tomatoes + avocados via M-Pesa → DELIVERED
  (
    'order001-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    845, 'mpesa', '14 Riverside Drive, Westlands, Nairobi',
    '0712345678', 'delivered',
    'ws_CO_16062026_001', 'QHJ4KXLP8N',
    now() - interval '6 weeks',
    now() - interval '7 weeks'
  ),
  -- Order 2: David bought milk via COD → CONFIRMED
  (
    'order002-0000-0000-0000-000000000002',
    '44444444-4444-4444-4444-444444444444',
    650, 'cod', '14 Riverside Drive, Westlands, Nairobi',
    '0712345678', 'confirmed',
    NULL, NULL, NULL,
    now() - interval '2 weeks'
  ),
  -- Order 3: Fatuma bought maize + eggs via M-Pesa → PENDING (just placed)
  (
    'order003-0000-0000-0000-000000000003',
    '55555555-5555-5555-5555-555555555555',
    4760, 'mpesa', 'Yaya Centre, Kilimani, Nairobi',
    '0798765432', 'pending',
    'ws_CO_16062026_003', NULL, NULL,
    now() - interval '2 days'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. ORDER ITEMS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.order_items (order_id, listing_id, quantity, price_at_purchase) VALUES
  -- Order 1
  ('order001-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 5, 85),   -- 5kg tomatoes
  ('order001-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000003', 4, 120),  -- 4kg avocados
  -- Order 2
  ('order002-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000004', 10, 65),  -- 10L milk
  -- Order 3
  ('order003-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000005', 1, 3800), -- 1 bag maize
  ('order003-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000006', 2, 480)   -- 2 trays eggs
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. TRANSACTIONS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.transactions (
  user_id, order_id, payment_method, amount, phone, status, reference, created_at, updated_at
) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    'order001-0000-0000-0000-000000000001',
    'mpesa', 845, '0712345678', 'approved', 'MPE56787891',
    now() - interval '7 weeks', now() - interval '6 weeks'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'order002-0000-0000-0000-000000000002',
    'cod', 650, NULL, 'pending', 'COD1718543200',
    now() - interval '2 weeks', now() - interval '2 weeks'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'order003-0000-0000-0000-000000000003',
    'mpesa', 4760, '0798765432', 'pending', 'MPE54321718600000',
    now() - interval '2 days', now() - interval '2 days'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. CART (David currently has items pending checkout)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.cart (user_id, listing_id, quantity, created_at) VALUES
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000002', 15, now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-0000-0000-0000-000000000006', 3,  now() - interval '1 day')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. REVIEWS (David reviews after delivery)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.reviews (
  listing_id, seller_id, reviewer_id, rating, comment, created_at
) VALUES
  (
    'aaaaaaaa-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    5,
    'Excellent tomatoes! Very firm and sweet. John delivered on time and even threw in extra ones. Will definitely order again.',
    now() - interval '5 weeks'
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    4,
    'Great avocados — creamy and ripe within 2 days exactly as described. Packaging could be a bit sturdier for transport.',
    now() - interval '5 weeks'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. USER RATINGS (David rates John as a seller)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.user_ratings (rater_id, rated_user_id, rating) VALUES
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 5)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.notifications (user_id, type, title, body, detail, read, created_at, updated_at) VALUES
  -- John: new follow + favorite + order
  (
    '22222222-2222-2222-2222-222222222222', 'follow',
    'David Odhiambo followed you',
    'Tap to view their profile.',
    '{"follower_id":"44444444-4444-4444-4444-444444444444","follower_name":"David Odhiambo"}'::jsonb,
    true, now() - interval '2 months', now() - interval '2 months'
  ),
  (
    '22222222-2222-2222-2222-222222222222', 'favorite',
    'Someone Saved Your Listing',
    'A buyer added "Roma Tomatoes — Grade A" to their favourites.',
    '{"listing":"Roma Tomatoes — Grade A","listing_id":"aaaaaaaa-0000-0000-0000-000000000001","totalSaves":12}'::jsonb,
    true, now() - interval '2 months', now() - interval '2 months'
  ),
  (
    '22222222-2222-2222-2222-222222222222', 'order',
    'Order Delivered',
    'Your order has been delivered. Enjoy your purchase!',
    '{"orderId":"order001-0000-0000-0000-000000000001","status":"delivered","total":845,"payment":"mpesa"}'::jsonb,
    false, now() - interval '6 weeks', now() - interval '6 weeks'
  ),
  -- David: order status updates
  (
    '44444444-4444-4444-4444-444444444444', 'order',
    'Order Delivered',
    'Your order has been delivered. Enjoy your purchase!',
    '{"orderId":"order001-0000-0000-0000-000000000001","status":"delivered","total":845,"payment":"mpesa"}'::jsonb,
    true, now() - interval '6 weeks', now() - interval '6 weeks'
  ),
  (
    '44444444-4444-4444-4444-444444444444', 'order',
    'Order Confirmed',
    'Your order has been confirmed by the seller.',
    '{"orderId":"order002-0000-0000-0000-000000000002","status":"confirmed","total":650,"payment":"cod"}'::jsonb,
    false, now() - interval '2 weeks', now() - interval '2 weeks'
  ),
  -- Fatuma: pending order
  (
    '55555555-5555-5555-5555-555555555555', 'order',
    'Order Placed',
    'Your order has been placed successfully.',
    '{"orderId":"order003-0000-0000-0000-000000000003","status":"pending","total":4760,"payment":"mpesa"}'::jsonb,
    false, now() - interval '2 days', now() - interval '2 days'
  ),
  -- Grace: follow + system welcome
  (
    '33333333-3333-3333-3333-333333333333', 'follow',
    'David Odhiambo followed you',
    'Tap to view their profile.',
    '{"follower_id":"44444444-4444-4444-4444-444444444444","follower_name":"David Odhiambo"}'::jsonb,
    true, now() - interval '2 months', now() - interval '2 months'
  ),
  (
    '33333333-3333-3333-3333-333333333333', 'system',
    'Your listing has been approved',
    '"Fresh Whole Milk" is now live on the marketplace.',
    '{"listing":"Fresh Whole Milk"}'::jsonb,
    true, now() - interval '4 months', now() - interval '4 months'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 14. COMMUNITY POSTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.posts (
  id, user_id, title, content, type, author, user_image_url,
  likes, shares, approved, created_at
) VALUES
  (
    'post0001-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'Tips for Storing Tomatoes After Harvest',
    'Many farmers lose up to 30% of their tomato crop to poor post-harvest handling. Here are my top 5 tips: 1) Never refrigerate unripe tomatoes — cold halts the ripening process. 2) Store stem-side down to slow moisture loss. 3) Keep them at 18–22°C in a single layer. 4) Separate any bruised tomatoes immediately to prevent rot spread. 5) For bulk storage, wood ash treatment extends shelf life by 4–6 days.',
    'tip',
    'John Kamau',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    24, 8, true,
    now() - interval '3 months'
  ),
  (
    'post0002-0000-0000-0000-000000000002',
    '33333333-3333-3333-3333-333333333333',
    'Why Organic Certification Changed My Farm Revenue',
    'Three years ago I invested KES 80,000 to get KEBS organic certification. Last year my milk sold at KES 65/litre vs the market rate of KES 45. The certification paid for itself in 4 months. The process involves soil testing, documenting inputs for 2 seasons, and a field inspection. Happy to share the exact steps — drop a comment below.',
    'story',
    'Grace Wanjiku',
    'https://images.unsplash.com/photo-1494790108755-2616b1d72f8c?w=200',
    41, 17, true,
    now() - interval '2 months'
  ),
  (
    'post0003-0000-0000-0000-000000000003',
    '44444444-4444-4444-4444-444444444444',
    'Best Farmer I Have Bought From!',
    'Just wanted to shoutout @KamauFreshFarms. I have ordered tomatoes and avocados twice now and the quality is consistently exceptional. Fast delivery to Westlands and he always adds a few extras. This is exactly why AFARMER exists.',
    'review',
    'David Odhiambo',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    15, 3, true,
    now() - interval '5 weeks'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 15. POST LIKES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.post_likes (post_id, user_id, created_at) VALUES
  ('post0001-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', now() - interval '3 months'),
  ('post0001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', now() - interval '2 months'),
  ('post0002-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', now() - interval '2 months'),
  ('post0002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', now() - interval '2 months'),
  ('post0003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', now() - interval '5 weeks'),
  ('post0003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', now() - interval '5 weeks')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 16. POST COMMENTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.post_comments (post_id, author_id, content, author, image_url, created_at) VALUES
  (
    'post0001-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'Great tips John! I would also add that ethylene gas from apples speeds up ripening — useful when you want to ripen a batch quickly.',
    'Grace Wanjiku',
    'https://images.unsplash.com/photo-1494790108755-2616b1d72f8c?w=200',
    now() - interval '3 months'
  ),
  (
    'post0001-0000-0000-0000-000000000001',
    '44444444-4444-4444-4444-444444444444',
    'This is really helpful! I always wondered why the tomatoes I kept in the fridge never tasted as good.',
    'David Odhiambo',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    now() - interval '2 months'
  ),
  (
    'post0002-0000-0000-0000-000000000002',
    '44444444-4444-4444-4444-444444444444',
    'Thank you Grace! Could you share the contact for the certification body? Would love to point more farmers to this.',
    'David Odhiambo',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    now() - interval '2 months'
  ),
  (
    'post0002-0000-0000-0000-000000000002',
    '22222222-2222-2222-2222-222222222222',
    'Grace this is inspiring. I have been considering this for my tomato farm. The ROI calculation alone has convinced me. Starting the paperwork next month!',
    'John Kamau',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    now() - interval '6 weeks'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 17. CONVERSATIONS & MESSAGES
-- Fatuma → Grace about bulk milk pricing
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.conversations (
  id, buyer_id, seller_id, listing_id, unread_count, created_at
) VALUES
  (
    'conv0001-0000-0000-0000-000000000001',
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-0000-0000-0000-000000000004',
    1,
    now() - interval '3 weeks'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.messages (conversation_id, sender_id, content, read, created_at) VALUES
  (
    'conv0001-0000-0000-0000-000000000001',
    '55555555-5555-5555-5555-555555555555',
    'Hi Grace, I run a small restaurant in Kilimani and I am interested in ordering 30 litres of milk daily. Do you offer daily delivery? What would the price be at that volume?',
    true, now() - interval '3 weeks'
  ),
  (
    'conv0001-0000-0000-0000-000000000001',
    '33333333-3333-3333-3333-333333333333',
    'Hello Fatuma! Yes, I do daily deliveries before 7 AM. For 30 litres daily I can offer KES 55/litre with a weekly payment arrangement. I would need a 2-week commitment minimum. Would that work for you?',
    true, now() - interval '3 weeks' + interval '2 hours'
  ),
  (
    'conv0001-0000-0000-0000-000000000001',
    '55555555-5555-5555-5555-555555555555',
    'That sounds great! Can we start next Monday? I will place a formal order through the app.',
    false, now() - interval '2 weeks'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 18. RECURRING ORDER (David set up weekly spinach)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.recurring_orders (
  user_id, listing_id, quantity, frequency,
  delivery_address, mobile_no, next_order_date, active, created_at
) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    'aaaaaaaa-0000-0000-0000-000000000002',
    20, 'weekly',
    '14 Riverside Drive, Westlands, Nairobi',
    '0712345678',
    (CURRENT_DATE + interval '7 days')::date,
    true,
    now() - interval '1 month'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 19. LISTING WAITLIST (Fatuma waiting for avocados when restocked)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.listing_waitlist (listing_id, user_id, notified, created_at) VALUES
  (
    'aaaaaaaa-0000-0000-0000-000000000003',
    '55555555-5555-5555-5555-555555555555',
    false,
    now() - interval '1 week'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 20. SAVED SEARCHES (David saves common searches)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.saved_searches (user_id, label, query, category, created_at) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Organic Veg',   'organic',   'Vegetables', now() - interval '6 weeks'),
  ('44444444-4444-4444-4444-444444444444', 'Fresh Dairy',   'milk',      'Dairy',      now() - interval '4 weeks'),
  ('55555555-5555-5555-5555-555555555555', 'Bulk Grains',   'maize',     'Grains',     now() - interval '2 weeks')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 21. REFERRALS (Fatuma was referred by David)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.referrals (referrer_id, referred_id, rewarded, created_at) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555',
    true,
    now() - interval '1 month'
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 22. LOYALTY EVENTS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.loyalty_events (user_id, points, reason, created_at) VALUES
  -- David earned points
  ('44444444-4444-4444-4444-444444444444', 50,  'Referral reward — Fatuma Hassan signed up using your code', now() - interval '1 month'),
  ('44444444-4444-4444-4444-444444444444', 85,  'Purchase reward — Order #order001 (KES 845)',               now() - interval '7 weeks'),
  ('44444444-4444-4444-4444-444444444444', 65,  'Purchase reward — Order #order002 (KES 650)',               now() - interval '2 weeks'),
  ('44444444-4444-4444-4444-444444444444', 25,  'Welcome bonus — account created',                           now() - interval '3 months'),
  -- Fatuma: referral sign-up bonus
  ('55555555-5555-5555-5555-555555555555', 25,  'Referral sign-up bonus — invited by David Odhiambo',        now() - interval '1 month'),
  -- John: loyalty for completing profile
  ('22222222-2222-2222-2222-222222222222', 50,  'Profile completion bonus',                                  now() - interval '4 months'),
  ('22222222-2222-2222-2222-222222222222', 100, 'First listing milestone — 10 listings saved by buyers',     now() - interval '3 months'),
  -- Grace
  ('33333333-3333-3333-3333-333333333333', 50,  'Profile completion bonus',                                  now() - interval '3 months'),
  ('33333333-3333-3333-3333-333333333333', 25,  'Community post milestone — first approved post',            now() - interval '2 months')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 23. WHOLESALE INQUIRIES
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.wholesale_inquiries (first_name, last_name, email, institution, interest, created_at) VALUES
  ('Amina',   'Omondi',   'amina@nairobicatering.co.ke', 'Nairobi Catering Ltd',       'bulk vegetables and dairy for hotel supply chain', now() - interval '1 month'),
  ('Patrick', 'Mutua',    'patrick@freshbox.co.ke',      'FreshBox Delivery',          'weekly produce boxes for Nairobi subscription customers', now() - interval '3 weeks'),
  ('Lilian',  'Cheruiyot','lilian@kcb.co.ke',            'KCB Staff Canteen',          'daily fresh produce for canteen — 200+ meals/day', now() - interval '1 week')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 24. NEWSLETTER SUBSCRIBERS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.newsletter_subscribers (email, created_at) VALUES
  ('amina@nairobicatering.co.ke',  now() - interval '1 month'),
  ('hello@freshfarm.co.ke',        now() - interval '3 weeks'),
  ('chef.mario@gmail.com',         now() - interval '2 weeks'),
  ('supplier@organickenya.co.ke',  now() - interval '1 week')
ON CONFLICT DO NOTHING;
