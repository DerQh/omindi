# AFARMER™ — User & System Flows

---

## Users in the Seed Data

| Role    | Name           | Email                     | Password      |
|---------|----------------|---------------------------|---------------|
| Admin   | Admin User     | admin@afarmer.co.ke       | Password123!  |
| Farmer  | John Kamau     | john@afarmer.co.ke        | Password123!  |
| Farmer  | Grace Wanjiku  | grace@afarmer.co.ke       | Password123!  |
| Buyer   | David Odhiambo | david@afarmer.co.ke       | Password123!  |
| Buyer   | Fatuma Hassan  | fatuma@afarmer.co.ke      | Password123!  |

---

## 1. Buyer Sign-Up Flow

```
User opens app
    │
    ▼
SignupLogin.jsx → supabase.auth.signUp({ email, password, options: { data: { full_name } } })
    │
    ▼
Supabase Auth trigger → auto-creates row in public.profiles
    │
    ├─ If referral code entered:
    │      useApplyReferralCode()
    │          → finds referrer by profiles.referral_code
    │          → inserts into referrals
    │          → updates profiles.referred_by
    │          → increment_loyalty_points(referrer, +50)
    │          → increment_loyalty_points(new_user, +25)
    │          → inserts loyalty_events rows for both
    │
    └─ AuthContext.useEffect → checks profiles.is_banned
           → if banned: supabase.auth.signOut()
           → if ok: sets user in context, app loads
```

---

## 2. Farmer — Listing Creation Flow

```
Farmer → ListingNew.jsx → useCreateListing()
    │
    ├─ Upload image → storage bucket "listing-images"
    ├─ Fetch seller profile → profiles (avatar_url → seller_image_url)
    │
    └─ INSERT into listings {
           seller_id, title, description, price, unit, minimumOrder,
           location, category, image_url, phone, available,
           approved: false,          ← hidden until admin approves
           seller_name, seller_image_url,
           badges, price_tiers
       }
           │
           ▼
    Admin sees it in useAdminPendingListings()
    Admin clicks Approve → useAdminApproveListing()
        → UPDATE listings SET approved = true
        → useAdminNotifySeller() → INSERT notifications (type: "system")
           → Farmer sees "Your listing has been approved" notification
```

---

## 3. Buyer — Browse & Purchase Flow

```
AppHome.jsx / List.jsx
    │
    ├─ useListings()     → SELECT * FROM listings WHERE approved = true
    ├─ useSearchListings() → RPC search_listings(query) — full-text tsvector
    │
    └─ Buyer taps listing → ListingDetail.jsx
            │
            ├─ useFavoriteCheck()     → listing_favorites
            ├─ useListingReviews()    → reviews JOIN profiles
            ├─ useSellerRating()      → AVG(reviews.rating) for seller
            ├─ useIsOnWaitlist()      → listing_waitlist
            ├─ useFollowerCount()     → follows WHERE following_id = seller
            │
            ├─ "Add to Cart"  → useAddItem()     → INSERT cart
            ├─ "Buy Now"      → BuyNow.jsx       → goes straight to Checkout
            ├─ "Save"         → useCreateFavorite()
            │       → INSERT listing_favorites
            │       → RPC increment_favourites_count(listing_id)
            │       → Upsert notifications for seller (type: "favorite")
            ├─ "Follow"       → useFollowToggle()
            │       → INSERT follows
            │       → INSERT notifications for seller (type: "follow")
            └─ "Join Waitlist" → useJoinWaitlist() → INSERT listing_waitlist
```

---

## 4. Checkout & Payment Flow

```
Cart.jsx → Checkout.jsx
    │
    ├─ 1. useAddOrder()
    │       → INSERT orders { user_id, total_cost, payment_method,
    │                         delivery_address, mobile_no, status:"pending" }
    │       → fire-and-forget: supabase.functions.invoke("send-order-email")
    │
    ├─ 2. useAddOrderItems()  (one call per cart item)
    │       → INSERT order_items { order_id, listing_id, quantity, price_at_purchase }
    │
    ├─ 3. useCreateTransaction()
    │       → INSERT transactions { ..., status:"pending", reference }
    │
    ├─ 4. PAYMENT BRANCH
    │       │
    │       ├─ M-PESA ────────────────────────────────────────────────────────
    │       │    useInitiateStkPush()
    │       │        → supabase.functions.invoke("mpesa-stk-push")
    │       │              → Daraja API: STK push to buyer's phone
    │       │              → UPDATE orders SET mpesa_checkout_id = CheckoutRequestID
    │       │
    │       │    Buyer enters PIN on phone
    │       │        → Daraja calls supabase/functions/mpesa-callback
    │       │              → UPDATE orders SET mpesa_receipt, paid_at, status:"confirmed"
    │       │
    │       │    Fallback (if callback missed):
    │       │        → useQueryStkStatus() polls mpesa-stk-query every 3s
    │       │              → on success: same order UPDATE
    │       │
    │       ├─ CARD ──────────────────────────────────────────────────────────
    │       │    supabase.functions.invoke("create-payment-intent")
    │       │        → Stripe PaymentIntent
    │       │        → on success: UPDATE orders/transactions status:"approved"
    │       │
    │       └─ CASH ON DELIVERY ──────────────────────────────────────────────
    │            useApproveTransaction() fires immediately
    │                → UPDATE transactions SET status:"approved"
    │                → order status stays "confirmed" until seller updates
    │
    └─ 5. POST-PAYMENT
            useCartItemsAllDelete()  → DELETE cart WHERE user_id = ?
            navigate → OrderConfirmation.jsx
```

---

## 5. Order Lifecycle (Seller / Admin)

```
orders.status progression:

  pending ──► confirmed ──► delivering ──► delivered
     │                                         │
     └──────────────────────────────────────► cancelled
                                               │
                                         (admin only)
                                            disputed

Each status change:
  useApproveOrder() / useAdminUpdateOrderStatus()
      → UPDATE orders SET status = ?
      → Upsert notifications for buyer (type: "order")
             title/body maps to ORDER_TITLES / ORDER_BODIES

After "delivered":
  Buyer can leave review → useAddReview()
      → INSERT reviews { listing_id, seller_id, reviewer_id, rating, comment }
      → Invalidates sellerRating cache
```

---

## 6. Seller — Sales Dashboard Flow

```
Dashboard.jsx / SalesDashboard.jsx
    │
    ├─ useDashboard(seller_id)
    │       → SELECT listings WHERE seller_id
    │       → SELECT order_items JOIN orders JOIN listings WHERE seller_id
    │       → computes: total revenue, orders per listing, avg rating
    │
    └─ ViewOrder.jsx
            → useOrderId(order_id)
            → useApproveOrder() to advance status
```

---

## 7. Messaging Flow

```
ListingDetail.jsx → "Message Seller" button
    │
    └─ useStartConversation({ buyer_id, seller_id, listing_id })
            → SELECT conversations (existing check)
            → if none: INSERT conversations
            │
            ▼
    Messages.jsx
        ├─ useConversations(user_id)
        │       → SELECT conversations JOIN profiles (buyer+seller) JOIN listings
        ├─ useMessages(conversation_id)
        │       → SELECT messages ORDER BY created_at ASC
        │       → Realtime subscription on postgres_changes INSERT
        ├─ useSendMessage()
        │       → INSERT messages { conversation_id, sender_id, content }
        └─ useMarkMessagesRead()
                → UPDATE messages SET read = true WHERE sender_id ≠ current_user
```

---

## 8. Social / Community Flow

```
Community.jsx
    │
    ├─ usePosts()         → SELECT posts WHERE approved = true
    ├─ useCreatePost()    → INSERT posts { ..., approved: false }
    │                        Upload image → storage "post-images"
    ├─ useToggleLike()    → INSERT / DELETE post_likes
    ├─ useLikeCount()     → COUNT post_likes WHERE post_id
    ├─ useCommentCount()  → COUNT comments WHERE post_id
    │
    └─ Post.jsx / Comments.jsx
            ├─ useFetchPostComments()  → SELECT post_comments WHERE post_id
            └─ useCreateComment()
                    → fetches profile (for author name + avatar)
                    → INSERT post_comments { post_id, author_id, content, author, image_url }

Admin approves post:
    useAdminApprovePost()  → UPDATE posts SET approved = true
    useAdminRejectPost()   → DELETE posts WHERE id
```

---

## 9. Referral & Loyalty Flow

```
New user signs up with referral code
    │
    └─ useApplyReferralCode({ new_user_id, referral_code })
            → find referrer via profiles.referral_code
            → INSERT referrals { referrer_id, referred_id }
            → UPDATE profiles SET referred_by = code   (new user)
            → increment_loyalty_points(referrer, +50)
            → increment_loyalty_points(new_user, +25)
            → INSERT loyalty_events x2

Points are also awarded:
    - On purchase: 1 point per KES 10 spent (implement in Edge Function or trigger)
    - Profile completion bonus: +50
    - First approved post: +25
    - 10 saves on listings: +100

Display:
    useLoyaltyPoints()   → profiles.loyalty_points
    useLoyaltyHistory()  → loyalty_events ORDER BY created_at DESC
    useReferralInfo()    → profiles.referral_code + COUNT(referrals) + loyalty_points
```

---

## 10. Admin Flow

```
Admin.jsx (protected: useIsAdmin() → profiles.is_admin = true)
    │
    ├─ Stats Tab
    │       useAdminStats()
    │           → COUNT profiles, COUNT listings, SUM orders.total_cost
    │           → orders by status, inquiries/favourites totals
    │
    ├─ Users Tab
    │       useAdminUsers()              → SELECT profiles ORDER BY created_at DESC
    │       useAdminToggleAdmin()        → UPDATE profiles SET is_admin
    │       useAdminBanUser()            → UPDATE profiles SET is_banned = true
    │                                      → UPDATE listings SET approved = false (cascade hide)
    │       useAdminDeleteUser()         → DELETE profiles (cascades to all their data)
    │
    ├─ Listings Tab
    │       useAdminPendingListings()    → listings WHERE approved = false OR null
    │       useAdminApproveListing()     → UPDATE listings SET approved = true
    │                                    → INSERT notifications (type:"system") → seller
    │       useAdminApproveAllListings() → UPDATE all pending at once
    │       useAdminDeleteListing()      → DELETE listings WHERE id
    │
    ├─ Orders Tab
    │       useAdminOrders()             → SELECT orders ORDER BY created_at DESC
    │       useAdminUpdateOrderStatus()  → UPDATE orders SET status
    │       useAdminBulkUpdateStatus()   → UPDATE orders WHERE id IN (ids)
    │       useAdminUpdateOrderNote()    → UPDATE orders SET admin_note (disputes)
    │
    ├─ Reviews Tab
    │       useAdminReviews()            → SELECT reviews JOIN listings(title)
    │       useAdminDeleteReview()       → DELETE reviews WHERE id
    │
    ├─ Posts Tab
    │       useAdminPendingPosts()       → posts WHERE approved = false
    │       useAdminApprovePost()        → UPDATE posts SET approved = true
    │       useAdminRejectPost()         → DELETE posts WHERE id
    │
    └─ Broadcast Tab
            useAdminBroadcast({ title, body })
                → SELECT all profile IDs
                → INSERT notifications (type:"broadcast") for every user
```

---

## 11. Notifications Flow

```
Any event (order update, follow, favorite, inquiry, system, broadcast)
    │
    └─ INSERT / UPDATE into public.notifications
            { user_id, type, title, body, detail (jsonb), read: false }

Notifications.jsx
    ├─ useNotifications(user_id)    → SELECT * ORDER BY updated_at DESC
    │       + Realtime channel subscription on postgres_changes (INSERT + UPDATE)
    ├─ useUnreadCount(user_id)      → COUNT WHERE read = false
    ├─ useMarkRead(id)              → UPDATE SET read = true
    └─ useMarkAllRead(user_id)      → UPDATE SET read = true WHERE user_id AND read = false

AppNavbar shows unread badge via useUnreadCount()
```

---

## 12. Recurring Orders Flow

```
ListingDetail.jsx → "Subscribe" / RecurringOrders.jsx
    │
    ├─ useCreateRecurringOrder()
    │       → computes next_order_date based on frequency (weekly/biweekly/monthly)
    │       → INSERT recurring_orders { user_id, listing_id, quantity,
    │                                   frequency, delivery_address, mobile_no,
    │                                   next_order_date, active: true }
    │
    ├─ useToggleRecurringOrder()    → UPDATE recurring_orders SET active
    └─ useDeleteRecurringOrder()    → DELETE recurring_orders WHERE id

Fulfillment: a cron Edge Function (not yet implemented) should run daily,
    → SELECT recurring_orders WHERE active = true AND next_order_date <= today
    → auto-create orders + order_items
    → advance next_order_date by frequency interval
```

---

## 13. Key Database Relationships

```
auth.users
    └── profiles (1:1)
            ├── listings (1:many)  ← seller_id
            │       ├── order_items (1:many)
            │       ├── reviews (1:many)
            │       ├── listing_favorites (1:many)
            │       ├── listing_waitlist (1:many)
            │       └── recurring_orders (1:many)
            ├── orders (1:many)    ← user_id
            │       ├── order_items (1:many)
            │       └── transactions (1:many)
            ├── reviews (1:many)   ← reviewer_id
            ├── notifications (1:many)
            ├── follows (1:many)   ← follower_id / following_id
            ├── cart (1:many)
            ├── posts (1:many)
            │       ├── post_comments (1:many)
            │       └── post_likes (1:many)
            ├── conversations (1:many) ← buyer_id / seller_id
            │       └── messages (1:many)
            ├── loyalty_events (1:many)
            ├── user_ratings (1:many)
            ├── referrals (1:many)
            └── saved_searches (1:many)
```

---

## 14. Storage Buckets

| Bucket          | Used by                        | Access  |
|-----------------|--------------------------------|---------|
| `avatars`       | profiles.avatar_url            | Public  |
| `listing-images`| listings.image_url             | Public  |
| `post-images`   | posts.image_url                | Public  |
| `shop-products` | shop_products.image_url        | Public  |

---

## 15. Supabase Edge Functions

| Function               | Trigger                  | Purpose                                      |
|------------------------|--------------------------|----------------------------------------------|
| `mpesa-stk-push`       | Client invoke            | Initiates Daraja STK push to buyer phone     |
| `mpesa-callback`       | Daraja webhook           | Receives payment confirmation, updates order |
| `mpesa-stk-query`      | Client poll (fallback)   | Checks STK push status when callback missed  |
| `create-payment-intent`| Client invoke            | Creates Stripe PaymentIntent for card payments|
| `send-order-email`     | After order insert       | Sends confirmation email to buyer            |
