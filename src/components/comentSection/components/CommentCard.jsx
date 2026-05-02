import { useState, useEffect, useRef } from "react";
import { Heart, MoreHorizontal, Pencil, Trash2, Flag, X, Check } from "lucide-react";
import Avatar from "./Avatar";
import StarDisplay from "./StarDisplay";
import StarPicker from "./StarPicker";
import { getFullName, formatDate } from "../utils";
import { MAX_CHARS } from "../constants";

export default function CommentCard({ comment, currentUserId, isLoggedIn, onLike, onDelete, onEdit }) {
  const likedBy  = comment.likedBy || [];
  const isLiked  = likedBy.includes(currentUserId);
  const isAuthor = currentUserId === comment.author?.id;

  const [showDelete, setShowDelete] = useState(false);
  const [isEditing,  setIsEditing]  = useState(false);
  const [editText,   setEditText]   = useState(comment.content);
  const [editRating, setEditRating] = useState(comment.rating || 0);
  const [saving,     setSaving]     = useState(false);
  const [hovered,    setHovered]    = useState(false);
  const [likeAnim,   setLikeAnim]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

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
    setTimeout(() => setLikeAnim(false), 360);
    onLike(comment);
  };

  const editOverLimit = editText.length > MAX_CHARS;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        border: `1.5px solid ${showDelete ? "#fecaca" : hovered ? "#b8d88a" : "#e8e0d5"}`,
        borderRadius: "20px",
        padding: "18px 20px",
        transition: "all 0.22s ease",
        boxShadow: hovered
          ? "0 6px 24px rgba(74,124,31,0.09)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        fontFamily: "inherit",
      }}
    >
      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:"12px" }}>
        <Avatar author={comment.author} size={42} />

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px" }}>
            <div style={{ minWidth:0 }}>
              <p style={{
                margin:"0 0 2px", fontSize:"14px", fontWeight:800, color:"#2D1F0F",
                overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
              }}>
                {getFullName(comment.author)}
              </p>
              {!isEditing && <StarDisplay rating={comment.rating} />}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
              <time style={{ fontSize:"11px", color:"#9E8E7A", whiteSpace:"nowrap" }}>
                {formatDate(comment.createdAt)}
              </time>

              {isLoggedIn && (
                <div ref={menuRef} style={{ position:"relative" }}>
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    style={{
                      width:28, height:28, borderRadius:"8px",
                      border:"none", background: menuOpen ? "#f0ece6" : "transparent",
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                      color:"#9E8E7A", transition:"all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f0ece6"}
                    onMouseLeave={e => e.currentTarget.style.background = menuOpen ? "#f0ece6" : "transparent"}
                  >
                    <MoreHorizontal size={15} strokeWidth={2} />
                  </button>

                  {menuOpen && (
                    <div style={{
                      position:"absolute", right:0, top:"calc(100% + 6px)",
                      background:"white", borderRadius:"14px",
                      border:"1px solid #e8e0d5",
                      boxShadow:"0 8px 28px rgba(0,0,0,0.12)",
                      padding:"6px", zIndex:50, minWidth:"155px",
                      animation:"cs_scaleIn 0.15s ease",
                    }}>
                      {isAuthor ? (
                        <>
                          <DropItem icon={<Pencil size={13}/>} onClick={() => { setIsEditing(true); setMenuOpen(false); }}>
                            Modifier
                          </DropItem>
                          <DropItem icon={<Trash2 size={13}/>} danger onClick={() => { setShowDelete(true); setMenuOpen(false); }}>
                            Supprimer
                          </DropItem>
                        </>
                      ) : (
                        <DropItem icon={<Flag size={13}/>} onClick={() => { alert("Merci — nous examinerons ce signalement."); setMenuOpen(false); }}>
                          Signaler
                        </DropItem>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation suppression ─────────────────────── */}
      {showDelete && (
        <div style={{
          margin:"14px 0 0", padding:"13px 16px", borderRadius:"14px",
          background:"#fff5f5", border:"1.5px solid #fecaca",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px",
          animation:"cs_fadeIn 0.18s ease",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <Trash2 size={14} color="#dc2626" />
            <span style={{ fontSize:"13px", color:"#dc2626", fontWeight:700 }}>Supprimer cet avis ?</span>
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            <ActionBtn ghost onClick={() => setShowDelete(false)}>Annuler</ActionBtn>
            <ActionBtn danger onClick={() => { setShowDelete(false); onDelete(comment); }}>Supprimer</ActionBtn>
          </div>
        </div>
      )}

      {/* ── Corps ────────────────────────────────────────── */}
      <div style={{ marginTop:"12px", paddingLeft:"54px" }}>
        {isEditing ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px", animation:"cs_fadeIn 0.2s ease" }}>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={3}
              style={{
                width:"100%", padding:"11px 13px",
                border:`1.5px solid ${editOverLimit ? "#ef4444" : "#8ab547"}`,
                borderRadius:"12px", fontSize:"13px", color:"#2D1F0F",
                resize:"none", outline:"none", lineHeight:1.65,
                background:"#FAFAF7", boxSizing:"border-box", fontFamily:"inherit",
              }}
            />
            <StarPicker value={editRating} onChange={setEditRating} />

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:"11px", color: editOverLimit ? "#ef4444" : "#9E8E7A", fontWeight: editOverLimit ? 700 : 400 }}>
                {editOverLimit ? `+${editText.length - MAX_CHARS} de trop` : `${MAX_CHARS - editText.length} restants`}
              </span>
              <div style={{ display:"flex", gap:"8px" }}>
                <ActionBtn ghost onClick={cancelEdit}>
                  <X size={12} /> Annuler
                </ActionBtn>
                <ActionBtn
                  primary
                  disabled={!editText.trim() || saving || editOverLimit}
                  onClick={saveEdit}
                >
                  {saving
                    ? <span style={{ width:12, height:12, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.35)", borderTopColor:"white", animation:"cs_spin 0.7s linear infinite", display:"inline-block" }} />
                    : <Check size={12} />
                  }
                  Enregistrer
                </ActionBtn>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p style={{ margin:"0 0 12px", fontSize:"13.5px", color:"#5C4B3A", lineHeight:1.78 }}>
              {comment.content}
            </p>

            <button
              onClick={triggerLike}
              disabled={!isLoggedIn}
              title={isLoggedIn ? (isLiked ? "Retirer le j'aime" : "J'aime cet avis") : "Connectez-vous pour aimer"}
              style={{
                display:"inline-flex", alignItems:"center", gap:"6px",
                padding:"5px 13px", borderRadius:"20px",
                border:`1.5px solid ${isLiked ? "#fca5a5" : "#e8e0d5"}`,
                background: isLiked ? "#fff1f1" : "transparent",
                color: isLiked ? "#dc2626" : "#9E8E7A",
                fontSize:"12px", fontWeight:600,
                cursor: isLoggedIn ? "pointer" : "default",
                transition:"all 0.18s ease",
                transform: likeAnim ? "scale(1.2)" : "scale(1)",
                opacity: isLoggedIn ? 1 : 0.55,
                fontFamily:"inherit",
              }}
              onMouseEnter={e => { if (isLoggedIn && !isLiked) { e.currentTarget.style.borderColor="#d1c4a8"; e.currentTarget.style.color="#5C4B3A"; } }}
              onMouseLeave={e => { if (!isLiked) { e.currentTarget.style.borderColor="#e8e0d5"; e.currentTarget.style.color="#9E8E7A"; } }}
            >
              <Heart size={13} fill={isLiked ? "#dc2626" : "none"} strokeWidth={2} />
              {comment.likes > 0 && <span style={{ fontVariantNumeric:"tabular-nums" }}>{comment.likes}</span>}
              <span>{isLiked ? "Aimé" : "J'aime"}</span>
            </button>
          </>
        )}
      </div>
    </article>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function DropItem({ icon, children, onClick, danger }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:"9px",
        width:"100%", padding:"8px 12px", borderRadius:"10px",
        border:"none",
        background: hov ? (danger ? "#fff5f5" : "#f5f1eb") : "transparent",
        color: danger ? "#dc2626" : "#2D1F0F",
        fontSize:"13px", fontWeight:600, cursor:"pointer",
        textAlign:"left", fontFamily:"inherit", transition:"background 0.15s",
      }}
    >
      <span style={{ opacity:0.7 }}>{icon}</span>
      {children}
    </button>
  );
}

function ActionBtn({ children, onClick, ghost, primary, danger, disabled }) {
  const [hov, setHov] = useState(false);

  const bg    = danger  ? (hov ? "#dc2626" : "#ef4444")
              : primary ? (hov ? "#4a7c1f" : "#5b8523")
              : (hov ? "#f0ece6" : "white");
  const color = (danger || primary) ? "white" : "#5C4B3A";
  const border = (danger || primary) ? "none" : "1.5px solid #e8e0d5";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:"5px",
        padding:"6px 13px", borderRadius:"10px",
        border, background: disabled ? "#ece8e3" : bg,
        color: disabled ? "#b0a898" : color,
        fontSize:"12px", fontWeight:700,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily:"inherit", transition:"all 0.15s",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
