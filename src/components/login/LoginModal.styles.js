// components/LoginModal.styles.js
import styled, { keyframes } from "styled-components";

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1);    }
`;

// ─── Overlay ──────────────────────────────────────────────────────────────────
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(30, 20, 10, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.22s ease;
`;

export const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 24px;
  padding: 40px 36px 32px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
  animation: ${slideUp} 0.3s cubic-bezier(.25,.8,.25,1);

  @media (max-width: 480px) {
    padding: 32px 24px 26px;
    border-radius: 20px;
  }
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #e0d8ce;
  background: #f7f3ee;
  color: #7a6a58;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;

  &:hover { background: #3d2b1a; color: #fff; border-color: #3d2b1a; }
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
export const LogoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
`;

export const LogoText = styled.span`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 700;
  color: #3d2b1a;
  span { color: #6b9c3e; }
`;

// ─── Headings ─────────────────────────────────────────────────────────────────
export const ModalTitle = styled.h2`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0 0 6px;
  text-align: center;
`;

export const ModalSubtitle = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #9e8e80;
  margin: 0 0 22px;
  text-align: center;
`;

// ─── Inputs ───────────────────────────────────────────────────────────────────
export const InputWrap = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #b0a090;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px 11px 40px;
  border-radius: 12px;
  border: 1.5px solid ${({ $error }) => $error ? "#e05a5a" : "#e0d8ce"};
  background: #fafaf8;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #3d2b1a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder { color: #b0a090; font-weight: 400; }

  &:focus {
    border-color: #6b9c3e;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(107, 156, 62, 0.1);
  }
`;

export const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #b0a090;
  display: flex;
  align-items: center;
  transition: color 0.18s ease;
  &:hover { color: #6b9c3e; }
`;

export const ErrorMsg = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #e05a5a;
  margin: -6px 0 8px 4px;
`;

export const ServerError = styled.div`
  background: rgba(224, 90, 90, 0.08);
  border: 1.5px solid rgba(224, 90, 90, 0.25);
  border-radius: 10px;
  padding: 9px 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #c04040;
  margin-bottom: 14px;
  text-align: center;
`;

// ─── Forgot ───────────────────────────────────────────────────────────────────
export const ForgotRow = styled.div`
  text-align: right;
  margin: -4px 0 16px;
`;

export const ForgotLink = styled.button`
  background: none;
  border: none;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #c8761a;
  cursor: pointer;
  padding: 0;
  &:hover { color: #3d2b1a; }
`;

// ─── Buttons ──────────────────────────────────────────────────────────────────
export const PrimaryBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: #6b9c3e;
  color: #fff;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.18s ease, transform 0.15s ease;

  &:hover:not(:disabled) { background: #c8761a; transform: scale(1.01); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

export const GoogleBtn = styled.button`
  width: 100%;
  padding: 11px;
  border-radius: 12px;
  border: 1.5px solid #e0d8ce;
  background: #fff;
  color: #3d2b1a;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover { background: #f7f3ee; border-color: #c8b8a8; }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 0;

  &::before, &::after { content: ''; flex: 1; height: 1px; background: #e0d8ce; }

  span {
    font-family: 'Nunito', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #b0a090;
    white-space: nowrap;
  }
`;

// ─── Switch ───────────────────────────────────────────────────────────────────
export const SwitchRow = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #9e8e80;
  text-align: center;
  margin: 14px 0 0;

  button {
    background: none;
    border: none;
    font-family: 'Nunito', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #6b9c3e;
    cursor: pointer;
    margin-left: 4px;
    padding: 0;
    &:hover { color: #c8761a; }
  }
`;

// ─── Success ──────────────────────────────────────────────────────────────────
export const SuccessWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  text-align: center;
  animation: ${popIn} 0.35s cubic-bezier(.25,.8,.25,1);
`;

export const SuccessIcon = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: rgba(107, 156, 62, 0.12);
  border: 2.5px solid #6b9c3e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b9c3e;
`;

export const SuccessTitle = styled.h2`
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #3d2b1a;
  margin: 0;
`;

export const SuccessText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #9e8e80;
  margin: 0;
`;
