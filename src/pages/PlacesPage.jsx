import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigation } from "../hooks/useNavigation";
import { api } from "../services/api";
import PlaceCard from "../components/placeCard/PlaceCard";
import {
  TbMapPin, TbSearch, TbX, TbAdjustmentsHorizontal,
  TbChevronDown, TbMap,
} from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "default",  label: "Featured"        },
  { value: "rating",   label: "Top rated"       },
  { value: "reviews",  label: "Most reviewed"   },
  { value: "name",     label: "Name A → Z"      },
  { value: "price",    label: "Price: low–high" },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="h-48 bg-[#f0ebe4]" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="h-3.5 w-2/3 rounded-full bg-[#ede8e0]" />
        <div className="h-3 w-1/2 rounded-full bg-[#ede8e0]" />
        <div className="h-3 w-2/5 rounded-full bg-[#ede8e0]" />
      </div>
    </div>
  );
}

export default function PlacesPage() {
  const { goToPlace } = useNavigation();

  const [places,         setPlaces]         = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [query,          setQuery]          = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy,         setSortBy]         = useState("default");
  const [sortOpen,       setSortOpen]       = useState(false);
  const [filtersOpen,    setFiltersOpen]    = useState(false);

  const sortRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    Promise.all([api.getPlaces(), api.getInterestCategories()])
      .then(([placesData, catsData]) => {
        setPlaces(placesData);
        const used = new Set(placesData.map((p) => p.categoryId));
        setCategories(catsData.filter((c) => used.has(c.id)));
        setLoading(false);
      })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const renderIcon = (iconData) => {
    if (!iconData) return "📍";
    if (typeof iconData === "string") return iconData;
    return iconData.name || iconData.icon || "📍";
  };

  const filtered = useMemo(() => {
    let list = [...places];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.cityName?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categoryId === activeCategory);
    }
    switch (sortBy) {
      case "rating":  list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)); break;
      case "reviews": list.sort((a, b) => (b.reviewCount   || 0) - (a.reviewCount   || 0)); break;
      case "name":    list.sort((a, b) => a.name.localeCompare(b.name));                     break;
      case "price":   list.sort((a, b) => (a.entryFee      || 0) - (b.entryFee      || 0)); break;
      default:        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [query, activeCategory, sortBy, places]);

  const hasFilters    = !!(query.trim() || activeCategory !== "all");
  const resetAll      = () => { setQuery(""); setActiveCategory("all"); setSortBy("default"); };
  const selectedCat   = categories.find((c) => c.id === activeCategory);
  const activeLabel   = activeCategory === "all" ? "All Places" : (selectedCat?.name ?? "Places");
  const sortLabel     = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";
  const featuredCount = places.filter((p) => p.isFeatured).length;

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Hero ── */}
      <section className="relative h-[520px] overflow-hidden">

        {/* Background */}
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=85"
          alt="Places in Morocco"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] scale-[1.04]"
        />

        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-[4px]
                        bg-gradient-to-b from-[#6b9c3e] via-[#a8d060] to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center
                        px-8 sm:px-14 lg:px-20 max-w-5xl pb-[80px]">

          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full w-fit
                        bg-[#6b9c3e]/70 backdrop-blur-sm border border-[#a8d060]/40
                        text-white text-[11px] font-bold uppercase tracking-widest
                        font-[Nunito,sans-serif]"
          >
            <TbMapPin size={12} />
            Discover Morocco
          </div>

          {/* Title */}
          <h1
            className="font-[Playfair_Display,Georgia,serif]
                       text-[clamp(2.6rem,6vw,4.2rem)] font-bold leading-[1.08]
                       text-white mb-4 drop-shadow-xl"
          >
            Explore{" "}
            <span className="text-transparent bg-clip-text
                             bg-gradient-to-r from-[#a8d060] to-[#6b9c3e]">
              Places
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/65 text-[15px] max-w-md font-[Nunito,sans-serif]
                        leading-relaxed mb-8">
            Mosques, medinas, beaches and gardens — all of Morocco at your fingertips
          </p>

          {/* Hero search bar */}
          <div className="flex items-center gap-2 max-w-lg">
            <div className="relative flex-1">
              <TbSearch
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places, cities, categories…"
                className="w-full pl-11 pr-10 py-3.5 rounded-[14px]
                           bg-white/15 backdrop-blur-md border border-white/25
                           text-white placeholder-white/45 text-[13px]
                           font-[Nunito,sans-serif]
                           focus:outline-none focus:border-[#a8d060]/60
                           focus:bg-white/20 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-white/50 hover:text-white transition-colors"
                >
                  <TbX size={14} />
                </button>
              )}
            </div>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-[14px]
                         bg-[#6b9c3e] hover:bg-[#5a8833] text-white flex-shrink-0
                         transition-all duration-200 hover:scale-105 active:scale-95
                         shadow-[0_4px_16px_rgba(107,156,62,0.5)]"
            >
              <HiArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Stats strip — frosted glass pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0
                        bg-black/30 backdrop-blur-md border-t border-white/10">
          <div className="max-w-5xl px-8 sm:px-14 lg:px-20 py-4 flex items-center">
            {!loading ? (
              [
                { value: places.length,     label: "Places"     },
                { value: categories.length,  label: "Categories" },
                { value: featuredCount,      label: "Featured"   },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 pr-8
                              ${i > 0 ? "pl-8 border-l border-white/15" : ""}`}
                >
                  <span className="font-[Playfair_Display,Georgia,serif]
                                   text-[22px] font-bold text-white">
                    {value}
                  </span>
                  <span className="text-white/50 text-[11px] font-bold uppercase
                                   tracking-widest font-[Nunito,sans-serif]">
                    {label}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-20 rounded-full bg-white/10 animate-pulse" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#ede8e0]
                      shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

          {/* Row 1: search + filters + sort */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <TbSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09080]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search places…"
                className="w-full pl-9 pr-8 py-2 text-[13px] rounded-[10px]
                           border-[1.5px] border-[#ede8e0] bg-[#faf7f2]
                           font-[Nunito,sans-serif] text-[#3d2b1a] placeholder-[#c4b8a8]
                           focus:outline-none focus:border-[#6b9c3e] transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2
                             text-[#a09080] hover:text-[#3d2b1a] transition-colors"
                >
                  <TbX size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px]
                          border-[1.5px] font-[Nunito,sans-serif] text-[13px] font-bold
                          transition-all duration-200
                          ${filtersOpen || activeCategory !== "all"
                            ? "border-[#6b9c3e] bg-[#edf7e4] text-[#6b9c3e]"
                            : "border-[#ede8e0] bg-white text-[#7a6a58] hover:border-[#6b9c3e] hover:text-[#6b9c3e]"
                          }`}
            >
              <TbAdjustmentsHorizontal size={15} />
              Filters
              {activeCategory !== "all" && (
                <span className="w-[18px] h-[18px] rounded-full bg-[#6b9c3e] text-white
                                  text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {hasFilters && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1 px-3 py-2 rounded-[10px]
                           text-[12px] font-[Nunito,sans-serif] text-[#c8761a] font-bold
                           border-[1.5px] border-[#f0d4a0] bg-[#fdf6ec]
                           hover:bg-[#faebd7] transition-colors"
              >
                <TbX size={13} /> Clear
              </button>
            )}

            {/* Sort dropdown */}
            <div className="relative ml-auto" ref={sortRef}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 h-9 px-4 rounded-[10px]
                           border-[1.5px] border-[#ede8e0] bg-white
                           font-[Nunito,sans-serif] text-[13px] font-semibold text-[#3d2b1a]
                           hover:border-[#6b9c3e] transition-all"
              >
                {sortLabel}
                <TbChevronDown
                  size={14}
                  className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortOpen && (
                <div className="absolute top-[calc(100%+6px)] right-0 min-w-[180px]
                                bg-white rounded-[14px] border border-[#ede8e0]
                                shadow-[0_8px_32px_rgba(61,43,26,0.12)] z-50 overflow-hidden">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                      className={`w-full block px-4 py-2.5 text-left
                                  font-[Nunito,sans-serif] text-[13px]
                                  ${sortBy === o.value
                                    ? "text-[#6b9c3e] font-bold bg-[#edf7e4]"
                                    : "text-[#5a4a3a] hover:bg-[#faf7f2]"
                                  }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category pills */}
          {filtersOpen && (
            <div className="flex flex-wrap gap-2 pt-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                            border-[1.5px] font-[Nunito,sans-serif] text-[12px] font-bold
                            transition-all
                            ${activeCategory === "all"
                              ? "border-[#6b9c3e] bg-[#6b9c3e] text-white"
                              : "border-[#ede8e0] bg-white text-[#7a6a58] hover:border-[#6b9c3e]"
                            }`}
              >
                🗺️ All
              </button>
              {categories.map((cat) => {
                const on = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(on ? "all" : cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                                border-[1.5px] font-[Nunito,sans-serif] text-[12px] font-bold
                                transition-all
                                ${on
                                  ? "border-[#6b9c3e] bg-[#6b9c3e] text-white"
                                  : "border-[#ede8e0] bg-white text-[#7a6a58] hover:border-[#6b9c3e]"
                                }`}
                  >
                    <span>{renderIcon(cat.icon)}</span>
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1240px] mx-auto px-5">
        <div className="flex items-center justify-between pt-8 pb-5 gap-3 flex-wrap">
          <div>
            <h2 className="font-[Playfair_Display,Georgia,serif] text-[1.7rem] font-bold
                           text-[#3d2b1a] m-0">
              {activeLabel}
              <span className="font-[Nunito,sans-serif] text-[13px] font-medium
                               text-[#9e8e80] ml-2">
                ({filtered.length})
              </span>
            </h2>
            {activeCategory !== "all" && (
              <p className="font-[Nunito,sans-serif] text-[12px] text-[#9e8e80] m-0 mt-1">
                {renderIcon(selectedCat?.icon)}&nbsp; Selected category
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-[#ede8e0] mb-5" />

        <div
          className="grid gap-[22px] pb-20"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}
        >
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} delay={i * 0.08} />)
          ) : filtered.length === 0 ? (
            <div className="col-[1/-1] flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#f5f0ea] flex items-center justify-center mb-2">
                <TbMap size={28} className="text-[#c4b8a8]" />
              </div>
              <h3 className="font-[Playfair_Display,serif] text-lg font-bold text-[#3d2b1a] m-0">
                No places found
              </h3>
              <p className="font-[Nunito,sans-serif] text-[13px] text-[#9e8e80] max-w-xs m-0">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={resetAll}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#6b9c3e] text-white
                           font-[Nunito,sans-serif] font-bold text-sm
                           hover:bg-[#c8761a] transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((p, i) => (
              <PlaceCard
                key={p.id}
                place={{
                  ...p,
                  img: p.coverImage,
                  title: p.name,
                  rating: p.averageRating,
                }}
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
