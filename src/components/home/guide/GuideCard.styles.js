// components/home/GuideCard.styles.js
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card wrapper
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  position: relative;
  width: 235px;
  border-radius: 20px;
  overflow: visible;
  cursor: pointer;
  background: #1e1a14;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s cubic-bezier(.25, .8, .25, 1),
              box-shadow 0.28s ease;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ $index }) => $index * 70}ms;

  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 20px 44px rgba(61, 43, 26, 0.22);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Cover image
// ─────────────────────────────────────────────────────────────────────────────

export const Cover = styled.div`
  position: relative;
  width: 100%;
  height: 115px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  flex-shrink: 0;
`;

export const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;

  ${Card}:hover & {
    transform: scale(1.07);
  }
`;

export const CoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.08) 0%,
    rgba(30, 26, 20, 0.65) 100%
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Verified badge — top left on cover
// ─────────────────────────────────────────────────────────────────────────────

export const VerifiedBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(107, 156, 62, 0.88);
  backdrop-filter: blur(6px);
  color: #e8f5c8;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 3px 9px;
  border-radius: 9999px;
  border: 1px solid rgba(200, 217, 138, 0.35);
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Avatar — floats between cover and body
// ─────────────────────────────────────────────────────────────────────────────

export const AvatarWrap = styled.div`
  position: absolute;
  top: 74px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 3px solid #1e1a14;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  transition: transform 0.28s ease, box-shadow 0.28s ease;

  ${Card}:hover & {
    transform: translateX(-50%) scale(1.07);
    box-shadow: 0 6px 20px rgba(107, 156, 62, 0.35);
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card body
// ─────────────────────────────────────────────────────────────────────────────

export const CardBody = styled.div`
  padding: 44px 16px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #1e1a14;
  border-radius: 0 0 20px 20px;
  text-align: center;
`;

export const GuideName = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: #f5ede0;
  margin: 0;
  line-height: 1.2;
`;

export const GuideCity = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #a09880;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Rating row
// ─────────────────────────────────────────────────────────────────────────────

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const Stars = styled.span`
  display: flex;
  align-items: center;
  gap: 1px;
  color: #f4b942;
`;

export const RatingScore = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #f5ede0;
`;

export const ReviewCount = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #7a7060;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Languages
// ─────────────────────────────────────────────────────────────────────────────

export const LangsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
`;

export const LangTag = styled.span`
  background: rgba(255, 255, 255, 0.07);
  color: #b8b098;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  align-items: center;
  gap: 3px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Footer — price + CTA
// ─────────────────────────────────────────────────────────────────────────────

export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  margin-top: 2px;
`;

export const Price = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #a09880;

  strong {
    font-size: 13px;
    font-weight: 800;
    color: #f5ede0;
  }
`;

export const ViewBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #6b9c3e;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 6px 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease, gap 0.15s ease;

  &:hover {
    background: #c8761a;
    transform: translateX(2px);
    gap: 8px;
  }
`;
