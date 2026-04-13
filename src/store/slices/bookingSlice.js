import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const bookPlace = createAsyncThunk(
  "booking/bookPlace",
  async ({ placeId, bookingData }, { rejectWithValue }) => {
    try {
      // bookingData = { date, numberOfPeople, notes }
      const result = await api.bookPlace(placeId, bookingData);
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      return await api.getMyBookings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      await api.cancelBooking(bookingId);
      return bookingId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
    bookingLoading: false, // spinner on the "Book" button
    success: false,        // true after a successful booking → show confirmation
    error: null,
    lastBooking: null,     // last created booking object
  },
  reducers: {
    resetBookingStatus(state) {
      state.success = false;
      state.error = null;
      state.lastBooking = null;
    },
  },
  extraReducers: (builder) => {
    // bookPlace
    builder
      .addCase(bookPlace.pending, (state) => {
        state.bookingLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(bookPlace.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.success = true;
        state.lastBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(bookPlace.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
      });

    // fetchMyBookings
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // cancelBooking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (b) => (b._id || b.id) !== action.payload
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectBookings        = (state) => state.booking.bookings;
export const selectBookingLoading  = (state) => state.booking.bookingLoading;
export const selectBookingSuccess  = (state) => state.booking.success;
export const selectBookingError    = (state) => state.booking.error;
export const selectLastBooking     = (state) => state.booking.lastBooking;
