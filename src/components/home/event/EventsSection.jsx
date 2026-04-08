// components/home/event/EventsSection.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import {
  RiMapPin2Line,
  RiCalendarEventLine,
  RiMusicLine,
  RiLeafLine,
} from "react-icons/ri";
import { TbTicketOff, TbTag } from "react-icons/tb";

const CARD_WIDTH = 288 + 20;

// ─────────────────────────────────────────────────────────────────────────────
export default function EventsSection({ events = [], onEventClick }) {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    setActiveIndex(
      Math.min(Math.round(el.scrollLeft / CARD_WIDTH), events.length - 1),
    );
  }, [events.length]);

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" });
    setTimeout(updateState, 350);
  };
  const scrollToIdx = (i) => {
    trackRef.current?.scrollTo({ left: i * CARD_WIDTH, behavior: "smooth" });
    setTimeout(updateState, 350);
  };

  const onMouseDown = (e) => {
    drag.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: trackRef.current.scrollLeft,
    };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft =
      drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };
  const onMouseUp = () => {
    drag.current.active = false;
    updateState();
  };

  if (!events.length) return null;

  return (
    <section className="py-[44px] pb-[52px] overflow-hidden">
      <div className="flex items-end justify-between px-7 pb-[22px] gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-[Nunito,sans-serif] text-[11px] font-bold tracking-[0.13em] uppercase text-[#6b9c3e]">
            What's on
          </span>
          <h2 className="font-[Playfair_Display,Georgia,serif] text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-[#3d2b1a] m-0 leading-[1.2]">
            Events
          </h2>
        </div>
        <div className="flex items-center gap-[14px] flex-shrink-0">
          <a
            href="/events"
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

      <div
        ref={trackRef}
        onScroll={updateState}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-5 overflow-x-auto scroll-snap-type-x-mandatory
                   px-7 py-2 pb-6 cursor-grab [-webkit-overflow-scrolling:touch]
                   scrollbar-w-0 [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden
                   active:cursor-grabbing"
      >
        {events.map((e, i) => (
          <EventCard
            key={e.id}
            event={e}
            index={i}
            onClick={() => onEventClick?.(e)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-[7px] pt-[6px]">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            aria-label={`Event ${i + 1}`}
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

// ── EventCard ─────────────────────────────────────────────────────────────────
function EventCard({ event, index, onClick }) {
  const dateLabel = event.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : event.subtitle;

  const mainImage = event.images?.[0] || event.img || `https://picsum.photos/seed/${event.id}/800/600`;

  return (
    <div
      className={`relative w-[288px] rounded-[20px] overflow-hidden cursor-pointer
                 bg-[#1e1a14] shadow-[0_4px_18px_rgba(0,0,0,0.11)] flex-shrink-0
                 scroll-snap-align-start flex flex-col
                 transition-all duration-[280ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(61,43,26,0.18)]
                 animate-fade-up`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="relative w-full h-[175px] overflow-hidden flex-shrink-0">
        <img
          src={mainImage}
          alt={event.title || "Event"}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[450ms] ease-in-out
                     hover:scale-107"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${event.id || event.title}/800/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e1a14]/88" />
      </div>

      {event.category && (
        <span className="absolute top-3 left-3 z-2 bg-[rgba(255,255,255,0.13)] backdrop-blur-[8px]
                         text-white font-[Nunito,sans-serif] text-[10px] font-bold tracking-[0.1em]
                         uppercase px-[10px] py-1 rounded-full border border-[rgba(255,255,255,0.22)]
                         flex items-center gap-1">
          <RiMusicLine size={10} />
          {event.category}
        </span>
      )}
      {event.isFree && (
        <span className="absolute top-3 right-3 z-2
                         bg-[rgba(107,156,62,0.85)] backdrop-blur-[8px]
                         text-[#e8f5c8] font-[Nunito,sans-serif] text-[10px] font-bold tracking-[0.08em]
                         px-[10px] py-1 rounded-full border border-[rgba(200,217,138,0.3)]
                         flex items-center gap-1">
          <TbTicketOff size={11} />
          Free
        </span>
      )}
      {dateLabel && (
        <span className="absolute bottom-[10px] left-[12px] z-2 inline-flex items-center gap-1
                         text-[rgba(255,255,255,0.82)] font-[Nunito,sans-serif] text-[11px] font-bold">
          <RiCalendarEventLine size={12} />
          {dateLabel}
        </span>
      )}

      <div className="p-[14px_16px_18px] flex flex-col gap-2 flex-1 bg-[#1e1a14]">
        <p className="font-[Nunito,sans-serif] text-[11px] text-[#a09880] m-0
                      flex items-center gap-1">
          <RiMapPin2Line size={12} />
          {event.cityName || event.city}
        </p>
        <h3 className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold
                       text-[#f5ede0] m-0 leading-[1.3]">
          {event.title}
        </h3>
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-[5px]">
            {event.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="bg-[rgba(255,255,255,0.07)] text-[#b8b098]
                           font-[Nunito,sans-serif] text-[10px] font-bold
                           px-[9px] py-1 rounded-full border border-[rgba(255,255,255,0.09)]
                           flex items-center gap-1"
              >
                <TbTag size={9} />
                {t}
              </span>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="mt-[2px] self-start flex items-center gap-[6px] bg-[#6b9c3e] text-white
                     border-none rounded-full px-[18px] py-[7px]
                     font-[Nunito,sans-serif] text-[12px] font-bold tracking-[0.04em]
                     cursor-pointer transition-all duration-[180ms] ease-in-out
                     hover:bg-[#c8761a] hover:translate-x-[2px] hover:gap-[9px]"
        >
          Discover <HiArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
