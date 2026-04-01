// pages/HomePage.jsx
import { useState, useMemo } from "react";
import Hero from "../components/home/Hero/Hero";
import InterestsSection from "../components/home/interstsSection/InterestsSection";
import EventsSection from "../components/home/event/EventsSection";
import TopDestinationsSection from "../components/home/topdistination/TopDestinationsSection";
import TopGuidesSection from "../components/home/guide/TopGuidesSection";
import FamousAttractionsSection from "../components/home/famousAttraction/FamousAttractionsSection";
import LoadingSpinner from "../components/home/LoadingSpinner";
import ErrorMessage from "../components/home/ErrorMessage";
import { useHomePageData } from "../hooks/useHomePageData";
import TopSearch from "../components/home/topSearch/TopSearch";
import { useNavigation } from "../hooks/useNavigation";
import "../styles/Pages.css";

// Maps each chip label (lowercase) to which section it targets
const FILTER_MAP = {
  "guides":       "guides",
  "restaurants":  "places",
  "riads":        "places",
  "desert tours": "destinations",
  "hammam":       "places",
};

export default function HomePage() {
  const {
    topSearchPlaces,
    interestCategories,
    events,
    topDestinations,
    guides,
    loading,
    error,
  } = useHomePageData();

  const { goToGuide, goToPlace } = useNavigation();
  const [activeFilter, setActiveFilter] = useState(null);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleSearch = (term) => {
    const key = FILTER_MAP[term.toLowerCase()] ?? null;
    setActiveFilter(key);

    if (key) {
      setTimeout(() => {
        document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handlePlaceClick = (place) => goToPlace(place);
  const handleGuideClick = (guide) => goToGuide(guide);

  // ── filtered data ─────────────────────────────────────────────────────────
  // When no filter is active, show everything.
  // When a filter IS active, hide sections that don't match.
  const filteredGuides = useMemo(() => {
    if (!activeFilter) return guides;
    return activeFilter === "guides" ? guides : [];
  }, [activeFilter, guides]);

  const filteredDestinations = useMemo(() => {
    if (!activeFilter) return topDestinations;
    return activeFilter === "destinations" ? topDestinations : [];
  }, [activeFilter, topDestinations]);

  const filteredPlaces = useMemo(() => {
    if (!activeFilter) return topSearchPlaces;
    return activeFilter === "places" ? topSearchPlaces : [];
  }, [activeFilter, topSearchPlaces]);

  // ── states ────────────────────────────────────────────────────────────────
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-content">

      {/* ── Hero — now wired with onSearch ── */}
      <Hero onSearch={handleSearch} />

      {/* ── Top Search ── */}
      <TopSearch places={topSearchPlaces} onPlaceClick={handlePlaceClick} />

      {/* ── Interests (not filtered) ── */}
      <InterestsSection categories={interestCategories} />

      {/* ── Events (not filtered) ── */}
      <EventsSection events={events} />

      {/* ── Top Destinations ── */}
      <div id="section-destinations">
        <TopDestinationsSection destinations={filteredDestinations} />
      </div>

      {/* ── Top Guides ── */}
      <div id="section-guides">
        <TopGuidesSection guides={filteredGuides} onGuideClick={handleGuideClick} />
      </div>

      {/* ── Famous Attractions / Places ── */}
      <div id="section-places">
        <FamousAttractionsSection
          places={filteredPlaces}
          onPlaceClick={handlePlaceClick}
        />
      </div>

    </div>
  );
}