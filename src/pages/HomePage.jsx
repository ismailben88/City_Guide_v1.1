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

// On élargit le filtre pour inclure les nouvelles catégories dynamiques
const FILTER_MAP = {
  "guides": "guides",
  "events": "events",
  "festivals": "events",
  "restaurants": "places",
  "riads": "places",
  "desert tours": "destinations",
  "hammam": "places",
  "monuments": "places",
};

export default function HomePage() {
  const {
    topSearchPlaces,
    interestCategories,
    trendingSearches, // <-- Ajouté depuis le nouveau hook
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
    // Si on clique sur un tag ou recherche un terme, on cherche la correspondance
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

  return (
    <div className="page-content">
      
      {/* Hero : on passe handleSearch pour la barre de recherche principale */}
      
    <Hero onSearch={handleSearch} />

      {/* TopSearch : On lui passe maintenant les trendingSearches pour afficher les tags cliquables */}
      <TopSearch 
        places={topSearchPlaces} 
        trending={trendingSearches} // <-- Nouveau : affiche les catégories populaires
        onPlaceClick={handlePlaceClick}
        onTagClick={handleSearch}   // <-- Nouveau : permet de filtrer en cliquant sur un tag
      />

      {/* Catégories d'intérêts */}
      <InterestsSection categories={interestCategories} />

      {/* Événements de la saison */}
      <EventsSection events={events} />

      {/* Top Destinations filtrables */}
      <div id="section-destinations">
        {filteredDestinations.length > 0 && (
          <TopDestinationsSection destinations={filteredDestinations} />
        )}
      </div>

      {/* Top Guides filtrables */}
      <div id="section-guides">
        {filteredGuides.length > 0 && (
          <TopGuidesSection guides={filteredGuides} onGuideClick={handleGuideClick} />
        )}
      </div>

      {/* Attractions célèbres filtrables */}
      <div id="section-places">
        {filteredPlaces.length > 0 && (
          <FamousAttractionsSection
            places={filteredPlaces}
            onPlaceClick={handlePlaceClick}
          />
        )}
      </div>

      {/* Petit bouton pour réinitialiser les filtres si un filtre est actif */}
      {activeFilter && (
        <button 
          className="reset-filter-btn" 
          onClick={() => setActiveFilter(null)}
        >
          Voir tout
        </button>
      )}
    </div>
  );
}