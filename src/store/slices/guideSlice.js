// store/slices/guideSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { guides } from "../../data/index";

const initialFilters = {
  category: "All",
  minRating: 0,
  city: "",
  language: "",
  verifiedOnly: false,
  speciality: "",
  gender: "",
  sortBy: "score",
  // ── new ──
  availDay:  "",   // e.g. "Monday"
  availHour: "",   // e.g. "09:00"
};

const initialState = {
  allGuides: guides,
  searchQuery: "",
  filters: initialFilters,
  selectedGuide: null,
  visibleCount: 8,
};

// ─── Day / hour parsing helpers ───────────────────────────────────────────────
const DAY_ORDER = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_ABBR  = {
  sun:"Sunday", mon:"Monday", tue:"Tuesday", wed:"Wednesday",
  thu:"Thursday", fri:"Friday", sat:"Saturday",
};

function parseDay(str) {
  return DAY_ABBR[str.trim().toLowerCase().slice(0, 3)] ?? null;
}

// "Monday → Saturday" → ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
function expandDayRange(rangeStr) {
  const parts = rangeStr.split(/→|–|-/).map((s) => s.trim());
  if (parts.length !== 2) return [];
  const [from, to] = parts.map(parseDay);
  if (!from || !to) return [];
  const fi = DAY_ORDER.indexOf(from);
  const ti = DAY_ORDER.indexOf(to);
  if (fi === -1 || ti === -1) return [];
  if (fi <= ti) return DAY_ORDER.slice(fi, ti + 1);
  // wrap-around: e.g. "Wednesday → Monday"
  return [...DAY_ORDER.slice(fi), ...DAY_ORDER.slice(0, ti + 1)];
}

// "8:30 → 6:30" → { start: 8.5, end: 18.5 }
function parseHourRange(rangeStr) {
  const parts = rangeStr.split(/→|–|-/).map((s) => s.trim());
  if (parts.length !== 2) return null;
  const toDecimal = (t) => {
    const [h, m = "0"] = t.split(":").map(Number);
    const hour = h < 7 ? h + 12 : h; // hours < 7 treated as PM
    return hour + m / 60;
  };
  return { start: toDecimal(parts[0]), end: toDecimal(parts[1]) };
}

// ─── Filter function ──────────────────────────────────────────────────────────
function applyFilters(allGuides, searchQuery, filters) {
  let result = [...allGuides];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        g.languages.some((l) => l.toLowerCase().includes(q)) ||
        g.specialities.some((s) => s.toLowerCase().includes(q)) ||
        g.typeOfGuide.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters.minRating > 0)
    result = result.filter((g) => g.rating >= filters.minRating);

  if (filters.city)
    result = result.filter((g) => g.city.toLowerCase() === filters.city.toLowerCase());

  if (filters.language)
    result = result.filter((g) =>
      g.languages.some((l) => l.toLowerCase() === filters.language.toLowerCase())
    );

  if (filters.verifiedOnly)
    result = result.filter((g) => g.verified);

  if (filters.speciality)
    result = result.filter((g) =>
      g.specialities.some((s) => s.toLowerCase().includes(filters.speciality.toLowerCase()))
    );

  // ── availability day ──────────────────────────────────────────────────────
  if (filters.availDay) {
    result = result.filter((g) => {
      if (!g.availability?.days) return false;
      return expandDayRange(g.availability.days).includes(filters.availDay);
    });
  }

  // ── availability hour ─────────────────────────────────────────────────────
  if (filters.availHour) {
    const [hStr, mStr = "0"] = filters.availHour.split(":").map(Number);
    const selected = hStr + mStr / 60;
    result = result.filter((g) => {
      if (!g.availability?.hours) return false;
      const range = parseHourRange(g.availability.hours);
      if (!range) return false;
      return selected >= range.start && selected <= range.end;
    });
  }

  switch (filters.sortBy) {
    case "score":  result.sort((a, b) => b.score - a.score);          break;
    case "rating": result.sort((a, b) => b.rating - a.rating);        break;
    case "name":   result.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break;
  }

  return result;
}

// ─── Slice ────────────────────────────────────────────────────────────────────
const guideSlice = createSlice({
  name: "guides",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery  = action.payload;
      state.visibleCount = 8;
    },
    setFilterCategory(state, action) {
      state.filters.category = action.payload;
      if (action.payload === "All") {
        state.filters = { ...initialFilters, sortBy: state.filters.sortBy };
      }
    },
    setFilterMinRating(state, action)  { state.filters.minRating   = action.payload; state.visibleCount = 8; },
    setFilterCity(state, action)       { state.filters.city        = action.payload; state.visibleCount = 8; },
    setFilterLanguage(state, action)   { state.filters.language    = action.payload; state.visibleCount = 8; },
    setFilterVerified(state, action)   { state.filters.verifiedOnly= action.payload; state.visibleCount = 8; },
    setFilterSpeciality(state, action) { state.filters.speciality  = action.payload; state.visibleCount = 8; },
    setFilterSortBy(state, action)     { state.filters.sortBy      = action.payload; },
    // ── new ──
    setFilterAvailDay(state, action)   { state.filters.availDay    = action.payload; state.visibleCount = 8; },
    setFilterAvailHour(state, action)  { state.filters.availHour   = action.payload; state.visibleCount = 8; },

    resetFilters(state) {
      state.filters      = { ...initialFilters };
      state.searchQuery  = "";
      state.visibleCount = 8;
    },
    setSelectedGuide(state, action) { state.selectedGuide = action.payload; },
    loadMore(state)                 { state.visibleCount += 8; },
  },
});

export const {
  setSearchQuery, setFilterCategory, setFilterMinRating,
  setFilterCity, setFilterLanguage, setFilterVerified,
  setFilterSpeciality, setFilterSortBy,
  setFilterAvailDay, setFilterAvailHour,
  resetFilters, setSelectedGuide, loadMore,
} = guideSlice.actions;

export default guideSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllGuides     = (s) => s.guides.allGuides;
export const selectSearchQuery   = (s) => s.guides.searchQuery;
export const selectFilters       = (s) => s.guides.filters;
export const selectSelectedGuide = (s) => s.guides.selectedGuide;
export const selectVisibleCount  = (s) => s.guides.visibleCount;

export const selectFilteredGuides = (state) => {
  const { allGuides, searchQuery, filters } = state.guides;
  return applyFilters(allGuides, searchQuery, filters);
};

export const selectTopGuides = (state) =>
  [...state.guides.allGuides].sort((a, b) => b.score - a.score).slice(0, 5);

export const selectCities = (state) =>
  [...new Set(state.guides.allGuides.map((g) => g.city))].sort();

export const selectLanguages = (state) =>
  [...new Set(state.guides.allGuides.flatMap((g) => g.languages))].sort();

export const selectSpecialities = (state) =>
  [...new Set(state.guides.allGuides.flatMap((g) => g.specialities))].sort();