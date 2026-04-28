// App.jsx
import { useState } from "react";
import { Provider }  from "react-redux";
import { BrowserRouter, Routes, Route, Navigate,Outlet } from "react-router-dom";
import store from "./store/index";

import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "./store/slices/authSlice";
// ── Layout ────────────────────────────────────────────────────────────────────
import Navbar  from "./components/layout/navBar/Navbar";
import Footer  from "./components/layout/footer/Footer";

// ── Modals ────────────────────────────────────────────────────────────────────
import LoginModal from "./components/login/LoginModal";

// ── Pages ─────────────────────────────────────────────────────────────────────
import HomePage         from "./pages/HomePage";
import GuideProfilePage from "./pages/GuideProfilePage";
import GuidePage from "./pages/GuidePage";
import NotificationsPage from "./pages/NotificationsPage";
import PlacesPage       from "./pages/PlacesPage";
import PlaceDetailPage  from "./pages/PlaceDetailPage";
import AboutPage        from "./pages/AboutPage";
import ContactPage      from "./pages/ContactPage";
import AccountPage      from "./pages/AccountPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import CityDetailPage from "./pages/CityDetailPage";
// ── Settings ──────────────────────────────────────────────────────────────────
import SettingsLayout      from "./components/settings/SettingsLayout";
import AccountSecurity     from "./pages/settings/AccountSecurity";
import NotificationsPanel  from "./pages/settings/NotificationsPanel";
import GuideProfileSettings from "./pages/settings/GuideProfileSettings";
import BusinessSettings    from "./pages/settings/BusinessSettings";
// ── Global styles ─────────────────────────────────────────────────────────────
import "./styles/global.css";
function ProtectedRoute() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: "/favorites" }} />;
}
// ─────────────────────────────────────────────────────────────────────────────
//  Layout wrapper — renders on every route
// ─────────────────────────────────────────────────────────────────────────────
function AppLayout() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Navbar setShowLogin={setShowLogin} />

      <main>
        <Routes>
          {/* ── Home ── */}
          <Route path="/" element={<HomePage />} />

          {/* ── Guides ── */}
          <Route path="/guides" element={<GuidePage />} />
          <Route path="/guides/:id" element={<GuideProfilePage />} />

          {/* ── Events ── */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />

          {/* ── City detail ── */}
          <Route path="/city/:citySlug" element={<CityDetailPage />} />

          {/* ── Places ── */}
          <Route path="/places" element={<PlacesPage />} />
          <Route
            path="/places/:id"
            element={<PlaceDetailPage setShowLogin={setShowLogin} />}
          />
          <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
          {/* ── Static pages ── */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ── Account ── */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/notifications" element={<NotificationsPage/>} />

          {/* ── Settings ── */}
          <Route path="/settings" element={<SettingsLayout />}>
            <Route path="account"          element={<AccountSecurity />} />
            <Route path="personal"         element={<AccountSecurity />} />
            <Route path="notifications"    element={<NotificationsPanel />} />
            <Route path="profile/guide"    element={<GuideProfileSettings />} />
            <Route path="profile/business" element={<BusinessSettings />} />
          </Route>

          {/* ── 404 — redirect to home ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* ── Login modal ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Root — Redux Provider + Router
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  ); 
 

}
