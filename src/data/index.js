// ═══════════════════════════════════════════════
//  data/index.js  — All static / mock data
// ═══════════════════════════════════════════════

export const topSearchPlaces = [
  {
    id: "jardin-majorelle",
    title: "Jardin Majorelle",
    subtitle: "Marrakech",
    img: "https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=500",
    rating: 5,
    description:
      "A botanical garden designed by French painter Jacques Majorelle in the 1920s, later owned by Yves Saint Laurent. A tranquil oasis with vivid cobalt-blue buildings set in a lush botanical garden.",
    contact: {
      email: "info@jardinmajorelle.com",
      instagram: "instagram.com/jardinmajorelle",
      twitter: "twitter.com/JardinMajorelle",
      phone: "+212 5 24 30 18 52",
    },
  },
  {
    id: "menara-gardens",
    title: "Menara Gardens Pavilion",
    subtitle: "Marrakech",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
    rating: 4,
    description:
      "La Mamounia Courtyard is an iconic oasis in the heart of Marrakech, blending Moroccan heritage with timeless luxury. Surrounded by lush gardens, traditional architecture, and elegant lighting, the courtyard offers a calm and refined atmosphere ideal for relaxation and fine dining.",
    contact: {
      email: "contact@lamamounia.com",
      instagram: "instagram.com/lamamounia",
      twitter: "twitter.com/lamamounia",
      phone: "+212 5 24 38 86 60",
    },
  },
  {
    id: "hassan-mosque",
    title: "Hassan II Mosque",
    subtitle: "Casablanca",
    img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500",
    rating: 5,
    description:
      "The Hassan II Mosque is the largest mosque in Africa and the 7th largest in the world. Situated on a promontory looking out to sea, its minaret is the world's second tallest at 210 metres.",
    contact: {
      email: "info@mosquee-hassan2.ma",
      instagram: "instagram.com/mosqueehassan2",
      twitter: "twitter.com/MosqueeHassan2",
      phone: "+212 5 22 48 28 86",
    },
  },
];

export const interestCategories = [
  { id: "outdoor",  title: "Outdoor",  img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" },
  { id: "food",     title: "Food",     img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
  { id: "culture",  title: "Culture",  img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400" },
  { id: "shopping", title: "Shopping", img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400" },
];

export const events = [
  {
    id: "gnaoua",
    title: "Gnaoua World Music Festival",
    subtitle: "Essaouira, August 16, 2026",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
  },
  {
    id: "national-arts",
    title: "National Festival of Popular Arts",
    subtitle: "Marrakech, Jun 16, 2026",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400",
  },
  {
    id: "fes-music",
    title: "Fes Festival of World Sacred Music",
    subtitle: "Fes, May 16, 2026",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
  },
];

export const topDestinations = [
  { id: "ourika",      title: "Ourika Valley Landscapes", img: "https://images.unsplash.com/photo-1531219572328-a0171b4448a3?w=400" },
  { id: "oukaimeden",  title: "Oukaimeden Ski Resort",    img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400" },
  { id: "bin-ouidane", title: "Bin El Ouidane Reservoir", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400" },
];

export const guides = [
  {
    id: "tarik-amrani",
    name: "Tarik Amrani",
    city: "Marrakech",
    rating: 5,
    score: 80,
    verified: true,
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    bannerImg: "https://images.unsplash.com/photo-1526439158-e4c47dfd5394?w=1200",
    languages: ["Arabic", "English", "French", "Spanish", "German"],
    specialities: ["Cultural & Historical", "Local & Authentic Experiences", "Nature & Adventure"],
    typeOfGuide: ["Cultural", "Historical", "Adventure", "Gastronomy"],
    description:
      '"Born and raised in the heart of the Marrakech Medina, I have spent over 15 years uncovering the hidden stories of our Red City. My mission is to take you beyond the tourist maps to discover the secret gardens, master artisans, and authentic flavors that define Moroccan soul. Whether you want a historical deep-dive or a mountain adventure, I\'m here to curate your perfect journey."',
    contact: {
      email: "tarik.tours@marrakech.ma",
      instagram: "@Tarik_Marrakech_Guide",
      twitter: "@TarikAmraniTours",
      phone: "+212 657-802330",
    },
    availability: { days: "Monday → Saturday", hours: "8:30 → 6:30" },
  },
  {
    id: "meryem-idrissi",
    name: "Meryem El Idrissi",
    city: "Marrakech",
    rating: 5,
    score: 62,
    verified: true,
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    bannerImg: "https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=1200",
    languages: ["Arabic", "English", "French"],
    specialities: ["Gastronomy", "Arts & Crafts", "Cultural Tours"],
    typeOfGuide: ["Cultural", "Gastronomy"],
    description:
      '"A passionate food and culture guide based in Marrakech. I love sharing the authentic flavors and stories behind every dish and alley in the medina."',
    contact: { email: "meryem@cityguide.ma", instagram: "@Meryem_Guide", twitter: "@MeryemTours", phone: "+212 661-234567" },
    availability: { days: "Monday → Friday", hours: "9:00 → 5:00" },
  },
  {
    id: "ayoub-ait-moussa",
    name: "Ayoub Ait Moussa",
    city: "Agadir",
    rating: 5,
    score: 56,
    verified: true,
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    bannerImg: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
    languages: ["Arabic", "English", "French", "Spanish"],
    specialities: ["Nature & Adventure", "Beach & Coastal", "Hiking"],
    typeOfGuide: ["Adventure", "Nature"],
    description: '"Expert in southern Morocco\'s coast and Atlas mountains. From surf to summit, I\'ll show you the best Agadir has to offer."',
    contact: { email: "ayoub@guides.ma", instagram: "@Ayoub_Agadir", twitter: "@AyoubTours", phone: "+212 672-345678" },
    availability: { days: "Tuesday → Sunday", hours: "7:00 → 6:00" },
  },
  {
    id: "samir-alaoui",
    name: "Samir Alaoui",
    city: "Tangier",
    rating: 5,
    score: 56,
    verified: false,
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    bannerImg: "https://images.unsplash.com/photo-1526439158-e4c47dfd5394?w=1200",
    languages: ["Arabic", "English", "French", "Spanish"],
    specialities: ["Historical", "Cultural", "City Tours"],
    typeOfGuide: ["Historical", "Cultural"],
    description: '"Tangier is a city like no other — two continents, one city. Let me take you through its layered history."',
    contact: { email: "samir@tangier.ma", instagram: "@Samir_Tangier", twitter: "@SamirAlaoui", phone: "+212 639-456789" },
    availability: { days: "Monday → Saturday", hours: "8:00 → 5:30" },
  },
  {
    id: "asil-motakil",
    name: "Asil Motakil",
    city: "Fes",
    rating: 5,
    score: 50,
    verified: true,
    img: "https://randomuser.me/api/portraits/women/28.jpg",
    bannerImg: "https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=1200",
    languages: ["Arabic", "French", "English"],
    specialities: ["Artisan Workshops", "Historical Medina", "Photography"],
    typeOfGuide: ["Cultural", "Historical"],
    description: '"Fes el Bali is the soul of Morocco. I offer immersive walks through the world\'s largest car-free urban area."',
    contact: { email: "asil@fesguide.ma", instagram: "@Asil_Fes", twitter: "@AsilTours", phone: "+212 655-567890" },
    availability: { days: "Monday → Friday", hours: "8:30 → 5:00" },
  },
  {
    id: "mohcine-bahi",
    name: "Mohcine Bahi",
    city: "Marrakech",
    rating: 5,
    score: 48,
    verified: false,
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    bannerImg: "https://images.unsplash.com/photo-1526439158-e4c47dfd5394?w=1200",
    languages: ["Arabic", "French", "English"],
    specialities: ["Street Food", "Night Market", "Local Life"],
    typeOfGuide: ["Gastronomy", "Local"],
    description: '"Food is the best way to understand a culture. Join me on a delicious journey through Marrakech\'s souks and food stalls."',
    contact: { email: "mohcine@mrk.ma", instagram: "@Mohcine_Guide", twitter: "@MohcineTours", phone: "+212 662-678901" },
    availability: { days: "Wednesday → Monday", hours: "10:00 → 7:00" },
  },
  {
    id: "mehdi-tafokt",
    name: "Mehdi Tafokt",
    city: "Marrakech",
    rating: 5,
    score: 45,
    verified: true,
    img: "https://randomuser.me/api/portraits/men/60.jpg",
    bannerImg: "https://images.unsplash.com/photo-1539020140153-e479b8e201e7?w=1200",
    languages: ["Arabic", "Tamazight", "French", "English"],
    specialities: ["Berber Culture", "Mountain Treks", "Desert Expeditions"],
    typeOfGuide: ["Adventure", "Cultural"],
    description: '"As a Berber from the Atlas, I bridge the ancient and modern Morocco. Let me show you the side tourists rarely see."',
    contact: { email: "mehdi@atlas.ma", instagram: "@Mehdi_Atlas", twitter: "@MehdiTafokt", phone: "+212 671-789012" },
    availability: { days: "Monday → Sunday", hours: "6:00 → 8:00" },
  },
  {
    id: "karim-alaa",
    name: "Karim Alaa",
    city: "Marrakech",
    rating: 5,
    score: 42,
    verified: false,
    img: "https://randomuser.me/api/portraits/men/70.jpg",
    bannerImg: "https://images.unsplash.com/photo-1526439158-e4c47dfd5394?w=1200",
    languages: ["Arabic", "French", "English", "Italian"],
    specialities: ["Architecture", "Photography Tours", "Riads"],
    typeOfGuide: ["Cultural", "Historical"],
    description: '"Marrakech is a canvas. Every building, every colour tells a story. Join my photography and architecture tour."',
    contact: { email: "karim@photo.ma", instagram: "@Karim_Photo", twitter: "@KarimAlaa", phone: "+212 660-890123" },
    availability: { days: "Tuesday → Sunday", hours: "8:00 → 6:00" },
  },
];

export const places = [
  { id: "al-fassia",       title: "Al Fassia Kitchen",         img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300", rating: 4 },
  { id: "la-mamounia",     title: "La Mamounia Courtyard",     img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300", rating: 4 },
  { id: "nomad",           title: "Nomad Marrakech",           img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300", rating: 4 },
  { id: "le-jardin",       title: "Le Jardin des Arts",        img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300", rating: 4 },
  { id: "riad-be",         title: "Riad Be Marrakech",         img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300", rating: 4 },
  { id: "palais-namaskar", title: "Palais Namaskar Lounge",    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300", rating: 4 },
  { id: "dar-yacout",      title: "Dar Yacout Dining",         img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300", rating: 4 },
  { id: "zaalouk",         title: "Zaalouk Bistro & Grill",   img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300", rating: 3 },
  { id: "el-fenn",         title: "El Fenn Boutique Hotel",    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300", rating: 4 },
  { id: "sahbi-sahbi",     title: "Sahbi Sahbi Festive Hall",  img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300", rating: 4 },
  { id: "royal-mansour",   title: "Royal Mansour Tea Lounge",  img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300", rating: 4 },
  { id: "selman",          title: "Selman Marrakech Grand Hall",img:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300", rating: 4 },
  { id: "riad-jardin",     title: "Riad Jardin Secret",        img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=300", rating: 3 },
];

export const sampleComments = [
  {
    id: 1,
    user: "Manal Semlali",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4,
    text: "An absolutely magical place. The ambiance is calm, elegant, and perfect for unwinding. The service was excellent and the setting is simply breathtaking.",
    likes: 81,
    dislikes: 3,
  },
  {
    id: 2,
    user: "Mohammad12",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    rating: 3,
    text: "A must-visit spot in Marrakech. The courtyard is beautiful, especially in the evening. Prices are a bit high, but the experience is worth it.",
    likes: 21,
    dislikes: 3,
  },
  {
    id: 3,
    user: "Kathelina Rose",
    img: "https://randomuser.me/api/portraits/women/30.jpg",
    rating: 3,
    text: "Lovely place with stunning decor. It can get a bit crowded at peak hours, but the atmosphere remains charming.",
    likes: 9,
    dislikes: 12,
  },
];

export const guideComments = [
  {
    id: 1,
    user: "Manal Semlali",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    rating: 4,
    text: "Tarik made our trip! His local knowledge is incredible, especially the private tea session with a master weaver. Professional, kind, and highly recommended! ✓",
    likes: 81,
    dislikes: 3,
  },
  {
    id: 2,
    user: "Mohammad12",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    rating: 4,
    text: "Fantastic tour of the souks. I discovered hidden spots I'd never seen before and got the best prices on authentic spices. A true Marrakech insider.",
    likes: 21,
    dislikes: 3,
  },
  {
    id: 3,
    user: "Kathelina Rose",
    img: "https://randomuser.me/api/portraits/women/30.jpg",
    rating: 3,
    text: "The history was fascinating and Tarik is very charming, though the walking pace was a bit fast for our group. Great for seeing the main sights quickly.",
    likes: 9,
    dislikes: 12,
  },
];

export const notifications = [
  {
    id: 1,
    icon: "⭐",
    text: "You received a new 5-star review on your Casablanca Medina Walking Tour.",
    date: "Jan 5, 2025",
    time: "9:41 AM",
    category: "Reviews & Ratings",
  },
  {
    id: 2,
    icon: "✅",
    text: "Your business listing has been updated successfully.",
    date: "Jan 26, 2025",
    time: "10:41 AM",
    category: "Account Notifications",
  },
  {
    id: 3,
    icon: "✅",
    text: 'Explorer Daniel L. bookmarked your business "Logement entier : appartement - Marrakech".',
    date: "Feb 15, 2025",
    time: "06:07 PM",
    category: "Platform Activity",
  },
  {
    id: 4,
    icon: "👁️",
    text: "Your profile appeared in 25 search results today.",
    date: "Feb 18, 2025",
    time: "7:41 AM",
    category: "Profile Updates",
  },
  {
    id: 5,
    icon: "👤",
    text: "Explorer Laura Thompson shared your tour with other travelers.",
    date: "Mar 15, 2025",
    time: "4:31 PM",
    category: "Platform Activity",
  },
];

export const notificationCategories = [
  "All",
  "Account Notifications",
  "Reviews & Ratings",
  "Profile Updates",
  "Platform Activity",
  "System Alerts",
  "Suggestions",
];

export const guideFilterOptions = ["All", "Rating", "City", "Language spoken", "Verified guides", "Speciality", "Gender"];

export const navLinks = ["Home", "Guide", "About us", "Contact us"];
