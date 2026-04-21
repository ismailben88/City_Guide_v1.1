// store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// ─────────────────────────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (userId, { rejectWithValue }) => {
    try {
      return await api.getNotificationsByUser(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const markOneAsRead = createAsyncThunk(
  "notifications/markOne",
  async (notifId, { rejectWithValue }) => {
    try {
      await api.markAsRead(notifId);
      return notifId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const markAllRead = createAsyncThunk(
  "notifications/markAll",
  async (userId, { rejectWithValue }) => {
    try {
      await api.markAllAsRead(userId);
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteNotif = createAsyncThunk(
  "notifications/deleteOne",
  async (notifId, { rejectWithValue }) => {
    try {
      await api.deleteNotification(notifId);
      return notifId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteAllRead = createAsyncThunk(
  "notifications/deleteAllRead",
  async (userId, { rejectWithValue }) => {
    try {
      await api.deleteReadNotifications(userId);
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    isOpen: false,
  },
  reducers: {
    toggleNotifPanel: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeNotifPanel: (state) => {
      state.isOpen = false;
    },
    // Optimistic local-only delete (utile si l'API est lente)
    removeNotifOptimistic: (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // markOne
      .addCase(markOneAsRead.fulfilled, (state, action) => {
        const notif = state.items.find((n) => n.id === action.payload);
        if (notif) notif.isRead = true;
      })
      // markAll
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.isRead = true));
      })
      // deleteOne
      .addCase(deleteNotif.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n.id !== action.payload);
      })
      // deleteAllRead
      .addCase(deleteAllRead.fulfilled, (state) => {
        state.items = state.items.filter((n) => !n.isRead);
      });
  },
});

export const { toggleNotifPanel, closeNotifPanel, removeNotifOptimistic } =
  notificationSlice.actions;

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export const selectAllNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) =>
  state.notifications.items.filter((n) => !n.isRead).length;
export const selectNotifStatus = (state) => state.notifications.status;
export const selectNotifError = (state) => state.notifications.error;
export const selectNotifPanelOpen = (state) => state.notifications.isOpen;

export default notificationSlice.reducer;
