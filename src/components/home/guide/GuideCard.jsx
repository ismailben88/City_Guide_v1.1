// components/home/GuideCard.jsx
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiShieldCheckLine } from "react-icons/ri";
import { TbLanguage } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

/**
 * GuideCard — rich card for the Top Guides section.
 *
 * Props:
 *   guide   {object}  guide data from API (merged guideProfiles + users)
 *   index   {number}  stagger animation index
 *   onClick {fn}
 */
export default function GuideCard({ guide, index = 0, onClick }) {
  // Guide data structure from API merge:
  // - From guideProfiles: id, userId, bio, specialties, spokenLanguages, cityIds,
  //   pricePerHour, totalTours, averageRating, reviewCount, verificationStatus, coverImage
  // - From users: firstName, lastName, avatar, isVerified

  const fullStars = Math.floor(guide.averageRating || 5);
  const emptyStars = 5 - fullStars;
  const isVerified = guide.verificationStatus === "verified";
  const price = guide.pricePerHour;
  const reviews = guide.reviewCount;

  // Get user data from guide if nested
  const user = guide.user || guide;
  const name = `${user?.firstName || "Guide"} ${user?.lastName || ""}`;
  const avatar = user?.avatar || guide.avatar;

  // Cities from guide.cityIds - display first city name or count
  const cityNames = guide.cityNames || [];
  const city = cityNames.length > 0
    ? (cityNames.length === 1 ? cityNames[0] : `${cityNames.length} cities`)
    : "Morocco";

  // Languages from guide
  const languages = guide.spokenLanguages || [];

  return (
    <div
      className="relative w-[235px] rounded-[20px] bg-[#1e1a14] shadow-[0_4px_18px_rgba(0,0,0,0.12)]
                 cursor-pointer flex-shrink-0 flex flex-col scroll-snap-align-start
                 transition-all duration-[280ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[7px] hover:shadow-[0_20px_44px_rgba(61,43,26,0.22)]
                 animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Cover image ── */}
      <div className="relative w-full h-[115px] rounded-t-[20px] overflow-hidden flex-shrink-0">
        <img
          src={guide.coverImage || "https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80"}
          alt={`${name} cover`}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[450ms] ease-in-out
                     hover:scale-107"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 to-[#1e1a14]/65" />
      </div>

      {/* ── Verified badge ── */}
      {isVerified && (
        <span className="absolute top-[10px] left-[10px] z-[3] inline-flex items-center gap-1
                         bg-[rgba(107,156,62,0.88)] backdrop-blur-[6px] text-[#e8f5c8]
                         font-sans text-[10px] font-bold tracking-[0.06em] px-[9px] py-[3px]
                         rounded-full border border-[rgba(200,217,138,0.35)]">
          <RiShieldCheckLine size={10} />
          Verified
        </span>
      )}

      {/* ── Floating avatar ── */}
      <div className="absolute top-[74px] left-1/2 -translate-x-1/2 z-[4]
                      w-[68px] h-[68px] rounded-full border-[3px] border-[#1e1a14]
                      overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.28)]
                      transition-all duration-[280ms] ease-in-out
                      hover:scale-107 hover:shadow-[0_6px_20px_rgba(107,156,62,0.35)]">
        <img
          src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b9c3e&color=fff&size=128`}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover block"
        />
      </div>

      {/* ── Body ── */}
      <div className="pt-[44px] px-4 pb-[18px] flex flex-col items-center gap-2 bg-[#1e1a14] rounded-b-[20px] text-center">
        <p className="font-display text-[15px] font-bold text-[#f5ede0] m-0 leading-[1.2]">
          {name}
        </p>

        <p className="font-sans text-[11px] text-[#a09880] m-0 flex items-center justify-center gap-1">
          <RiMapPin2Line size={11} />
          {city}
        </p>

        {/* ── Rating ── */}
        <div className="flex items-center justify-center gap-[5px]">
          <span className="flex items-center gap-[1px] text-[#f4b942]">
            {Array.from({ length: fullStars }).map((_, i) => (
              <IoStarSharp key={`f${i}`} size={11} />
            ))}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <IoStarOutline key={`e${i}`} size={11} />
            ))}
          </span>
          <span className="font-sans text-[12px] font-bold text-[#f5ede0]">
            {guide.averageRating?.toFixed(1) || "5.0"}
          </span>
          {reviews !== undefined && (
            <span className="font-sans text-[11px] text-[#7a7060]">
              ({reviews} reviews)
            </span>
          )}
        </div>

        {/* ── Languages ── */}
        {languages.length > 0 && (
          <div className="flex flex-wrap justify-center gap-[5px]">
            {languages.slice(0, 3).map((l) => (
              <span
                key={l}
                className="bg-[rgba(255,255,255,0.07)] text-[#b8b098]
                           font-sans text-[10px] font-bold px-[9px] py-[3px]
                           rounded-full border border-[rgba(255,255,255,0.09)]
                           inline-flex items-center gap-[3px]"
              >
                <TbLanguage size={9} />
                {l}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer ── */}
        <div className="w-full pt-[6px] mt-[2px] border-t border-[rgba(255,255,255,0.07)]
                        flex items-center justify-between">
          <span className="font-sans text-[11px] text-[#a09880]">
            From <strong className="text-[13px] font-extrabold text-[#f5ede0]">{price} MAD</strong>/hour
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-[5px] bg-[#6b9c3e] text-white
                       border-none rounded-full px-[14px] py-[6px] font-sans
                       text-[11px] font-bold tracking-[0.04em] cursor-pointer
                       transition-all duration-[180ms] ease-in-out
                       hover:bg-[#c8761a] hover:translate-x-[2px] hover:gap-[8px]"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            Profile <HiArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
