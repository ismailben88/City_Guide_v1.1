import { useState } from "react";
import { RATING_LABELS } from "../constants";

export default function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div role="group" aria-label="Sélectionner une note"
      style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none", border: "none", padding: "2px",
            cursor: "pointer", lineHeight: 0,
            transform: hover === n ? "scale(1.28)" : "scale(1)",
            transition: "transform 0.12s",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24"
            fill={active >= n ? "#F59E0B" : "none"}
            stroke={active >= n ? "#F59E0B" : "#D1C4A8"} strokeWidth="2"
            style={{ transition: "all 0.15s" }}>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span style={{ marginLeft: "8px", fontSize: "12px", fontWeight: 700, color: "#B8860B" }}>
          {RATING_LABELS[value]}
        </span>
      )}
    </div>
  );
}
