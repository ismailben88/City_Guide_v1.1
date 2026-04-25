import { useState } from "react";

export default function MenuBtn({ icon, onClick, danger = false, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      role="menuitem" onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        width: "100%", padding: "10px 16px",
        background: hov ? (danger ? "#FEF2F2" : "#F3EDE2") : "none",
        border: "none", cursor: "pointer",
        color: danger ? "#EF4444" : "#3D2B1A",
        fontSize: "13px", fontWeight: 500,
        transition: "background 0.13s", textAlign: "left",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <span style={{ fontSize: "15px" }}>{icon}</span>
      {children}
    </button>
  );
}
