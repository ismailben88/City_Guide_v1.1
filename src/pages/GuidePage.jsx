// pages/GuidePage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  ShieldCheck,
  MapPin,
  Star,
  Tag,
  ChevronDown,
  Globe,
  RotateCcw,
  CalendarDays,
  Zap,
} from "lucide-react";

import {
  setSearchQuery,
  setFilterCategory,
  setFilterMinRating,
  setFilterCity,
  setFilterLanguage,
  setFilterVerified,
  setFilterSpeciality,
  setFilterSortBy,
  setFilterAvailDay,
  setFilterAvailNow,
  resetFilters,
  loadMore,
  selectSearchQuery,
  selectFilters,
  selectFilteredGuides,
  selectVisibleCount,
  selectCities,
  selectLanguages,
  selectSpecialities,
} from "../store/slices/guideSlice";

import { useNavigation } from "../hooks/useNavigation";
import GuideListItem from "../components/ui/GuideListItem";
// import GuideListItem from "../components/UI/GuideListItem";

// ─────────────────────────────────────────────────────────────────────────────

const SIDEBAR_CATEGORIES = [
  { key: "All", label: "All guides", Icon: SlidersHorizontal },
  { key: "Rating", label: "Rating", Icon: Star },
  { key: "City", label: "City", Icon: MapPin },
  { key: "Language spoken", label: "Language", Icon: Globe },
  { key: "Verified guides", label: "Verified", Icon: ShieldCheck },
  { key: "Speciality", label: "Speciality", Icon: Tag },
  { key: "Availability", label: "Availability", Icon: CalendarDays },
];

const SORT_OPTIONS = [
  { value: "score", label: "Best score" },
  { value: "rating", label: "Highest rating" },
  { value: "price_asc", label: "Price: low → high" },
  { value: "price_desc", label: "Price: high → low" },
  { value: "name", label: "Name A → Z" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// ── Shared primitives ─────────────────────────────────────────────────────────
const FilterLabel = ({ children }) => (
  <p className="text-[11px] font-extrabold tracking-widest uppercase text-ink3 font-body mb-2">
    {children}
  </p>
);

const FilterSelect = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full px-3 py-2 rounded-xl border border-sand3 bg-white font-body text-[13px] font-semibold text-ink2 outline-none cursor-pointer focus:border-primary transition-colors"
  >
    {children}
  </select>
);

// ── Sub filter panel ──────────────────────────────────────────────────────────
function SubFilterPanel() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const cities = useSelector(selectCities);
  const languages = useSelector(selectLanguages);
  const specs = useSelector(selectSpecialities);

  if (filters.category === "All") return null;

  return (
    <div className="bg-sand rounded-2xl p-4 mt-1 flex flex-col gap-3 animate-fade-in">
      {/* Rating */}
      {filters.category === "Rating" && (
        <div>
          <FilterLabel>Minimum rating</FilterLabel>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() =>
                  dispatch(setFilterMinRating(filters.minRating === n ? 0 : n))
                }
                className={`flex items-center gap-0.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-body transition-all duration-150
                  ${
                    filters.minRating === n
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-sand3 bg-white text-ink3 hover:border-primary hover:text-primary"
                  }`}
              >
                {Array.from({ length: n }).map((_, i) => (
                  <Star key={i} size={10} className="fill-current" />
                ))}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City */}
      {filters.category === "City" && (
        <div>
          <FilterLabel>City</FilterLabel>
          <FilterSelect
            value={filters.city}
            onChange={(e) => dispatch(setFilterCity(e.target.value))}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </FilterSelect>
        </div>
      )}

      {/* Language */}
      {filters.category === "Language spoken" && (
        <div>
          <FilterLabel>Language</FilterLabel>
          <FilterSelect
            value={filters.language}
            onChange={(e) => dispatch(setFilterLanguage(e.target.value))}
          >
            <option value="">All languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </FilterSelect>
        </div>
      )}

      {/* Verified */}
      {filters.category === "Verified guides" && (
        <label className="flex items-center gap-2.5 cursor-pointer font-body text-sm font-semibold text-ink2">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => dispatch(setFilterVerified(e.target.checked))}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          Verified guides only
        </label>
      )}

      {/* Speciality */}
      {filters.category === "Speciality" && (
        <div>
          <FilterLabel>Speciality</FilterLabel>
          <div className="flex flex-wrap gap-1.5">
            {["", ...specs].map((s) => (
              <button
                key={s || "__all__"}
                onClick={() => dispatch(setFilterSpeciality(s))}
                className={`px-3 py-1 rounded-full border font-body text-[11px] font-bold transition-all duration-150
                  ${
                    filters.speciality === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-sand3 bg-white text-ink3 hover:border-primary hover:text-primary"
                  }`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Availability — uses schedule[].day + isCurrentlyAvailable */}
      {filters.category === "Availability" && (
        <>
          {/* Available now toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer font-body text-sm font-semibold text-ink2">
            <input
              type="checkbox"
              checked={filters.availNow}
              onChange={(e) => dispatch(setFilterAvailNow(e.target.checked))}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-emerald-500" />
              Available right now
            </span>
          </label>

          {/* Day pills */}
          <div>
            <FilterLabel>Open on day</FilterLabel>
            <div className="flex flex-wrap gap-1.5">
              {["", ...DAYS].map((d) => (
                <button
                  key={d || "__any__"}
                  onClick={() => dispatch(setFilterAvailDay(d))}
                  className={`px-3 py-1 rounded-full border font-body text-[11px] font-bold transition-all duration-150
                    ${
                      filters.availDay === d
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-sand3 bg-white text-ink3 hover:border-primary hover:text-primary"
                    }`}
                >
                  {d ? d.slice(0, 3) : "Any"}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function GuidePage() {
  const dispatch = useDispatch();
  const { goToGuide } = useNavigation();

  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const filteredGuides = useSelector(selectFilteredGuides);
  const visibleCount = useSelector(selectVisibleCount);

  const [searchFocused, setSearchFocused] = useState(false);

  const guidesToShow = filteredGuides.slice(0, visibleCount);
  const hasMore = filteredGuides.length > visibleCount;
  const activeFiltersCount = [
    filters.minRating > 0,
    filters.city !== "",
    filters.language !== "",
    filters.verifiedOnly,
    filters.speciality !== "",
    filters.availDay !== "",
    filters.availNow,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-sand">
      {/* ── Hero ── */}
      <div className="relative w-full h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=1400&q=85"
          alt="Morocco guides"
          className="w-full h-full object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/30 to-dark/70 flex flex-col items-center justify-center gap-2">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight text-center animate-slide-up-1">
            Find your local Guide
          </h1>
          <p className="font-body text-sm text-white/70 animate-slide-up-2">
            Handpicked experts across Morocco's most iconic cities
          </p>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="max-w-2xl mx-auto px-5 -mt-7 relative z-10 animate-fade-up">
        <div
          className={`flex items-center bg-white rounded-2xl px-4 py-1.5 gap-3 shadow-xl transition-all duration-200 border-2
          ${searchFocused ? "border-primary shadow-search" : "border-transparent"}`}
        >
          <Search size={18} className="text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, city, language, speciality…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 border-none outline-none bg-transparent font-body text-sm font-medium text-ink2 placeholder:text-ink3/50 placeholder:font-normal min-w-0 py-2"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className="w-7 h-7 rounded-full bg-sand2 text-ink3 flex items-center justify-center flex-shrink-0 hover:bg-sand3 hover:text-ink2 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {(searchQuery || activeFiltersCount > 0) && (
          <div className="flex items-center justify-between px-1 pt-2.5">
            <span className="font-body text-xs font-semibold text-ink3">
              {filteredGuides.length} guide
              {filteredGuides.length !== 1 ? "s" : ""} found
            </span>
            <button
              onClick={() => dispatch(resetFilters())}
              className="flex items-center gap-1.5 font-body text-xs font-bold text-accent hover:text-ink2 transition-colors"
            >
              <RotateCcw size={11} /> Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-7 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-7 py-9 pb-16">
          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-1.5 self-start lg:sticky lg:top-[90px]">
            <div className="hidden lg:flex items-center justify-between px-1 pb-3 border-b border-sand3 mb-1">
              <span className="font-body text-[11px] font-extrabold tracking-widest uppercase text-ink2">
                Filters
              </span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-white font-body text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 max-lg:flex-row max-lg:flex-wrap max-lg:gap-2">
              {SIDEBAR_CATEGORIES.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => dispatch(setFilterCategory(key))}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold text-left transition-all duration-150 font-body
                    ${
                      filters.category === key
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-transparent text-ink3 hover:bg-primary/5 hover:text-primary"
                    }
                    max-lg:w-auto max-lg:px-3 max-lg:py-2 max-lg:text-xs`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            <SubFilterPanel />

            {/* Sort */}
            <div className="hidden lg:block mt-2 pt-4 border-t border-sand3">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest uppercase text-ink3 font-body mb-2">
                <ArrowDownUp size={11} /> Sort by
              </p>
              <FilterSelect
                value={filters.sortBy}
                onChange={(e) => dispatch(setFilterSortBy(e.target.value))}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </FilterSelect>
            </div>
          </aside>

          {/* ── Guide list ── */}
          <div className="flex flex-col gap-3.5">
            {guidesToShow.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-5xl leading-none">🔍</span>
                <p className="font-body text-sm text-ink3">
                  No guides match your search.
                </p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-primary text-primary font-body text-sm font-bold hover:bg-primary hover:text-white transition-all duration-150"
                >
                  <X size={13} /> Reset filters
                </button>
              </div>
            ) : (
              guidesToShow.map((g, i) => (
                <GuideListItem
                  key={g.id}
                  guide={g}
                  index={i}
                  onClick={() => goToGuide(g)}
                />
              ))
            )}

            {hasMore && (
              <button
                onClick={() => dispatch(loadMore())}
                className="flex items-center justify-center gap-2 w-full py-3.5 mt-1.5 rounded-2xl border border-sand3 bg-white text-ink2 font-body text-sm font-bold hover:bg-sand hover:border-primary hover:text-primary transition-all duration-150"
              >
                <ChevronDown size={16} />
                Load more ({filteredGuides.length - visibleCount} remaining)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
