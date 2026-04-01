// hooks/useHomePageData.js
import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useHomePageData() {
  const [data, setData] = useState({
    topSearchPlaces: [],
    interestCategories: [],
    events: [],
    topDestinations: [],
    guides: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const [
          topSearchPlaces,
          interestCategories,
          events,
          topDestinations,
          guides,
        ] = await Promise.all([
          api.getTopSearchPlaces(),
          api.getInterestCategories(),
          api.getEvents(),
          api.getTopDestinations(),
          api.getGuides(),
        ]);

        if (!cancelled) {
          setData({ topSearchPlaces, interestCategories, events, topDestinations, guides });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}
