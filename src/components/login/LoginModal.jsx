// components/login/LoginModal.jsx
import { useState }                      from "react";
import { useDispatch, useSelector }      from "react-redux";
import { useNavigate }                   from "react-router-dom";
import { RiMapPinLine, RiMailLine,
         RiLockLine, RiEyeLine,
         RiEyeOffLine, RiUserLine }      from "react-icons/ri";
import { FcGoogle }                      from "react-icons/fc";
import { HiXMark, HiCheck }             from "react-icons/hi2";

import { loginUser, signupUser, googleAuth,
         selectAuthLoading, selectAuthError,
         clearError }                    from "../../store/slices/authSlice";

// ── Overlay + Modal wrapper ───────────────────────────────────────────────────
function ModalOverlay({ children, extraModal = "", onClose }) {
  return (
    <div
      className="fixed inset-0 z-[999] bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[420px] bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.20)] overflow-hidden ${extraModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-green-mid to-accent" />
        {children}
      </div>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path  className="opacity-75"  fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function LoginModal({ onClose }) {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const loading    = useSelector(selectAuthLoading);
  const serverErr  = useSelector(selectAuthError);

  const [mode,          setMode]          = useState("login");
  const [name,          setName]          = useState("");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [confirm,       setConfirm]       = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [errors,        setErrors]        = useState({});
  const [welcome,       setWelcome]       = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const busy = loading || googleLoading;

  // ── Validation ──────────────────────────────────────────────────────────────
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

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    dispatch(clearError());
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    if (mode === "login") {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) { onClose(); navigate("/account"); }
    } else {
      const result = await dispatch(signupUser({ name, email, password }));
      if (signupUser.fulfilled.match(result)) {
        setWelcome(result.payload.user?.name || result.payload.user?.firstName || "there");
        setMode("success");
      }
    }
  };

  // ── Google auth ─────────────────────────────────────────────────────────────
  const handleGoogleAuth = async () => {
    dispatch(clearError());
    setGoogleLoading(true);
    // Demo simulation — replace with real Google OAuth token exchange in production
    await new Promise((r) => setTimeout(r, 900));
    const mockProfile = {
      name:   "Alex Martin",
      email:  "alex.martin.demo@gmail.com",
      avatar: "https://ui-avatars.com/api/?name=Alex+Martin&background=4285F4&color=fff&bold=true",
    };
    setGoogleLoading(false);
    const result = await dispatch(googleAuth(mockProfile));
    if (googleAuth.fulfilled.match(result)) { onClose(); navigate("/account"); }
  };

  // ── Switch mode ─────────────────────────────────────────────────────────────
  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setErrors({});
    setName(""); setEmail(""); setPassword(""); setConfirm("");
    dispatch(clearError());
  };

  // ── Input class builder ─────────────────────────────────────────────────────
  const inputCls = (field, extra = "") =>
    [
      "w-full pl-10 py-3 rounded-xl border font-body text-sm font-medium",
      "text-ink2 placeholder:text-ink3/50 placeholder:font-normal",
      "focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200",
      extra,
      errors[field]
        ? "border-red-400 bg-red-50/40 focus:border-red-400 focus:ring-red-100"
        : "border-sand3 bg-sand/50 focus:border-primary focus:ring-primary/10",
    ].join(" ");

  // ── Success screen ──────────────────────────────────────────────────────────
  if (mode === "success") {
    return (
      <ModalOverlay extraModal="animate-pop-in" onClose={onClose}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-sand3 bg-sand flex items-center justify-center text-ink3 hover:bg-ink2 hover:text-white hover:border-ink2 transition-all duration-200"
        >
          <HiXMark size={15} />
        </button>

        <div className="flex flex-col items-center gap-4 text-center px-8 pt-10 pb-9">
          <div className="w-[72px] h-[72px] rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary animate-pop-in">
            <HiCheck size={34} />
          </div>
          <h2 className="font-display text-[1.45rem] font-bold text-ink2 mt-1">
            Welcome, {welcome}!
          </h2>
          <p className="font-body text-[13px] text-ink3 -mt-1">
            Your account has been created successfully.
          </p>
          <button
            onClick={() => { onClose(); navigate("/account"); }}
            className="w-full py-3 rounded-xl bg-primary hover:bg-accent text-white font-body text-[14px] font-bold transition-all duration-200 hover:scale-[1.01] mt-2"
          >
            Go to my account
          </button>
        </div>
      </ModalOverlay>
    );
  }

  // ── Main modal ──────────────────────────────────────────────────────────────
  return (
    <ModalOverlay extraModal="animate-modal-in" onClose={onClose}>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full border border-sand3 bg-sand flex items-center justify-center text-ink3 hover:bg-ink2 hover:text-white hover:border-ink2 transition-all duration-200"
      >
        <HiXMark size={15} />
      </button>

      <div className="px-7 pb-8 pt-9 sm:px-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <RiMapPinLine size={22} className="text-primary" />
          <span className="font-display text-[20px] font-bold text-ink2">
            City<span className="text-primary">Guide</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-[1.5rem] font-bold text-ink2 text-center mb-1.5">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="font-body text-[13px] text-ink3 text-center mb-6">
          {mode === "login"
            ? "Sign in to access your account"
            : "Join CityGuide and start exploring"}
        </p>

        {/* Server error */}
        {serverErr && (
          <div className="flex items-center justify-center bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
            <span className="font-body text-[12px] font-semibold text-red-600">{serverErr}</span>
          </div>
        )}

        {/* ── Google button (both modes) ── */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 py-[11px] px-4 border border-sand3 rounded-xl bg-white hover:bg-sand hover:border-sand3 transition-all duration-200 font-body text-[13.5px] font-semibold text-ink2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {googleLoading ? <Spinner /> : <FcGoogle size={19} />}
          {googleLoading ? "Connecting…" : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-sand3" />
          <span className="font-body text-[11px] font-semibold text-ink3/70 whitespace-nowrap">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-sand3" />
        </div>

        {/* ── Name (signup only) ── */}
        {mode === "signup" && (
          <div className="mb-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3/50 pointer-events-none flex items-center">
                <RiUserLine size={15} />
              </span>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); dispatch(clearError()); }}
                className={inputCls("name", "pr-4")}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="font-body text-[11px] font-semibold text-red-500 mt-1 ml-0.5">{errors.name}</p>}
          </div>
        )}

        {/* ── Email ── */}
        <div className="mb-3">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3/50 pointer-events-none flex items-center">
              <RiMailLine size={15} />
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); dispatch(clearError()); }}
              className={inputCls("email", "pr-4")}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="font-body text-[11px] font-semibold text-red-500 mt-1 ml-0.5">{errors.email}</p>}
        </div>

        {/* ── Password ── */}
        <div className="mb-3">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3/50 pointer-events-none flex items-center">
              <RiLockLine size={15} />
            </span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); dispatch(clearError()); }}
              className={inputCls("password", "pr-11")}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink3/50 hover:text-primary transition-colors"
            >
              {showPass ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
            </button>
          </div>
          {errors.password && <p className="font-body text-[11px] font-semibold text-red-500 mt-1 ml-0.5">{errors.password}</p>}
        </div>

        {/* ── Confirm password (signup only) ── */}
        {mode === "signup" && (
          <div className="mb-3">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3/50 pointer-events-none flex items-center">
                <RiLockLine size={15} />
              </span>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })); }}
                className={inputCls("confirm", "pr-4")}
                autoComplete="new-password"
              />
            </div>
            {errors.confirm && <p className="font-body text-[11px] font-semibold text-red-500 mt-1 ml-0.5">{errors.confirm}</p>}
          </div>
        )}

        {/* ── Forgot (login only) ── */}
        {mode === "login" && (
          <div className="text-right mb-1 -mt-1">
            <button type="button" className="font-body text-[12px] font-bold text-accent hover:text-ink2 transition-colors">
              Forgot password?
            </button>
          </div>
        )}

        {/* ── Submit ── */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={busy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-accent text-white font-body text-[14px] font-bold transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed mt-3 mb-5"
        >
          {loading && <Spinner />}
          {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>

        {/* ── Switch mode ── */}
        <p className="font-body text-[13px] text-ink3 text-center">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={switchMode}
            className="ml-1.5 font-bold text-primary hover:text-accent transition-colors"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </ModalOverlay>
  );
}
