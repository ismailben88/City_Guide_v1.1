// components/home/topSearch/TopSearch.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import { RiMapPin2Line, RiPriceTag3Line, RiLeafLine } from "react-icons/ri";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { TbTicket } from "react-icons/tb";

// ─── CARD_WIDTH must match Card width (288) + gap (20) ────────────────────
const CARD_WIDTH = 288 + 20;

// ─────────────────────────────────────────────────────────────────────────────
export default function TopSearch({ places = [], onPlaceClick }) {
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
      places.length - 1
    ));
  }, [places.length]);

  const scrollBy    = (dir) => { trackRef.current?.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" }); setTimeout(updateState, 350); };
  const scrollToIdx = (i)   => { trackRef.current?.scrollTo({ left: i * CARD_WIDTH, behavior: "smooth"  }); setTimeout(updateState, 350); };

  // ── drag-to-scroll ─────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, scrollLeft: trackRef.current.scrollLeft };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };
  const onMouseUp = () => { drag.current.active = false; updateState(); };

  if (!places.length) return null;

  return (
    <section className="py-[44px] pb-[52px] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-end justify-between px-7 pb-[22px] gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-[Nunito,sans-serif] text-[11px] font-bold tracking-[0.13em] uppercase text-[#6b9c3e]">
            Discover Morocco
          </span>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-[#3d2b1a] m-0 leading-[1.2]">
            Top Search
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
        className="flex gap-5 overflow-x-auto scroll-snap-x-mandatory
                   px-7 py-2 pb-6 cursor-grab [-webkit-overflow-scrolling:touch]
                   scrollbar-w-0 [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden
                   active:cursor-grabbing"
      >
        {places.map((p, i) => (
          <PlaceCard
            key={p.id}
            place={p}
            index={i}
            isActive={i === activeIndex}
            onClick={() => onPlaceClick?.(p)}
          />
        ))}
      </div>

      {/* ── Dots ── */}
      <div className="flex justify-center gap-[7px] pt-[6px]">
        {places.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            aria-label={`Go to place ${i + 1}`}
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
//  PlaceCard
// ─────────────────────────────────────────────────────────────────────────────
function PlaceCard({ place, index, isActive, onClick }) {
  // Place data structure from API merge:
  // - From places: id, name, description, categoryId, cityId, address, phone, website,
  //   openingHours, entryFee, location, isVerifiedBusiness, isFeatured, averageRating,
  //   reviewCount, images
  // - Merged: cityName, category, categoryIcon

  const fullStars = Math.floor(place.averageRating || 0);
  const emptyStars = 5 - fullStars;
  const isFree = place.entryFee === 0;
  const price = isFree
    ? "Free entry"
    : place.entryFee
      ? `${place.entryFee} MAD`
      : null;

  const mainImage = place.images?.[0] || place.img || `https://picsum.photos/seed/${place.id}/800/600`;

  return (
    <div
      className={`relative w-[288px] rounded-[20px] overflow-hidden cursor-pointer
                 bg-[#1e1a14] shadow-[0_4px_18px_rgba(0,0,0,0.11)] flex-shrink-0
                 scroll-snap-align-start flex flex-col
                 transition-all duration-[280ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(61,43,26,0.18)]
                 animate-fade-up
                 ${isActive ? "shadow-[0_10px_36px_rgba(107,156,62,0.22)] hover:-translate-y-[3px]" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Image ── */}
      <div className="relative w-full h-[195px] overflow-hidden flex-shrink-0">
        <img
          src={mainImage}
          alt={place.name || "Place"}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[450ms] ease-in-out
                     hover:scale-107"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${place.id || place.name}/800/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e1a14]/88" />
      </div>

      {/* ── Category badge ── */}
      {place.category && (
        <span className="absolute top-3 left-3 z-2 bg-[rgba(255,255,255,0.14)] backdrop-blur-[8px]
                         text-white font-[Nunito,sans-serif] text-[10px] font-bold tracking-[0.1em]
                         uppercase px-[10px] py-1 rounded-full border border-[rgba(255,255,255,0.22)]
                         flex items-center gap-1">
          <RiLeafLine size={10} />
          {place.category}
        </span>
      )}

      {/* ── Price badge ── */}
      {price && (
        <span className={`absolute top-3 right-3 z-2
                          font-[Nunito,sans-serif] text-[11px] font-bold px-[10px] py-1 rounded-full
                          backdrop-blur-[8px] flex items-center gap-1
                          ${isFree
                            ? "bg-[rgba(107,156,62,0.85)] text-[#e8f5c8] border border-[rgba(200,217,138,0.35)]"
                            : "bg-[rgba(30,26,20,0.75)] text-[#f4c67a] border border-[rgba(244,198,122,0.3)]"}`}>
          {isFree ? <RiLeafLine size={11} /> : <TbTicket size={11} />}
          {price}
        </span>
      )}

      {/* ── Body ── */}
      <div className="p-[14px_16px_18px] flex flex-col gap-2 flex-1 bg-[#1e1a14]">
        {/* City */}
        <p className="font-[Nunito,sans-serif] text-[11px] text-[#a09880] m-0
                      flex items-center gap-1 letter-spacing-[0.03em]">
          <RiMapPin2Line size={12} />
          {place.cityName || place.subtitle || place.city}
        </p>

        {/* Title */}
        <h3 className="font-[Playfair_Display,Georgia,serif] text-[16px] font-bold
                       text-[#f5ede0] m-0 leading-[1.3]">
          {place.name || place.title}
        </h3>

        {/* Rating */}
        {place.averageRating > 0 && (
          <div className="flex items-center gap-[7px]">
            <span className="flex items-center gap-[1px] text-[#f4b942]">
              {Array.from({ length: fullStars }).map((_, i) => (
                <IoStarSharp key={`f${i}`} size={12} />
              ))}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <IoStarOutline key={`e${i}`} size={12} />
              ))}
            </span>
            {place.reviewCount && (
              <span className="font-[Nunito,sans-serif] text-[11px] text-[#7a7060]">
                {place.reviewCount.toLocaleString()} reviews
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {place.tags?.length > 0 && (
          <div className="flex flex-wrap gap-[5px]">
            {place.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="bg-[rgba(255,255,255,0.07)] text-[#b8b098]
                           font-[Nunito,sans-serif] text-[10px] font-bold
                           px-[9px] py-1 rounded-full border border-[rgba(255,255,255,0.09)]
                           letter-spacing-[0.03em]"
              >
                <RiPriceTag3Line size={9} />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Explore button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="mt-[2px] self-start flex items-center gap-[6px] bg-[#6b9c3e] text-white
                     border-none rounded-full px-[18px] py-[7px]
                     font-[Nunito,sans-serif] text-[12px] font-bold tracking-[0.04em]
                     cursor-pointer transition-all duration-[180ms] ease-in-out
                     hover:bg-[#c8761a] hover:translate-x-[2px] hover:gap-[9px]"
        >
          Explore <HiArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
