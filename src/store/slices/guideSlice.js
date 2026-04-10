// store/slices/guideSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialFilters = {
  category: "All",
  minRating: 0,
  city: "",
  language: "",
  verifiedOnly: false,
  speciality: "",
  sortBy: "score",
  availDay: "", // e.g. "Monday" — filters by schedule[].day where isOpen:true
  availNow: false, // filters by isCurrentlyAvailable
};

const initialState = {
  allGuides: [],
  searchQuery: "",
  filters: initialFilters,
  selectedGuide: null,
  visibleCount: 8,
};

// ─── Filter helpers ───────────────────────────────────────────────────────────

// Check guide is open on a given day
function isOpenOnDay(guide, day) {
  if (!day) return true;
  return (
    guide.availability?.schedule?.some((s) => s.day === day && s.isOpen) ??
    false
  );
}

// ─── Main filter function ─────────────────────────────────────────────────────
function applyFilters(allGuides, searchQuery, filters) {
  let result = [...allGuides];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter((g) => {
      const name =
        `${g.user?.firstName ?? ""} ${g.user?.lastName ?? ""}`.toLowerCase();
      return (
        name.includes(q) ||
        g.cities?.some((c) => c.name.toLowerCase().includes(q)) ||
        g.spokenLanguages?.some((l) => l.toLowerCase().includes(q)) ||
        g.specialties?.some((s) => s.toLowerCase().includes(q))
      );
    });
  }

  if (filters.minRating > 0)
    result = result.filter((g) => (g.averageRating ?? 0) >= filters.minRating);

  if (filters.city)
    result = result.filter((g) =>
      g.cities?.some(
        (c) => c.name.toLowerCase() === filters.city.toLowerCase(),
      ),
    );

  if (filters.language)
    result = result.filter((g) =>
      g.spokenLanguages?.some(
        (l) => l.toLowerCase() === filters.language.toLowerCase(),
      ),
    );

  if (filters.verifiedOnly)
    result = result.filter((g) => g.verificationStatus === "verified");

  if (filters.speciality)
    result = result.filter((g) =>
      g.specialties?.some((s) =>
        s.toLowerCase().includes(filters.speciality.toLowerCase()),
      ),
    );

  if (filters.availDay)
    result = result.filter((g) => isOpenOnDay(g, filters.availDay));

  if (filters.availNow)
    result = result.filter(
      (g) => g.availability?.isCurrentlyAvailable === true,
    );

  switch (filters.sortBy) {
    case "score":
    case "rating":
      result.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
      break;
    case "name":
      result.sort((a, b) => {
        const na = `${a.user?.firstName} ${a.user?.lastName}`;
        const nb = `${b.user?.firstName} ${b.user?.lastName}`;
        return na.localeCompare(nb);
      });
      break;
    case "price_asc":
      result.sort((a, b) => (a.pricePerHour ?? 0) - (b.pricePerHour ?? 0));
      break;
    case "price_desc":
      result.sort((a, b) => (b.pricePerHour ?? 0) - (a.pricePerHour ?? 0));
      break;
    default:
      break;
  }

  return result;
}

// ─── Slice ────────────────────────────────────────────────────────────────────
const guideSlice = createSlice({
  name: "guides",
  initialState,
  reducers: {
    setGuides(state, action) {
      state.allGuides = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.visibleCount = 8;
    },
    setFilterCategory(state, action) {
      state.filters.category = action.payload;
      if (action.payload === "All") {
        state.filters = { ...initialFilters, sortBy: state.filters.sortBy };
      }
    },
    setFilterMinRating(state, action) {
      state.filters.minRating = action.payload;
      state.visibleCount = 8;
    },
    setFilterCity(state, action) {
      state.filters.city = action.payload;
      state.visibleCount = 8;
    },
    setFilterLanguage(state, action) {
      state.filters.language = action.payload;
      state.visibleCount = 8;
    },
    setFilterVerified(state, action) {
      state.filters.verifiedOnly = action.payload;
      state.visibleCount = 8;
    },
    setFilterSpeciality(state, action) {
      state.filters.speciality = action.payload;
      state.visibleCount = 8;
    },
    setFilterSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    setFilterAvailDay(state, action) {
      state.filters.availDay = action.payload;
      state.visibleCount = 8;
    },
    setFilterAvailNow(state, action) {
      state.filters.availNow = action.payload;
      state.visibleCount = 8;
    },
    resetFilters(state) {
      state.filters = { ...initialFilters };
      state.searchQuery = "";
      state.visibleCount = 8;
    },
    setSelectedGuide(state, action) {
      state.selectedGuide = action.payload;
    },
    loadMore(state) {
      state.visibleCount += 8;
    },
  },
});

export const {
  setGuides,
  setSearchQuery,
  setFilterCategory,
  setFilterMinRating,
  setFilterCity,
  setFilterLanguage,
  setFilterVerified,
  setFilterSpeciality,
  setFilterSortBy,
  setFilterAvailDay,
  setFilterAvailNow,
  resetFilters,
  setSelectedGuide,
  loadMore,
} = guideSlice.actions;

export default guideSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllGuides = (s) => s.guides.allGuides;
export const selectSearchQuery = (s) => s.guides.searchQuery;
export const selectFilters = (s) => s.guides.filters;
export const selectSelectedGuide = (s) => s.guides.selectedGuide;
export const selectVisibleCount = (s) => s.guides.visibleCount;

export const selectFilteredGuides = (state) => {
  const { allGuides, searchQuery, filters } = state.guides;
  return applyFilters(allGuides, searchQuery, filters);
};

export const selectCities = (state) =>
  [
    ...new Set(
      state.guides.allGuides.flatMap((g) => g.cities?.map((c) => c.name) ?? []),
    ),
  ].sort();

export const selectLanguages = (state) =>
  [
    ...new Set(state.guides.allGuides.flatMap((g) => g.spokenLanguages ?? [])),
  ].sort();

export const selectSpecialities = (state) =>
  [
    ...new Set(state.guides.allGuides.flatMap((g) => g.specialties ?? [])),
  ].sort();

export const selectTopGuides = (state) =>
  [...state.guides.allGuides]
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
    .slice(0, 5);
