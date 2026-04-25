import { useState } from "react";
import Avatar from "./Avatar";
import StarDisplay from "./StarDisplay";
import StarPicker from "./StarPicker";
import CommentMenu from "./CommentMenu";
import DeleteBanner from "./DeleteBanner";
import Btn from "./Btn";
import { getFullName, formatDate } from "../utils";
import { MAX_CHARS } from "../constants";

export default function CommentCard({ comment, currentUserId, isLoggedIn, onLike, onDelete, onEdit }) {
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
