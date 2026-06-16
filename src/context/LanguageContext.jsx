import { createContext, useContext, useState } from "react";

// ─── Translations ─────────────────────────────────────────────────────────────

const translations = {
  en: {
    // Nav
    home: "Home",
    listings: "Listings",
    messages: "Messages",
    profile: "Profile",
    community: "Community",
    notifications: "Notifications",
    dashboard: "Dashboard",
    // Listing actions
    buyNow: "Buy Now",
    addToCart: "Add to Cart",
    viewCart: "View Cart",
    inquiry: "Inquiry",
    recurring: "Recurring",
    shareWhatsApp: "Share on WhatsApp",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    // Waitlist
    notifyWhenAvailable: "Notify me when available",
    onWaitlistLeave: "✓ On Waitlist — Leave",
    waitingBuyers: (n) => `${n} buyer${n !== 1 ? "s" : ""} waiting`,
    // Reviews
    rateThisListing: "Rate this listing",
    shareExperience: "Share your experience…",
    submitReview: "Submit Review",
    submitting: "Submitting…",
    addPhoto: "Add a photo (optional)",
    alreadyReviewed: "✓ You've reviewed this listing",
    noReviews: "No reviews yet — be the first to review this listing.",
    // Search
    searchPlaceholder: "Search by name, category, or location…",
    saveSearch: "Save",
    savedSearches: "Saved",
    totalListings: "Total Listings",
    addListing: "+ Add Listing",
    noListingsFound: "No listings found",
    // Dashboard
    storeManagement: "Store Management",
    orders: "Orders",
    settings: "Settings",
    exportCSV: "↓ Export CSV",
    holidayMode: "Holiday Mode",
    holidayOn: "Holiday mode is ON",
    holidayOff: "Holiday mode is OFF",
    saveChanges: "Save Changes",
    // Nav extras
    browse: "Browse",
    following: "Following",
    myStore: "My Store",
    myOrders: "My Orders",
    viewProfile: "View Profile",
    shop: "Shop",
    signOut: "Sign Out",
    savedSearchesTitle: "Saved Searches",
    inCart: "✓ In Cart",
    referral: "Referral",
    recurringOrders: "Recurring Orders",
    // General
    loading: "Loading…",
    back: "Back",
    close: "Close",
    delete: "Delete",
    edit: "Edit",
    cancel: "Cancel",
    confirm: "Confirm",
  },

  sw: {
    // Nav
    home: "Nyumbani",
    listings: "Orodha",
    messages: "Ujumbe",
    profile: "Wasifu",
    community: "Jamii",
    notifications: "Arifa",
    dashboard: "Dashibodi",
    // Listing actions
    buyNow: "Nunua Sasa",
    addToCart: "Ongeza kwa Kikapu",
    viewCart: "Tazama Kikapu",
    inquiry: "Uliza",
    recurring: "Agizo la Mara kwa Mara",
    shareWhatsApp: "Shiriki kwenye WhatsApp",
    outOfStock: "Haitoshi Stoo",
    inStock: "Ipo Stoo",
    // Waitlist
    notifyWhenAvailable: "Niarifu inapopatikana",
    onWaitlistLeave: "✓ Uko kwenye Orodha ya Kusubiri — Ondoka",
    waitingBuyers: (n) => `Wanunuzi ${n} wanasubiri`,
    // Reviews
    rateThisListing: "Pima orodha hii",
    shareExperience: "Shiriki uzoefu wako…",
    submitReview: "Wasilisha Tathmini",
    submitting: "Inawasilishwa…",
    addPhoto: "Ongeza picha (si lazima)",
    alreadyReviewed: "✓ Umetathmini orodha hii",
    noReviews: "Hakuna tathmini bado — kuwa wa kwanza.",
    // Search
    searchPlaceholder: "Tafuta kwa jina, aina, au mahali…",
    saveSearch: "Hifadhi",
    savedSearches: "Zilizohifadhiwa",
    totalListings: "Orodha Zote",
    addListing: "+ Ongeza Orodha",
    noListingsFound: "Hakuna orodha zilizopatikana",
    // Dashboard
    storeManagement: "Usimamizi wa Duka",
    orders: "Maagizo",
    settings: "Mipangilio",
    exportCSV: "↓ Pakua CSV",
    holidayMode: "Hali ya Likizo",
    holidayOn: "Hali ya likizo IMEWASHWA",
    holidayOff: "Hali ya likizo IMEZIMWA",
    saveChanges: "Hifadhi Mabadiliko",
    // Nav extras
    browse: "Vinjari",
    following: "Unaofuata",
    myStore: "Duka Langu",
    myOrders: "Maagizo Yangu",
    viewProfile: "Tazama Wasifu",
    shop: "Duka",
    signOut: "Toka",
    savedSearchesTitle: "Utafutaji Uliohifadhiwa",
    inCart: "✓ Iko Kapu",
    referral: "Rufaa",
    recurringOrders: "Maagizo ya Mara kwa Mara",
    // General
    loading: "Inapakia…",
    back: "Rudi",
    close: "Funga",
    delete: "Futa",
    edit: "Hariri",
    cancel: "Ghairi",
    confirm: "Thibitisha",
  },

  luo: {
    // Nav
    home: "Dala",
    listings: "Alana",
    messages: "Weche",
    profile: "Ngat",
    community: "Oganda",
    notifications: "Ripot",
    dashboard: "Osiepe",
    // Listing actions
    buyNow: "Ng'iew Sani",
    addToCart: "Dhi e Okwach",
    viewCart: "Ne Okwach",
    inquiry: "Penjo",
    recurring: "Chopo Magwa",
    shareWhatsApp: "Chiw e WhatsApp",
    outOfStock: "Ok Nitie",
    inStock: "Nitie",
    // Waitlist
    notifyWhenAvailable: "Nyisa ka oweyo",
    onWaitlistLeave: "✓ Iri e Ndiko — Wuogi",
    waitingBuyers: (n) => `Jomwono ${n} rito`,
    // Reviews
    rateThisListing: "Pim alana ni",
    shareExperience: "Nyis gimane ineno…",
    submitReview: "Or Pimo",
    submitting: "Ioro…",
    addPhoto: "Ter foto (ok mochoke)",
    alreadyReviewed: "✓ Asepim alana ni",
    noReviews: "Onge pimo — bed mokwong.",
    // Search
    searchPlaceholder: "Yeny gi nying, kit, kata kama…",
    saveSearch: "Gie",
    savedSearches: "Mogiei",
    totalListings: "Alana Duto",
    addListing: "+ Ter Alana",
    noListingsFound: "Onge alana moyeny",
    // Dashboard
    storeManagement: "Loch Duka",
    orders: "Chopo",
    settings: "Dongruok",
    exportCSV: "↓ Gol CSV",
    holidayMode: "Cik mar Chopo",
    holidayOn: "Cik mar Chopo OYAWO",
    holidayOff: "Cik mar Chopo ODINGI",
    saveChanges: "Gie Dongruok",
    // Nav extras
    browse: "Yeny",
    following: "Moluwo",
    myStore: "Dukana",
    myOrders: "Chopona",
    viewProfile: "Ne Ngat",
    shop: "Chiro",
    signOut: "Wuogi",
    savedSearchesTitle: "Yeny Mogiei",
    inCart: "✓ Iri Okwach",
    referral: "Chamo",
    recurringOrders: "Chopo Magwa",
    // General
    loading: "Ochako…",
    back: "Dogi",
    close: "Ich",
    delete: "Hir",
    edit: "Lok",
    cancel: "Weyo",
    confirm: "Rit",
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const stored = localStorage.getItem("afarmer_lang") ?? "en";
  const [lang, setLangState] = useState(stored);

  const setLang = (l) => {
    localStorage.setItem("afarmer_lang", l);
    setLangState(l);
  };

  const t = translations[lang] ?? translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export const LANGUAGES = [
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "sw", label: "Kiswahili", flag: "🇰🇪" },
  { code: "luo", label: "Dholuo",  flag: "🎵" },
];
