// components/UI/GuideListItem.jsx
// Real API shape:
//   guide.user.avatarUrl
//   guide.user.firstName / lastName
//   guide.cities[]            → [{ id, name, slug }]
//   guide.spokenLanguages[]   → ["Spanish", "French"]
//   guide.specialties[]       → ["Nightlife", "History", ...]
//   guide.averageRating       → 4.2
//   guide.reviewCount         → 183
//   guide.pricePerHour        → 69
//   guide.totalTours          → 313
//   guide.verificationStatus  → "verified"
//   guide.availability.isCurrentlyAvailable → bool
//   guide.availability.schedule[]  → [{ day, isOpen, slots:[{start,end}] }]

import { MapPin, ShieldCheck, ArrowRight, Clock } from "lucide-react";
import { IoStarSharp } from "react-icons/io5";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
// Returns open days summary: "Mon · Tue · Thu · Sat"
function getOpenDays(schedule = []) {
  return schedule
    .filter((d) => d.isOpen)
    .map((d) => d.day.slice(0, 3))
    .join(" · ");
}

export default function GuideListItem({ guide, index, onClick }) {
  const name =
    `${guide.user?.firstName ?? ""} ${guide.user?.lastName ?? ""}`.trim();
  const avatar = guide.user?.avatarUrl;
  const isVerified = guide.verificationStatus === "verified";
  const isAvail = guide.availability?.isCurrentlyAvailable;
  const rating = Number(guide.averageRating ?? 0);
  const openDays = getOpenDays(guide.availability?.schedule);

  const primaryCity = guide.cities?.[0]?.name ?? "—";
  const extraCities = (guide.cities?.length ?? 0) - 1;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 bg-white rounded-[18px] px-5 py-4 border border-sand3 cursor-pointer
        hover:border-green-mid hover:shadow-card hover:translate-x-1
        transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {/* ── Avatar ── */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar}
          alt={name}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=eef5e8&color=5b8523&size=128`;
          }}
          className="w-16 h-16 rounded-full object-cover border-2 border-green-light"
        />
        {/* Verified badge */}
        {isVerified && (
          <span className="absolute bottom-0.5 right-0.5 w-[18px] h-[18px] rounded-full bg-primary border-2 border-white flex items-center justify-center">
            <ShieldCheck size={9} className="text-white" />
          </span>
        )}
        {/* Availability dot */}
        <span
          className={`absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white ${isAvail ? "bg-emerald-400" : "bg-sand3"}`}
        />
      </div>

      {/* ── Info ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Name */}
        <p className="font-display text-[15px] font-bold text-ink truncate">
          {name}
        </p>

        {/* City + price */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="flex items-center gap-1 font-body text-xs text-ink3">
            <MapPin size={11} />
            {primaryCity}
            {extraCities > 0 && (
              <span className="ml-1 text-[10px] bg-sand2 text-ink3 px-1.5 py-0.5 rounded-full font-bold">
                +{extraCities}
              </span>
            )}
          </span>
          {guide.pricePerHour && (
            <span className="font-body text-xs font-bold text-accent">
              ${guide.pricePerHour} / hr
            </span>
          )}
        </div>

        {/* Open days */}
        {openDays && (
          <div className="flex items-center gap-1 font-body text-[10px] text-ink3">
            <Clock size={10} />
            {openDays}
          </div>
        )}

        {/* Spoken languages */}
        <div className="flex flex-wrap gap-1.5">
          {guide.spokenLanguages?.map((lang) => (
            <span
              key={lang}
              className="bg-green-light text-primary font-body text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-mid/40"
            >
              {lang}
            </span>
          ))}
        </div>

        {/* Specialties */}
        {guide.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {guide.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="bg-sand2 text-ink3 font-body text-[10px] font-semibold px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
            {guide.specialties.length > 3 && (
              <span className="bg-sand2 text-ink3 font-body text-[10px] font-semibold px-2 py-0.5 rounded-full">
                +{guide.specialties.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {/* Stars + rating */}
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStarSharp
                key={i}
                size={11}
                className={
                  i < Math.round(rating) ? "text-amber-400" : "text-sand3"
                }
              />
            ))}
          </span>
          <span className="font-body text-[13px] font-bold text-ink ml-1">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Review count + tours */}
        <div className="flex flex-col items-end gap-0.5">
          {guide.reviewCount > 0 && (
            <span className="font-body text-[10px] text-ink3">
              {guide.reviewCount} reviews
            </span>
          )}
          {guide.totalTours > 0 && (
            <span className="font-body text-[10px] text-ink3">
              {guide.totalTours} tours
            </span>
          )}
        </div>
          
         <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()} // prevent card click when interacting with buttons
        >
          <FavoriteButton
            targetId={guide.id}
            targetType="GuideProfile"
            size="sm"
          />
 
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex items-center gap-1.5 bg-primary text-white rounded-full
                       px-4 py-1.5 font-body text-xs font-bold
                       hover:bg-accent transition-all duration-150 hover:gap-2.5"
          >
            View <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
