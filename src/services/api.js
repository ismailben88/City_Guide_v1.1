// services/api.js
// Base URL — change to your json-server address if different
const BASE_URL = "http://localhost:3001";

async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
  return res.json();
}

export const api = {
  getTopSearchPlaces:    () => fetchData("topSearchPlaces"),
  getInterestCategories: () => fetchData("interestCategories"),
  getEvents:             () => fetchData("events"),
  getTopDestinations:    () => fetchData("topDestinations"),
  getGuides:             () => fetchData("guides"),
  getCities:             () => fetchData("cities"),
  getTours:              () => fetchData("tours"),
  getTestimonials:       () => fetchData("testimonials"),
  getNavLinks:           () => fetchData("navLinks"),
  getPlaces:             () => fetchData("places"),
};
