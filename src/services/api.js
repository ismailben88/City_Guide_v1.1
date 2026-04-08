// services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:3001";

async function fetchData(endpoint) {
  try {
    const res = await axios.get(`${BASE_URL}/${endpoint}`);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${endpoint}: ${error.message || ""}`);
  }
}

// Merge guide profiles with user data
function mergeGuideWithUser(profiles, users, cities) {
  const userMap = new Map(users.map(u => [u.id, u]));
  const cityMap = new Map(cities.map(c => [c.id, c.name]));
  return profiles.map(profile => {
    const user = userMap.get(profile.userId);
    if (!user) return null;
    // Get city names from cityIds
    const cityNames = profile.cityIds?.map(id => cityMap.get(id)).filter(Boolean) || [];
    return {
      ...profile,
      user,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      cityNames,
    };
  }).filter(Boolean);
}

// Merge places with city and category data
function mergePlaceWithData(places, cities, categories) {
  const cityMap = new Map(cities.map(c => [c.id, c]));
  const catMap = new Map(categories.map(c => [c.id, c]));
  return places.map(place => {
    const city = cityMap.get(place.cityId);
    const category = catMap.get(place.categoryId);
    return {
      ...place,
      cityName: city?.name || "Unknown",
      category: category?.name || "General",
      categoryIcon: category?.icon || "FaMapMarker",
    };
  });
}

export const api = {
  getTopSearchPlaces: async () => {
    const [places, cities, categories] = await Promise.all([
      fetchData("places"),
      fetchData("cities"),
      fetchData("categories"),
    ]);
    const merged = mergePlaceWithData(places, cities, categories);
    return merged.filter(p => p.isFeatured).slice(0, 6);
  },

  getInterestCategories: () => fetchData("categories"),

  getEvents: async () => {
    const events = await fetchData("events");
    return events.filter(e => e.isFeatured).slice(0, 4);
  },

  getTopDestinations: async () => {
    const cities = await fetchData("cities");
    return cities.slice(0, 6).map(city => ({
      ...city,
      rating: (4.5 + Math.random() * 0.5).toFixed(1),
    }));
  },

  getGuides: async () => {
    const [profiles, users, cities] = await Promise.all([
      fetchData("guideProfiles"),
      fetchData("users"),
      fetchData("cities"),
    ]);
    return mergeGuideWithUser(profiles.filter(p => p.verificationStatus === "verified"), users, cities);
  },

  getCities: () => fetchData("cities"),
  getPlaces: async () => {
    const [places, cities, categories] = await Promise.all([
      fetchData("places"),
      fetchData("cities"),
      fetchData("categories"),
    ]);
    return mergePlaceWithData(places, cities, categories);
  },
  getTours: () => fetchData("places"),
  getTestimonials: () => fetchData("comments"),
  getNavLinks: () => fetchData("media"),

  // New helpers for detail pages
  getPlaceById: async (id) => {
    const [places, cities, categories] = await Promise.all([
      fetchData("places"),
      fetchData("cities"),
      fetchData("categories"),
    ]);
    const place = places.find(p => p.id === id);
    if (!place) return null;
    const city = cities.find(c => c.id === place.cityId);
    const category = categories.find(c => c.id === place.categoryId);
    return { ...place, cityName: city?.name, category: category?.name };
  },

  getGuideById: async (id) => {
    const [profiles, users, cities] = await Promise.all([
      fetchData("guideProfiles"),
      fetchData("users"),
      fetchData("cities"),
    ]);
    const profile = profiles.find(p => p.id === id);
    if (!profile) return null;
    const user = users.find(u => u.id === profile.userId);
    const cityMap = new Map(cities.map(c => [c.id, c.name]));
    const cityNames = profile.cityIds?.map(id => cityMap.get(id)).filter(Boolean) || [];
    return { ...profile, user, cityNames };
  },

  getCommentsByTarget: async (targetId, targetType) => {
    const comments = await fetchData("comments");
    return comments.filter(c => c.targetId === targetId && c.targetType === targetType && !c.parentCommentId);
  },
};
