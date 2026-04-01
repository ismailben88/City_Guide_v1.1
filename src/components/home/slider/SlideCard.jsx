// components/slider/SlideCard.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import {
  Card, ImgWrap, Img, ImgOverlay,
  Badge, Body, CardTitle, CardSubtitle,
  MetaRow, Stars, ReviewCount,
} from "./SlideCard.styles";

/**
 * SlideCard — unified card for all SectionSlider sections.
 *
 * Props:
 *   img       {string}    image URL
 *   title     {string}
 *   subtitle  {string?}   city / date line
 *   badge     {string?}   small tag shown on image
 *   badgeFree {bool?}     green "Free" style badge
 *   rating    {number?}   1–5, renders star icons
 *   count     {number?}   review count
 *   variant   {string?}   '' | 'wide' | 'interest'
 *   index     {number?}   stagger animation index
 *   onClick   {fn?}
 */
export default function SlideCard({
  img,
  title,
  subtitle,
  badge,
  badgeFree = false,
  rating,
  count,
  variant = "default",
  index   = 0,
  onClick,
}) {
  const fullStars  = rating ? Math.round(rating)     : 0;
  const emptyStars = rating ? 5 - fullStars          : 0;
  const isClickable = Boolean(onClick);

  return (
    <Card
      $variant={variant}
      $index={index}
      $clickable={isClickable}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {/* ── Image ── */}
      <ImgWrap $variant={variant}>
        <Img src={img} alt={title} loading="lazy" />
        <ImgOverlay />
      </ImgWrap>

      {/* ── Badge on image ── */}
      {badge && (
        <Badge $free={badgeFree}>
          {badgeFree
            ? <TbTag size={10} />
            : <TbTag size={10} />
          }
          {badge}
        </Badge>
      )}

      {/* ── Body ── */}
      <Body $variant={variant}>
        <CardTitle $variant={variant}>{title}</CardTitle>

        {subtitle && (
          <CardSubtitle>
            <RiMapPin2Line size={11} />
            {subtitle}
          </CardSubtitle>
        )}

        {rating > 0 && (
          <MetaRow>
            <Stars>
              {Array.from({ length: fullStars  }).map((_, i) => (
                <IoStarSharp   key={`f${i}`} size={11} />
              ))}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <IoStarOutline key={`e${i}`} size={11} />
              ))}
            </Stars>
            {count && (
              <ReviewCount>({count.toLocaleString()})</ReviewCount>
            )}
          </MetaRow>
        )}
      </Body>
    </Card>
  );
}
