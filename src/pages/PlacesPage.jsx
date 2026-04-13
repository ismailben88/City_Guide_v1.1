// pages/PlacesPage.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigation } from "../hooks/useNavigation";

import { api } from "../services/api";
import PlaceCard from "../components/placeCard/PlaceCard"; 

// ─── Inline SVG icons (zero extra deps) ──────────────────────────────────────
const IconSearch  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconX       = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconSliders = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>;
const IconChevron = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>;
const IconMap     = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "default",  label: "En vedette"      },
  { value: "rating",   label: "Mieux notés"     },
  { value: "reviews",  label: "Plus d'avis"     },
  { value: "name",     label: "Nom A → Z"       },
  { value: "price",    label: "Prix croissant"  },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse-soft"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="h-48 bg-stone-100" />
      <div className="p-4 flex flex-col gap-2.5">
        <div className="h-3.5 w-2/3 rounded-full bg-stone-100" />
        <div className="h-3 w-1/2 rounded-full bg-stone-100" />
        <div className="h-3 w-2/5 rounded-full bg-stone-100" />
      </div>
    </div>
  );
}

export default function PlacesPage() {
  const { goToPlace } = useNavigation();

  const [places,         setPlaces]         = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [loading,         setLoading]        = useState(true);
  const [query,           setQuery]          = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy,         setSortBy]         = useState("default");
  const [filtersOpen,     setFiltersOpen]    = useState(false);
  const [sortOpen,       setSortOpen]       = useState(false);
  const [searchFocused,   setSearchFocused]  = useState(false);

  const inputRef = useRef(null);
  const sortRef  = useRef(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────
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

  // ── Helper to render Icon safely ──────────────────────────────────────────
  const renderIcon = (iconData) => {
    if (!iconData) return "📍";
    if (typeof iconData === 'string') return iconData;
    return iconData.name || iconData.icon || "📍";
  };

  // ── Filter + Sort ──────────────────────────────────────────────────────────
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

  const hasFilters   = !!(query.trim() || activeCategory !== "all");
  const resetAll     = () => { setQuery(""); setActiveCategory("all"); setSortBy("default"); };
  
  const selectedCat  = categories.find((c) => c.id === activeCategory);
  const activeLabel  = activeCategory === "all" ? "Tous les lieux" : (selectedCat?.name ?? "Lieux");
  const sortLabel    = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Trier";

  return (
    <div className="min-h-screen bg-[#f7f3ee]">
      {/* ── Hero ────────────────────────────────────────────────────────────────── */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=85"
          alt="Maroc"
          className="w-full h-full object-cover object-[center_40%] animate-zoom-in"
          style={{ filter: "brightness(.62) saturate(1.1)" }}
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2.5"
          style={{
            background: "linear-gradient(160deg, rgba(20,12,3,.15) 0%, rgba(20,12,3,.68) 100%)",
          }}
        >
          <p className="font-body text-[11px] font-semibold tracking-[.26em] uppercase text-white/55 m-0 animate-slide-up-1">
            City Guide · Maroc
          </p>

          <h1 className="font-display text-[clamp(2.2rem,5vw,3.2rem)] font-bold italic text-white m-0 leading-tight tracking-tight text-center animate-slide-up-2">
            Explorer les Lieux
          </h1>

          <p className="font-body text-[13px] text-white/60 m-0 text-center max-w-sm animate-slide-up-3">
            Mosquées, médinas, plages et jardins — tout le Maroc à portée de main
          </p>

          {!loading && (
            <div className="flex items-center gap-5 mt-1.5 animate-slide-up-4">
              {[
                { value: places.length, label: "Lieux" },
                { value: categories.length, label: "Catégories" },
                { value: places.filter((p) => p.isFeatured).length, label: "En vedette" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-5">
                  {i > 0 && <div className="w-px h-6 bg-white/20" />}
                  <div className="flex flex-col items-center gap-0.5">
                    <strong className="font-display text-[1.35rem] font-bold text-white leading-none">
                      {stat.value}
                    </strong>
                    <span className="font-body text-[10px] tracking-[.13em] uppercase text-white/50">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search strip ──────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 -mt-7 relative z-10 animate-fade-up" style={{ animationDelay: ".25s" }}>
        <div className="flex gap-2.5 items-center">
          <div
            onClick={() => inputRef.current?.focus()}
            className={`flex-1 flex items-center gap-2.5 bg-white rounded-2xl px-4 h-[50px] cursor-text
                        border-2 transition-all duration-200
                        ${searchFocused ? "border-primary shadow-[0_8px_36px_rgba(91,133,35,.2)]" : "border-transparent shadow-[0_8px_36px_rgba(0,0,0,.12)]"}`}
          >
            <span className={`flex-shrink-0 transition-colors duration-200 ${searchFocused ? "text-primary" : "text-stone-400"}`}>
              <IconSearch />
            </span>
            <input
              ref={inputRef}
              placeholder="Rechercher un lieu, une ville, une catégorie…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 border-none outline-none bg-transparent font-body text-sm font-medium text-dark placeholder-stone-300"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="w-6 h-6 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center cursor-pointer hover:bg-stone-200"
              >
                <IconX />
              </button>
            )}
          </div>

          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`flex items-center gap-2 h-[50px] px-5 rounded-2xl border-2 font-body text-[13px] font-semibold
                        cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,.08)]
                        ${filtersOpen || activeCategory !== "all" ? "border-primary bg-primary/10 text-primary" : "border-stone-200 bg-white text-stone-500"}`}
          >
            <IconSliders />
            Filtres
            {activeCategory !== "all" && (
              <span className="w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">1</span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="flex flex-wrap gap-2 pt-3 animate-fade-in">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] font-body text-[12px] font-semibold cursor-pointer transition-all
                          ${activeCategory === "all" ? "border-primary bg-primary text-white" : "border-stone-200 bg-white text-stone-500 hover:border-primary"}`}
            >
              🗺️ Tous
            </button>
            {categories.map((cat) => {
              const on = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(on ? "all" : cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] font-body text-[12px] font-semibold cursor-pointer transition-all
                              ${on ? "border-primary bg-primary text-white" : "border-stone-200 bg-white text-stone-500 hover:border-primary"}`}
                >
                  <span>{renderIcon(cat.icon)}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {hasFilters && (
          <div className="flex items-center justify-between pt-2.5 px-1 animate-fade-in">
            <span className="font-body text-[12px] font-semibold text-stone-400">
              {filtered.length} lieu{filtered.length !== 1 ? "x" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </span>
            <button onClick={resetAll} className="flex items-center gap-1 border-none bg-transparent font-bold text-accent cursor-pointer text-[12px]">
              <IconX /> Réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* ── Main content ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-5">
        <div className="flex items-center justify-between pt-9 pb-5 gap-3 flex-wrap">
          <div>
            <h2 className="font-display text-[1.7rem] font-bold text-dark m-0">
              {activeLabel}
              <span className="font-body text-[13px] font-medium text-stone-400 ml-2">({filtered.length})</span>
            </h2>
            {activeCategory !== "all" && (
              <p className="font-body text-[12px] text-stone-400 m-0 mt-1">
                {renderIcon(selectedCat?.icon)} &nbsp;Catégorie sélectionnée
              </p>
            )}
          </div>

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 h-10 px-4 rounded-xl border-[1.5px] border-stone-200 bg-white font-body text-[13px] font-semibold text-dark cursor-pointer transition-all"
            >
              {sortLabel}
              <span className={`transition-transform ${sortOpen ? "rotate-180" : ""}`}><IconChevron /></span>
            </button>

            {sortOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 min-w-[170px] bg-white rounded-xl border border-stone-100 shadow-xl z-50 overflow-hidden animate-scale-in">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                    className={`w-full block px-4 py-2.5 text-left font-body text-[13px] border-none cursor-pointer
                                ${sortBy === o.value ? "text-primary font-bold bg-primary/5" : "text-stone-600 hover:bg-stone-50"}`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-stone-200 mb-5" />

        <div className="grid gap-[22px] pb-20" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} delay={i * 0.08} />)
          ) : filtered.length === 0 ? (
            <div className="col-[1/-1] flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="text-stone-300"><IconMap /></span>
              <p className="font-body text-[14px] text-stone-400 m-0">Aucun lieu ne correspond à votre recherche.</p>
              <button onClick={resetAll} className="px-5 py-2.5 rounded-full border border-primary text-primary font-bold cursor-pointer hover:bg-primary hover:text-white transition-all">
                Réinitialiser les filtres
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