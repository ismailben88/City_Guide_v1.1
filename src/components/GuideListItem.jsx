// components/UI/GuideListItem.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiShieldCheckLine } from "react-icons/ri";
import { TbLanguage } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

import {
  ListCard, AvatarWrap, Avatar, VerifiedDot,
  CardInfo, GuideName, MetaRow, MetaItem,
  LangsRow, LangTag,
  CardRight, RatingRow, Stars, RatingNum, ViewBtn,
} from "../../pages/GuidePage.styles";

/**
 * GuideListItem — horizontal card for the guides list.
 *
 * Props:
 *   guide   {object}  guide data
 *   index   {number}  stagger animation index
 *   onClick {fn}
 */
export default function GuideListItem({ guide, index = 0, onClick }) {
  const fullStars  = Math.round(guide.rating || 0);
  const emptyStars = 5 - fullStars;
  const isVerified = guide.verified || guide.badges?.includes("Verified");

  return (
    <ListCard
      $index={index}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Avatar ── */}
      <AvatarWrap>
        <Avatar src={guide.img} alt={guide.name} loading="lazy" />
        {isVerified && (
          <VerifiedDot title="Verified guide">
           <RiShieldCheckLine size={10}/>
          </VerifiedDot>
        )}
      </AvatarWrap>

      {/* ── Info ── */}
      <CardInfo>
        <GuideName>{guide.name}</GuideName>

        <MetaRow>
          <MetaItem>
            <RiMapPin2Line size={12} />
            {guide.city}
          </MetaItem>
          {(guide.reviewCount || guide.reviews) && (
            <MetaItem>
              {(guide.reviewCount || guide.reviews).toLocaleString()} reviews
            </MetaItem>
          )}
        </MetaRow>

        {guide.languages?.length > 0 && (
          <LangsRow>
            <MetaItem><TbLanguage size={12} /></MetaItem>
            {guide.languages.slice(0, 3).map((l) => (
              <LangTag key={l}>{l}</LangTag>
            ))}
            {guide.languages.length > 3 && (
              <LangTag>+{guide.languages.length - 3}</LangTag>
            )}
          </LangsRow>
        )}
      </CardInfo>

      {/* ── Right: rating + CTA ── */}
      <CardRight>
        <RatingRow>
          <Stars>
            {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={13} />)}
            {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={13} />)}
          </Stars>
          <RatingNum>{guide.rating}</RatingNum>
        </RatingRow>

        <ViewBtn
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          Profile <HiArrowRight size={13} />
        </ViewBtn>
      </CardRight>
    </ListCard>
  );
}
