import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TbArrowLeft, TbMapPin, TbCalendarEvent, TbUsers, TbTicket,
  TbBuildingCommunity, TbCircleCheck, TbCircleDashed,
} from "react-icons/tb";
import { RiCalendarEventLine } from "react-icons/ri";
import { api } from "../services/api";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";

const formatDate = (dateStr) => {
  if (!dateStr) return "Date TBA";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const STATUS_CONFIG = {
  planned: {
    label: "Planned",
    icon: <TbCircleDashed size={13} />,
    cls: "bg-blue-50 text-blue-600 border-blue-100",
  },
  ongoing: {
    label: "Ongoing",
    icon: <TbCircleCheck size={13} />,
    cls: "bg-[#edf7e4] text-[#6b9c3e] border-[#c8e0a8]",
  },
  completed: {
    label: "Completed",
    icon: <TbCircleCheck size={13} />,
    cls: "bg-[#f5f0ea] text-[#9e8e80] border-[#ddd8d0]",
  },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="w-full h-[400px] bg-[#e8e0d4] animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-4">
          <div className="h-8 w-2/3 bg-[#e8e0d4] rounded-xl animate-pulse" />
          <div className="h-4 w-full bg-[#ede8e0] rounded-xl animate-pulse" />
          <div className="h-4 w-5/6 bg-[#ede8e0] rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-[#e8e0d4] rounded-[20px] animate-pulse" />
      </div>
    </div>
  );
}

// ─── EventDetailPage ──────────────────────────────────────────────────────────
export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getEventById(id)
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <PageSkeleton />;

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-[#f5f0ea] flex items-center justify-center mb-2">
          <RiCalendarEventLine size={36} className="text-[#c4b8a8]" />
        </div>
        <h2 className="font-[Playfair_Display,serif] text-2xl font-bold text-[#3d2b1a]">
          Event not found
        </h2>
        <p className="text-[#9e8e80] font-[Nunito,sans-serif] text-sm max-w-xs">
          {error || "This event may have been removed or the link is invalid."}
        </p>
        <button
          onClick={() => navigate("/events")}
          className="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6b9c3e]
                     text-white font-[Nunito,sans-serif] text-sm font-bold
                     hover:bg-[#c8761a] transition-colors"
        >
          <TbArrowLeft size={16} /> Back to Events
        </button>
      </div>
    );
  }

  const isFree = event.ticketPrice === 0;
  const status = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.planned;

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Hero ── */}
      <section className="relative w-full h-[420px] overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${event.id}/1400/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />

        {/* Top controls */}
        <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white
                       rounded-full px-4 py-2 text-sm font-bold border border-white/30
                       hover:bg-white/35 transition-all"
          >
            <TbArrowLeft size={15} /> Back
          </button>

          <FavoriteButton targetId={event.id} targetType="Event" size="sm" />
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-8 z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                            text-[11px] font-bold border ${status.cls}`}
              >
                {status.icon} {status.label}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                            text-[11px] font-bold
                            ${isFree ? "bg-[#6b9c3e] text-white" : "bg-[#c8761a] text-white"}`}
              >
                <TbTicket size={11} />
                {isFree ? "Free Entry" : `${event.ticketPrice} DH`}
              </span>

              {event.city?.name && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                                  text-[11px] font-bold bg-white/20 backdrop-blur-sm
                                  text-white border border-white/30">
                  <TbMapPin size={11} /> {event.city.name}
                </span>
              )}
            </div>

            <h1
              className="font-[Playfair_Display,Georgia,serif] text-3xl sm:text-4xl md:text-5xl
                         font-bold text-white leading-tight drop-shadow-md max-w-3xl"
            >
              {event.title}
            </h1>

            {event.organizer && (
              <p className="mt-2 flex items-center gap-1.5 text-white/75 font-[Nunito,sans-serif] text-sm">
                <TbUsers size={14} /> {event.organizer}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Description */}
            <section className="bg-white rounded-[24px] border border-[#ede8e0] p-8
                                 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-[#9e8e80]
                              flex items-center gap-2 mb-4">
                <RiCalendarEventLine size={13} /> About this event
              </h2>
              <p className="font-[Nunito,sans-serif] text-[14px] text-[#5a4a3a] leading-[1.8]
                             whitespace-pre-line">
                {event.description || "No description available for this event."}
              </p>
            </section>

            {/* Organizer */}
            {event.organizer && (
              <section className="bg-white rounded-[24px] border border-[#ede8e0] p-8
                                   shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-[#9e8e80]
                                flex items-center gap-2 mb-4">
                  <TbBuildingCommunity size={13} /> Organizer
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0ebe4] flex items-center justify-center flex-shrink-0">
                    <TbUsers size={20} className="text-[#9e8e80]" />
                  </div>
                  <div>
                    <p className="font-[Nunito,sans-serif] font-bold text-[#3d2b1a] text-[15px]">
                      {event.organizer}
                    </p>
                    <p className="font-[Nunito,sans-serif] text-[12px] text-[#9e8e80]">
                      Event organizer
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Location */}
            {event.city && (
              <section className="bg-white rounded-[24px] border border-[#ede8e0] p-8
                                   shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-[#9e8e80]
                                flex items-center gap-2 mb-4">
                  <TbMapPin size={13} /> Location
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#edf7e4] flex items-center justify-center flex-shrink-0">
                    <TbMapPin size={20} className="text-[#6b9c3e]" />
                  </div>
                  <div>
                    <p className="font-[Nunito,sans-serif] font-bold text-[#3d2b1a] text-[15px]">
                      {event.city.name}
                    </p>
                    <p className="font-[Nunito,sans-serif] text-[12px] text-[#9e8e80]">
                      Morocco
                    </p>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-5">

            {/* Ticket card */}
            <div className="bg-white rounded-[24px] border border-[#ede8e0] p-6
                             shadow-[0_4px_20px_rgba(61,43,26,0.08)]">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#9e8e80]
                              flex items-center gap-2 mb-5">
                <TbTicket size={13} /> Tickets
              </h3>

              <div className="flex items-baseline gap-2 mb-5">
                {isFree ? (
                  <span className="text-3xl font-bold font-[Playfair_Display,serif] text-[#6b9c3e]">
                    Free
                  </span>
                ) : (
                  <>
                    <span className="text-3xl font-bold font-[Playfair_Display,serif] text-[#3d2b1a]">
                      {event.ticketPrice}
                    </span>
                    <span className="text-[#9e8e80] font-[Nunito,sans-serif] text-sm font-bold">DH</span>
                  </>
                )}
              </div>

              <button
                className="w-full py-3 rounded-[14px] bg-[#6b9c3e] text-white
                           font-[Nunito,sans-serif] font-bold text-[14px]
                           flex items-center justify-center gap-2
                           hover:bg-[#c8761a] transition-colors duration-200
                           active:scale-[0.98]"
              >
                <TbTicket size={16} />
                {isFree ? "Register — Free" : "Get Tickets"}
              </button>
            </div>

            {/* Event details */}
            <div className="bg-white rounded-[24px] border border-[#ede8e0] p-6
                             shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#9e8e80]
                              mb-4">
                Event Details
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#edf7e4] flex items-center justify-center flex-shrink-0">
                    <TbCalendarEvent size={15} className="text-[#6b9c3e]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9e8e80]
                                   font-[Nunito,sans-serif]">
                      Date
                    </p>
                    <p className="text-[13px] font-bold text-[#3d2b1a] font-[Nunito,sans-serif]">
                      {formatDate(event.createdAt)}
                    </p>
                  </div>
                </li>

                {event.city?.name && (
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#edf7e4] flex items-center justify-center flex-shrink-0">
                      <TbMapPin size={15} className="text-[#6b9c3e]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9e8e80]
                                     font-[Nunito,sans-serif]">
                        City
                      </p>
                      <p className="text-[13px] font-bold text-[#3d2b1a] font-[Nunito,sans-serif]">
                        {event.city.name}
                      </p>
                    </div>
                  </li>
                )}

                <li className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                   ${event.status === "ongoing" ? "bg-[#edf7e4]" : "bg-[#f5f0ea]"}`}>
                    {status.icon && (
                      <span className={event.status === "ongoing" ? "text-[#6b9c3e]" : "text-[#9e8e80]"}>
                        {status.icon}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9e8e80]
                                   font-[Nunito,sans-serif]">
                      Status
                    </p>
                    <p className="text-[13px] font-bold text-[#3d2b1a] font-[Nunito,sans-serif] capitalize">
                      {event.status || "Planned"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
