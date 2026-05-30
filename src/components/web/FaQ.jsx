import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── FAQ data grouped by category ────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "buying-selling",
    label: "Buying & Selling",
    icon: "🛒",
    faqs: [
      {
        q: "Is there a fee to buy or sell on AFARMER™?",
        a: "No. There are no buyer fees, and sellers always have the option to list and sell for free. Transactions happen between buyer and seller directly —  never takes a cut.",
      },
      {
        q: "How do I buy items listed on ?",
        a: "Message the seller directly from the listing screen to arrange a meetup, porch pickup, or drop-off point. All payments are made offline — cash, mobile money, or whatever both parties agree on.",
      },
      {
        q: "How do I pay for items?",
        a: "Payments can be arranged with the seller via cash, mobile money (e.g. M-Pesa), debit/credit card, EBT (where applicable), or bartering. All transactions are made off the app.",
      },
      {
        q: "What food items can I sell on ?",
        a: "You can sell fresh, raw, uncut, and unprocessed food products grown or produced by you — including meat, dairy, honey, maple syrup, and eggs — subject to local and national regulations.",
      },
      {
        q: "What non-food items can I sell on ?",
        a: "You can sell farm and garden supplies, plants and trees (as permitted by law), poultry, small farm animals, and non-vehicle farm or garden equipment.",
      },
      {
        q: "What items are prohibited on ?",
        a: "Prohibited items include: any product that violates local, national, or international law; marijuana or its derivatives; food items not grown or produced on location; vehicles requiring a title or license; misrepresented products; and items outside the applicable categories.",
      },
    ],
  },
  {
    id: "listings",
    label: "Listings & Profiles",
    icon: "📋",
    faqs: [
      {
        q: "How many listings can I post for free?",
        a: "You can maintain up to 3 active listings at any time on the free plan. Listings never expire — update or swap them whenever you like. Upgrade to the Limitless plan for unlimited listings at Kes 10/month.",
      },
      {
        q: "How do I create a listing?",
        a: "Sign up or log in, go to your profile, and tap 'New Listing'. Add photos, a title, price, category, and description. Your listing is searchable by local buyers immediately after posting.",
      },
      {
        q: "Can I edit or remove a listing after posting it?",
        a: "Yes. You can update, mark as sold, or delete any listing at any time from your profile dashboard.",
      },
    ],
  },
  {
    id: "events",
    label: "Events & Agritourism",
    icon: "📅",
    faqs: [
      {
        q: "What types of events can I list on ?",
        a: "You can list any event that connects people with local agriculture — farmers markets, U-pick days, farm tours, seasonal festivals, workshops (gardening or cooking), and agritourism experiences like pumpkin patches or hayrides.",
      },
      {
        q: "How do event listings work?",
        a: "Event listings are free to create and appear in search results and on the map, helping nearby people discover what's happening. Include the date, time, location, and a clear description. Adding photos makes your listing significantly more appealing.",
      },
      {
        q: "Can I charge admission for my event?",
        a: "Yes.  doesn't handle ticket payments — you manage admission offline or through your preferred system. Mention pricing in your listing description.",
      },
      {
        q: "Can I promote a recurring event like a weekly farmers market?",
        a: "Yes. Create separate listings for each date, or mention the recurring schedule in a single listing description. Both approaches work well.",
      },
      {
        q: "What happens if I need to cancel my event?",
        a: "Update or remove your listing as soon as possible so attendees are informed. Clear communication avoids confusion and maintains your farm's reputation.",
      },
      {
        q: "Can I use event listings to promote my farm store?",
        a: "Yes. Many farmers list store openings, special sales, or seasonal offerings as events to drive foot traffic and build local awareness.",
      },
    ],
  },
  {
    id: "legal",
    label: "Legal & Safety",
    icon: "⚖️",
    faqs: [
      {
        q: "Am I legally allowed to sell raw milk, unwashed eggs, or similar products?",
        a: "It is the seller's responsibility to know and comply with applicable laws around production, sale, and distribution. Resources include your local agricultural extension office and Kenya's Ministry of Agriculture.  does not provide legal advice.",
      },
      {
        q: "Is it safe to meet a buyer or seller in person?",
        a: "Meetups carry similar risks to any peer-to-peer marketplace. We suggest meeting in public places during daylight, bringing a friend when possible, and being alert to potential scams. Trust your instincts.",
      },
    ],
  },
  {
    id: "wholesale",
    label: "Wholesale",
    icon: "🏭",
    faqs: [
      {
        q: "How does wholesale work on ?",
        a: " connects farms and producers with wholesale buyers such as retailers, restaurants, and food brands. Sellers list products and buyers reach out directly to arrange quantities, pricing, and delivery — no transaction fees involved.",
      },
      {
        q: "Are there fees for farms to list wholesale products?",
        a: "No. Creating a wholesale profile and listing products is completely free. Our free plan supports up to 3 active listings; the Limitless plan removes that cap.",
      },
      {
        q: "What products can be sold wholesale?",
        a: " supports a wide range of locally produced goods — fresh produce, meat, dairy, honey, baked goods, and specialty food items. The platform is designed to accommodate both small-scale farmers and larger commercial growers.",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function FAQ() {
  const [activeCategory, setActiveCategory] = useState("buying-selling");
  const [openIndex, setOpenIndex] = useState(null);

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>Help Centre</Eyebrow>
          <HeroTitle>Frequently Asked Questions</HeroTitle>
          <HeroSub>
            Everything you need to know about buying, selling, and using
            . Can't find an answer?{" "}
            <HeroLink href="/contactus">Contact us.</HeroLink>
          </HeroSub>
        </HeroInner>
      </Hero>

      {/* ── FAQ body ── */}
      <Body>
        <BodyInner>
          {/* Category sidebar */}
          <Sidebar>
            {CATEGORIES.map((c) => (
              <CategoryBtn
                key={c.id}
                $active={activeCategory === c.id}
                onClick={() => handleCategoryChange(c.id)}
              >
                <span>{c.icon}</span>
                {c.label}
              </CategoryBtn>
            ))}
          </Sidebar>

          {/* FAQ accordion */}
          <Content>
            <ContentHeader>
              <ContentIcon>{currentCategory.icon}</ContentIcon>
              <ContentTitle>{currentCategory.label}</ContentTitle>
              <ContentCount>
                {currentCategory.faqs.length} question{currentCategory.faqs.length !== 1 ? "s" : ""}
              </ContentCount>
            </ContentHeader>

            <FaqList>
              {currentCategory.faqs.map((faq, i) => (
                <FaqItem key={i}>
                  <FaqQuestion
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                  >
                    <FaqQuestionText>{faq.q}</FaqQuestionText>
                    <Chevron $open={openIndex === i}>›</Chevron>
                  </FaqQuestion>
                  {openIndex === i && (
                    <FaqAnswer>
                      {faq.a.split("\n").map((line, li) =>
                        line.trim().startsWith("-") ? (
                          <BulletLine key={li}>{line.replace(/^-\s*/, "")}</BulletLine>
                        ) : (
                          <p key={li} style={{ margin: "0 0 8px" }}>{line}</p>
                        )
                      )}
                    </FaqAnswer>
                  )}
                </FaqItem>
              ))}
            </FaqList>
          </Content>
        </BodyInner>
      </Body>

      {/* ── Still need help ── */}
      <HelpBanner>
        <HelpInner>
          <HelpTitle>Still have questions?</HelpTitle>
          <HelpSub>Our team typically responds within 1–2 business days.</HelpSub>
          <HelpBtn href="/contactus">Contact Support →</HelpBtn>
        </HelpInner>
      </HelpBanner>

      <FooterContainer />
    </>
  );
}

export default FAQ;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(140deg, #1a3318 0%, #2f5a2a 55%, #4e9643 100%);
  padding: 80px 24px 100px; text-align: center;
  position: relative; overflow: hidden;
  &::before {
    content: ""; position: absolute; width: 400px; height: 400px;
    border-radius: 50%; background: rgba(255,255,255,0.04);
    top: -120px; right: -80px;
  }
`;
const HeroInner = styled.div`
  max-width: 620px; margin: 0 auto;
  position: relative; z-index: 1;
  animation: ${fadeUp} 0.6s ease;
`;
const Eyebrow = styled.span`
  display: inline-block;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
  color: rgba(255,255,255,0.9); font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 6px 16px; border-radius: 999px; margin-bottom: 18px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: white;
  letter-spacing: -0.4px; margin: 0 0 14px; line-height: 1.2;
`;
const HeroSub = styled.p`
  font-size: 1rem; color: rgba(255,255,255,0.78); line-height: 1.7; margin: 0;
`;
const HeroLink = styled.a`
  color: #a7f3d0; font-weight: 700; text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const Body = styled.div`
  background: #f5f8f5; padding: 56px 24px 80px;
`;
const BodyInner = styled.div`
  max-width: 1000px; margin: 0 auto;
  display: grid; grid-template-columns: 220px 1fr;
  gap: 32px; align-items: start;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.div`
  display: flex; flex-direction: column; gap: 4px;
  position: sticky; top: 80px;
  @media (max-width: 720px) {
    position: static; flex-direction: row; flex-wrap: wrap;
  }
`;
const CategoryBtn = styled.button`
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; border-radius: 12px; border: none;
  font-size: 0.88rem; font-weight: ${({ $active }) => ($active ? "700" : "500")};
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#4b5563")};
  cursor: pointer; text-align: left; width: 100%;
  box-shadow: ${({ $active }) => ($active ? "0 4px 14px rgba(20,57,32,0.15)" : "none")};
  border: 1px solid ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  transition: all 0.15s;
  &:hover { background: ${({ $active }) => ($active ? "#245026" : "#f0fdf4")}; }
  @media (max-width: 720px) { width: auto; flex: 0 0 auto; }
`;

const Content = styled.div`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 24px rgba(20,57,32,0.07); border: 1px solid #e8f5e9;
`;
const ContentHeader = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 22px 24px; background: #f8faf6; border-bottom: 1px solid #f0f7ee;
`;
const ContentIcon  = styled.span`font-size: 1.4rem;`;
const ContentTitle = styled.h2`
  font-size: 1rem; font-weight: 800; color: #1a3318; margin: 0; flex: 1;
`;
const ContentCount = styled.span`
  font-size: 0.75rem; font-weight: 600; color: #9ca3af;
  background: #f3f4f6; padding: 3px 10px; border-radius: 999px;
`;

const FaqList = styled.div``;
const FaqItem = styled.div`
  border-bottom: 1px solid #f3f4f6; &:last-child { border-bottom: none; }
`;
const FaqQuestion = styled.button`
  width: 100%; display: flex; align-items: flex-start;
  justify-content: space-between; gap: 16px;
  padding: 18px 24px; background: none; border: none;
  text-align: left; cursor: pointer; transition: background 0.12s;
  &:hover { background: #fafcfa; }
`;
const FaqQuestionText = styled.span`
  font-size: 0.92rem; font-weight: 700; color: #1a3318; line-height: 1.5;
`;
const Chevron = styled.span`
  font-size: 1.4rem; color: #4e9643; flex-shrink: 0; line-height: 1;
  transition: transform 0.2s; margin-top: 2px;
  transform: ${({ $open }) => ($open ? "rotate(90deg)" : "rotate(0deg)")};
`;
const FaqAnswer = styled.div`
  padding: 0 24px 20px; font-size: 0.88rem; color: #4b5563; line-height: 1.75;
  animation: ${fadeUp} 0.2s ease;
  p { margin: 0; }
`;
const BulletLine = styled.div`
  padding-left: 16px; margin-bottom: 6px; position: relative;
  &::before { content: "·"; position: absolute; left: 0; color: #4e9643; font-weight: 800; }
`;

const HelpBanner = styled.section`
  background: white; border-top: 1px solid #e8f5e9; padding: 56px 24px;
  text-align: center;
`;
const HelpInner  = styled.div`max-width: 480px; margin: 0 auto;`;
const HelpTitle  = styled.h2`font-size: 1.4rem; font-weight: 800; color: #1a3318; margin: 0 0 8px;`;
const HelpSub    = styled.p`font-size: 0.92rem; color: #6b7280; margin: 0 0 22px;`;
const HelpBtn    = styled.a`
  display: inline-block; background: #2f5a2a; color: white; text-decoration: none;
  padding: 12px 28px; border-radius: 999px; font-size: 0.92rem; font-weight: 800;
  transition: all 0.2s;
  &:hover { background: #245026; transform: translateY(-1px); }
`;
