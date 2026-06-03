import { useState, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "buying-selling",
    label: "Buying & Selling",
    icon: "🛒",
    faqs: [
      {
        q: "Is there a fee to buy or sell on AFARMER™__TM__?",
        a: "No. There are no buyer fees, and sellers always have the option to list and sell for free. Transactions happen between buyer and seller directly — AFARMER™ never takes a cut.",
      },
      {
        q: "How do I buy items listed on AFARMER™?",
        a: "Message the seller directly from the listing screen to arrange a meetup, porch pickup, or drop-off point. All payments are made offline — cash, mobile money, or whatever both parties agree on.",
      },
      {
        q: "How do I pay for items?",
        a: "Payments can be arranged with the seller via cash, mobile money (e.g. M-Pesa), debit/credit card, EBT (where applicable), or bartering. All transactions are made off the app.",
      },
      {
        q: "What food items can I sell on AFARMER™?",
        a: "You can sell fresh, raw, uncut, and unprocessed food products grown or produced by you — including meat, dairy, honey, maple syrup, and eggs — subject to local and national regulations.",
      },
      {
        q: "What non-food items can I sell on AFARMER™?",
        a: "You can sell farm and garden supplies, plants and trees (as permitted by law), poultry, small farm animals, and non-vehicle farm or garden equipment.",
      },
      {
        q: "What items are prohibited on AFARMER™?",
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
        q: "What types of events can I list on AFARMER™?",
        a: "You can list any event that connects people with local agriculture — farmers markets, U-pick days, farm tours, seasonal festivals, workshops (gardening or cooking), and agritourism experiences like pumpkin patches or hayrides.",
      },
      {
        q: "How do event listings work?",
        a: "Event listings are free to create and appear in search results and on the map, helping nearby people discover what's happening. Include the date, time, location, and a clear description. Adding photos makes your listing significantly more appealing.",
      },
      {
        q: "Can I charge admission for my event?",
        a: "Yes. AFARMER™ doesn't handle ticket payments — you manage admission offline or through your preferred system. Mention pricing in your listing description.",
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
        a: "It is the seller's responsibility to know and comply with applicable laws around production, sale, and distribution. Resources include your local agricultural extension office and Kenya's Ministry of Agriculture. AFARMER™ does not provide legal advice.",
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
        q: "How does wholesale work on AFARMER™?",
        a: "AFARMER™ connects farms and producers with wholesale buyers such as retailers, restaurants, and food brands. Sellers list products and buyers reach out directly to arrange quantities, pricing, and delivery — no transaction fees involved.",
      },
      {
        q: "Are there fees for farms to list wholesale products?",
        a: "No. Creating a wholesale profile and listing products is completely free. Our free plan supports up to 3 active listings; the Limitless plan removes that cap.",
      },
      {
        q: "What products can be sold wholesale?",
        a: "AFARMER™ supports a wide range of locally produced goods — fresh produce, meat, dairy, honey, baked goods, and specialty food items. The platform is designed to accommodate both small-scale farmers and larger commercial growers.",
      },
    ],
  },
];

const POPULAR = [
  { q: "Is there a fee to buy or sell?", cat: "buying-selling", idx: 0 },
  { q: "How many listings can I post for free?", cat: "listings", idx: 0 },
  { q: "How does wholesale work?", cat: "wholesale", idx: 0 },
];

// ─── Component ────────────────────────────────────────────────────────────────

function FAQ() {
  const [activeCategory, setActiveCategory] = useState("buying-selling");
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const results = [];
    CATEGORIES.forEach((cat) => {
      cat.faqs.forEach((faq, idx) => {
        if (
          faq.q.toLowerCase().includes(q) ||
          faq.a.toLowerCase().includes(q)
        ) {
          results.push({
            ...faq,
            catLabel: cat.label,
            catIcon: cat.icon,
            catId: cat.id,
            idx,
          });
        }
      });
    });
    return results;
  }, [search]);

  const isSearching = search.trim().length > 0;
  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory);

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  const totalQuestions = CATEGORIES.reduce((sum, c) => sum + c.faqs.length, 0);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroBlob />
        <HeroInner>
          <Eyebrow>Help Centre</Eyebrow>
          <HeroTitle>Frequently Asked Questions</HeroTitle>
          <HeroSub>
            Everything you need to know about buying, selling, and using
            AFARMER™. Can't find an answer?{"  "}
            <HeroLink href="/contactus">Contact us.</HeroLink>
          </HeroSub>
          <SearchRow>
            <SearchInput
              type="text"
              placeholder={`Search ${totalQuestions} questions…`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            {search && <ClearBtn onClick={() => setSearch("")}>✕</ClearBtn>}
          </SearchRow>
        </HeroInner>
      </Hero>

      {/* ── Search results ── */}
      {isSearching ? (
        <Body>
          <BodyInner style={{ display: "block" }}>
            <SearchResultsHeader>
              {searchResults.length === 0
                ? `No results for "${search}"`
                : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${search}"`}
            </SearchResultsHeader>
            {searchResults.length === 0 ? (
              <EmptyState>
                <EmptyTitle>No matches found</EmptyTitle>
                <EmptyText>
                  Try a different keyword, or browse categories below.
                </EmptyText>
                <EmptyBtn onClick={() => setSearch("")}>Clear search</EmptyBtn>
              </EmptyState>
            ) : (
              <SearchResultsList>
                {searchResults.map((r, i) => (
                  <SearchResultItem key={i}>
                    <ResultCategoryBadge>
                      {r.catIcon} {r.catLabel}
                    </ResultCategoryBadge>
                    <ResultQuestion>{r.q}</ResultQuestion>
                    <ResultAnswer>{r.a}</ResultAnswer>
                  </SearchResultItem>
                ))}
              </SearchResultsList>
            )}
          </BodyInner>
        </Body>
      ) : (
        <Body>
          <BodyInner>
            {/* Category sidebar */}
            <Sidebar>
              <SidebarLabel>Categories</SidebarLabel>
              {CATEGORIES.map((c) => (
                <CategoryBtn
                  key={c.id}
                  $active={activeCategory === c.id}
                  onClick={() => handleCategoryChange(c.id)}
                >
                  <CategoryBtnText>
                    <span>{c.label}</span>
                    <CategoryCount $active={activeCategory === c.id}>
                      {c.faqs.length}
                    </CategoryCount>
                  </CategoryBtnText>
                </CategoryBtn>
              ))}
            </Sidebar>

            {/* FAQ accordion */}
            <Content>
              <ContentHeader>
                <ContentIcon>{currentCategory.icon}</ContentIcon>
                <div>
                  <ContentTitle>{currentCategory.label}</ContentTitle>
                  <ContentMeta>
                    {currentCategory.faqs.length} question
                    {currentCategory.faqs.length !== 1 ? "s" : ""}
                  </ContentMeta>
                </div>
              </ContentHeader>

              <FaqList>
                {currentCategory.faqs.map((faq, i) => (
                  <FaqItem key={i} $open={openIndex === i}>
                    <FaqQuestion
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      aria-expanded={openIndex === i}
                    >
                      <FaqQuestionText>{faq.q}</FaqQuestionText>
                      <ChevronWrap $open={openIndex === i}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </ChevronWrap>
                    </FaqQuestion>
                    {openIndex === i && (
                      <FaqAnswer>
                        {faq.a.split("\n").map((line, li) =>
                          line.trim().startsWith("-") ? (
                            <BulletLine key={li}>
                              {line.replace(/^-\s*/, "")}
                            </BulletLine>
                          ) : (
                            <p key={li} style={{ margin: "0 0 8px" }}>
                              {line}
                            </p>
                          ),
                        )}
                      </FaqAnswer>
                    )}
                  </FaqItem>
                ))}
              </FaqList>
            </Content>
          </BodyInner>
        </Body>
      )}

      {/* ── Still need help ── */}
      <HelpBanner>
        <HelpInner>
          <HelpTitle>Still have questions?</HelpTitle>
          <HelpSub>
            Our support team typically responds within 1–2 business days.
          </HelpSub>
          <HelpActions>
            <HelpBtn href="/contactus">Contact Support</HelpBtn>
            <HelpBtnSecondary href="mailto:hello@afarmer.co.ke">
              Email Us
            </HelpBtnSecondary>
          </HelpActions>
        </HelpInner>
      </HelpBanner>

      <FooterContainer />
    </>
  );
}

export default FAQ;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(
    140deg,
    #0d2410 0%,
    #1a3318 40%,
    #2f5a2a 75%,
    #4e9643 100%
  );
  padding: 90px 24px 50px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;
const HeroBlob = styled.div`
  position: absolute;
  width: 440px;
  height: 440px;
  border-radius: 50%;
  background: rgba(78, 150, 67, 0.1);
  top: -140px;
  right: -100px;
  pointer-events: none;
`;
const HeroInner = styled.div`
  max-width: 660px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} 0.6s ease;
`;
const Eyebrow = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 18px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.4px;
  margin: 0 0 14px;
  line-height: 1.15;
`;
const HeroSub = styled.p`
  font-size: 1.02rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  margin: 0 0 28px;
`;
const HeroLink = styled.a`
  color: #86efac;
  font-weight: 700;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const SearchRow = styled.div`
  position: relative;
  max-width: 480px;
  margin: 0 auto 20px;
`;
const SearchIconWrap = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 15px 48px 15px 46px;
  border-radius: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  transition:
    border-color 0.2s,
    background 0.2s;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.16);
  }
`;
const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px;
  &:hover {
    color: white;
  }
`;
const HeroStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;
const HeroStat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
`;

const Body = styled.div`
  background: #f5f8f5;
  padding: 56px 24px 80px;
`;
const BodyInner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
  align-items: start;
  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 80px;
  @media (max-width: 740px) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
`;
const SidebarLabel = styled.p`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin: 0 0 10px 4px;
  @media (max-width: 740px) {
    display: none;
  }
`;
const CategoryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1px solid;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#4b5563")};
  border-color: ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  box-shadow: ${({ $active }) =>
    $active ? "0 4px 14px rgba(20,57,32,0.18)" : "none"};
  &:hover {
    background: ${({ $active }) => ($active ? "#245026" : "#f0fdf4")};
  }
  @media (max-width: 740px) {
    width: auto;
    flex: 0 0 auto;
  }
`;
const CategoryBtnIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
`;
const CategoryBtnText = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-size: 0.86rem;
  font-weight: 600;
  @media (max-width: 740px) {
    gap: 6px;
  }
`;
const CategoryCount = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.2)" : "#f3f4f6"};
  color: ${({ $active }) => ($active ? "white" : "#9ca3af")};
  padding: 2px 8px;
  border-radius: 999px;
`;

const Content = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(20, 57, 32, 0.07);
  border: 1px solid #e8f5e9;
`;
const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 26px;
  background: linear-gradient(135deg, #f8faf6, #f0f7ee);
  border-bottom: 1px solid #e8f5e9;
`;
const ContentIcon = styled.span`
  font-size: 1.6rem;
`;
const ContentTitle = styled.h2`
  font-size: 1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 2px;
`;
const ContentMeta = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
`;

const FaqList = styled.div``;
const FaqItem = styled.div`
  border-bottom: 1px solid #f3f4f6;
  background: ${({ $open }) => ($open ? "#fafcfa" : "transparent")};
  transition: background 0.15s;
  &:last-child {
    border-bottom: none;
  }
`;
const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 26px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s;
  &:hover {
    background: #f8faf6;
  }
`;
const FaqQuestionText = styled.span`
  font-size: 0.93rem;
  font-weight: 700;
  color: #1a3318;
  line-height: 1.55;
`;
const ChevronWrap = styled.span`
  flex-shrink: 0;
  color: #4e9643;
  margin-top: 3px;
  transition: transform 0.22s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};
  display: flex;
  align-items: center;
`;
const FaqAnswer = styled.div`
  padding: 4px 26px 22px 26px;
  font-size: 0.88rem;
  color: #4b5563;
  line-height: 1.8;
  animation: ${slideDown} 0.2s ease;
  p {
    margin: 0 0 6px;
  }
`;
const BulletLine = styled.div`
  padding-left: 18px;
  margin-bottom: 6px;
  position: relative;
  &::before {
    content: "·";
    position: absolute;
    left: 0;
    color: #4e9643;
    font-weight: 800;
    font-size: 1.1rem;
  }
`;

// Search results
const SearchResultsHeader = styled.p`
  font-size: 0.88rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8f5e9;
`;
const SearchResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const SearchResultItem = styled.div`
  background: white;
  border-radius: 16px;
  padding: 22px 24px;
  border: 1px solid #e8f5e9;
  box-shadow: 0 2px 12px rgba(20, 57, 32, 0.05);
  animation: ${fadeUp} 0.25s ease both;
`;
const ResultCategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #4e9643;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
`;
const ResultQuestion = styled.h3`
  font-size: 0.95rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 10px;
  line-height: 1.4;
`;
const ResultAnswer = styled.p`
  font-size: 0.88rem;
  color: #4b5563;
  line-height: 1.75;
  margin: 0;
`;

// Empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 24px;
`;
const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 14px;
`;
const EmptyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a3318;
  margin: 0 0 8px;
`;
const EmptyText = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 20px;
`;
const EmptyBtn = styled.button`
  background: none;
  border: 1.5px solid #2f5a2a;
  color: #2f5a2a;
  padding: 9px 22px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #2f5a2a;
    color: white;
  }
`;

// Help banner
const HelpBanner = styled.section`
  background: white;
  border-top: 1px solid #e8f5e9;
  padding: 64px 24px;
  text-align: center;
`;
const HelpInner = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;
const HelpEmoji = styled.div`
  font-size: 2.2rem;
  margin-bottom: 14px;
`;
const HelpTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 900;
  color: #1a3318;
  margin: 0 0 10px;
  letter-spacing: -0.3px;
`;
const HelpSub = styled.p`
  font-size: 0.92rem;
  color: #6b7280;
  margin: 0 0 26px;
  line-height: 1.65;
`;
const HelpActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;
const HelpBtn = styled.a`
  display: inline-block;
  background: #2f5a2a;
  color: white;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 800;
  transition: all 0.2s;
  &:hover {
    background: #245026;
    transform: translateY(-1px);
  }
`;
const HelpBtnSecondary = styled.a`
  display: inline-block;
  background: white;
  color: #2f5a2a;
  text-decoration: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 800;
  border: 1.5px solid #2f5a2a;
  transition: all 0.2s;
  &:hover {
    background: #f0fdf4;
    transform: translateY(-1px);
  }
`;
