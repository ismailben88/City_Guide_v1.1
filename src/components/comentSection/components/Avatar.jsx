import { useState } from "react";
import { getAvatarColor, getFullName, getInitialsFromAuthor } from "../utils";

export default function Avatar({ author, size = 42 }) {
  const [imgErr, setImgErr] = useState(false);

  const fullName  = getFullName(author);
  const initials  = getInitialsFromAuthor(author);
  const color     = getAvatarColor(fullName);
  const fontSize  = size < 36 ? 11 : size < 44 ? 13 : 15;

  const common = {
    width: size, height: size, minWidth: size,
    borderRadius: "50%", flexShrink: 0,
    boxShadow: `0 0 0 2.5px white, 0 0 0 4.5px ${color.ring}55`,
  };

  if (author?.avatarUrl && !imgErr) {
    return (
      <img
        src={author.avatarUrl}
        alt={`Photo de ${fullName}`}
        onError={() => setImgErr(true)}
        style={{ ...common, objectFit: "cover", display: "block" }}
      />
    );
  }

  return (
    <div
      title={fullName}
      aria-label={`Avatar de ${fullName}`}
      style={{
        ...common,
        background: `linear-gradient(135deg, ${color.bg}, ${color.ring}33)`,
        color: color.text,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize, fontWeight: 800, letterSpacing: "0.05em",
        userSelect: "none", fontFamily: "'Nunito', sans-serif",
      }}
    >
      {initials || "?"}
    </div>
  );
}
