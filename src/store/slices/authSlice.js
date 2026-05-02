// store/slices/authSlice.js
// ─────────────────────────────────────────────────────────────────────────────
//  Auth slice — talks to the real Express + MongoDB backend at VITE_API_URL
//  Endpoints used:
//    POST /auth/login      → { token, user }
//    POST /auth/register   → { token, user }
//    PUT  /users/:id       → updated user   (Bearer token required)
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Persistence helpers ───────────────────────────────────────────────────────
const loadUser  = () => { try { return JSON.parse(localStorage.getItem("cg_user") || "null"); } catch { return null; } };
const loadToken = () => localStorage.getItem("cg_token") || null;

// ── Normalize backend user → add computed `name` + `avatar` aliases ───────────
// Backend returns firstName/lastName; components also use .name and .avatar
const normalize = (u) => ({
  ...u,
  name:   u.name   || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
  avatar: u.avatar || u.avatarUrl || "",
});

// ── Shared auth header builder ────────────────────────────────────────────────
const jsonHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ─────────────────────────────────────────────────────────────────────────────
//  Thunks
// ─────────────────────────────────────────────────────────────────────────────

/** LOGIN — POST /auth/login → { token, user } */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res  = await fetch(`${BASE_URL}/auth/login`, {
        method:  "POST",
        headers: jsonHeaders(),
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Invalid email or password.");
      return { token: data.token, user: normalize(data.user) };
    } catch {
      return rejectWithValue("Server error. Please try again.");
    }
  }
);

/** SIGNUP — POST /auth/register → { token, user }
 *  The modal sends a single `name` field; we split it into firstName / lastName
 *  before sending to the backend which requires both fields.
 */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const parts     = name.trim().split(/\s+/);
      const firstName = parts[0] || name;
      const lastName  = parts.slice(1).join(" ") || "";

      const res  = await fetch(`${BASE_URL}/auth/register`, {
        method:  "POST",
        headers: jsonHeaders(),
        body:    JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Registration failed.");
      return { token: data.token, user: normalize(data.user) };
    } catch {
      return rejectWithValue("Server error. Please try again.");
    }
  }
);

/** UPDATE USER — PUT /users/:id (Bearer token required)
 *  Backend ignores passwordHash, role, isVerified in the body (server-side filter).
 */
export const updateUser = createAsyncThunk(
  "auth/update",
  async (updates, { getState, rejectWithValue }) => {
    try {
      const { user, token } = getState().auth;
      if (!user?.id) return rejectWithValue("Not authenticated.");

      const res  = await fetch(`${BASE_URL}/users/${user.id}`, {
        method:  "PUT",
        headers: jsonHeaders(token),
        body:    JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Update failed.");
      return normalize(data);
    } catch {
      return rejectWithValue("Failed to save changes. Please try again.");
    }
  }
);

/** GOOGLE AUTH (demo) — tries POST /auth/register; if email taken, POST /auth/login
 *  Uses a deterministic derived password so the same Google account always works.
 *  Replace this with a real Google OAuth flow in production.
 */
export const googleAuth = createAsyncThunk(
  "auth/google",
  async ({ name, email, avatar }, { rejectWithValue }) => {
    try {
      const parts     = name.trim().split(/\s+/);
      const firstName = parts[0] || "User";
      const lastName  = parts.slice(1).join(" ") || "";
      const derived   = `ggl_${btoa(email).slice(0, 14)}`;   // deterministic demo password

      // 1 — attempt registration
      const regRes  = await fetch(`${BASE_URL}/auth/register`, {
        method:  "POST",
        headers: jsonHeaders(),
        body:    JSON.stringify({
          firstName, lastName, email,
          password:     derived,
          authProvider: "google",
          avatarUrl:    avatar,
        }),
      });

      if (regRes.ok) {
        const data = await regRes.json();
        return { token: data.token, user: normalize(data.user) };
      }

      // 2 — email already registered → attempt login with derived password
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method:  "POST",
        headers: jsonHeaders(),
        body:    JSON.stringify({ email, password: derived }),
      });
      const data = await loginRes.json();
      if (!loginRes.ok)
        return rejectWithValue(
          "This email is already registered. Please sign in with your password."
        );
      return { token: data.token, user: normalize(data.user) };
    } catch {
      return rejectWithValue("Google sign-in failed. Please try again.");
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────────────────────

// Shared pending / rejected handlers
const onPending  = (state)             => { state.loading = true;  state.error = null; };
const onRejected = (state, { payload }) => { state.loading = false; state.error = payload; };

// Shared auth-success handler (login / signup / google)
const onAuthSuccess = (state, { payload }) => {
  state.loading = false;
  state.user    = payload.user;
  state.token   = payload.token;
  localStorage.setItem("cg_user",  JSON.stringify(payload.user));
  localStorage.setItem("cg_token", payload.token);
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    loadUser(),
    token:   loadToken(),
    loading: false,
    error:   null,
  },
  reducers: {
    logout: (state) => {
      state.user  = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("cg_user");
      localStorage.removeItem("cg_token");
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // ── login ─────────────────────────────────────────────────────────────
      .addCase(loginUser.pending,   onPending)
      .addCase(loginUser.fulfilled, onAuthSuccess)
      .addCase(loginUser.rejected,  onRejected)

      // ── signup ────────────────────────────────────────────────────────────
      .addCase(signupUser.pending,   onPending)
      .addCase(signupUser.fulfilled, onAuthSuccess)
      .addCase(signupUser.rejected,  onRejected)

      // ── google ────────────────────────────────────────────────────────────
      .addCase(googleAuth.pending,   onPending)
      .addCase(googleAuth.fulfilled, onAuthSuccess)
      .addCase(googleAuth.rejected,  onRejected)

      // ── update profile ────────────────────────────────────────────────────
      .addCase(updateUser.pending,   onPending)
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user    = { ...state.user, ...payload };
        localStorage.setItem("cg_user", JSON.stringify(state.user));
      })
      .addCase(updateUser.rejected,  onRejected);
  },
});

export const { logout, clearError } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectUser        = (state) => state.auth.user;
export const selectToken       = (state) => state.auth.token;
export const selectIsLoggedIn  = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError   = (state) => state.auth.error;

export default authSlice.reducer;
