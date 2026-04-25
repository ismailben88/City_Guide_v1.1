export const CATEGORIES = [
  { key: "all",  label: "Toutes",       icon: "🔔" },
  { key: "sys",  label: "Système",      icon: "⚙️" },
  { key: "book", label: "Réservations", icon: "📅" },
  { key: "msg",  label: "Messages",     icon: "💬" },
  { key: "rev",  label: "Avis",         icon: "⭐" },
];

export const TYPE_META = {
  SYSTEM_BROADCAST: {
    key: "sys",
    label: "Système",
    icon: "⚙️",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
  },
  BOOKING: {
    key: "book",
    label: "Réservation",
    icon: "📅",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
    ring: "ring-orange-200",
  },
  MESSAGE: {
    key: "msg",
    label: "Message",
    icon: "💬",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-500",
    ring: "ring-sky-200",
  },
  REVIEW: {
    key: "rev",
    label: "Avis",
    icon: "⭐",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
    ring: "ring-violet-200",
  },
};

export const FALLBACK_META = TYPE_META.SYSTEM_BROADCAST;
