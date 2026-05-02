// ─────────────────────────────────────────────────────────────────────────────
// services/api.js
// CityGuide Maroc — Client API centralisé
//
// ┌─────────────────┬────────────────────────────────────┬───────────────────┐
// │ Mode            │ VITE_API_URL (.env)                 │ Commande          │
// ├─────────────────┼────────────────────────────────────┼───────────────────┤
// │ Mock (json-srv) │ http://localhost:3001               │ npm run mock      │
// │                 │                                     │ npm run dev       │
// ├─────────────────┼────────────────────────────────────┼───────────────────┤
// │ Backend Express │ http://localhost:5000/api/v1        │ npm run dev       │
// │ (via proxy)     │ (proxy Vite gère le CORS)          │ (avec .env.backend│
// │                 │                                     │ copié en .env)    │
// ├─────────────────┼────────────────────────────────────┼───────────────────┤
// │ Production      │ /api/v1                             │ npm run build     │
// └─────────────────┴────────────────────────────────────┴───────────────────┘
//
// Auth : Bearer JWT dans le header Authorization
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// Détection de l'environnement
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ;

// true  → json-server (pas de préfixe /api/v1 dans les routes)
// false → Express backend (routes avec préfixe déjà inclus dans BASE_URL)
const IS_JSON_SERVER = !BASE_URL.includes("/api/v1");

// ─────────────────────────────────────────────────────────────────────────────
// Instance Axios avec intercepteurs
// ─────────────────────────────────────────────────────────────────────────────

const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("cg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Erreur réseau";
    return Promise.reject(new Error(msg));
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Helpers HTTP internes
// ─────────────────────────────────────────────────────────────────────────────

const get    = (url, params) => http.get(url, { params }).then((r) => r.data);
const post   = (url, data)   => http.post(url, data).then((r) => r.data);
const put    = (url, data)   => http.put(url, data).then((r) => r.data);
const patch  = (url, data)   => http.patch(url, data).then((r) => r.data);
const del    = (url)         => http.delete(url).then((r) => r.data);
const upload = (url, form)   =>
  http.post(url, form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaire saison (pour les top destinations)
// ─────────────────────────────────────────────────────────────────────────────

function getCurrentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5)  return { name: "Printemps", months: [3, 4, 5] };
  if (m >= 6 && m <= 8)  return { name: "Été",       months: [6, 7, 8] };
  if (m >= 9 && m <= 11) return { name: "Automne",   months: [9, 10, 11] };
  return                         { name: "Hiver",     months: [12, 1, 2] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalisation d'un lieu (ajoute cityName / categoryName calculés)
// ─────────────────────────────────────────────────────────────────────────────

function normalizePlace(p) {
  return {
    ...p,
    cityName:     p.city?.name     ?? "Inconnu",
    categoryName: p.category?.name ?? "Général",
    categoryIcon: p.category?.icon ?? "📍",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalisation d'un guide (ajoute name / avatar / cityNames calculés)
// ─────────────────────────────────────────────────────────────────────────────

function normalizeGuide(g) {
  return {
    ...g,
    name:      g.user ? `${g.user.firstName} ${g.user.lastName}` : "Inconnu",
    avatar:    g.user?.avatarUrl ?? "",
    cityNames: g.cities?.map((c) => c.name) ?? [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API publique exportée
// ─────────────────────────────────────────────────────────────────────────────

export const api = {

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. AUTH  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** POST /auth/register */
  register: (data) => post("/auth/register", data),

  /** POST /auth/login → { token, user } */
  login: (email, password) => post("/auth/login", { email, password }),

  /** POST /auth/logout */
  logout: () => post("/auth/logout"),

  /** POST /auth/refresh */
  refreshToken: (refreshToken) => post("/auth/refresh", { refreshToken }),

  /** GET  /auth/me */
  getMe: () => get("/auth/me"),


  // ═══════════════════════════════════════════════════════════════════════════
  // 2. USERS  (7 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /users — liste (admin) */
  getUsers: (params) => get("/users", params),

  /** GET  /users/:id */
  getUserById: (id) => get(`/users/${id}`),

  /** PUT  /users/:id */
  updateUser: (id, data) => put(`/users/${id}`, data),

  /** DELETE /users/:id — (admin) */
  deleteUser: (id) => del(`/users/${id}`),

  /** POST /users/:id/avatar  (multipart) */
  uploadAvatar: (id, formData) => upload(`/users/${id}/avatar`, formData),

  /** POST /users/:id/linked-accounts */
  addLinkedAccount: (id, data) => post(`/users/${id}/linked-accounts`, data),

  /** DELETE /users/:id/linked-accounts/:provider */
  removeLinkedAccount: (id, provider) =>
    del(`/users/${id}/linked-accounts/${provider}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CITIES  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /cities */
  getCities: (params) => get("/cities", params),

  /** GET  /cities/:id */
  getCityById: (id) => get(`/cities/${id}`),

  /** POST /cities  (admin) */
  createCity: (data) => post("/cities", data),

  /** PUT  /cities/:id  (admin) */
  updateCity: (id, data) => put(`/cities/${id}`, data),

  /** DELETE /cities/:id  (admin) */
  deleteCity: (id) => del(`/cities/${id}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CATEGORIES  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /categories — arbre complet */
  getCategories: (params) => get("/categories", params),

  /** Alias gardé pour compatibilité */
  getInterestCategories: (params) => get("/categories", params),

  /** GET  /categories/:id */
  getCategoryById: (id) => get(`/categories/${id}`),

  /** POST /categories  (admin) */
  createCategory: (data) => post("/categories", data),

  /** PUT  /categories/:id  (admin) */
  updateCategory: (id, data) => put(`/categories/${id}`, data),

  /** DELETE /categories/:id  (admin) */
  deleteCategory: (id) => del(`/categories/${id}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 5. PLACES  (14 endpoints + 3 helpers homepage)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /places — liste paginée + filtres */
  getPlaces: async (params) => {
    const places = await get("/places", params);
    return Array.isArray(places) ? places.map(normalizePlace) : places;
  },

  /** GET  /places/:id */
  getPlaceById: async (id) => {
    const place = await get(`/places/${id}`);
    return place ? normalizePlace(place) : null;
  },

  /** POST /places */
  createPlace: (data) => post("/places", data),

  /** PUT  /places/:id */
  updatePlace: (id, data) => put(`/places/${id}`, data),

  /** DELETE /places/:id */
  deletePlace: (id) => del(`/places/${id}`),

  /**
   * GET /places/search?q=...&cityId=...&categoryId=...
   * json-server: filtre par name_like + cityId + categoryId
   */
  searchPlaces: async (params) => {
    const query = IS_JSON_SERVER
      ? { name_like: params.q, cityId: params.cityId, categoryId: params.categoryId }
      : params;
    const places = await get("/places", query);
    return Array.isArray(places) ? places.map(normalizePlace) : places;
  },

  /**
   * GET /places/nearby?lat=&lng=&radius=
   * json-server ne supporte pas la géospatialité — renvoie tout en dev
   */
  getNearbyPlaces: (lat, lng, radius = 5000) =>
    IS_JSON_SERVER
      ? get("/places").then((ps) => ps.map(normalizePlace))
      : get("/places/nearby", { lat, lng, radius }),

  /** PATCH /places/:id/feature  (admin) */
  toggleFeaturePlace: (id, isFeatured) =>
    patch(`/places/${id}/feature`, { isFeatured }),

  /** POST  /places/:id/media  (multipart) */
  uploadPlaceMedia: (id, formData) => upload(`/places/${id}/media`, formData),

  /** POST  /places/:id/claim */
  claimBusiness: (id, data) => post(`/places/${id}/claim`, data),

  // --- Helpers homepage ---

  /** Lieux vedettes triés par isFeatured puis reviewCount DESC */
  getTopPlaces: async (limit = 9) => {
    const places = await get("/places");
    return places
      .filter((p) => p.status === "active")
      .sort((a, b) =>
        (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) ||
        b.reviewCount - a.reviewCount,
      )
      .slice(0, limit)
      .map((p, i) => ({ ...normalizePlace(p), badge: i < 3 ? "Populaire" : null }));
  },

  /** Top catégories par nombre de lieux */
  getTopCategories: async (limit = 5) => {
    const places = await get("/places");
    const counts = {};
    const details = {};
    places.forEach((p) => {
      if (!p.categoryId) return;
      counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
      if (!details[p.categoryId] && p.category) details[p.categoryId] = p.category;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([categoryId, count]) => {
        const cat = details[categoryId];
        return { categoryId, name: cat?.name ?? "Autre", icon: cat?.icon ?? "📍", slug: cat?.slug ?? "", count };
      });
  },

  /** Top destinations par événements saisonniers */
  getTopDestinations: async (limit = 6) => {
    const [cities, events] = await Promise.all([get("/cities"), get("/events")]);
    const season = getCurrentSeason();
    const eventCountByCity = {};
    events.forEach((e) => {
      if (e.status !== "upcoming") return;
      const m = new Date(e.dateRange?.from ?? e.createdAt).getMonth() + 1;
      if (!season.months.includes(m)) return;
      eventCountByCity[e.cityId] = (eventCountByCity[e.cityId] ?? 0) + 1;
    });
    return cities
      .map((c) => ({ ...c, seasonLabel: season.name, upcomingEvents: eventCountByCity[c.id] ?? 0 }))
      .sort((a, b) => b.upcomingEvents - a.upcomingEvents)
      .slice(0, limit);
  },

  /** Alias legacy */
  getTopSearchPlaces: function (limit = 9) { return this.getTopPlaces(limit); },
  getTopSearches:     function (limit = 5) { return this.getTopCategories(limit); },


  // ═══════════════════════════════════════════════════════════════════════════
  // 6. EVENTS  (8 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /events?isFeatured=true  — 4 événements en vedette */
  getEvents: async (params) => {
    const events = await get("/events", params);
    return events.filter((e) => e.isFeatured).slice(0, 4);
  },

  /** GET  /events — tous les événements (sans filtre) */
  getAllEvents: (params) => get("/events", params),

  /** GET  /events/:id */
  getEventById: (id) => get(`/events/${id}`),

  /** POST /events */
  createEvent: (data) => post("/events", data),

  /** PUT  /events/:id */
  updateEvent: (id, data) => put(`/events/${id}`, data),

  /** DELETE /events/:id */
  deleteEvent: (id) => del(`/events/${id}`),

  /** GET  /events/nearby?lat=&lng=&radius= */
  getNearbyEvents: (lat, lng, radius = 10000) =>
    IS_JSON_SERVER
      ? get("/events")
      : get("/events/nearby", { lat, lng, radius }),

  /** PATCH /events/:id/feature  (admin) */
  toggleFeatureEvent: (id, isFeatured) =>
    patch(`/events/${id}/feature`, { isFeatured }),


  // ═══════════════════════════════════════════════════════════════════════════
  // 7. GUIDES / GUIDE PROFILES  (7 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /guideProfiles — guides vérifiés, triés par rating */
  getGuides: async (limit = 6) => {
    const profiles = await get("/guideProfiles");
    return profiles
      .filter((p) => p.verificationStatus === "verified")
      .map(normalizeGuide)
      .sort((a, b) => b.averageRating - a.averageRating || b.totalTours - a.totalTours)
      .slice(0, limit);
  },

  /** GET  /guideProfiles/:id */
  getGuideById: async (id) => {
    const profile = await get(`/guideProfiles/${id}`);
    return profile ? normalizeGuide(profile) : null;
  },

  /** POST /guideProfiles */
  createGuideProfile: (data) => post("/guideProfiles", data),

  /** PUT  /guideProfiles/:id */
  updateGuideProfile: (id, data) => put(`/guideProfiles/${id}`, data),

  /** DELETE /guideProfiles/:id */
  deleteGuideProfile: (id) => del(`/guideProfiles/${id}`),

  /** PUT  /guideProfiles/:id/availability */
  updateGuideAvailability: (id, availability) =>
    put(`/guideProfiles/${id}/availability`, { availability }),

  /** GET  /guideProfiles/nearby?lat=&lng=&radius= */
  getNearbyGuides: (lat, lng, radius = 20000) =>
    IS_JSON_SERVER
      ? get("/guideProfiles").then((ps) => ps.map(normalizeGuide))
      : get("/guideProfiles/nearby", { lat, lng, radius }),


  // ═══════════════════════════════════════════════════════════════════════════
  // 8. SCORES / RATINGS  (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /scores?targetId=&targetType= */
  getScores: (targetId, targetType) =>
    get("/scores", { targetId, targetType }),

  /**
   * POST /scores — créer ou mettre à jour la note de l'utilisateur
   * body: { targetId, targetType, score (1-5), authorId }
   */
  submitScore: (data) => post("/scores", data),

  /** GET  /scores/analytics?targetId=&targetType= */
  getScoreAnalytics: (targetId, targetType) =>
    IS_JSON_SERVER
      ? get("/scores", { targetId, targetType })   // agrégation côté client en dev
      : get("/scores/analytics", { targetId, targetType }),

  /** DELETE /scores/:id */
  deleteScore: (id) => del(`/scores/${id}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 9. COMMENTS  (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /comments?targetId=&targetType=
   * Filtre côté json-server, renvoie les commentaires racines (sans parentCommentId)
   */
  getCommentsByTarget: (targetId, targetType) =>
    get("/comments", { targetId, targetType }),

  /** GET  /comments?parentCommentId=  — réponses à un commentaire */
  getReplies: (parentCommentId) => get("/comments", { parentCommentId }),

  /** POST /comments */
  postComment: (data) => post("/comments", data),

  /** PUT  /comments/:id */
  updateComment: (id, data) => put(`/comments/${id}`, data),

  /** DELETE /comments/:id */
  deleteComment: (id) => del(`/comments/${id}`),

  /**
   * PATCH /comments/:id — toggle like
   * body: { likes, likedBy }
   */
  toggleLikeComment: (commentId, newLikes, newLikedBy) =>
    patch(`/comments/${commentId}`, { likes: newLikes, likedBy: newLikedBy }),


  // ═══════════════════════════════════════════════════════════════════════════
  // 10. FAVORITES  (4 endpoints)
  //
  // Shape: { id, userId, targetId, targetType, createdAt }
  // targetType: "Place" | "GuideProfile" | "Event"
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * GET /favorites
   * params: { userId?, targetId?, targetType? }
   */
  getFavorites: (params) => get("/favorites", params),

  /** GET  /favorites?userId= (+ targetType optionnel) */
  getUserFavorites: (userId, targetType) =>
    get("/favorites", targetType ? { userId, targetType } : { userId }),

  /**
   * POST /favorites
   * body: { userId, targetId, targetType, createdAt }
   */
  addFavorite: (data) => post("/favorites", data),

  /** DELETE /favorites/:id */
  deleteFavorite: (id) => del(`/favorites/${id}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 11. MEDIA  (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /media?parentId=&parentType= */
  getMedia: (parentId, parentType) => get("/media", { parentId, parentType }),

  /** POST /media  (multipart/form-data) */
  uploadMedia: (formData) => upload("/media", formData),

  /** PATCH /media/:id/approve  (admin) */
  approveMedia: (id) => patch(`/media/${id}/approve`, { status: "approved" }),

  /** DELETE /media/:id */
  deleteMedia: (id) => del(`/media/${id}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 12. REPORTS  (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * POST /reports
   * body: { targetId, targetType, reason, description, reportedBy }
   */
  submitReport: (data) => post("/reports", data),

  /** GET  /reports  (admin) */
  getReports: (params) => get("/reports", params),

  /** PATCH /reports/:id/review  (admin) */
  reviewReport: (id) => patch(`/reports/${id}`, { status: "reviewed" }),

  /** PATCH /reports/:id/resolve  (admin) */
  resolveReport: (id, note = "") =>
    patch(`/reports/${id}`, { status: "resolved", note }),


  // ═══════════════════════════════════════════════════════════════════════════
  // 13. NOTIFICATIONS  (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /notifications?userId= */
  getNotificationsByUser: (userId) => get("/notifications", { userId }),

  /** POST /notifications */
  createNotification: (data) => post("/notifications", data),

  /** PATCH /notifications/:id → marquer comme lue */
  markAsRead: (id) => patch(`/notifications/${id}`, { isRead: true }),

  /** Marquer toutes les notifications d'un utilisateur comme lues */
  markAllAsRead: async (userId) => {
    if (!IS_JSON_SERVER) return patch(`/notifications/read-all`, { userId });
    const notifs = await get("/notifications", { userId, isRead: false });
    await Promise.all(notifs.map((n) => patch(`/notifications/${n.id}`, { isRead: true })));
  },

  /** DELETE /notifications/:id */
  deleteNotification: (id) => del(`/notifications/${id}`),

  /** Supprimer toutes les notifications lues d'un utilisateur */
  deleteReadNotifications: async (userId) => {
    if (!IS_JSON_SERVER) return del(`/notifications?userId=${userId}&isRead=true`);
    const notifs = await get("/notifications", { userId, isRead: true });
    await Promise.all(notifs.map((n) => del(`/notifications/${n.id}`)));
  },


  // ═══════════════════════════════════════════════════════════════════════════
  // 14. PENDING REQUESTS  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /pendingRequests  (admin) */
  getPendingRequests: (params) => get("/pendingRequests", params),

  /** GET  /pendingRequests/:id */
  getPendingRequestById: (id) => get(`/pendingRequests/${id}`),

  /**
   * POST /pendingRequests
   * body: { requestType: "guide_application" | "business_verification", ... }
   */
  submitPendingRequest: (data) => post("/pendingRequests", data),

  /** PATCH /pendingRequests/:id/approve  (admin) */
  approvePendingRequest: (id, note = "") =>
    patch(`/pendingRequests/${id}`, { status: "approved", note }),

  /** PATCH /pendingRequests/:id/reject  (admin) */
  rejectPendingRequest: (id, reason = "") =>
    patch(`/pendingRequests/${id}`, { status: "rejected", reason }),


  // ═══════════════════════════════════════════════════════════════════════════
  // 15. BUSINESSES  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /businesses?userId= */
  getBusinessesByUser: (userId) => get("/businesses", { userId }),

  /** GET  /businesses/:id */
  getBusinessById: (id) => get(`/businesses/${id}`),

  /** POST /businesses */
  createBusiness: (data) => post("/businesses", data),

  /** PUT  /businesses/:id */
  updateBusiness: (id, data) => put(`/businesses/${id}`, data),

  /** DELETE /businesses/:id */
  deleteBusiness: (id) => del(`/businesses/${id}`),


  // ═══════════════════════════════════════════════════════════════════════════
  // 16. ADMIN  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /adminLogs */
  getAdminLogs: (params) => get("/adminLogs", params),

  /** GET  /adminLogs?targetId=&targetType= */
  getAdminLogsByTarget: (targetId, targetType) =>
    get("/adminLogs", { targetId, targetType }),

  /** POST /adminLogs  (créé automatiquement côté serveur en prod) */
  createAdminLog: (data) => post("/adminLogs", data),

  /** GET  /admin/stats */
  getAdminStats: () =>
    IS_JSON_SERVER ? _buildAdminStatsFromDb() : get("/admin/stats"),

  /** GET  /admin/dashboard */
  getAdminDashboard: () =>
    IS_JSON_SERVER ? _buildAdminStatsFromDb() : get("/admin/dashboard"),
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper privé : stats agrégées en dev (json-server ne les calcule pas)
// ─────────────────────────────────────────────────────────────────────────────

async function _buildAdminStatsFromDb() {
  const [users, places, events, guides, reports, pendingRequests] =
    await Promise.all([
      get("/users"),
      get("/places"),
      get("/events"),
      get("/guideProfiles"),
      get("/reports"),
      get("/pendingRequests"),
    ]);
  return {
    totalUsers:           users.length,
    totalPlaces:          places.length,
    totalEvents:          events.length,
    totalGuides:          guides.filter((g) => g.verificationStatus === "verified").length,
    openReports:          reports.filter((r) => r.status === "open").length,
    pendingRequests:      pendingRequests.filter((r) => r.status === "pending").length,
    featuredPlaces:       places.filter((p) => p.isFeatured).length,
    upcomingEvents:       events.filter((e) => e.status === "upcoming").length,
  };
}
