const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Constants for generation
const COUNTS = {
  users: 50, guides: 20, cities: 20, categories: 20,
  places: 60, events: 15, pendingRequests: 20, reports: 5, adminLogs: 30
};

// Moroccan Cities Data
const moroccanCities = [
  "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", 
  "Oujda", "Kenitra", "Tetouan", "Safi", "Mohammedia", "Khouribga", "Beni Mellal", 
  "El Jadida", "Taza", "Nador", "Settat", "Ksar El Kebir", "Larache"
];

const db = {
  users: [], cities: [], categories: [], guideProfiles: [], places: [],
  events: [], scores: [], comments: [], media: [], pendingRequests: [],
  reports: [], adminLogs: [], notifications: []
};

// 1. Generate Categories
for (let i = 1; i <= COUNTS.categories; i++) {
  db.categories.push({
    id: `cat${i}`,
    name: faker.commerce.department(),
    slug: faker.helpers.slugify(faker.commerce.department()).toLowerCase(),
    icon: faker.internet.emoji(),
    parentId: null,
    status: "active"
  });
}

// 2. Generate Cities
for (let i = 0; i < COUNTS.cities; i++) {
  db.cities.push({
    id: `c${i + 1}`,
    name: moroccanCities[i],
    slug: moroccanCities[i].toLowerCase().replace(/\s+/g, '-'),
    region: faker.location.state(),
    description: faker.lorem.paragraph(),
    coverImage: `https://picsum.photos/seed/city${i}/800/500`,
    population: faker.number.int({ min: 100000, max: 4000000 }),
    isActive: true,
    location: { type: "Point", coordinates: [faker.location.longitude(), faker.location.latitude()] },
    createdAt: faker.date.past().toISOString()
  });
}

// 3. Generate Users & Admin
const adminUser = {
  id: "u_admin", firstName: "Ismail", lastName: "Benjalloul", email: "admin@cityguide.ma",
  passwordHash: "admin123", role: "admin", isGuide: false, isVerified: true, isActive: true,
  avatarUrl: "https://i.pravatar.cc/150?img=11", city: "Casablanca", createdAt: new Date().toISOString()
};
db.users.push(adminUser);

for (let i = 1; i < COUNTS.users; i++) {
  const isGuide = i <= COUNTS.guides;
  db.users.push({
    id: `u${i}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    role: isGuide ? "guide" : "user",
    isGuide: isGuide,
    isVerified: faker.datatype.boolean(0.8),
    isActive: true,
    avatarUrl: `https://i.pravatar.cc/150?u=${i}`,
    city: faker.helpers.arrayElement(moroccanCities),
    createdAt: faker.date.past().toISOString()
  });
}

// 4. Generate Guide Profiles
const guideUsers = db.users.filter(u => u.role === "guide");
guideUsers.forEach((user, index) => {
  const guideCities = faker.helpers.arrayElements(db.cities, { min: 1, max: 3 });
  db.guideProfiles.push({
    id: `gp${index + 1}`,
    userId: user.id,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, avatarUrl: user.avatarUrl, role: "guide" },
    bio: faker.lorem.sentences(2),
    specialties: faker.helpers.arrayElements(["Architecture", "Food", "History", "Nightlife", "Shopping"], 3),
    spokenLanguages: faker.helpers.arrayElements(["Arabic", "French", "English", "Spanish"], 2),
    cityIds: guideCities.map(c => c.id),
    cities: guideCities.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
    bannerImage: `https://picsum.photos/seed/guide${index}/1200/400`,
    pricePerHour: faker.number.int({ min: 50, max: 300 }),
    totalTours: faker.number.int({ min: 0, max: 500 }),
    averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 0, max: 200 }),
    verificationStatus: "verified",
    createdAt: user.createdAt
  });
});

// 5. Generate Places
for (let i = 1; i <= COUNTS.places; i++) {
  const city = faker.helpers.arrayElement(db.cities);
  const category = faker.helpers.arrayElement(db.categories);
  const guideOwner = faker.datatype.boolean() ? faker.helpers.arrayElement(guideUsers) : null;
  
  db.places.push({
    id: `p${i}`,
    name: faker.company.name() + " " + faker.helpers.arrayElement(["Museum", "Restaurant", "Park", "Monument"]),
    slug: `place-${i}`,
    description: faker.lorem.paragraph(),
    isBusiness: !!guideOwner,
    owner: guideOwner ? { id: guideOwner.id, firstName: guideOwner.firstName, lastName: guideOwner.lastName, avatarUrl: guideOwner.avatarUrl, role: "guide" } : null,
    categoryId: category.id,
    category: { id: category.id, name: category.name, slug: category.slug, icon: category.icon },
    cityId: city.id,
    city: { id: city.id, name: city.name, slug: city.slug, region: city.region },
    address: faker.location.streetAddress(),
    coverImage: `https://picsum.photos/seed/place${i}/800/500`,
    location: { type: "Point", coordinates: [faker.location.longitude(), faker.location.latitude()] },
    isVerifiedBusiness: faker.datatype.boolean(),
    averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    reviewCount: faker.number.int({ min: 10, max: 1000 }),
    status: "active",
    createdAt: faker.date.past().toISOString()
  });
}

// 6. Generate Events
for (let i = 1; i <= COUNTS.events; i++) {
  const city = faker.helpers.arrayElement(db.cities);
  db.events.push({
    id: `e${i}`,
    title: faker.lorem.words(3) + " Festival",
    description: faker.lorem.paragraph(),
    cityId: city.id,
    city: { id: city.id, name: city.name, slug: city.slug },
    organizer: faker.company.name(),
    ticketPrice: faker.number.int({ min: 0, max: 500 }),
    coverImage: `https://picsum.photos/seed/event${i}/800/500`,
    location: { type: "Point", coordinates: [faker.location.longitude(), faker.location.latitude()] },
    status: faker.helpers.arrayElement(["upcoming", "planned", "completed"]),
    createdAt: faker.date.past().toISOString()
  });
}

// 7. Generate Comments, Scores & Media for Places and GuideProfiles
let commentIdCounter = 1;
let scoreIdCounter = 1;
let mediaIdCounter = 1;

const generateEngagement = (targetType, target) => {
  // Scores
  const numScores = faker.number.int({ min: 5, max: 15 });
  for(let j=0; j<numScores; j++) {
    db.scores.push({
      id: `s${scoreIdCounter++}`, targetId: target.id, targetType: targetType,
      score: faker.number.int({ min: 1, max: 5 }), authorId: faker.helpers.arrayElement(db.users).id,
      createdAt: faker.date.recent().toISOString()
    });
  }

  // Media
  const numMedia = faker.number.int({ min: 2, max: 5 });
  for(let j=0; j<numMedia; j++) {
    db.media.push({
      id: `m${mediaIdCounter++}`, url: `https://picsum.photos/seed/media${mediaIdCounter}/800/500`,
      type: "image", parentType: targetType, parentId: target.id,
      status: "approved", createdAt: faker.date.past().toISOString()
    });
  }

  // Comments
  const numComments = faker.number.int({ min: 0, max: 6 });
  const parentComments = [];
  for(let j=0; j<numComments; j++) {
    const author = faker.helpers.arrayElement(db.users);
    const isReply = parentComments.length > 0 && faker.datatype.boolean(0.3);
    const parentId = isReply ? faker.helpers.arrayElement(parentComments) : null;
    
    const comment = {
      id: `com${commentIdCounter++}`, targetId: target.id, targetType: targetType,
      authorId: author.id, author: { id: author.id, firstName: author.firstName, lastName: author.lastName, avatarUrl: author.avatarUrl },
      content: faker.lorem.sentences(2), parentCommentId: parentId,
      likes: faker.number.int({ min: 0, max: 50 }), status: "active",
      createdAt: faker.date.recent().toISOString()
    };
    db.comments.push(comment);
    if (!isReply) parentComments.push(comment.id);
  }
};

db.places.forEach(p => generateEngagement("Place", p));
db.guideProfiles.forEach(gp => generateEngagement("GuideProfile", gp));

// 8. Generate Reports
for (let i = 1; i <= COUNTS.reports; i++) {
  db.reports.push({
    id: `rep${i}`,
    targetId: faker.helpers.arrayElement(db.comments).id,
    targetType: "Comment",
    reporterId: faker.helpers.arrayElement(db.users).id,
    reason: faker.helpers.arrayElement(["inappropriate_content", "spam", "harassment"]),
    status: faker.helpers.arrayElement(["open", "resolved"]),
    createdAt: faker.date.recent().toISOString()
  });
}

// 9. Generate Admin Logs
for (let i = 1; i <= COUNTS.adminLogs; i++) {
  db.adminLogs.push({
    id: `log${i}`,
    adminId: "u_admin",
    action: faker.helpers.arrayElement(["approve_guide", "delete_comment", "verify_place"]),
    targetType: faker.helpers.arrayElement(["PendingRequest", "Comment", "Place"]),
    targetId: `target_${faker.string.alphanumeric(5)}`,
    details: faker.lorem.sentence(),
    createdAt: faker.date.recent().toISOString()
  });
}

// 10. Generate Pending Requests
for (let i = 1; i <= COUNTS.pendingRequests; i++) {
  const user = faker.helpers.arrayElement(db.users);
  db.pendingRequests.push({
    id: `req${i}`,
    requestType: "guide_application",
    userId: user.id,
    user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatarUrl: user.avatarUrl },
    status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
    createdAt: faker.date.recent().toISOString()
  });
}
// --- NEW NOTIFICATION LOGIC ---
const notifications = [];

// 1. System Broadcast from Admin to all Guides
const allGuides = db.users.filter(u => u.role === 'guide');
allGuides.forEach(guide => {
  notifications.push({
    id: `notif_sys_${guide.id}`,
    recipientId: guide.id,
    senderId: "u_admin",
    type: "SYSTEM_BROADCAST",
    title: "New Policy for 2026",
    message: "Important update regarding guide certifications in Morocco.",
    targetType: "System",
    targetId: null,
    isRead: faker.datatype.boolean(0.3),
    createdAt: faker.date.recent().toISOString()
  });
});

// 2. Social Notifications (New comments on Places)
db.comments.filter(c => c.targetType === 'Place').forEach(comment => {
  const targetPlace = db.places.find(p => p.id === comment.targetId);
  
  // If the place has an owner, notify them
  if (targetPlace && targetPlace.owner) {
    notifications.push({
      id: `notif_com_${comment.id}`,
      recipientId: targetPlace.owner.id, // The guide who owns the place
      senderId: comment.authorId, // The person who commented
      type: "COMMENT_ALERT",
      title: "New Review",
      message: `${comment.author.firstName} left a review on ${targetPlace.name}`,
      targetType: "Place",
      targetId: targetPlace.id,
      isRead: false,
      createdAt: comment.createdAt
    });
  }
});

db.notifications = notifications;
// ------------------------------
// Save to db.json
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log("✅ Successfully generated massive db.json for CityGuide!");