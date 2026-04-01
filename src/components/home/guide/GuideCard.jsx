// components/home/GuideCard.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiShieldCheckLine } from "react-icons/ri";
import { TbLanguage } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

import {
  Card, Cover, CoverImg, CoverOverlay,
  VerifiedBadge, AvatarWrap, AvatarImg,
  CardBody, GuideName, GuideCity,
  RatingRow, Stars, RatingScore, ReviewCount,
  LangsRow, LangTag,
  Footer, Price, ViewBtn,
} from "./GuideCard.styles";

/**
 * GuideCard — rich card for the Top Guides section.
 *
 * Props:
 *   guide   {object}  guide data from json-server
 *   index   {number}  stagger animation index
 *   onClick {fn}
 */
export default function GuideCard({ guide, index = 0, onClick }) {
  const fullStars  = Math.round(guide.rating || 5);
  const emptyStars = 5 - fullStars;
  const isVerified = guide.badges?.includes("Verified");
  const price      = guide.pricePerDay || guide.dailyRate;
  const reviews    = guide.reviewCount || guide.reviews;

  return (
    <Card
      $index={index}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Cover image ── */}
      <Cover>
        <CoverImg
          src={guide.coverImg || guide.img}
          alt={`${guide.name} cover`}
          loading="lazy"
        />
        <CoverOverlay />
      </Cover>

      {/* ── Verified badge ── */}
      {isVerified && (
        <VerifiedBadge>
          <RiShieldCheckLine size={10} />
          Verified
        </VerifiedBadge>
      )}

      {/* ── Floating avatar ── */}
      <AvatarWrap>
        <AvatarImg src={guide.img} alt={guide.name} loading="lazy" />
      </AvatarWrap>

      {/* ── Body ── */}
      <CardBody>
        <GuideName>{guide.name}</GuideName>

        <GuideCity>
          <RiMapPin2Line size={11} />
          {guide.city}
        </GuideCity>

        {/* ── Rating ── */}
        <RatingRow>
          <Stars>
            {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={11} />)}
            {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={11} />)}
          </Stars>
          <RatingScore>{guide.rating}</RatingScore>
          {reviews && <ReviewCount>({reviews} reviews)</ReviewCount>}
        </RatingRow>

        {/* ── Languages ── */}
        {guide.languages?.length > 0 && (
          <LangsRow>
            {guide.languages.slice(0, 3).map((l) => (
              <LangTag key={l}>
                <TbLanguage size={9} />
                {l}
              </LangTag>
            ))}
          </LangsRow>
        )}

        {/* ── Footer ── */}
        <Footer>
          <Price>
            From <strong>{price} MAD</strong>/day
          </Price>
          <ViewBtn
            type="button"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            Profile <HiArrowRight size={12} />
          </ViewBtn>
        </Footer>
      </CardBody>
    </Card>
  );
}
