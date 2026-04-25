import { useNavigate } from "react-router-dom";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi2";
import FavoriteButton from "../../../components/FavoriteButton/FavoriteButton";

export default function SavedGuideCard({ guide, onRemoved }) {
  const navigate   = useNavigate();
  const fullStars  = Math.floor(guide.averageRating || 0);
  const emptyStars = 5 - fullStars;
  const avatar     = guide.user?.avatarUrl || guide.avatar || "";
  const name       = guide.user
    ? `${guide.user.firstName} ${guide.user.lastName}`
    : guide.name || "Guide";
  const cities     = guide.cities?.map((c) => c.name).join(", ") ||
                     guide.cityNames?.join(", ") || "";
  const banner     = guide.bannerImage ||
    `https://picsum.photos/seed/${guide.id}/800/400`;

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
      {/* Banner */}
      <div className="relative w-full h-[100px] overflow-hidden flex-shrink-0">
        <img
          src={banner}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${guide.id}/800/400`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent
                        to-[rgba(61,43,26,0.5)]" />
      </div>

      {/* Avatar — overlaps banner */}
      <div className="relative px-4 flex items-end gap-3 -mt-7">
        <div className="w-14 h-14 rounded-full border-[3px] border-white
                        overflow-hidden flex-shrink-0 bg-[#6b9c3e]
                        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                        flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <span className="font-[Nunito,sans-serif] text-white text-lg font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Verified badge */}
        {guide.verificationStatus === "verified" && (
          <span className="mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                           font-[Nunito,sans-serif]
                           bg-[#eef5e8] text-[#6b9c3e] border border-[#b8d48a]">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-2 flex flex-col gap-2 flex-1">
        <h3 className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold
                       text-[#3d2b1a] leading-snug m-0">
          {name}
        </h3>

        {cities && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#9e8e80]
                        flex items-center gap-1 m-0">
            <RiMapPin2Line size={11} />
            {cities}
          </p>
        )}

        {/* Rating */}
        {guide.averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-px text-[#f4b942]">
              {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={11} />)}
              {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={11} />)}
            </span>
            <span className="font-[Nunito,sans-serif] text-[12px] font-bold text-[#3d2b1a]">
              {guide.averageRating.toFixed(1)}
            </span>
            <span className="font-[Nunito,sans-serif] text-[11px] text-[#a09080]">
              ({guide.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Specialties */}
        {guide.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guide.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="bg-[#f0f5e0] text-[#6b9c3e] border border-[#dde8cc]
                           font-[Nunito,sans-serif] text-[10px] font-bold
                           px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {guide.pricePerHour && (
          <p className="font-[Nunito,sans-serif] text-[12px] text-[#7a6a58] m-0">
            From{" "}
            <span className="font-bold text-[#3d2b1a]">
              {guide.pricePerHour} MAD
            </span>
            {" "}/hr
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3
                        border-t border-[#f0ebe4]">
          <button
            type="button"
            onClick={() => navigate(`/guides/${guide.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5
                       px-3 py-[7px] rounded-[10px]
                       border-[1.5px] border-[#6b9c3e] bg-[#6b9c3e] text-white
                       font-[Nunito,sans-serif] text-[11px] font-bold
                       transition-all duration-[180ms]
                       hover:bg-[#c8761a] hover:border-[#c8761a] hover:-translate-y-px"
          >
            View Profile <HiArrowRight size={12} />
          </button>

          <FavoriteButton
            targetId={guide.id}
            targetType="GuideProfile"
            onRemoved={onRemoved}
          />
        </div>
      </div>
    </div>
  );
}
