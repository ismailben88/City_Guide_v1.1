// pages/PlaceDetailPage.styles.js
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0);     }
`;

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1);    }
`;

export const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────────────────────

export const PageWrap = styled.div`
  min-height: 100vh;
  background: #f5f0ea;
  font-family: 'Nunito', sans-serif;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Hero
// ─────────────────────────────────────────────────────────────────────────────

export const HeroWrap = styled.div`
  position: relative;
  width: 100%;
  height: 520px;
  overflow: hidden;

  @media (max-width: 768px) { height: 320px; }
`;

export const HeroImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 8s ease;

  ${HeroWrap}:hover & { transform: scale(1.04); }
`;

export const HeroGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(0,0,0,0.08) 0%,
    transparent 35%,
    rgba(20,12,5,0.82) 100%
  );
`;

export const BackBtn = styled.button`
  position: absolute;
  top: 24px;
  left: 28px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.22);
  color: #fff;
  border-radius: 9999px;
  padding: 8px 18px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.22s ease, transform 0.18s ease;

  &:hover {
    background: rgba(255,255,255,0.24);
    transform: translateX(-3px);
  }
`;

export const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 48px;
  animation: ${fadeUp} 0.6s ease 0.1s both;

  @media (max-width: 768px) { padding: 24px 20px; }
`;

export const HeroCategoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

export const HeroCategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(107,156,62,0.85);
  backdrop-filter: blur(6px);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 13px;
  border-radius: 9999px;
`;

export const HeroCityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 13px;
  border-radius: 9999px;
`;

export const HeroTitle = styled.h1`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 14px;
  line-height: 1.15;
  text-shadow: 0 2px 20px rgba(0,0,0,0.25);
  max-width: 700px;
`;

export const HeroTagsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
`;

export const HeroTag = styled.span`
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.88);
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 11px;
  border-radius: 9999px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Floating stats bar
// ─────────────────────────────────────────────────────────────────────────────

export const StatsBar = styled.div`
  display: flex;
  align-items: stretch;
  max-width: 860px;
  margin: -28px auto 0;
  position: relative;
  z-index: 20;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 40px rgba(61,43,26,0.14);
  border: 1.5px solid #ede8e0;
  overflow: hidden;
  animation: ${fadeUp} 0.5s ease 0.2s both;

  @media (max-width: 768px) {
    margin: -16px 16px 0;
    border-radius: 16px;
  }
`;

export const StatCell = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 18px 12px;
  border-right: 1px solid #f0ebe4;
  cursor: ${({ $clickable }) => $clickable ? "pointer" : "default"};
  transition: background 0.18s ease;

  &:last-child { border-right: none; }

  &:hover {
    background: ${({ $clickable }) => $clickable ? "#faf7f3" : "transparent"};
  }
`;

export const StatIcon = styled.div`
  color: #6b9c3e;
  display: flex;
  align-items: center;
`;

export const StatVal = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #3d2b1a;
`;

export const StatLbl = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #b0a090;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const StarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #f4b942;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Layout
// ─────────────────────────────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 28px 80px;

  @media (max-width: 768px) { padding: 24px 16px 60px; }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: flex-start;

  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Cards
// ─────────────────────────────────────────────────────────────────────────────

export const Card = styled.div`
  background: #fff;
  border-radius: 22px;
  border: 1.5px solid #ede8e0;
  padding: 28px;
  margin-bottom: 22px;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${({ $delay }) => $delay || "0ms"};

  &:last-child { margin-bottom: 0; }
`;

export const CardLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b0a090;
  margin-bottom: 16px;
`;

export const DescText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 14.5px;
  color: #5a4633;
  line-height: 1.85;
  margin: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Gallery
// ─────────────────────────────────────────────────────────────────────────────

export const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
`;

export const GalleryThumb = styled.div`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(61,43,26,0);
    transition: background 0.25s ease;
  }

  &:hover img { transform: scale(1.08); }
  &:hover::after { background: rgba(61,43,26,0.18); }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Map
// ─────────────────────────────────────────────────────────────────────────────

export const MapWrap = styled.div`
  border-radius: 16px;
  overflow: hidden;
  height: 240px;
  border: 1.5px solid #ede8e0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Contact
// ─────────────────────────────────────────────────────────────────────────────

export const ContactRow = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 13px;
  background: #faf7f3;
  border: 1.5px solid #ede8e0;
  color: #3d2b1a;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 9px;
  transition: all 0.18s ease;

  &:last-child { margin-bottom: 0; }

  &:hover {
    background: rgba(107,156,62,0.07);
    border-color: #b8d48a;
    color: #6b9c3e;
    transform: translateX(3px);
  }
`;

export const ContactIconWrap = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(107,156,62,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b9c3e;
  flex-shrink: 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Chips
// ─────────────────────────────────────────────────────────────────────────────

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f0f5e0;
  color: #6b9c3e;
  border: 1.5px solid #dde8cc;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 14px;
  border-radius: 9999px;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Sidebar — pricing
// ─────────────────────────────────────────────────────────────────────────────

export const PriceWrap = styled.div`
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 18px;

  strong {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 32px;
    font-weight: 700;
    color: #3d2b1a;
    line-height: 1;
  }

  span {
    font-family: 'Nunito', sans-serif;
    font-size: 13px;
    color: #9e8e80;
  }
`;

export const FreeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(107,156,62,0.1);
  border: 1.5px solid #dde8cc;
  color: #6b9c3e;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  padding: 8px 18px;
  border-radius: 12px;
  margin-bottom: 18px;
`;

export const BookBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #6b9c3e, #5a8532);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.22s ease;
  box-shadow: 0 4px 16px rgba(107,156,62,0.3);

  &:hover {
    background: linear-gradient(135deg, #c8761a, #b36516);
    box-shadow: 0 6px 22px rgba(200,118,26,0.35);
    transform: translateY(-1px);
  }

  &:active { transform: translateY(0); }
`;

export const ShareBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px;
  border-radius: 12px;
  border: 1.5px solid #e0d8ce;
  background: transparent;
  color: #7a6a58;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.18s ease;

  &:hover { background: #f0ebe4; color: #3d2b1a; border-color: #c8b8a8; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Reviews
// ─────────────────────────────────────────────────────────────────────────────

export const ReviewsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

export const AvgRatingBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const BigRating = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 42px;
  font-weight: 700;
  color: #3d2b1a;
  line-height: 1;
`;

export const RatingMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const StarsDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #f4b942;
`;

export const ReviewCountText = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #9e8e80;
  font-weight: 600;
`;

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
`;

export const ReviewCard = styled.div`
  display: flex;
  gap: 14px;
  padding: 18px;
  background: #faf7f3;
  border-radius: 16px;
  border: 1.5px solid #ede8e0;
  animation: ${slideRight} 0.35s ease both;
  animation-delay: ${({ $i }) => `${$i * 60}ms`};
  transition: border-color 0.18s ease;

  &:hover { border-color: #c8b8a8; }
`;

export const ReviewAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #dde8cc;
  flex-shrink: 0;
`;

export const ReviewBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 8px;
  flex-wrap: wrap;
`;

export const ReviewAuthor = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #3d2b1a;
`;

export const ReviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

export const ReviewDate = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #b0a090;
`;

export const ReviewCountry = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  color: #9e8e80;
  font-weight: 600;
`;

export const ReviewStars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #f4b942;
  margin-bottom: 8px;
`;

export const ReviewText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13.5px;
  color: #5a4633;
  line-height: 1.7;
  margin: 0;
`;

export const EmptyReviews = styled.div`
  text-align: center;
  padding: 32px 20px;
  color: #b0a090;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 600;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Add Review Form
// ─────────────────────────────────────────────────────────────────────────────

export const FormDivider = styled.div`
  height: 1px;
  background: linear-gradient(to right, transparent, #e0d8ce, transparent);
  margin: 24px 0;
`;

export const FormHeading = styled.h4`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #b0a090;
  margin: 0 0 18px;
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const StarPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 6px;
`;

export const StarPickerBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  font-size: 26px;
  color: ${({ $lit }) => $lit ? "#f4b942" : "#ddd8d0"};
  line-height: 1;
  transition: color 0.14s ease, transform 0.12s ease;

  &:hover { transform: scale(1.25); }
`;

export const RatingLabel = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #f4b942;
  margin-left: 8px;
  animation: ${popIn} 0.2s ease;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

export const FormInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1.5px solid ${({ $err }) => $err ? "#e05a5a" : "#e0d8ce"};
  background: #faf7f3;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #3d2b1a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder { color: #b8ae a4; font-weight: 400; }
  &:focus {
    border-color: #6b9c3e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(107,156,62,0.1);
  }
  &:disabled { opacity: 0.65; cursor: default; }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 13px;
  border: 1.5px solid ${({ $err }) => $err ? "#e05a5a" : "#e0d8ce"};
  background: #faf7f3;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #3d2b1a;
  resize: vertical;
  min-height: 100px;
  outline: none;
  margin-bottom: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder { color: #b8aaa4; font-weight: 400; }
  &:focus {
    border-color: #6b9c3e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(107,156,62,0.1);
  }
  &:disabled { opacity: 0.65; cursor: default; }
`;

export const FieldErr = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #e05a5a;
  margin: -6px 0 10px 2px;
`;

export const SubmitBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px;
  border-radius: 13px;
  border: none;
  background: linear-gradient(135deg, #6b9c3e, #5a8532);
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.22s ease;
  box-shadow: 0 4px 14px rgba(107,156,62,0.25);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #c8761a, #b36516);
    box-shadow: 0 6px 20px rgba(200,118,26,0.3);
    transform: translateY(-1px);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const SuccessBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(107,156,62,0.1);
  border: 1.5px solid rgba(107,156,62,0.28);
  border-radius: 13px;
  padding: 12px 16px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #6b9c3e;
  margin-bottom: 16px;
  animation: ${popIn} 0.3s ease;
`;

export const LoginNudge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #faf7f3;
  border: 1.5px solid #ede8e0;
  border-radius: 14px;
  padding: 15px 18px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #7a6a58;
  margin-bottom: 4px;
`;

export const LoginNudgeBtn = styled.button`
  background: none;
  border: none;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  color: #6b9c3e;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  &:hover { color: #c8761a; }
`;
