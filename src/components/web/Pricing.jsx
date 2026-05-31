import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import { useNavigate } from "react-router-dom";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Plans data ───────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Perfect to get started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Get Started Free",
    ctaPath: "/sign-up",
    popular: false,
    features: [
      { text: "Up to 50 active listings", included: true },
      { text: "Basic farm profile", included: true },
      { text: "Buyer messaging & inquiries", included: true },
      { text: "Community access", included: true },
      { text: "Listings never expire", included: true },
      { text: "Unlimited listings", included: false },
      { text: "Permanent farm landing page", included: false },
      { text: "Priority search visibility", included: false },
      { text: "Sales analytics dashboard", included: false },
    ],
  },
  {
    id: "pro",
    name: "Limitless",
    tagline: "For serious sellers",
    monthlyPrice: 10,
    yearlyPrice: 99,
    cta: "Upgrade Now",
    ctaPath: "/sign-up",
    popular: true,
    features: [
      { text: "Unlimited active listings", included: true },
      { text: "Basic farm profile", included: true },
      { text: "Buyer messaging & inquiries", included: true },
      { text: "Community access", included: true },
      { text: "Listings never expire", included: true },
      { text: "Unlimited listings", included: true },
      { text: "Permanent farm landing page", included: true },
      { text: "Priority search visibility", included: true },
      { text: "Sales analytics dashboard", included: true },
    ],
  },
];

const FAQS = [
  {
    q: "Is the free plan really free forever?",
    a: "Yes. The free plan has no time limit and no credit card required. You can create up to 50 active listings and use all core features indefinitely.",
  },
  {
    q: "Can I cancel my paid plan at any time?",
    a: "Absolutely. You can cancel at any time and your listings will revert to the free tier limits at the end of your billing period.",
  },
  {
    q: "What happens to my extra listings if I downgrade?",
    a: "Your listings will remain visible until you reach the free plan limit. You'll be prompted to choose which 50 to keep active.",
  },
  {
    q: "Is there a discount for yearly billing?",
    a: "Yes — paying yearly works out to just Kes 8.25/month, saving you Kes 21 compared to monthly billing.",
  },
  {
    q: "Do you support mobile payments like M-Pesa?",
    a: "We're working on M-Pesa integration. For now, reach out to our team to arrange payment for the Limitless plan.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Pricing = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly"); // "monthly" | "yearly"
  const [openFaq, setOpenFaq] = useState(null);

  const yearlySaving = PLANS[1].monthlyPrice * 12 - PLANS[1].yearlyPrice;

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>Simple Pricing</Eyebrow>
          <HeroTitle>Sell Local. Start Free.</HeroTitle>
          <HeroSub>
            AFARMER is free to join, list, and sell. Upgrade when you're ready
            to grow without limits.
          </HeroSub>

          {/* Billing toggle */}
          <BillingToggle>
            <ToggleBtn
              $active={billing === "monthly"}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </ToggleBtn>
            <ToggleBtn
              $active={billing === "yearly"}
              onClick={() => setBilling("yearly")}
            >
              Yearly
              <SaveBadge>Save Kes {yearlySaving}</SaveBadge>
            </ToggleBtn>
          </BillingToggle>
        </HeroInner>
      </Hero>

      {/* ── Pricing cards ── */}
      <CardsSection>
        <CardsInner>
          <CardsGrid>
            {PLANS.map((plan) => {
              const price =
                billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
              const period = billing === "yearly" ? "/ year" : "/ month";
              return (
                <PlanCard key={plan.id} $popular={plan.popular}>
                  {plan.popular && <PopularBadge>Most Popular</PopularBadge>}

                  <PlanTop>
                    <PlanName>{plan.name}</PlanName>
                    <PlanTagline>{plan.tagline}</PlanTagline>

                    <PriceRow>
                      {price === 0 ? (
                        <PriceAmount>Free</PriceAmount>
                      ) : (
                        <>
                          <PriceCurrency>Kes</PriceCurrency>
                          <PriceAmount>{price}</PriceAmount>
                          <PricePeriod>{period}</PricePeriod>
                        </>
                      )}
                    </PriceRow>

                    {billing === "yearly" && plan.monthlyPrice > 0 && (
                      <PriceNote>
                        Kes {(plan.yearlyPrice / 12).toFixed(2)} / month billed
                        annually
                      </PriceNote>
                    )}
                  </PlanTop>

                  <PlanCta
                    $popular={plan.popular}
                    onClick={() => navigate(plan.ctaPath)}
                  >
                    {plan.cta}
                  </PlanCta>

                  <FeatureList>
                    {plan.features.map((f, i) => (
                      <FeatureItem key={i} $included={f.included}>
                        <FeatureIcon $included={f.included}>
                          {f.included ? "✓" : "✕"}
                        </FeatureIcon>
                        {f.text}
                      </FeatureItem>
                    ))}
                  </FeatureList>
                </PlanCard>
              );
            })}
          </CardsGrid>

          <GuaranteeBanner>
            🔒 No credit card required for the free plan · Cancel anytime ·
            Trusted by 500+ farmers across Kenya
          </GuaranteeBanner>
        </CardsInner>
      </CardsSection>

      {/* ── Feature comparison table ── */}
      <CompareSection>
        <CompareInner>
          <SectionLabel>Compare Plans</SectionLabel>
          <SectionTitle>Everything You Need to Sell More</SectionTitle>
          <Divider />

          <CompareTable>
            <thead>
              <tr>
                <CompareTh $feature>Feature</CompareTh>
                <CompareTh>Free</CompareTh>
                <CompareTh $highlight>Limitless</CompareTh>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Active listings", free: "50", pro: "Unlimited" },
                {
                  label: "Farm profile",
                  free: "Basic",
                  pro: "Full landing page",
                },
                { label: "Buyer messaging", free: "✓", pro: "✓" },
                { label: "Community access", free: "✓", pro: "✓" },
                { label: "Listing expiry", free: "None", pro: "None" },
                { label: "Priority search ranking", free: "—", pro: "✓" },
                { label: "Sales analytics", free: "—", pro: "✓" },
                { label: "Dedicated farm page URL", free: "—", pro: "✓" },
                { label: "Support", free: "Community", pro: "Priority" },
              ].map((row) => (
                <CompareTr key={row.label}>
                  <CompareTd $feature>{row.label}</CompareTd>
                  <CompareTd>{row.free}</CompareTd>
                  <CompareTd $highlight>{row.pro}</CompareTd>
                </CompareTr>
              ))}
            </tbody>
          </CompareTable>
        </CompareInner>
      </CompareSection>

      {/* ── FAQ ── */}
      <FaqSection>
        <FaqInner>
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle>Common Questions</SectionTitle>
          <Divider />

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
        </FaqInner>
      </FaqSection>

      {/* ── CTA banner ── */}
      <CtaBanner>
        <CtaTitle>Ready to Reach More Buyers?</CtaTitle>
        <CtaSub>
          Join thousands of local farmers already growing with AFARMER.
        </CtaSub>
        <CtaButtons>
          <CtaPrimary onClick={() => navigate("/sign-up")}>
            Start for Free
          </CtaPrimary>
          <CtaSecondary onClick={() => navigate("/sign-up")}>
            Upgrade to Limitless
          </CtaSecondary>
        </CtaButtons>
      </CtaBanner>

      <FooterContainer />
    </>
  );
};

export default Pricing;

// ─── Styled components ────────────────────────────────────────────────────────

// ── Hero ──

const Hero = styled.section`
  background: linear-gradient(140deg, #1a3318 0%, #2f5a2a 55%, #4e9643 100%);
  padding: 90px 24px 110px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    top: -160px;
    right: -100px;
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
  margin: 0 0 16px;
  line-height: 1.15;
`;

const HeroSub = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0 0 36px;
`;

const BillingToggle = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 4px;
  gap: 4px;
`;

const ToggleBtn = styled.button`
  padding: 8px 22px;
  border-radius: 999px;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? "white" : "transparent")};
  color: ${({ $active }) => ($active ? "#2f5a2a" : "rgba(255,255,255,0.75)")};
`;

const SaveBadge = styled.span`
  background: #4e9643;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.02em;
`;

// ── Cards ──

const CardsSection = styled.section`
  background: #f5f8f5;
  padding: 0 24px 60px;
`;

const CardsInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: -48px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 36px 32px;
  border: ${({ $popular }) =>
    $popular ? "2px solid #2f5a2a" : "1px solid #e8f5e9"};
  box-shadow: ${({ $popular }) =>
    $popular
      ? "0 12px 48px rgba(20,57,32,0.15)"
      : "0 4px 24px rgba(20,57,32,0.07)"};
  position: relative;
  animation: ${fadeUp} 0.5s ease;
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #2f5a2a;
  color: white;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 18px;
  border-radius: 999px;
  white-space: nowrap;
`;

const PlanTop = styled.div`
  margin-bottom: 28px;
`;

const PlanName = styled.h2`
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 4px;
`;

const PlanTagline = styled.p`
  font-size: 0.85rem;
  color: #9ca3af;
  margin: 0 0 20px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  margin-bottom: 4px;
`;

const PriceCurrency = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2f5a2a;
  padding-bottom: 6px;
`;

const PriceAmount = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #1a3318;
  line-height: 1;
`;

const PricePeriod = styled.span`
  font-size: 0.9rem;
  color: #9ca3af;
  font-weight: 500;
  padding-bottom: 8px;
`;

const PriceNote = styled.p`
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
`;

const PlanCta = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 28px;
  transition: all 0.2s;
  background: ${({ $popular }) => ($popular ? "#2f5a2a" : "white")};
  color: ${({ $popular }) => ($popular ? "white" : "#2f5a2a")};
  border: 2px solid #2f5a2a;

  &:hover {
    background: ${({ $popular }) => ($popular ? "#245026" : "#eef7ee")};
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(20, 57, 32, 0.15);
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: ${({ $included }) => ($included ? "#374151" : "#d1d5db")};
`;

const FeatureIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 800;
  flex-shrink: 0;
  background: ${({ $included }) => ($included ? "#f0fdf4" : "#f9fafb")};
  color: ${({ $included }) => ($included ? "#16a34a" : "#d1d5db")};
`;

const GuaranteeBanner = styled.p`
  text-align: center;
  margin-top: 28px;
  font-size: 0.82rem;
  color: #9ca3af;
  font-weight: 500;
`;

// ── Shared section styles ──

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

const Divider = styled.div`
  width: 44px;
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px;
  margin: 0 auto 48px;
`;

// ── Compare table ──

const CompareSection = styled.section`
  padding: 80px 24px;
  background: white;
`;

const CompareInner = styled.div`
  max-width: 820px;
  margin: 0 auto;
`;

const CompareTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.07);
  border: 1px solid #e8f5e9;
`;

const CompareTh = styled.th`
  padding: 14px 20px;
  text-align: ${({ $feature }) => ($feature ? "left" : "center")};
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ $highlight }) => ($highlight ? "#2f5a2a" : "#6b7280")};
  background: ${({ $highlight }) => ($highlight ? "#f0fdf4" : "#f9fafb")};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 2px solid #e8f5e9;
`;

const CompareTr = styled.tr`
  &:nth-child(even) {
    background: #fafcfa;
  }
  &:hover {
    background: #f0fdf4;
  }
`;

const CompareTd = styled.td`
  padding: 14px 20px;
  text-align: ${({ $feature }) => ($feature ? "left" : "center")};
  color: ${({ $highlight, $feature }) =>
    $highlight ? "#2f5a2a" : $feature ? "#374151" : "#6b7280"};
  font-weight: ${({ $highlight, $feature }) =>
    $highlight ? "700" : $feature ? "600" : "400"};
  border-bottom: 1px solid #f3f4f6;
`;

// ── FAQ ──

const FaqSection = styled.section`
  padding: 80px 24px;
  background: #f5f8f5;
`;

const FaqInner = styled.div`
  max-width: 680px;
  margin: 0 auto;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.07);
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

// ── CTA banner ──

const CtaBanner = styled.section`
  background: linear-gradient(135deg, #1a3318 0%, #2f5a2a 100%);
  padding: 80px 24px;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  color: white;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
`;

const CtaSub = styled.p`
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  margin: 0 0 32px;
`;

const CtaButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
`;

const CtaPrimary = styled.button`
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

const CtaSecondary = styled.button`
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
