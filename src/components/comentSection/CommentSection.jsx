import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiHeart2Line, RiHeart2Fill, RiTimeLine } from "react-icons/ri";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { selectUser, selectIsLoggedIn } from "../../store/slices/authSlice";
import { api } from "../../services/api";

const PAGE_SIZE = 5;
const MAX_CHARS = 500;

// ── Avatar ─────────────────────────────────────────────────────────────────────
function Avatar({ author, size = 38 }) {
  const [err, setErr] = useState(false);
  const initials =
    `${author?.firstName?.[0] || ""}${author?.lastName?.[0] || ""}`.toUpperCase();

  const sizeClass = size === 34 ? "w-9 h-9" : "w-[38px] h-[38px]";

  if (author?.avatarUrl && !err) {
    return (
      <img
        src={author.avatarUrl}
        alt={initials}
        onError={() => setErr(true)}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 border border-sand3`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex-shrink-0 bg-green-light text-primary flex items-center justify-center text-sm font-medium`}
    >
      {initials}
    </div>
  );
}

// ── Read-only stars ────────────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex gap-px mt-1">
      {[1, 2, 3, 4, 5].map((n) =>
        n <= rating ? (
          <IoStarSharp key={n} size={12} className="text-[#FACC15]" />
        ) : (
          <IoStarOutline key={n} size={12} className="text-sand3" />
        ),
      )}
    </div>
  );
}

// ── Interactive star picker ────────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="bg-transparent border-0 p-1 cursor-pointer transition-colors"
        >
          {(hover || value) >= n ? (
            <IoStarSharp size={20} className="text-[#FACC15]" />
          ) : (
            <IoStarOutline size={20} className="text-sand3" />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Single comment card ────────────────────────────────────────────────────────
function CommentCard({ comment, currentUserId, onLike }) {
  const likedBy = comment.likedBy || [];
  const isLiked = likedBy.includes(currentUserId);

  return (
    <div className="bg-white border border-sand3 rounded-3xl p-5 md:p-6">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar author={comment.author} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-medium text-ink2">
              {comment.author?.firstName} {comment.author?.lastName}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-ink3 whitespace-nowrap">
              <RiTimeLine size={13} />
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <StarDisplay rating={comment.rating} />
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-ink3 leading-relaxed mb-5">
        {comment.content}
      </p>

      {/* Like button */}
      <button
        onClick={() => onLike(comment)}
        aria-label={isLiked ? "Unlike this review" : "Like this review"}
        className={`inline-flex items-center gap-2 px-5 py-2 rounded-3xl text-sm font-medium border transition-all duration-200 ${
          isLiked
            ? "border-accent bg-accent/10 text-accent"
            : "border-sand3 bg-sand2 text-ink3 hover:border-sand2 hover:bg-sand3"
        } ${currentUserId ? "cursor-pointer" : "cursor-default"}`}
      >
        {isLiked ? (
          <RiHeart2Fill size={16} className="text-accent" />
        ) : (
          <RiHeart2Line size={16} />
        )}
        <span>{comment.likes}</span>
      </button>
    </div>
  );
}

// ── Main CommentSection ────────────────────────────────────────────────────────
export default function CommentSection({ targetId, targetType = "Place" }) {
  const currentUser = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState(null);
  const [submitErr, setSubmitErr] = useState(null);

  const isOverLimit = text.length > MAX_CHARS;
  const canPublish = text.trim() && rating > 0 && !isOverLimit && !loading;

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadComments = async () => {
    setFetchErr(null);
    try {
      const data = await api.getCommentsByTarget(targetId, targetType);
      setList(
        (data || [])
          .filter((c) => c.status === "active")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((c) => ({ ...c, likedBy: c.likedBy || [] })),
      );
    } catch {
      setFetchErr("Unable to load reviews.");
    }
  };

  useEffect(() => {
    if (targetId) loadComments();
  }, [targetId, targetType]);

  // ── Post comment (with optimistic UI) ─────────────────────────────────────
  const handlePublish = async () => {
    if (!canPublish || !isLoggedIn) return;

    setSubmitErr(null);
    const tempId = `temp-${Date.now()}`;

    const newComment = {
      id: tempId,
      targetId,
      targetType,
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        avatarUrl: currentUser.avatarUrl || "",
      },
      content: text.trim(),
      rating,
      likes: 0,
      likedBy: [],
      status: "active",
      createdAt: new Date().toISOString(),
    };

    // Optimistic add at the top
    setList((prev) => [newComment, ...prev]);
    setText("");
    setRating(0);

    try {
      setLoading(true);
      await api.postComment(newComment);
      await loadComments(); // refresh with real server data
    } catch {
      // rollback on error
      setList((prev) => prev.filter((c) => c.id !== tempId));
      setSubmitErr("Failed to post your review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Like / Unlike (optimistic) ────────────────────────────────────────────
  const handleLike = async (comment) => {
    if (!isLoggedIn || !currentUser) return;

    const uid = currentUser.id;
    const likedBy = comment.likedBy || [];
    const alreadyLiked = likedBy.includes(uid);

    const newLikedBy = alreadyLiked
      ? likedBy.filter((id) => id !== uid)
      : [...likedBy, uid];

    const newLikes = alreadyLiked ? comment.likes - 1 : comment.likes + 1;

    // Optimistic update
    setList((prev) =>
      prev.map((c) =>
        c.id === comment.id
          ? { ...c, likes: newLikes, likedBy: newLikedBy }
          : c,
      ),
    );

    try {
      await api.toggleLikeComment(comment.id, newLikes, newLikedBy);
    } catch {
      await loadComments(); // rollback on error
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="flex flex-col gap-5 mt-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-medium text-ink2">
          <HiChatBubbleLeftEllipsis size={22} className="text-accent" />
          Community reviews
        </h3>
        <span className="text-xs font-medium px-4 py-1 bg-sand2 border border-sand3 rounded-3xl text-ink3">
          {list.length} {list.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {fetchErr && (
        <p className="text-sm text-[#E24B4A] bg-[#FCEBEB] px-5 py-3 rounded-2xl">
          {fetchErr}
        </p>
      )}

      {/* Write a review - ONLY visible when logged in */}
      {isLoggedIn ? (
        <div className="bg-white border border-sand3 rounded-3xl p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar author={currentUser} size={34} />
            <span className="text-sm font-medium text-ink2">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience..."
            maxLength={MAX_CHARS}
            className={`w-full min-h-[100px] p-4 border rounded-2xl bg-sand2 text-sm text-ink2 font-body resize-none transition-all outline-none ${
              isOverLimit
                ? "border-[#E24B4A]"
                : "border-sand3 focus:border-accent focus:bg-white"
            }`}
          />

          <div className="flex items-end justify-between mt-4">
            <div className="flex flex-col gap-2">
              <StarPicker value={rating} onChange={setRating} />
              <span
                className={`text-xs ${
                  isOverLimit ? "text-[#E24B4A]" : "text-ink3"
                }`}
              >
                {text.length} / {MAX_CHARS}
              </span>
            </div>

            <button
              onClick={handlePublish}
              disabled={!canPublish}
              className={`px-8 py-3 rounded-3xl font-medium text-sm transition-all ${
                canPublish
                  ? "bg-accent text-white hover:brightness-110"
                  : "bg-accent/30 text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Posting..." : "Post review"}
            </button>
          </div>

          {submitErr && (
            <p className="mt-4 text-sm text-[#E24B4A] bg-[#FCEBEB] px-4 py-3 rounded-2xl">
              {submitErr}
            </p>
          )}
        </div>
      ) : (
        /* ── Updated message as you requested ── */
        <div className="bg-white border border-sand3 rounded-3xl p-6 text-center text-sm text-ink3">
          You can add a comment if you{" "}
          <span className="text-accent font-semibold">log in</span>.
        </div>
      )}

      {/* Comment list */}
      <div className="flex flex-col gap-4">
        {list.slice(0, visible).map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            currentUserId={currentUser?.id}
            onLike={handleLike}
          />
        ))}
      </div>

      {visible < list.length && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="py-4 px-6 bg-white border border-sand3 rounded-2xl text-sm font-medium text-accent hover:bg-sand2 transition-colors"
        >
          Load more reviews ({list.length - visible} remaining)
        </button>
      )}

      {!fetchErr && list.length === 0 && (
        <div className="text-center py-12 bg-white border border-sand3 rounded-3xl text-sm text-ink3">
          No reviews yet. Be the first to share your experience!
        </div>
      )}
    </section>
  );
}
