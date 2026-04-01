// pages/PlacesPage.styles.js
import styled, { keyframes, css } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Page wrapper
// ─────────────────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Hero
// ─────────────────────────────────────────────────────────────────────────────

export const Hero = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 60%;
    display: block;
  }
`;

export const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(61, 43, 26, 0.32) 0%,
    rgba(61, 43, 26, 0.70) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const HeroTitle = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
  text-align: center;
  animation: ${fadeUp} 0.6s ease both;
`;

export const HeroSub = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
  animation: ${fadeUp} 0.6s ease 0.1s both;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Search + filter bar
// ─────────────────────────────────────────────────────────────────────────────

export const SearchWrap = styled.div`
  max-width: 860px;
  margin: -28px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  animation: ${fadeUp} 0.5s ease 0.2s both;
`;

export const SearchRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const SearchBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  padding: 6px 6px 6px 16px;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
  border: 2px solid ${({ $focused }) => $focused ? "#6b9c3e" : "transparent"};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  ${({ $focused }) => $focused && css`
    box-shadow: 0 8px 32px rgba(107, 156, 62, 0.18);
  `}
`;

export const SearchIcon = styled.div`
  color: #6b9c3e;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #3d2b1a;
  min-width: 0;

  &::placeholder { color: #b0a090; font-weight: 400; }
`;

export const SearchClear = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #f0ebe4;
  color: #7a6a58;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.18s ease, color 0.18s ease;

  &:hover { background: #e0d8ce; color: #3d2b1a; }
`;

export const FilterToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border-radius: 14px;
  border: 2px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.1)" : "#fff"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#7a6a58"};
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6b9c3e;
    color: #6b9c3e;
  }
`;

export const SearchMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 4px 0;
`;

export const ResultCount = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #7a6a58;
`;

export const ResetBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #c8761a;
  cursor: pointer;
  padding: 0;
  transition: color 0.18s ease;

  &:hover { color: #3d2b1a; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Filter pills bar
// ─────────────────────────────────────────────────────────────────────────────

export const FiltersBar = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 4px 0;
  animation: ${fadeIn} 0.2s ease;
`;

export const FilterPill = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.1)" : "#fff"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#7a6a58"};
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: #6b9c3e;
    color: #6b9c3e;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Container + layout
// ─────────────────────────────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;

  @media (max-width: 768px) { padding: 0 16px; }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0 18px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.h2`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
`;

export const SortSelect = styled.select`
  padding: 8px 14px;
  border-radius: 10px;
  border: 1.5px solid #e0d8ce;
  background: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  cursor: pointer;
  transition: border-color 0.18s ease;

  &:focus { border-color: #6b9c3e; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Grid
// ─────────────────────────────────────────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
  padding-bottom: 60px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 72px 20px;
  gap: 12px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 52px;
  line-height: 1;
`;

export const EmptyText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #9e8e80;
  margin: 0;
`;

export const EmptyBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 22px;
  border-radius: 9999px;
  border: 1.5px solid #6b9c3e;
  background: transparent;
  color: #6b9c3e;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;

  &:hover { background: #6b9c3e; color: #fff; }
`;
