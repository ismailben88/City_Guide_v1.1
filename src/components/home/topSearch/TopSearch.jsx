// components/home/TopSearch.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import { RiMapPin2Line, RiPriceTag3Line, RiLeafLine } from "react-icons/ri";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { TbTicket } from "react-icons/tb";

import {
  Section, Header, HeaderLeft, Eyebrow, Title,
  HeaderRight, ViewAll, Arrows, ArrowBtn,
  Track, DotsRow, DotBtn,
  Card, ImgWrap, CardImg, ImgOverlay,
  CategoryBadge, PriceBadge,
  CardBody, CardCity, CardTitle,
  MetaRow, Stars, ReviewCount,
  TagsRow, Tag, ExploreBtn,
} from "./TopSearch.styles";

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
    <Section>

      {/* ── Header ── */}
      <Header>
        <HeaderLeft>
          <Eyebrow>Discover Morocco</Eyebrow>
          <Title>Top Search</Title>
        </HeaderLeft>
        <HeaderRight>
          <ViewAll href="/places">
            View all <HiArrowRight size={13} />
          </ViewAll>
          <Arrows>
            <ArrowBtn onClick={() => scrollBy(-1)} disabled={!canLeft}  aria-label="Previous">
              <HiChevronLeft size={16} />
            </ArrowBtn>
            <ArrowBtn onClick={() => scrollBy(1)}  disabled={!canRight} aria-label="Next">
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
        {places.map((p, i) => (
          <PlaceCard
            key={p.id}
            place={p}
            index={i}
            isActive={i === activeIndex}
            onClick={() => onPlaceClick?.(p)}
          />
        ))}
      </Track>

      {/* ── Dots ── */}
      <DotsRow>
        {places.map((_, i) => (
          <DotBtn
            key={i}
            $active={i === activeIndex}
            onClick={() => scrollToIdx(i)}
            aria-label={`Go to place ${i + 1}`}
          />
        ))}
      </DotsRow>

    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PlaceCard
// ─────────────────────────────────────────────────────────────────────────────
function PlaceCard({ place, index, isActive, onClick }) {
  const fullStars  = Math.round(place.rating || 0);
  const emptyStars = 5 - fullStars;

  const isFree  = place.price === 0;
  const price   = isFree
    ? "Free entry"
    : place.price
      ? `${place.price} ${place.currency || "MAD"}`
      : null;

  return (
    <Card
      $active={isActive}
      $index={index}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Image ── */}
      <ImgWrap>
        <CardImg src={place.img} alt={place.title} loading="lazy" />
        <ImgOverlay />
      </ImgWrap>

      {/* ── Category badge ── */}
      {place.category && (
        <CategoryBadge>
          <RiLeafLine size={10} />
          {place.category}
        </CategoryBadge>
      )}

      {/* ── Price badge ── */}
      {price && (
        <PriceBadge $free={isFree}>
          {isFree ? <RiLeafLine size={11} /> : <TbTicket size={11} />}
          {price}
        </PriceBadge>
      )}

      {/* ── Body ── */}
      <CardBody>
        <CardCity>
          <RiMapPin2Line size={12} />
          {place.subtitle || place.city}
        </CardCity>

        <CardTitle>{place.title}</CardTitle>

        <MetaRow>
          <Stars>
            {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={12} />)}
            {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={12} />)}
          </Stars>
          {place.reviewCount && (
            <ReviewCount>
              {place.reviewCount.toLocaleString()} reviews
            </ReviewCount>
          )}
        </MetaRow>

        {place.tags?.length > 0 && (
          <TagsRow>
            {place.tags.slice(0, 3).map((t) => (
              <Tag key={t}>
                <RiPriceTag3Line size={9} style={{ marginRight: 2 }} />
                {t}
              </Tag>
            ))}
          </TagsRow>
        )}

        <ExploreBtn
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          type="button"
        >
          Explore <HiArrowRight size={13} />
        </ExploreBtn>
      </CardBody>
    </Card>
  );
}
