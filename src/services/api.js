import axios from "axios";

const BASE_URL = "http://localhost:3001";

async function fetchData(endpoint) {
  try {
    const res = await axios.get(`${BASE_URL}/${endpoint}`);
    return res.data;
  } catch (error) {
    throw new Error(
      `Échec de la récupération de ${endpoint}: ${error.message || ""}`,
    );
  }
}

// Retourne la saison actuelle et ses mois correspondants
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return { name: "Printemps", months: [3, 4, 5] };
  if (month >= 6 && month <= 8) return { name: "Été", months: [6, 7, 8] };
  if (month >= 9 && month <= 11)
    return { name: "Automne", months: [9, 10, 11] };
  return { name: "Hiver", months: [12, 1, 2] };
}

export const api = {
  // 1. TOP DESTINATIONS (Cette Saison)
  // Trie les villes par nombre d'événements "upcoming" dans la saison courante
  getTopDestinations: async (limit = 6) => {
    const [cities, events] = await Promise.all([
      fetchData("cities"),
      fetchData("events"),
    ]);

    const season = getCurrentSeason();

    const eventCountByCity = {};
    events.forEach((event) => {
      if (event.status !== "upcoming") return;
      const eventMonth = new Date(event.dateRange?.from).getMonth() + 1;
      if (!season.months.includes(eventMonth)) return;
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

  // 2. TOP GUIDES
  // Trie par averageRating DESC, puis totalTours DESC en cas d'égalité
  getGuides: async (limit = 6) => {
    const profiles = await fetchData("guideProfiles");

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

  // 3. ATTRACTIONS CÉLÈBRES
  // isFeatured en premier, puis tri par reviewCount DESC
  // Badge "Populaire" sur les 3 premiers
  getTopSearchPlaces: async (limit = 9) => {
    const places = await fetchData("places");

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

  // 4. RECHERCHES TENDANCES
  // Compte les places par catégorie → top 5 catégories les plus représentées
  getTopSearches: async (limit = 5) => {
    const places = await fetchData("places");

    const countMap = {};
    const categoryDetails = {};

    places.forEach((place) => {
      if (!place.categoryId) return;
      countMap[place.categoryId] = (countMap[place.categoryId] || 0) + 1;
      if (!categoryDetails[place.categoryId] && place.category) {
        categoryDetails[place.categoryId] = place.category;
      }
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




  // ── Le reste (inchangé) ───────────────────────────────────────────────────

  getInterestCategories: () => fetchData("categories"),

  getEvents: async () => {
    const events = await fetchData("events");
    return events.filter((e) => e.isFeatured).slice(0, 4);
  },

  getCities: () => fetchData("cities"),

  getPlaces: async () => {
    const places = await fetchData("places");
    return places.map((place) => ({
      ...place,
      cityName: place.city?.name || "Inconnu",
      categoryName: place.category?.name || "Général",
      categoryIcon: place.category?.icon || "📍",
    }));
  },

  getPlaceById: async (id) => {
    const places = await fetchData("places");
    const place = places.find((p) => p.id === id);
    if (!place) return null;
    return {
      ...place,
      cityName: place.city?.name,
      categoryName: place.category?.name,
      categoryIcon: place.category?.icon,
    };
  },

  getGuideById: async (id) => {
    const profiles = await fetchData("guideProfiles");
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

  getCommentsByTarget: async (targetId, targetType) => {
    const comments = await fetchData("comments");
    return comments.filter(
      (c) =>
        c.targetId === targetId &&
        c.targetType === targetType &&
        !c.parentCommentId,
    );
  },

  getTours: () => fetchData("places"),
  getTestimonials: () => fetchData("comments"),
  getNavLinks: () => fetchData("media"),
};