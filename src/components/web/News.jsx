import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Static articles ──────────────────────────────────────────────────────────

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
    title: "How Smallholder Farmers in Kisumu Are Using AFARMER to Reach New Markets",
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
    title: "Farmers Market Managers: How to Build Your Market's Digital Presence",
    excerpt:
      "Practical steps for using AFARMER to connect vendors with shoppers, promote events, and keep your community engaged off-site.",
    img: "/afarmer.jpg",
    readTime: "5 min read",
  },
];

const TAG_COLORS = {
  "Platform Update": { bg: "#eff6ff", color: "#1d4ed8" },
  "Community":       { bg: "#f0fdf4", color: "#166534" },
  "Farming Tips":    { bg: "#fff7ed", color: "#c2410c" },
  "Agritourism":     { bg: "#fdf4ff", color: "#7e22ce" },
  "Industry":        { bg: "#f0fdf4", color: "#065f46" },
};

// ─── Component ────────────────────────────────────────────────────────────────

function News() {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <Hero>
        <HeroInner>
          <Eyebrow>AFARMER News & Updates</Eyebrow>
          <HeroTitle>Stay in the Loop</HeroTitle>
          <HeroSub>
            Platform updates, farming insights, community stories, and
            everything happening in Kenya's local food economy.
          </HeroSub>
        </HeroInner>
      </Hero>

      {/* ── Featured article ── */}
      <Section>
        <Inner>
          <SectionLabel>Featured Story</SectionLabel>
          <SectionDivider />
          <FeaturedCard>
            <FeaturedImg src={FEATURED.img} alt={FEATURED.title} />
            <FeaturedBody>
              <FeaturedMeta>
                <ArticleTag style={TAG_COLORS[FEATURED.tag] ?? {}}>
                  {FEATURED.tag}
                </ArticleTag>
                <MetaText>{FEATURED.date} · {FEATURED.readTime}</MetaText>
              </FeaturedMeta>
              <FeaturedTitle>{FEATURED.title}</FeaturedTitle>
              <FeaturedExcerpt>{FEATURED.excerpt}</FeaturedExcerpt>
              <ReadMore>Read Full Story</ReadMore>
            </FeaturedBody>
          </FeaturedCard>
        </Inner>
      </Section>

      {/* ── Article grid ── */}
      <Section $alt>
        <Inner>
          <SectionLabel>Latest Articles</SectionLabel>
          <SectionDivider />
          <ArticleGrid>
            {ARTICLES.map((a) => (
              <ArticleCard key={a.title}>
                <ArticleImg src={a.img} alt={a.title} />
                <ArticleBody>
                  <ArticleMeta>
                    <ArticleTag style={TAG_COLORS[a.tag] ?? {}}>
                      {a.tag}
                    </ArticleTag>
                    <MetaText>{a.date} · {a.readTime}</MetaText>
                  </ArticleMeta>
                  <ArticleTitle>{a.title}</ArticleTitle>
                  <ArticleExcerpt>{a.excerpt}</ArticleExcerpt>
                  <ReadMore>Read more</ReadMore>
                </ArticleBody>
              </ArticleCard>
            ))}
          </ArticleGrid>
        </Inner>
      </Section>

      {/* ── Newsletter ── */}
      <NewsletterSection>
        <NewsletterInner>
          <NewsletterIcon>📬</NewsletterIcon>
          <NewsletterTitle>Get Updates in Your Inbox</NewsletterTitle>
          <NewsletterSub>
            New articles, platform updates, and farming insights — delivered
            once a week. No spam.
          </NewsletterSub>
          <NewsletterForm onSubmit={(e) => e.preventDefault()}>
            <NewsletterInput
              type="email"
              placeholder="your@email.com"
              required
            />
            <NewsletterBtn type="submit">Subscribe</NewsletterBtn>
          </NewsletterForm>
        </NewsletterInner>
      </NewsletterSection>

      <FooterContainer />
    </>
  );
}

export default News;

// ─── Styled components ────────────────────────────────────────────────────────

const Hero = styled.section`
  background: linear-gradient(140deg, #1a3318 0%, #2f5a2a 55%, #4e9643 100%);
  padding: 80px 24px 100px; text-align: center;
  position: relative; overflow: hidden;
  &::before {
    content: ""; position: absolute;
    width: 400px; height: 400px; border-radius: 50%;
    background: rgba(255,255,255,0.04); top: -120px; right: -80px;
  }
`;
const HeroInner = styled.div`
  max-width: 640px; margin: 0 auto;
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
  font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: white;
  letter-spacing: -0.5px; margin: 0 0 14px; line-height: 1.15;
`;
const HeroSub = styled.p`
  font-size: 1.05rem; color: rgba(255,255,255,0.78); line-height: 1.7; margin: 0;
`;

const Section = styled.section`
  padding: 72px 24px;
  background: ${({ $alt }) => ($alt ? "#f5f8f5" : "white")};
`;
const Inner = styled.div`max-width: 1060px; margin: 0 auto;`;
const SectionLabel = styled.p`
  text-align: center; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; color: #4e9643; margin: 0 0 12px;
`;
const SectionDivider = styled.div`
  width: 44px; height: 4px;
  background: linear-gradient(90deg, #2f5a2a, #4e9643);
  border-radius: 999px; margin: 0 auto 44px;
`;

// Featured
const FeaturedCard = styled.div`
  display: grid; grid-template-columns: 1fr 1fr;
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 8px 40px rgba(20,57,32,0.1);
  border: 1px solid #e8f5e9;
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
const FeaturedImg = styled.img`
  width: 100%; height: 100%; min-height: 320px;
  object-fit: cover; display: block;
`;
const FeaturedBody = styled.div`
  background: white; padding: 40px 36px;
  display: flex; flex-direction: column; justify-content: center;
`;
const FeaturedMeta = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
`;
const FeaturedTitle = styled.h2`
  font-size: clamp(1.2rem, 2vw, 1.55rem); font-weight: 800;
  color: #1a3318; margin: 0 0 14px; letter-spacing: -0.3px; line-height: 1.35;
`;
const FeaturedExcerpt = styled.p`
  font-size: 0.93rem; color: #4b5563; line-height: 1.75; margin: 0 0 20px;
`;

// Grid
const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;
const ArticleCard = styled.div`
  background: white; border-radius: 18px; overflow: hidden;
  box-shadow: 0 3px 16px rgba(20,57,32,0.07);
  border: 1px solid #e8f5e9;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: ${fadeUp} 0.4s ease both;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(20,57,32,0.12); }
`;
const ArticleImg = styled.img`
  width: 100%; height: 180px; object-fit: cover; display: block;
`;
const ArticleBody = styled.div`padding: 22px 20px;`;
const ArticleMeta = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 12px;
`;
const ArticleTitle = styled.h3`
  font-size: 0.97rem; font-weight: 800; color: #1a3318;
  margin: 0 0 10px; line-height: 1.45;
`;
const ArticleExcerpt = styled.p`
  font-size: 0.84rem; color: #6b7280; line-height: 1.65; margin: 0 0 16px;
  display: -webkit-box; -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
`;

const ArticleTag = styled.span`
  display: inline-block; padding: 3px 10px; border-radius: 999px;
  font-size: 0.7rem; font-weight: 700; white-space: nowrap;
  background: #f0fdf4; color: #166534;
`;
const MetaText = styled.span`
  font-size: 0.74rem; color: #9ca3af; font-weight: 500;
`;
const ReadMore = styled.button`
  background: none; border: none; padding: 0;
  font-size: 0.85rem; font-weight: 700; color: #2f5a2a; cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.7; }
`;

// Newsletter
const NewsletterSection = styled.section`
  background: linear-gradient(135deg, #1a3318 0%, #2f5a2a 100%);
  padding: 72px 24px; text-align: center;
`;
const NewsletterInner = styled.div`max-width: 520px; margin: 0 auto;`;
const NewsletterIcon  = styled.div`font-size: 2.5rem; margin-bottom: 14px;`;
const NewsletterTitle = styled.h2`
  font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800;
  color: white; margin: 0 0 10px; letter-spacing: -0.3px;
`;
const NewsletterSub = styled.p`
  color: rgba(255,255,255,0.72); font-size: 0.95rem; margin: 0 0 28px;
`;
const NewsletterForm = styled.form`
  display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;
`;
const NewsletterInput = styled.input`
  flex: 1; min-width: 220px; padding: 12px 18px; border-radius: 999px;
  border: none; font-size: 0.92rem; outline: none;
  background: rgba(255,255,255,0.15); color: white;
  &::placeholder { color: rgba(255,255,255,0.55); }
  &:focus { background: rgba(255,255,255,0.22); }
`;
const NewsletterBtn = styled.button`
  background: white; color: #2f5a2a; border: none;
  padding: 12px 26px; border-radius: 999px;
  font-size: 0.92rem; font-weight: 800; cursor: pointer;
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,0.15); }
`;
