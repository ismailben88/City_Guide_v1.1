import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useHomePageData() {
  const [data, setData] = useState({
    topSearchPlaces: [], // Attractions célèbres
    interestCategories: [], // Liste complète des catégories
    trendingSearches: [], // Recherches tendances (Calculé via catégories)
    events: [], // Événements mis en avant
    topDestinations: [], // Villes par saison
    guides: [], // Meilleurs guides
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        // Appel de toutes les méthodes de ton nouvel api.js
        const [
          topSearchPlaces,
          interestCategories,
          trendingSearches,
          events,
          topDestinations,
          guides,
        ] = await Promise.all([
          api.getTopSearchPlaces(9), // On peut spécifier la limite ici
          api.getInterestCategories(),
          api.getTopSearches(5), // Nouvelle fonction : Recherches tendances
          api.getEvents(),
          api.getTopDestinations(6),
          api.getGuides(6),
        ]);

        if (!cancelled) {
          setData({
            topSearchPlaces,
            interestCategories,
            trendingSearches,
            events,
            topDestinations,
            guides,
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Erreur HomeData:", err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}
