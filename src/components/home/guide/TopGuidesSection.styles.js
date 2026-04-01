// components/home/TopGuidesSection.styles.js
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
  padding: 12px 28px 24px;
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
