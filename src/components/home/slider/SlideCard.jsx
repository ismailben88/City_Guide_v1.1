import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line } from "react-icons/ri";
import { TbTag } from "react-icons/tb";

const variantStyles = {
  default: {
    card: "w-[220px] rounded-[18px]",
    image: "h-[160px]",
    body: "p-[12px_14px_14px] text-left",
    title: "text-[14px]",
  },
  wide: {
    card: "w-[264px] rounded-[18px]",
    image: "h-[185px]",
    body: "p-[12px_14px_14px] text-left",
    title: "text-[14px]",
  },
  interest: {
    card: "w-[148px] rounded-[16px]",
    image: "h-[148px]",
    body: "p-[10px_8px_12px] text-center justify-center items-center",
    title: "text-[13px]",
  },
};

export default function SlideCard({
  img,
  title,
  subtitle,
  badge,
  badgeFree = false,
  rating,
  count,
  variant = "default",
  index = 0,
  onClick,
}) {
  const fullStars = rating ? Math.round(rating) : 0;
  const emptyStars = 5 - fullStars;
  const isClickable = Boolean(onClick);
  const styles = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`group relative overflow-hidden bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#3d2b1a]/10 flex flex-col transition-all duration-300 ease-out animate-fade-up ${
        styles.card
      } ${
        isClickable
          ? "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(61,43,26,0.13)]"
          : "cursor-default"
      }`}
      style={{ animationDelay: `${index * 55}ms` }}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {/* Image Area */}
      <div className={`relative w-full overflow-hidden shrink-0 ${styles.image}`}>
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 font-body text-[10px] font-bold tracking-wider uppercase px-[9px] py-[3px] rounded-full backdrop-blur-md border ${
              badgeFree
                ? "bg-[#6b9c3e]/90 text-[#e8f5c8] border-[#c8d98a]/30"
                : "bg-white/95 text-[#6b9c3e] border-[#6b9c3e]/20"
            }`}
          >
            <TbTag size={10} />
            {badge}
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className={`flex flex-col gap-1.5 flex-1 ${styles.body}`}>
        <p
          className={`font-display font-bold text-[#3d2b1a] m-0 leading-[1.3] line-clamp-2 ${styles.title}`}
        >
          {title}
        </p>

        {subtitle && (
          <p className="font-body text-[12px] text-[#9e8e80] m-0 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1">
            <RiMapPin2Line size={11} className="shrink-0" />
            {subtitle}
          </p>
        )}

        {rating > 0 && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex items-center gap-px text-[#f4b942]">
              {[...Array(fullStars)].map((_, i) => (
                <IoStarSharp key={`f${i}`} size={11} />
              ))}
              {[...Array(emptyStars)].map((_, i) => (
                <IoStarOutline key={`e${i}`} size={11} className="opacity-40" />
              ))}
            </span>
            {count && (
              <span className="font-body text-[11px] text-[#a89888]">
                ({count.toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}