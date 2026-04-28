export const SPECIALTIES = [
  { id: 'history',   label: 'History & monuments',  icon: 'Landmark'     },
  { id: 'food',      label: 'Food & street eats',    icon: 'Utensils'     },
  { id: 'souks',     label: 'Souks & shopping',      icon: 'ShoppingBag'  },
  { id: 'art',       label: 'Art & artisanship',     icon: 'Palette'      },
  { id: 'photo',     label: 'Photography spots',     icon: 'Camera'       },
  { id: 'music',     label: 'Music & nightlife',     icon: 'Music'        },
  { id: 'spiritual', label: 'Spiritual sites',       icon: 'Moon'         },
  { id: 'hidden',    label: 'Hidden corners',        icon: 'Map'          },
];

export const CITIES = [
  { id: 'marrakech',    label: 'Marrakech',    region: 'Marrakech-Safi'               },
  { id: 'fes',          label: 'Fès',          region: 'Fès-Meknès'                   },
  { id: 'casablanca',   label: 'Casablanca',   region: 'Casablanca-Settat'            },
  { id: 'chefchaouen',  label: 'Chefchaouen',  region: 'Tanger-Tétouan-Al Hoceïma'   },
  { id: 'essaouira',    label: 'Essaouira',    region: 'Marrakech-Safi'               },
  { id: 'rabat',        label: 'Rabat',        region: 'Rabat-Salé-Kénitra'           },
];

export const LANGUAGES = [
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'fr', label: 'Français',  flag: '🇫🇷' },
  { code: 'ar', label: 'العربية',   flag: '🇲🇦' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
];

export const DAYS = [
  { id: 'mon', label: 'Monday'    },
  { id: 'tue', label: 'Tuesday'   },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday'  },
  { id: 'fri', label: 'Friday'    },
  { id: 'sat', label: 'Saturday'  },
  { id: 'sun', label: 'Sunday'    },
];

export const PROFICIENCY_LEVELS = [
  { id: 'native',           label: 'Native'         },
  { id: 'fluent',           label: 'Fluent'         },
  { id: 'conversational',   label: 'Conversational' },
];

export const BIZ_CATEGORIES = [
  'Restaurant/Café',
  'Riad/Stay',
  'Shop/Atelier',
  'Experience',
  'Wellness',
];

export const MOCK_GUIDE_PROFILE = {
  firstName: 'Tarik',
  email: 'tarik@cityguide.ma',
  username: 'tarik.guide',
  tagline: 'Uncover Marrakech\'s hidden gems with a local\'s eyes',
  bio: 'Born and raised in the medina of Marrakech, I\'ve spent 12 years showing visitors the authentic side of this magical city. From dawn spice-market runs to sunset rooftop sessions, every tour is a personal story.',
  avatarUrl: '',
  bannerUrl: '',
  specialties: ['history', 'food', 'hidden', 'souks'],
  spokenLanguages: [
    { code: 'ar', level: 'native'         },
    { code: 'fr', level: 'fluent'         },
    { code: 'en', level: 'fluent'         },
    { code: 'es', level: 'conversational' },
  ],
  cities: ['marrakech', 'essaouira'],
  pricePerHour: 350,
  averageRating: 4.9,
  isCurrentlyAvailable: true,
  verificationStatus: 'pending',
  schedule: [
    { day: 'mon', isOpen: true,  slots: [{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }] },
    { day: 'tue', isOpen: true,  slots: [{ start: '09:00', end: '18:00' }] },
    { day: 'wed', isOpen: true,  slots: [{ start: '09:00', end: '18:00' }] },
    { day: 'thu', isOpen: true,  slots: [{ start: '09:00', end: '18:00' }] },
    { day: 'fri', isOpen: true,  slots: [{ start: '09:00', end: '13:00' }] },
    { day: 'sat', isOpen: false, slots: [] },
    { day: 'sun', isOpen: false, slots: [] },
  ],
  unavailableDates: ['2026-05-01', '2026-05-15', '2026-06-20'],
};
