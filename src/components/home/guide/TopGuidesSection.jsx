// components/home/TopGuidesSection.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";

import GuideCard from "./GuideCard";
import {
  Section, Header, HeaderLeft, Eyebrow, Title,
  HeaderRight, ViewAll, Arrows, ArrowBtn,
  Track, DotsRow, DotBtn,
} from "./TopGuidesSection.styles";

const CARD_WIDTH = 235 + 20;

/**
 * TopGuidesSection
 * Props:
 *   guides       {Array}  guides from useHomePageData
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
    <Section>

      {/* ── Header ── */}
      <Header>
        <HeaderLeft>
          <Eyebrow>Meet locals</Eyebrow>
          <Title>Top Guides</Title>
        </HeaderLeft>
        <HeaderRight>
          <ViewAll href="/guides">
            View all <HiArrowRight size={13} />
          </ViewAll>
          <Arrows>
            <ArrowBtn
              onClick={() => scrollBy(-1)}
              disabled={!canLeft}
              aria-label="Previous"
            >
              <HiChevronLeft size={16} />
            </ArrowBtn>
            <ArrowBtn
              onClick={() => scrollBy(1)}
              disabled={!canRight}
              aria-label="Next"
            >
              <HiChevronRight size={16} />
            </ArrowBtn>
          </Arrows>
        </HeaderRight>
      </Header>

      {/* ── Track ── */}
      <Track
        ref={trackRef}
        onScroll={updateState}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {guides.slice(0, 6).map((g, i) => (
          <GuideCard
            key={g.id}
            guide={g}
            index={i}
            onClick={() => onGuideClick?.(g)}
          />
        ))}
      </Track>

      {/* ── Dots ── */}
      <DotsRow>
        {guides.slice(0, 6).map((_, i) => (
          <DotBtn
            key={i}
            $active={i === activeIndex}
            onClick={() => scrollToIdx(i)}
            aria-label={`Guide ${i + 1}`}
          />
        ))}
      </DotsRow>

    </Section>
  );
}
