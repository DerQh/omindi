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
import Map from "./components/app/Map";
import Following from "./components/app/Following";
import List from "./components/app/List";
import Messages from "./components/app/Messages";
import Profile from "./components/app/Profile";
import Community from "./components/app/Community";
import NewListing from "./components/app/ListingNew";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* APP ROUTES */}
          <Route path="/app" element={<Map />} />
          <Route path="/following" element={<Following />} />
          <Route path="/list" element={<List />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community" element={<Community />} />
          <Route path="/newlist" element={<NewListing />} />

          {/* WEB ROUTES */}
          <Route path="/" element={<MainBody />} />
          <Route path="/forfarms" element={<ForFarms />} />
          <Route path="/for farmersmarket" element={<ForMarketers />} />
          <Route path="/agritourism" element={<Agritourism />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/wholesale" element={<Wholesale />} />
          <Route path="/localsourcing" element={<LocalSourcing />}>
            <Route path="test" element={<h1>TEST PAGE</h1>} />
          </Route>
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/sign-up" element={<SignupLogin />} />
          <Route path="/news" element={<News />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shop/item" element={<Merchandise />} />
          <Route path="*" element={<ErrorDisplay />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
