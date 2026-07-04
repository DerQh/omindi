import { useState, useEffect, useCallback } from "react";
import SEO from "./SEO";
import { Helmet } from "react-helmet-async";
import { supabase } from "../../../supabase";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { MapPin, MessageCircle, ShoppingCart, Bell, Leaf, Package, Check } from "lucide-react";

// ─── Animations ───────────────────────────────────────────────────────────────

// Slides elements in from below — used on hero text, cards, and sections
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Gentle vertical float applied to the app screenshot mockup in the hero
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #e5f4ff;
  min-height: 100vh;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.section`
  padding: 80px 32px 100px;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) { padding: 60px 20px 72px; }
  @media (max-width: 480px) { padding: 40px 16px 52px; }
`;

const HeroDecor = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
`;

const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
`;

const HeroLeft = styled.div`
  animation: ${fadeUp} 0.6s ease both;
`;

const HeroEyebrow = styled.p`
  margin: 0 0 16px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #030303;
`;

const HeroTitle = styled.h1`
  margin: 0 0 20px;
  font-size: clamp(2.9rem, 4.5vw, 3.2rem);
  font-weight: 700;
  color: #030303;
  letter-spacing: -0.05em;
  line-height: 1.08;
`;

const HeroGreen = styled.span`
  color: #6fcf6f;
`;

const HeroSub = styled.p`
  margin: 0 0 36px;
  font-size: 1.05rem;
  color: #030303;
  line-height: 1.75;
  max-width: 480px;

  @media (max-width: 900px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroCtas = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 48px;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const CtaPrimary = styled.button`
  background: white;
  color: #2f5a2a;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eef7ee;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }
`;

const CtaSecondary = styled.button`
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(15, 14, 14, 0.3);
  color: #030303;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-2px);
  }
`;

const DownloadRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }

  img {
    height: 42px;
    cursor: pointer;
    transition:
      transform 0.2s,
      opacity 0.2s;
    border-radius: 8px;

    &:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  }
`;

const HeroRight = styled.div`
  display: flex;
  justify-content: center;
  animation: ${fadeUp} 0.7s ease 0.15s both;
`;

const AppMockup = styled.img`
  max-width: 340px;
  width: 100%;
  border-radius: 28px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.4);
  animation: ${float} 5s ease-in-out infinite;

  @media (max-width: 900px) {
    max-width: 260px;
  }
`;

// ─── Stats Strip ──────────────────────────────────────────────────────────────

const StatsStrip = styled.section`
  background: white;
  border-bottom: 1px solid #e8f0e8;
`;

const StatsInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 700px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 380px) { padding: 0 12px; }
`;

const StatItem = styled.div`
  padding: 28px 20px;
  text-align: center;
  border-right: 1px solid #f0f7ee;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 700px) {
    &:nth-child(2) {
      border-right: none;
    }
    &:nth-child(3) {
      border-right: 1px solid #f0f7ee;
    }
  }
`;

const StatNumber = styled.p`
  margin: 0 0 4px;
  font-size: 2rem;
  font-weight: 900;
  color: #2f5a2a;
  letter-spacing: -0.04em;
`;

const StatLabel = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #7b8f7f;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ $pad }) => $pad || "72px 32px"};

  @media (max-width: 600px) {
    padding: 48px 16px;
  }
`;

// Section header trio — eyebrow → title → subtitle — all use consistent positive spacing
const SectionEyebrow = styled.p`
  margin: 0 0 10px;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #2f5a2a;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
`;

const SectionTitle = styled.h2`
  margin: 0 0 14px;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 900;
  color: #1a2e1a;
  letter-spacing: -0.04em;
  line-height: 1.15;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
`;

// Subtitle — sits directly below the title, no negative margin
const SectionSub = styled.p`
  margin: 0 0 44px;
  color: #7b8f7f;
  font-size: 1rem;
  line-height: 1.75;
  max-width: 560px;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  ${({ $center }) => $center && "margin-left: auto; margin-right: auto;"}
`;

// ─── How it Works ─────────────────────────────────────────────────────────────

const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HowCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 36px 28px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  animation: ${fadeUp} 0.4s ease ${({ $i }) => `${$i * 0.1}s`} both;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(20, 57, 32, 0.12);
  }
`;

const HowIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #eef7ee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }
`;

const HowTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const HowText = styled.p`
  margin: 0 0 20px;
  color: #556652;
  font-size: 0.9rem;
  line-height: 1.7;
`;

const HowLink = styled.button`
  background: none;
  border: none;
  color: #2f5a2a;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    text-decoration: underline;
  }
`;

// ─── Feature Showcase ─────────────────────────────────────────────────────────

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.06);
  display: flex;
  gap: 18px;
  align-items: flex-start;
  animation: ${fadeUp} 0.4s ease ${({ $i }) => `${$i * 0.08}s`} both;
`;

const FeatureIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #eef7ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const FeatureText = styled.div``;

const FeatureTitle = styled.h4`
  margin: 0 0 6px;
  font-size: 0.98rem;
  font-weight: 700;
  color: #1a2e1a;
`;

const FeatureDesc = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #556652;
  line-height: 1.6;
`;

// ─── Green CTA Banner ─────────────────────────────────────────────────────────

const CtaBanner = styled.section`
  background: linear-gradient(135deg, #1e3d1a 0%, #2f5a2a 100%);
  border-radius: 24px;
  padding: 64px 48px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 40px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    right: -80px;
    top: -80px;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 40px 24px;
  }
`;

const CtaBannerTitle = styled.h2`
  margin: 0 0 10px;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.03em;
`;

const CtaBannerSub = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  line-height: 1.65;
`;

const CtaBannerBtn = styled.button`
  background: #6fcf6f;
  color: #1a2e1a;
  border: none;
  padding: 16px 36px;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s;
  position: relative;
  z-index: 1;

  &:hover {
    background: #8de08d;
    transform: translateY(-2px);
  }
`;

// ─── Wholesale / Inquiry Form ─────────────────────────────────────────────────

const FormCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  max-width: 640px;
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || "1fr"};
  gap: 18px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a2e1a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const inputBase = `
  padding: 12px 16px;
  border: 1.5px solid #d7edd9;
  border-radius: 10px;
  font-size: 16px;
  color: #1a2e1a;
  background: #f8faf6;
  outline: none;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s, background 0.15s;

  &::placeholder { color: #aac4aa; }
  &:focus { border-color: #2f5a2a; background: white; }
`;

const Input = styled.input`
  ${inputBase}
`;

const Textarea = styled.textarea`
  ${inputBase}
  resize: vertical;
  min-height: 110px;
  line-height: 1.6;
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.18s,
    transform 0.12s;
  margin-top: 6px;

  &:hover {
    background: #1e3d1a;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const SuccessMsg = styled.div`
  background: #eef7ee;
  border: 1px solid #a8d5ac;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2f5a2a;
  text-align: center;
`;

// ─── Testimonial ──────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "Afarmer™ has resulted in both professional and personal relationships with incredible customers in my community. I joined when I was the only producer within 50km — now there are over 30 in my village alone.",
    name: "Jeff Ondoro",
    role: "Local Farmer, Kisumu",
    initial: "J",
  },
  {
    quote:
      "Before Afarmer™ I used to drive 40km to sell at the market and come back with half my produce unsold. Now buyers come to me. My income has tripled in eight months.",
    name: "Benard Onyango",
    role: "Vegetable Farmer, Migingo",
    initial: "A",
  },
  {
    quote:
      "We source fresh dairy for our school feeding programme every week through Afarmer™. The quality is consistent and the farmers are just a message away. It's transformed how we operate.",
    name: "Wilberforce Mulamba",
    role: "Procurement Officer, Kakamega",
    initial: "D",
  },
  {
    quote:
      "I was sceptical at first but within two weeks of listing my honey I had five regular buyers. The platform is simple, the support is real, and I finally feel like a proper business owner.",
    name: "Grace Atieno",
    role: "Beekeeper, Ahero",
    initial: "G",
  },
  {
    quote:
      "As a restaurant owner I need reliable supply. Afarmer™ gave me direct access to farmers I can trust. No middlemen, fresher produce, better prices — it's a win on every level.",
    name: "Samuel Kariuki",
    role: "Restaurant Owner, Nairobi",
    initial: "S",
  },
];

const fadeSwitch = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const TestimonialWrap = styled.section`
  background: white;
  padding: 72px 32px;

  @media (max-width: 600px) {
    padding: 48px 16px;
  }
`;

const TestimonialInner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
`;

const QuoteIcon = styled.div`
  font-size: 3rem;
  color: #d7edd9;
  line-height: 1;
  margin-bottom: 20px;
`;

// Re-triggers animation each time the key changes (one per testimonial index)
const QuoteBody = styled.div`
  animation: ${fadeSwitch} 0.5s ease both;
`;

const QuoteText = styled.blockquote`
  margin: 0 0 28px;
  font-size: clamp(1rem, 2vw, 1.18rem);
  font-style: italic;
  color: #2f3d2a;
  line-height: 1.8;
  font-weight: 500;
`;

const QuoteAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2f5a2a;
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  text-align: left;
`;

const AuthorName = styled.p`
  margin: 0 0 2px;
  font-weight: 700;
  color: #1a2e1a;
  font-size: 0.95rem;
`;

const AuthorRole = styled.p`
  margin: 0;
  color: #7b8f7f;
  font-size: 0.82rem;
`;

// Row of clickable dots for manual navigation
const DotRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? "22px" : "8px")};
  height: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "#d7edd9")};
  transition:
    width 0.3s ease,
    background 0.3s ease;
  padding: 0;
`;

// ─── Static content data ─────────────────────────────────────────────────────
// Edit these arrays to update the "How it works" cards and features grid
// without touching the JSX below.

const HOW_ITEMS = [
  {
    icon: "/buy.png",
    title: "Buy",
    text: "Search by location or keyword for fresh produce on sale. Message the seller and arrange a pickup, meetup, or delivery — all in one place.",
    link: "/forbuyers",
  },
  {
    icon: "/sell.png",
    title: "Sell",
    text: "Create a free listing to sell your homegrown produce, eggs, honey, and more. Reach hundreds of buyers in your local area instantly.",
    link: "/forfarms",
  },
  {
    icon: "/grow.png",
    title: "Grow",
    text: "Connect directly with consumers and wholesale buyers without the hassle of branding, a website, or advertising. Just grow — we handle the rest.",
    link: "/agritourism",
  },
];

const FEATURES = [
  {
    Icon: MapPin,
    title: "Map-based Discovery",
    desc: "Find farms and fresh produce near you on an interactive map.",
  },
  {
    Icon: MessageCircle,
    title: "Direct Messaging",
    desc: "Chat with sellers and buyers without leaving the app.",
  },
  {
    Icon: ShoppingCart,
    title: "Seamless Checkout",
    desc: "Order from multiple sellers in one checkout with M-Pesa support.",
  },
  {
    Icon: Bell,
    title: "Real-time Notifications",
    desc: "Stay updated on orders, messages, and price drops instantly.",
  },
  {
    Icon: Leaf,
    title: "Verified Sellers",
    desc: "All sellers are vetted to ensure product quality and reliability.",
  },
  {
    Icon: Package,
    title: "Order Tracking",
    desc: "Track every order from confirmation through to delivery.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
// Main landing page. Sections in order:
//   Hero → Stats → How it works → Features → CTA banner → Wholesale form → Testimonial

function Body() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Tracks which testimonial is currently visible.
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Advances to the next testimonial every 5 seconds; resets on manual selection.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTestimonial]);

  // Wholesale inquiry form state — swap handleSubmit for a real API call when ready
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institution: "",
    interest: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Helper to update a single form field without replacing the whole object
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Saves the wholesale inquiry to Supabase and shows the success state.
  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("wholesale_inquiries").insert({
      first_name: form.firstName,
      last_name:  form.lastName,
      email:      form.email,
      institution: form.institution,
      interest:   form.interest,
    });
    setSubmitted(true);
  };

  return (
    <Page>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroDecor
          style={{ width: 600, height: 600, top: -250, right: -180 }}
        />
        <HeroDecor
          style={{ width: 300, height: 300, bottom: -80, left: -60 }}
        />
        <HeroInner>
          <HeroLeft>
            <HeroEyebrow>The Marketplace for Local Food & Farms</HeroEyebrow>
            <HeroTitle>
              Direct From <HeroGreen>the Farm</HeroGreen> to Your Table
            </HeroTitle>
            <HeroSub>
              Discover, buy, and sell fresh local produce directly. Connect with
              trusted farmers and buyers across Kenya. No middlemen, no markup.
            </HeroSub>
            <HeroCtas>
              <CtaPrimary onClick={() => navigate(user ? "/mobile" : "/sign-up")}>
                Get Started Free
              </CtaPrimary>
              <CtaSecondary onClick={() => navigate("/agritourism")}>
                Learn More
              </CtaSecondary>
            </HeroCtas>
          </HeroLeft>

          <HeroRight>
            <AppMockup
              loading="lazy"
              src="/app screenshot.webp"
              alt="Afarmer™ app screenshot"
            />
          </HeroRight>
        </HeroInner>
      </Hero>

      {/* ── Stats strip — update numbers as the platform grows ── */}
      <StatsStrip>
        <StatsInner>
          <StatItem>
            <StatNumber>500+</StatNumber>
            <StatLabel>Active Farms</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>12K+</StatNumber>
            <StatLabel>Buyers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>8K+</StatNumber>
            <StatLabel>Listings</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>30+</StatNumber>
            <StatLabel>Counties</StatLabel>
          </StatItem>
        </StatsInner>
      </StatsStrip>

      {/* ── How it works — driven by HOW_ITEMS array above ── */}
      <Section>
        <SectionEyebrow $center>How it works</SectionEyebrow>
        <SectionTitle $center>Three steps to fresh food</SectionTitle>
        <SectionSub $center>
          Whether you're a farmer looking to sell or a buyer looking for fresh
          produce, Afarmer™ makes the connection simple.
        </SectionSub>
        <HowItWorksGrid>
          {HOW_ITEMS.map((item, i) => (
            <HowCard key={item.title} $i={i}>
              <HowIcon>
                <img loading="lazy" src={item.icon} alt={item.title} />
              </HowIcon>
              <HowTitle>{item.title}</HowTitle>
              <HowText>{item.text}</HowText>
              <HowLink onClick={() => navigate(item.link)}>
                Learn more →
              </HowLink>
            </HowCard>
          ))}
        </HowItWorksGrid>
      </Section>

      {/* ── Features grid ── */}
      <div style={{ background: "white", padding: "72px 0" }}>
        <Section $pad="0 32px">
          <SectionEyebrow $center>Everything you need</SectionEyebrow>
          <SectionTitle $center>Built for farmers and buyers</SectionTitle>
          <SectionSub $center>
            Every feature is designed to make local food commerce faster,
            simpler, and more transparent.
          </SectionSub>
          <FeatureGrid>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} $i={i}>
                <FeatureIconBox><f.Icon size={24} /></FeatureIconBox>
                <FeatureText>
                  <FeatureTitle>{f.title}</FeatureTitle>
                  <FeatureDesc>{f.desc}</FeatureDesc>
                </FeatureText>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Section>
      </div>

      {/* ── Download CTA banner ── */}
      <Section>
        <CtaBanner>
          <div style={{ position: "relative", zIndex: 1 }}>
            <CtaBannerTitle>
              Start buying and selling locally today
            </CtaBannerTitle>
            <CtaBannerSub>
              Join thousands of Kenyan farmers and buyers already on the
              platform. Free to sign up, free to list.
            </CtaBannerSub>
          </div>
          <CtaBannerBtn onClick={() => navigate(user ? "/mobile" : "/sign-up")}>
            Create Free Account
          </CtaBannerBtn>
        </CtaBanner>
      </Section>

      {/* ── Wholesale inquiry form ── */}
      <div style={{ background: "white", padding: "72px 0" }}>
        <Section $pad="0 32px">
          <SectionEyebrow $center>Wholesale Programme</SectionEyebrow>
          <SectionTitle $center>Institutional & Bulk Purchasing</SectionTitle>
          <SectionSub $center>
            Are you a food buyer for a restaurant, retailer, or institution?
            Source directly from a network of hundreds of farms across Kenya.
          </SectionSub>
          <FormCard>
            {submitted ? (
              <SuccessMsg>
                <Check size={14} style={{marginRight:4}} />Thank you! We'll be in touch within 1–2 business days.
              </SuccessMsg>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormGrid $cols="1fr 1fr" style={{ marginBottom: 18 }}>
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      placeholder="e.g. Faith"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      placeholder="e.g. Otieno"
                      required
                    />
                  </Field>
                </FormGrid>
                <FormGrid style={{ marginBottom: 18 }}>
                  <Field>
                    <FieldLabel htmlFor="email">Email Address *</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </Field>
                </FormGrid>
                <FormGrid style={{ marginBottom: 18 }}>
                  <Field>
                    <FieldLabel htmlFor="institution">
                      Institution / Company *
                    </FieldLabel>
                    <Input
                      id="institution"
                      value={form.institution}
                      onChange={(e) => set("institution", e.target.value)}
                      placeholder="e.g. Nairobi Hospital"
                      required
                    />
                  </Field>
                </FormGrid>
                <FormGrid style={{ marginBottom: 24 }}>
                  <Field>
                    <FieldLabel htmlFor="interest">
                      What produce are you interested in sourcing? *
                    </FieldLabel>
                    <Textarea
                      id="interest"
                      value={form.interest}
                      onChange={(e) => set("interest", e.target.value)}
                      placeholder="e.g. 50kg tomatoes weekly, fresh dairy, organic vegetables…"
                      required
                    />
                  </Field>
                </FormGrid>
                <SubmitBtn type="submit">Submit Inquiry →</SubmitBtn>
              </form>
            )}
          </FormCard>
        </Section>
      </div>

      {/* ── Testimonials carousel — auto-advances every 5 s, dots for manual nav ── */}
      <TestimonialWrap>
        <TestimonialInner>
          <QuoteIcon>"</QuoteIcon>

          {/* key prop re-mounts the element so the fade animation replays on each change */}
          <QuoteBody key={activeTestimonial}>
            <QuoteText>{TESTIMONIALS[activeTestimonial].quote}</QuoteText>
            <QuoteAuthor>
              <AuthorAvatar>
                {TESTIMONIALS[activeTestimonial].initial}
              </AuthorAvatar>
              <AuthorInfo>
                <AuthorName>{TESTIMONIALS[activeTestimonial].name}</AuthorName>
                <AuthorRole>{TESTIMONIALS[activeTestimonial].role}</AuthorRole>
              </AuthorInfo>
            </QuoteAuthor>
          </QuoteBody>

          <DotRow>
            {TESTIMONIALS.map((_, i) => (
              <Dot
                key={i}
                $active={i === activeTestimonial}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </DotRow>
        </TestimonialInner>
      </TestimonialWrap>

      <FooterContainer />
    </Page>
  );
}

export default Body;
