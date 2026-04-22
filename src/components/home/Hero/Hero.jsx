import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { TbMapPin, TbCalendarEvent, TbUsers, TbSmartHome } from "react-icons/tb";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

// Vos imports d'images
import img1 from "../../../images/heroSlider/1.png";
import img2 from "../../../images/heroSlider/2.png";
import img3 from "../../../images/heroSlider/3.png";
import img4 from "../../../images/heroSlider/4.png";
import img5 from "../../../images/heroSlider/5.png";

const SLIDES = [
  { id: 1, city: "Marrakech", label: "The Red City", tag: "Culture & History", img: img1 },
  { id: 2, city: "Chefchaouen", label: "The Blue Pearl", tag: "Photography & Art", img: img2 },
  { id: 3, city: "Sahara", label: "Desert Adventure", tag: "Adventure & Nature", img: img3 },
  { id: 4, city: "Essaouira", label: "Coastal Escape", tag: "Beach & Wind", img: img4 },
  { id: 5, city: "Fès", label: "Imperial City", tag: "UNESCO Heritage", img: img5 },
];

const DURATION = 6000;
const TRANSITION_MS = 950;
const QUICK_TERMS = ["Guides", "Restaurants", "Riads", "Desert tours", "Hammam"];

export default function Hero({ onSearch, allData }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const autoRef = useRef(null);
  const navigate = useNavigate();

  // --- 1. Logique de filtrage pour le Dropdown ---
  const suggestions = useMemo(() => {
    if (query.trim().length < 2 || !allData) return [];
    const q = query.toLowerCase();

    // Fusion des données pour la recherche
    const matches = [
      ...(allData.places || []).filter(p => p.name?.toLowerCase().includes(q))
        .map(p => ({ id: p.id, title: p.name, type: 'place', icon: <TbSmartHome />, path: `/places/${p.id}` })),
      ...(allData.guides || []).filter(g => g.name?.toLowerCase().includes(q))
        .map(g => ({ id: g.id, title: g.name, type: 'guide', icon: <TbUsers />, path: `/guides/${g.id}` })),
      ...(allData.events || []).filter(e => e.title?.toLowerCase().includes(q))
        .map(e => ({ id: e.id, title: e.title, type: 'event', icon: <TbCalendarEvent />, path: `/events/${e.id}` }))
    ];

    return matches.slice(0, 6); // Limite à 6 résultats
  }, [query, allData]);

  // --- 2. Navigation intelligente ---
  const handleSelect = (item) => {
    setQuery(item.title);
    setShowDropdown(false);
    navigate(item.path);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else if (query.trim()) {
      // Redirection vers une recherche globale si aucun item précis n'est trouvé
      onSearch?.(query.trim());
    }
  };

  // --- 3. Logique du Slider ---
  const goTo = useCallback((idx) => {
    if (busy || idx === cur) return;
    setBusy(true);
    setPrev(cur);
    setCur(idx);
    setTimeout(() => {
      setPrev(null);
      setBusy(false);
    }, TRANSITION_MS);
  }, [busy, cur]);

  const goNext = useCallback(() => goTo((cur + 1) % SLIDES.length), [cur, goTo]);
  const goPrev = useCallback(() => goTo((cur - 1 + SLIDES.length) % SLIDES.length), [cur, goTo]);

  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(goNext, DURATION);
  }, [goNext]);

  useEffect(() => {
    autoRef.current = setInterval(goNext, DURATION);
    return () => clearInterval(autoRef.current);
  }, [goNext]);

  const slide = SLIDES[cur];

  return (
    <section className="relative w-full h-screen min-h-[580px] overflow-hidden bg-[#160f03]">
      {/* Progress bar */}
      <div key={`prog-${cur}`} className="absolute top-0 left-0 h-[3px] bg-[#6b9c3e] z-30 animate-prog" />

      {/* Background Slides */}
      {prev !== null && (
        <div className="absolute inset-0 bg-cover bg-center z-[1] animate-fade-out"
             style={{ backgroundImage: `url(${SLIDES[prev].img})` }} />
      )}
      <div key={`enter-${cur}`} className="absolute inset-0 bg-cover bg-center z-[2] animate-zoom-in"
           style={{ backgroundImage: `url(${slide.img})` }} />

      {/* Overlays */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-t from-[#3d2b1a]/90 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[200px] left-20 right-14 z-20 flex flex-col gap-7 max-sm:left-5 max-sm:right-5">
        <div key={`txt-${cur}`} className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-s font-bold tracking-widest uppercase text-[#d4f06f] bg-[#6b9c3e]/20 border border-[#6b9c3e]/40 backdrop-blur-md animate-slide-up-1">
            <TbMapPin size={13} /> {slide.tag}
          </span>
          <div className="flex items-center gap-2.5 animate-slide-up-2">
            <span className="w-9 h-px bg-white" />
            <span className="text-s font-semibold tracking-[0.26em] uppercase text-white  ">{slide.label}</span>
          </div>
          <h1 className="text-[clamp(52px,9vw,112px)] font-bold leading-[0.92] text-white tracking-tight font-display animate-slide-up-3">
            {slide.city}
          </h1>
        </div>

        {/* Search Form with Dropdown */}
        <div className="relative max-w-[580px] z-50 animate-slide-up-5">
          <form 
            onSubmit={handleSearchSubmit}
            className={`flex items-center rounded-2xl py-1.5 pl-4 pr-1.5 gap-2.5 transition-all bg-white/95 backdrop-blur-sm border-2 ${focused ? 'border-[#6b9c3e] shadow-[0_8px_32px_rgba(107,156,62,0.25)]' : 'border-transparent shadow-2xl'}`}
          >
            <RiSearchLine size={20} className="text-[#6b9c3e]" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => { setFocused(true); setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search a place, guide, event…"
              className="flex-1 border-none outline-none bg-transparent text-[15px] font-medium text-[#3d2b1a] placeholder:text-[#b0a090]"
            />
            <button type="submit" className="px-6 py-2.5 rounded-xl text-white text-sm font-bold bg-[#6b9c3e] hover:bg-[#c8761a] transition-all transform hover:scale-105">
              Explore
            </button>
          </form>

          {/* --- Dropdown Results --- */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {suggestions.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between px-5 py-4 hover:bg-[#f8fdf2] cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-[#6b9c3e]/10 text-[#6b9c3e] rounded-lg">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#3d2b1a]">{item.title}</span>
                      <span className="text-[10px] uppercase font-black text-[#b0a090] tracking-widest">{item.type}</span>
                    </div>
                  </div>
                  <HiChevronRight className="text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-s font-semibold text-white/90">Popular:</span>
          {QUICK_TERMS.map((t) => (
            <button
              key={t}
              onClick={() => { setQuery(t); onSearch?.(t); }}
              className="text-s font-semibold px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 backdrop-blur-md hover:bg-[#6b9c3e]/30 hover:border-[#6b9c3e]/50 hover:text-[#c8d98a] transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => { goPrev(); resetAuto(); }} className="absolute top-1/2 -translate-y-1/2 left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 border border-white/20 backdrop-blur-md hover:bg-[#6b9c3e]/40 transition-all max-sm:hidden">
        <HiChevronLeft size={24} />
      </button>
      <button onClick={() => { goNext(); resetAuto(); }} className="absolute top-1/2 -translate-y-1/2 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white bg-white/10 border border-white/20 backdrop-blur-md hover:bg-[#6b9c3e]/40 transition-all max-sm:hidden">
        <HiChevronRight size={24} />
      </button>
    </section>
  );
}