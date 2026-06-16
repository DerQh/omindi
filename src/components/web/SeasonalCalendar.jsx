import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Navbar from "./Navbar";
import FooterContainer from "./Footer";
import SEO from "./SEO";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Kenyan seasonal produce data — month indices 0-11
const PRODUCE = [
  { name: "Tomatoes",       category: "Vegetables", peak: [0,1,5,6,7], good: [2,3,4,8,9,10,11] },
  { name: "Sukuma Wiki",    category: "Vegetables", peak: [0,1,2,3,4,5,6,7,8,9,10,11], good: [] },
  { name: "Spinach",        category: "Vegetables", peak: [2,3,4,9,10,11], good: [0,1,5,6,7,8] },
  { name: "Capsicum",       category: "Vegetables", peak: [0,1,6,7,8], good: [2,3,4,5,9,10,11] },
  { name: "Cabbage",        category: "Vegetables", peak: [3,4,5,9,10,11], good: [0,1,2,6,7,8] },
  { name: "Carrots",        category: "Vegetables", peak: [3,4,5,10,11], good: [0,1,2,6,7,8,9] },
  { name: "Onions",         category: "Vegetables", peak: [6,7,8,9], good: [0,1,2,3,4,5,10,11] },
  { name: "Avocado",        category: "Fruits",     peak: [2,3,4,5,6], good: [0,1,7,8,9,10,11] },
  { name: "Mango",          category: "Fruits",     peak: [10,11,0,1], good: [2,3,9] },
  { name: "Passion Fruit",  category: "Fruits",     peak: [3,4,5,9,10,11], good: [0,1,2,6,7,8] },
  { name: "Banana",         category: "Fruits",     peak: [0,1,2,3,4,5,6,7,8,9,10,11], good: [] },
  { name: "Pineapple",      category: "Fruits",     peak: [0,1,2,7,8,9], good: [3,4,5,6,10,11] },
  { name: "Watermelon",     category: "Fruits",     peak: [8,9,10,11], good: [0,1,7] },
  { name: "Milk",           category: "Dairy",      peak: [0,1,2,3,4,5,6,7,8,9,10,11], good: [] },
  { name: "Eggs",           category: "Poultry",    peak: [0,1,2,3,4,5,6,7,8,9,10,11], good: [] },
  { name: "Honey",          category: "Honey",      peak: [1,2,3,4,7,8,9], good: [0,5,6,10,11] },
  { name: "Maize",          category: "Grains",     peak: [7,8,9,10], good: [6,11] },
  { name: "Beans",          category: "Grains",     peak: [7,8,9], good: [6,10] },
  { name: "Arrow Roots",    category: "Vegetables", peak: [3,4,5,9,10,11], good: [0,1,2,6,7,8] },
  { name: "Sweet Potatoes", category: "Vegetables", peak: [1,2,3,4,8,9,10], good: [0,5,6,7,11] },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CATEGORIES = ["All", "Vegetables", "Fruits", "Dairy", "Grains", "Honey", "Poultry"];

export default function SeasonalCalendar() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [activeCategory, setActiveCategory] = useState("All");

  const inSeason = PRODUCE.filter((p) => {
    const matches = activeCategory === "All" || p.category === activeCategory;
    const available = p.peak.includes(selectedMonth) || p.good.includes(selectedMonth);
    return matches && available;
  }).sort((a, b) => {
    const aPeak = a.peak.includes(selectedMonth) ? 0 : 1;
    const bPeak = b.peak.includes(selectedMonth) ? 0 : 1;
    return aPeak - bPeak;
  });

  return (
    <Page>
      <SEO
        title="Seasonal Produce Calendar — AFARMER™"
        description="Discover what fresh produce is in season across Kenya each month. Plan your farm purchases with AFARMER™."
      />
      <Navbar />

      <Hero>
        <HeroInner>
          <Eyebrow>Farm Calendar</Eyebrow>
          <HeroTitle>What's in Season?</HeroTitle>
          <HeroSub>
            Know what to grow, buy, and expect every month. Based on Kenya's two growing seasons.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Content>
        {/* Month picker */}
        <MonthGrid>
          {MONTHS.map((m, i) => (
            <MonthBtn
              key={m}
              $active={selectedMonth === i}
              $current={i === currentMonth}
              onClick={() => setSelectedMonth(i)}
            >
              {m}
              {i === currentMonth && <CurrentDot />}
            </MonthBtn>
          ))}
        </MonthGrid>

        {/* Category filter */}
        <CategoryRow>
          {CATEGORIES.map((c) => (
            <CatChip key={c} $active={activeCategory === c} onClick={() => setActiveCategory(c)}>
              {c}
            </CatChip>
          ))}
        </CategoryRow>

        {/* Summary */}
        <SummaryRow>
          <SummaryTitle>
            {MONTH_FULL[selectedMonth]}
            {selectedMonth === currentMonth && <CurrentBadge>This month</CurrentBadge>}
          </SummaryTitle>
          <SummaryCount>{inSeason.length} items available</SummaryCount>
        </SummaryRow>

        {/* Produce grid */}
        <ProduceGrid>
          {inSeason.map((p) => {
            const isPeak = p.peak.includes(selectedMonth);
            return (
              <ProduceCard key={p.name} $peak={isPeak}>
                <ProduceStatus $peak={isPeak}>
                  {isPeak ? "★ Peak" : "Good"}
                </ProduceStatus>
                <ProduceName>{p.name}</ProduceName>
                <ProduceCat>{p.category}</ProduceCat>
                <PeakMonths>
                  Best: {p.peak.map((mi) => MONTHS[mi]).join(", ")}
                </PeakMonths>
              </ProduceCard>
            );
          })}
        </ProduceGrid>

        {inSeason.length === 0 && (
          <EmptyState>
            <span>🌧️</span>
            <p>No {activeCategory !== "All" ? activeCategory.toLowerCase() : "produce"} available in {MONTH_FULL[selectedMonth]}.</p>
          </EmptyState>
        )}

        {/* Legend */}
        <Legend>
          <LegendItem>
            <LegendDot $peak />
            <span>Peak season — best quality & price</span>
          </LegendItem>
          <LegendItem>
            <LegendDot />
            <span>Good — available but not at peak</span>
          </LegendItem>
        </Legend>

        <SeasonNote>
          <strong>Kenya has two main growing seasons:</strong> the long rains (March–May) and short rains (October–December). Produce availability varies by county and altitude.
        </SeasonNote>
      </Content>

      <FooterContainer />
    </Page>
  );
}

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  background: #f5f8f5;
  min-height: 100vh;
`;

const Hero = styled.section`
  background: linear-gradient(135deg, #1e3d1a 0%, #2f5a2a 100%);
  padding: 72px 32px 80px;
  text-align: center;
`;

const HeroInner = styled.div`
  max-width: 680px;
  margin: 0 auto;
  animation: ${fadeUp} 0.5s ease;
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6fcf6f;
`;

const HeroTitle = styled.h1`
  margin: 0 0 14px;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.04em;
`;

const HeroSub = styled.p`
  margin: 0;
  font-size: 1rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.75;
`;

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const MonthBtn = styled.button`
  position: relative;
  padding: 12px 6px;
  border-radius: 12px;
  border: 2px solid ${({ $active }) => ($active ? "#2f5a2a" : "transparent")};
  background: ${({ $active }) => ($active ? "#eef7ee" : "white")};
  color: ${({ $active }) => ($active ? "#2f5a2a" : "#556652")};
  font-size: 0.85rem;
  font-weight: ${({ $active }) => ($active ? "800" : "600")};
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(20,57,32,0.06);

  &:hover {
    border-color: #2f5a2a;
    background: #f5fbf5;
  }
`;

const CurrentDot = styled.div`
  position: absolute;
  top: 5px;
  right: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2f5a2a;
`;

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
`;

const CatChip = styled.button`
  padding: 7px 16px;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => ($active ? "#2f5a2a" : "#d7edd9")};
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#556652")};
  font-size: 0.83rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #2f5a2a; }
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
`;

const SummaryTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 900;
  color: #1a2e1a;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CurrentBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  background: #eef7ee;
  color: #2f5a2a;
  border: 1px solid #cde5cf;
  letter-spacing: 0.04em;
`;

const SummaryCount = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #7b8f7f;
  font-weight: 600;
`;

const ProduceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
`;

const ProduceCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px 16px;
  border: 2px solid ${({ $peak }) => ($peak ? "#cde5cf" : "#e8f0e8")};
  box-shadow: 0 2px 10px rgba(20,57,32,0.06);
  animation: ${fadeUp} 0.3s ease;
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(20,57,32,0.12);
  }
`;

const ProduceStatus = styled.span`
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 9px;
  border-radius: 999px;
  margin-bottom: 8px;
  background: ${({ $peak }) => ($peak ? "#2f5a2a" : "#f0f7ee")};
  color: ${({ $peak }) => ($peak ? "white" : "#556652")};
`;

const ProduceName = styled.p`
  margin: 0 0 3px;
  font-size: 1rem;
  font-weight: 800;
  color: #1a2e1a;
`;

const ProduceCat = styled.p`
  margin: 0 0 8px;
  font-size: 0.75rem;
  color: #7b8f7f;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PeakMonths = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #2f5a2a;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: #7b8f7f;

  span { font-size: 2rem; display: block; margin-bottom: 10px; }
  p { font-size: 0.9rem; }
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #556652;
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $peak }) => ($peak ? "#2f5a2a" : "#d7edd9")};
  border: 2px solid ${({ $peak }) => ($peak ? "#2f5a2a" : "#aac4aa")};
`;

const SeasonNote = styled.div`
  background: #eef7ee;
  border: 1px solid #cde5cf;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 0.85rem;
  color: #556652;
  line-height: 1.65;
  strong { color: #2f5a2a; }
`;
