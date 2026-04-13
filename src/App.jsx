// App.jsx
import { useState } from "react";
import { Provider }  from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import store from "./store/index";

// ── Layout ────────────────────────────────────────────────────────────────────
import Navbar  from "./components/layout/navBar/Navbar";
import Footer  from "./components/layout/footer/Footer";

// ── Modals ────────────────────────────────────────────────────────────────────
import LoginModal from "./components/login/LoginModal";

// ── Pages ─────────────────────────────────────────────────────────────────────
import HomePage         from "./pages/HomePage";
// import GuidePage        from "./pages/GuidePage";

import PlacesPage       from "./pages/PlacesPage";
import PlaceDetailPage  from "./pages/PlaceDetailPage";
import AboutPage        from "./pages/AboutPage";
import ContactPage      from "./pages/ContactPage";
import AccountPage      from "./pages/AccountPage";
import EventsPage from "./pages/EventsPage";

// ── Global styles ─────────────────────────────────────────────────────────────
import "./styles/global.css";
import NotificationsPage from "./pages/notification/NotificationsPage";
// import NotificationsPage from "./pages/NotificationsPage"; 
// import {NotificationsPage} from "./pages/NotificationsPage";
import GuideProfilePage from "./pages/GuideProfilePage";
import GuidePage from "./pages/GuidePage";
// import PlaceDetailPage from "./pages/PlaceDetailPage";
// import NotificationsPage from "./pages/NotificationsPage";


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

          {/* ── Places ── */}
          <Route path="/places" element={<PlacesPage />} />
          <Route
            path="/places/:id"
            element={<PlaceDetailPage setShowLogin={setShowLogin} />}
          />

          {/* ── Static pages ── */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ── Account ── */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/notifications" element={<NotificationsPage/> } />

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
