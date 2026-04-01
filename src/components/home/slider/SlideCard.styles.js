// components/slider/SlideCard.styles.js
import styled, { keyframes, css } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card — base + variants
// ─────────────────────────────────────────────────────────────────────────────

// Variant sizes
const VARIANTS = {
  default:  { width: "220px", imgHeight: "160px" },
  wide:     { width: "264px", imgHeight: "185px" },
  interest: { width: "148px", imgHeight: "148px" },
};

export const Card = styled.div`
  position: relative;
  width:         ${({ $variant }) => VARIANTS[$variant]?.width     || VARIANTS.default.width};
  border-radius: ${({ $variant }) => $variant === "interest" ? "16px" : "18px"};
  overflow: hidden;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: 1px solid rgba(61,43,26,0.06);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(.25,.8,.25,1), box-shadow 0.25s ease;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $index }) => ($index || 0) * 55}ms;

  ${({ $clickable }) => $clickable && css`
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 28px rgba(61,43,26,0.13);
    }
  `}
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Image section
// ─────────────────────────────────────────────────────────────────────────────

export const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $variant }) => VARIANTS[$variant]?.imgHeight || VARIANTS.default.imgHeight};
  overflow: hidden;
  flex-shrink: 0;
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.06);
  }
`;

export const ImgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%);
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Badge on image
// ─────────────────────────────────────────────────────────────────────────────

export const Badge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${({ $free }) =>
    $free ? "rgba(107,156,62,0.88)" : "rgba(255,255,255,0.92)"};
  color: ${({ $free }) => ($free ? "#e8f5c8" : "#6b9c3e")};
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 9999px;
  backdrop-filter: blur(6px);
  border: 1px solid ${({ $free }) =>
    $free ? "rgba(200,217,138,0.3)" : "rgba(107,156,62,0.2)"};
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card body
// ─────────────────────────────────────────────────────────────────────────────

export const Body = styled.div`
  padding: ${({ $variant }) => $variant === "interest" ? "10px 8px 12px" : "12px 14px 14px"};
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: ${({ $variant }) => $variant === "interest" ? "center" : "left"};
`;

export const CardTitle = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: ${({ $variant }) => $variant === "interest" ? "13px" : "14px"};
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardSubtitle = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #9e8e80;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Rating row
// ─────────────────────────────────────────────────────────────────────────────

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
`;

export const Stars = styled.span`
  display: flex;
  align-items: center;
  gap: 1px;
  color: #f4b942;
`;

export const ReviewCount = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #a89888;
`;
