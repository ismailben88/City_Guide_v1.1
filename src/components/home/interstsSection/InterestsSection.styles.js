// components/home/InterestsSection.styles.js
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

export const Section = styled.section`
  padding: 44px 0 52px;
  overflow: hidden;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Header
// ─────────────────────────────────────────────────────────────────────────────

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 28px 22px;
  gap: 12px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Eyebrow = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #6b9c3e;
`;

export const Title = styled.h2`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.3rem, 2.5vw, 1.8rem);
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  line-height: 1.2;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
`;

export const ViewAll = styled.a`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #6b9c3e;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover { color: #c8761a; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Arrow buttons
// ─────────────────────────────────────────────────────────────────────────────

export const Arrows = styled.div`
  display: flex;
  gap: 8px;
`;

export const ArrowBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #dde8cc;
  background: #fff;
  color: #3d2b1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background: #3d2b1a;
    border-color: #3d2b1a;
    color: #fff;
    transform: scale(1.08);
  }

  &:disabled {
    opacity: 0.28;
    cursor: not-allowed;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Scrollable track
// ─────────────────────────────────────────────────────────────────────────────

export const Track = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 8px 28px 20px;
  cursor: grab;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar { display: none; }
  &:active { cursor: grabbing; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Dots
// ─────────────────────────────────────────────────────────────────────────────

export const DotsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 7px;
  padding-top: 6px;
`;

export const DotBtn = styled.button`
  height: 7px;
  width: ${({ $active }) => ($active ? "24px" : "7px")};
  border-radius: 9999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#6b9c3e" : "#d5e0bc")};
  transition: width 0.3s ease, background 0.25s ease;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card — square interest card (160px)
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  position: relative;
  width: 160px;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  background: #1e1a14;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s cubic-bezier(.25, .8, .25, 1),
              box-shadow 0.28s ease;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ $index }) => $index * 55}ms;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 32px rgba(61, 43, 26, 0.18);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card image
// ─────────────────────────────────────────────────────────────────────────────

export const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s ease;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

export const ImgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 30%,
    rgba(30, 26, 20, 0.82) 100%
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Count badge — top right on image
// ─────────────────────────────────────────────────────────────────────────────

export const CountBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background: rgba(107, 156, 62, 0.85);
  backdrop-filter: blur(6px);
  color: #e8f5c8;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(200, 217, 138, 0.3);
  display: flex;
  align-items: center;
  gap: 3px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card body
// ─────────────────────────────────────────────────────────────────────────────

export const CardBody = styled.div`
  padding: 10px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: #1e1a14;
  text-align: center;
`;

export const CardTitle = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 13px;
  font-weight: 700;
  color: #f5ede0;
  margin: 0;
  line-height: 1.3;
`;

export const ExploreBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  color: #c8d98a;
  border: 1px solid rgba(200, 217, 138, 0.3);
  border-radius: 9999px;
  padding: 4px 12px;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease;

  &:hover {
    background: rgba(107, 156, 62, 0.22);
    border-color: rgba(107, 156, 62, 0.6);
    color: #fff;
  }
`;
