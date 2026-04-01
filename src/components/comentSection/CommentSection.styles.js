// components/UI/CommentSection.styles.js
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SectionTitle = styled.h3`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CommentCount = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #9e8e80;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Input card
// ─────────────────────────────────────────────────────────────────────────────

export const InputCard = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 18px 20px;
  border: 1.5px solid #ede8e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const InputAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f0ebe4;
  border: 2px solid #e0d8ce;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #9e8e80;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CommentInput = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 72px;
  resize: none;
  border: 1.5px solid #e0d8ce;
  border-radius: 12px;
  padding: 10px 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #3d2b1a;
  background: #fafaf8;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.5;

  &::placeholder { color: #c0b4a8; font-weight: 400; }

  &:focus {
    border-color: #6b9c3e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(107, 156, 62, 0.1);
  }
`;

export const RatingLabel = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9e8e80;
  margin: 0;
`;

export const StarPickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

export const StarPickBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ $active }) => $active ? "#f4b942" : "#e0d8ce"};
  display: flex;
  align-items: center;
  transition: color 0.15s ease, transform 0.12s ease;

  &:hover {
    color: #f4b942;
    transform: scale(1.2);
  }
`;

export const InputFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

export const CharCount = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: ${({ $over }) => $over ? "#e05a5a" : "#b0a090"};
  font-weight: 600;
`;

export const PublishBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 22px;
  border-radius: 9999px;
  border: none;
  background: #6b9c3e;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease, gap 0.15s ease;

  &:hover:not(:disabled) {
    background: #c8761a;
    gap: 9px;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Comment list
// ─────────────────────────────────────────────────────────────────────────────

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Comment item
// ─────────────────────────────────────────────────────────────────────────────

export const CommentItem = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  border: 1.5px solid #ede8e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $index }) => $index * 45}ms;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: #d5e8b0;
    box-shadow: 0 4px 16px rgba(107, 156, 62, 0.08);
  }
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CommentAvatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8f0d8;
  flex-shrink: 0;
`;

export const CommentUser = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 13px;
  font-weight: 700;
  color: #3d2b1a;
  flex: 1;
`;

export const CommentStars = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  color: #f4b942;
`;

export const CommentText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #5a4a3a;
  margin: 0;
  line-height: 1.6;
`;

export const CommentFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CommentDate = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #b0a090;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-right: auto;
`;

export const VoteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $active, $type }) =>
    $active
      ? $type === "like"    ? "#6b9c3e" : "#e05a5a"
      : "#e0d8ce"};
  background: ${({ $active, $type }) =>
    $active
      ? $type === "like"    ? "rgba(107,156,62,0.1)" : "rgba(224,90,90,0.08)"
      : "transparent"};
  color: ${({ $active, $type }) =>
    $active
      ? $type === "like"    ? "#6b9c3e" : "#e05a5a"
      : "#9e8e80"};
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: ${({ $type }) => $type === "like" ? "#6b9c3e" : "#e05a5a"};
    color: ${({ $type }) => $type === "like" ? "#6b9c3e" : "#e05a5a"};
    background: ${({ $type }) => $type === "like"
      ? "rgba(107,156,62,0.08)"
      : "rgba(224,90,90,0.06)"};
  }
`;

export const FlagBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #c0b4a8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.18s ease, background 0.18s ease;

  &:hover {
    background: rgba(224, 90, 90, 0.07);
    color: #e05a5a;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Load more
// ─────────────────────────────────────────────────────────────────────────────

export const LoadMoreBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  border-radius: 14px;
  border: 1.5px solid #e0d8ce;
  background: #fff;
  color: #5a4a3a;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: #f7f3ee;
    border-color: #6b9c3e;
    color: #6b9c3e;
  }
`;
