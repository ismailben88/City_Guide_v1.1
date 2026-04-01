// components/home/EventsSection.styles.js
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
  gap: 20px;
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
//  Card
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  position: relative;
  width: 288px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  background: #1e1a14;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.11);
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  transition: transform 0.28s cubic-bezier(.25, .8, .25, 1),
              box-shadow 0.28s ease;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ $index }) => $index * 60}ms;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(61, 43, 26, 0.18);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card image
// ─────────────────────────────────────────────────────────────────────────────

export const ImgWrap = styled.div`
  position: relative;
  width: 100%;
  height: 175px;
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
    transform: scale(1.07);
  }
`;

export const ImgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 25%,
    rgba(30, 26, 20, 0.88) 100%
  );
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Badges
// ─────────────────────────────────────────────────────────────────────────────

export const CategoryBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(8px);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const FreeBadge = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: rgba(107, 156, 62, 0.85);
  backdrop-filter: blur(8px);
  color: #e8f5c8;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(200, 217, 138, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const DateStrip = styled.div`
  position: absolute;
  bottom: 10px;
  left: 12px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.82);
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Card body
// ─────────────────────────────────────────────────────────────────────────────

export const CardBody = styled.div`
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  background: #1e1a14;
`;

export const CardCity = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #a09880;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const CardTitle = styled.h3`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: #f5ede0;
  margin: 0;
  line-height: 1.3;
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const Tag = styled.span`
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

export const ExploreBtn = styled.button`
  margin-top: 2px;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #6b9c3e;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 7px 18px;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease, gap 0.15s ease;

  &:hover {
    background: #c8761a;
    transform: translateX(2px);
    gap: 9px;
  }
`;
