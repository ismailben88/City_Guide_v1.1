// store/slices/navigationSlice.js
// ─────────────────────────────────────────────────────────────────────────────
//  With React Router DOM, page navigation is handled by the router.
//  This slice now only manages UI state that is NOT reflected in the URL
//  (e.g. selected place/guide data passed between pages).
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice } from "@reduxjs/toolkit";

const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
    selectedPlace: null,
    selectedGuide: null,
  },
  reducers: {
    setSelectedPlace: (state, action) => { state.selectedPlace = action.payload; },
    clearSelectedPlace: (state)       => { state.selectedPlace = null; },
    setSelectedGuide: (state, action) => { state.selectedGuide = action.payload; },
    clearSelectedGuide: (state)       => { state.selectedGuide = null; },
  },
});

export const {
  setSelectedPlace,
  clearSelectedPlace,
  setSelectedGuide,
  clearSelectedGuide,
} = navigationSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectSelectedPlace = (state) => state.navigation.selectedPlace;
export const selectSelectedGuide = (state) => state.navigation.selectedGuide;

export default navigationSlice.reducer;
