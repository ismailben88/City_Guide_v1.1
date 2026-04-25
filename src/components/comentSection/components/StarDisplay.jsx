import { RATING_LABELS } from "../constants";

export default function StarDisplay({ rating }) {
  if (!rating) return null;
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "2px", marginTop: "3px" }}
      aria-label={`${rating} étoile${rating > 1 ? "s" : ""} — ${RATING_LABELS[rating]}`}
    >
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width="11" height="11" viewBox="0 0 24 24"
          fill={n <= rating ? "#F59E0B" : "none"}
          stroke={n <= rating ? "#F59E0B" : "#D1C4A8"} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      <span style={{ marginLeft: "5px", fontSize: "10px", fontWeight: 700, color: "#B8860B" }}>
        {RATING_LABELS[rating]}
      </span>
    </div>
  );
}
