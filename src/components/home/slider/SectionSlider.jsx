// components/slider/SectionSlider.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import {
  Section, Header, HeaderLeft, Subtitle, Title,
  HeaderRight, ViewAll, Arrows, ArrowBtn, Track,
} from "./SectionSlider.styles";

const SCROLL_AMOUNT = 320;

/**
 * SectionSlider — Reusable horizontal slider with arrow nav + drag scroll.
 *
 * Props:
 *   title       {string}     – Section heading
 *   subtitle    {string?}    – Small uppercase label above title
 *   viewAllHref {string?}    – Shows "View all →" link if provided
 *   children    {ReactNode}  – Card elements
 */
export default function SectionSlider({ title, subtitle, viewAllHref, children }) {
  const trackRef                          = useRef(null);
  const drag                              = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [canLeft,  setCanLeft]            = useState(false);
  const [canRight, setCanRight]           = useState(true);

  // ── scroll state ──────────────────────────────────────────────────────────
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

  // ── drag-to-scroll ────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    drag.current = { active: true, startX: e.pageX, scrollLeft: trackRef.current.scrollLeft };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    trackRef.current.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };
  const onMouseUp = () => { drag.current.active = false; updateButtons(); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Section>
      <Header>
        <HeaderLeft>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          <Title>{title}</Title>
        </HeaderLeft>

        <HeaderRight>
          {viewAllHref && (
            <ViewAll href={viewAllHref}>
              View all <HiArrowRight size={13} />
            </ViewAll>
          )}
          <Arrows>
            <ArrowBtn
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Scroll left"
            >
              <HiChevronLeft size={16} />
            </ArrowBtn>
            <ArrowBtn
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Scroll right"
            >
              <HiChevronRight size={16} />
            </ArrowBtn>
          </Arrows>
        </HeaderRight>
      </Header>

      <Track
        ref={trackRef}
        onScroll={updateButtons}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {children}
      </Track>
    </Section>
  );
}
