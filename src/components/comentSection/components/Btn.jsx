import { useState } from "react";

export default function Btn({ onClick, disabled, loading, ghost, danger, accent, small, children, style: extraStyle = {} }) {
  const [hov, setHov] = useState(false);

  let bg = "#d57a2a", color = "white", border = "none";
  let shadow = hov && !disabled ? "0 4px 14px rgba(213,122,42,0.28)" : "none";

  if (ghost)  { bg = hov ? "#F3EDE2" : "white"; color = "#7A6A58"; border = "1px solid #E8DFD0"; shadow = "none"; }
  if (danger) { bg = hov ? "#DC2626" : "#EF4444"; color = "white"; border = "none"; shadow = "none"; }
  if (accent) { bg = hov ? "#4a6e1a" : "#5b8523"; shadow = hov ? "0 4px 14px rgba(91,133,35,0.28)" : "none"; }
  if (disabled) { bg = ghost ? "white" : "#E8DFD0"; color = ghost ? "#C0B5AA" : "#B0A090"; shadow = "none"; }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: small ? "6px 14px" : "10px 28px",
        borderRadius: "24px", border,
        background: bg, color,
        fontSize: small ? "12px" : "13px", fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.18s",
        boxShadow: shadow,
        display: "inline-flex", alignItems: "center", gap: "7px",
        fontFamily: "'Nunito', sans-serif",
        transform: hov && !disabled ? "translateY(-1px)" : "none",
        ...extraStyle,
      }}
    >
      {loading && (
        <span style={{
          width: 13, height: 13,
          border: "2px solid rgba(255,255,255,0.35)",
          borderTopColor: "white", borderRadius: "50%",
          display: "inline-block",
          animation: "cs_spin 0.7s linear infinite",
        }} />
      )}
      {children}
    </button>
  );
}
