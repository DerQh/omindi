import AppNavbar from "./AppNavbar";
import styled, { keyframes } from "styled-components";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useListings } from "../../hooks/useListings";
import LoadingComponent from "./Loading";
import { ListingCardTest } from "./ListingCard";
import { useUser } from "../../hooks/useUser";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

const List = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const { data: user } = useUser();
  const user_id = user?.id;

  const { data, isLoading, error } = useListings();
  const dataMain = data?.filter((item) => item.seller_id !== user?.id);

  const categories = useMemo(() => {
    if (!dataMain) return ["All"];
    const cats = [
      ...new Set(dataMain.map((i) => i.category).filter(Boolean)),
    ].sort();
    return ["All", ...cats];
  }, [dataMain]);

  const filteredAndSorted = useMemo(() => {
    let result = dataMain ?? [];
    const search = searchTerm.toLowerCase();
    if (search) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.category?.toLowerCase().includes(search) ||
          item.location?.toLowerCase().includes(search),
      );
    }
    if (activeCategory !== "All") {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return result;
  }, [dataMain, searchTerm, activeCategory, sortBy]);

  const handleCardClick = (item) =>
    navigate(`/listing/${item.id}`, { state: { listing: item } });

  if (isLoading) return <LoadingComponent />;

  if (error)
    return (
      <>
        <AppNavbar />
        <ErrorWrap>
          <ErrorCard>
            <span>⚠️</span>
            <p>Something went wrong loading listings.</p>
          </ErrorCard>
        </ErrorWrap>
      </>
    );

  const hasFilters = searchTerm || activeCategory !== "All";

  return (
    <>
      <AppNavbar />

      {/* ── Filter bar — sibling of AppNavbar so sticky chains correctly ── */}
      <FilterBar>
        <FilterInner>
          <CategoryChips>
            {categories.map((cat) => (
              <Chip
                key={cat}
                $active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Chip>
            ))}
          </CategoryChips>

          <SelectsRow>
            <CategorySelect
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </CategorySelect>

            <SortSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SortSelect>
          </SelectsRow>
        </FilterInner>
      </FilterBar>

      <Page>
        {/* ── Hero ── */}
        <Hero>
          <HeroInner>
            <SearchWrap>
              <SearchInput
                type="text"
                placeholder="Search by name, category, or location…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <ClearBtn onClick={() => setSearchTerm("")}>✕</ClearBtn>
              )}
            </SearchWrap>
          </HeroInner>
        </Hero>

        {/* ── Body ── */}
        <Body>
          <BodyInner>
            <ResultsMeta>
              <ResultsCount>
                Total Listings {filteredAndSorted.length} 
                {/* {filteredAndSorted.length !== 1 ? "s" : ""} */}
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                {searchTerm ? ` for "${searchTerm}"` : ""}
              </ResultsCount>
            </ResultsMeta>

            {filteredAndSorted.length > 0 ? (
              <Grid>
                {filteredAndSorted.map((item) => (
                  <ListingCardTest
                    key={item.id}
                    listingItem={item}
                    handleCardClick={handleCardClick}
                    user_id={user_id}
                  />
                ))}
              </Grid>
            ) : (
              <EmptyState>
                <EmptyIcon>🌾</EmptyIcon>
                <EmptyTitle>No listings found</EmptyTitle>
                <EmptyDesc>
                  {hasFilters
                    ? "Try adjusting your search or filters."
                    : "No listings available right now — check back soon."}
                </EmptyDesc>
                {hasFilters && (
                  <ClearFiltersBtn
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("All");
                    }}
                  >
                    Clear filters
                  </ClearFiltersBtn>
                )}
              </EmptyState>
            )}
          </BodyInner>
        </Body>
      </Page>
    </>
  );
};

export default List;

// ─── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
`;

const Hero = styled.div`
  background: #f5f8f5;
  padding: 15px 24px 20px;
`;

const HeroInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  animation: ${fadeUp} 0.4s ease;
`;

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 44px;
  border-radius: 14px;
  border: 1px solid black;
  backdrop-filter: blur(8px);
  color: #0d0d0d;
  font-size: 16px;
  transition: background 0.2s;

  &::placeholder {
    color: rgba(11, 11, 11, 0.65);
    font-size: 14px;
  }
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 14px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterBar = styled.div`
  background: #f5f8f5;
  border-bottom: 1px solid #e8f0e8;
  position: sticky;
  top: 60px;
  z-index: 50;
`;

const FilterInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

const CategoryChips = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SelectsRow = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const CategorySelect = styled.select`
  display: none;
  padding: 7px 12px;
  border-radius: 10px;
  border: 1.5px solid #cde5cf;
  background: white;
  color: #44554c;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Chip = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  border: 1.5px solid ${({ $active }) => ($active ? "#2f5a2a" : "#cde5cf")};
  background: ${({ $active }) => ($active ? "#2f5a2a" : "white")};
  color: ${({ $active }) => ($active ? "white" : "#44554c")};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    border-color: #2f5a2a;
    color: ${({ $active }) => ($active ? "white" : "#2f5a2a")};
  }
`;

const SortSelect = styled.select`
  padding: 7px 12px;
  border-radius: 10px;
  border: 1.5px solid #cde5cf;
  background: white;
  color: #44554c;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #2f5a2a;
  }
`;

const Body = styled.div`
  padding: 24px 0 56px;
`;

const BodyInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  animation: ${fadeUp} 0.35s ease;
`;

const ResultsMeta = styled.div`
  margin-bottom: 16px;
`;

const ResultsCount = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #7b8f7f;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 72px 24px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 14px;
`;

const EmptyTitle = styled.p`
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a3318;
`;

const EmptyDesc = styled.p`
  margin: 0 0 22px;
  color: #7b8f7f;
  font-size: 0.9rem;
`;

const ClearFiltersBtn = styled.button`
  background: #2f5a2a;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #245026;
  }
`;

const ErrorWrap = styled.div`
  min-height: 100vh;
  background: #f5f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorCard = styled.div`
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.07);

  span {
    font-size: 2rem;
  }
  p {
    color: #7b8f7f;
    margin: 12px 0 0;
  }
`;
