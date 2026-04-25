import { HiArrowRight } from "react-icons/hi2";
import { RiMapPin2Line, RiCalendarEventLine, RiMusicLine } from "react-icons/ri";
import { TbTicketOff, TbTag } from "react-icons/tb";

export default function EventCard({ event, index, onClick }) {
  const dateLabel = event.date
    ? new Date(event.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : event.subtitle;

  const mainImage = event.images?.[0] || event.img || `https://picsum.photos/seed/${event.id}/800/600`;

  return (
    <div
      className="group relative w-[288px] rounded-[20px] overflow-hidden cursor-pointer bg-[#1e1a14] shadow-md shrink-0 scroll-snap-align-start flex flex-col transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-[175px] overflow-hidden shrink-0">
        <img
          src={mainImage}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e1a14]/90" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {event.category && (
            <span className="bg-white/10 backdrop-blur-md text-white font-body text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <RiMusicLine size={10} />
              {event.category}
            </span>
          )}
        </div>

        {event.isFree && (
          <span className="absolute top-3 right-3 bg-[#6b9c3e]/85 backdrop-blur-md text-[#e8f5c8] font-body text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#c8d98a]/30 flex items-center gap-1">
            <TbTicketOff size={11} />
            Free
          </span>
        )}

        {dateLabel && (
          <span className="absolute bottom-2.5 left-3 z-10 inline-flex items-center gap-1 text-white/80 font-body text-[11px] font-bold">
            <RiCalendarEventLine size={12} />
            {dateLabel}
          </span>
        )}
      </div>

      {/* Body Section */}
      <div className="p-[14px_16px_18px] flex flex-col gap-2 flex-1 bg-[#1e1a14]">
        <p className="font-body text-[11px] text-[#a09880] m-0 flex items-center gap-1">
          <RiMapPin2Line size={12} />
          {event.cityName || event.city}
        </p>

        <h3 className="font-display text-[15px] font-bold text-[#f5ede0] m-0 leading-[1.3] line-clamp-2">
          {event.title}
        </h3>

        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {event.tags.slice(0, 2).map((t) => (
              <span key={t} className="bg-white/5 text-[#b8b098] font-body text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                <TbTag size={9} />
                {t}
              </span>
            ))}
          </div>
        )}

        <button className="mt-2 self-start flex items-center gap-1.5 bg-[#6b9c3e] text-white rounded-full px-4 py-1.5 font-body text-[12px] font-bold transition-all hover:bg-[#c8761a] hover:translate-x-1">
          Discover <HiArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
