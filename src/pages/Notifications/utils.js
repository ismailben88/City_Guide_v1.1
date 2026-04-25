import { TYPE_META } from "./constants";

export const typeKey = (type) => TYPE_META[type]?.key ?? "sys";

export const formatRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Il y a ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
};

export const avatarInitials = (id = "") =>
  id.length >= 2 ? id.slice(0, 2).toUpperCase() : "??";
