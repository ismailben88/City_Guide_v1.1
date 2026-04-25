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

  // ── Chargement ──────────────────────────────────────────────────────────────
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
            const existingAuthor =
              (c.author?.firstName || c.author?.name) ? c.author : null;

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
  }, [loadComments, targetId]);

  // ── Publication ─────────────────────────────────────────────────────────────
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
        name:      currentUser.name,
        avatarUrl: currentUser.avatarUrl || currentUser.avatar || "",
      },
      content,
      rating,
      likes:     0,
      likedBy:   [],
      status:    "active",
      createdAt: new Date().toISOString(),
    };

    setList(prev => [optimistic, ...prev]);
    setPostLoading(true);

    try {
      await api.postComment(optimistic);
      await loadComments();
    } catch (err) {
      setList(prev => prev.filter(c => c.id !== tempId));
      setSubmitErr("Impossible de publier votre avis. Veuillez réessayer.");
      console.error("[CommentSection] postComment:", err.message);
    } finally {
      setPostLoading(false);
    }
  };

  // ── Suppression ─────────────────────────────────────────────────────────────
  const handleDelete = async (comment) => {
    setList(prev => prev.filter(c => c.id !== comment.id));
    try {
      await api.deleteComment(comment.id);
    } catch (err) {
      await loadComments();
      console.error("[CommentSection] deleteComment:", err.message);
    }
  };

  // ── Édition ─────────────────────────────────────────────────────────────────
  const handleEdit = async (comment, newContent, newRating) => {
    setList(prev =>
      prev.map(c =>
        c.id === comment.id ? { ...c, content: newContent, rating: newRating } : c
      )
    );
    try {
      await api.updateComment(comment.id, { content: newContent, rating: newRating });
    } catch (err) {
      await loadComments();
      console.error("[CommentSection] updateComment:", err.message);
    }
  };

  // ── Like / Unlike ───────────────────────────────────────────────────────────
  const handleLike = async (comment) => {
    if (!isLoggedIn || !currentUser) return;
    const uid      = currentUser.id;
    const liked    = comment.likedBy.includes(uid);
    const newLikedBy = liked
      ? comment.likedBy.filter(id => id !== uid)
      : [...comment.likedBy, uid];
    const newLikes = liked ? comment.likes - 1 : comment.likes + 1;

    setList(prev =>
      prev.map(c =>
        c.id === comment.id ? { ...c, likes: newLikes, likedBy: newLikedBy } : c
      )
    );

    try {
      await api.toggleLikeComment(comment.id, newLikes, newLikedBy);
    } catch (err) {
      await loadComments();
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
