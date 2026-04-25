import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  TbArrowLeft, TbBuilding, TbCalendarEvent, TbUsers,
  TbMapPin, TbMoodSad,
} from "react-icons/tb";
import { api } from "../services/api";
import { SLIDES, DESTINATIONS } from "../components/home/Hero/heroData";
import PlaceCard from "../components/placeCard/PlaceCard";
import EventCard from "../components/home/event/EventCard";
import GuideListItem from "../components/ui/GuideListItem";
import { useNavigation } from "../hooks/useNavigation";

// ─── helpers ──────────────────────────────────────────────────────────────────

const toSlug = (str = "") =>
  str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

const TABS = [
  { id: "places",  label: "Lieux",       icon: TbBuilding },
  { id: "events",  label: "Événements",  icon: TbCalendarEvent },
  { id: "guides",  label: "Guides",      icon: TbUsers },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function SkeletonHero() {
  return (
    <div className="relative h-[55vh] min-h-[380px] bg-[#1a1208] animate-pulse">
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col gap-4">
        <div className="h-4 w-32 bg-white/10 rounded-full" />
        <div className="h-16 w-72 bg-white/10 rounded-xl" />
        <div className="flex gap-3">
          {[80, 110, 90].map((w) => (
            <div key={w} className={`h-7 w-[${w}px] bg-white/10 rounded-full`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[20px] overflow-hidden border border-[#ede8e0] animate-pulse"
        >
          <div className="h-[195px] bg-[#f0ebe4]" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-3 w-20 bg-[#f0ebe4] rounded-full" />
            <div className="h-4 w-3/4 bg-[#e8e0d4] rounded-full" />
            <div className="h-3 w-full bg-[#f0ebe4] rounded-full" />
            <div className="h-3 w-2/3 bg-[#f0ebe4] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, label, city }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-[#f0f5e8] flex items-center justify-center mb-5">
        <Icon size={32} className="text-[#b8d48a]" />
      </div>
      <p className="text-[#3d2b1a] font-bold text-lg mb-2">
        Aucun {label} disponible
      </p>
      <p className="text-[#9e8e80] text-sm max-w-xs leading-relaxed">
        Il n'y a pas encore de {label} enregistrés pour <span className="font-semibold text-[#5b8523]">{city}</span>.
      </p>
    </div>
  );
}

function StatPill({ icon: Icon, count, label, active }) {
  return (
    <span
      className={[
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold",
        "backdrop-blur-md border transition-all duration-200",
        active
          ? "bg-[#5b8523]/25 border-[#b8d48a]/40 text-[#c8d98a]"
          : "bg-white/10 border-white/15 text-white/80",
      ].join(" ")}
    >
      <Icon size={13} />
      <span className="font-bold">{count}</span> {label}
    </span>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function CityDetailPage() {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const { goToPlace, goToGuide } = useNavigation();

  const [activeTab, setActiveTab] = useState("places");
  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── static metadata from heroData ──
  const heroSlide = useMemo(
    () => SLIDES.find((s) => toSlug(s.city) === citySlug),
    [citySlug],
  );
  const destInfo = useMemo(
    () => DESTINATIONS.find((d) => toSlug(d.label) === citySlug),
    [citySlug],
  );

  const cityDisplayName =
    heroSlide?.city ||
    destInfo?.label ||
    (citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, " "));

  // ── data fetching ──
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPlaces([]);
    setEvents([]);
    setGuides([]);

    async function load() {
      try {
        const [cities, allPlaces, allEvents, allGuides] = await Promise.all([
          api.getCities(),
          api.getPlaces(),
          api.getAllEvents(),
          api.getGuides(100),
        ]);

        if (cancelled) return;

        // find city record in db (may not exist for all hero cities)
        const matched = cities.find(
          (c) => c.slug === citySlug || toSlug(c.name) === citySlug,
        );
        setCity(matched || null);

        const cityId = matched?.id;
        const cityName = matched?.name || cityDisplayName;

        // ── places ──
        const filteredPlaces = allPlaces.filter((p) =>
          cityId
            ? p.cityId === cityId || p.city?.id === cityId
            : toSlug(p.city?.name || p.cityName || "") === citySlug,
        );
        setPlaces(filteredPlaces);

        // ── events — enrich with date + cityName ──
        const filteredEvents = allEvents
          .filter((e) =>
            cityId
              ? e.cityId === cityId
              : toSlug(e.city?.name || e.cityName || "") === citySlug,
          )
          .map((e) => ({
            ...e,
            date: e.dateRange?.from ?? null,
            cityName,
          }));
        setEvents(filteredEvents);

        // ── guides ──
        const filteredGuides = allGuides.filter((g) =>
          g.cities?.some((c) =>
            cityId ? c.id === cityId : toSlug(c.name) === citySlug,
          ),
        );
        setGuides(filteredGuides);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [citySlug]);

  const counts = { places: places.length, events: events.length, guides: guides.length };

  // ── hero image: prefer hero slide import, then db coverImage, then gradient ──
  const heroBg = heroSlide?.img || city?.coverImage || null;

  // ── error state ──
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#faf8f5]">
        <TbMoodSad size={40} className="text-[#c8761a]" />
        <p className="text-[#3d2b1a] font-semibold">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#5b8523] font-semibold hover:underline"
        >
          <TbArrowLeft size={15} /> Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">

      {/* ════════════════════════════════════════════════════
          HERO BANNER
      ════════════════════════════════════════════════════ */}
      {loading && !heroBg ? (
        <SkeletonHero />
      ) : (
        <div className="relative h-[58vh] min-h-[400px] overflow-hidden">

          {/* Background */}
          {heroBg ? (
            <img
              src={heroBg}
              alt={cityDisplayName}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              style={{ objectPosition: "center 40%" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e0a] via-[#2d4a14] to-[#0d1a06]" />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0903]/92 via-[#0d0903]/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0903]/45 to-transparent" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="
              absolute top-6 left-6 z-20
              flex items-center gap-2 px-4 py-2 rounded-full
              bg-white/10 backdrop-blur-md border border-white/20
              text-white text-[13px] font-semibold
              hover:bg-white/20 transition-all duration-200
            "
          >
            <TbArrowLeft size={15} />
            Retour
          </button>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 md:px-12 md:pb-10">

            {/* Tag row */}
            <div className="flex items-center gap-2.5 mb-3">
              {destInfo && (
                <span className="text-3xl leading-none">{destInfo.emoji}</span>
              )}
              {heroSlide && (
                <span className="
                  inline-flex items-center gap-1.5 px-3 py-[5px] rounded-full
                  text-[10px] font-bold tracking-[.18em] uppercase
                  text-[#c8d98a] bg-[#5b8523]/20 ring-1 ring-[#5b8523]/30
                  backdrop-blur-md
                ">
                  <TbMapPin size={10} />
                  {heroSlide.tag}
                </span>
              )}
              {heroSlide && (
                <span className="text-[10px] font-semibold tracking-[.22em] uppercase text-white/35">
                  {heroSlide.label}
                </span>
              )}
            </div>

            {/* City name */}
            <h1 className="
              text-[clamp(44px,8vw,96px)] font-bold text-white
              leading-none tracking-tight font-display mb-5
            ">
              {cityDisplayName}
            </h1>

            {/* Stats pills */}
            {!loading && (
              <div className="flex items-center gap-2.5 flex-wrap">
                <StatPill icon={TbBuilding}       count={counts.places}  label="lieux"       active={activeTab === "places"} />
                <StatPill icon={TbCalendarEvent}  count={counts.events}  label="événements"  active={activeTab === "events"} />
                <StatPill icon={TbUsers}          count={counts.guides}  label="guides"      active={activeTab === "guides"} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          BODY
      ════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">

        {/* City description */}
        {city?.description && (
          <p className="pt-8 pb-2 text-[#6b5c4e] text-[15px] leading-relaxed max-w-2xl">
            {city.description}
          </p>
        )}

        {/* ── Sticky tab bar ── */}
        <div className="
          sticky top-0 z-10 bg-[#faf8f5]/95 backdrop-blur-md
          pt-6 pb-4 -mx-4 px-4 md:-mx-8 md:px-8
          border-b border-[#ede8e0]
        ">
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={[
                  "flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[13px]",
                  "transition-all duration-200",
                  activeTab === id
                    ? "bg-[#5b8523] text-white shadow-[0_4px_20px_rgba(91,133,35,.35)]"
                    : "bg-white text-[#6b5c4e] border border-[#e5ddd4] hover:border-[#b8d48a] hover:text-[#5b8523]",
                ].join(" ")}
              >
                <Icon size={15} />
                {label}
                <span className={[
                  "text-[11px] font-bold px-[7px] py-0.5 rounded-full min-w-[22px] text-center",
                  activeTab === id
                    ? "bg-white/20 text-white"
                    : "bg-[#f0f5e8] text-[#5b8523]",
                ].join(" ")}>
                  {counts[id]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="mt-8">
          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <>
              {/* Places */}
              {activeTab === "places" && (
                places.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {places.map((place, i) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        index={i}
                        onClick={() => goToPlace(place)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={TbBuilding} label="lieux" city={cityDisplayName} />
                )
              )}

              {/* Events */}
              {activeTab === "events" && (
                events.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={TbCalendarEvent} label="événements" city={cityDisplayName} />
                )
              )}

              {/* Guides */}
              {activeTab === "guides" && (
                guides.length > 0 ? (
                  <div className="flex flex-col gap-3 max-w-4xl">
                    {guides.map((guide, i) => (
                      <GuideListItem
                        key={guide.id}
                        guide={guide}
                        index={i}
                        onClick={() => goToGuide(guide)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={TbUsers} label="guides" city={cityDisplayName} />
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
