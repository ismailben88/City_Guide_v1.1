import { TbMapPin, TbCalendarEvent, TbUsers, TbTicket } from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";
import FavoriteButton from "../../../components/FavoriteButton/FavoriteButton";

const formatDate = (dateStr) => {
  if (!dateStr) return "Date à venir";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function SavedEventCard({ event, onRemoved }) {
  const isFree = event.ticketPrice === 0;

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
          src={event.coverImage || `https://picsum.photos/seed/${event.id}/800/500`}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${event.id}/800/500`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent
                        to-[rgba(61,43,26,0.4)]" />

        {/* Price badge */}
        <span
          className={`absolute top-3 left-3 z-10 flex items-center gap-1
                      px-[10px] py-1 rounded-full text-[10px] font-bold tracking-[0.06em]
                      ${isFree ? "bg-[#6b9c3e] text-white" : "bg-[#c8761a] text-white"}`}
        >
          <TbTicket size={10} />
          {isFree ? "Gratuit" : `${event.ticketPrice} DH`}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {event.city?.name && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#9e8e80]
                        flex items-center gap-1 m-0">
            <TbMapPin size={11} className="text-[#6b9c3e]" />
            {event.city.name}
          </p>
        )}

        <h3
          className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold
                     text-[#3d2b1a] leading-snug line-clamp-2 m-0"
        >
          {event.title}
        </h3>

        {event.organizer && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#a09080]
                        flex items-center gap-1 m-0">
            <TbUsers size={11} />
            {event.organizer}
          </p>
        )}

        <div className="flex items-center gap-1 text-[11px] text-[#9e8e80]
                        font-[Nunito,sans-serif]">
          <TbCalendarEvent size={11} />
          {formatDate(event.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#f0ebe4]">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5
                       px-3 py-[7px] rounded-[10px]
                       border-[1.5px] border-[#6b9c3e] bg-[#6b9c3e] text-white
                       font-[Nunito,sans-serif] text-[11px] font-bold
                       transition-all duration-[180ms]
                       hover:bg-[#c8761a] hover:border-[#c8761a] hover:-translate-y-px"
          >
            Voir <HiArrowRight size={12} />
          </button>

          <FavoriteButton
            targetId={event.id}
            targetType="Event"
            onRemoved={onRemoved}
          />
        </div>
      </div>
    </div>
  );
}
