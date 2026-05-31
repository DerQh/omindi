import { useState, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED = {
  tag: "Platform Update",
  date: "May 2026",
  title: "AFARMER Now Supports In-App Checkout for Verified Sellers",
  excerpt:
    "We're rolling out a new checkout flow that lets verified sellers receive payments directly through the app — no third-party tools required. Here's everything you need to know about the update and how to get verified.",
  img: "/farming.jpg",
  readTime: "4 min read",
};

const ARTICLES = [
  {
    tag: "Community",
    date: "Apr 2026",
    title:
      "How Smallholder Farmers in Kisumu Are Using AFARMER to Reach New Markets",
    excerpt:
      "Three farmers share their stories of connecting with urban buyers and doubling their weekly sales through the platform.",
    img: "/eggs.jpg",
    readTime: "6 min read",
  },
  {
    tag: "Farming Tips",
    date: "Apr 2026",
    title: "5 Ways to Write a Listing That Sells Faster",
    excerpt:
      "From high-quality photos to clear pricing, here are the proven tactics that top AFARMER sellers use to move inventory quickly.",
    img: "/tomatoes.jpg",
    readTime: "3 min read",
  },
  {
    tag: "Agritourism",
    date: "Mar 2026",
    title: "Farm Event Season Is Here — How to Promote Your U-Pick Days",
    excerpt:
      "Seasonal events drive some of the highest engagement on the platform. We break down what makes an event listing stand out.",
    img: "/honey.jpg",
    readTime: "5 min read",
  },
  {
    tag: "Industry",
    date: "Mar 2026",
    title: "Kenya's Local Food Economy: Why the Shift to Farm-Direct Matters",
    excerpt:
      "A look at the data behind Kenya's growing demand for locally sourced food and what it means for smallholder farmers.",
    img: "/founder1.jpg",
    readTime: "7 min read",
  },
  {
    tag: "Platform Update",
    date: "Feb 2026",
    title: "New: Admin Tools, Dispute Resolution, and Seller Analytics",
    excerpt:
      "Our biggest product update yet — a full admin dashboard, dispute flagging for orders, and a new sales analytics view for sellers.",
    img: "/farming.jpg",
    readTime: "4 min read",
  },
  {
    tag: "Community",
    date: "Feb 2026",
    title:
      "Farmers Market Managers: How to Build Your Market's Digital Presence",
    excerpt:
      "Practical steps for using AFARMER to connect vendors with shoppers, promote events, and keep your community engaged off-site.",
    img: "/afarmer.jpg",
    readTime: "5 min read",
  },
  {
    tag: "Farming Tips",
    date: "Jan 2026",
    title:
      "Photographing Your Produce: A Beginner's Guide to Listings That Convert",
    excerpt:
      "You don't need a professional camera. These simple tips will help your listings look clean, trustworthy, and scroll-stopping.",
    img: "/kales.jpg",
    readTime: "4 min read",
  },
  {
    tag: "Industry",
    date: "Jan 2026",
    title:
      "The Rise of Urban Farming in Nairobi: Opportunity or Oversaturation?",
    excerpt:
      "As rooftop and container farming grows in Nairobi, we explore what it means for rural smallholders and how both can coexist on the platform.",
    img: "/market.jpg",
    readTime: "8 min read",
  },
  {
    tag: "Agritourism",
    date: "Dec 2025",
    title: "How One Farm Turned a Weekend Festival Into a Kes 200,000 Weekend",
    excerpt:
      "Mwangi's Farm in Nakuru used AFARMER to promote their harvest festival and sold out every ticket in 72 hours. Here's what they did.",
    img: "/workshop.jpg",
    readTime: "5 min read",
  },
];

const ALL_TAGS = [
  "All",
  "Platform Update",
  "Community",
  "Farming Tips",
  "Agritourism",
  "Industry",
];

const TAG_COLORS = {
  "Platform Update": { bg: "#eff6ff", color: "#1d4ed8" },
  Community: { bg: "#f0fdf4", color: "#166534" },
  "Farming Tips": { bg: "#fff7ed", color: "#c2410c" },
  Agritourism: { bg: "#fdf4ff", color: "#7e22ce" },
  Industry: { bg: "#f0fdf4", color: "#065f46" },
};

// ─── Component ────────────────────────────────────────────────────────────────

function News() {
  const [activeTag, setActiveTag] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ARTICLES.filter((a) => {
      const tagMatch = activeTag === "All" || a.tag === activeTag;
      const searchMatch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q);
      return tagMatch && searchMatch;
    });
  }, [activeTag, search]);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroBlob1 />
        <HeroBlob2 />
        <HeroInner>
          <Eyebrow>AFARMER News &amp; Updates</Eyebrow>
          <HeroTitle>Stay in the Loop</HeroTitle>
          <HeroSub>
            Platform updates, farming insights, community stories, and
            everything happening in Kenya's local food economy.
          </HeroSub>
          <SearchRow>
            <SearchIcon>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <ClearBtn onClick={() => setSearch("")}>✕</ClearBtn>}
          </SearchRow>
        </HeroInner>
      </Hero>

      {/* ── Filter bar ── */}
      <FilterBar>
        <FilterInner>
          {ALL_TAGS.map((tag) => (
            <FilterChip
              key={tag}
              $active={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
              {tag !== "All" && (
                <ChipCount $active={activeTag === tag}>
                  {ARTICLES.filter((a) => a.tag === tag).length}
                </ChipCount>
              )}
            </FilterChip>
          ))}
        </FilterInner>
      </FilterBar>

      {/* ── Featured article (only when not filtering) ── */}
      {activeTag === "All" && !search && (
        <Section>
          <Inner>
            <SectionLabel>Featured Story</SectionLabel>
            <SectionDivider />
            <FeaturedCard>
              <FeaturedOverlay src={FEATURED.img} alt={FEATURED.title} />
              <FeaturedGradient />
              <FeaturedContent>
                <FeaturedMeta>
                  <ArticleTag style={TAG_COLORS[FEATURED.tag] ?? {}}>
                    {FEATURED.tag}
                  </ArticleTag>
                  <MetaText style={{ color: "rgba(255,255,255,0.65)" }}>
                    {FEATURED.date} · {FEATURED.readTime}
                  </MetaText>
                </FeaturedMeta>
                <FeaturedTitle>{FEATURED.title}</FeaturedTitle>
                <FeaturedExcerpt>{FEATURED.excerpt}</FeaturedExcerpt>
                <ReadMoreBtn>Read Full Story →</ReadMoreBtn>
              </FeaturedContent>
            </FeaturedCard>
          </Inner>
        </Section>
      )}

      {/* ── Article grid ── */}
      <Section $alt>
        <Inner>
          {!search && activeTag === "All" ? (
            <>
              <SectionLabel>Latest Articles</SectionLabel>
              <SectionDivider />
            </>
          ) : (
            <ResultsHeader>
              {filtered.length === 0
                ? "No articles found"
                : `${filtered.length} article${filtered.length !== 1 ? "s" : ""} ${search ? `for "${search}"` : `in ${activeTag}`}`}
            </ResultsHeader>
          )}

          {filtered.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🌿</EmptyIcon>
              <EmptyTitle>No articles found</EmptyTitle>
              <EmptyText>Try a different search term or category.</EmptyText>
              <EmptyClear
                onClick={() => {
                  setSearch("");
                  setActiveTag("All");
                }}
              >
                Clear filters
              </EmptyClear>
            </EmptyState>
          ) : (
            <ArticleGrid>
              {filtered.map((a, i) => (
                <ArticleCard
                  key={a.title}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <ArticleImgWrap>
                    <ArticleImg src={a.img} alt={a.title} />
                    <ArticleTagOverlay style={TAG_COLORS[a.tag] ?? {}}>
                      {a.tag}
                    </ArticleTagOverlay>
                  </ArticleImgWrap>
                  <ArticleBody>
                    <MetaText>
                      {a.date} · {a.readTime}
                    </MetaText>
                    <ArticleTitle>{a.title}</ArticleTitle>
                    <ArticleExcerpt>{a.excerpt}</ArticleExcerpt>
                    <ReadMore>Read more →</ReadMore>
                  </ArticleBody>
                </ArticleCard>
              ))}
            </ArticleGrid>
          )}
        </Inner>
      </Section>

      {/* ── Newsletter ── */}
      <NewsletterSection>
        <NewsletterLeft>
          <NewsletterEyebrow>Weekly Digest</NewsletterEyebrow>
          <NewsletterTitle>Get Updates in Your Inbox</NewsletterTitle>
          <NewsletterSub>
            New articles, platform updates, and farming insights — delivered
            once a week. Unsubscribe any time.
          </NewsletterSub>
          <NewsletterBullets>
            <NewsletterBullet>✓ &nbsp;Platform release notes</NewsletterBullet>
            <NewsletterBullet>
              ✓ &nbsp;Farming tips & market trends
            </NewsletterBullet>
            <NewsletterBullet>✓ &nbsp;Community spotlights</NewsletterBullet>
          </NewsletterBullets>
        </NewsletterLeft>
        <NewsletterRight>
          <NewsletterForm onSubmit={(e) => e.preventDefault()}>
            <NewsletterInputGroup>
              <NewsletterInput
                type="email"
                placeholder="your@email.com"
                required
              />
              <NewsletterBtn type="submit">Subscribe</NewsletterBtn>
            </NewsletterInputGroup>
            <NewsletterDisclaimer>
              No spam. Unsubscribe at any time.
            </NewsletterDisclaimer>
          </NewsletterForm>
        </NewsletterRight>
      </NewsletterSection>

      <FooterContainer />
    </>
  );
}

export default News;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(
    140deg,
    #0d2410 0%,
    #1a3318 40%,
    #2f5a2a 75%,
    #4e9643 100%
  );
  padding: 90px 24px 120px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;
const HeroBlob1 = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(78, 150, 67, 0.12);
  top: -180px;
  right: -120px;
  pointer-events: none;
`;
const HeroBlob2 = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  bottom: -100px;
  left: -80px;
  pointer-events: none;
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
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 20px;
`;
const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.5px;
  margin: 0 0 14px;
  line-height: 1.1;
`;
const HeroSub = styled.p`
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  margin: 0 0 32px;
`;
const SearchRow = styled.div`
  position: relative;
  max-width: 440px;
  margin: 0 auto;
`;
const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 14px 48px 14px 44px;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  transition:
    border-color 0.2s,
    background 0.2s;
  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.18);
  }
`;
const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px;
  &:hover {
    color: white;
  }
`;

const FilterBar = styled.div`
  background: white;
  border-bottom: 1px solid #e8f5e9;
  padding: 0 24px;
  position: sticky;
  top: 64px;
  z-index: 90;
  box-shadow: 0 2px 8px rgba(20, 57, 32, 0.06);
`;
const FilterInner = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 12px 0;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1.5px solid;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#4b5563")};
  border-color: ${({ $active }) => ($active ? "#2f5a2a" : "#e5e7eb")};
  &:hover {
    background: ${({ $active }) => ($active ? "#245026" : "#f0fdf4")};
    border-color: ${({ $active }) => ($active ? "#245026" : "#bbf7d0")};
  }
`;
const ChipCount = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.25)" : "#f3f4f6"};
  color: ${({ $active }) => ($active ? "white" : "#9ca3af")};
  padding: 1px 7px;
  border-radius: 999px;
`;

const Section = styled.section`
  padding: 72px 24px;
  background: ${({ $alt }) => ($alt ? "#f5f8f5" : "white")};
`;
const Inner = styled.div`
  max-width: 1060px;
  margin: 0 auto;
`;
const SectionLabel = styled.p`
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4e9643;
  margin: 0 0 10px;
`;
const SectionDivider = styled.div`
  width: 40px;
  height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px;
  margin: 0 auto 48px;
`;
const ResultsHeader = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 32px;
  text-align: center;
`;

// Featured
const FeaturedCard = styled.div`
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 12px 48px rgba(20, 57, 32, 0.18);
  cursor: pointer;
  &:hover img {
    transform: scale(1.04);
  }
`;
const FeaturedOverlay = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
`;
const FeaturedGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 30, 10, 0.92) 0%,
    rgba(10, 30, 10, 0.3) 60%,
    transparent 100%
  );
`;
const FeaturedContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 44px 40px;
  @media (max-width: 640px) {
    padding: 28px 20px;
  }
`;
const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;
const FeaturedTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 900;
  color: white;
  margin: 0 0 14px;
  letter-spacing: -0.4px;
  line-height: 1.25;
  max-width: 680px;
`;
const FeaturedExcerpt = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin: 0 0 22px;
  max-width: 560px;
`;
const ReadMoreBtn = styled.button`
  background: white;
  color: #1a3318;
  border: none;
  padding: 11px 24px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f0fdf4;
    transform: translateY(-1px);
  }
`;

// Grid
const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;
const ArticleCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(20, 57, 32, 0.06);
  border: 1px solid #e8f5e9;
  transition:
    transform 0.22s,
    box-shadow 0.22s;
  animation: ${fadeUp} 0.4s ease both;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(20, 57, 32, 0.12);
  }
`;
const ArticleImgWrap = styled.div`
  position: relative;
  overflow: hidden;
`;
const ArticleImg = styled.img`
  width: 100%;
  height: 190px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
  ${ArticleCard}:hover & {
    transform: scale(1.04);
  }
`;
const ArticleTagOverlay = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-block;
  padding: 4px 11px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap;
`;
const ArticleBody = styled.div`
  padding: 20px 20px 22px;
`;
const ArticleTitle = styled.h3`
  font-size: 0.96rem;
  font-weight: 800;
  color: #1a3318;
  margin: 8px 0 10px;
  line-height: 1.45;
`;
const ArticleExcerpt = styled.p`
  font-size: 0.84rem;
  color: #6b7280;
  line-height: 1.65;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const ArticleTag = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
`;
const MetaText = styled.span`
  font-size: 0.74rem;
  color: #9ca3af;
  font-weight: 500;
`;
const ReadMore = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #2f5a2a;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.7;
  }
`;

// Empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
`;
const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
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
const EmptyClear = styled.button`
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

// Newsletter
const NewsletterSection = styled.section`
  background: linear-gradient(135deg, #0d2410 0%, #1a3318 50%, #2f5a2a 100%);
  padding: 72px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 100%;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 36px;
    padding: 56px 24px;
  }
`;
const NewsletterLeft = styled.div``;
const NewsletterEyebrow = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #86efac;
  margin: 0 0 12px;
`;
const NewsletterTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 900;
  color: white;
  margin: 0 0 12px;
  letter-spacing: -0.3px;
`;
const NewsletterSub = styled.p`
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0 0 20px;
`;
const NewsletterBullets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const NewsletterBullet = styled.span`
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
`;
const NewsletterRight = styled.div``;
const NewsletterForm = styled.form``;
const NewsletterInputGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const NewsletterInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  font-size: 0.92rem;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  outline: none;
  backdrop-filter: blur(8px);
  transition: border-color 0.2s;
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;
const NewsletterBtn = styled.button`
  background: #4e9643;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover {
    background: #3d7a35;
    transform: translateY(-1px);
  }
`;
const NewsletterDisclaimer = styled.p`
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 12px 0 0;
`;
