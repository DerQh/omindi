import styled, { keyframes } from "styled-components";
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
    title: "Create Your Listing",
    text: "Post up to 3 active listings for free — fresh produce, packaged goods, or farm events. Add photos, set your price, and describe what makes your product special.",
  },
  {
    num: "02",
    title: "Connect with Buyers",
    text: "Buyers discover your farm through search and reach out via in-app messaging. Respond to inquiries, answer questions about your practices, and build trust.",
  },
  {
    num: "03",
    title: "Complete the Sale",
    text: "Arrange a meetup, porch pickup, roadside farmstand, or any in-person exchange that works for you. Accept cash, mobile money, or whatever suits your buyer.",
  },
];

const FEATURES = [
  {
    icon: "🌿",
    title: "Free to Start",
    text: "No upfront costs. Create your profile and list up to 3 products at no charge. Upgrade to unlimited listings for just Kes 10/month when you're ready to scale.",
  },
  {
    icon: "📅",
    title: "Event Listings",
    text: "Promote farm tours, U-pick days, workshops, plant sales, and any agriculture-related event. Reach local customers actively looking for experiences like yours.",
  },
  {
    icon: "💬",
    title: "In-App Messaging",
    text: "Communicate with buyers safely inside the platform. No need to share personal numbers — coordinate transactions, answer questions, and build relationships.",
  },
  {
    icon: "📍",
    title: "Local Discovery",
    text: "Buyers search by keyword and location. Your listings surface to the right audience — people nearby who are actively looking for locally grown food.",
  },
  {
    icon: "🔄",
    title: "Always Up to Date",
    text: "Swap, update, or remove listings whenever you like. Running out of tomatoes? Mark it sold. New crop ready? Add it in minutes.",
  },
  {
    icon: "👥",
    title: "Build a Following",
    text: "Buyers can follow your farm and get notified when you post new listings. Turn one-time customers into regulars without any marketing spend.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ForFarms = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>For Farmers & Growers</Eyebrow>
          <HeroTitle>
            Built for Farmers.
            <br />
            Designed to Sell.
          </HeroTitle>
          <HeroSub>
            List your fresh produce, farm products, and events for free. Connect
            with local buyers and grow your farm business on your own terms.
          </HeroSub>
          <HeroActions>
            <PrimaryBtn onClick={() => navigate("/sign-up")}>
              Start Selling Free
            </PrimaryBtn>
            <OutlineBtn onClick={() => navigate("/pricing")}>
              See Pricing
            </OutlineBtn>
          </HeroActions>
          <HeroNote>
            No credit card required · 3 free listings to start
          </HeroNote>
        </HeroInner>
      </Hero>

      {/* ── How it works ── */}
      <Section>
        <Inner>
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>Sell in Three Simple Steps</SectionTitle>
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
          <img src="/For Consumers.png" alt="AFARMER™ platform for farmers" />
        </ImageInner>
      </ImageSection>

      {/* ── Features ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>Everything You Need</SectionLabel>
          <SectionTitle>Tools Built Around How Farmers Work</SectionTitle>
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

      {/* ── Sell local strip ── */}
      <LocalStrip>
        <LocalInner>
          <LocalText>
            <LocalTitle>No Shipping. No Middlemen.</LocalTitle>
            <LocalSub>
              Search for buyers by keyword or location, connect directly, and
              close the sale in person. Payments stay between you and the buyer
              — we never take a cut.
            </LocalSub>
          </LocalText>
          <LocalImg src="/farming.jpg" alt="Local farm sale" />
        </LocalInner>
      </LocalStrip>

      {/* ── CTA ── */}
      <CtaBanner>
        <CtaTitle>Ready to Reach More Buyers?</CtaTitle>
        <CtaSub>Join hundreds of farmers already selling on AFARMER™__TM__.</CtaSub>
        <PrimaryBtn onClick={() => navigate("/sign-up")}>
          Set Up Your Listing
        </PrimaryBtn>
      </CtaBanner>

      <FooterContainer />
    </>
  );
};

export default ForFarms;

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
