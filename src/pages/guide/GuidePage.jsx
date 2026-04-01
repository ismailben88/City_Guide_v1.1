// pages/GuidePage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiXMark, HiChevronDown } from "react-icons/hi2";
import { RiSearchLine, RiFilterLine, RiSortDesc, RiShieldCheckLine, RiMapPin2Line } from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";
import { TbTag } from "react-icons/tb";

import {
  setSearchQuery, setFilterCategory, setFilterMinRating,
  setFilterCity, setFilterLanguage, setFilterVerified,
  setFilterSpeciality, setFilterSortBy, resetFilters, loadMore,
  selectSearchQuery, selectFilters, selectFilteredGuides,
  selectVisibleCount, selectCities, selectLanguages, selectSpecialities,
} from "../store/slices/guideSlice";

import { useNavigation } from "../hooks/useNavigation";
import GuideListItem from "../components/UI/GuideListItem";

import {
  PageWrap, Hero, HeroOverlay, HeroTitle, HeroSub,
  SearchWrap, SearchBox, SearchIcon, SearchInput,
  SearchClear, SearchMeta, ResultCount, ResetBtn,
  Container, Layout,
  Sidebar, SidebarHeader, SidebarTitle, FilterBadge,
  FilterItem, FilterItemIcon,
  FilterPanel, FilterLabel, FilterSelect,
  StarRow, StarBtn, CheckLabel, TagsGrid, TagBtn,
  SortWrap,
  ListWrap, EmptyState, EmptyIcon, EmptyText, EmptyBtn,
  LoadMoreBtn,
} from "./GuidePage.styles";

// ─────────────────────────────────────────────────────────────────────────────
const SIDEBAR_CATEGORIES = [
  { key: "All",             label: "All guides",  icon: <RiFilterLine      size={14} /> },
  { key: "Rating",          label: "Rating",      icon: <IoStarSharp       size={14} /> },
  { key: "City",            label: "City",        icon: <RiMapPin2Line     size={14} /> },
  { key: "Language spoken", label: "Language",    icon: "🌐" },
  { key: "Verified guides", label: "Verified",    icon: <RiShieldCheckLine size={14} /> },
  { key: "Speciality",      label: "Speciality",  icon: <TbTag             size={14} /> },
];

const SORT_OPTIONS = [
  { value: "score",  label: "Best score"     },
  { value: "rating", label: "Highest rating" },
  { value: "name",   label: "Name A → Z"     },
];

// ── Sub filter panel ──────────────────────────────────────────────────────────
function SubFilterPanel() {
  const dispatch  = useDispatch();
  const filters   = useSelector(selectFilters);
  const cities    = useSelector(selectCities);
  const languages = useSelector(selectLanguages);
  const specs     = useSelector(selectSpecialities);

  if (filters.category === "All") return null;

  return (
    <FilterPanel>
      {filters.category === "Rating" && (
        <>
          <FilterLabel>Minimum rating</FilterLabel>
          <StarRow>
            {[1, 2, 3, 4, 5].map((n) => (
              <StarBtn
                key={n}
                $active={filters.minRating === n}
                onClick={() => dispatch(setFilterMinRating(filters.minRating === n ? 0 : n))}
              >
                {Array.from({ length: n }).map((_, i) => <IoStarSharp key={i} size={11} />)}
              </StarBtn>
            ))}
          </StarRow>
        </>
      )}

      {filters.category === "City" && (
        <>
          <FilterLabel>City</FilterLabel>
          <FilterSelect value={filters.city} onChange={(e) => dispatch(setFilterCity(e.target.value))}>
            <option value="">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </FilterSelect>
        </>
      )}

      {filters.category === "Language spoken" && (
        <>
          <FilterLabel>Language</FilterLabel>
          <FilterSelect value={filters.language} onChange={(e) => dispatch(setFilterLanguage(e.target.value))}>
            <option value="">All languages</option>
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
          </FilterSelect>
        </>
      )}

      {filters.category === "Verified guides" && (
        <CheckLabel>
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => dispatch(setFilterVerified(e.target.checked))}
          />
          Verified guides only
        </CheckLabel>
      )}

      {filters.category === "Speciality" && (
        <>
          <FilterLabel>Speciality</FilterLabel>
          <TagsGrid>
            <TagBtn $active={!filters.speciality} onClick={() => dispatch(setFilterSpeciality(""))}>All</TagBtn>
            {specs.map((s) => (
              <TagBtn
                key={s}
                $active={filters.speciality === s}
                onClick={() => dispatch(setFilterSpeciality(filters.speciality === s ? "" : s))}
              >
                {s}
              </TagBtn>
            ))}
          </TagsGrid>
        </>
      )}
    </FilterPanel>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  GuidePage
// ─────────────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const dispatch       = useDispatch();
  const { goToGuide }  = useNavigation();

  const searchQuery    = useSelector(selectSearchQuery);
  const filters        = useSelector(selectFilters);
  const filteredGuides = useSelector(selectFilteredGuides);
  const visibleCount   = useSelector(selectVisibleCount);

  const [searchFocused, setSearchFocused] = useState(false);

  const guidesToShow       = filteredGuides.slice(0, visibleCount);
  const hasMore            = filteredGuides.length > visibleCount;
  const activeFiltersCount = [
    filters.minRating > 0,
    filters.city      !== "",
    filters.language  !== "",
    filters.verifiedOnly,
    filters.speciality !== "",
  ].filter(Boolean).length;

  return (
    <PageWrap>
      <Hero>
        <img src="https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=1400&q=85" alt="Morocco guides" />
        <HeroOverlay>
          <HeroTitle>Find your local Guide</HeroTitle>
          <HeroSub>Handpicked experts across Morocco's most iconic cities</HeroSub>
        </HeroOverlay>
      </Hero>

      <SearchWrap>
        <SearchBox $focused={searchFocused}>
          <SearchIcon><RiSearchLine size={18} /></SearchIcon>
          <SearchInput
            placeholder="Search by name, city, language, speciality…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <SearchClear onClick={() => dispatch(setSearchQuery(""))}><HiXMark size={14} /></SearchClear>
          )}
        </SearchBox>
        {(searchQuery || activeFiltersCount > 0) && (
          <SearchMeta>
            <ResultCount>{filteredGuides.length} guide{filteredGuides.length !== 1 ? "s" : ""} found</ResultCount>
            <ResetBtn onClick={() => dispatch(resetFilters())}><HiXMark size={12} /> Reset filters</ResetBtn>
          </SearchMeta>
        )}
      </SearchWrap>

      <Container>
        <Layout>
          <Sidebar>
            <SidebarHeader>
              <SidebarTitle>Filters</SidebarTitle>
              {activeFiltersCount > 0 && <FilterBadge>{activeFiltersCount}</FilterBadge>}
            </SidebarHeader>

            {SIDEBAR_CATEGORIES.map(({ key, label, icon }) => (
              <FilterItem key={key} $active={filters.category === key} onClick={() => dispatch(setFilterCategory(key))}>
                <FilterItemIcon>{icon}</FilterItemIcon>
                {label}
              </FilterItem>
            ))}

            <SubFilterPanel />

            <SortWrap>
              <FilterLabel><RiSortDesc size={13} style={{ marginRight: 5 }} />Sort by</FilterLabel>
              <FilterSelect value={filters.sortBy} onChange={(e) => dispatch(setFilterSortBy(e.target.value))}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </FilterSelect>
            </SortWrap>
          </Sidebar>

          <ListWrap>
            {guidesToShow.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyText>No guides match your search.</EmptyText>
                <EmptyBtn onClick={() => dispatch(resetFilters())}><HiXMark size={13} /> Reset filters</EmptyBtn>
              </EmptyState>
            ) : (
              guidesToShow.map((g, i) => (
                <GuideListItem key={g.id} guide={g} index={i} onClick={() => goToGuide(g)} />
              ))
            )}

            {hasMore && (
              <LoadMoreBtn onClick={() => dispatch(loadMore())}>
                <HiChevronDown size={16} />
                Load more ({filteredGuides.length - visibleCount} remaining)
              </LoadMoreBtn>
            )}
          </ListWrap>
        </Layout>
      </Container>
    </PageWrap>
  );
}
