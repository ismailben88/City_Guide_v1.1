// components/FavoriteButton/FavoriteButton.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in heart button for any card type.
// Internally uses useFavorite — no props about auth state needed.
//
// Props:
//   targetId    string            – id of the resource  (place.id / guide.id / event.id)
//   targetType  string            – "Place" | "GuideProfile" | "Event"
//   size?       "sm" | "md"       – defaults to "md"  (sm = 28px, md = 34px)
//   className?  string            – extra classes on the <button>
//
// Usage:
//   <FavoriteButton targetId={place.id}  targetType="Place"        />
//   <FavoriteButton targetId={guide.id}  targetType="GuideProfile" size="sm" />
//   <FavoriteButton targetId={event.id}  targetType="Event"        />
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import { useFavorite } from "../../hooks/useFavorite";

// ─── Login nudge popup ────────────────────────────────────────────────────────
// Shown when a guest clicks the heart.
// Auto-dismisses after 3.5 s. Pointer-events disabled so it never
// accidentally swallows card clicks.
function LoginNudge({ onClose }) {
  // Auto-dismiss
  useState(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  });

  return (
    <>
      <style>{`
        @keyframes fav-nudge-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(0.88); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
        }
      `}</style>

      <div
        style={{
          pointerEvents: "none",
          animation: "fav-nudge-in 0.28s cubic-bezier(.34,1.56,.64,1) both",
        }}
        className="
          absolute top-3 left-1/2 -translate-x-1/2 z-50
          bg-[#3d2b1a] text-white
          font-[Nunito,sans-serif] text-[11px] font-bold
          px-4 py-2.5 rounded-2xl whitespace-nowrap
          shadow-[0_8px_24px_rgba(61,43,26,0.38)]
          flex items-center gap-2
        "
      >
        <RiHeart3Line size={13} className="text-[#f4b942] flex-shrink-0" />
        <span>
          <a
            href="/login"
            style={{ pointerEvents: "auto" }}
            className="underline underline-offset-2 text-[#f4b942] hover:text-amber-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Log in
          </a>{" "}
          to save favourites
        </span>
      </div>
    </>
  );
}

// ─── FavoriteButton ───────────────────────────────────────────────────────────
export default function FavoriteButton({ targetId, targetType, size = "md", className = "", onRemoved }) {
  const {
    isFav,
    toggle,
    loading,
    initialLoading,
    isLoggedIn,
  } = useFavorite({ targetId, targetType });

  const [showNudge, setShowNudge] = useState(false);
  const [burst,     setBurst]     = useState(false);

  // ── Click handler ──────────────────────────────────────────────────────────
  const handleClick = async (e) => {
    e.stopPropagation(); // never bubble up to the card's onClick

    if (!isLoggedIn) {
      setShowNudge(true);
      return;
    }

    // Burst animation only when adding (not removing)
    if (!isFav) {
      setBurst(true);
      setTimeout(() => setBurst(false), 500);
    }

    await toggle();

    // If we just removed it, notify the parent (e.g. FavoritesPage removes the card)
    if (isFav) onRemoved?.();
  };

  // ── Sizes ──────────────────────────────────────────────────────────────────
  const dim      = size === "sm" ? "w-[28px] h-[28px]" : "w-[34px] h-[34px]";
  const iconSize = size === "sm" ? 13 : 15;

  // ── Skeleton pulse while checking initial state ────────────────────────────
  if (initialLoading) {
    return (
      <div
        className={`
          ${dim} rounded-[10px] border-[1.5px] border-[#e0d8ce] bg-[#f5f0ea]
          flex-shrink-0 animate-pulse
        `}
      />
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {showNudge && <LoginNudge onClose={() => setShowNudge(false)} />}

      <button
        type="button"
        onClick={handleClick}
        aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
        aria-pressed={isFav}
        disabled={loading}
        style={
          burst
            ? {
                transform:  "scale(1.32)",
                transition: "transform 0.2s cubic-bezier(.34,1.56,.64,1)",
              }
            : {}
        }
        className={`
          ${dim} rounded-[10px] border-[1.5px]
          flex items-center justify-center flex-shrink-0
          cursor-pointer select-none
          transition-all duration-[180ms] ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d94f4f]/40
          ${isFav
            ? "border-[#e8c0c0] bg-[#fff0f0] text-[#d94f4f]"
            : `border-[#e0d8ce] bg-transparent text-[#9e8e80]
               hover:bg-[#fff0f0] hover:border-[#e8c0c0] hover:text-[#d94f4f]`
          }
          ${className}
        `}
      >
        {/* Spinner while mutation is in flight */}
        {loading ? (
          <span
            className="block rounded-full border-2 border-current border-t-transparent animate-spin"
            style={{ width: iconSize - 2, height: iconSize - 2 }}
          />
        ) : isFav ? (
          <RiHeart3Fill  size={iconSize} />
        ) : (
          <RiHeart3Line  size={iconSize} />
        )}
      </button>
    </>
  );
}