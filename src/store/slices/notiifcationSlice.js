import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

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

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    status: "idle",
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
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(markOneAsRead.fulfilled, (state, action) => {
        const notif = state.items.find((n) => n.id === action.payload);
        if (notif) notif.isRead = true;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.isRead = true));
      });
  },
});

export const { toggleNotifPanel, closeNotifPanel } = notificationSlice.actions;

export const selectAllNotifications = (state) => state.notifications.items;
export const selectUnreadCount = (state) =>
  state.notifications.items.filter((n) => !n.isRead).length;
export const selectNotifStatus = (state) => state.notifications.status;
export const selectNotifPanelOpen = (state) => state.notifications.isOpen;

export default notificationSlice.reducer;
