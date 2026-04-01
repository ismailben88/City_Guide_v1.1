// pages/AccountPage.styles.js
import styled, { keyframes } from "styled-components";

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
//  Page
// ─────────────────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: #f7f4f0;
`;

export const PageHeader = styled.div`
  background: #3d2b1a;
  padding: 28px 40px;
  @media (max-width: 768px) { padding: 20px; }
`;

export const PageTitle = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 3px;
  animation: ${fadeUp} 0.5s ease both;
`;

export const PageSub = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin: 0;
  animation: ${fadeUp} 0.5s ease 0.07s both;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Layout
// ─────────────────────────────────────────────────────────────────────────────

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  max-width: 1100px;
  margin: 32px auto 60px;
  padding: 0 28px;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 0 16px;
    margin-top: 20px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Sidebar
// ─────────────────────────────────────────────────────────────────────────────

export const Sidebar = styled.aside`
  background: #fff;
  border-radius: 20px;
  border: 1.5px solid #ede8e0;
  overflow: hidden;
  position: sticky;
  top: 90px;
  animation: ${fadeUp} 0.45s ease both;

  @media (max-width: 900px) { position: static; }
`;

export const SidebarProfile = styled.div`
  background: linear-gradient(145deg, #3d2b1a 0%, #5c3d24 100%);
  padding: 28px 20px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
`;

export const AvatarWrap = styled.div`
  position: relative;
  width: 78px;
  height: 78px;
`;

export const Avatar = styled.img`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(200,217,138,0.45);
  display: block;
`;

export const AvatarEditBtn = styled.button`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: #6b9c3e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s ease;
  &:hover { background: #c8761a; }
`;

export const SidebarName = styled.h2`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

export const SidebarEmail = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin: 0;
`;

export const SidebarBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(107,156,62,0.22);
  color: #c8d98a;
  border: 1px solid rgba(200,217,138,0.28);
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
`;

export const SidebarNav = styled.nav`
  padding: 10px 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const SidebarTab = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "transparent"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.1)" : "transparent"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#5a4a3a"};
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: ${({ $active }) => $active ? "700" : "600"};
  cursor: pointer;
  text-align: left;
  transition: all 0.18s ease;

  &:hover { background: rgba(107,156,62,0.07); color: #6b9c3e; }
`;

export const TabIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Content
// ─────────────────────────────────────────────────────────────────────────────

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.28s ease;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Section card
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  border: 1.5px solid #ede8e0;
  padding: 24px;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $delay }) => $delay || "0ms"};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const CardTitle = styled.h3`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #7a6a58;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 7px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Fields
// ─────────────────────────────────────────────────────────────────────────────

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols || 2}, 1fr)`};
  gap: 16px;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #9e8e80;
  letter-spacing: 0.05em;
`;

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FieldInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1.5px solid ${({ $editing }) => $editing ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $editing }) => $editing ? "#fff" : "#fafaf8"};
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 0;

  &:focus {
    border-color: #6b9c3e;
    box-shadow: 0 0 0 3px rgba(107,156,62,0.1);
  }
  &:disabled { background: #fafaf8; color: #7a6a58; cursor: default; }
  &::placeholder { color: #b0a090; }
`;

export const FieldSelect = styled.select`
  flex: 1;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1.5px solid #e0d8ce;
  background: #fafaf8;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #6b9c3e; }
`;

export const EditBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.1)" : "transparent"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#9e8e80"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;
  &:hover { border-color: #6b9c3e; color: #6b9c3e; background: rgba(107,156,62,0.08); }
`;

export const DeleteBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1.5px solid transparent;
  background: transparent;
  color: #c0a090;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s ease;
  &:hover { border-color: rgba(224,90,90,0.3); background: rgba(224,90,90,0.08); color: #e05a5a; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Chips
// ─────────────────────────────────────────────────────────────────────────────

export const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const Chip = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.12)" : "#f0ebe4"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#7a6a58"};
  border: 1.5px solid ${({ $active }) => $active ? "#dde8cc" : "#e0d8ce"};
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 13px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover { background: rgba(107,156,62,0.12); color: #6b9c3e; border-color: #dde8cc; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Availability days grid
// ─────────────────────────────────────────────────────────────────────────────

export const AvailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  @media (max-width: 640px) { grid-template-columns: repeat(4, 1fr); }
`;

export const DayBtn = styled.button`
  padding: 8px 4px;
  border-radius: 10px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.12)" : "#fafaf8"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#9e8e80"};
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all 0.18s ease;
  &:hover { border-color: #6b9c3e; color: #6b9c3e; background: rgba(107,156,62,0.08); }
`;

export const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const TimeInput = styled.input`
  padding: 9px 12px;
  border-radius: 11px;
  border: 1.5px solid #e0d8ce;
  background: #fafaf8;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  &:focus { border-color: #6b9c3e; }
`;

export const TimeSep = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #9e8e80;
  font-weight: 700;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Save bar
// ─────────────────────────────────────────────────────────────────────────────

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
`;

export const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 28px;
  border-radius: 12px;
  border: none;
  background: #6b9c3e;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease;
  &:hover { background: #c8761a; transform: scale(1.02); }
`;

export const CancelBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 20px;
  border-radius: 12px;
  border: 1.5px solid #e0d8ce;
  background: transparent;
  color: #7a6a58;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover { background: #f0ebe4; color: #3d2b1a; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Profile type selector
// ─────────────────────────────────────────────────────────────────────────────

export const ProfileTabsRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ProfileTypeBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 12px;
  border: 1.5px solid ${({ $active }) => $active ? "#6b9c3e" : "#e0d8ce"};
  background: ${({ $active }) => $active ? "rgba(107,156,62,0.1)" : "transparent"};
  color: ${({ $active }) => $active ? "#6b9c3e" : "#7a6a58"};
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover { border-color: #6b9c3e; color: #6b9c3e; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Linked accounts row
// ─────────────────────────────────────────────────────────────────────────────

export const LinkedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #fafaf8;
  border-radius: 12px;
  border: 1.5px solid #ede8e0;
  margin-bottom: 8px;
  transition: border-color 0.18s ease;
  &:hover { border-color: #c8b8a8; }
`;

export const LinkedIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(107,156,62,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b9c3e;
  flex-shrink: 0;
`;

export const LinkedInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  min-width: 0;
  &::placeholder { color: #b0a090; }
`;

export const AddLinkedBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1.5px dashed #c8b8a8;
  background: transparent;
  color: #9e8e80;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: all 0.18s ease;
  margin-top: 4px;
  &:hover { border-color: #6b9c3e; color: #6b9c3e; background: rgba(107,156,62,0.05); }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Business Profile — new styled components
// ─────────────────────────────────────────────────────────────────────────────

export const BusinessFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1.5px solid #e0d8ce;
  background: #fafaf8;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  resize: vertical;
  min-height: 90px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: #6b9c3e;
    box-shadow: 0 0 0 3px rgba(107,156,62,0.1);
  }
  &::placeholder { color: #b0a090; font-weight: 400; }
`;

export const BizSelect = styled.select`
  flex: 1;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1.5px solid #e0d8ce;
  background: #fafaf8;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  cursor: pointer;
  &:focus { border-color: #6b9c3e; }
`;

export const ImageUploadBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1.5px dashed #c8b8a8;
  background: #fafaf8;
  cursor: pointer;
  color: #9e8e80;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.18s ease;
  &:hover { border-color: #6b9c3e; color: #6b9c3e; background: rgba(107,156,62,0.04); }
`;

export const AddBusinessBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 28px;
  border-radius: 12px;
  border: none;
  background: #c8761a;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease;
  &:hover { background: #a85e10; transform: scale(1.02); }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;

export const BusinessListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const BusinessListTitle = styled.h3`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
`;

export const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1.5px solid #e0d8ce;
  background: transparent;
  color: #7a6a58;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover { border-color: #c8761a; color: #c8761a; }
`;

export const BusinessCard = styled.div`
  border: 1.5px solid #ede8e0;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
  margin-bottom: 16px;
`;

export const BusinessCardTitle = styled.div`
  margin-bottom: 14px;
`;

export const BusinessCardBody = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export const BusinessImgGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  border-radius: 12px;
  overflow: hidden;
`;

export const BusinessImg = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
  &:first-child {
    grid-column: 1 / -1;
    height: 110px;
  }
`;

export const BusinessImgPlaceholder = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: #f0ebe4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0a090;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
`;

export const BusinessDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BusinessMeta = styled.div`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #9e8e80;
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    color: #3d2b1a;
    font-weight: 600;
    font-size: 13px;
  }
`;

export const BusinessDescBox = styled.div`
  border: 1.5px solid #ede8e0;
  border-radius: 10px;
  padding: 10px 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #5a4a3a;
  line-height: 1.6;
  background: #fafaf8;
  max-height: 120px;
  overflow-y: auto;
`;

export const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BusinessCardActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  align-items: center;
`;

export const VisitBtn = styled.button`
  padding: 9px 20px;
  border-radius: 10px;
  border: 1.5px solid #e0d8ce;
  background: transparent;
  color: #5a4a3a;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  &:hover { background: #f0ebe4; }
`;

export const CommitBtn = styled.button`
  padding: 9px 20px;
  border-radius: 10px;
  border: none;
  background: #c8761a;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease;
  &:hover { background: #a85e10; transform: scale(1.02); }
`;

export const EmptyBusinesses = styled.div`
  text-align: center;
  padding: 32px 0;
  color: #9e8e80;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
`;