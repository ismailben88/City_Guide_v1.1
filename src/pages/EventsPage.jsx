import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";
import {
  TbMapPin,
  TbCalendarEvent,
  TbUsers,
  TbTicket,
  TbSearch,
  TbX,
  TbSortAscending,
  TbSortDescending,
} from "react-icons/tb";
import { RiCalendarEventLine } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi2";

const formatDate = (dateStr) => {
  if (!dateStr) return "Date à venir";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Featured EventCard (horizontal) ─────────────────────────────────────────
function FeaturedEventCard({ event }) {
  const isFree = event.ticketPrice === 0;

  return (
    <article
      className="group relative bg-white rounded-[24px] overflow-hidden
                 border-[1.5px] border-[#ede8e0]
                 shadow-[0_4px_24px_rgba(61,43,26,0.08)]
                 flex flex-col md:flex-row
                 transition-all duration-300
                 hover:shadow-[0_16px_48px_rgba(61,43,26,0.14)]
                 hover:border-[#b8d48a]"
    >
      {/* Image */}
      <div className="relative md:w-[45%] h-[240px] md:h-auto overflow-hidden flex-shrink-0">
        <img
          src={event.coverImage}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${event.id}/800/500`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

        {/* Price badge */}
        <span
          className={`absolute top-3 left-3 z-10 flex items-center gap-1.5
                      px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide
                      ${isFree ? "bg-[#6b9c3e] text-white" : "bg-[#c8761a] text-white"}`}
        >
          <TbTicket size={12} />
          {isFree ? "Gratuit" : `${event.ticketPrice} DH`}
        </span>

        {/* Favorite */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton targetId={event.id} targetType="Event" size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
        <div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                        bg-[#f5f0ea] text-[#c8761a] text-[10px] font-bold uppercase tracking-wider mb-3
                        font-[Nunito,sans-serif]"
          >
            <RiCalendarEventLine size={11} />
            À la une
          </div>

          <h3
            className="font-[Playfair_Display,Georgia,serif] text-2xl font-bold
                       text-[#3d2b1a] leading-snug mb-3 line-clamp-2"
          >
            {event.title}
          </h3>

          <p
            className="font-[Nunito,sans-serif] text-[13px] text-[#7a6a58]
                       leading-relaxed line-clamp-3 mb-4"
          >
            {event.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#f0ebe4]">
          {event.city?.name && (
            <span
              className="flex items-center gap-1.5 text-[12px] text-[#9e8e80]
                          font-[Nunito,sans-serif]"
            >
              <TbMapPin size={13} className="text-[#6b9c3e]" />
              {event.city.name}
            </span>
          )}
          {event.organizer && (
            <span
              className="flex items-center gap-1.5 text-[12px] text-[#9e8e80]
                          font-[Nunito,sans-serif]"
            >
              <TbUsers size={13} className="text-[#6b9c3e]" />
              {event.organizer}
            </span>
          )}
          <span
            className="flex items-center gap-1.5 text-[12px] text-[#9e8e80]
                        font-[Nunito,sans-serif]"
          >
            <TbCalendarEvent size={13} className="text-[#6b9c3e]" />
            {formatDate(event.createdAt)}
          </span>

          <button
            className="ml-auto flex items-center gap-2 px-5 py-2 rounded-[10px]
                       bg-[#6b9c3e] text-white font-[Nunito,sans-serif] text-[12px] font-bold
                       transition-all duration-200 hover:bg-[#c8761a] hover:-translate-y-px"
          >
            Voir <HiArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── EventCard (grid) ─────────────────────────────────────────────────────────
function EventCard({ event }) {
  const isFree = event.ticketPrice === 0;

  return (
    <article
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
          src={event.coverImage}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${event.id}/800/500`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(61,43,26,0.4)]" />

        {/* Price badge */}
        <span
          className={`absolute top-3 left-3 z-10 flex items-center gap-1
                      px-[10px] py-1 rounded-full text-[10px] font-bold
                      ${isFree ? "bg-[#6b9c3e] text-white" : "bg-[#c8761a] text-white"}`}
        >
          <TbTicket size={10} />
          {isFree ? "Gratuit" : `${event.ticketPrice} DH`}
        </span>

        {/* Favorite */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton targetId={event.id} targetType="Event" size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {event.city?.name && (
          <p className="flex items-center gap-1 text-[11px] text-[#9e8e80] font-[Nunito,sans-serif] m-0">
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
          <p className="flex items-center gap-1 text-[11px] text-[#a09080] font-[Nunito,sans-serif] m-0">
            <TbUsers size={11} />
            {event.organizer}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f0ebe4]">
          <span className="flex items-center gap-1 text-[11px] text-[#9e8e80] font-[Nunito,sans-serif]">
            <TbCalendarEvent size={11} />
            {formatDate(event.createdAt)}
          </span>
          <button
            className="flex items-center gap-1 px-3 py-[6px] rounded-[8px]
                       bg-[#6b9c3e] text-white font-[Nunito,sans-serif] text-[11px] font-bold
                       transition-all duration-200 hover:bg-[#c8761a] hover:-translate-y-px"
          >
            Voir <HiArrowRight size={11} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonEventCard() {
  return (
    <div className="bg-white rounded-[20px] border-[1.5px] border-[#ede8e0] overflow-hidden animate-pulse">
      <div className="w-full h-[180px] bg-[#f0ebe4]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-[#ede8e0] rounded-full" />
        <div className="h-4 w-2/3 bg-[#e8e0d4] rounded-full" />
        <div className="h-3 w-full bg-[#f0ebe4] rounded-full" />
        <div className="h-8 w-full bg-[#f5f0ea] rounded-[8px] mt-2" />
      </div>
    </div>
  );
}

// ─── EventsPage ───────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [cityFilter, setCityFilter]   = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder]     = useState("desc");
  const [search, setSearch]           = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getAllEvents()
      .then((data) => {
        if (!cancelled) {
          setEvents(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(
    () => ["all", ...new Set(events.map((e) => e.city?.name).filter(Boolean))],
    [events]
  );

  const filtered = useMemo(() => {
    let list = [...events];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.city?.name?.toLowerCase().includes(q) ||
          e.organizer?.toLowerCase().includes(q)
      );
    }
    if (cityFilter !== "all") list = list.filter((e) => e.city?.name === cityFilter);
    if (priceFilter === "free") list = list.filter((e) => e.ticketPrice === 0);
    if (priceFilter === "paid") list = list.filter((e) => e.ticketPrice > 0);

    list.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortOrder === "asc" ? diff : -diff;
    });
    return list;
  }, [events, search, cityFilter, priceFilter, sortOrder]);

  const freeCount = useMemo(() => events.filter((e) => e.ticketPrice === 0).length, [events]);
  const cityCount = useMemo(
    () => new Set(events.map((e) => e.city?.name).filter(Boolean)).size,
    [events]
  );

  const featured = filtered[0];
  const rest     = filtered.slice(1);
  const hasFilters = search || cityFilter !== "all" || priceFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setCityFilter("all");
    setPriceFilter("all");
    setSortOrder("desc");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Hero ── */}
      <section className="relative h-[380px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&auto=format"
          alt="Events hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full
                        bg-white/10 backdrop-blur-sm border border-white/20
                        text-white text-[12px] font-[Nunito,sans-serif]"
          >
            <RiCalendarEventLine size={14} />
            Découvrez les événements au Maroc
          </div>

          <h1
            className="font-[Playfair_Display,Georgia,serif] text-4xl md:text-5xl font-bold
                       text-white mb-4 drop-shadow-lg"
          >
            Événements & Festivals
          </h1>

          <p className="text-white/75 text-[15px] max-w-xl font-[Nunito,sans-serif] mb-8">
            Concerts, festivals et expériences culturelles partout au Maroc
          </p>

          {!loading && (
            <div className="flex gap-10">
              {[
                { value: events.length, label: "Événements" },
                { value: freeCount,     label: "Gratuits"    },
                { value: cityCount,     label: "Villes"      },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-bold text-white
                               font-[Playfair_Display,Georgia,serif]"
                  >
                    {value}
                  </div>
                  <div
                    className="text-white/60 text-[11px] uppercase tracking-wider
                               font-[Nunito,sans-serif]"
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#ede8e0] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

          {/* Row 1: Search + Sort + Reset */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <TbSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09080]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un événement..."
                className="w-full pl-9 pr-8 py-2 text-[13px] rounded-[10px]
                           border-[1.5px] border-[#ede8e0] bg-[#faf7f2]
                           font-[Nunito,sans-serif] text-[#3d2b1a] placeholder-[#c4b8a8]
                           focus:outline-none focus:border-[#6b9c3e] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2
                             text-[#a09080] hover:text-[#3d2b1a] transition-colors"
                >
                  <TbX size={14} />
                </button>
              )}
            </div>

            <button
              onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-[10px]
                         border-[1.5px] border-[#ede8e0] bg-white text-[13px]
                         font-[Nunito,sans-serif] text-[#7a6a58] font-semibold
                         hover:border-[#6b9c3e] hover:text-[#6b9c3e] transition-all"
            >
              {sortOrder === "desc" ? (
                <><TbSortDescending size={15} /> Plus récents</>
              ) : (
                <><TbSortAscending size={15} /> Plus anciens</>
              )}
            </button>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-[10px]
                           text-[12px] font-[Nunito,sans-serif] text-[#c8761a] font-bold
                           border-[1.5px] border-[#f0d4a0] bg-[#fdf6ec]
                           hover:bg-[#faebd7] transition-colors"
              >
                <TbX size={13} /> Réinitialiser
              </button>
            )}
          </div>

          {/* Row 2: Price pills + divider + City pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { val: "all",  label: "Tous les prix" },
              { val: "free", label: "Gratuit"        },
              { val: "paid", label: "Payant"         },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={() => setPriceFilter(val)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold font-[Nunito,sans-serif]
                            border-[1.5px] transition-all duration-200
                            ${
                              priceFilter === val
                                ? "bg-[#c8761a] border-[#c8761a] text-white"
                                : "border-[#ede8e0] text-[#7a6a58] hover:border-[#c8761a] hover:text-[#c8761a]"
                            }`}
              >
                {label}
              </button>
            ))}

            <div className="h-5 w-px bg-[#ede8e0] mx-1 hidden sm:block" />

            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full
                            text-[12px] font-bold font-[Nunito,sans-serif]
                            border-[1.5px] transition-all duration-200
                            ${
                              cityFilter === city
                                ? "bg-[#6b9c3e] border-[#6b9c3e] text-white"
                                : "border-[#ede8e0] text-[#7a6a58] hover:border-[#6b9c3e] hover:text-[#6b9c3e]"
                            }`}
              >
                {city === "all" ? (
                  "Toutes les villes"
                ) : (
                  <>
                    <TbMapPin size={10} />
                    {city}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Results count */}
        {!loading && !error && (
          <p className="font-[Nunito,sans-serif] text-[13px] text-[#9e8e80] mb-6">
            <span className="font-bold text-[#3d2b1a]">{filtered.length}</span>
            {" "}événement{filtered.length > 1 ? "s" : ""} trouvé
            {filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonEventCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <TbX size={24} className="text-red-400" />
            </div>
            <h3 className="font-[Playfair_Display,serif] text-lg font-bold text-[#3d2b1a] mb-2">
              Erreur de chargement
            </h3>
            <p className="text-[13px] text-[#9e8e80] font-[Nunito,sans-serif]">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f5f0ea] flex items-center justify-center mb-4">
              <TbCalendarEvent size={28} className="text-[#c4b8a8]" />
            </div>
            <h3 className="font-[Playfair_Display,serif] text-lg font-bold text-[#3d2b1a] mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-[13px] text-[#9e8e80] font-[Nunito,sans-serif] max-w-xs mb-6">
              Essayez d&apos;ajuster vos filtres pour trouver des événements.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                         bg-[#6b9c3e] text-white font-[Nunito,sans-serif] text-sm font-bold
                         hover:bg-[#c8761a] transition-colors duration-200"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {/* Featured */}
            {featured && (
              <section className="mb-8">
                <h2
                  className="font-[Playfair_Display,Georgia,serif] text-xl font-bold
                             text-[#3d2b1a] mb-4 flex items-center gap-2"
                >
                  <span className="inline-flex w-1 h-5 rounded-full bg-[#6b9c3e]" />
                  À la une
                </h2>
                <FeaturedEventCard event={featured} />
              </section>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <section>
                <h2
                  className="font-[Playfair_Display,Georgia,serif] text-xl font-bold
                             text-[#3d2b1a] mb-4 flex items-center gap-2"
                >
                  <span className="inline-flex w-1 h-5 rounded-full bg-[#6b9c3e]" />
                  Tous les événements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {rest.map((event, i) => (
                    <div
                      key={event.id}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className="animate-[fade-up_0.4s_ease_both]"
                    >
                      <EventCard event={event} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
