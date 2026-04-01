// components/slider/SectionSlider.styles.js
import styled from "styled-components";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

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

export const Subtitle = styled.span`
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
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover { color: #c8761a; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Arrows
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
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
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
//  Track
// ─────────────────────────────────────────────────────────────────────────────

export const Track = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 6px 28px 18px;
  cursor: grab;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar { display: none; }
  &:active { cursor: grabbing; }

  & > * {
    scroll-snap-align: start;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    padding: 6px 16px 14px;
    gap: 12px;
  }
`;
