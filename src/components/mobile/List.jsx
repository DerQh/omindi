import AppNavbar from "./AppNavbar";
import { Helmet } from "react-helmet-async";
import styled, { keyframes, css } from "styled-components";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useListings, useSearchListings } from "../../hooks/useListings";
import { useQueryClient } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ListingCardTest } from "./ListingCard";
import { useUser } from "../../hooks/useUser";
import { useSavedSearches, useSaveSearch, useDeleteSavedSearch } from "../../hooks/useSavedSearches";
import { useLanguage } from "../../context/LanguageContext";

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
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cols, setCols] = useState(1);
  const gridRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const user_id = user?.id;

  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const { data: savedSearches = [] }  = useSavedSearches(user_id);
  const { mutate: saveSearch }        = useSaveSearch();
  const { mutate: deleteSavedSearch } = useDeleteSavedSearch();

  const { data: allData, isLoading, error, refetch } = useListings();
  const { data: searchData, isFetching: isSearching } =
    useSearchListings(searchTerm);

  // Use server-side search results when query is active, otherwise use all listings
  const dataMain = (allData ?? []).filter(
    (item) => item.seller_id !== user?.id,
  );

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
          item.location?.toLowerCase().includes(search) ||
          item.seller_name?.toLowerCase().includes(search),
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

  // Scroll to top when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchTerm, activeCategory, sortBy]);


  // Responsive column count based on grid container width
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setCols(Math.max(1, Math.floor(w / 280)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Group filtered items into rows for the virtualizer
  const rows = useMemo(() => {
    const r = [];
    for (let i = 0; i < filteredAndSorted.length; i += cols) {
      r.push(filteredAndSorted.slice(i, i + cols));
    }
    return r;
  }, [filteredAndSorted, cols]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => 420,
    overscan: 5,
    scrollMargin: gridRef.current?.offsetTop ?? 0,
  });

  // Close autocomplete when clicking outside search box
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Pull-to-refresh via touch
  const touchStartY = useRef(0);
  const onTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const onTouchEnd = useCallback(
    async (e) => {
      const delta = e.changedTouches[0].clientY - touchStartY.current;
      if (window.scrollY === 0 && delta > 80) {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
      }
    },
    [refetch],
  );


  // Autocomplete suggestions — top 5 matching titles
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const q = searchTerm.toLowerCase();
    return (allData ?? [])
      .filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.seller_name?.toLowerCase().includes(q),
      )
      .slice(0, 5);
  }, [searchTerm, allData]);

  const handleCardClick = (item) =>
    navigate(`/listing/${item.id}`, { state: { listing: item } });

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
      <Helmet>
        <title>Browse Listings — AFARMER™</title>
      </Helmet>
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

      <Page onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {refreshing && <PullIndicator>↻ Refreshing…</PullIndicator>}

        {/* ── Hero ── */}
        <Hero>
          <HeroInner>
            <SearchWrap ref={searchRef}>
              <SearchInput
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowSuggestions(false);
                    e.target.blur();
                  }
                  if (e.key === "Escape") {
                    setSearchTerm("");
                    setShowSuggestions(false);
                  }
                }}
              />
              {isSearching && <SearchSpinner>⟳</SearchSpinner>}
              {searchTerm && !isSearching && (
                <ClearBtn
                  onClick={() => {
                    setSearchTerm("");
                    setShowSuggestions(false);
                  }}
                >
                  ✕
                </ClearBtn>
              )}
              {showSuggestions && suggestions.length > 0 && (
                <AutocompleteList>
                  {suggestions.map((s) => (
                    <AutocompleteItem
                      key={s.id}
                      onMouseDown={() => {
                        setSearchTerm(s.title);
                        setShowSuggestions(false);
                        handleCardClick(s);
                      }}
                    >
                      <AutocompleteThumb
                        src={s.image_url || "/afarmer.webp"}
                        alt=""
                        onError={(e) => {
                          e.target.src = "/afarmer.webp";
                        }}
                      />
                      <div>
                        <AutocompleteTitle>{s.title}</AutocompleteTitle>
                        <AutocompleteMeta>
                          {s.category} · Kes {s.price}
                        </AutocompleteMeta>
                      </div>
                    </AutocompleteItem>
                  ))}
                </AutocompleteList>
              )}
            </SearchWrap>
          </HeroInner>
        </Hero>

        {/* ── Body ── */}
        <Body>
          <BodyInner ref={gridRef}>
            <ResultsMeta>
              <ResultsCount>
                {t.totalListings} {filteredAndSorted.length}
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
                {searchTerm ? ` for "${searchTerm}"` : ""}
              </ResultsCount>
              <div style={{ display: "flex", gap: 8 }}>
                {user_id && (searchTerm || activeCategory !== "All") && (
                  <SaveSearchBtn
                    onClick={() =>
                      saveSearch({ user_id, label: searchTerm || activeCategory, query: searchTerm, category: activeCategory !== "All" ? activeCategory : "" })
                    }
                    title={t.saveSearch}
                  >
                    🔖 {t.saveSearch}
                  </SaveSearchBtn>
                )}
                {user_id && savedSearches.length > 0 && (
                  <SaveSearchBtn onClick={() => setShowSavedPanel((p) => !p)} title={t.savedSearchesTitle}>
                    📂 {t.savedSearches} ({savedSearches.length})
                  </SaveSearchBtn>
                )}
                <AddListingBtn onClick={() => navigate("/newlist")}>
                  {t.addListing}
                </AddListingBtn>
              </div>
            </ResultsMeta>

            {/* Saved searches panel */}
            {showSavedPanel && savedSearches.length > 0 && (
              <SavedPanel>
                <SavedPanelTitle>{t.savedSearchesTitle}</SavedPanelTitle>
                {savedSearches.map((s) => (
                  <SavedRow key={s.id}>
                    <SavedLabel
                      onClick={() => {
                        if (s.query) setSearchTerm(s.query);
                        if (s.category) setActiveCategory(s.category || "All");
                        setShowSavedPanel(false);
                      }}
                    >
                      🔍 {s.label}
                      {s.category && s.category !== "All" && <span style={{ color: "#7b8f7f", fontWeight: 500 }}> · {s.category}</span>}
                    </SavedLabel>
                    <SavedDeleteBtn
                      onClick={() => deleteSavedSearch({ id: s.id, user_id })}
                      title="Remove"
                    >✕</SavedDeleteBtn>
                  </SavedRow>
                ))}
              </SavedPanel>
            )}

            {isLoading ? (
              <Grid $cols={cols}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i}>
                    <SkeletonImg />
                    <SkeletonBody>
                      <SkeletonLine $w="60%" $h="18px" />
                      <SkeletonLine $w="40%" $h="14px" />
                      <SkeletonLine $w="80%" $h="12px" />
                    </SkeletonBody>
                  </SkeletonCard>
                ))}
              </Grid>
            ) : filteredAndSorted.length > 0 ? (
              <VirtualGrid
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
              >
                {rowVirtualizer.getVirtualItems().map((vRow) => (
                  <VirtualRow
                    key={vRow.key}
                    data-index={vRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{ transform: `translateY(${vRow.start - rowVirtualizer.options.scrollMargin}px)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                  >
                    {rows[vRow.index].map((item, i) => (
                      <ListingCardTest
                        key={item.id}
                        listingItem={item}
                        handleCardClick={handleCardClick}
                        user_id={user_id}
                        index={vRow.index * cols + i}
                      />
                    ))}
                  </VirtualRow>
                ))}
              </VirtualGrid>
            ) : (
              <EmptyState>
                <EmptyIcon>🌾</EmptyIcon>
                <EmptyTitle>{t.noListingsFound}</EmptyTitle>
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

const SaveSearchBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1.5px solid #d7edd9;
  background: white;
  color: #2f5a2a;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover { background: #eef7ee; }
`;

const SavedPanel = styled.div`
  background: white;
  border: 1.5px solid #d7edd9;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 16px;
  animation: ${fadeUp} 0.2s ease;
`;

const SavedPanelTitle = styled.p`
  margin: 0 0 10px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7b8f7f;
`;

const SavedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f7ee;
  &:last-child { border-bottom: none; }
`;

const SavedLabel = styled.button`
  flex: 1;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.87rem;
  font-weight: 600;
  color: #1a2e1a;
  cursor: pointer;
  padding: 0;
  &:hover { text-decoration: underline; }
`;

const SavedDeleteBtn = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 2px 6px;
  &:hover { color: #ef4444; }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const SkeletonBase = css`
  background: linear-gradient(90deg, #e8f0e8 25%, #f3f7f3 50%, #e8f0e8 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite;
  border-radius: 8px;
`;

const SkeletonCard = styled.div`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(20, 57, 32, 0.06);
`;

const SkeletonImg = styled.div`
  height: 200px;
  ${SkeletonBase}
  border-radius: 0;
`;

const SkeletonBody = styled.div`
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonLine = styled.div`
  height: ${({ $h }) => $h || "14px"};
  width: ${({ $w }) => $w || "100%"};
  ${SkeletonBase}
`;

const PullIndicator = styled.div`
  text-align: center;
  padding: 10px;
  font-size: 0.82rem;
  color: #2f5a2a;
  font-weight: 600;
  background: #f0fdf4;
  border-bottom: 1px solid #d1fae5;
`;

const AutocompleteList = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(20, 57, 32, 0.14);
  z-index: 100;
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow: hidden;
`;

const AutocompleteItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #f0fdf4;
  }
`;

const AutocompleteThumb = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const AutocompleteTitle = styled.p`
  margin: 0 0 2px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #1a3318;
`;

const AutocompleteMeta = styled.p`
  margin: 0;
  font-size: 0.76rem;
  color: #7b8f7f;
`;

const LoadMoreIndicator = styled.p`
  text-align: center;
  padding: 20px;
  font-size: 0.85rem;
  color: #7b8f7f;
  font-weight: 600;
`;

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
  padding: 14px 14px;
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

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;
const SearchSpinner = styled.span`
  position: absolute;
  right: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  animation: ${spin} 0.8s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 8px 16px;
  }
`;

const CategoryChips = styled.div`
  display: flex;
  gap: 6px;
  flex: 1;
  overflow-x: auto;
  flex-wrap: nowrap;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SelectsRow = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;

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
  font-size: 13px;
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
  padding: 5px 13px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
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
  font-size: 13px;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const btnPulse = keyframes`
  0%, 100% { box-shadow: 0 2px 8px rgba(47,90,42,0.35); }
  50%       { box-shadow: 0 4px 20px rgba(47,90,42,0.6); }
`;

const AddListingBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #3a6e34, #2f5a2a);
  color: white;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  cursor: pointer;
  white-space: nowrap;
  animation: ${btnPulse} 2.4s ease-in-out infinite;
  transition:
    transform 0.15s,
    background 0.15s;
  &:hover {
    background: linear-gradient(135deg, #2f5a2a, #245026);
    transform: translateY(-2px);
    animation: none;
    box-shadow: 0 6px 18px rgba(47, 90, 42, 0.5);
  }
  &:active {
    transform: scale(0.96);
  }
`;

const ResultsCount = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #7b8f7f;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols || 1}, 1fr);
  gap: 20px;
`;

const VirtualGrid = styled.div`
  position: relative;
  width: 100%;
`;

const VirtualRow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: grid;
  gap: 20px;
  padding-bottom: 20px;
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

const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  gap: 12px;
`;

const PageBtn = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  border: 1.5px solid #cde5cf;
  background: white;
  color: #2f5a2a;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: #2f5a2a;
    color: white;
    border-color: #2f5a2a;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #7b8f7f;
  white-space: nowrap;
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
