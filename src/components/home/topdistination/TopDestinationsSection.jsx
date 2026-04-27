import { useNavigate } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import { TbMapPin, TbCalendarEvent } from "react-icons/tb";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";

const SCROLL_AMOUNT = 280;

// ─── DestinationCard ──────────────────────────────────────────────────────────
function DestinationCard({ city, index, onClick }) {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className="group relative w-[240px] h-[300px] rounded-[22px] overflow-hidden
                 cursor-pointer shrink-0 flex-shrink-0
                 shadow-[0_4px_18px_rgba(61,43,26,0.12)]
                 transition-all duration-300 ease-out
                 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(61,43,26,0.22)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <img
        src={city.coverImage}
        alt={city.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover
                   transition-transform duration-500 ease-out group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.src = `https://picsum.photos/seed/${city.id}/480/600`;
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10
                      transition-opacity duration-300 group-hover:from-black/90" />

      {/* Top-left: region badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                     bg-white/15 backdrop-blur-md border border-white/25
                     text-white text-[10px] font-bold uppercase tracking-wider
                     font-[Nunito,sans-serif]"
        >
          <TbMapPin size={9} />
          {city.region || "Maroc"}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Events chip */}
        {city.upcomingEvents > 0 && (
          <span
            className="inline-flex items-center gap-1 mb-2 px-2.5 py-[3px] rounded-full
                       bg-[#6b9c3e]/90 backdrop-blur-sm text-white
                       text-[10px] font-bold font-[Nunito,sans-serif]"
          >
            <TbCalendarEvent size={10} />
            {city.upcomingEvents} événement{city.upcomingEvents > 1 ? "s" : ""}
          </span>
        )}

        {/* City name */}
        <h3
          className="font-[Playfair_Display,Georgia,serif] text-white text-[20px]
                     font-bold leading-tight m-0 drop-shadow-sm"
        >
          {city.name}
        </h3>

        {/* Hover CTA — slides up on hover */}
        <div
          className="flex items-center gap-1.5 mt-0 max-h-0 overflow-hidden opacity-0
                     group-hover:max-h-[30px] group-hover:mt-2 group-hover:opacity-100
                     transition-all duration-300 ease-out"
        >
          <span
            className="text-white text-[12px] font-bold font-[Nunito,sans-serif]
                       flex items-center gap-1.5"
          >
            Découvrir <HiArrowRight size={13} />
          </span>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#6b9c3e]
                   translate-y-full group-hover:translate-y-0
                   transition-transform duration-300 ease-out"
      />
    </article>
  );
}

// ─── TopDestinationsSection ───────────────────────────────────────────────────
export default function TopDestinationsSection({ destinations }) {
  const navigate  = useNavigate();
  const trackRef  = useRef(null);
  const drag      = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(updateButtons, 350);
  };

  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, scrollLeft: trackRef.current.scrollLeft };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };
  const onMouseUp = () => {
    drag.current.active = false;
    updateButtons();
  };

  if (!destinations?.length) return null;

  const season = destinations[0]?.seasonLabel || "cette saison";

  return (
    <section className="py-11 pb-[52px] overflow-hidden">

      {/* ── Section header ── */}
      <div className="flex items-end justify-between px-7 pb-[26px] gap-3">
        <div className="flex flex-col gap-1">
          <span
            className="font-[Nunito,sans-serif] text-[11px] font-bold tracking-[0.13em]
                       uppercase text-[#6b9c3e]"
          >
            Tendances
          </span>
          <h2
            className="font-[Playfair_Display,Georgia,serif]
                       text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-[#3d2b1a]
                       m-0 leading-[1.2]"
          >
            Top Destinations en{" "}
            <span className="text-[#6b9c3e]">{season}</span>
          </h2>
          <p className="font-[Nunito,sans-serif] text-[13px] text-[#9e8e80] m-0 mt-0.5">
            {destinations.length} villes à explorer cette saison
          </p>
        </div>

        <div className="flex items-center gap-[14px] shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Précédent"
              className="w-9 h-9 rounded-full border-[1.5px] border-[#dde8cc] bg-white
                         text-[#3d2b1a] flex items-center justify-center shadow-sm
                         transition-all duration-200
                         hover:enabled:bg-[#3d2b1a] hover:enabled:border-[#3d2b1a]
                         hover:enabled:text-white hover:enabled:scale-110
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Suivant"
              className="w-9 h-9 rounded-full border-[1.5px] border-[#dde8cc] bg-white
                         text-[#3d2b1a] flex items-center justify-center shadow-sm
                         transition-all duration-200
                         hover:enabled:bg-[#3d2b1a] hover:enabled:border-[#3d2b1a]
                         hover:enabled:text-white hover:enabled:scale-110
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable track ── */}
      <div
        ref={trackRef}
        onScroll={updateButtons}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-5 overflow-x-auto px-7 py-2 pb-[22px]
                   cursor-grab active:cursor-grabbing
                   [scrollbar-width:none] [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden
                   [&>*]:scroll-snap-align-start"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {destinations.map((city, index) => (
          <DestinationCard
            key={city.id}
            city={city}
            index={index}
            onClick={() => navigate(`/city/${city.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}
