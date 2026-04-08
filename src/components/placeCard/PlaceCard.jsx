// components/placeCard/PlaceCard.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiLeafLine, RiShareLine } from "react-icons/ri";
import { TbTicket, TbTag, TbShoppingBag } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

/**
 * PlaceCard — grid card for the PlacesPage.
 *
 * Props:
 *   place   {object}  place data from API (merged places + cities + categories)
 *   index   {number}  stagger animation index
 *   onClick {fn}      navigate to PlaceDetailPage
 */
export default function PlaceCard({ place, index = 0, onClick }) {
  // Place data structure from API merge:
  // - From places: id, name, description, categoryId, cityId, address, phone, website,
  //   openingHours, entryFee, location, isVerifiedBusiness, isFeatured, averageRating,
  //   reviewCount, images
  // - Merged: cityName, category, categoryIcon

  const fullStars = Math.floor(place.averageRating || 0);
  const emptyStars = 5 - fullStars;
  const isFree = place.entryFee === 0;
  const price = isFree
    ? "Free entry"
    : place.entryFee
      ? `${place.entryFee} MAD`
      : null;

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: place.name, url: window.location.href });
    }
  };

  // Use first image or fallback
  const mainImage = place.images?.[0] || place.img || `https://picsum.photos/seed/${place.id}/800/600`;

  return (
    <div
      className="relative bg-white rounded-[20px] overflow-hidden cursor-pointer
                 border-[1.5px] border-[#ede8e0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                 flex flex-col transition-all duration-[260ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[5px] hover:shadow-[0_14px_36px_rgba(61,43,26,0.13)]
                 hover:border-[#b8d48a] animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Image ── */}
      <div className="relative w-full h-[195px] overflow-hidden flex-shrink-0">
        <img
          src={mainImage}
          alt={place.name || "Place"}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[420ms] ease-in-out
                     group-hover:scale-106"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${place.id || place.name}/800/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(61,43,26,0.45)]" />
      </div>

      {/* ── Category badge ── */}
      {place.category && (
        <span className="absolute top-3 left-3 z-2 bg-[rgba(255,255,255,0.92)] text-[#6b9c3e]
                         font-[Nunito,sans-serif] text-[10px] font-bold tracking-[0.08em] uppercase
                         px-[10px] py-1 rounded-full border border-[rgba(107,156,62,0.2)]
                         flex items-center gap-1">
          <RiLeafLine size={10} />
          {place.category}
        </span>
      )}

      {/* ── Price badge ── */}
      {price && (
        <span className={`absolute top-3 right-3 z-2
                          font-[Nunito,sans-serif] text-[11px] font-bold px-[10px] py-1 rounded-full
                          backdrop-blur-[6px] flex items-center gap-1
                          ${isFree
                            ? "bg-[rgba(107,156,62,0.88)] text-[#e8f5c8]"
                            : "bg-[rgba(61,43,26,0.78)] text-[#f4c67a]"}`}>
          {isFree ? <RiLeafLine size={11} /> : <TbTicket size={11} />}
          {price}
        </span>
      )}

      {/* ── Body ── */}
      <div className="p-[14px_16px_16px] flex flex-col gap-2 flex-1">
        {/* City */}
        {place.cityName && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#9e8e80] m-0
                        flex items-center gap-1">
            <RiMapPin2Line size={11} />
            {place.cityName}
          </p>
        )}

        {/* Title */}
        <h3 className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold text-[#3d2b1a] m-0
                       leading-[1.3] line-clamp-2 overflow-hidden">
          {place.name}
        </h3>

        {/* Description */}
        {place.description && (
          <p className="font-[Nunito,sans-serif] text-[12px] text-[#7a6a58] m-0 leading-[1.5]
                        line-clamp-2 overflow-hidden">
            {place.description}
          </p>
        )}

        {/* ── Rating ── */}
        {place.averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-[1px] text-[#f4b942]">
              {Array.from({ length: fullStars }).map((_, i) => (
                <IoStarSharp key={`f${i}`} size={12} />
              ))}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <IoStarOutline key={`e${i}`} size={12} />
              ))}
            </span>
            <span className="font-[Nunito,sans-serif] text-[12px] font-bold text-[#3d2b1a]">
              {place.averageRating.toFixed(1)}
            </span>
            {place.reviewCount && (
              <span className="font-[Nunito,sans-serif] text-[11px] text-[#a09080]">
                ({place.reviewCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        {/* ── Tags ── */}
        {place.tags?.length > 0 && (
          <div className="flex flex-wrap gap-[5px]">
            {place.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="bg-[#f0f5e0] text-[#6b9c3e]
                           font-[Nunito,sans-serif] text-[10px] font-bold px-[9px] py-1
                           rounded-full border border-[#dde8cc]
                           flex items-center gap-[3px]"
              >
                <TbTag size={9} />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 mt-1 pt-2.5 border-t border-[#f0ebe4]">
          {/* Learn more button */}
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-[5px] px-[10px] py-[7px]
                       rounded-[10px] border-[1.5px] border-[#6b9c3e] bg-[#6b9c3e] text-white
                       font-[Nunito,sans-serif] text-[11px] font-bold cursor-pointer
                       transition-all duration-[180ms] ease-in-out
                       hover:bg-[#c8761a] hover:border-[#c8761a] hover:-translate-y-[1px]"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Learn more <HiArrowRight size={12} />
          </button>

          {/* Buy / Rent button */}
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-[5px] px-[10px] py-[7px]
                       rounded-[10px] border-[1.5px] border-[#e0d8ce] bg-transparent text-[#7a6a58]
                       font-[Nunito,sans-serif] text-[11px] font-bold cursor-pointer
                       transition-all duration-[180ms] ease-in-out
                       hover:bg-[#f7f3ee] hover:border-[#c8b8a8] hover:text-[#3d2b1a]
                       hover:-translate-y-[1px]"
            onClick={(e) => e.stopPropagation()}
          >
            <TbShoppingBag size={13} /> Buy / Rent
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="w-[34px] h-[34px] rounded-[10px] border-[1.5px] border-[#e0d8ce]
                       bg-transparent text-[#9e8e80] flex items-center justify-center
                       flex-shrink-0 cursor-pointer
                       transition-all duration-[180ms] ease-in-out
                       hover:bg-[#f0ebe4] hover:border-[#c8b8a8] hover:text-[#3d2b1a]"
          >
            <RiShareLine size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
