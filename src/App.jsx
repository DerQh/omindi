import {
  createBrowserRouter,
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Wholesale from "./components/web/Wholesale";
import ForFarms from "./components/web/ForFarms";
import MainBody from "./components/web/MainBody";
import ForMarketers from "./components/web/ForMarketers";
import Pricing from "./components/web/Pricing";
import Agritourism from "./components/web/Agritourism";
import LocalSourcing from "./components/web/LocalSourcing";
import ContactUs from "./components/web/ContactUs";
import News from "./components/web/News";
import Shop from "./components/web/Shop";
import SignupLogin from "./components/web/SignupLogin";
import AboutUs from "./components/web/AboutUs";
import FAQ from "./components/web/FaQ";
import Merchandise from "./components/web/Merchandise";
import ErrorDisplay from "./components/web/Error";
import Following from "./components/mobile/Following";
import List from "./components/mobile/List";
import Messages from "./components/mobile/Messages";
import Profile from "./components/mobile/Profile";
import Community from "./components/mobile/Community";
import NewListing from "./components/mobile/ListingNew";
import ListingDetail from "./components/mobile/ListingDetail";
import BuyNow from "./components/mobile/BuyNow";
import Inquiry from "./components/mobile/Inquiry";
import Cart from "./components/mobile/Cart";
import Checkout from "./components/mobile/Checkout";
import Follower from "./components/mobile/Follower";
import Post from "./components/mobile/Post";
import Update from "./components/mobile/Update";
import ProtectedRoutes from "./components/mobile/ProtectedRoutes";
// import { useAppContext } from "./context/CartContext";
import UpcomingEvents from "./components/mobile/UpcomingEvent";
import EventDetail from "./components/mobile/EventDetail";
import Followers from "./components/mobile/Followers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();
import { HelmetProvider } from "react-helmet-async";
import EditProfile from "./components/mobile/EditProfile";
import { TestHooks } from "./components/mobile/TestHooks";
import OrderConfirmation from "./components/mobile/OrderConfirmation";
import { ScrollToTop } from "./components/mobile/ScrollTop";
import Notifications from "./components/mobile/Notifications";
import ViewOrder from "./components/mobile/ViewOrder";
import Dashboard from "./components/mobile/Dashboard";
import { EditListing } from "./components/mobile/EditListing";
import AppHome from "./components/mobile/AppHome";
import SalesDashboard from "./components/mobile/SalesDashboard";
import Admin from "./components/mobile/Admin";
import MyOrders from "./components/mobile/MyOrders";
import ResetPassword from "./components/web/ResetPassword";
import BackToTop from "./components/mobile/BackToTop";

function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <>
        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            {/* APP ROUTES */}
            {/* PROTECTED APP ROUTES */}
            <Route
              element={
                <ProtectedRoutes>
                  <></>
                </ProtectedRoutes>
              }
            >
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/sales" element={<SalesDashboard />} />
              <Route path="/edit-listing/:id" element={<EditListing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order/:order_id" element={<ViewOrder />} />
              <Route path="/notifications" element={<Notifications />} />
              {import.meta.env.DEV && <Route path="/test" element={<TestHooks />} />}
              <Route path="/mobile" element={<AppHome />} />
              <Route path="/following" element={<Following />} />
              <Route path="/list" element={<List />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/community" element={<Community />} />
              <Route path="/newlist" element={<NewListing />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/buy-now" element={<BuyNow />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/inquire" element={<Inquiry />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/follower/:id" element={<Follower />} />
              <Route path="/post/:id" element={<Post />} />
              <Route path="/update" element={<Update />} />
              <Route path="/events" element={<UpcomingEvents />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/followers" element={<Followers />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>

            {/* WEB ROUTES */}
            <Route path="/" element={<MainBody />} />
            <Route path="/forfarms" element={<ForFarms />} />
            <Route path="/for-farmersmarket" element={<ForMarketers />} />
            <Route path="/agritourism" element={<Agritourism />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="/localsourcing" element={<LocalSourcing />}>
              <Route path="test" element={<h1>TEST PAGE</h1>} />
            </Route>
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/sign-up" element={<SignupLogin />} />
            <Route path="/login" element={<SignupLogin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/news" element={<News />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shop/item/:id" element={<Merchandise />} />
            <Route path="*" element={<ErrorDisplay />} />
          </Routes>
        </BrowserRouter>
        <BackToTop />
      </>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
