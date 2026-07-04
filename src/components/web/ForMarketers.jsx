import styled, { keyframes } from "styled-components";
import { Store, Megaphone, Handshake } from "lucide-react";
import SEO from "./SEO";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    Icon: Store,
    title: "One Hub for Your Whole Market",
    text: "Create a profile for your farmers market, list all your vendors, upcoming events, and seasonal highlights — all in one discoverable place.",
  },
  {
    Icon: Megaphone,
    title: "Promote Beyond Market Day",
    text: "Stay connected with your community year-round. Post event updates, new vendor arrivals, and seasonal produce guides that keep shoppers coming back.",
  },
  {
    Icon: Handshake,
    title: "Connect Vendors & Shoppers",
    text: "Help vendors build direct relationships with buyers. Shoppers can follow their favourite stalls, message sellers, and plan their visits ahead of time.",
  },
  {
    icon: "🆓",
    title: "Free to Get Started",
    text: "Create your market profile and post up to 3 listings at no cost. Upgrade for unlimited listings when your market is ready to grow.",
  },
];

const FAQS = [
  {
    q: "How do I list my products on AFARMER™__TM__?",
    a: "AFARMER™__TM__ helps buyers and sellers connect. Create a free profile, add your listings, and buyers can find you through search. Transactions happen in person — no fees involved.",
  },
  {
    q: "I'm a Market Manager — can I use AFARMER™?",
    a: "Absolutely. Create a profile for your market and use it to connect with vendors and customers on and off the app. We encourage market managers to use AFARMER™ to promote their market, events, and highlight their vendors.",
  },
  {
    q: "What kinds of products can I list?",
    a: "AFARMER™ supports a wide range of locally sourced goods — fresh produce, meat, dairy, honey, baked goods, specialty food items, and more. Whether you're a small-scale farmer or artisanal producer, there's a place for your products.",
  },
  {
    q: "Can I use AFARMER™ for wholesale buying and selling?",
    a: "Yes. Our platform is flexible enough to accommodate wholesale arrangements. Buyers can contact sellers directly to discuss quantities, pricing, and delivery terms.",
  },
  {
    q: "Is there a cost for buyers?",
    a: "No. Browsing and contacting sellers is completely free for buyers. There are no transaction fees — payments happen between you and the seller directly.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ForMarketers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = React.useState(null);
  return (
    <>
      <SEO title="For Market Managers" description="Use AFARMER™ to manage your farmers market, connect with vendors, promote events, and grow your market community." path="/for-farmersmarket" />
            <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>For Farmers Market Communities</Eyebrow>
          <HeroTitle>
            Grow Your
            <br />
            Farmers Market
          </HeroTitle>
          <HeroSub>
            Connect vendors and shoppers, promote events, and build a thriving
            local food community — beyond just market days.
          </HeroSub>
          <HeroActions>
            <PrimaryBtn onClick={() => navigate(user ? "/mobile" : "/sign-up")}>
              Get Started Free
            </PrimaryBtn>
            <OutlineBtn onClick={() => navigate("/pricing")}>
              View Pricing
            </OutlineBtn>
          </HeroActions>
          <HeroNote>Free to join · No transaction fees</HeroNote>
        </HeroInner>
      </Hero>

      {/* ── Market image ── */}
      <ImageBanner>
        <img src="/market.webp" alt="Farmers market" loading="lazy" decoding="async" />
      </ImageBanner>

      {/* ── Benefits ── */}
      <Section>
        <Inner>
          <SectionLabel>Why AFARMER™__TM__</SectionLabel>
          <SectionTitle>Everything Your Market Community Needs</SectionTitle>
          <SectionDivider />
          <BenefitsGrid>
            {BENEFITS.map((b) => (
              <BenefitCard key={b.title}>
                <BenefitIcon>{b.Icon ? <b.Icon size={24} /> : b.icon}</BenefitIcon>
                <BenefitTitle>{b.title}</BenefitTitle>
                <BenefitText>{b.text}</BenefitText>
              </BenefitCard>
            ))}
          </BenefitsGrid>
        </Inner>
      </Section>

      {/* ── Start today strip ── */}
      <StartStrip>
        <StartInner>
          <StartLabel>Begin Your Journey Today at No Cost</StartLabel>
          <StartTitle>Set Up a Free Profile in Minutes</StartTitle>
          <StartSub>
            Create your market or vendor profile, post up to 3 listings, and
            start connecting with local buyers immediately. Need more? Upgrade
            to unlimited listings for just Kes 10 per month.
          </StartSub>
          <PrimaryBtn onClick={() => navigate(user ? "/mobile" : "/sign-up")}>
            Get Started Today
          </PrimaryBtn>
        </StartInner>
      </StartStrip>

      {/* ── FAQ ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle>Common Questions</SectionTitle>
          <SectionDivider />
          <FaqList>
            {FAQS.map((faq, i) => (
              <FaqItem key={i}>
                <FaqQuestion
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <FaqChevron $open={openFaq === i}>›</FaqChevron>
                </FaqQuestion>
                {openFaq === i && <FaqAnswer>{faq.a}</FaqAnswer>}
              </FaqItem>
            ))}
          </FaqList>
        </Inner>
      </Section>

      {/* ── Testimonial ── */}
      <TestimonialSection>
        <TestimonialInner>
          <QuoteMark>"</QuoteMark>
          <TestimonialText>
            I began using AFARMER™__TM__ about a month ago when we struggled to
            attract new customers in our area. Already, several people have
            contacted us, mentioning they discovered us on AFARMER™__TM__ and
            inquiring about our animal raising practices and produce care. I
            will keep using AFARMER™__TM__ to help promote our new small homestead.
          </TestimonialText>
          <TestimonialAuthor>— Benard Onyango, Local Farmer</TestimonialAuthor>
        </TestimonialInner>
      </TestimonialSection>

      {/* ── CTA ── */}
      <CtaBanner>
        <CtaTitle>Ready to Grow Your Market Community?</CtaTitle>
        <CtaSub>
          Join farmers and market managers already connecting on AFARMER™__TM__.
        </CtaSub>
        <PrimaryBtn onClick={() => navigate(user ? "/mobile" : "/sign-up")}>
          Start for Free
        </PrimaryBtn>
      </CtaBanner>

      <FooterContainer />
    </>
  );
};

// Need React for useState
import React from "react";
export default ForMarketers;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(140deg, #1a2e3b 0%, #1e4a3a 55%, #2f5a2a 100%);
  padding: 96px 24px 112px;
  text-align: center;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    top: -120px;
    right: -80px;
  }
`;
const HeroInner = styled.div`
  max-width: 680px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.6s ease;
`;
const Eyebrow = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.74rem;
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
  color: rgba(255, 255, 255, 0.78);
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
  border: 2px solid rgba(255, 255, 255, 0.45);
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
  margin: 16px 0 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
`;

const ImageBanner = styled.div`
  width: 100%;
  background: #f5f8f5;
  img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 480px;
    object-fit: cover;
  }
`;

const Section = styled.section`
  padding: 80px 24px;
  background: ${({ $alt }) => ($alt ? "#f5f8f5" : "white")};
`;
const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;
const SectionLabel = styled.p`
  text-align: center;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 10px;
`;
const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
`;
const SectionDivider = styled.div`
  width: 44px;
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px;
  margin: 0 auto 52px;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
`;
const BenefitCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 28px 24px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 3px 16px rgba(20, 57, 32, 0.06);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(20, 57, 32, 0.1);
  }
`;
const BenefitIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 14px;
`;
const BenefitTitle = styled.h3`
  font-size: 0.97rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
`;
const BenefitText = styled.p`
  font-size: 0.87rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
`;

const StartStrip = styled.section`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-top: 1px solid #d1fae5;
  border-bottom: 1px solid #d1fae5;
  padding: 72px 24px;
  text-align: center;
`;
const StartInner = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;
const StartLabel = styled.p`
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 10px;
`;
const StartTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
`;
const StartSub = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.75;
  margin: 0 0 28px;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.07);
  max-width: 720px;
  margin: 0 auto;
`;
const FaqItem = styled.div`
  background: white;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
  }
`;
const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.93rem;
  font-weight: 700;
  color: #1a3318;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #fafcfa;
  }
`;
const FaqChevron = styled.span`
  font-size: 1.4rem;
  color: #2f5a2a;
  flex-shrink: 0;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0deg)")};
`;
const FaqAnswer = styled.div`
  padding: 0 24px 20px;
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.75;
`;

const TestimonialSection = styled.section`
  background: #1a3318;
  padding: 72px 24px;
  text-align: center;
`;
const TestimonialInner = styled.div`
  max-width: 680px;
  margin: 0 auto;
`;
const QuoteMark = styled.div`
  font-size: 4rem;
  color: #4e9643;
  line-height: 1;
  margin-bottom: 8px;
`;
const TestimonialText = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  font-style: italic;
  margin: 0 0 20px;
`;
const TestimonialAuthor = styled.p`
  font-size: 0.85rem;
  font-weight: 700;
  color: #4e9643;
  margin: 0;
  letter-spacing: 0.04em;
`;

const CtaBanner = styled.section`
  background: linear-gradient(135deg, #1a3318 0%, #2f5a2a 100%);
  padding: 80px 24px;
  text-align: center;
`;
const CtaTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2.1rem);
  font-weight: 800;
  color: white;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
`;
const CtaSub = styled.p`
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  margin: 0 0 28px;
`;
