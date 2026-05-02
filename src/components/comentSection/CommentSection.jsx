import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn } from "../../store/slices/authSlice";
import { api } from "../../services/api";
import { PAGE_SIZE } from "./constants";
import AlertBanner from "./components/AlertBanner";
import WriteReview from "./components/WriteReview";
import LoginPrompt from "./components/LoginPrompt";
import SkeletonCard from "./components/SkeletonCard";
import CommentCard from "./components/CommentCard";
import EmptyState from "./components/EmptyState";

export default function CommentSection({ targetId, targetType = "Place" }) {
  const currentUser = useSelector(selectUser);
  const isLoggedIn  = useSelector(selectIsLoggedIn);

  const [list,           setList]           = useState([]);
  const [visible,        setVisible]        = useState(PAGE_SIZE);
  const [initialLoading, setInitialLoading] = useState(true);
  const [postLoading,    setPostLoading]    = useState(false);
  const [fetchErr,       setFetchErr]       = useState(null);
  const [submitErr,      setSubmitErr]      = useState(null);

  const loadComments = useCallback(async () => {
    setFetchErr(null);
    try {
      const [data, users] = await Promise.all([
        api.getCommentsByTarget(targetId, targetType),
        api.getUsers().catch(() => []),
      ]);

      const userMap = {};
      (users || []).forEach(u => { userMap[u.id] = u; });

      setList(
        (data || [])
          .filter(c => c.status === "active")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(c => {
            const populatedAuthor =
              c.authorId && typeof c.authorId === "object" && c.authorId.firstName
                ? {
                    id:        c.authorId._id?.toString() ?? c.authorId.id,
                    firstName: c.authorId.firstName,
                    lastName:  c.authorId.lastName,
                    avatarUrl: c.authorId.avatarUrl || "",
                  }
                : null;

            const existingAuthor =
              populatedAuthor ??
              ((c.author?.firstName || c.author?.name) ? c.author : null);

            const foundUser = !existingAuthor && c.authorId
              ? userMap[String(c.authorId)] ?? null
              : null;

            const author = existingAuthor ?? (foundUser ? {
              id:        foundUser.id,
              firstName: foundUser.firstName,
              lastName:  foundUser.lastName,
              avatarUrl: foundUser.avatarUrl || "",
            } : null);

            return {
              ...c,
              id:      c._id?.toString() ?? c.id,
              author,
              likedBy: c.likedBy || [],
              likes:   c.likeCount ?? c.likes ?? 0,
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
  }, [loadComments, targetId]);

  const handlePublish = async (content, rating) => {
    if (!isLoggedIn || !currentUser) return;
    setSubmitErr(null);

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      targetId, targetType,
      authorId: currentUser.id,
      author: {
        id:        currentUser.id,
        firstName: currentUser.firstName,
        lastName:  currentUser.lastName,
        name:      currentUser.name,
        avatarUrl: currentUser.avatarUrl || currentUser.avatar || "",
      },
      content, rating,
      likes: 0, likedBy: [],
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setList(prev => [optimistic, ...prev]);
    setPostLoading(true);

    try {
      await api.postComment({ targetId, targetType, content, rating });
      await loadComments();
    } catch (err) {
      setList(prev => prev.filter(c => c.id !== tempId));
      setSubmitErr("Impossible de publier votre avis. Veuillez réessayer.");
      console.error("[CommentSection] postComment:", err.message);
    } finally {
      setPostLoading(false);
    }
  };

  const handleDelete = async (comment) => {
    setList(prev => prev.filter(c => c.id !== comment.id));
    try { await api.deleteComment(comment.id); }
    catch (err) { await loadComments(); console.error("[CommentSection] deleteComment:", err.message); }
  };

  const handleEdit = async (comment, newContent, newRating) => {
    setList(prev => prev.map(c => c.id === comment.id ? { ...c, content: newContent, rating: newRating } : c));
    try { await api.updateComment(comment.id, { content: newContent, rating: newRating }); }
    catch (err) { await loadComments(); console.error("[CommentSection] updateComment:", err.message); }
  };

  const handleLike = async (comment) => {
    if (!isLoggedIn || !currentUser) return;
    const uid        = currentUser.id;
    const liked      = comment.likedBy.includes(uid);
    const newLikedBy = liked ? comment.likedBy.filter(id => id !== uid) : [...comment.likedBy, uid];
    const newLikes   = liked ? comment.likes - 1 : comment.likes + 1;

    setList(prev => prev.map(c => c.id === comment.id ? { ...c, likes: newLikes, likedBy: newLikedBy } : c));
    try { await api.toggleLikeComment(comment.id, newLikes, newLikedBy); }
    catch (err) { await loadComments(); console.error("[CommentSection] toggleLikeComment:", err.message); }
  };

  const ratedList    = list.filter(c => c.rating > 0);
  const avgRating    = ratedList.length
    ? (ratedList.reduce((s, c) => s + c.rating, 0) / ratedList.length).toFixed(1)
    : null;
  const remaining = list.length - visible;

  return (
    <>
      <style>{`
        @keyframes cs_spin    { to { transform: rotate(360deg); } }
        @keyframes cs_scaleIn { from { opacity:0; transform:scale(0.93) translateY(-6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes cs_fadeIn  { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cs_slideUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes cs_pulse   { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
      `}</style>

      <section
        aria-labelledby="cs-heading"
        style={{ display:"flex", flexDirection:"column", gap:"16px", marginTop:"40px", fontFamily:"'Nunito',sans-serif" }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{
              width:40, height:40, borderRadius:"14px",
              background:"linear-gradient(135deg,#eaf3dc,#c8e49a)",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#4a7c1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h3 id="cs-heading" style={{ margin:0, fontSize:"17px", fontWeight:800, color:"#2D1F0F", lineHeight:1.2 }}>
                Avis de la communauté
              </h3>
              {!initialLoading && avgRating && (
                <div style={{ display:"flex", alignItems:"center", gap:"5px", marginTop:"3px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#B8860B" }}>{avgRating}</span>
                  <span style={{ fontSize:"11px", color:"#9E8E7A" }}>· {list.length} avis</span>
                </div>
              )}
            </div>
          </div>

          {!initialLoading && (
            <span style={{
              fontSize:"11px", fontWeight:700, padding:"5px 14px",
              background:"#eaf3dc", border:"1.5px solid #b8d88a",
              borderRadius:"999px", color:"#4a7c1f",
            }}>
              {list.length} avis
            </span>
          )}
        </div>

        {/* ── Erreurs ────────────────────────────────────── */}
        <AlertBanner message={fetchErr} />
        <AlertBanner message={submitErr} />

        {/* ── Formulaire / Invite connexion ─────────────── */}
        {isLoggedIn
          ? <WriteReview currentUser={currentUser} onPublish={handlePublish} loading={postLoading} />
          : <LoginPrompt />
        }

        {/* ── Séparateur ────────────────────────────────── */}
        {!initialLoading && list.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:"12px", margin:"4px 0 0" }}>
            <div style={{ flex:1, height:"1px", background:"#e8e0d5" }} />
            <span style={{ fontSize:"11px", fontWeight:600, color:"#B0A090", whiteSpace:"nowrap" }}>
              {list.length} commentaire{list.length > 1 ? "s" : ""}
            </span>
            <div style={{ flex:1, height:"1px", background:"#e8e0d5" }} />
          </div>
        )}

        {/* ── Squelettes ────────────────────────────────── */}
        {initialLoading && (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {[0,1,2].map(i => <SkeletonCard key={i} delay={i * 0.12} />)}
          </div>
        )}

        {/* ── Liste ─────────────────────────────────────── */}
        {!initialLoading && list.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {list.slice(0, visible).map((c, i) => (
              <div key={c.id} style={{ animation:`cs_slideUp 0.3s ease ${Math.min(i,5)*0.055}s both` }}>
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

        {/* ── Voir plus ─────────────────────────────────── */}
        {remaining > 0 && !initialLoading && (
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            style={{
              padding:"12px 20px", borderRadius:"14px",
              border:"1.5px solid #ddd8d0", background:"white",
              color:"#5b8523", fontSize:"13px", fontWeight:700,
              cursor:"pointer", transition:"all 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
              fontFamily:"inherit",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="#eaf3dc"; e.currentTarget.style.borderColor="#b8d88a"; }}
            onMouseLeave={e => { e.currentTarget.style.background="white";   e.currentTarget.style.borderColor="#ddd8d0"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            Voir plus d'avis
            <span style={{ background:"#eaf3dc", border:"1px solid #b8d88a", borderRadius:"999px", padding:"2px 10px", fontSize:"11px", color:"#4a7c1f", fontWeight:700 }}>
              {remaining}
            </span>
          </button>
        )}

        {/* ── État vide ─────────────────────────────────── */}
        {!initialLoading && !fetchErr && list.length === 0 && <EmptyState />}
      </section>
    </>
  );
}
