// components/home/EventsSection.jsx
import { useRef, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiArrowRight } from "react-icons/hi2";
import {
  RiMapPin2Line,
  RiCalendarEventLine,
  RiMusicLine,
  RiLeafLine,
} from "react-icons/ri";
import { TbTicketOff, TbTag } from "react-icons/tb";

import {
  Section,
  Header,
  HeaderLeft,
  Eyebrow,
  Title,
  HeaderRight,
  ViewAll,
  Arrows,
  ArrowBtn,
  Track,
  DotsRow,
  DotBtn,
  Card,
  ImgWrap,
  CardImg,
  ImgOverlay,
  CategoryBadge,
  FreeBadge,
  DateStrip,
  CardBody,
  CardCity,
  CardTitle,
  TagsRow,
  Tag,
  ExploreBtn,
} from "./EventsSection.styles";

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
    <Section>
      <Header>
        <HeaderLeft>
          <Eyebrow>What's on</Eyebrow>
          <Title>Events</Title>
        </HeaderLeft>
        <HeaderRight>
          <ViewAll href="/events">
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
              {" "}
              <HiChevronRight size={16} />
            </ArrowBtn>
          </Arrows>
        </HeaderRight>
      </Header>

      <Track
        ref={trackRef}
        onScroll={updateState}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {events.map((e, i) => (
          <EventCard
            key={e.id}
            event={e}
            index={i}
            onClick={() => onEventClick?.(e)}
          />
        ))}
      </Track>

      <DotsRow>
        {events.map((_, i) => (
          <DotBtn
            key={i}
            $active={i === activeIndex}
            onClick={() => scrollToIdx(i)}
            aria-label={`Event ${i + 1}`}
          />
        ))}
      </DotsRow>
    </Section>
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

  return (
    <Card
      $index={index}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <ImgWrap>
        <CardImg src={event.img} alt={event.title} loading="lazy" />
        <ImgOverlay />
      </ImgWrap>

      {event.category && (
        <CategoryBadge>
          <RiMusicLine size={10} />
          {event.category}
        </CategoryBadge>
      )}
      {event.isFree && (
        <FreeBadge>
          <TbTicketOff size={11} />
          Free
        </FreeBadge>
      )}
      {dateLabel && (
        <DateStrip>
          <RiCalendarEventLine size={12} />
          {dateLabel}
        </DateStrip>
      )}

      <CardBody>
        <CardCity>
          <RiMapPin2Line size={12} />
          {event.city}
        </CardCity>
        <CardTitle>{event.title}</CardTitle>
        {event.tags?.length > 0 && (
          <TagsRow>
            {event.tags.slice(0, 3).map((t) => (
              <Tag key={t}>
                <TbTag size={9} />
                {t}
              </Tag>
            ))}
          </TagsRow>
        )}
        <ExploreBtn
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          Discover <HiArrowRight size={13} />
        </ExploreBtn>
      </CardBody>
    </Card>
  );
}
