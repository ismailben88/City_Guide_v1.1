import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchSavedPlaces = createAsyncThunk(
  "savedPlaces/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await api.getSavedPlaces();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const savePlace = createAsyncThunk(
  "savedPlaces/save",
  async (placeId, { rejectWithValue }) => {
    try {
      await api.savePlace(placeId);
      return placeId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unsavePlace = createAsyncThunk(
  "savedPlaces/unsave",
  async (placeId, { rejectWithValue }) => {
    try {
      await api.unsavePlace(placeId);
      return placeId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const savedPlacesSlice = createSlice({
  name: "savedPlaces",
  initialState: {
    ids: [],          // list of saved place IDs
    loading: false,
    actionLoading: false, // for save/unsave button spinner
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetchSavedPlaces
    builder
      .addCase(fetchSavedPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPlaces.fulfilled, (state, action) => {
        state.loading = false;
        // backend returns array of place objects or IDs
        state.ids = action.payload.map((p) =>
          typeof p === "object" ? p._id || p.id : p
        );
      })
      .addCase(fetchSavedPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // savePlace
    builder
      .addCase(savePlace.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(savePlace.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (!state.ids.includes(action.payload)) {
          state.ids.push(action.payload);
        }
      })
      .addCase(savePlace.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // unsavePlace
    builder
      .addCase(unsavePlace.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(unsavePlace.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.ids = state.ids.filter((id) => id !== action.payload);
      })
      .addCase(unsavePlace.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export default savedPlacesSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectSavedIds       = (state) => state.savedPlaces.ids;
export const selectSavedLoading   = (state) => state.savedPlaces.loading;
export const selectActionLoading  = (state) => state.savedPlaces.actionLoading;
export const selectIsSaved        = (placeId) => (state) =>
  state.savedPlaces.ids.includes(placeId);
