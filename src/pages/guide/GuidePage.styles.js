// pages/GuidePage.styles.js
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
//  Hero banner
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
    rgba(61, 43, 26, 0.35) 0%,
    rgba(61, 43, 26, 0.72) 100%
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
//  Search bar
// ─────────────────────────────────────────────────────────────────────────────

export const SearchWrap = styled.div`
  max-width: 720px;
  margin: -28px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  animation: ${fadeUp} 0.5s ease 0.2s both;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16px;
  padding: 6px 6px 6px 18px;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  border: 2px solid ${({ $focused }) => $focused ? "#6b9c3e" : "transparent"};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  ${({ $focused }) => $focused && css`
    box-shadow: 0 8px 32px rgba(107, 156, 62, 0.2);
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
//  Main layout
// ─────────────────────────────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 28px;

  @media (max-width: 768px) { padding: 0 16px; }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 28px;
  padding: 36px 0 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Sidebar
// ─────────────────────────────────────────────────────────────────────────────

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-self: flex-start;
  position: sticky;
  top: 90px;

  @media (max-width: 900px) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 10px;
  border-bottom: 1px solid #ede8e0;
  margin-bottom: 4px;

  @media (max-width: 900px) { display: none; }
`;

export const SidebarTitle = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3d2b1a;
`;

export const FilterBadge = styled.span`
  background: #6b9c3e;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FilterItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "transparent"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.09)" : "transparent"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#5a4a3a"};
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? "700" : "600"};
  cursor: pointer;
  text-align: left;
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease;

  &:hover:not([disabled]) {
    background: rgba(107, 156, 62, 0.07);
    color: #6b9c3e;
  }

  @media (max-width: 900px) {
    width: auto;
    padding: 8px 14px;
    font-size: 12px;
  }
`;

export const FilterItemIcon = styled.span`
  font-size: 15px;
  flex-shrink: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Filter panel (sub-panel under active category)
// ─────────────────────────────────────────────────────────────────────────────

export const FilterPanel = styled.div`
  background: #f7f3ee;
  border-radius: 14px;
  padding: 14px;
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeIn} 0.2s ease;
`;

export const FilterLabel = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a6a58;
  margin: 0 0 6px;
`;

export const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
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

export const StarRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const StarBtn = styled.button`
  padding: 5px 10px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.12)" : "#fff"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#7a6a58"};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover { border-color: #6b9c3e; color: #6b9c3e; }
`;

export const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 9px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #6b9c3e;
    cursor: pointer;
  }
`;

export const TagsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const TagBtn = styled.button`
  padding: 5px 12px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.12)" : "#fff"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#7a6a58"};
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover { border-color: #6b9c3e; color: #6b9c3e; }
`;

export const SortWrap = styled.div`
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid #ede8e0;

  @media (max-width: 900px) { display: none; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Guide list
// ─────────────────────────────────────────────────────────────────────────────

export const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  gap: 12px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 48px;
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
  margin-top: 6px;
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease;

  &:hover {
    background: #f7f3ee;
    border-color: #6b9c3e;
    color: #6b9c3e;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  GuideListItem card
// ─────────────────────────────────────────────────────────────────────────────

export const ListCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border-radius: 18px;
  padding: 16px 20px;
  border: 1.5px solid #ede8e0;
  cursor: pointer;
  transition: border-color 0.22s ease, box-shadow 0.22s ease,
              transform 0.2s ease;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $index }) => $index * 45}ms;

  &:hover {
    border-color: #b8d48a;
    box-shadow: 0 6px 24px rgba(107, 156, 62, 0.1);
    transform: translateX(4px);
  }
`;

export const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 2.5px solid #e8f0d8;
`;

export const VerifiedDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #6b9c3e;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
`;

export const CardInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const GuideName = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

export const MetaItem = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #7a6a58;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const LangsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const LangTag = styled.span`
  background: #f0f5e0;
  color: #6b9c3e;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 9px;
  border-radius: 9999px;
  border: 1px solid #dde8cc;
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Stars = styled.span`
  display: flex;
  align-items: center;
  gap: 1px;
  color: #f4b942;
`;

export const RatingNum = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #3d2b1a;
`;

export const ViewBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #6b9c3e;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 7px 16px;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s ease, gap 0.15s ease;

  &:hover { background: #c8761a; gap: 8px; }
`;
