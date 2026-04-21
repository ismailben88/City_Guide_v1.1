/**
 * CommentSection.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Section d'avis communautaires, branchée sur api.js (CityGuide Morocco).
 *
 * Endpoints utilisés (services/api.js) :
 *   api.getCommentsByTarget(targetId, targetType)   → GET /comments?targetId=&targetType=
 *   api.postComment(data)                           → POST /comments
 *   api.updateComment(id, { content, rating })      → PUT  /comments/:id
 *   api.deleteComment(id)                           → DELETE /comments/:id
 *   api.toggleLikeComment(id, newLikes, newLikedBy) → PATCH /comments/:id
 *
 * Props :
 *   targetId   string | number   — id de la ressource (Place, Event, Guide…)
 *   targetType string            — "Place" | "Event" | "Guide" (défaut "Place")
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn } from "../../store/slices/authSlice";
import { api } from "../../services/api";

// ─── Constantes ───────────────────────────────────────────────────────────────
const PAGE_SIZE   = 5;
const MAX_CHARS   = 500;
const RATING_LABELS = ["", "Mauvais", "Passable", "Bien", "Très bien", "Excellent"];

const AVATAR_PALETTE = [
  { bg: "#E8F5E9", text: "#2E7D32", ring: "#A5D6A7" },
  { bg: "#E3F2FD", text: "#1565C0", ring: "#90CAF9" },
  { bg: "#F3E5F5", text: "#6A1B9A", ring: "#CE93D8" },
  { bg: "#FFF3E0", text: "#E65100", ring: "#FFCC80" },
  { bg: "#FCE4EC", text: "#880E4F", ring: "#F48FB1" },
  { bg: "#E0F7FA", text: "#006064", ring: "#80DEEA" },
  { bg: "#F9FBE7", text: "#827717", ring: "#E6EE9C" },
  { bg: "#EDE7F6", text: "#4527A0", ring: "#B39DDB" },
];

// ─── Utilitaires ──────────────────────────────────────────────────────────────

/** Couleur d'avatar déterministe selon le nom */
function getAvatarColor(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

/** "A" + "B" → "AB" */
function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Gère les deux schémas utilisateur de votre db.json :
 *   - Standard  : { firstName, lastName }  → u1..u49, u_admin
 *   - Alternatif: { name }                 → 876a, 0de6 (enregistrés via le front)
 */
function getFullName(author) {
  if (!author) return "Utilisateur anonyme";
  const parts = [author.firstName, author.lastName].filter(Boolean);
  if (parts.length) return parts.join(" ");
  if (author.name) return author.name;
  return "Utilisateur anonyme";
}

/**
 * Initiales depuis les deux schémas.
 */
function getInitialsFromAuthor(author) {
  if (!author) return "?";
  if (author.firstName || author.lastName)
    return getInitials(author.firstName || "", author.lastName || "");
  if (author.name) {
    const words = author.name.trim().split(/\s+/);
    return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || "?";
  }
  return "?";
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Avatar
// Affiche la photo de profil si disponible, sinon les initiales Prénom+Nom
// sur fond coloré déterministe. Bascule automatiquement sur initiales si l'image
// échoue (onError).
// ─────────────────────────────────────────────────────────────────────────────
function Avatar({ author, size = 42 }) {
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

  // ── Photo de profil ───────────────────────────────────────────────────────
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

  // ── Fallback : initiales colorées ─────────────────────────────────────────
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

// ─── Étoiles (lecture) ────────────────────────────────────────────────────────
function StarDisplay({ rating }) {
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

// ─── Étoiles (sélecteur) ──────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
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

// ─── Menu contextuel (3 points) ───────────────────────────────────────────────
function CommentMenu({ isAuthor, onEdit, onDelete, onReport }) {
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

function MenuBtn({ icon, onClick, danger = false, children }) {
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

// ─── Confirmation de suppression ──────────────────────────────────────────────
function DeleteBanner({ onConfirm, onCancel }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "12px 14px", marginTop: "12px",
      background: "#FEF2F2", border: "1px solid #FECACA",
      borderRadius: "14px", animation: "cs_fadeIn 0.2s ease",
    }}>
      <span style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
      <p style={{ flex: 1, margin: 0, fontSize: "12px", color: "#DC2626", fontWeight: 500 }}>
        Supprimer cet avis définitivement ?
      </p>
      <Btn ghost onClick={onCancel} small>Annuler</Btn>
      <Btn danger onClick={onConfirm} small>Supprimer</Btn>
    </div>
  );
}

// ─── Bannière d'erreur ────────────────────────────────────────────────────────
function AlertBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "12px 16px", background: "#FEF2F2",
      border: "1px solid #FECACA", borderRadius: "14px",
      fontSize: "13px", color: "#DC2626",
      animation: "cs_fadeIn 0.2s ease",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: "16px" }}>⚠️</span>
      {message}
    </div>
  );
}

// ─── Composant bouton réutilisable ────────────────────────────────────────────
function Btn({ onClick, disabled, loading, ghost, danger, accent, small, children, style: extraStyle = {} }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// Carte d'un avis
// ─────────────────────────────────────────────────────────────────────────────
function CommentCard({ comment, currentUserId, isLoggedIn, onLike, onDelete, onEdit }) {
  const likedBy  = comment.likedBy || [];
  const isLiked  = likedBy.includes(currentUserId);
  const isAuthor = currentUserId === comment.author?.id;
  const fullName = getFullName(comment.author);

  const [showDelete, setShowDelete] = useState(false);
  const [isEditing,  setIsEditing]  = useState(false);
  const [editText,   setEditText]   = useState(comment.content);
  const [editRating, setEditRating] = useState(comment.rating || 0);
  const [saving,     setSaving]     = useState(false);
  const [hovered,    setHovered]    = useState(false);
  const [likeAnim,   setLikeAnim]   = useState(false);

  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.content);
    setEditRating(comment.rating || 0);
  };

  const saveEdit = async () => {
    if (!editText.trim() || saving || editText.length > MAX_CHARS) return;
    setSaving(true);
    await onEdit(comment, editText.trim(), editRating);
    setSaving(false);
    setIsEditing(false);
  };

  const triggerLike = () => {
    if (!isLoggedIn) return;
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 420);
    onLike(comment);
  };

  const editOverLimit = editText.length > MAX_CHARS;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        border: `1.5px solid ${hovered ? "#C8D4A8" : "#E8DFD0"}`,
        borderRadius: "24px",
        padding: "20px 22px",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered
          ? "0 6px 28px rgba(91,133,35,0.10)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── En-tête : avatar + nom complet + date + menu ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>

        {/* Avatar (photo ou initiales) */}
        <Avatar author={comment.author} size={44} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", gap: "8px",
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              {/* Nom complet de l'auteur */}
              <p style={{
                margin: 0, fontSize: "14px", fontWeight: 800,
                color: "#3D2B1A", lineHeight: 1.25,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {fullName}
              </p>
              {/* Étoiles (cachées en mode édition) */}
              {!isEditing && <StarDisplay rating={comment.rating} />}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              <time dateTime={comment.createdAt}
                style={{ fontSize: "11px", color: "#9E8E7A", whiteSpace: "nowrap" }}>
                {formatDate(comment.createdAt)}
              </time>
              {isLoggedIn && (
                <CommentMenu
                  isAuthor={isAuthor}
                  onEdit={() => { setIsEditing(true); setShowDelete(false); }}
                  onDelete={() => { setShowDelete(true); setIsEditing(false); }}
                  onReport={() => alert("Merci — nous examinerons ce signalement.")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation suppression ── */}
      {showDelete && (
        <DeleteBanner
          onConfirm={() => { setShowDelete(false); onDelete(comment); }}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* ── Corps : texte ou formulaire d'édition ── */}
      <div style={{ marginTop: "14px", paddingLeft: "56px" }}>
        {isEditing ? (
          /* ── Mode édition ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "cs_fadeIn 0.2s ease" }}>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "12px 14px",
                border: `1.5px solid ${editOverLimit ? "#EF4444" : "#5b8523"}`,
                borderRadius: "14px", fontSize: "13px", color: "#3D2B1A",
                resize: "none", outline: "none", lineHeight: 1.65,
                background: "#FAFAF7", boxSizing: "border-box",
                fontFamily: "'Nunito', sans-serif",
              }}
            />
            <StarPicker value={editRating} onChange={setEditRating} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontSize: "11px",
                color: editOverLimit ? "#EF4444" : "#9E8E7A",
                fontWeight: editOverLimit ? 700 : 400,
              }}>
                {editOverLimit
                  ? `+${editText.length - MAX_CHARS} caractères en trop`
                  : `${MAX_CHARS - editText.length} restants`}
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn ghost small onClick={cancelEdit}>Annuler</Btn>
                <Btn
                  small
                  disabled={!editText.trim() || saving || editOverLimit}
                  loading={saving}
                  onClick={saveEdit}
                  style={{ background: "#d57a2a" }}
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </Btn>
              </div>
            </div>
          </div>
        ) : (
          /* ── Mode lecture ── */
          <>
            <p style={{
              margin: 0, fontSize: "13.5px", color: "#5C4B3A",
              lineHeight: 1.75, fontFamily: "'Nunito', sans-serif",
            }}>
              {comment.content}
            </p>

            {/* Bouton j'aime */}
            <button
              onClick={triggerLike}
              aria-label={isLiked ? "Retirer le j'aime" : "J'aime cet avis"}
              aria-pressed={isLiked}
              disabled={!isLoggedIn}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                marginTop: "14px", padding: "6px 14px",
                borderRadius: "20px",
                border: `1.5px solid ${isLiked ? "#F0C8A0" : "#E8DFD0"}`,
                background: isLiked ? "#FFF3E0" : "#FAF7F2",
                color: isLiked ? "#d57a2a" : "#7A6A58",
                fontSize: "12px", fontWeight: 600,
                cursor: isLoggedIn ? "pointer" : "default",
                transition: "all 0.18s",
                transform: likeAnim ? "scale(1.22)" : "scale(1)",
                opacity: isLoggedIn ? 1 : 0.5,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <span style={{ fontSize: "14px", lineHeight: 1 }}>
                {isLiked ? "❤️" : "🤍"}
              </span>
              {comment.likes > 0 && (
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{comment.likes}</span>
              )}
              <span style={{ fontSize: "11px", opacity: 0.75 }}>
                {isLiked ? "Aimé" : "J'aime"}
              </span>
            </button>
          </>
        )}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Formulaire de rédaction d'un avis
// ─────────────────────────────────────────────────────────────────────────────
function WriteReview({ currentUser, onPublish, loading }) {
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

// ─── Invite de connexion ──────────────────────────────────────────────────────
function LoginPrompt() {
  return (
    <div style={{
      background: "white", border: "1.5px dashed #E8DFD0",
      borderRadius: "24px", padding: "24px", textAlign: "center",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{ fontSize: "28px", marginBottom: "8px" }}>💬</div>
      <p style={{ margin: 0, fontSize: "13.5px", color: "#7A6A58" }}>
        Vous souhaitez partager votre expérience ?{" "}
        <a href="/login" style={{ color: "#d57a2a", fontWeight: 800, textDecoration: "none" }}>
          Connectez-vous
        </a>{" "}
        pour laisser un avis.
      </p>
    </div>
  );
}

// ─── Skeleton (chargement initial) ────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div style={{
      background: "white", border: "1.5px solid #F3EDE2",
      borderRadius: "24px", padding: "20px 22px",
      animation: `cs_shimmer 1.6s ease-in-out ${delay}s infinite`,
    }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F3EDE2", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 13, width: "38%", background: "#F3EDE2", borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 10, width: "22%", background: "#FAF7F2", borderRadius: 8 }} />
        </div>
      </div>
      <div style={{ paddingLeft: 56, marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
        {[100, 85, 65].map((w, i) => (
          <div key={i} style={{ height: 11, background: "#FAF7F2", borderRadius: 8, width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── État vide ────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "52px 24px", background: "white",
      border: "1.5px dashed #E8DFD0", borderRadius: "24px", gap: "10px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: "38px" }}>💬</span>
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#7A6A58" }}>
        Aucun avis pour le moment
      </p>
      <p style={{ margin: 0, fontSize: "12px", color: "#B0A090" }}>
        Soyez le premier à partager votre expérience !
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CommentSection — composant principal
//
// Flux complet :
//  1. Chargement  → api.getCommentsByTarget(targetId, targetType)
//  2. Publication → api.postComment(payload) + rechargement
//  3. Édition     → api.updateComment(id, { content, rating })
//  4. Suppression → api.deleteComment(id)
//  5. Like/Unlike → api.toggleLikeComment(id, newLikes, newLikedBy)
//
// Toutes les mutations utilisent une mise à jour optimiste (UI immédiate)
// avec rollback automatique en cas d'erreur API.
// ─────────────────────────────────────────────────────────────────────────────
export default function CommentSection({ targetId, targetType = "Place" }) {
  const currentUser = useSelector(selectUser);
  const isLoggedIn  = useSelector(selectIsLoggedIn);

  const [list,           setList]           = useState([]);
  const [visible,        setVisible]        = useState(PAGE_SIZE);
  const [initialLoading, setInitialLoading] = useState(true);
  const [postLoading,    setPostLoading]    = useState(false);
  const [fetchErr,       setFetchErr]       = useState(null);
  const [submitErr,      setSubmitErr]      = useState(null);

  // ── Chargement ──────────────────────────────────────────────────────────────
  /**
   * Votre db.json stocke les commentaires avec seulement `authorId` (pas d'objet
   * `author` imbriqué). On charge donc les users en parallèle et on enrichit
   * chaque commentaire avec { author: { id, firstName, lastName, avatarUrl } }.
   *
   * Si le commentaire a déjà un objet `author` valide (firstName/lastName présents),
   * on le conserve tel quel — compatibilité ascendante.
   */
  const loadComments = useCallback(async () => {
    setFetchErr(null);
    try {
      // Chargement parallèle : commentaires + utilisateurs
      const [data, users] = await Promise.all([
        api.getCommentsByTarget(targetId, targetType),
        api.getUsers().catch(() => []), // silencieux si endpoint indisponible
      ]);

      // Map userId → user pour la jointure O(1)
      const userMap = {};
      (users || []).forEach(u => { userMap[u.id] = u; });

      setList(
        (data || [])
          .filter(c => c.status === "active")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(c => {
            // Si l'auteur est déjà enrichi (firstName ou name présent), on le garde
            const existingAuthor =
              (c.author?.firstName || c.author?.name) ? c.author : null;

            // Sinon on cherche dans la liste des users par authorId
            const foundUser = !existingAuthor && c.authorId
              ? userMap[c.authorId] ?? null
              : null;

            const author = existingAuthor ?? (foundUser ? {
              id:        foundUser.id,
              firstName: foundUser.firstName,
              lastName:  foundUser.lastName,
              avatarUrl: foundUser.avatarUrl || "",
            } : null);

            return {
              ...c,
              author,
              likedBy: c.likedBy || [],
              likes:   c.likes   || 0,
            };
          })
      );
    } catch (err) {
      setFetchErr("Impossible de charger les avis. Veuillez réessayer.");
      console.error("[CommentSection] loadComments:", err.message);
    }
  }, [targetId, targetType]);

  useEffect(() => {
    if (!targetId) return;
    setInitialLoading(true);
    loadComments().finally(() => setInitialLoading(false));
  }, [loadComments ,targetId]);

  // ── Publication ─────────────────────────────────────────────────────────────
  /**
   * Payload envoyé à api.postComment → POST /comments
   * Correspond exactement au schéma de votre db.json / API :
   *   { targetId, targetType, authorId, author{...}, content, rating,
   *     likes, likedBy, status, createdAt }
   */
  const handlePublish = async (content, rating) => {
    if (!isLoggedIn || !currentUser) return;
    setSubmitErr(null);

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id:         tempId,
      targetId,
      targetType,
      authorId:   currentUser.id,
      author: {
        id:        currentUser.id,
        firstName: currentUser.firstName,
        lastName:  currentUser.lastName,
        name:      currentUser.name,        // schéma alternatif { name }
        avatarUrl: currentUser.avatarUrl || currentUser.avatar || "",
      },
      content,
      rating,
      likes:     0,
      likedBy:   [],
      status:    "active",
      createdAt: new Date().toISOString(),
    };

    // Mise à jour optimiste immédiate
    setList(prev => [optimistic, ...prev]);
    setPostLoading(true);

    try {
      await api.postComment(optimistic);
      // Rechargement pour récupérer l'id réel généré par le serveur
      await loadComments();
    } catch (err) {
      // Rollback
      setList(prev => prev.filter(c => c.id !== tempId));
      setSubmitErr("Impossible de publier votre avis. Veuillez réessayer.");
      console.error("[CommentSection] postComment:", err.message);
    } finally {
      setPostLoading(false);
    }
  };

  // ── Suppression ─────────────────────────────────────────────────────────────
  /** api.deleteComment(id) → DELETE /comments/:id */
  const handleDelete = async (comment) => {
    setList(prev => prev.filter(c => c.id !== comment.id));
    try {
      await api.deleteComment(comment.id);
    } catch (err) {
      await loadComments(); // Rollback
      console.error("[CommentSection] deleteComment:", err.message);
    }
  };

  // ── Édition ─────────────────────────────────────────────────────────────────
  /** api.updateComment(id, { content, rating }) → PUT /comments/:id */
  const handleEdit = async (comment, newContent, newRating) => {
    setList(prev =>
      prev.map(c =>
        c.id === comment.id ? { ...c, content: newContent, rating: newRating } : c
      )
    );
    try {
      await api.updateComment(comment.id, { content: newContent, rating: newRating });
    } catch (err) {
      await loadComments(); // Rollback
      console.error("[CommentSection] updateComment:", err.message);
    }
  };

  // ── Like / Unlike ───────────────────────────────────────────────────────────
  /**
   * api.toggleLikeComment(commentId, newLikes, newLikedBy)
   *   → PATCH /comments/:id  { likes: newLikes, likedBy: newLikedBy }
   */
  const handleLike = async (comment) => {
    if (!isLoggedIn || !currentUser) return;
    const uid      = currentUser.id;
    const liked    = comment.likedBy.includes(uid);
    const newLikedBy = liked
      ? comment.likedBy.filter(id => id !== uid)
      : [...comment.likedBy, uid];
    const newLikes = liked ? comment.likes - 1 : comment.likes + 1;

    // Mise à jour optimiste
    setList(prev =>
      prev.map(c =>
        c.id === comment.id ? { ...c, likes: newLikes, likedBy: newLikedBy } : c
      )
    );

    try {
      await api.toggleLikeComment(comment.id, newLikes, newLikedBy);
    } catch (err) {
      await loadComments(); // Rollback
      console.error("[CommentSection] toggleLikeComment:", err.message);
    }
  };

  const remaining = list.length - visible;

  // ─── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Keyframes CSS (injectés une seule fois) */}
      <style>{`
        @keyframes cs_spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cs_scaleIn {
          from { opacity: 0; transform: scale(0.86) translateY(-8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes cs_fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs_slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs_shimmer {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.48; }
        }
      `}</style>

      <section
        aria-labelledby="cs-heading"
        style={{
          display: "flex", flexDirection: "column", gap: "14px",
          marginTop: "40px", fontFamily: "'Nunito', sans-serif",
        }}
      >
        {/* En-tête de section */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "2px",
        }}>
          <h3
            id="cs-heading"
            style={{
              margin: 0, fontSize: "16px", fontWeight: 800,
              color: "#3D2B1A",
              display: "flex", alignItems: "center", gap: "8px",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            <span style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "linear-gradient(135deg, #FFF3E0, #FFCC8044)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "16px", flexShrink: 0,
            }}>💬</span>
            Avis de la communauté
          </h3>

          {!initialLoading && (
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "4px 14px",
              background: "#F3EDE2", border: "1px solid #E8DFD0",
              borderRadius: "999px", color: "#7A6A58",
            }}>
              {list.length} {list.length <= 1 ? "avis" : "avis"}
            </span>
          )}
        </div>

        {/* Erreurs */}
        <AlertBanner message={fetchErr} />
        <AlertBanner message={submitErr} />

        {/* Formulaire ou invite connexion */}
        {isLoggedIn
          ? <WriteReview currentUser={currentUser} onPublish={handlePublish} loading={postLoading} />
          : <LoginPrompt />
        }

        {/* Squelettes de chargement */}
        {initialLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[0, 1, 2].map(i => <SkeletonCard key={i} delay={i * 0.18} />)}
          </div>
        )}

        {/* Liste des avis */}
        {!initialLoading && list.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {list.slice(0, visible).map((c, i) => (
              <div
                key={c.id}
                style={{ animation: `cs_slideUp 0.35s ease ${Math.min(i, 4) * 0.06}s both` }}
              >
                <CommentCard
                  comment={c}
                  currentUserId={currentUser?.id}
                  isLoggedIn={isLoggedIn}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            ))}
          </div>
        )}

        {/* Charger plus */}
        {remaining > 0 && !initialLoading && (
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            style={{
              padding: "12px 16px", borderRadius: "16px",
              border: "1.5px dashed #D8CFC4", background: "white",
              color: "#d57a2a", fontSize: "13px", fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              fontFamily: "'Nunito', sans-serif",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#FFF3E0";
              e.currentTarget.style.borderColor = "#F0C8A0";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#D8CFC4";
            }}
          >
            Voir plus d'avis
            <span style={{
              background: "#FFF3E0", border: "1px solid #F0C8A0",
              borderRadius: "999px", padding: "2px 10px",
              fontSize: "11px", color: "#B8780A", fontWeight: 700,
            }}>
              {remaining} restant{remaining > 1 ? "s" : ""}
            </span>
          </button>
        )}

        {/* État vide */}
        {!initialLoading && !fetchErr && list.length === 0 && <EmptyState />}
      </section>
    </>
  );
}
