// store/slices/authSlice.js
// ─────────────────────────────────────────────────────────────────────────────
//  Auth slice — login / signup / logout
//  Persists the logged-in user to localStorage so the session survives refresh.
// ─────────────────────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Helper: load persisted user ───────────────────────────────────────────────
const loadUser = () => {
  try {
    const raw = localStorage.getItem("cg_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  Thunks
// ─────────────────────────────────────────────────────────────────────────────

/** LOGIN — find user by email + password */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res  = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
      const list = await res.json();

      const user = list.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) return rejectWithValue("Invalid email or password.");

      // never expose password to the app state
      const { password: _pwd, ...safeUser } = user;
      return safeUser;

    } catch {
      return rejectWithValue("Server error. Please try again.");
    }
  }
);

/** SIGNUP — check email not taken, then POST new user */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // 1 — check email uniqueness
      const checkRes  = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
      const existing  = await checkRes.json();
      if (existing.length > 0) return rejectWithValue("This email is already registered.");

      // 2 — create user
      const newUser = {
        name,
        email,
        password,                               // json-server stores it (demo only)
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b9c3e&color=fff`,
        city: "",
        joinedAt: new Date().toISOString().split("T")[0],
        role: "user",
      };

      const postRes  = await fetch(`${BASE_URL}/users`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(newUser),
      });

      const created = await postRes.json();
      const { password: _pwd, ...safeUser } = created;
      return safeUser;

    } catch {
      return rejectWithValue("Server error. Please try again.");
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    loadUser(),   // null | { id, name, email, avatar, city, role }
    loading: false,
    error:   null,
  },
  reducers: {
    logout: (state) => {
      state.user  = null;
      state.error = null;
      localStorage.removeItem("cg_user");
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // ── login ──────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(loginUser.fulfilled,(state, { payload }) => {
        state.loading = false;
        state.user    = payload;
        localStorage.setItem("cg_user", JSON.stringify(payload));
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });

    // ── signup ─────────────────────────────────────────────────────────────
    builder
      .addCase(signupUser.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(signupUser.fulfilled,(state, { payload }) => {
        state.loading = false;
        state.user    = payload;
        localStorage.setItem("cg_user", JSON.stringify(payload));
      })
      .addCase(signupUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectUser        = (state) => state.auth.user;
export const selectIsLoggedIn  = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError   = (state) => state.auth.error;

export default authSlice.reducer;
