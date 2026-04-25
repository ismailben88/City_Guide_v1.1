// services/api.js
// ─────────────────────────────────────────────────────────────────────────────
// CityGuide Morocco — Service API centralisé (70 endpoints)
// Base URL dev  : http://localhost:3001  (json-server)
// Base URL prod : /api/v1               (Express + MongoDB)
// Auth          : Bearer JWT → header Authorization
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────

const http = axios.create({ baseURL: BASE_URL });

// Injecte le token JWT sur chaque requête si présent
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("cg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gestion globale des erreurs
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
// Helpers internes
// ─────────────────────────────────────────────────────────────────────────────

const get = (url, params) => http.get(url, { params }).then((r) => r.data);
const post = (url, data) => http.post(url, data).then((r) => r.data);
const put = (url, data) => http.put(url, data).then((r) => r.data);
const patch = (url, data) => http.patch(url, data).then((r) => r.data);
const del = (url) => http.delete(url).then((r) => r.data);

// Helpers spéciaux pour les fichiers (multipart)
const upload = (url, formData) =>
  http
    .post(url, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);

// ─────────────────────────────────────────────────────────────────────────────
// Saison courante (utilitaire interne)
// ─────────────────────────────────────────────────────────────────────────────

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return { name: "Printemps", months: [3, 4, 5] };
  if (month >= 6 && month <= 8) return { name: "Été", months: [6, 7, 8] };
  if (month >= 9 && month <= 11)
    return { name: "Automne", months: [9, 10, 11] };
  return { name: "Hiver", months: [12, 1, 2] };
}

// ─────────────────────────────────────────────────────────────────────────────
// API publique
// ─────────────────────────────────────────────────────────────────────────────

export const api = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. AUTH  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** POST /auth/register */
  register: (data) => post("/auth/register", data),

  /** POST /auth/login */
  login: (email, password) => post("/auth/login", { email, password }),

  /** POST /auth/logout */
  logout: () => post("/auth/logout"),

  /** POST /auth/refresh */
  refreshToken: (refreshToken) => post("/auth/refresh", { refreshToken }),

  /** GET  /auth/me — profil de l'utilisateur connecté */
  getMe: () => get("/auth/me"),

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. USERS  (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /users */
  getUsers: (params) => get("/users", params),

  /** GET  /users/:id */
  getUserById: (id) => get(`/users/${id}`),

  /** PUT  /users/:id */
  updateUser: (id, data) => put(`/users/${id}`, data),

  /** DELETE /users/:id */
  deleteUser: (id) => del(`/users/${id}`),

  /** POST /users/:id/avatar  (multipart) */
  uploadAvatar: (id, formData) => upload(`/users/${id}/avatar`, formData),

  /** POST /users/:id/linked-accounts */
  addLinkedAccount: (id, data) => post(`/users/${id}/linked-accounts`, data),

  /** DELETE /users/:id/linked-accounts/:provider */
  removeLinkedAccount: (id, provider) =>
    del(`/users/${id}/linked-accounts/${provider}`),

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CITIES  (4 endpoints)
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

  /** GET  /categories  (arbre complet) */
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
  // 5. PLACES  (12 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /places */
  getPlaces: async (params) => {
    const places = await get("/places", params);
    return places.map((p) => ({
      ...p,
      cityName: p.city?.name || "Inconnu",
      categoryName: p.category?.name || "Général",
      categoryIcon: p.category?.icon || "📍",
    }));
  },

  /** GET  /places/:id */
  getPlaceById: async (id) => {
    const places = await get("/places");
    const place = places.find((p) => p.id === id);
    if (!place) return null;
    return {
      ...place,
      cityName: place.city?.name,
      categoryName: place.category?.name,
      categoryIcon: place.category?.icon,
    };
  },

  /** POST /places */
  createPlace: (data) => post("/places", data),

  /** PUT  /places/:id */
  updatePlace: (id, data) => put(`/places/${id}`, data),

  /** DELETE /places/:id */
  deletePlace: (id) => del(`/places/${id}`),

  /** GET  /places/search?q=...&cityId=...&categoryId=... */
  searchPlaces: (params) => get("/places/search", params),

  /** GET  /places/nearby?lat=&lng=&radius= */
  getNearbyPlaces: (lat, lng, radius = 5000) =>
    get("/places/nearby", { lat, lng, radius }),

  /** PATCH /places/:id/feature  (admin — toggle isFeatured) */
  toggleFeaturePlace: (id, isFeatured) =>
    patch(`/places/${id}/feature`, { isFeatured }),

  /** POST /places/:id/media  (multipart) */
  uploadPlaceMedia: (id, formData) => upload(`/places/${id}/media`, formData),

  /** POST /places/:id/claim  (demande business claim) */
  claimBusiness: (id, data) => post(`/places/${id}/claim`, data),

  // Attractions vedettes — isFeatured en tête, puis reviewCount DESC
  // badge "Populaire" sur les 3 premiers
  getTopSearchPlaces: async (limit = 9) => {
    const places = await get("/places");
    return places
      .filter((p) => p.status === "active")
      .sort((a, b) => {
        if (a.isFeatured !== b.isFeatured)
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, limit)
      .map((place, index) => ({
        ...place,
        cityName: place.city?.name || "Inconnu",
        categoryName: place.category?.name || "Général",
        categoryIcon: place.category?.icon || "📍",
        badge: index < 3 ? "Populaire" : null,
      }));
  },

  // Top catégories les plus représentées parmi les places
  getTopSearches: async (limit = 5) => {
    const places = await get("/places");
    const countMap = {};
    const categoryDetails = {};
    places.forEach((p) => {
      if (!p.categoryId) return;
      countMap[p.categoryId] = (countMap[p.categoryId] || 0) + 1;
      if (!categoryDetails[p.categoryId] && p.category)
        categoryDetails[p.categoryId] = p.category;
    });
    return Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([categoryId, count]) => {
        const cat = categoryDetails[categoryId];
        return {
          categoryId,
          name: cat?.name || "Autre",
          icon: cat?.icon || "📍",
          slug: cat?.slug || "",
          count,
        };
      });
  },

  // Top destinations par événements saisonniers
  getTopDestinations: async (limit = 6) => {
    const [cities, events] = await Promise.all([
      get("/cities"),
      get("/events"),
    ]);
    const season = getCurrentSeason();
    const eventCountByCity = {};
    events.forEach((event) => {
      if (event.status !== "upcoming") return;
      const m = new Date(event.dateRange?.from).getMonth() + 1;
      if (!season.months.includes(m)) return;
      eventCountByCity[event.cityId] =
        (eventCountByCity[event.cityId] || 0) + 1;
    });
    return cities
      .map((city) => ({
        ...city,
        seasonLabel: season.name,
        upcomingEvents: eventCountByCity[city.id] || 0,
      }))
      .sort((a, b) => b.upcomingEvents - a.upcomingEvents)
      .slice(0, limit);
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. EVENTS  (8 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /events */
  getEvents: async (params) => {
    const events = await get("/events", params);
    return events.filter((e) => e.isFeatured).slice(0, 4);
  },

  /** GET  /events (tous, sans filtre featured) */
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
    get("/events/nearby", { lat, lng, radius }),

  /** PATCH /events/:id/feature  (admin) */
  toggleFeatureEvent: (id, isFeatured) =>
    patch(`/events/${id}/feature`, { isFeatured }),

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. GUIDES  (7 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /guideProfiles */
  getGuides: async (limit = 6) => {
    const profiles = await get("/guideProfiles");
    return profiles
      .filter((p) => p.verificationStatus === "verified")
      .map((profile) => ({
        ...profile,
        name: profile.user
          ? `${profile.user.firstName} ${profile.user.lastName}`
          : "Inconnu",
        avatar: profile.user?.avatarUrl || "",
        cityNames: profile.cities?.map((c) => c.name) || [],
      }))
      .sort(
        (a, b) =>
          b.averageRating - a.averageRating || b.totalTours - a.totalTours,
      )
      .slice(0, limit);
  },

  /** GET  /guideProfiles/:id */
  getGuideById: async (id) => {
    const profiles = await get("/guideProfiles");
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return null;
    return {
      ...profile,
      name: profile.user
        ? `${profile.user.firstName} ${profile.user.lastName}`
        : "Inconnu",
      avatar: profile.user?.avatarUrl,
      cityNames: profile.cities?.map((c) => c.name) || [],
    };
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
    get("/guideProfiles/nearby", { lat, lng, radius }),

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. SCORES / RATINGS  (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /scores?targetId=&targetType= */
  getScores: (targetId, targetType) => get("/scores", { targetId, targetType }),

  /** POST /scores — crée ou met à jour la note de l'utilisateur */
  submitScore: (data) =>
    // data: { targetId, targetType, score (1-5), userId }
    post("/scores", data),

  /** GET  /scores/analytics?targetId=&targetType= — distribution des notes */
  getScoreAnalytics: (targetId, targetType) =>
    get("/scores/analytics", { targetId, targetType }),

  /** DELETE /scores/:id */
  deleteScore: (id) => del(`/scores/${id}`),

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. COMMENTS  (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /comments?targetId=&targetType= — commentaires racines (sans parentId) */
  getCommentsByTarget: async (targetId, targetType) => {
    const comments = await get("/comments");
    return comments.filter(
      (c) =>
        c.targetId === targetId &&
        c.targetType === targetType &&
        !c.parentCommentId,
    );
  },

  /** GET  /comments?parentCommentId=  — réponses à un commentaire */
  getReplies: (parentCommentId) => get("/comments", { parentCommentId }),

  /** POST /comments */
  postComment: (data) => post("/comments", data),

  /** PUT  /comments/:id */
  updateComment: (id, data) => put(`/comments/${id}`, data),

  /** DELETE /comments/:id */
  deleteComment: (id) => del(`/comments/${id}`),

  /** PATCH /comments/:id  — toggle like (likes + likedBy) */
  toggleLikeComment: (commentId, newLikes, newLikedBy) =>
    patch(`/comments/${commentId}`, { likes: newLikes, likedBy: newLikedBy }),

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. FAVORITES  (4 endpoints)
  //
  // Record shape: { id, userId, targetId, targetType, createdAt }
  // targetType  : "Place" | "GuideProfile" | "Event"
  //
  // Useful json-server queries:
  //   All user favourites            → GET /favorites?userId=u1
  //   User's favourite places only   → GET /favorites?userId=u1&targetType=Place
  //   Check if a specific item saved → GET /favorites?userId=u1&targetId=p3&targetType=Place
  // ═══════════════════════════════════════════════════════════════════════════
 
  /**
   * GET /favorites
   * Pass any combination of { userId, targetId, targetType } as params.
   * Returns an array — check records.length > 0 to know if already saved.
   */
  getFavorites: (params) => get("/favorites", params),
 
  /**
   * GET /favorites?userId=
   * Convenience: fetch all favourites for one user, optionally filtered by type.
   * Example: api.getUserFavorites("u1", "Place")
   */
  getUserFavorites: (userId, targetType) =>
    get("/favorites", targetType ? { userId, targetType } : { userId }),
 
  /**
   * POST /favorites
   * Body: { userId, targetId, targetType, createdAt }
   * Returns the created record with its server-generated id.
   */
  addFavorite: (data) => post("/favorites", data),
 
  /**
   * DELETE /favorites/:id
   * Use the record's id returned by getFavorites / addFavorite.
   */
  deleteFavorite: (id) => del(`/favorites/${id}`),
 

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. MEDIA  (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /media?parentId=&parentType= */
  getMedia: (parentId, parentType) => get("/media", { parentId, parentType }),

  /** POST /media  (multipart/form-data) */
  uploadMedia: (formData) => upload("/media", formData),

  /** PATCH /media/:id/approve  (admin) */
  approveMedia: (id) => patch(`/media/${id}/approve`, { approved: true }),

  /** DELETE /media/:id */
  deleteMedia: (id) => del(`/media/${id}`),

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. REPORTS  (4 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** POST /reports — signaler un contenu */
  submitReport: (data) =>
    // data: { targetId, targetType, reason, description, reporterId }
    post("/reports", data),

  /** GET  /reports  (admin) */
  getReports: (params) => get("/reports", params),

  /** PATCH /reports/:id/review  (admin — prise en charge) */
  reviewReport: (id) =>
    patch(`/reports/${id}/review`, { status: "under_review" }),

  /** PATCH /reports/:id/resolve  (admin) */
  resolveReport: (id, resolution) =>
    patch(`/reports/${id}/resolve`, { status: "resolved", resolution }),

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. NOTIFICATIONS  (6 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /notifications?userId= */
  getNotificationsByUser: (userId) => get("/notifications", { userId }),

  /** POST /notifications */
  createNotification: (data) => post("/notifications", data),

  /** PATCH /notifications/:id/read */
  markAsRead: (id) => patch(`/notifications/${id}`, { isRead: true }),

  /** PATCH /notifications/read-all?userId= — json-server ne supporte pas nativement,
   *  en dev on liste + patch en lot; en prod Express gère directement */
  markAllAsRead: async (userId) => {
    const notifs = await get("/notifications", { userId, isRead: false });
    await Promise.all(
      notifs.map((n) => patch(`/notifications/${n.id}`, { isRead: true })),
    );
  },

  /** DELETE /notifications/:id */
  deleteNotification: (id) => del(`/notifications/${id}`),

  /** DELETE /notifications?userId=&isRead=true — supprimer toutes les lues */
  deleteReadNotifications: async (userId) => {
    const notifs = await get("/notifications", { userId, isRead: true });
    await Promise.all(notifs.map((n) => del(`/notifications/${n.id}`)));
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. PENDING REQUESTS  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /pendingRequests  (admin) */
  getPendingRequests: (params) => get("/pendingRequests", params),

  /** GET  /pendingRequests/:id */
  getPendingRequestById: (id) => get(`/pendingRequests/${id}`),

  /** POST /pendingRequests — soumettre une demande (guide_application | business_verification) */
  submitPendingRequest: (data) => post("/pendingRequests", data),

  /** PATCH /pendingRequests/:id/approve  (admin) → side-effects côté serveur */
  approvePendingRequest: (id, note = "") =>
    patch(`/pendingRequests/${id}/approve`, { note }),

  /** PATCH /pendingRequests/:id/reject  (admin) */
  rejectPendingRequest: (id, reason = "") =>
    patch(`/pendingRequests/${id}/reject`, { reason }),

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. BUSINESSES  (5 endpoints)
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
  // 15. ADMIN  (5 endpoints)
  // ═══════════════════════════════════════════════════════════════════════════

  /** GET  /adminLogs */
  getAdminLogs: (params) => get("/adminLogs", params),

  /** GET  /adminLogs?targetId=&targetType= */
  getAdminLogsByTarget: (targetId, targetType) =>
    get("/adminLogs", { targetId, targetType }),

  /** POST /adminLogs  (interne — créé automatiquement côté serveur normalement) */
  createAdminLog: (data) => post("/adminLogs", data),

  /** GET  /admin/stats — tableau de bord */
  getAdminStats: () => get("/admin/stats"),

  /** GET  /admin/dashboard */
  getAdminDashboard: () => get("/admin/dashboard"),

  // ═══════════════════════════════════════════════════════════════════════════
  // 16. MISC / HOMEPAGE HELPERS  (conservés depuis v1)
  // ═══════════════════════════════════════════════════════════════════════════

  getTours: () => get("/places"),
  getTestimonials: () => get("/comments"),
  getNavLinks: () => get("/media"),
};
