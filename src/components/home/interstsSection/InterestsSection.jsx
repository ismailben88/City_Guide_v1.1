// components/home/InterestsSection.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import { RiCompassLine } from "react-icons/ri";
import { TbGridDots } from "react-icons/tb";

const CARD_WIDTH = 160 + 16;

/**
 * InterestsSection - displays interest categories
 * Props:
 *   categories      {Array}  from api.getInterestCategories()
 *   onCategoryClick {fn}     (category) => void
 */
export default function InterestsSection({ categories = [], onCategoryClick }) {
  const trackRef                      = useRef(null);
  const drag                          = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft,     setCanLeft]     = useState(false);
  const [canRight,    setCanRight]    = useState(true);

  // ── scroll state ───────────────────────────────────────────────────────
  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setActiveIndex(Math.min(
      Math.round(el.scrollLeft / CARD_WIDTH),
      categories.length - 1
    ));
  }, [categories.length]);

  const scrollBy    = (dir) => { trackRef.current?.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" }); setTimeout(updateState, 350); };
  const scrollToIdx = (i)   => { trackRef.current?.scrollTo({ left: i * CARD_WIDTH,  behavior: "smooth" }); setTimeout(updateState, 350); };

  // ── drag-to-scroll ─────────────────────────────────────────────────────
  const onMouseDown = (e) => { drag.current = { active: true, startX: e.pageX, scrollLeft: trackRef.current.scrollLeft }; };
  const onMouseMove = (e) => { if (!drag.current.active) return; trackRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX); };
  const onMouseUp   = ()  => { drag.current.active = false; updateState(); };

  if (!categories.length) return null;

  return (
    <section className="py-[44px] pb-[52px] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-end justify-between px-7 pb-[22px] gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-[Nunito,sans-serif] text-[11px] font-bold tracking-[0.13em] uppercase text-[#6b9c3e]">
            Explore
          </span>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-[#3d2b1a] m-0 leading-[1.2]">
            Find things to do by interest
          </h2>
        </div>
        <div className="flex items-center gap-[14px] flex-shrink-0">
          <a
            href="/places"
            className="font-[Nunito,sans-serif] text-[13px] font-bold text-[#6b9c3e] no-underline
                       flex items-center gap-[5px] whitespace-nowrap cursor-pointer
                       transition-colors duration-[200ms] ease-in-out hover:text-[#c8761a]"
          >
            View all <HiArrowRight size={13} />
          </a>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Previous"
              className="w-9 h-9 rounded-full border-[1.5px] border-[#dde8cc] bg-white
                         text-[#3d2b1a] cursor-pointer flex items-center justify-center
                         shadow-[0_1px_4px_rgba(0,0,0,0.06)]
                         transition-all duration-[180ms] ease-in-out
                         hover:not-disabled:bg-[#3d2b1a] hover:not-disabled:border-[#3d2b1a]
                         hover:not-disabled:text-white hover:not-disabled:scale-108
                         disabled:opacity-[0.28] disabled:cursor-not-allowed"
            >
              <HiChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Next"
              className="w-9 h-9 rounded-full border-[1.5px] border-[#dde8cc] bg-white
                         text-[#3d2b1a] cursor-pointer flex items-center justify-center
                         shadow-[0_1px_4px_rgba(0,0,0,0.06)]
                         transition-all duration-[180ms] ease-in-out
                         hover:not-disabled:bg-[#3d2b1a] hover:not-disabled:border-[#3d2b1a]
                         hover:not-disabled:text-white hover:not-disabled:scale-108
                         disabled:opacity-[0.28] disabled:cursor-not-allowed"
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Track ── */}
      <div
        ref={trackRef}
        onScroll={updateState}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-4 overflow-x-auto scroll-snap-x-mandatory
                   px-7 py-2 pb-5 cursor-grab [-webkit-overflow-scrolling:touch]
                   scrollbar-w-0 [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden
                   active:cursor-grabbing"
      >
        {categories.map((c, i) => (
          <InterestCard
            key={c.id}
            category={c}
            index={i}
            onClick={() => onCategoryClick?.(c)}
          />
        ))}
      </div>

      {/* ── Dots ── */}
      <div className="flex justify-center gap-[7px] pt-[6px]">
        {categories.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            aria-label={`Category ${i + 1}`}
            className="h-[7px] rounded-full border-none p-0 cursor-pointer
                       transition-all duration-[300ms] ease-in-out"
            style={{
              width: i === activeIndex ? "24px" : "7px",
              background: i === activeIndex ? "#6b9c3e" : "#d5e0bc",
            }}
          />
        ))}
      </div>

    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  InterestCard
// ─────────────────────────────────────────────────────────────────────────────
function InterestCard({ category, index, onClick }) {
  // 1. Correction du titre : Utiliser 'name' (structure de ton nouveau db.json)
  const title = category.name || "Catégorie";
  
  // 2. Correction de l'image :
  // Ton script de génération ne crée pas d'images pour les catégories.
  // On utilise l'icône ou une image par défaut basée sur l'ID pour varier.
  const img = category.img || `https://picsum.photos/seed/${category.id}/400/400`;

  return (
    <div
      className="relative w-[160px] rounded-[18px] overflow-hidden cursor-pointer
                 bg-[#1e1a14] shadow-[0_4px_14px_rgba(0,0,0,0.1)] flex-shrink-0
                 scroll-snap-align-start flex flex-col
                 transition-all duration-[280ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[5px] hover:shadow-[0_14px_32px_rgba(61,43,26,0.18)]
                 animate-fade-up"
      style={{ animationDelay: `${index * 55}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Image ── */}
      <div className="relative w-full h-[160px] overflow-hidden flex-shrink-0">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[450ms] ease-in-out
                     hover:scale-108"
        />
        {/* Ajout de l'icône au centre de l'image pour un look plus "App" */}
        <div className="absolute inset-0 flex items-center justify-center text-[40px] z-10">
           {category.icon}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(30,26,20,0.82)]" />
      </div>

      {/* ── Body ── */}
      <div className="px-3 py-2.5 pb-3.5 flex flex-col items-center gap-1.5
                      bg-[#1e1a14] text-center">
        <p className="font-[Playfair_Display,Georgia,serif] text-[13px] font-bold
                      text-[#f5ede0] m-0 leading-[1.3]">
          {title}
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="flex items-center gap-1 bg-transparent text-[#c8d98a]
                     border border-[rgba(200,217,138,0.3)] rounded-full
                     px-3 py-1 font-[Nunito,sans-serif] text-[10px] font-bold
                     tracking-[0.05em] cursor-pointer
                     transition-all duration-[180ms] ease-in-out
                     hover:bg-[rgba(107,156,62,0.22)] hover:border-[rgba(107,156,62,0.6)]
                     hover:text-white"
        >
          <RiCompassLine size={10} />
          Explorer
        </button>
      </div>
    </div>
  );
}