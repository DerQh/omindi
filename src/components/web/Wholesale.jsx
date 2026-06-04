import React, { useState } from "react";
import SEO from "./SEO";
import { Helmet } from "react-helmet-async";
import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🤝",
    title: "Direct Buyer Relationships",
    text: "Build long-term wholesale relationships with restaurants, retailers, and food brands. Cut out the middlemen and negotiate directly.",
  },
  {
    icon: "📋",
    title: "One Profile, Two Markets",
    text: "Your single AFARMER™ profile works for both retail and wholesale buyers. Manage everything from one dashboard.",
  },
  {
    icon: "💬",
    title: "Direct Messaging",
    text: "Wholesale buyers can reach you directly through in-app messaging to discuss quantities, pricing, and delivery schedules.",
  },
  {
    icon: "🆓",
    title: "Free to Join",
    text: "No upfront fees to create your wholesale profile or list your products. Pay only when you're ready to scale with unlimited listings.",
  },
];

const FAQS = [
  {
    q: "How does the wholesale process work on AFARMER™?",
    a: "AFARMER™ connects farms with wholesale buyers such as retailers, restaurants, and food brands. Sellers create a free profile and listings. Buyers browse, message sellers directly, and arrange wholesale purchases — all without transaction fees.",
  },
  {
    q: "Are there any fees to join AFARMER™ and list products?",
    a: "AFARMER™ is free for farms to join. You can create a profile and list products without any upfront cost. Our platform is designed to make it easy for producers and buyers to connect and build relationships that support local food systems.",
  },
  {
    q: "What types of products can be bought and sold on AFARMER™?",
    a: "AFARMER™ supports a wide range of locally sourced and produced goods, including fresh produce, meat, dairy, honey, baked goods, and specialty food items. Whether you're a small-scale farmer, artisanal producer, or commercial grower, there's space for your products.",
  },
  {
    q: "Can I use AFARMER™ for both retail and wholesale sales?",
    a: "Yes. Your profile works for both. Local consumers and wholesale buyers both discover listings through the same platform — you manage all inquiries from one place.",
  },
  {
    q: "How do I arrange payment and delivery for wholesale orders?",
    a: "Payments and logistics are handled directly between you and the buyer — AFARMER™ facilitates the connection but doesn't process payments. This keeps things flexible and fee-free.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function Wholesale() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    companyName: "",
    companyWebsite: "",
    interestedItems: "",
    captchaAnswer: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (String(formData.captchaAnswer).trim() !== "45") {
      alert("Incorrect captcha answer. Hint: 9 × 5 = ?");
      return;
    }
    if (formData.email !== formData.confirmEmail) {
      alert("Email addresses do not match.");
      return;
    }
    console.log("Waitlist form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="Wholesale"
        description="Connect your farm with wholesale buyers — retailers, restaurants, and food brands — directly on AFARMER™. No transaction fees."
        path="/wholesale"
      />
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>Wholesale & Local Supply</Eyebrow>
          <HeroTitle>
            Become a Local
            <br />
            Food Supplier
          </HeroTitle>
          <HeroSub>
            Create, manage, and grow direct wholesale relationships with local
            food buyers — restaurants, retailers, and food brands — all from one
            free profile.
          </HeroSub>
          <HeroActions>
            <AnchorPrimary href="#waitlist">Join the Waitlist</AnchorPrimary>
            <AnchorOutline href="#how-it-works">How It Works</AnchorOutline>
          </HeroActions>
        </HeroInner>
      </Hero>

      {/* ── Wholesale image ── */}
      <FullImg>
        <img loading="lazy" src="/wholesale.png" alt="Wholesale farming" />
      </FullImg>

      {/* ── Features ── */}
      <Section id="how-it-works">
        <Inner>
          <SectionLabel>Why AFARMER™ Wholesale</SectionLabel>
          <SectionTitle>Everything You Need to Sell at Scale</SectionTitle>
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

      {/* ── One profile strip ── */}
      <ProfileStrip>
        <ProfileInner>
          <ProfileText>
            <SectionLabel style={{ textAlign: "left" }}>
              Get Started Today
            </SectionLabel>
            <ProfileTitle>
              One Profile.
              <br />
              Two Ways to Grow.
            </ProfileTitle>
            <ProfileSub>
              Grow your farm business on AFARMER™. Download the free app and
              start connecting with both retail customers and wholesale buyers
              from a single dashboard.
            </ProfileSub>
            <AppLinks>
              <AppLink href="#">
                <img loading="lazy" src="/app store.png" alt="App Store" />
              </AppLink>
              <AppLink href="#">
                <img loading="lazy" src="/google store.png" alt="Google Play" />
              </AppLink>
            </AppLinks>
          </ProfileText>
          <ProfileImgWrap>
            <img src="/app screenshot.png" alt="AFARMER™ app" />
          </ProfileImgWrap>
        </ProfileInner>
      </ProfileStrip>

      {/* ── How to use ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>Step by Step</SectionLabel>
          <SectionTitle>How to Use AFARMER™</SectionTitle>
          <SectionDivider />
          <HowImgStack>
            <HowImg
              src="/AFARMER_Mockup.png"
              alt="How to use AFARMER™ — step 1"
            />
            <HowImg
              src="/usermanagement.png"
              alt="How to use AFARMER™ — step 2"
            />
          </HowImgStack>
        </Inner>
      </Section>

      {/* ── FAQ ── */}
      <Section>
        <Inner>
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle>Common Questions</SectionTitle>
          <SectionDivider />
          <FaqList>
            {FAQS.map((faq, i) => (
              <FaqItem key={i}>
                <FaqQ onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <Chevron $open={openFaq === i}>›</Chevron>
                </FaqQ>
                {openFaq === i && <FaqA>{faq.a}</FaqA>}
              </FaqItem>
            ))}
          </FaqList>
        </Inner>
      </Section>

      {/* ── Waitlist form ── */}
      <FormSection id="waitlist">
        <FormInner>
          <FormLeft>
            <SectionLabel style={{ textAlign: "left" }}>
              Limited Early Access
            </SectionLabel>
            <FormHeading>Join the Waitlist</FormHeading>
            <FormIntro>
              Over the next few months, we'll be rolling out webinars,
              resources, and new wholesale profiles. Join the waitlist to be
              among the first to connect with local farms near you.
            </FormIntro>
            <WaitlistBullets>
              <li>Early access to wholesale buyer profiles</li>
              <li>Invitations to farm webinars & resources</li>
              <li>Direct introductions to local producers</li>
            </WaitlistBullets>
          </FormLeft>

          <FormRight>
            {submitted ? (
              <SuccessCard>
                <SuccessIcon>✅</SuccessIcon>
                <SuccessTitle>You're on the list!</SuccessTitle>
                <SuccessSub>
                  We'll be in touch with next steps and early access details.
                </SuccessSub>
              </SuccessCard>
            ) : (
              <FormCard>
                <form onSubmit={handleSubmit}>
                  <TwoCol>
                    <Field>
                      <FieldLabel>First Name *</FieldLabel>
                      <FieldInput
                        required
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Last Name *</FieldLabel>
                      <FieldInput
                        required
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Field>
                  </TwoCol>

                  <Field>
                    <FieldLabel>Email Address *</FieldLabel>
                    <FieldInput
                      required
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Confirm Email *</FieldLabel>
                    <FieldInput
                      required
                      type="email"
                      name="confirmEmail"
                      placeholder="you@example.com"
                      value={formData.confirmEmail}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Company or Organisation</FieldLabel>
                    <FieldInput
                      type="text"
                      name="companyName"
                      placeholder="Fresh Foods Ltd."
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Company Website</FieldLabel>
                    <FieldInput
                      type="url"
                      name="companyWebsite"
                      placeholder="https://yourcompany.com"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>
                      What items are you interested in buying from local farms?
                    </FieldLabel>
                    <FieldTextarea
                      name="interestedItems"
                      rows="3"
                      placeholder="e.g. Fresh produce, dairy, honey…"
                      value={formData.interestedItems}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Verify you're human: 9 × 5 = ?</FieldLabel>
                    <FieldInput
                      required
                      type="text"
                      name="captchaAnswer"
                      placeholder="Answer"
                      value={formData.captchaAnswer}
                      onChange={handleChange}
                      style={{ maxWidth: "120px" }}
                    />
                  </Field>

                  <SubmitBtn type="submit">Submit Application</SubmitBtn>
                </form>
              </FormCard>
            )}
          </FormRight>
        </FormInner>
      </FormSection>

      {/* ── Testimonial ── */}
      <TestimonialSection>
        <TestimonialInner>
          <QuoteMark>"</QuoteMark>
          <TestimonialText>
            AFARMER™ has resulted in both professional and personal
            relationships with incredible customers in my local community. Not
            only have I been able to network and make sales, but I have never
            eaten better or cleaner in my life. I downloaded it when I was the
            only producer within 50 miles — now there are over 40 in my town
            alone!
          </TestimonialText>
          <TestimonialAuthor>— Lazy C Cattle Co.</TestimonialAuthor>
        </TestimonialInner>
      </TestimonialSection>

      <FooterContainer />
    </>
  );
}

export default Wholesale;

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
const AnchorPrimary = styled.a`
  background: white;
  color: #2f5a2a;
  text-decoration: none;
  padding: 14px 30px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 800;
  transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;
const AnchorOutline = styled.a`
  background: transparent;
  color: white;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.45);
  padding: 14px 30px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  transition: all 0.2s;
  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const FullImg = styled.div`
  width: 100%;
  background: #f5f8f5;
  img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 500px;
    object-fit: cover;
  }
`;

const Section = styled.section`
  padding: 80px 24px;
  background: ${({ $alt }) => ($alt ? "#f5f8f5" : "white")};
`;
const Inner = styled.div`
  max-width: 1060px;
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

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;
const FeatureCard = styled.div`
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

const ProfileStrip = styled.section`
  background: linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%);
  border-top: 1px solid #d1fae5;
  border-bottom: 1px solid #d1fae5;
  padding: 72px 24px;
`;
const ProfileInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const ProfileText = styled.div``;
const ProfileTitle = styled.h2`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
  line-height: 1.2;
`;
const ProfileSub = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 24px;
`;
const AppLinks = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const AppLink = styled.a`
  img {
    max-width: 120px;
    height: auto;
    display: block;
    border-radius: 8px;
  }
`;
const ProfileImgWrap = styled.div`
  display: flex;
  justify-content: center;
  img {
    max-width: 280px;
    width: 100%;
    height: auto;
  }
`;

const HowImgStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(20, 57, 32, 0.07);
  }
`;
const HowImg = styled.img``;

const FaqList = styled.div`
  max-width: 720px;
  margin: 0 auto;
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
const FaqQ = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 24px;
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
const Chevron = styled.span`
  font-size: 1.4rem;
  color: #2f5a2a;
  flex-shrink: 0;
  transition: transform 0.2s;
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0deg)")};
`;
const FaqA = styled.div`
  padding: 0 24px 18px;
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.75;
`;

const FormSection = styled.section`
  background: #f5f8f5;
  padding: 80px 24px;
`;
const FormInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: start;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const FormLeft = styled.div``;
const FormHeading = styled.h2`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 14px;
  letter-spacing: -0.3px;
`;
const FormIntro = styled.p`
  font-size: 0.93rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 20px;
`;
const WaitlistBullets = styled.ul`
  padding-left: 18px;
  margin: 0;
  li {
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.8;
    margin-bottom: 6px;
    font-weight: 600;
  }
  li::marker {
    color: #4e9643;
  }
`;
const FormRight = styled.div``;
const FormCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.08);
  border: 1px solid #e8f5e9;
`;
const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
const Field = styled.div`
  margin-bottom: 16px;
`;
const FieldLabel = styled.label`
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1a3318;
  margin-bottom: 6px;
`;
const FieldInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 16px;
  color: #111827;
  background: #fafcfa;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
  font-family: inherit;
  &:focus {
    border-color: #2f5a2a;
  }
  &::placeholder {
    color: #d1d5db;
  }
`;
const FieldTextarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  font-size: 16px;
  color: #111827;
  background: #fafcfa;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.15s;
  &:focus {
    border-color: #2f5a2a;
  }
  &::placeholder {
    color: #d1d5db;
  }
`;
const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  background: #2f5a2a;
  color: white;
  border: none;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
  &:hover {
    background: #245026;
  }
`;
const SuccessCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 48px 32px;
  text-align: center;
  border: 1px solid #d1fae5;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.08);
`;
const SuccessIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 14px;
`;
const SuccessTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
`;
const SuccessSub = styled.p`
  font-size: 0.92rem;
  color: #6b7280;
  margin: 0;
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
`;
