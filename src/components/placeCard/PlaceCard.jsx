// components/UI/PlaceCard.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiLeafLine, RiShareLine } from "react-icons/ri";
import { TbTicket, TbTag, TbShoppingBag } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

import {
  Card, ImgWrap, CardImg, ImgOverlay,
  CategoryBadge, PriceBadge,
  CardBody, CardCity, CardTitle, CardDesc,
  RatingRow, Stars, RatingNum, ReviewCount,
  TagsRow, Tag,
  ActionsRow, ActionBtn, ShareBtn,
} from "./PlaceCard.styles";

/**
 * PlaceCard — grid card for the PlacesPage.
 *
 * Props:
 *   place   {object}  place data from json-server
 *   index   {number}  stagger animation index
 *   onClick {fn}      navigate to PlaceDetailPage
 */
export default function PlaceCard({ place, index = 0, onClick }) {
  const fullStars  = Math.round(place.rating || 0);
  const emptyStars = 5 - fullStars;
  const isFree     = place.price === 0;
  const price      = isFree
    ? "Free entry"
    : place.price
      ? `${place.price} ${place.currency || "MAD"}`
      : null;

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: place.title, url: window.location.href });
    }
  };

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
        <CardImg
          src={place.img}
          alt={place.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${place.id || place.title}/800/600`;
          }}
        />
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
        {(place.city || place.subtitle) && (
          <CardCity>
            <RiMapPin2Line size={11} />
            {place.subtitle || place.city}
          </CardCity>
        )}

        <CardTitle>{place.title}</CardTitle>

        {place.description && <CardDesc>{place.description}</CardDesc>}

        {/* ── Rating ── */}
        {place.rating > 0 && (
          <RatingRow>
            <Stars>
              {Array.from({ length: fullStars }).map((_, i) => (
                <IoStarSharp key={`f${i}`} size={12} />
              ))}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <IoStarOutline key={`e${i}`} size={12} />
              ))}
            </Stars>
            <RatingNum>{place.rating}</RatingNum>
            {place.reviewCount && (
              <ReviewCount>
                ({place.reviewCount.toLocaleString()} reviews)
              </ReviewCount>
            )}
          </RatingRow>
        )}

        {/* ── Tags ── */}
        {place.tags?.length > 0 && (
          <TagsRow>
            {place.tags.slice(0, 3).map((t) => (
              <Tag key={t}>
                <TbTag size={9} />
                {t}
              </Tag>
            ))}
          </TagsRow>
        )}

        {/* ── Actions ── */}
        <ActionsRow>
          <ActionBtn
            $primary
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Learn more <HiArrowRight size={12} />
          </ActionBtn>

          <ActionBtn type="button" onClick={(e) => e.stopPropagation()}>
            <TbShoppingBag size={13} /> Buy / Rent
          </ActionBtn>

          <ShareBtn type="button" onClick={handleShare} aria-label="Share">
            <RiShareLine size={14} />
          </ShareBtn>
        </ActionsRow>
      </CardBody>
    </Card>
  );
}
