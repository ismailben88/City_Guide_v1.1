// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import guideReducer from "./slices/guideSlice";
import navigationReducer from "./slices/navigationSlice";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notiifcationSlice"; // ← ajouter
import savedPlacesReducer from "./slices/savedPlacesSlice";
import bookingReducer from "./slices/bookingSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    guides: guideReducer,
    navigation: navigationReducer,
    notifications: notificationReducer,
    savedPlaces: savedPlacesReducer,
    booking: bookingReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
