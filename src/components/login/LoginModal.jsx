// components/LoginModal.jsx
import { useState }        from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate }     from "react-router-dom";
import { RiMapPinLine, RiMailLine, RiLockLine,
         RiEyeLine, RiEyeOffLine, RiUserLine } from "react-icons/ri";
import { FcGoogle }        from "react-icons/fc";
import { HiXMark, HiCheck } from "react-icons/hi2";

import { loginUser, signupUser,
         selectAuthLoading, selectAuthError,
         clearError } from "../../store/slices/authSlice";

import {
  Overlay, Modal, CloseBtn,
  LogoRow, LogoText,
  ModalTitle, ModalSubtitle,
  InputWrap, InputIcon, Input, EyeBtn,
  ErrorMsg, ServerError,
  ForgotRow, ForgotLink,
  PrimaryBtn, GoogleBtn, Divider,
  SwitchRow,
  SuccessWrap, SuccessIcon, SuccessTitle, SuccessText,
} from "./LoginModal.styles";

// ─────────────────────────────────────────────────────────────────────────────
export default function LoginModal({ onClose }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const loading   = useSelector(selectAuthLoading);
  const serverErr = useSelector(selectAuthError);

  const [mode,     setMode]     = useState("login"); // "login" | "signup" | "success"
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors,   setErrors]   = useState({});
  const [welcome,  setWelcome]  = useState("");

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (mode === "signup" && !name.trim())
      e.name = "Full name is required";
    if (!email.trim())
      e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Invalid email address";
    if (!password)
      e.password = "Password is required";
    else if (password.length < 6)
      e.password = "At least 6 characters";
    if (mode === "signup" && password !== confirm)
      e.confirm = "Passwords don't match";
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    dispatch(clearError());
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (mode === "login") {
      // ── Login → redirect to /account ──────────────────────────────────
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        onClose();
        navigate("/account");
      }
    } else {
      // ── Signup → POST new user → show success screen ──────────────────
      const result = await dispatch(signupUser({ name, email, password }));
      if (signupUser.fulfilled.match(result)) {
        setWelcome(result.payload.name);
        setMode("success");
      }
    }
  };

  // ── Switch mode ──────────────────────────────────────────────────────────
  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrors({});
    setName(""); setEmail(""); setPassword(""); setConfirm("");
    dispatch(clearError());
  };

  const clearField = (setter, field) => {
    setter("");
    setErrors((p) => ({ ...p, [field]: "" }));
    dispatch(clearError());
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (mode === "success") {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <CloseBtn onClick={onClose}><HiXMark size={15} /></CloseBtn>
          <SuccessWrap>
            <SuccessIcon><HiCheck size={32} /></SuccessIcon>
            <SuccessTitle>Welcome, {welcome}!</SuccessTitle>
            <SuccessText>Your account has been created successfully.</SuccessText>
            <PrimaryBtn onClick={() => { onClose(); navigate("/account"); }}>
              Go to my account
            </PrimaryBtn>
          </SuccessWrap>
        </Modal>
      </Overlay>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>

        <CloseBtn onClick={onClose}><HiXMark size={15} /></CloseBtn>

        {/* Logo */}
        <LogoRow>
          <RiMapPinLine size={22} color="#6b9c3e" />
          <LogoText>City<span>Guide</span></LogoText>
        </LogoRow>

        {/* Title */}
        <ModalTitle>{mode === "login" ? "Welcome back" : "Create account"}</ModalTitle>
        <ModalSubtitle>
          {mode === "login"
            ? "Sign in to access your account"
            : "Fill in your details to get started"}
        </ModalSubtitle>

        {/* Server error */}
        {serverErr && <ServerError>{serverErr}</ServerError>}

        {/* ── Name (signup only) ── */}
        {mode === "signup" && (
          <>
            <InputWrap>
              <InputIcon><RiUserLine size={15} /></InputIcon>
              <Input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => clearField(() => setName(e.target.value), "name") || setName(e.target.value)}
                $error={!!errors.name}
                autoComplete="name"
              />
            </InputWrap>
            {errors.name && <ErrorMsg>{errors.name}</ErrorMsg>}
          </>
        )}

        {/* ── Email ── */}
        <InputWrap>
          <InputIcon><RiMailLine size={15} /></InputIcon>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); dispatch(clearError()); }}
            $error={!!errors.email}
            autoComplete="email"
          />
        </InputWrap>
        {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}

        {/* ── Password ── */}
        <InputWrap>
          <InputIcon><RiLockLine size={15} /></InputIcon>
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); dispatch(clearError()); }}
            $error={!!errors.password}
            style={{ paddingRight: 42 }}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <EyeBtn type="button" onClick={() => setShowPass((v) => !v)}>
            {showPass ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
          </EyeBtn>
        </InputWrap>
        {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}

        {/* ── Confirm password (signup only) ── */}
        {mode === "signup" && (
          <>
            <InputWrap>
              <InputIcon><RiLockLine size={15} /></InputIcon>
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                $error={!!errors.confirm}
                autoComplete="new-password"
              />
            </InputWrap>
            {errors.confirm && <ErrorMsg>{errors.confirm}</ErrorMsg>}
          </>
        )}

        {/* ── Forgot (login only) ── */}
        {mode === "login" && (
          <ForgotRow>
            <ForgotLink type="button">Forgot password?</ForgotLink>
          </ForgotRow>
        )}

        {/* ── Submit ── */}
        <PrimaryBtn type="button" onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "login" ? "Sign in" : "Create account"}
        </PrimaryBtn>

        {/* ── Google (signup only) ── */}
        {mode === "signup" && (
          <>
            <Divider><span>or continue with</span></Divider>
            <GoogleBtn type="button">
              <FcGoogle size={18} /> Continue with Google
            </GoogleBtn>
          </>
        )}

        {/* ── Switch mode ── */}
        <SwitchRow>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={switchMode}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </SwitchRow>

      </Modal>
    </Overlay>
  );
}
