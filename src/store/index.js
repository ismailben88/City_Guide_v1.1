// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import guideReducer      from "./slices/guideSlice";
import navigationReducer from "./slices/navigationSlice";
import authReducer       from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth:       authReducer,       // ← ajouté
    guides:     guideReducer,
    navigation: navigationReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
