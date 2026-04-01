// pages/NotificationsPage.styles.js
import styled, { keyframes, css } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
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
//  Page header
// ─────────────────────────────────────────────────────────────────────────────

export const PageHeader = styled.div`
  background: #3d2b1a;
  padding: 32px 40px 28px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 600px) {
    padding: 24px 20px 20px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageEyebrow = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #6b9c3e;
`;

export const PageTitle = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.15;
`;

export const UnreadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(107, 156, 62, 0.2);
  border: 1px solid rgba(107, 156, 62, 0.4);
  color: #c8d98a;
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 9999px;
`;

export const MarkAllBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: rgba(107, 156, 62, 0.18);
    border-color: rgba(107, 156, 62, 0.5);
    color: #c8d98a;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Layout: sidebar + content
// ─────────────────────────────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 28px 60px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    padding: 20px 16px 48px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Sidebar
// ─────────────────────────────────────────────────────────────────────────────

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-self: flex-start;
  position: sticky;
  top: 90px;

  @media (max-width: 860px) {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const SidebarLabel = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9e8e80;
  margin: 0 0 8px 6px;

  @media (max-width: 860px) { display: none; }
`;

export const CatBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
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
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;

  &:hover:not([disabled]) {
    background: rgba(107, 156, 62, 0.07);
    color: #6b9c3e;
  }

  @media (max-width: 860px) {
    width: auto;
    padding: 7px 14px;
    font-size: 12px;
  }
`;

export const CatCount = styled.span`
  background: ${({ $active }) => $active ? "#6b9c3e" : "#ede8e0"};
  color: ${({ $active }) => $active ? "#fff" : "#9e8e80"};
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 9999px;
  flex-shrink: 0;
  transition: background 0.18s ease, color 0.18s ease;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Content panel
// ─────────────────────────────────────────────────────────────────────────────

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Toolbar
// ─────────────────────────────────────────────────────────────────────────────

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 16px;
  padding: 10px 14px;
  border: 1.5px solid #ede8e0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 4px;
`;

export const ToolSearchWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const ToolSearchIcon = styled.div`
  color: #b0a090;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const ToolSearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #3d2b1a;
  min-width: 0;

  &::placeholder { color: #c0b4a8; font-weight: 400; }
`;

export const ToolDivider = styled.div`
  width: 1px;
  height: 22px;
  background: #e0d8ce;
  flex-shrink: 0;
`;

export const ToolBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "transparent"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.1)" : "transparent"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#9e8e80"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.18s ease, border-color 0.18s ease,
              color 0.18s ease, transform 0.15s ease;

  &:hover {
    background: rgba(107, 156, 62, 0.08);
    color: #6b9c3e;
    transform: scale(1.08);
  }

  &:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
`;

export const DeleteBtn = styled(ToolBtn)`
  &:hover {
    background: rgba(224, 90, 90, 0.08);
    color: #e05a5a;
    border-color: transparent;
  }
`;

export const DateChip = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 9999px;
  border: 1.5px solid #e0d8ce;
  background: #f7f3ee;
  color: #7a6a58;
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover { background: #ede8e0; border-color: #c8b8a8; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Notification item
// ─────────────────────────────────────────────────────────────────────────────

export const NotifItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #fff;
  border-radius: 16px;
  padding: 16px 18px;
  border: 1.5px solid ${({ $unread }) => $unread ? "#ddeacc" : "#ede8e0"};
  background: ${({ $unread }) => $unread ? "#f8fdf2" : "#fff"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $index }) => $index * 40}ms;

  &:hover {
    border-color: #b8d48a;
    box-shadow: 0 6px 20px rgba(107, 156, 62, 0.1);
    transform: translateX(3px);
  }
`;

export const NotifIconWrap = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: ${({ $color }) => $color || "rgba(107,156,62,0.12)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $iconColor }) => $iconColor || "#6b9c3e"};
  font-size: 18px;
`;

export const NotifBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const NotifText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: ${({ $unread }) => $unread ? "700" : "500"};
  color: ${({ $unread }) => $unread ? "#3d2b1a" : "#5a4a3a"};
  margin: 0;
  line-height: 1.45;
`;

export const NotifMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NotifTime = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #b0a090;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const UnreadDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6b9c3e;
  flex-shrink: 0;
  margin-top: 6px;
`;

export const NotifActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.18s ease;

  ${NotifItem}:hover & { opacity: 1; }
`;

export const SmallActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1.5px solid transparent;
  background: transparent;
  color: #b0a090;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;

  &:hover {
    background: ${({ $danger }) => $danger ? "rgba(224,90,90,0.08)" : "rgba(107,156,62,0.08)"};
    color: ${({ $danger }) => $danger ? "#e05a5a" : "#6b9c3e"};
    border-color: ${({ $danger }) => $danger ? "rgba(224,90,90,0.2)" : "rgba(107,156,62,0.2)"};
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Empty state
// ─────────────────────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  gap: 12px;
  text-align: center;
  background: #fff;
  border-radius: 20px;
  border: 1.5px dashed #e0d8ce;
  animation: ${fadeIn} 0.3s ease;
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
