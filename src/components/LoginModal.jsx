// components/LoginModal.jsx
import { useState } from "react";
import "../styles/Components.css";

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "success"

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>

        {mode === "success" ? (
          <div className="modal__success">
            <h2 className="modal__title">Welcome to CityGuide</h2>
            <p style={{ color: "var(--color-accent)", marginBottom: 26, fontSize: 14 }}>
              You have successfully signed up !!
            </p>
            <button className="modal__ok-btn" onClick={onClose}>OK</button>
          </div>
        ) : (
          <>
            <h2 className="modal__title">
              {mode === "login" ? "Welcome to CityGuide" : "Sign up"}
            </h2>
            <p className="modal__subtitle">
              {mode === "login" ? "Login" : "Please enter the following info"}
            </p>

            <input className="modal__input" placeholder="Email" type="email" />
            <input className="modal__input" placeholder="Password" type="password" />
            {mode === "signup" && (
              <input className="modal__input" placeholder="Confirm password" type="password" />
            )}

            {mode === "login" && (
              <div className="modal__forgot">forgot password?</div>
            )}

            <button
              className="btn btn-accent"
              style={{ width: "100%", padding: 11, marginBottom: 10, fontSize: 14 }}
              onClick={() => (mode === "signup" ? setMode("success") : onClose())}
            >
              {mode === "login" ? "login" : "Sign up"}
            </button>

            {mode === "signup" && (
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: 11, fontSize: 13 }}
              >
                Continue with Google
              </button>
            )}

            <div
              className="modal__switch"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login"
                ? "Don't have an account? sign up"
                : "Already have an account? login"}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
