// GuideProfilePage.styles.js
import styled, { keyframes } from "styled-components";

// ─── Keyframes ───────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// FIX: scaleIn must keep translateX(-50%) so avatar stays centered during animation
export const scaleIn = keyframes`
  from { opacity: 0; transform: translateX(-50%) scale(0.88); }
  to   { opacity: 1; transform: translateX(-50%) scale(1);    }
`;

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

// ─── Banner ───────────────────────────────────────────────────────────────────
// FIX 1: add fallback gradient so banner never appears blank
// FIX 2: img uses position:absolute + inset:0 so it always fills the container

// export const Banner = styled.div`
//   position: relative;
//   width: 100%;
//   height: 260px;
//   overflow: hidden;
//   background: linear-gradient(135deg, #4a3520 0%, #7a5c3a 55%, #a07840 100%);

//   img {
//     position: absolute;
//     inset: 0;
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     object-position: center 40%;
//     display: block;
//   }
// `; 
export const Banner = styled.div`
  position: relative;
  width: 100%;
  height: 260px;
  background: linear-gradient(135deg, #4a3520 0%, #7a5c3a 55%, #a07840 100%);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
    display: block;
  }
`;

export const BannerOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    transparent 30%,
    rgba(61, 43, 26, 0.72) 100%
  );
`;

export const BackBtn = styled.button`
  position: absolute;
  top: 18px;
  left: 22px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border-radius: 9999px;
  padding: 7px 16px;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.28);
    transform: translateX(-2px);
  }
`;

// ─── Avatar ───────────────────────────────────────────────────────────────────
// FIX 3: z-index: 20 so avatar sits above BannerOverlay (z-index: 1)
// FIX 4: scaleIn keeps translateX(-50%) — avatar won't jump during animation

// export const AvatarWrap = styled.div`
//   position: absolute;
//   /* bottom = -(avatarHeight / 2) so exactly half inside banner, half below */
//   bottom: -45px;
//   left: 50%;
//   transform: translateX(-50%);
//   z-index: 20;
//   width: 90px;
//   height: 90px;
//   border-radius: 50%;
//   border: 4px solid #fff;
//   overflow: hidden;
//   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);

//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//     object-position: center top; /* keeps face visible */
//     display: block;
//   }
// `;
export const AvatarWrap = styled.div`
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #fff;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
  background: #ddd;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
`;
// ─── Profile header ───────────────────────────────────────────────────────────
// padding-top = 45px (avatar half) + 45px (avatar half above) + 16px gap = 106px total
// simpler: avatarHeight(90) - offset(45) + gap(20) = 65px

// export const ProfileHeader = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 6px;
//   padding: 65px 20px 24px;
//   text-align: center;
//   animation: ${fadeUp} 0.5s ease 0.15s both;
// `;
export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 65px 20px 24px;
  text-align: center;
  animation: ${fadeUp} 0.5s ease 0.15s both;
`;
export const GuideName = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(107, 156, 62, 0.12);
  color: #6b9c3e;
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(107, 156, 62, 0.25);
`;

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const Stars = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #f4b942;
`;

export const RatingNum = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #3d2b1a;
`;

export const ReviewCount = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  color: #9e8e80;
`;

export const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
`;

export const Tag = styled.span`
  background: #f0f5e0;
  color: #6b9c3e;
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 9999px;
  border: 1px solid #dde8cc;
`;

export const ContactBookBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: #6b9c3e;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 10px 28px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 6px;
  box-shadow: 0 4px 14px rgba(107, 156, 62, 0.32);
  transition:
    background 0.18s ease,
    transform 0.15s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #c8761a;
    box-shadow: 0 6px 18px rgba(200, 118, 26, 0.32);
    transform: scale(1.04);
  }

  &:active {
    transform: scale(0.97);
  }
`;

// ─── Stats strip ──────────────────────────────────────────────────────────────

export const StatsStrip = styled.div`
  display: flex;
  justify-content: center;
  max-width: 540px;
  margin: 28px auto 32px;
  background: #fff;
  border: 1.5px solid #ede8e0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  animation: ${fadeUp} 0.45s ease 0.28s both;
`;

export const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 16px 12px;
  border-right: 1px solid #ede8e0;
  text-align: center;

  &:last-child {
    border-right: none;
  }
`;

export const StatValue = styled.span`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #3d2b1a;
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #9e8e80;
`;

// ─── Container + layout ───────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 28px 64px;

  @media (max-width: 768px) {
    padding: 0 16px 48px;
  }
`;

export const BodyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 28px;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Section card ─────────────────────────────────────────────────────────────

export const SectionCard = styled.div`
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #ede8e0;
  padding: 24px;
  margin-bottom: 20px;
  animation: ${fadeUp} 0.45s ease both;
  animation-delay: ${({ $delay }) => $delay || "0ms"};
`;

export const SectionTitle = styled.h3`
  font-family: "Nunito", sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #7a6a58;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const DescText = styled.p`
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  color: #5a4a3a;
  line-height: 1.75;
  margin: 0;
`;

// ─── Contact ──────────────────────────────────────────────────────────────────

export const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 11px;
  background: #f7f3ee;
  border: 1.5px solid #ede8e0;
  color: #3d2b1a;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.18s,
    border-color 0.18s,
    color 0.18s;

  &:hover {
    background: rgba(107, 156, 62, 0.08);
    border-color: #b8d48a;
    color: #6b9c3e;
  }
`;

export const ContactIcon = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(107, 156, 62, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b9c3e;
  flex-shrink: 0;
`;

// ─── Availability ─────────────────────────────────────────────────────────────

export const AvailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid #f0ebe4;

  &:last-child {
    border-bottom: none;
  }
`;

export const AvailLabel = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #9e8e80;
  width: 52px;
  flex-shrink: 0;
`;

export const AvailValue = styled.span`
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
`;

// ─── Chips ────────────────────────────────────────────────────────────────────

export const InfoChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const InfoChip = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f0f5e0;
  color: #6b9c3e;
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 9999px;
  border: 1px solid #dde8cc;
`;

// ─── Price ────────────────────────────────────────────────────────────────────

export const PriceTag = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  padding: 8px 0 4px;

  strong {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #3d2b1a;
    line-height: 1;
  }

  span {
    font-family: "Nunito", sans-serif;
    font-size: 13px;
    color: #9e8e80;
  }
`;
