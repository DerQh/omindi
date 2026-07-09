import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoutes from "./components/mobile/ProtectedRoutes";
import { ScrollToTop } from "./components/mobile/ScrollTop";
import BackToTop from "./components/mobile/BackToTop";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
      gcTime: 1000 * 60 * 10,
    },
  },
});

// ─── Lazy web routes ──────────────────────────────────────────────────────────
const MainBody        = lazy(() => import("./components/web/MainBody"));
const ForFarms        = lazy(() => import("./components/web/ForFarms"));
const ForBuyers       = lazy(() => import("./components/web/ForBuyers"));
const ForMarketers    = lazy(() => import("./components/web/ForMarketers"));
const Pricing         = lazy(() => import("./components/web/Pricing"));
const Agritourism     = lazy(() => import("./components/web/Agritourism"));
const LocalSourcing   = lazy(() => import("./components/web/LocalSourcing"));
const ContactUs       = lazy(() => import("./components/web/ContactUs"));
const News            = lazy(() => import("./components/web/News"));
const Shop            = lazy(() => import("./components/web/Shop"));
const SignupLogin     = lazy(() => import("./components/web/SignupLogin"));
const AboutUs         = lazy(() => import("./components/web/AboutUs"));
const FAQ             = lazy(() => import("./components/web/FaQ"));
const Merchandise     = lazy(() => import("./components/web/Merchandise"));
const Wholesale       = lazy(() => import("./components/web/Wholesale"));
const ErrorDisplay    = lazy(() => import("./components/web/Error"));
const ResetPassword   = lazy(() => import("./components/web/ResetPassword"));
const TermsOfService  = lazy(() => import("./components/web/TermsOfService"));
const PrivacyPolicy   = lazy(() => import("./components/web/PrivacyPolicy"));

// ─── Lazy app (mobile) routes ─────────────────────────────────────────────────
const AppHome         = lazy(() => import("./components/mobile/AppHome"));
const Following       = lazy(() => import("./components/mobile/Following"));
const List            = lazy(() => import("./components/mobile/List"));
const Messages        = lazy(() => import("./components/mobile/Messages"));
const Profile         = lazy(() => import("./components/mobile/Profile"));
const Community       = lazy(() => import("./components/mobile/Community"));
const NewListing      = lazy(() => import("./components/mobile/ListingNew"));
const ListingDetail   = lazy(() => import("./components/mobile/ListingDetail"));
const BuyNow          = lazy(() => import("./components/mobile/BuyNow"));
const Inquiry         = lazy(() => import("./components/mobile/Inquiry"));
const Cart            = lazy(() => import("./components/mobile/Cart"));
const Checkout        = lazy(() => import("./components/mobile/Checkout"));
const Follower        = lazy(() => import("./components/mobile/Follower"));
const Post            = lazy(() => import("./components/mobile/Post"));
const Update          = lazy(() => import("./components/mobile/Update"));
const UpcomingEvents  = lazy(() => import("./components/mobile/UpcomingEvent"));
const EventDetail     = lazy(() => import("./components/mobile/EventDetail"));
const Followers       = lazy(() => import("./components/mobile/Followers"));
const EditProfile     = lazy(() => import("./components/mobile/EditProfile"));
const OrderConfirm    = lazy(() => import("./components/mobile/OrderConfirmation"));
const Notifications   = lazy(() => import("./components/mobile/Notifications"));
const ViewOrder       = lazy(() => import("./components/mobile/ViewOrder"));
const Dashboard       = lazy(() => import("./components/mobile/Dashboard"));
const EditListing     = lazy(() => import("./components/mobile/EditListing").then((m) => ({ default: m.EditListing })));
const SalesDashboard  = lazy(() => import("./components/mobile/SalesDashboard"));
const Admin           = lazy(() => import("./components/mobile/Admin"));
const MyOrders        = lazy(() => import("./components/mobile/MyOrders"));
const TestHooks         = lazy(() => import("./components/mobile/TestHooks").then((m) => ({ default: m.TestHooks })));
const Referral          = lazy(() => import("./components/mobile/Referral"));
const RecurringOrders   = lazy(() => import("./components/mobile/RecurringOrders"));
const SeasonalCalendar  = lazy(() => import("./components/web/SeasonalCalendar"));

// ─── Loading fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f7faf7" }}>
    <div style={{ width: 38, height: 38, border: "3px solid #e0ece0", borderTopColor: "#2f5a2a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/mobile" replace />;
  return children;
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── Protected app routes ── */}
                <Route element={<ProtectedRoutes><></></ProtectedRoutes>}>
                  <Route path="/order-confirmation" element={<OrderConfirm />} />
                  <Route path="/sales"              element={<SalesDashboard />} />
                  <Route path="/edit-listing/:id"  element={<EditListing />} />
                  <Route path="/dashboard"         element={<Dashboard />} />
                  <Route path="/order/:order_id"   element={<ViewOrder />} />
                  <Route path="/notifications"     element={<Notifications />} />
                  {import.meta.env.DEV && <Route path="/test" element={<TestHooks />} />}
                  <Route path="/mobile"            element={<AppHome />} />
                  <Route path="/following"         element={<Following />} />
                  <Route path="/list"              element={<List />} />
                  <Route path="/messages"          element={<Messages />} />
                  <Route path="/profile"           element={<Profile />} />
                  <Route path="/community"         element={<Community />} />
                  <Route path="/newlist"           element={<NewListing />} />
                  <Route path="/listing/:id"       element={<ListingDetail />} />
                  <Route path="/buy-now"           element={<BuyNow />} />
                  <Route path="/checkout"          element={<Checkout />} />
                  <Route path="/inquire"           element={<Inquiry />} />
                  <Route path="/cart"              element={<Cart />} />
                  <Route path="/follower/:id"      element={<Follower />} />
                  <Route path="/post/:id"          element={<Post />} />
                  <Route path="/update"            element={<Update />} />
                  <Route path="/events"            element={<UpcomingEvents />} />
                  <Route path="/events/:id"        element={<EventDetail />} />
                  <Route path="/followers"         element={<Followers />} />
                  <Route path="/edit-profile"      element={<EditProfile />} />
                  <Route path="/admin"             element={<Admin />} />
                  <Route path="/my-orders"         element={<MyOrders />} />
                  <Route path="/referral"          element={<Referral />} />
                  <Route path="/recurring-orders"  element={<RecurringOrders />} />
                </Route>

                {/* ── Public web routes ── */}
                <Route path="/"                   element={<MainBody />} />
                <Route path="/forfarms"           element={<ForFarms />} />
                <Route path="/forbuyers"          element={<ForBuyers />} />
                <Route path="/for farmersmarket"  element={<Navigate to="/forbuyers" replace />} />
                <Route path="/for-farmersmarket"  element={<ForMarketers />} />
                <Route path="/agritourism"        element={<Agritourism />} />
                <Route path="/pricing"            element={<Pricing />} />
                <Route path="/wholesale"          element={<Wholesale />} />
                <Route path="/localsourcing"      element={<LocalSourcing />} />
                <Route path="/contactus"          element={<ContactUs />} />
                <Route path="/sign-up"            element={<PublicRoute><SignupLogin /></PublicRoute>} />
                <Route path="/login"              element={<PublicRoute><SignupLogin /></PublicRoute>} />
                <Route path="/reset-password"     element={<ResetPassword />} />
                <Route path="/news"              element={<News />} />
                <Route path="/shop"              element={<Shop />} />
                <Route path="/aboutus"           element={<AboutUs />} />
                <Route path="/faq"               element={<FAQ />} />
                <Route path="/shop/item/:id"     element={<Merchandise />} />
                <Route path="/terms"             element={<TermsOfService />} />
                <Route path="/privacy-policy"    element={<PrivacyPolicy />} />
                <Route path="/seasonal-calendar" element={<SeasonalCalendar />} />
                <Route path="*"                  element={<ErrorDisplay />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <BackToTop />
        </>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
