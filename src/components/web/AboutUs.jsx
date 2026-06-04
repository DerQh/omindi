import styled, { keyframes } from "styled-components";
import SEO from "./SEO";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0.85); opacity: 0; }
  70%  { transform: scale(1.04); }
  100% { transform: scale(1); opacity: 1; }
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = styled.section`
  position: relative;
  background: linear-gradient(140deg, #1a3318 0%, #2f5a2a 55%, #4e9643 100%);
  padding: 100px 24px 120px;
  text-align: center;
  overflow: hidden;

  /* decorative circles */
  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  &::before { width: 500px; height: 500px; top: -180px; right: -120px; }
  &::after  { width: 320px; height: 320px; bottom: -100px; left: -80px; }
`;

const HeroInner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.7s ease;
`;

const HeroEyebrow = styled.span`
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 18px;
  border-radius: 999px;
  margin-bottom: 22px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin: 0 0 20px;
`;

const HeroSub = styled.p`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.75;
  max-width: 580px;
  margin: 0 auto;
`;

// ─── Shared layout ────────────────────────────────────────────────────────────

const Section = styled.section`
  padding: ${({ $tight }) => $tight ? "60px 24px" : "80px 24px"};
  background: ${({ $alt }) => $alt ? "#f5f8f5" : "white"};
`;

const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;

const SectionLabel = styled.p`
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 12px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #1a3318;
  letter-spacing: -0.3px;
  line-height: 1.25;
  margin: 0 0 16px;
`;

const SectionSub = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.7;
  max-width: 560px;
  margin: 0 auto 56px;
`;

const Divider = styled.div`
  width: 48px;
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px;
  margin: 16px auto 56px;
`;

// ─── Pillars (Mission / Path / Community) ─────────────────────────────────────

const PillarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
`;

const PillarCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 36px 28px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 4px 24px rgba(20,57,32,0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${fadeUp} 0.5s ease both;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(20,57,32,0.11);
  }
`;

const PillarImg = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;

  img { width: 40px; height: 40px; object-fit: contain; }
`;

const PillarTitle = styled.h3`
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 10px;
`;

const PillarText = styled.p`
  font-size: 0.93rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
`;

// ─── Stats ────────────────────────────────────────────────────────────────────

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2px;
  background: #e8f5e9;
  border-radius: 20px;
  overflow: hidden;
`;

const StatBox = styled.div`
  background: white;
  padding: 40px 24px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.4rem;
  font-weight: 800;
  color: #2f5a2a;
  line-height: 1;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// ─── Story ────────────────────────────────────────────────────────────────────

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const StoryImg = styled.div`
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(20,57,32,0.15);
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const StoryContent = styled.div``;

const StoryLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 14px;
`;

const StoryTitle = styled.h2`
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #1a3318;
  line-height: 1.3;
  letter-spacing: -0.3px;
  margin: 0 0 20px;
`;

const StoryText = styled.p`
  font-size: 0.97rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 18px;

  &:last-child { margin-bottom: 0; }
`;

// ─── Founder ──────────────────────────────────────────────────────────────────

const FounderCard = styled.div`
  max-width: 820px;
  margin: 0 auto;
  background: white;
  border-radius: 28px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 8px 40px rgba(20,57,32,0.08);
  overflow: hidden;
  display: grid;
  grid-template-columns: 280px 1fr;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FounderImgWrap = styled.div`
  background: linear-gradient(160deg, #2f5a2a, #4e9643);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  img {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255,255,255,0.3);
    animation: ${popIn} 0.6s ease;
  }
`;

const FounderBody = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FounderQuote = styled.div`
  font-size: 2rem;
  color: #d1fae5;
  line-height: 1;
  margin-bottom: 16px;
`;

const FounderName = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 4px;
`;

const FounderRole = styled.p`
  font-size: 0.82rem;
  font-weight: 600;
  color: #4e9643;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 18px;
`;

const FounderBio = styled.p`
  font-size: 0.93rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0;
`;

// ─── Values ───────────────────────────────────────────────────────────────────

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const ValueCard = styled.div`
  padding: 28px 24px;
  border-radius: 16px;
  border: 1px solid #e8f5e9;
  background: white;
`;

const ValueIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 14px;
`;

const ValueTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
`;

const ValueText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.65;
  margin: 0;
`;

// ─── Food chain ───────────────────────────────────────────────────────────────

const FoodChainWrap = styled.div`
  max-width: 900px;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(20,57,32,0.08);
  border: 1px solid #e8f5e9;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

// ─── CTA banner ───────────────────────────────────────────────────────────────

const CtaBanner = styled.section`
  background: linear-gradient(135deg, #1a3318 0%, #2f5a2a 100%);
  padding: 80px 24px;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: white;
  margin: 0 0 16px;
  letter-spacing: -0.3px;
`;

const CtaSub = styled.p`
  color: rgba(255,255,255,0.75);
  font-size: 1rem;
  margin: 0 0 32px;
`;

const CtaBtn = styled.a`
  display: inline-block;
  background: white;
  color: #2f5a2a;
  font-size: 0.95rem;
  font-weight: 800;
  padding: 14px 32px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.2);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    img: "/objective.png",
    title: "Our Mission",
    text: "Create economic opportunities for local food growers and connect communities with the economic, environmental, and health benefits of locally grown food.",
  },
  {
    img: "/our way.png",
    title: "Our Path",
    text: "Recent events have shown us the fragility of national and global food systems. Unlike big corporations, local food resources — gardens, farms, and cooperatives — can pivot in the face of change.",
  },
  {
    img: "/community.png",
    title: "Community First",
    text: "As a mission-driven marketplace, our first priority is community. Bringing people together — farmers, buyers, and advocates — is the focus of everything we do.",
  },
];

const VALUES = [
  { icon: "🌱", title: "Sustainability",  text: "We champion farming methods that protect the land for future generations." },
  { icon: "🤝", title: "Trust",           text: "Every transaction on our platform is built on transparency and accountability." },
  { icon: "📍", title: "Local First",     text: "We believe local produce means fresher food, shorter supply chains, and stronger economies." },
  { icon: "💡", title: "Innovation",      text: "We use modern technology to solve age-old challenges in African agriculture." },
];

const AboutUs = () => {
  return (
    <>
      <SEO title="About Us" description="Learn about AFARMER™ — our mission to connect farmers and buyers across Kenya, build stronger food systems, and support local agriculture." path="/aboutus" />
            <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <HeroEyebrow>Our Story</HeroEyebrow>
          <HeroTitle>Connecting Farmers to<br />the Communities They Feed</HeroTitle>
          <HeroSub>
            AFARMER™ is a mission-driven marketplace building a stronger,
            more resilient local food economy — one farm at a time.
          </HeroSub>
        </HeroInner>
      </Hero>

      {/* ── Pillars ── */}
      <Section>
        <Inner>
          <SectionLabel>What We Stand For</SectionLabel>
          <SectionTitle>Built Around Three Principles</SectionTitle>
          <Divider />
          <PillarGrid>
            {PILLARS.map((p) => (
              <PillarCard key={p.title}>
                <PillarImg><img src={p.img} alt={p.title} /></PillarImg>
                <PillarTitle>{p.title}</PillarTitle>
                <PillarText>{p.text}</PillarText>
              </PillarCard>
            ))}
          </PillarGrid>
        </Inner>
      </Section>

      {/* ── Stats ── */}
      <Section $alt $tight>
        <Inner>
          <StatsGrid>
            <StatBox>
              <StatNumber>500+</StatNumber>
              <StatLabel>Farmers Listed</StatLabel>
            </StatBox>
            <StatBox>
              <StatNumber>12K+</StatNumber>
              <StatLabel>Listings Posted</StatLabel>
            </StatBox>
            <StatBox>
              <StatNumber>8</StatNumber>
              <StatLabel>Counties Reached</StatLabel>
            </StatBox>
            <StatBox>
              <StatNumber>3K+</StatNumber>
              <StatLabel>Community Members</StatLabel>
            </StatBox>
          </StatsGrid>
        </Inner>
      </Section>

      {/* ── Story ── */}
      <Section>
        <Inner>
          <StoryGrid>
            <StoryImg>
              <img src="/farming.jpg" alt="Farming in Kenya" />
            </StoryImg>
            <StoryContent>
              <StoryLabel>The Origin</StoryLabel>
              <StoryTitle>Why We Built This Platform</StoryTitle>
              <StoryText>
                Growing up near Kisumu, our founder watched brilliant smallholder
                farmers struggle to find buyers beyond their immediate villages.
                Quality produce would go to waste while urban buyers paid premium
                prices for produce that had traveled hundreds of kilometers.
              </StoryText>
              <StoryText>
                AFARMER™ was born from a simple question: what if technology could
                close that gap? Not just as a sales tool, but as a community —
                a place where farmers are valued, buyers are informed, and food
                has a story behind it.
              </StoryText>
              <StoryText>
                Today we're proud to support farmers across Kenya with a platform
                that puts them in control of how they sell, who they sell to, and
                at what price.
              </StoryText>
            </StoryContent>
          </StoryGrid>
        </Inner>
      </Section>

      {/* ── Founder ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>Meet the Founder</SectionLabel>
          <SectionTitle>The Person Behind the Mission</SectionTitle>
          <Divider />
          <FounderCard>
            <FounderImgWrap>
              <img src="/founder1.jpg" alt="Omindi — Founder" />
            </FounderImgWrap>
            <FounderBody>
              <FounderQuote>"</FounderQuote>
              <FounderName>Omindi</FounderName>
              <FounderRole>Founder & Organic Farmer</FounderRole>
              <FounderBio>
                I run an organic farm in a village near Kisumu, growing healthy
                crops using sustainable methods like composting and natural soil
                improvement — without harmful chemicals. I work closely with
                neighbours, share simple farming practices, and encourage
                responsible agriculture so our community can secure better
                harvests, enjoy cleaner land, and build a stronger future. This
                platform is the extension of that belief: everyone deserves
                access to clean, local food — and every farmer deserves a fair
                market.
              </FounderBio>
            </FounderBody>
          </FounderCard>
        </Inner>
      </Section>

      {/* ── Values ── */}
      <Section>
        <Inner>
          <SectionLabel>Core Values</SectionLabel>
          <SectionTitle>The Principles We Work By</SectionTitle>
          <Divider />
          <ValuesGrid>
            {VALUES.map((v) => (
              <ValueCard key={v.title}>
                <ValueIcon>{v.icon}</ValueIcon>
                <ValueTitle>{v.title}</ValueTitle>
                <ValueText>{v.text}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Inner>
      </Section>

      {/* ── Food chain ── */}
      <Section $alt $tight>
        <Inner>
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>From Farm to Table</SectionTitle>
          <Divider />
          <FoodChainWrap>
            <img src="/food-chain.png" alt="Farm to table supply chain" />
          </FoodChainWrap>
        </Inner>
      </Section>

      {/* ── CTA ── */}
      <CtaBanner>
        <CtaTitle>Ready to Support Local Farming?</CtaTitle>
        <CtaSub>Join thousands of buyers and farmers already on the platform.</CtaSub>
        <CtaBtn href="/sign-up">Get Started — It's Free</CtaBtn>
      </CtaBanner>

      <FooterContainer />
    </>
  );
};

export default AboutUs;
