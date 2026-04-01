// components/UI/PlaceCard.styles.js
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card wrapper
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px solid #ede8e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.26s cubic-bezier(.25, .8, .25, 1),
              box-shadow 0.26s ease,
              border-color 0.22s ease;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $index }) => $index * 50}ms;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 36px rgba(61, 43, 26, 0.13);
    border-color: #b8d48a;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Image
// ─────────────────────────────────────────────────────────────────────────────

export const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 195px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.42s ease;

  ${Card}:hover & {
    transform: scale(1.06);
  }
`;

export const ImgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 45%,
    rgba(61, 43, 26, 0.45) 100%
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Badges on image
// ─────────────────────────────────────────────────────────────────────────────

export const CategoryBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.92);
  color: #6b9c3e;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(107, 156, 62, 0.2);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PriceBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: ${({ $free }) =>
    $free ? "rgba(107, 156, 62, 0.88)" : "rgba(61, 43, 26, 0.78)"};
  color: ${({ $free }) => ($free ? "#e8f5c8" : "#f4c67a")};
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  gap: 4px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card body
// ─────────────────────────────────────────────────────────────────────────────

export const CardBody = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const CardCity = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #9e8e80;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CardTitle = styled.h3`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardDesc = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #7a6a58;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Rating row
// ─────────────────────────────────────────────────────────────────────────────

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Stars = styled.span`
  display: flex;
  align-items: center;
  gap: 1px;
  color: #f4b942;
`;

export const RatingNum = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #3d2b1a;
`;

export const ReviewCount = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #a09080;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Tags row
// ─────────────────────────────────────────────────────────────────────────────

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const Tag = styled.span`
  background: #f0f5e0;
  color: #6b9c3e;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 9999px;
  border: 1px solid #dde8cc;
  display: flex;
  align-items: center;
  gap: 3px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Actions footer
// ─────────────────────────────────────────────────────────────────────────────

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid #f0ebe4;
`;

export const ActionBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 10px;
  border-radius: 10px;
  border: 1.5px solid ${({ $primary }) => $primary ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $primary }) => $primary ? "#6b9c3e" : "transparent"};
  color: ${({ $primary }) => $primary ? "#fff" : "#7a6a58"};
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease, transform 0.15s ease;

  &:hover {
    background: ${({ $primary }) => $primary ? "#c8761a" : "#f7f3ee"};
    border-color: ${({ $primary }) => $primary ? "#c8761a" : "#c8b8a8"};
    color: ${({ $primary }) => $primary ? "#fff" : "#3d2b1a"};
    transform: translateY(-1px);
  }
`;

export const ShareBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1.5px solid #e0d8ce;
  background: transparent;
  color: #9e8e80;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease;

  &:hover {
    background: #f0ebe4;
    border-color: #c8b8a8;
    color: #3d2b1a;
  }
`;
