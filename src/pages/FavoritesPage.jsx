// pages/Favorites/FavoritesPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// My Favourites page — two sections: saved Places + saved Guide Profiles.
//
// Data flow:
//   1. GET /favorites?userId=&targetType=Place        → array of fav records
//   2. GET /places  (all)                             → resolve full place objects
//   3. GET /favorites?userId=&targetType=GuideProfile → array of fav records
//   4. GET /guideProfiles (all)                       → resolve full guide objects
//
// Both fetches run in parallel via Promise.all for speed.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiMapPin2Line, RiHeart3Fill, RiLeafLine } from "react-icons/ri";
import { HiArrowRight } from "react-icons/hi2";
import { selectUser } from "./../store/slices/authSlice";
import { api } from "./../services/api";
import FavoriteButton from "./../components/FavoriteButton/FavoriteButton";

// ─── Tab ids ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "places",  label: "Places"  },
  { id: "guides",  label: "Guides"  },
];

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] border-[1.5px] border-[#ede8e0]
                    overflow-hidden animate-pulse">
      <div className="w-full h-[180px] bg-[#f0ebe4]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-[#ede8e0] rounded-full" />
        <div className="h-4 w-2/3 bg-[#e8e0d4] rounded-full" />
        <div className="h-3 w-full bg-[#f0ebe4] rounded-full" />
        <div className="h-3 w-4/5 bg-[#f0ebe4] rounded-full" />
      </div>
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ tab, onBrowse }) {
  const config = {
    places: {
      emoji: "🗺️",
      title: "No saved places yet",
      sub:   "Explore the map and tap ❤ on any place that catches your eye.",
      cta:   "Explore Places",
      href:  "/places",
    },
    guides: {
      emoji: "🧭",
      title: "No saved guides yet",
      sub:   "Find a local guide and save them for your next trip.",
      cta:   "Browse Guides",
      href:  "/guides",
    },
  };
  const c = config[tab];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">{c.emoji}</span>
      <h3 className="font-[Playfair_Display,Georgia,serif] text-xl font-bold
                     text-[#3d2b1a] mb-2">
        {c.title}
      </h3>
      <p className="font-[Nunito,sans-serif] text-sm text-[#9e8e80] max-w-xs mb-6">
        {c.sub}
      </p>
      <a
        href={c.href}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                   bg-[#6b9c3e] text-white font-[Nunito,sans-serif] text-sm font-bold
                   hover:bg-[#c8761a] transition-colors duration-200"
      >
        {c.cta} <HiArrowRight size={14} />
      </a>
    </div>
  );
}

// ─── Saved Place Card ──────────────────────────────────────────────────────────
function SavedPlaceCard({ place, onRemoved }) {
  const navigate    = useNavigate();
  const fullStars   = Math.floor(place.averageRating || 0);
  const emptyStars  = 5 - fullStars;
  const mainImage   =
    place.images?.[0] ||
    place.coverImage ||
    `https://picsum.photos/seed/${place.id}/800/600`;

  const categoryName =
    typeof place.category === "object"
      ? place.category.name
      : place.category;

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
          src={mainImage}
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${place.id}/800/600`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent
                        to-[rgba(61,43,26,0.4)]" />

        {/* Category badge */}
        {categoryName && (
          <span className="absolute top-3 left-3 z-10
                           bg-[rgba(255,255,255,0.92)] text-[#6b9c3e]
                           font-[Nunito,sans-serif] text-[10px] font-bold
                           tracking-[0.08em] uppercase px-[10px] py-1
                           rounded-full border border-[rgba(107,156,62,0.2)]
                           flex items-center gap-1">
            <RiLeafLine size={10} />
            {categoryName}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {place.cityName && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#9e8e80]
                        flex items-center gap-1 m-0">
            <RiMapPin2Line size={11} />
            {place.cityName}
          </p>
        )}

        <h3 className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold
                       text-[#3d2b1a] leading-snug line-clamp-2 m-0">
          {place.name}
        </h3>

        {/* Rating */}
        {place.averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-px text-[#f4b942]">
              {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={11} />)}
              {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={11} />)}
            </span>
            <span className="font-[Nunito,sans-serif] text-[12px] font-bold text-[#3d2b1a]">
              {place.averageRating.toFixed(1)}
            </span>
            {place.reviewCount > 0 && (
              <span className="font-[Nunito,sans-serif] text-[11px] text-[#a09080]">
                ({place.reviewCount.toLocaleString()})
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3
                        border-t border-[#f0ebe4]">
          <button
            type="button"
            onClick={() => navigate(`/places/${place.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5
                       px-3 py-[7px] rounded-[10px]
                       border-[1.5px] border-[#6b9c3e] bg-[#6b9c3e] text-white
                       font-[Nunito,sans-serif] text-[11px] font-bold
                       transition-all duration-[180ms]
                       hover:bg-[#c8761a] hover:border-[#c8761a] hover:-translate-y-px"
          >
            View <HiArrowRight size={12} />
          </button>

          {/* Heart — on remove the card disappears from the list */}
          <FavoriteButton
            targetId={place.id}
            targetType="Place"
            onRemoved={onRemoved}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Saved Guide Card ──────────────────────────────────────────────────────────
function SavedGuideCard({ guide, onRemoved }) {
  const navigate   = useNavigate();
  const fullStars  = Math.floor(guide.averageRating || 0);
  const emptyStars = 5 - fullStars;
  const avatar     = guide.user?.avatarUrl || guide.avatar || "";
  const name       = guide.user
    ? `${guide.user.firstName} ${guide.user.lastName}`
    : guide.name || "Guide";
  const cities     = guide.cities?.map((c) => c.name).join(", ") ||
                     guide.cityNames?.join(", ") || "";
  const banner     = guide.bannerImage ||
    `https://picsum.photos/seed/${guide.id}/800/400`;

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
      {/* Banner */}
      <div className="relative w-full h-[100px] overflow-hidden flex-shrink-0">
        <img
          src={banner}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500
                     group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/${guide.id}/800/400`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent
                        to-[rgba(61,43,26,0.5)]" />
      </div>

      {/* Avatar — overlaps banner */}
      <div className="relative px-4 flex items-end gap-3 -mt-7">
        <div className="w-14 h-14 rounded-full border-[3px] border-white
                        overflow-hidden flex-shrink-0 bg-[#6b9c3e]
                        shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                        flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <span className="font-[Nunito,sans-serif] text-white text-lg font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Verified badge */}
        {guide.verificationStatus === "verified" && (
          <span className="mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                           font-[Nunito,sans-serif]
                           bg-[#eef5e8] text-[#6b9c3e] border border-[#b8d48a]">
            ✓ Verified
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-2 flex flex-col gap-2 flex-1">
        <h3 className="font-[Playfair_Display,Georgia,serif] text-[15px] font-bold
                       text-[#3d2b1a] leading-snug m-0">
          {name}
        </h3>

        {cities && (
          <p className="font-[Nunito,sans-serif] text-[11px] text-[#9e8e80]
                        flex items-center gap-1 m-0">
            <RiMapPin2Line size={11} />
            {cities}
          </p>
        )}

        {/* Rating */}
        {guide.averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-px text-[#f4b942]">
              {Array.from({ length: fullStars  }).map((_, i) => <IoStarSharp   key={`f${i}`} size={11} />)}
              {Array.from({ length: emptyStars }).map((_, i) => <IoStarOutline key={`e${i}`} size={11} />)}
            </span>
            <span className="font-[Nunito,sans-serif] text-[12px] font-bold text-[#3d2b1a]">
              {guide.averageRating.toFixed(1)}
            </span>
            <span className="font-[Nunito,sans-serif] text-[11px] text-[#a09080]">
              ({guide.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Specialties */}
        {guide.specialties?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guide.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="bg-[#f0f5e0] text-[#6b9c3e] border border-[#dde8cc]
                           font-[Nunito,sans-serif] text-[10px] font-bold
                           px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {guide.pricePerHour && (
          <p className="font-[Nunito,sans-serif] text-[12px] text-[#7a6a58] m-0">
            From{" "}
            <span className="font-bold text-[#3d2b1a]">
              {guide.pricePerHour} MAD
            </span>
            {" "}/hr
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-3
                        border-t border-[#f0ebe4]">
          <button
            type="button"
            onClick={() => navigate(`/guides/${guide.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5
                       px-3 py-[7px] rounded-[10px]
                       border-[1.5px] border-[#6b9c3e] bg-[#6b9c3e] text-white
                       font-[Nunito,sans-serif] text-[11px] font-bold
                       transition-all duration-[180ms]
                       hover:bg-[#c8761a] hover:border-[#c8761a] hover:-translate-y-px"
          >
            View Profile <HiArrowRight size={12} />
          </button>

          <FavoriteButton
            targetId={guide.id}
            targetType="GuideProfile"
            onRemoved={onRemoved}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function FavoritesPage() {
  const currentUser = useSelector(selectUser);

  const [activeTab,    setActiveTab]    = useState("places");
  const [places,       setPlaces]       = useState([]);
  const [guides,       setGuides]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchFavorites = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Load fav records + full collections in parallel
      const [
        placeFavs,
        guideFavs,
        allPlaces,
        allGuides,
      ] = await Promise.all([
        api.getUserFavorites(currentUser.id, "Place"),
        api.getUserFavorites(currentUser.id, "GuideProfile"),
        api.getPlaces(),
        api.getGuides(100),   // pass a high limit so we get all
      ]);

      // 2. Cross-reference to get full objects
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
  const handlePlaceRemoved  = (id) => setPlaces((prev)  => prev.filter((p) => p.id !== id));
  const handleGuideRemoved  = (id) => setGuides((prev)  => prev.filter((g) => g.id !== id));

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