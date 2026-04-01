// components/home/InterestsSection.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import { RiCompassLine } from "react-icons/ri";
import { TbGridDots } from "react-icons/tb";

import {
  Section, Header, HeaderLeft, Eyebrow, Title,
  HeaderRight, ViewAll, Arrows, ArrowBtn,
  Track, DotsRow, DotBtn,
  Card, ImgWrap, CardImg, ImgOverlay,
  CountBadge, CardBody, CardTitle, ExploreBtn,
} from "./InterestsSection.styles";

const CARD_WIDTH = 160 + 16;

// ─────────────────────────────────────────────────────────────────────────────
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
    <Section>

      {/* ── Header ── */}
      <Header>
        <HeaderLeft>
          <Eyebrow>Explore</Eyebrow>
          <Title>Find things to do by interest</Title>
        </HeaderLeft>
        <HeaderRight>
          <ViewAll href="/places">
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
        {categories.map((c, i) => (
          <InterestCard
            key={c.id}
            category={c}
            index={i}
            onClick={() => onCategoryClick?.(c)}
          />
        ))}
      </Track>

      {/* ── Dots ── */}
      <DotsRow>
        {categories.map((_, i) => (
          <DotBtn
            key={i}
            $active={i === activeIndex}
            onClick={() => scrollToIdx(i)}
            aria-label={`Category ${i + 1}`}
          />
        ))}
      </DotsRow>

    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  InterestCard
// ─────────────────────────────────────────────────────────────────────────────
function InterestCard({ category, index, onClick }) {
  return (
    <Card
      $index={index}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Image ── */}
      <ImgWrap>
        <CardImg src={category.img} alt={category.title} loading="lazy" />
        <ImgOverlay />
      </ImgWrap>

      {/* ── Count badge ── */}
      {category.count && (
        <CountBadge>
          <TbGridDots size={9} />
          {category.count} places
        </CountBadge>
      )}

      {/* ── Body ── */}
      <CardBody>
        <CardTitle>{category.title}</CardTitle>
        <ExploreBtn
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          <RiCompassLine size={10} />
          Explore
        </ExploreBtn>
      </CardBody>
    </Card>
  );
}
