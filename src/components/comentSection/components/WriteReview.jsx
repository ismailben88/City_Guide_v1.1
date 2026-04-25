import { useState } from "react";
import Avatar from "./Avatar";
import StarPicker from "./StarPicker";
import Btn from "./Btn";
import { getFullName } from "../utils";
import { MAX_CHARS } from "../constants";

export default function WriteReview({ currentUser, onPublish, loading }) {
  const [text,    setText]    = useState("");
  const [rating,  setRating]  = useState(0);
  const [focused, setFocused] = useState(false);

  const isOverLimit = text.length > MAX_CHARS;
  const canSubmit   = text.trim().length > 0 && rating > 0 && !isOverLimit && !loading;
  const charPct     = Math.min((text.length / MAX_CHARS) * 100, 100);
  const charColor   = isOverLimit ? "#EF4444" : charPct > 80 ? "#F59E0B" : "#5b8523";

  const handleSubmit = () => {
    if (!canSubmit) return;
    onPublish(text.trim(), rating);
    setText(""); setRating(0); setFocused(false);
  };

  return (
    <div style={{
      background: "white",
      border: `1.5px solid ${focused ? "#5b852366" : "#E8DFD0"}`,
      borderRadius: "24px", padding: "22px 24px",
      boxShadow: focused
        ? "0 4px 20px rgba(91,133,35,0.10)"
        : "0 2px 8px rgba(0,0,0,0.04)",
      transition: "all 0.2s",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Identité de l'auteur */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <Avatar author={currentUser} size={42} />
        <div>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#3D2B1A" }}>
            {getFullName(currentUser)}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#9E8E7A" }}>
            Écrire un avis
          </p>
        </div>
      </div>

      {/* Zone de texte */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Partagez votre expérience avec la communauté…"
        rows={focused || text ? 4 : 2}
        style={{
          width: "100%", padding: "14px 16px",
          border: `1.5px solid ${isOverLimit ? "#EF4444" : focused ? "#5b8523" : "#E8DFD0"}`,
          borderRadius: "16px", fontSize: "13.5px", color: "#3D2B1A",
          resize: "none", outline: "none", lineHeight: 1.7,
          background: focused ? "white" : "#FAF7F2",
          boxSizing: "border-box", transition: "all 0.2s",
          fontFamily: "'Nunito', sans-serif",
          boxShadow: focused ? "0 0 0 3px rgba(91,133,35,0.09)" : "none",
        }}
      />

      {/* Pied : étoiles + compteur + bouton */}
      <div style={{
        display: "flex", alignItems: "flex-end",
        justifyContent: "space-between", marginTop: "14px",
        flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <StarPicker value={rating} onChange={setRating} />

          {/* Barre de progression des caractères */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "80px", height: "4px", background: "#E8DFD0",
              borderRadius: "999px", overflow: "hidden",
            }}>
              <div style={{
                width: `${charPct}%`, height: "100%",
                background: charColor, borderRadius: "999px",
                transition: "width 0.2s, background 0.2s",
              }} />
            </div>
            <span style={{
              fontSize: "11px", color: charColor,
              fontWeight: isOverLimit ? 700 : 400,
            }}>
              {isOverLimit
                ? `+${text.length - MAX_CHARS} dépassé`
                : `${MAX_CHARS - text.length} restants`}
            </span>
          </div>
        </div>

        <Btn onClick={handleSubmit} disabled={!canSubmit} loading={loading}>
          {loading ? "Publication…" : "Publier l'avis"}
        </Btn>
      </div>
    </div>
  );
}
