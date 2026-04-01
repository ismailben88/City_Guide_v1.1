// components/layout/Footer.styles.js
import styled, { keyframes } from "styled-components";

// ─────────────────────────────────────────────────────────────────────────────
//  Keyframes
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0);    }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Footer wrapper
// ─────────────────────────────────────────────────────────────────────────────

export const FooterWrap = styled.footer`
  background: #3d2b1a;
  color: #c8b89a;
  font-family: 'Nunito', sans-serif;
  padding: 60px 0 0;
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Inner container
// ─────────────────────────────────────────────────────────────────────────────

export const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Top grid — brand + columns
// ─────────────────────────────────────────────────────────────────────────────

export const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 40px;
  padding-bottom: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Brand column
// ─────────────────────────────────────────────────────────────────────────────

export const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BrandName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LogoText = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;

  span { color: #6b9c3e; }
`;

export const BrandDesc = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: #a09880;
  margin: 0;
  max-width: 240px;
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

export const SocialBtn = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #c8b89a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease,
              color 0.2s ease, transform 0.15s ease;

  &:hover {
    background: rgba(107, 156, 62, 0.22);
    border-color: rgba(107, 156, 62, 0.5);
    color: #c8d98a;
    transform: translateY(-2px);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Link columns
// ─────────────────────────────────────────────────────────────────────────────

export const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ColTitle = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  margin: 0 0 4px;
`;

export const FooterLink = styled.a`
  font-size: 13px;
  color: #a09880;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  width: fit-content;
  transition: color 0.18s ease, gap 0.15s ease;

  &:hover {
    color: #c8d98a;
    gap: 9px;
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Contact items
// ─────────────────────────────────────────────────────────────────────────────

export const ContactItem = styled.a`
  font-size: 13px;
  color: #a09880;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover { color: #c8d98a; }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Newsletter strip
// ─────────────────────────────────────────────────────────────────────────────

export const NewsletterStrip = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 28px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 680px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const NewsletterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NewsletterTitle = styled.p`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
`;

export const NewsletterSub = styled.p`
  font-size: 12px;
  color: #7a7060;
  margin: 0;
`;

export const NewsletterForm = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 9px 16px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #f5ede0;
  width: 220px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;

  &::placeholder { color: #7a7060; }

  &:focus {
    border-color: rgba(107, 156, 62, 0.55);
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 480px) {
    flex: 1;
    width: auto;
  }
`;

export const NewsletterBtn = styled.button`
  background: #6b9c3e;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 9px 20px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s ease, transform 0.15s ease;

  &:hover {
    background: #c8761a;
    transform: scale(1.03);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
//  Bottom bar
// ─────────────────────────────────────────────────────────────────────────────

export const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  gap: 12px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }
`;

export const Copyright = styled.span`
  font-size: 12px;
  color: #5a5040;
`;

export const BottomLinks = styled.div`
  display: flex;
  gap: 20px;
`;

export const BottomLink = styled.a`
  font-size: 12px;
  color: #5a5040;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.18s ease;

  &:hover { color: #a09880; }
`;
