import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { 
  RiHeart2Line, RiHeart2Fill, RiFlagLine, 
  RiSendPlane2Line, RiUser3Line, RiTimeLine 
} from "react-icons/ri";
import { HiChatBubbleLeftEllipsis, HiChevronDown } from "react-icons/hi2";

import { api } from "../../services/api";
import { selectUser, selectIsLoggedIn } from "../../store/slices/authSlice";

const MAX_CHARS = 500;
const PAGE_SIZE = 5;

export default function CommentSection({ targetId, targetType = "Place" }) {
  const currentUser = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0); // Note : ton JSON actuel n'a pas de champ rating, on l'ajoute pour le futur
  const [hoverStar, setHoverStar] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  // -- Charger les commentaires --
  const loadComments = async () => {
    try {
      // On utilise targetId et targetType (ex: "Place")
      const data = await api.getCommentsByTarget(targetId, targetType);
      // Tri par date de création (createdAt)
      setList(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (targetId) loadComments();
  }, [targetId, targetType]);

  // -- Publier --
  const handlePublish = async () => {
    if (!text.trim() || !isLoggedIn) return;

    const reviewData = {
      targetId: targetId,
      targetType: targetType, 
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        avatarUrl: currentUser.avatarUrl || ""
      },
      content: text.trim(),
      rating: rating, // On garde le rating pour la logique métier
      likes: 0,
      status: "active",
      createdAt: new Date().toISOString()
    };

    try {
      setLoading(true);
      await api.postComment(reviewData);
      setText("");
      setRating(0);
      loadComments(); 
    } catch (err) {
      alert("Error posting comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-5 mt-10">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-ink2 flex items-center gap-2">
          <HiChatBubbleLeftEllipsis className="text-primary" />
          Community Reviews
        </h3>
        <span className="text-xs font-bold text-ink3">{list.length} comments</span>
      </div>

      {/* Input Section */}
      {isLoggedIn && (
        <div className="bg-white p-5 rounded-[24px] border border-sand3 shadow-sm">
           <textarea
              className="w-full min-h-[100px] p-4 border border-sand3 rounded-2xl text-sm font-body bg-sand/20 focus:bg-white focus:border-primary outline-none transition-all"
              placeholder="Write your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
           />
           <div className="flex justify-between items-center mt-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setRating(n)} onMouseEnter={() => setHoverStar(n)} onMouseLeave={() => setHoverStar(0)}>
                    {(hoverStar || rating) >= n ? <IoStarSharp className="text-yellow-500" /> : <IoStarOutline className="text-sand3" />}
                  </button>
                ))}
              </div>
              <button 
                onClick={handlePublish}
                disabled={!text.trim() || loading}
                className="bg-primary text-white px-6 py-2 rounded-full font-bold text-sm disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Review"}
              </button>
           </div>
        </div>
      )}

      {/* List Section */}
      <div className="space-y-4">
        {list.slice(0, visible).map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-[24px] border border-sand3 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={c.author?.avatarUrl || `https://ui-avatars.com/api/?name=${c.author?.firstName}`} 
                className="w-10 h-10 rounded-full object-cover border border-sand2" 
                alt="avatar"
              />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-ink2">{c.author?.firstName} {c.author?.lastName}</h4>
                <p className="text-[10px] text-ink3 flex items-center gap-1">
                  <RiTimeLine /> {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-ink2/80 leading-relaxed mb-4">{c.content}</p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1 text-[11px] font-bold text-ink3 bg-sand px-3 py-1 rounded-full">
                <RiHeart2Line /> {c.likes}
              </button>
            </div>
          </div>
        ))}
      </div>

      {visible < list.length && (
        <button onClick={() => setVisible(v => v + PAGE_SIZE)} className="py-3 text-sm font-bold text-primary hover:underline">
          See more reviews
        </button>
      )}
    </section>
  );
}