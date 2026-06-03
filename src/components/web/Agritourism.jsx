import React from "react";
import { Helmet } from "react-helmet-async";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: "✏️",
    img: "/create.png",
    title: "Create",
    text: "Promote your farm events to the local community. Create free listings for tours, U-pick days, workshops, seasonal festivals, and more.",
  },
  {
    icon: "🔍",
    img: "/discover.png",
    title: "Discover",
    text: "Find local farm events near you. Browse seasonal experiences, hands-on workshops, and community festivals — all in one place.",
  },
  {
    icon: "🤝",
    img: "/connect.png",
    title: "Connect",
    text: "Attend events, follow your favourite farms, and build meaningful connections with local growers and your wider community.",
  },
];

const EVENT_TYPES = [
  { icon: "🍓", label: "U-Pick Days" },
  { icon: "🚜", label: "Farm Tours" },
  { icon: "🌸", label: "Seasonal Festivals" },
  { icon: "👨‍🍳", label: "Cooking Workshops" },
  { icon: "🌱", label: "Planting Classes" },
  { icon: "🍯", label: "Honey & Harvest Days" },
  { icon: "🎪", label: "Farmers Markets" },
  { icon: "📚", label: "Educational Events" },
];

const FAQS = [
  {
    q: "How can I find local agritourism events near me?",
    a: "Search the AFARMER™ app to discover local events like farm tours, U-pick days, and seasonal festivals. You can also follow farms to stay updated on their latest activities.",
  },
  {
    q: "What types of events can I list on AFARMER™?",
    a: "You can create listings for any event that connects the community to local agriculture — U-pick days, farm tours, seasonal festivals, workshops, educational experiences, farmers markets, and pop-up events.",
  },
  {
    q: "Can I charge admission for my event?",
    a: "Yes. AFARMER™ helps you promote your event, but you handle payments offline or through your preferred method. We never take a fee.",
  },
  {
    q: "What details should I include in my event listing?",
    a: "Include the date, time, location, and a brief description of what attendees can expect. High-quality photos and notes about unique activities — like live music, kid-friendly options, or products for sale — make listings more appealing.",
  },
  {
    q: "What happens if I need to cancel my event?",
    a: "Simply update or remove your listing to keep attendees informed. We recommend updating as early as possible so people can adjust their plans.",
  },
  {
    q: "Do I need an account to attend events?",
    a: "No account is needed to browse events. Creating one lets you follow farms, save listings, and receive notifications when new events are posted.",
  },
  {
    q: "Can I list a recurring event?",
    a: "Yes. You can list recurring events like weekly farmers markets or seasonal offerings. Either create separate listings per date or mention the schedule in the description.",
  },
  {
    q: "Can I sell farm products during my event?",
    a: "Absolutely. Many farms offer produce, honey, baked goods, and crafts at their events. Mention in your listing if items will be available for purchase.",
  },
  {
    q: "What if I don't own a farm but want to host an event?",
    a: "Event listings aren't limited to farms. If you're organising a community food event, educational workshop, or farmers market, you can create a listing to reach local customers.",
  },
  {
    q: "How much does it cost to create an event listing?",
    a: "Creating event listings is completely free. Costs for attending events are set by the organiser — contact them directly for details.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Agritourism = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <>
      <Helmet><title>Agritourism — AFARMER™</title></Helmet>
            <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>Agritourism</Eyebrow>
          <HeroTitle>
            Discover the World
            <br />
            of Agritourism
          </HeroTitle>
          <HeroSub>
            Explore seasonal farm events, connect with local growers, and
            promote your own agritourism experiences to your community.
          </HeroSub>
          <HeroActions>
            <PrimaryBtn onClick={() => navigate("/sign-up")}>
              Explore Events
            </PrimaryBtn>
            <OutlineBtn onClick={() => navigate("/sign-up")}>
              List Your Event
            </OutlineBtn>
          </HeroActions>
        </HeroInner>
      </Hero>

      {/* ── How it works ── */}
      <Section>
        <Inner>
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>Share, Discover & Connect</SectionTitle>
          <SectionSub>
            AFARMER™__TM__ makes it effortless to share local agritourism events and
            find experiences happening right in your neighbourhood.
          </SectionSub>
          <SectionDivider />
          <HowGrid>
            {HOW_IT_WORKS.map((h, i) => (
              <HowCard key={h.title} style={{ animationDelay: `${i * 0.1}s` }}>
                <HowImgWrap>
                  <img src={h.img} alt={h.title} />
                </HowImgWrap>
                <HowTitle>{h.title}</HowTitle>
                <HowText>{h.text}</HowText>
              </HowCard>
            ))}
          </HowGrid>
        </Inner>
      </Section>

      {/* ── Event types ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>Event Types</SectionLabel>
          <SectionTitle>Every Kind of Farm Experience</SectionTitle>
          <SectionDivider />
          <EventTypesGrid>
            {EVENT_TYPES.map((e) => (
              <EventTypeCard key={e.label}>
                <EventTypeIcon>{e.icon}</EventTypeIcon>
                <EventTypeLabel>{e.label}</EventTypeLabel>
              </EventTypeCard>
            ))}
          </EventTypesGrid>
        </Inner>
      </Section>

      {/* ── Highlight strip ── */}
      <HighlightStrip>
        <HighlightInner>
          <HighlightImg src="/farming.jpg" alt="Farm experience" />
          <HighlightContent>
            <SectionLabel style={{ textAlign: "left" }}>
              For Farm Hosts
            </SectionLabel>
            <HighlightTitle>
              Reach Visitors Who Are Looking for You
            </HighlightTitle>
            <HighlightText>
              List your events for free and connect with local visitors actively
              searching for authentic farm experiences. No marketing budget
              needed — just post your event and let the community find you.
            </HighlightText>
            <HighlightText>
              Selling products during your event? Let buyers know in your
              listing — honey, produce, baked goods, and crafts are all welcome.
            </HighlightText>
            <PrimaryGreenBtn onClick={() => navigate("/sign-up")}>
              List Your Event Free
            </PrimaryGreenBtn>
          </HighlightContent>
        </HighlightInner>
      </HighlightStrip>

      {/* ── FAQ ── */}
      <Section>
        <Inner>
          <SectionLabel>FAQ</SectionLabel>
          <SectionTitle>Everything You Need to Know</SectionTitle>
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

      {/* ── CTA ── */}
      <CtaBanner>
        <CtaTitle>Ready to Share Your Farm Experience?</CtaTitle>
        <CtaSub>Listing an event is free and takes less than 5 minutes.</CtaSub>
        <CtaActions>
          <PrimaryBtn onClick={() => navigate("/sign-up")}>
            List an Event
          </PrimaryBtn>
          <OutlineBtn onClick={() => navigate("/sign-up")}>
            Explore Events
          </OutlineBtn>
        </CtaActions>
      </CtaBanner>

      <FooterContainer />
    </>
  );
};

export default Agritourism;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(140deg, #1c3520 0%, #2d5a28 50%, #4a8c3a 100%);
  padding: 96px 24px 112px;
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
  &::after {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    bottom: -60px;
    left: -40px;
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
  margin: 0 0 12px;
  letter-spacing: -0.3px;
`;
const SectionSub = styled.p`
  text-align: center;
  font-size: 0.97rem;
  color: #6b7280;
  line-height: 1.7;
  max-width: 540px;
  margin: 0 auto;
`;
const SectionDivider = styled.div`
  width: 44px;
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px;
  margin: 16px auto 52px;
`;

const HowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
`;
const HowCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 36px 28px;
  border: 1px solid #e8f5e9;
  text-align: center;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  animation: ${fadeUp} 0.5s ease both;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(20, 57, 32, 0.11);
  }
`;
const HowImgWrap = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: #f0fdf4;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
`;
const HowTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 10px;
`;
const HowText = styled.p`
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
`;

const EventTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
`;
const EventTypeCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 20px 16px;
  border: 1px solid #e8f5e9;
  text-align: center;
  box-shadow: 0 2px 10px rgba(20, 57, 32, 0.05);
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    border-color: #4e9643;
  }
`;
const EventTypeIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 8px;
`;
const EventTypeLabel = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: #374151;
`;

const HighlightStrip = styled.section`
  background: linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%);
  border-top: 1px solid #d1fae5;
  border-bottom: 1px solid #d1fae5;
  padding: 72px 24px;
`;
const HighlightInner = styled.div`
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
const HighlightImg = styled.img`
  width: 100%;
  border-radius: 22px;
  object-fit: cover;
  aspect-ratio: 4/3;
  box-shadow: 0 12px 40px rgba(20, 57, 32, 0.12);
`;
const HighlightContent = styled.div``;
const HighlightTitle = styled.h2`
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 16px;
  letter-spacing: -0.3px;
`;
const HighlightText = styled.p`
  font-size: 0.93rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 14px;
`;
const PrimaryGreenBtn = styled.button`
  margin-top: 8px;
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 13px 28px;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #245026;
    transform: translateY(-1px);
  }
`;

const FaqList = styled.div`
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
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
  padding: 18px 24px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.92rem;
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
  padding: 0 24px 18px;
  font-size: 0.88rem;
  color: #4b5563;
  line-height: 1.75;
`;

const CtaBanner = styled.section`
  background: linear-gradient(135deg, #1a3318 0%, #2f5a2a 100%);
  padding: 80px 24px;
  text-align: center;
`;
const CtaTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2rem);
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
const CtaActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;
