import styled, { keyframes } from "styled-components";
import SEO from "./SEO";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Browse Local Listings",
    text: "Search fresh produce, farm products, and seasonal goods from farmers near you. Filter by category, location, or seller to find exactly what you need.",
  },
  {
    num: "02",
    title: "Contact the Farmer",
    text: "Message sellers directly through the platform — no middlemen, no hidden fees. Ask about availability, quantities, and arrange a pickup or delivery.",
  },
  {
    num: "03",
    title: "Buy Fresh, Buy Local",
    text: "Complete the purchase directly with the farmer. Pay by cash, mobile money, or whatever works for both of you. Every shilling goes straight to the grower.",
  },
];

const FEATURES = [
  {
    icon: "🥬",
    title: "Fresh from the Source",
    text: "Buy directly from the farmers who grew it. No cold-storage middlemen, no long supply chains — just fresh produce straight to your door or your hands.",
  },
  {
    icon: "💸",
    title: "Better Prices, Always",
    text: "Because you're buying directly, you skip the markup. Farmers earn more and you pay less — a win for everyone in the chain.",
  },
  {
    icon: "📍",
    title: "Hyperlocal Discovery",
    text: "Find farms and sellers within your county or city. Support your neighbours, reduce food miles, and know exactly where your food comes from.",
  },
  {
    icon: "💬",
    title: "Direct Messaging",
    text: "Chat with sellers safely inside the app. Ask about harvest dates, organic practices, bulk pricing, and more without sharing your personal number.",
  },
  {
    icon: "❤️",
    title: "Follow Your Favourites",
    text: "Follow the farms you love and get notified the moment they post new listings. Never miss your favourite farmer's tomato season again.",
  },
  {
    icon: "⭐",
    title: "Verified Reviews",
    text: "Read ratings and reviews from other buyers before you commit. Honest feedback from real customers helps you shop with confidence.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ForBuyers = () => {
  const navigate = useNavigate();
  return (
    <>
      <SEO
        title="For Buyers"
        description="Discover fresh produce and farm goods directly from local Kenyan farmers on AFARMER™. No middlemen, better prices, fresher food."
        path="/forbuyers"
      />
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>For Buyers & Consumers</Eyebrow>
          <HeroTitle>
            Fresh Food.
            <br />
            Direct from the Farm.
          </HeroTitle>
          <HeroSub>
            Discover local produce, connect directly with farmers, and buy
            fresh — no middlemen, no markup. Kenya's food, your way.
          </HeroSub>
          <HeroActions>
            <PrimaryBtn onClick={() => navigate("/mobile")}>
              Browse Listings
            </PrimaryBtn>
            <OutlineBtn onClick={() => navigate("/sign-up")}>
              Create Free Account
            </OutlineBtn>
          </HeroActions>
          <HeroNote>Free to join · No transaction fees</HeroNote>
        </HeroInner>
      </Hero>

      {/* ── How it works ── */}
      <Section>
        <Inner>
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>Buy Local in Three Simple Steps</SectionTitle>
          <SectionDivider />
          <StepsGrid>
            {STEPS.map((s) => (
              <StepCard key={s.num}>
                <StepNum>{s.num}</StepNum>
                <StepTitle>{s.title}</StepTitle>
                <StepText>{s.text}</StepText>
              </StepCard>
            ))}
          </StepsGrid>
        </Inner>
      </Section>

      {/* ── Feature image ── */}
      <ImageSection>
        <ImageInner>
          <img src="/For Consumers.webp" alt="AFARMER™ platform for buyers" loading="lazy" decoding="async" />
        </ImageInner>
      </ImageSection>

      {/* ── Features ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>Why Buy on AFARMER™</SectionLabel>
          <SectionTitle>Everything a Buyer Needs</SectionTitle>
          <SectionDivider />
          <FeaturesGrid>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureText>{f.text}</FeatureText>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Inner>
      </Section>

      {/* ── Local strip ── */}
      <LocalStrip>
        <LocalInner>
          <LocalText>
            <LocalTitle>Know Your Farmer. Know Your Food.</LocalTitle>
            <LocalSub>
              Every listing on AFARMER™ is posted by a real farmer or
              grower in Kenya. Browse their profile, read their story, check
              reviews from other buyers, and make informed decisions about
              what goes on your table.
            </LocalSub>
          </LocalText>
          <LocalImg src="/farming.webp" alt="Local farm fresh produce" />
        </LocalInner>
      </LocalStrip>

      {/* ── CTA ── */}
      <CtaBanner>
        <CtaTitle>Start Buying Fresh Today</CtaTitle>
        <CtaSub>
          Join thousands of Kenyans already buying directly from local farms.
        </CtaSub>
        <PrimaryBtn onClick={() => navigate("/sign-up")}>
          Create Your Free Account
        </PrimaryBtn>
      </CtaBanner>

      <FooterContainer />
    </>
  );
};

export default ForBuyers;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(140deg, #1a3318 0%, #2f5a2a 55%, #4e9643 100%);
  padding: 96px 24px 112px;
  text-align: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    width: 440px;
    height: 440px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    top: -140px;
    right: -100px;
  }
  &::after {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    bottom: -80px;
    left: -60px;
  }
`;
const HeroInner = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.6s ease;
`;
const Eyebrow = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 20px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  margin: 0 0 18px;
  line-height: 1.15;
`;
const HeroSub = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0 0 32px;
`;
const HeroActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;
const PrimaryBtn = styled.button`
  background: white;
  color: #2f5a2a;
  border: none;
  padding: 14px 30px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;
const OutlineBtn = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 14px 30px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.08);
  }
`;
const HeroNote = styled.p`
  margin: 18px 0 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
`;

const Section = styled.section`
  padding: 80px 24px;
  background: ${({ $alt }) => ($alt ? "#f5f8f5" : "white")};
`;
const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;
const SectionLabel = styled.p`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 10px;
`;
const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  letter-spacing: -0.3px;
  margin: 0 0 14px;
`;
const SectionDivider = styled.div`
  width: 44px;
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px;
  margin: 0 auto 52px;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
`;
const StepCard = styled.div`
  padding: 32px 28px;
  border-radius: 20px;
  border: 1px solid #e8f5e9;
  background: white;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.06);
  animation: ${fadeUp} 0.5s ease both;
`;
const StepNum = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #d1fae5;
  line-height: 1;
  margin-bottom: 16px;
`;
const StepTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 10px;
`;
const StepText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
`;

const ImageSection = styled.div`
  background: #f5f8f5;
  padding: 0;
`;
const ImageInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;
const FeatureCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px 24px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 2px 12px rgba(20, 57, 32, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(20, 57, 32, 0.1);
  }
`;
const FeatureIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 14px;
`;
const FeatureTitle = styled.h3`
  font-size: 0.97rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
`;
const FeatureText = styled.p`
  font-size: 0.87rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
`;

const LocalStrip = styled.section`
  background: linear-gradient(135deg, #f0fdf4, #e8f5e9);
  padding: 72px 24px;
  border-top: 1px solid #d1fae5;
  border-bottom: 1px solid #d1fae5;
`;
const LocalInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: center;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const LocalText = styled.div``;
const LocalTitle = styled.h2`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 16px;
  letter-spacing: -0.3px;
`;
const LocalSub = styled.p`
  font-size: 0.97rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0;
`;
const LocalImg = styled.img`
  width: 100%;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 12px 40px rgba(20, 57, 32, 0.12);
  aspect-ratio: 4/3;
`;

const CtaBanner = styled.section`
  background: linear-gradient(135deg, #1a3318 0%, #2f5a2a 100%);
  padding: 80px 24px;
  text-align: center;
`;
const CtaTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  color: white;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
`;
const CtaSub = styled.p`
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  margin: 0 0 32px;
`;
