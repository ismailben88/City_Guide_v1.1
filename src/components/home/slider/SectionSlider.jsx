import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";

const SCROLL_AMOUNT = 320;

export default function SectionSlider({ title, subtitle, viewAllHref, children }) {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [canLeft, setCanLeft] = useState(false);
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

  return (
    <section className="py-11 pb-[52px] overflow-hidden">
      <div className="flex items-end justify-between px-7 pb-[22px] gap-3">
        <div className="flex flex-col gap-1">
          {subtitle && (
            <span className="font-body text-[11px] font-bold tracking-[0.13em] uppercase text-[#6b9c3e]">
              {subtitle}
            </span>
          )}
          <h2 className="font-display text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold text-[#3d2b1a] m-0 leading-[1.2]">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-[14px] shrink-0">
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="font-body text-[13px] font-bold text-[#6b9c3e] no-underline flex items-center gap-[5px] whitespace-nowrap cursor-pointer transition-colors duration-200 hover:text-[#c8761a]"
            >
              View all <HiArrowRight size={13} />
            </a>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border-[1.5px] border-[#dde8cc] bg-white text-[#3d2b1a] cursor-pointer flex items-center justify-center shadow-sm transition-all hover:enabled:bg-[#3d2b1a] hover:enabled:border-[#3d2b1a] hover:enabled:text-white hover:enabled:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronLeft size={16} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full border-[1.5px] border-[#dde8cc] bg-white text-[#3d2b1a] cursor-pointer flex items-center justify-center shadow-sm transition-all hover:enabled:bg-[#3d2b1a] hover:enabled:border-[#3d2b1a] hover:enabled:text-white hover:enabled:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <HiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateButtons}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-[18px] overflow-x-auto scroll-snap-x scroll-snap-mandatory px-7 py-1.5 pb-[18px] cursor-grab active:cursor-grabbing [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&>*]:scroll-snap-align-start [&>*]:shrink-0"
      >
        {children}
      </div>
    </section>
  );
}