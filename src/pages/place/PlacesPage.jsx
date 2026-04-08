// pages/PlacesPage.jsx
import { useState, useMemo, useEffect } from "react";
import { RiSearchLine, RiFilterLine, RiSortDesc } from "react-icons/ri";
import { HiXMark } from "react-icons/hi2";
import { TbLeaf, TbBuildingMonument, TbWaveSine,
         TbTrees, TbShoppingBag } from "react-icons/tb";

import { useNavigation }  from "../../hooks/useNavigation";
import { PlaceCardd  }      from "../../components/UI";
import { api }            from "../../services/api";

// ─── Filter categories ────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",       label: "All",        icon: <RiFilterLine         size={12} /> },
  { key: "nature",    label: "Nature",     icon: <TbTrees              size={12} /> },
  { key: "history",   label: "History",    icon: <TbBuildingMonument   size={12} /> },
  { key: "beach",     label: "Beach",      icon: <TbWaveSine           size={12} /> },
  { key: "market",    label: "Markets",    icon: <TbShoppingBag        size={12} /> },
  { key: "gardens",   label: "Gardens",    icon: <TbLeaf               size={12} /> },
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

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query,         setQuery]         = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy,        setSortBy]        = useState("default");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilters,   setShowFilters]   = useState(false);

  // Fetch places from API
  useEffect(() => {
    api.getPlaces()
      .then((data) => {
        setPlaces(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch places:", err);
        setLoading(false);
      });
  }, []);

  // ── filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...places];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q)   ||
        p.cityName?.toLowerCase().includes(q)    ||
        p.category?.toLowerCase().includes(q)||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== "all") {
      list = list.filter((p) =>
        p.category?.toLowerCase() === activeCategory
      );
    }

    if (sortBy === "rating") list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    if (sortBy === "name")   list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price")  list.sort((a, b) => (a.entryFee || 0) - (b.entryFee || 0));

    return list;
  }, [query, activeCategory, sortBy, places]);

  const hasFilters = query.trim() || activeCategory !== "all";

  const resetAll = () => {
    setQuery("");
    setActiveCategory("all");
    setSortBy("default");
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ── Hero ── */}
      <div className="relative w-full h-[280px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=85"
          alt="Morocco places"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(61,43,26,0.32)] to-[rgba(61,43,26,0.70)]
                        flex flex-col items-center justify-center gap-2">
          <h1 className="font-[Playfair_Display,Georgia,serif] text-[clamp(2rem,5vw,3.2rem)] font-bold
                         text-white m-0 -tracking-[0.02em] text-center animate-fade-up">
            Explore Places
          </h1>
          <p className="font-[Nunito,sans-serif] text-[14px] text-white/72 m-0 animate-fade-up"
             style={{ animationDelay: "0.1s" }}>
            Discover Morocco's most iconic destinations & hidden gems
          </p>
        </div>
      </div>

      {/* ── Search + filter toggle ── */}
      <div className="max-w-[860px] mx-auto -mt-7 px-5 relative z-10 animate-fade-up"
           style={{ animationDelay: "0.2s" }}>
        <div className="flex gap-2.5 items-center">
          {/* Search box */}
          <div className={`flex-1 flex items-center bg-white rounded-[14px] px-4 py-1.5 gap-2.5
                           shadow-[0_8px_32px_rgba(0,0,0,0.13)] border-2
                           ${searchFocused ? "border-[#6b9c3e] shadow-[0_8px_32px_rgba(107,156,62,0.18)]" : "border-transparent"}`}>
            <span className="text-[#6b9c3e] flex-shrink-0">
              <RiSearchLine size={18} />
            </span>
            <input
              placeholder="Search places, cities, categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 border-none outline-none bg-transparent font-[Nunito,sans-serif]
                         text-[14px] font-medium text-[#3d2b1a] placeholder-[#b0a090]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear"
                className="w-7 h-7 rounded-full border-none bg-[#f0ebe4] text-[#7a6a58]
                           flex items-center justify-center flex-shrink-0 cursor-pointer
                           transition-all duration-[180ms] ease-in-out
                           hover:bg-[#e0d8ce] hover:text-[#3d2b1a]"
              >
                <HiXMark size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            className={`flex items-center gap-[7px] px-[18px] py-2.5 rounded-[14px] border-2
                        font-[Nunito,sans-serif] text-[13px] font-bold cursor-pointer
                        shadow-[0_8px_32px_rgba(0,0,0,0.1)] whitespace-nowrap transition-all duration-[200ms] ease-in-out
                        ${showFilters || activeCategory !== "all"
                          ? "border-[#6b9c3e] bg-[rgba(107,156,62,0.1)] text-[#6b9c3e]"
                          : "border-[#e0d8ce] bg-white text-[#7a6a58]"}`}
            onClick={() => setShowFilters((v) => !v)}
          >
            <RiFilterLine size={15} />
            Filters
          </button>
        </div>

        {/* ── Category pills ── */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-3.5 animate-fade-in">
            {CATEGORIES.map((c) => (
              <button
                key={c.key + c.label}
                className={`flex items-center gap-[5px] px-[14px] py-1.5 rounded-full border-[1.5px]
                            font-[Nunito,sans-serif] text-[12px] font-bold cursor-pointer transition-all duration-[180ms] ease-in-out
                            ${activeCategory === c.key
                              ? "border-[#6b9c3e] bg-[rgba(107,156,62,0.1)] text-[#6b9c3e]"
                              : "border-[#e0d8ce] bg-white text-[#7a6a58] hover:border-[#6b9c3e] hover:text-[#6b9c3e]"}`}
                onClick={() => setActiveCategory(activeCategory === c.key ? "all" : c.key)}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Meta: count + reset ── */}
        {hasFilters && (
          <div className="flex items-center justify-between pt-2.5 px-1">
            <span className="font-[Nunito,sans-serif] text-[12px] font-semibold text-[#7a6a58]">
              {filtered.length} place{filtered.length !== 1 ? "s" : ""} found
            </span>
            <button
              onClick={resetAll}
              className="flex items-center gap-[5px] bg-none border-none font-[Nunito,sans-serif]
                         text-[12px] font-bold text-[#c8761a] cursor-pointer p-0 transition-colors duration-[180ms]"
            >
              <HiXMark size={12} /> Reset
            </button>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1200px] mx-auto px-7 md:px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-8 pb-4.5 gap-3 flex-wrap">
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[1.5rem] font-bold text-[#3d2b1a] m-0">
            {activeCategory === "all" ? "All Places" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
            &nbsp;
            <span className="font-[Nunito,sans-serif] text-[14px] font-semibold text-[#9e8e80]">
              ({filtered.length})
            </span>
          </h2>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort places"
            className="px-[14px] py-2 rounded-[10px] border-[1.5px] border-[#e0d8ce] bg-white
                       font-[Nunito,sans-serif] text-[13px] font-semibold text-[#3d2b1a]
                       outline-none cursor-pointer transition-colors duration-[180ms]
                       focus:border-[#6b9c3e]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[22px] pb-[60px]
                        md:grid-cols-1">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20 text-[#9e8e80]">
              Loading places...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-[72px] px-5 gap-3 text-center">
              <span className="text-[52px]">🗺️</span>
              <p className="font-[Nunito,sans-serif] text-[14px] text-[#9e8e80] m-0">
                No places match your search.
              </p>
              <button
                onClick={resetAll}
                className="flex items-center gap-[6px] px-[22px] py-2.5 rounded-full border-[1.5px] border-[#6b9c3e]
                           bg-transparent text-[#6b9c3e] font-[Nunito,sans-serif] text-[13px] font-bold
                           cursor-pointer transition-all duration-[180ms] ease-in-out
                           hover:bg-[#6b9c3e] hover:text-white"
              >
                <HiXMark size={13} /> Reset filters
              </button>
            </div>
          ) : (
            filtered.map((p, i) => (
              <PlaceCardd
                key={p.id}
                place={p}
                index={i}
                onClick={() => goToPlace(p)}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}
