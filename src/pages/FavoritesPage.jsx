// pages/FavoritesPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RiHeart3Fill } from "react-icons/ri";
import { selectUser } from "./../store/slices/authSlice";
import { api } from "./../services/api";
import { TABS } from "./Favorites/constants";
import SkeletonCard  from "./Favorites/components/SkeletonCard";
import EmptyState    from "./Favorites/components/EmptyState";
import SavedPlaceCard from "./Favorites/components/SavedPlaceCard";
import SavedGuideCard from "./Favorites/components/SavedGuideCard";

export default function FavoritesPage() {
  const currentUser = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState("places");
  const [places,    setPlaces]    = useState([]);
  const [guides,    setGuides]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchFavorites = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [
        placeFavs,
        guideFavs,
        allPlaces,
        allGuides,
      ] = await Promise.all([
        api.getUserFavorites(currentUser.id, "Place"),
        api.getUserFavorites(currentUser.id, "GuideProfile"),
        api.getPlaces(),
        api.getGuides(100),
      ]);

      const placeMap = Object.fromEntries(allPlaces.map((p) => [p.id, p]));
      const guideMap = Object.fromEntries(allGuides.map((g) => [g.id, g]));

      const resolvedPlaces = placeFavs
        .map((fav) => placeMap[fav.targetId])
        .filter(Boolean);

      const resolvedGuides = guideFavs
        .map((fav) => guideMap[fav.targetId])
        .filter(Boolean);

      setPlaces(resolvedPlaces);
      setGuides(resolvedGuides);
    } catch (err) {
      setError("Could not load your favourites. Please try again.");
      console.error("[FavoritesPage]", err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ── Remove a card from local state after un-favouriting ──────────────────────
  const handlePlaceRemoved = (id) => setPlaces((prev) => prev.filter((p) => p.id !== id));
  const handleGuideRemoved = (id) => setGuides((prev) => prev.filter((g) => g.id !== id));

  // ── Counts for tab badges ─────────────────────────────────────────────────────
  const counts = { places: places.length, guides: guides.length };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-[#ede8e0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-1">
            <RiHeart3Fill size={22} className="text-[#d94f4f]" />
            <h1 className="font-[Playfair_Display,Georgia,serif] text-3xl font-bold
                           text-[#3d2b1a] m-0">
              My Favourites
            </h1>
          </div>
          <p className="font-[Nunito,sans-serif] text-sm text-[#9e8e80] mt-1">
            All the places and guides you've saved in one spot.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-white border border-[#ede8e0]
                        rounded-2xl w-fit mb-8 shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2 rounded-xl
                font-[Nunito,sans-serif] text-sm font-bold
                transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-[#6b9c3e] text-white shadow-sm"
                  : "text-[#7a6a58] hover:bg-[#f5f0ea] hover:text-[#3d2b1a]"
                }
              `}
            >
              {tab.label}
              {/* Count badge — only show when not loading */}
              {!loading && (
                <span
                  className={`
                    text-[11px] font-bold px-2 py-0.5 rounded-full
                    ${activeTab === tab.id
                      ? "bg-white/25 text-white"
                      : "bg-[#f0ebe4] text-[#9e8e80]"
                    }
                  `}
                >
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200
                          rounded-2xl text-sm text-red-600
                          font-[Nunito,sans-serif]">
            {error}
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {/* Places tab */}
            {activeTab === "places" && (
              places.length === 0
                ? <EmptyState tab="places" />
                : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                                  xl:grid-cols-4 gap-5">
                    {places.map((place, i) => (
                      <div
                        key={place.id}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="animate-[fade-up_0.4s_ease_both]"
                      >
                        <SavedPlaceCard
                          place={place}
                          onRemoved={() => handlePlaceRemoved(place.id)}
                        />
                      </div>
                    ))}
                  </div>
                )
            )}

            {/* Guides tab */}
            {activeTab === "guides" && (
              guides.length === 0
                ? <EmptyState tab="guides" />
                : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                                  xl:grid-cols-4 gap-5">
                    {guides.map((guide, i) => (
                      <div
                        key={guide.id}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="animate-[fade-up_0.4s_ease_both]"
                      >
                        <SavedGuideCard
                          guide={guide}
                          onRemoved={() => handleGuideRemoved(guide.id)}
                        />
                      </div>
                    ))}
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
}
