import { useNavigate } from "react-router-dom";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiLeafLine } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi2";
import FavoriteButton from "../../../components/FavoriteButton/FavoriteButton";

export default function SavedPlaceCard({ place, onRemoved }) {
  const navigate    = useNavigate();
  const fullStars   = Math.floor(place.averageRating || 0);
  const emptyStars  = 5 - fullStars;
  const mainImage   =
    place.images?.[0] ||
    place.coverImage ||
    `https://picsum.photos/seed/${place.id}/800/600`;

  const categoryName =
    typeof place.category === "object"
      ? place.category.name
      : place.category;

  return (
    <div
      className="group relative bg-white rounded-[20px] overflow-hidden
                 border-[1.5px] border-[#ede8e0]
                 shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                 flex flex-col
                 transition-all duration-[260ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[5px] hover:shadow-[0_14px_36px_rgba(61,43,26,0.13)]
                 hover:border-[#b8d48a]"
    >
      {/* Image */}
      <div className="relative w-full h-[180px] overflow-hidden flex-shrink-0">
        <img
          src={mainImage}
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${place.id}/800/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent
                        to-[rgba(61,43,26,0.4)]" />

        {/* Category badge */}
        {categoryName && (
          <span className="absolute top-3 left-3 z-10
                           bg-[rgba(255,255,255,0.92)] text-[#6b9c3e]
                           font-[Nunito,sans-serif] text-[10px] font-bold
                           tracking-[0.08em] uppercase px-[10px] py-1
                           rounded-full border border-[rgba(107,156,62,0.2)]
                           flex items-center gap-1">
            <RiLeafLine size={10} />
            {categoryName}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {place.cityName && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#9e8e80]
                        flex items-center gap-1 m-0">
            <RiMapPin2Line size={11} />
            {place.cityName}
          </p>
        )}

        <h3 className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold
                       text-[#3d2b1a] leading-snug line-clamp-2 m-0">
          {place.name}
        </h3>

        {/* Rating */}
        {place.averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-px text-[#f4b942]">
              {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={11} />)}
              {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={11} />)}
            </span>
            <span className="font-[Nunito,sans-serif] text-[12px] font-bold text-[#3d2b1a]">
              {place.averageRating.toFixed(1)}
            </span>
            {place.reviewCount > 0 && (
              <span className="font-[Nunito,sans-serif] text-[11px] text-[#a09080]">
                ({place.reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3
                        border-t border-[#f0ebe4]">
          <button
            type="button"
            onClick={() => navigate(`/places/${place.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5
                       px-3 py-[7px] rounded-[10px]
                       border-[1.5px] border-[#6b9c3e] bg-[#6b9c3e] text-white
                       font-[Nunito,sans-serif] text-[11px] font-bold
                       transition-all duration-[180ms]
                       hover:bg-[#c8761a] hover:border-[#c8761a] hover:-translate-y-px"
          >
            View <HiArrowRight size={12} />
          </button>

          {/* Heart — on remove the card disappears from the list */}
          <FavoriteButton
            targetId={place.id}
            targetType="Place"
            onRemoved={onRemoved}
          />
        </div>
      </div>
    </div>
  );
}
