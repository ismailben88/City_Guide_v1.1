// pages/PlacesPage.jsx
import { useState, useMemo } from "react";
import { RiSearchLine, RiFilterLine, RiSortDesc } from "react-icons/ri";
import { HiXMark } from "react-icons/hi2";
import { TbLeaf, TbBuildingMonument, TbWaveSine,
         TbTrees, TbShoppingBag } from "react-icons/tb";

import { useNavigation }  from "../../hooks/useNavigation";

import { places }         from "../../data/index";

import {
  PageWrap, Hero, HeroOverlay, HeroTitle, HeroSub,
  SearchWrap, SearchRow, SearchBox, SearchIcon, SearchInput,
  SearchClear, FilterToggle, SearchMeta, ResultCount, ResetBtn,
  FiltersBar, FilterPill,
  Container, TopBar, SectionTitle, SortSelect,
  Grid, EmptyState, EmptyIcon, EmptyText, EmptyBtn,
} from "./PlacesPage.styles";
import { PlaceCard } from "../../components/UI";

// ─── Filter categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",       label: "All",        icon: <RiFilterLine         size={12} /> },
  { key: "nature",    label: "Nature",     icon: <TbTrees              size={12} /> },
  { key: "history",   label: "History",    icon: <TbBuildingMonument   size={12} /> },
  { key: "beach",     label: "Beach",      icon: <TbWaveSine           size={12} /> },
  { key: "market",    label: "Markets",    icon: <TbShoppingBag        size={12} /> },
  { key: "nature",    label: "Gardens",    icon: <TbLeaf               size={12} /> },
];

const SORT_OPTIONS = [
  { value: "default", label: "Featured"       },
  { value: "rating",  label: "Highest rating" },
  { value: "name",    label: "Name A → Z"     },
  { value: "price",   label: "Price ↑"        },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function PlacesPage() {
  const { goToPlace } = useNavigation();

  const [query,         setQuery]         = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy,        setSortBy]        = useState("default");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilters,   setShowFilters]   = useState(false);

  // ── filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...places];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q)   ||
        p.city?.toLowerCase().includes(q)    ||
        p.category?.toLowerCase().includes(q)||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== "all") {
      list = list.filter((p) =>
        p.category?.toLowerCase() === activeCategory
      );
    }

    if (sortBy === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "name")   list.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "price")  list.sort((a, b) => (a.price || 0) - (b.price || 0));

    return list;
  }, [query, activeCategory, sortBy]);

  const hasFilters = query.trim() || activeCategory !== "all";

  const resetAll = () => {
    setQuery("");
    setActiveCategory("all");
    setSortBy("default");
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageWrap>

      {/* ── Hero ── */}
      <Hero>
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=85"
          alt="Morocco places"
        />
        <HeroOverlay>
          <HeroTitle>Explore Places</HeroTitle>
          <HeroSub>Discover Morocco's most iconic destinations & hidden gems</HeroSub>
        </HeroOverlay>
      </Hero>

      {/* ── Search + filter toggle ── */}
      <SearchWrap>
        <SearchRow>
          <SearchBox $focused={searchFocused}>
            <SearchIcon><RiSearchLine size={18} /></SearchIcon>
            <SearchInput
              placeholder="Search places, cities, categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {query && (
              <SearchClear onClick={() => setQuery("")} aria-label="Clear">
                <HiXMark size={14} />
              </SearchClear>
            )}
          </SearchBox>

          <FilterToggle
            $active={showFilters || activeCategory !== "all"}
            onClick={() => setShowFilters((v) => !v)}
          >
            <RiFilterLine size={15} />
            Filters
          </FilterToggle>
        </SearchRow>

        {/* ── Category pills ── */}
        {showFilters && (
          <FiltersBar>
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c.key + c.label}
                $active={activeCategory === c.key}
                onClick={() => setActiveCategory(activeCategory === c.key ? "all" : c.key)}
              >
                {c.icon}
                {c.label}
              </FilterPill>
            ))}
          </FiltersBar>
        )}

        {/* ── Meta: count + reset ── */}
        {hasFilters && (
          <SearchMeta>
            <ResultCount>
              {filtered.length} place{filtered.length !== 1 ? "s" : ""} found
            </ResultCount>
            <ResetBtn onClick={resetAll}>
              <HiXMark size={12} /> Reset
            </ResetBtn>
          </SearchMeta>
        )}
      </SearchWrap>

      {/* ── Main content ── */}
      <Container>
        <TopBar>
          <SectionTitle>
            {activeCategory === "all" ? "All Places" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
            &nbsp;
            <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: "14px", fontWeight: 600, color: "#9e8e80" }}>
              ({filtered.length})
            </span>
          </SectionTitle>

          <SortSelect
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort places"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SortSelect>
        </TopBar>

        <Grid>
          {filtered.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🗺️</EmptyIcon>
              <EmptyText>No places match your search.</EmptyText>
              <EmptyBtn onClick={resetAll}>
                <HiXMark size={13} /> Reset filters
              </EmptyBtn>
            </EmptyState>
          ) : (
            filtered.map((p, i) => (
              <PlaceCard
                key={p.id}
                place={p}
                index={i}
                onClick={() => goToPlace(p)}
              />
            ))
          )}
        </Grid>
      </Container>

    </PageWrap>
  );
}
