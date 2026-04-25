// hooks/useFavorite.js
// ─────────────────────────────────────────────────────────────────────────────
// Reusable hook — toggle any item in/out of the current user's favourites.
//
// Supports any targetType: "Place" | "GuideProfile" | "Event"
//
// Usage:
//   const { isFav, toggle, loading, initialLoading, isLoggedIn } =
//     useFavorite({ targetId: place.id, targetType: "Place" });
//
// Returned values:
//   isFav          bool    – whether the item is currently saved
//   toggle         fn      – call on heart click (guards against guest / double-click)
//   loading        bool    – true while the POST/DELETE is in-flight
//   initialLoading bool    – true during the first GET (hide the heart or show skeleton)
//   isLoggedIn     bool    – forwarded so FavoriteButton doesn't need its own selector
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn } from "../store/slices/authSlice";
import { api } from "../services/api";

export function useFavorite({ targetId, targetType }) {
  const currentUser = useSelector(selectUser);
  const isLoggedIn  = useSelector(selectIsLoggedIn);

  const [isFav,          setIsFav]          = useState(false);
  const [favId,          setFavId]          = useState(null);  // /favorites record id — needed for DELETE
  const [loading,        setLoading]        = useState(false); // mutation in-flight
  const [initialLoading, setInitialLoading] = useState(true);  // first GET in-flight

  // ── Load initial state ─────────────────────────────────────────────────────
  // Runs whenever the logged-in user or the target changes.
  // Uses a `cancelled` flag to avoid setState on unmounted components.
  useEffect(() => {
    // Guest or missing data → nothing to check
    if (!isLoggedIn || !currentUser?.id || !targetId) {
      setIsFav(false);
      setFavId(null);
      setInitialLoading(false);
      return;
    }

    let cancelled = false;
    setInitialLoading(true);

    api
      .getFavorites({ userId: currentUser.id, targetId, targetType })
      .then((records) => {
        if (cancelled) return;
        if (records?.length) {
          setIsFav(true);
          setFavId(records[0].id);
        } else {
          setIsFav(false);
          setFavId(null);
        }
      })
      .catch(() => {
        // Network error — treat as not saved; silent
      })
      .finally(() => {
        if (!cancelled) setInitialLoading(false);
      });

    return () => { cancelled = true; };
  }, [isLoggedIn, currentUser?.id, targetId, targetType]);

  // ── Toggle ─────────────────────────────────────────────────────────────────
  // Optimistic: update UI immediately, rollback on API error.
  const toggle = useCallback(async () => {
    // Guard: must be logged in and no mutation already running
    if (!isLoggedIn || loading) return;

    // Snapshot current state for potential rollback
    const prevIsFav = isFav;
    const prevFavId = favId;

    // Optimistic update
    setLoading(true);
    setIsFav(!isFav);

    try {
      if (prevIsFav && prevFavId) {
        // ── Remove ──────────────────────────────────────────────────────────
        // DELETE /favorites/:id
        await api.deleteFavorite(prevFavId);
        setFavId(null);
      } else {
        // ── Save ────────────────────────────────────────────────────────────
        // POST /favorites  →  { userId, targetId, targetType, createdAt }
        const record = await api.addFavorite({
          userId:    currentUser.id,
          targetId,
          targetType,
          createdAt: new Date().toISOString(),
        });
        // Store the new record id so we can DELETE it later
        setFavId(record?.id ?? null);
      }
    } catch {
      // API failed — rollback optimistic update
      setIsFav(prevIsFav);
      setFavId(prevFavId);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, loading, isFav, favId, currentUser?.id, targetId, targetType]);

  return {
    isFav,
    toggle,
    loading,
    initialLoading,
    isLoggedIn,
    currentUser,  // forwarded so consuming components don't need their own selector
  };
}