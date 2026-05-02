import { useState } from "react";
import { Send } from "lucide-react";
import Avatar from "./Avatar";
import StarPicker from "./StarPicker";
import { getFullName } from "../utils";
import { MAX_CHARS } from "../constants";

export default function WriteReview({ currentUser, onPublish, loading }) {
  const [text,    setText]    = useState("");
  const [rating,  setRating]  = useState(0);
  const [focused, setFocused] = useState(false);

  const overLimit  = text.length > MAX_CHARS;
  const canSubmit  = text.trim() && rating > 0 && !overLimit && !loading;
  const pct        = Math.min((text.length / MAX_CHARS) * 100, 100);
  const barColor   = overLimit ? "#ef4444" : pct > 80 ? "#f59e0b" : "#5b8523";
  const remaining  = MAX_CHARS - text.length;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onPublish(text.trim(), rating);
    setText(""); setRating(0); setFocused(false);
  };

  return (
    <div style={{
      background: "white",
      border: `1.5px solid ${focused ? "#8ab547" : "#e8e0d5"}`,
      borderRadius: "20px",
      padding: "20px 22px",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      boxShadow: focused
        ? "0 0 0 4px rgba(90,133,35,0.07), 0 2px 12px rgba(0,0,0,0.05)"
        : "0 2px 8px rgba(0,0,0,0.04)",
      fontFamily: "inherit",
    }}>
      {/* ── Identité ── */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
        <Avatar author={currentUser} size={40} />
        <div>
          <p style={{ margin:0, fontSize:"14px", fontWeight:800, color:"#2D1F0F", lineHeight:1.2 }}>
            {getFullName(currentUser)}
          </p>
          <p style={{ margin:"2px 0 0", fontSize:"11.5px", color:"#9E8E7A" }}>Écrire un avis</p>
        </div>
      </div>

      {/* ── Textarea ── */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Partagez votre expérience avec la communauté…"
        rows={focused || text ? 4 : 2}
        style={{
          width: "100%", padding: "13px 15px",
          border: `1.5px solid ${overLimit ? "#ef4444" : focused ? "#8ab547" : "#e8e0d5"}`,
          borderRadius: "14px", fontSize: "13.5px", color: "#2D1F0F",
          resize: "none", outline: "none", lineHeight: 1.72,
          background: focused ? "white" : "#FAFAF7",
          boxSizing: "border-box",
          fontFamily: "inherit",
          transition: "border-color 0.2s, background 0.2s, rows 0.2s",
        }}
      />

      {/* ── Barre de progression ── */}
      <div style={{ height:"3px", borderRadius:"99px", background:"#f0ebe3", margin:"8px 0 14px", overflow:"hidden" }}>
        <div style={{
          height:"100%", borderRadius:"99px", width:`${pct}%`,
          background: barColor, transition:"width 0.2s, background 0.3s",
        }} />
      </div>

      {/* ── Footer ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px", flexWrap:"wrap" }}>
        <StarPicker value={rating} onChange={setRating} />

        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{
            fontSize:"11px", fontWeight:600,
            color: overLimit ? "#ef4444" : remaining < 50 ? "#f59e0b" : "#B0A090",
          }}>
            {overLimit ? `+${-remaining} de trop` : `${remaining} restants`}
          </span>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              display:"flex", alignItems:"center", gap:"7px",
              padding:"9px 20px", borderRadius:"12px",
              border:"none",
              background: canSubmit ? "#5b8523" : "#ece8e3",
              color: canSubmit ? "white" : "#b0a898",
              fontSize:"13px", fontWeight:700,
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition:"all 0.2s ease",
              fontFamily:"inherit",
            }}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = "#4a7c1f"; }}
            onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = "#5b8523"; }}
          >
            {loading
              ? <span style={{ width:14, height:14, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white", animation:"cs_spin 0.7s linear infinite", display:"inline-block" }} />
              : <Send size={14} strokeWidth={2.2} />
            }
            {loading ? "Publication…" : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
}
