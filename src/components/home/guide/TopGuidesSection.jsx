// components/home/TopGuidesSection.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";

import GuideCard from "./GuideCard";

const CARD_WIDTH = 235 + 20;

/**
 * TopGuidesSection
 * Props:
 *   guides       {Array}  guides from useHomePageData (guideProfiles + users merged)
 *   onGuideClick {fn}     (guide) => void
 */
export default function TopGuidesSection({ guides = [], onGuideClick }) {
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
      guides.length - 1
    ));
  }, [guides.length]);

  const scrollBy    = (dir) => { trackRef.current?.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" }); setTimeout(updateState, 350); };
  const scrollToIdx = (i)   => { trackRef.current?.scrollTo({ left: i * CARD_WIDTH,  behavior: "smooth" }); setTimeout(updateState, 350); };

  // ── drag-to-scroll ─────────────────────────────────────────────────────
  const onMouseDown = (e) => { drag.current = { active: true, startX: e.pageX, scrollLeft: trackRef.current.scrollLeft }; };
  const onMouseMove = (e) => { if (!drag.current.active) return; trackRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX); };
  const onMouseUp   = ()  => { drag.current.active = false; updateState(); };

  if (!guides.length) return null;

  return (
    <section className="py-[44px] pb-[52px] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-end justify-between px-7 pb-[22px] gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] font-bold tracking-[0.13em] uppercase text-[#6b9c3e]">
            Meet locals
          </span>
          <h2 className="font-display text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-[#3d2b1a] m-0 leading-[1.2]">
            Top Guides
          </h2>
        </div>
        <div className="flex items-center gap-[14px] flex-shrink-0">
          <a
            href="/guides"
            className="font-sans text-[13px] font-bold text-[#6b9c3e] no-underline
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
                   px-7 py-3 pb-6 cursor-grab [-webkit-overflow-scrolling:touch]
                   scrollbar-w-0 [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden
                   active:cursor-grabbing"
      >
        {guides.slice(0, 6).map((g, i) => (
          <GuideCard
            key={g.id}
            guide={g}
            index={i}
            onClick={() => onGuideClick?.(g)}
          />
        ))}
      </div>

      {/* ── Dots ── */}
      <div className="flex justify-center gap-[7px] pt-[6px]">
        {guides.slice(0, 6).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            aria-label={`Guide ${i + 1}`}
            className="h-[7px] rounded-full border-none p-0 cursor-pointer
                       bg-[#d5e0bc] transition-[width,background] duration-[300ms_250ms] ease-in-out
                       hover:bg-[#c8d98a]"
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
