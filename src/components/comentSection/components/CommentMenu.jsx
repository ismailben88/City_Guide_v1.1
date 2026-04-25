import { useState, useEffect, useRef } from "react";
import MenuBtn from "./MenuBtn";

export default function CommentMenu({ isAuthor, onEdit, onDelete, onReport }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const run = fn => () => { fn(); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Options de l'avis"
        aria-expanded={open}
        style={{
          background: open ? "#F3EDE2" : "none",
          border: "none", cursor: "pointer",
          padding: "6px 7px", borderRadius: "50%",
          transition: "background 0.15s", lineHeight: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#F3EDE2"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "none"; }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#9E8E7A">
          <circle cx="5" cy="12" r="2.2" />
          <circle cx="12" cy="12" r="2.2" />
          <circle cx="19" cy="12" r="2.2" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute", right: 0, top: "38px", zIndex: 60,
            background: "white", border: "1px solid #E8DFD0",
            borderRadius: "16px",
            boxShadow: "0 10px 36px rgba(91,133,35,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            minWidth: "168px", padding: "6px 0", overflow: "hidden",
            animation: "cs_scaleIn 0.17s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {isAuthor ? (
            <>
              <MenuBtn icon="✏️" onClick={run(onEdit)}>Modifier l'avis</MenuBtn>
              <MenuBtn icon="🗑️" onClick={run(onDelete)} danger>Supprimer</MenuBtn>
            </>
          ) : (
            <MenuBtn icon="🚩" onClick={run(onReport)}>Signaler l'avis</MenuBtn>
          )}
        </div>
      )}
    </div>
  );
}
