// components/slider/SlideCard.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";

// Variant configurations
const VARIANTS = {
  default:  { width: "220px", imgHeight: "160px", bodyPadding: "12px 14px 14px", titleSize: "14px", textAlign: "left" },
  wide:     { width: "264px", imgHeight: "185px", bodyPadding: "12px 14px 14px", titleSize: "14px", textAlign: "left" },
  interest: { width: "148px", imgHeight: "148px", bodyPadding: "10px 8px 12px", titleSize: "13px", textAlign: "center" },
};

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
  const v = VARIANTS[variant] || VARIANTS.default;

  return (
    <div
      className={`relative rounded-[18px] overflow-hidden cursor-default
                 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-[1px] border-[rgba(61,43,26,0.06)]
                 flex flex-col transition-all duration-[250ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 animate-fade-up
                 ${isClickable ? "cursor-pointer hover:-translate-y-[5px] hover:shadow-[0_12px_28px_rgba(61,43,26,0.13)]" : ""}`}
      style={{
        width: v.width,
        animationDelay: `${index * 55}ms`,
        borderRadius: variant === "interest" ? "16px" : "18px",
      }}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {/* ── Image ── */}
      <div
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ height: v.imgHeight }}
      >
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[400ms] ease-in-out
                     hover:scale-106"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.4)] to-transparent" />
      </div>

      {/* ── Badge on image ── */}
      {badge && (
        <span
          className={`absolute top-[10px] left-[10px] z-2 inline-flex items-center gap-1
                      font-[Nunito,sans-serif] text-[10px] font-bold tracking-[0.07em]
                      uppercase px-[9px] py-[3px] rounded-full backdrop-blur-[6px] border-[1px]
                      ${badgeFree
                        ? "bg-[rgba(107,156,62,0.88)] text-[#e8f5c8] border-[rgba(200,217,138,0.3)]"
                        : "bg-[rgba(255,255,255,0.92)] text-[#6b9c3e] border-[rgba(107,156,62,0.2)]"}`}
        >
          <TbTag size={10} />
          {badge}
        </span>
      )}

      {/* ── Body ── */}
      <div
        className="flex flex-col gap-[5px]"
        style={{
          padding: v.bodyPadding,
          textAlign: v.textAlign,
        }}
      >
        <p
          className="font-[Playfair_Display,Georgia,serif] font-bold text-[#3d2b1a] m-0 leading-[1.3]
                     line-clamp-2 overflow-hidden"
          style={{ fontSize: v.titleSize }}
        >
          {title}
        </p>

        {subtitle && (
          <p className="font-[Nunito,sans-serif] text-[12px] text-[#9e8e80] m-0
                        whitespace-nowrap overflow-hidden text-ellipsis
                        flex items-center gap-1">
            <RiMapPin2Line size={11} />
            {subtitle}
          </p>
        )}

        {rating > 0 && (
          <div className="flex items-center gap-[5px] mt-[2px]">
            <span className="flex items-center gap-[1px] text-[#f4b942]">
              {Array.from({ length: fullStars }).map((_, i) => (
                <IoStarSharp key={`f${i}`} size={11} />
              ))}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <IoStarOutline key={`e${i}`} size={11} />
              ))}
            </span>
            {count && (
              <span className="font-[Nunito,sans-serif] text-[11px] text-[#a89888]">
                ({count.toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
