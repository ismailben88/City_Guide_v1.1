import { AVATAR_PALETTE } from "./constants";

function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

export function getFullName(author) {
  if (!author) return "Utilisateur anonyme";
  const parts = [author.firstName, author.lastName].filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (author.name) return author.name;
  return "Utilisateur anonyme";
}

export function getInitialsFromAuthor(author) {
  if (!author) return "?";
  if (author.firstName || author.lastName)
    return getInitials(author.firstName || "", author.lastName || "");
  if (author.name) {
    const words = author.name.trim().split(/\s+/);
    return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || "?";
  }
  return "?";
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}
