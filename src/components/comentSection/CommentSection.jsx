// components/UI/CommentSection.jsx
import { useState } from "react";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import { RiHeart2Line, RiHeart2Fill, RiThumbDownLine, RiThumbDownFill,
         RiFlagLine, RiSendPlane2Line, RiUser3Line, RiTimeLine } from "react-icons/ri";
import { HiChatBubbleLeftEllipsis, HiChevronDown } from "react-icons/hi2";

import {
  Section, SectionHeader, SectionTitle, CommentCount,
  InputCard, InputRow, InputAvatar, InputArea,
  CommentInput, RatingLabel, StarPickerRow, StarPickBtn,
  InputFooter, CharCount, PublishBtn,
  CommentList,
  CommentItem, CommentHeader, CommentAvatar, CommentUser, CommentStars,
  CommentText, CommentFooter, CommentDate,
  VoteBtn, FlagBtn,
  LoadMoreBtn,
} from "./CommentSection.styles";

const MAX_CHARS  = 500;
const PAGE_SIZE  = 5;

// ─────────────────────────────────────────────────────────────────────────────
//  CommentSection
//
//  Props:
//    comments  {Array}   initial list from json-server
//    userImg   {string}  current user avatar url (optional)
// ─────────────────────────────────────────────────────────────────────────────
export default function CommentSection({ comments = [], userImg }) {
  const [list,      setList]      = useState(comments);
  const [text,      setText]      = useState("");
  const [rating,    setRating]    = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [visible,   setVisible]   = useState(PAGE_SIZE);
  const [votes,     setVotes]     = useState({}); // { [id]: "like" | "dislike" | null }

  // ── Publish ──────────────────────────────────────────────────────────────
  const handlePublish = () => {
    if (!text.trim()) return;
    const newComment = {
      id:      Date.now(),
      user:    "You",
      img:     userImg || null,
      rating,
      text:    text.trim(),
      likes:   0,
      dislikes: 0,
      date:    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    setList([newComment, ...list]);
    setText("");
    setRating(0);
    setVisible((v) => v + 1);
  };

  // ── Vote ─────────────────────────────────────────────────────────────────
  const handleVote = (id, type) => {
    setVotes((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const displayStar = hoverStar || rating;

  return (
    <Section>

      {/* ── Header ── */}
      <SectionHeader>
        <SectionTitle>
          <HiChatBubbleLeftEllipsis size={20} color="#6b9c3e" />
          Comments
        </SectionTitle>
        <CommentCount>{list.length} comment{list.length !== 1 ? "s" : ""}</CommentCount>
      </SectionHeader>

      {/* ── Input card ── */}
      <InputCard>
        <InputRow>
          <InputAvatar>
            {userImg
              ? <img src={userImg} alt="You" />
              : <RiUser3Line size={18} />
            }
          </InputAvatar>

          <InputArea>
            <CommentInput
              placeholder="Share your thoughts about this place…"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              rows={3}
            />

            {/* ── Star rating picker ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <RatingLabel>Your rating</RatingLabel>
              <StarPickerRow>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarPickBtn
                    key={n}
                    $active={n <= displayStar}
                    type="button"
                    onClick={() => setRating(n === rating ? 0 : n)}
                    onMouseEnter={() => setHoverStar(n)}
                    onMouseLeave={() => setHoverStar(0)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    {n <= displayStar
                      ? <IoStarSharp   size={18} />
                      : <IoStarOutline size={18} />
                    }
                  </StarPickBtn>
                ))}
              </StarPickerRow>
            </div>
          </InputArea>
        </InputRow>

        <InputFooter>
          <CharCount $over={text.length >= MAX_CHARS}>
            {text.length} / {MAX_CHARS}
          </CharCount>
          <PublishBtn
            type="button"
            onClick={handlePublish}
            disabled={!text.trim()}
          >
            Publish <RiSendPlane2Line size={14} />
          </PublishBtn>
        </InputFooter>
      </InputCard>

      {/* ── Comment list ── */}
      <CommentList>
        {list.slice(0, visible).map((c, i) => {
          const fullStars  = Math.round(c.rating || 0);
          const emptyStars = 5 - fullStars;
          const vote       = votes[c.id];

          return (
            <CommentItem key={c.id} $index={i}>

              {/* ── Header ── */}
              <CommentHeader>
                {c.img
                  ? <CommentAvatar src={c.img} alt={c.user} loading="lazy" />
                  : (
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: "#f0f5e0", border: "2px solid #e8f0d8",
                      display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0,
                      color: "#6b9c3e",
                    }}>
                      <RiUser3Line size={16} />
                    </div>
                  )
                }
                <CommentUser>{c.user}</CommentUser>
                {c.rating > 0 && (
                  <CommentStars>
                    {Array.from({ length: fullStars  }).map((_, j) => <IoStarSharp   key={`f${j}`} size={12} />)}
                    {Array.from({ length: emptyStars }).map((_, j) => <IoStarOutline key={`e${j}`} size={12} />)}
                  </CommentStars>
                )}
              </CommentHeader>

              {/* ── Text ── */}
              <CommentText>{c.text}</CommentText>

              {/* ── Footer ── */}
              <CommentFooter>
                {c.date && (
                  <CommentDate>
                    <RiTimeLine size={11} />
                    {c.date}
                  </CommentDate>
                )}

                <VoteBtn
                  $type="like"
                  $active={vote === "like"}
                  type="button"
                  onClick={() => handleVote(c.id, "like")}
                  aria-label="Like"
                >
                  {vote === "like"
                    ? <RiHeart2Fill   size={13} />
                    : <RiHeart2Line   size={13} />
                  }
                  {(c.likes || 0) + (vote === "like" ? 1 : 0)}
                </VoteBtn>

                <VoteBtn
                  $type="dislike"
                  $active={vote === "dislike"}
                  type="button"
                  onClick={() => handleVote(c.id, "dislike")}
                  aria-label="Dislike"
                >
                  {vote === "dislike"
                    ? <RiThumbDownFill size={13} />
                    : <RiThumbDownLine size={13} />
                  }
                  {(c.dislikes || 0) + (vote === "dislike" ? 1 : 0)}
                </VoteBtn>

                <FlagBtn type="button" aria-label="Report">
                  <RiFlagLine size={13} />
                </FlagBtn>
              </CommentFooter>

            </CommentItem>
          );
        })}
      </CommentList>

      {/* ── Load more ── */}
      {visible < list.length && (
        <LoadMoreBtn type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
          <HiChevronDown size={16} />
          Load more ({list.length - visible} remaining)
        </LoadMoreBtn>
      )}

    </Section>
  );
}
