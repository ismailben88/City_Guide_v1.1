import { useEffect, useState } from "react";
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

// Import de ton service API
import { api } from "../services/api";

import heroImg from "../images/heroSlider/1.png";

import {
  setGuides,
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

// ── Constantes ─────────────────────────────────────────────────────────────
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

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ── Primitives UI ──────────────────────────────────────────────────────────
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

// ── Composant SubFilterPanel ───────────────────────────────────────────────
function SubFilterPanel() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const cities = useSelector(selectCities);
  const languages = useSelector(selectLanguages);
  const specs = useSelector(selectSpecialities);

  if (filters.category === "All") return null;

  return (
    <div className="bg-sand rounded-2xl p-4 mt-1 flex flex-col gap-3 animate-fade-in border border-sand3/30">
      {/* Rating */}
      {filters.category === "Rating" && (
        <div>
          <FilterLabel>Minimum rating</FilterLabel>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => dispatch(setFilterMinRating(filters.minRating === n ? 0 : n))}
                className={`flex items-center gap-0.5 px-3 py-1.5 rounded-full border text-xs font-semibold font-body transition-all
                  ${filters.minRating === n ? "border-primary bg-primary/10 text-primary" : "border-sand3 bg-white text-ink3 hover:border-primary"}`}
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
          <FilterSelect value={filters.city} onChange={(e) => dispatch(setFilterCity(e.target.value))}>
            <option value="">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </FilterSelect>
        </div>
      )}

      {/* Language */}
      {filters.category === "Language spoken" && (
        <div>
          <FilterLabel>Language</FilterLabel>
          <FilterSelect value={filters.language} onChange={(e) => dispatch(setFilterLanguage(e.target.value))}>
            <option value="">All languages</option>
            {languages.map((l) => <option key={l} value={l}>{l}</option>)}
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
                className={`px-3 py-1 rounded-full border font-body text-[11px] font-bold transition-all
                  ${filters.speciality === s ? "border-primary bg-primary/10 text-primary" : "border-sand3 bg-white text-ink3 hover:border-primary"}`}
              >
                {s || "All"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {filters.category === "Availability" && (
        <>
          <label className="flex items-center gap-2.5 cursor-pointer font-body text-sm font-semibold text-ink2">
            <input
              type="checkbox"
              checked={filters.availNow}
              onChange={(e) => dispatch(setFilterAvailNow(e.target.checked))}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-emerald-500" /> Available now
            </span>
          </label>
          <div>
            <FilterLabel>Day</FilterLabel>
            <div className="flex flex-wrap gap-1.5">
              {["", ...DAYS].map((d) => (
                <button
                  key={d || "__any__"}
                  onClick={() => dispatch(setFilterAvailDay(d))}
                  className={`px-3 py-1 rounded-full border font-body text-[11px] font-bold transition-all
                    ${filters.availDay === d ? "border-primary bg-primary/10 text-primary" : "border-sand3 bg-white text-ink3 hover:border-primary"}`}
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

// ── Page Principale ────────────────────────────────────────────────────────
export default function GuidePage() {
  const dispatch = useDispatch();
  const { goToGuide } = useNavigation();

  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const filteredGuides = useSelector(selectFilteredGuides);
  const visibleCount = useSelector(selectVisibleCount);

  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch des données via ton api.js (Port 3001)
  useEffect(() => {
    const fetchGuidesData = async () => {
      try {
        setLoading(true);
        setError(null);
        // On récupère une large liste pour que Redux puisse filtrer localement
        const data = await api.getGuides(50); 
        dispatch(setGuides(data));
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Unable to connect to server on port 3001.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuidesData();
  }, [dispatch]);

  const guidesToShow = filteredGuides.slice(0, visibleCount);
  const hasMore = filteredGuides.length > visibleCount;

  const activeFiltersCount = [
    filters.minRating > 0, filters.city !== "", filters.language !== "",
    filters.verifiedOnly, filters.speciality !== "", filters.availDay !== "", filters.availNow
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-sand">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[580px] overflow-hidden">

        {/* Background */}
        <img
          src={heroImg}
          alt="Morocco"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/90" />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

        {/* Warm bloom — top right */}
        <div className="absolute -top-16 -right-16 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pb-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-[7px] mb-7 animate-slide-up-1">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span className="font-body text-[10.5px] font-bold tracking-[0.13em] uppercase text-white/85">
              200+ Verified Local Experts
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-white leading-[1.08] mb-3 animate-slide-up-2 [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.4rem)" }}>
            Find Your Perfect
            <br />
            <span className="text-accent italic">Local Guide</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-[15px] text-white/58 max-w-[420px] leading-relaxed mb-8 animate-slide-up-3">
            Handpicked experts across Morocco's iconic cities —
            trusted by thousands of travelers
          </p>

          {/* Search bar */}
          <div className="w-full max-w-[600px] animate-slide-up-4">
            <div className={`flex items-center gap-3 px-5 py-[10px] rounded-[18px] border-2 transition-all duration-200
              shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]
              backdrop-blur-2xl
              ${searchFocused
                ? "bg-white/20 border-white/50"
                : "bg-white/10 border-white/18"}`}>

              <Search size={16} className="text-white/50 shrink-0" />

              <input
                type="text"
                placeholder="Search by name, city, language..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent border-none outline-none font-body text-sm text-white placeholder:text-white/38 py-1.5"
              />

              {searchQuery && (
                <button
                  onClick={() => dispatch(setSearchQuery(""))}
                  className="shrink-0 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                >
                  <X size={11} />
                </button>
              )}

              <div className="w-px h-5 bg-white/18 shrink-0" />

              <button className="shrink-0 flex items-center gap-1.5 bg-white hover:bg-sand text-ink1 rounded-xl px-5 py-2 font-body text-[13px] font-bold transition-all hover:scale-[1.03] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
                <Search size={12} /> Search
              </button>
            </div>

            {(searchQuery || activeFiltersCount > 0) && (
              <div className="flex items-center justify-between px-1 pt-3">
                <span className="font-body text-xs font-semibold text-white/50">
                  {filteredGuides.length} guide{filteredGuides.length !== 1 ? "s" : ""} found
                </span>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="flex items-center gap-1.5 font-body text-xs font-bold text-white/50 hover:text-white transition-colors"
                >
                  <RotateCcw size={10} /> Reset
                </button>
              </div>
            )}
          </div>

          {/* Stats bar */}
          <div className="flex items-stretch mt-8 rounded-2xl overflow-hidden border border-white/12 backdrop-blur-xl bg-white/7 animate-slide-up-5">
            {[
              { icon: <Star size={14} className="text-yellow-400 fill-yellow-400" />, value: "4.9", label: "Avg Rating" },
              { icon: <MapPin size={14} className="text-emerald-400" />, value: "15+", label: "Cities" },
              { icon: <Globe size={14} className="text-sky-400" />, value: "8", label: "Languages" },
              { icon: <ShieldCheck size={14} className="text-primary" />, value: "200+", label: "Verified" },
            ].map((s, i) => (
              <div key={s.label}
                className={`flex items-center gap-2.5 px-5 py-3 ${i < 3 ? "border-r border-white/10" : ""}`}>
                <span className="flex shrink-0">{s.icon}</span>
                <div className="text-left">
                  <p className="font-body text-[13px] font-bold text-white leading-none">{s.value}</p>
                  <p className="font-body text-[10px] text-white/42 leading-none mt-[3px]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Layout Principal */}
      <div className="max-w-7xl mx-auto px-7 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          
          {/* Sidebar */}
          <aside className="flex flex-col gap-1.5 self-start lg:sticky lg:top-[90px]">
            <div className="hidden lg:flex items-center justify-between px-1 pb-3 border-b border-sand3 mb-1">
              <span className="font-body text-[11px] font-extrabold tracking-widest uppercase text-ink2">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </div>

            <div className="flex flex-col gap-1 max-lg:flex-row max-lg:flex-wrap">
              {SIDEBAR_CATEGORIES.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => dispatch(setFilterCategory(key))}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all font-body
                    ${filters.category === key ? "border-primary bg-primary/10 text-primary" : "border-transparent text-ink3 hover:bg-primary/5"}`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            <SubFilterPanel />

            <div className="hidden lg:block mt-2 pt-4 border-t border-sand3">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest uppercase text-ink3 font-body mb-2">
                <ArrowDownUp size={11} /> Sort by
              </p>
              <FilterSelect value={filters.sortBy} onChange={(e) => dispatch(setFilterSortBy(e.target.value))}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </FilterSelect>
            </div>
          </aside>

          {/* Liste de Guides */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-body text-sm text-ink3">Finding local experts...</p>
              </div>
            ) : error ? (
              <div className="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-red-100">
                <p className="text-red-500 font-bold mb-2">Server Connection Error</p>
                <p className="text-ink3 text-xs mb-4">{error}</p>
                <code className="text-[10px] bg-sand p-2 rounded block">Check if json-server is running on port 3001</code>
              </div>
            ) : guidesToShow.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-5xl mb-2">🔍</span>
                <p className="font-body text-sm text-ink3">No guides found for your criteria.</p>
                <button onClick={() => dispatch(resetFilters())} className="text-primary font-bold hover:underline">Clear all filters</button>
              </div>
            ) : (
              guidesToShow.map((g, i) => (
                <GuideListItem key={g.id} guide={g} index={i} onClick={() => goToGuide(g)} />
              ))
            )}

            {hasMore && !loading && (
              <button
                onClick={() => dispatch(loadMore())}
                className="w-full py-4 bg-white border border-sand3 rounded-2xl font-bold text-sm hover:border-primary transition-all mt-2"
              >
                Load more guides ({filteredGuides.length - visibleCount} left)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}