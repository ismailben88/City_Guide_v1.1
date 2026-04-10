// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // ─── Design tokens ───────────────────────────────────────────────────
      colors: {
        primary: "#5b8523", // green — buttons, accents
        accent: "#d57a2a", // orange — CTAs, featured badges
        dark: "#1a1a1a", // dark background
        // ── Guide page neutrals (warm sand palette) ───────────────────────
        sand: "#faf7f2",
        sand2: "#f3ede2",
        sand3: "#e8dfd0",
        ink: "#1c1409",
        ink2: "#3d2b1a",
        ink3: "#7a6a58",
        // ── Green tints for tags & avatar borders ─────────────────────────
        "green-light": "#eef5e8",
        "green-mid": "#b8d48a",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Nunito", "sans-serif"],
      },
      // ─── Shadows ─────────────────────────────────────────────────────────
      boxShadow: {
        card: "0 6px 24px rgba(91,133,35,0.10)",
        search: "0 8px 32px rgba(91,133,35,0.18)",
      },
      // ─── Hero keyframes ──────────────────────────────────────────────────
      keyframes: {
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(1.07)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.03)" },
        },
        prog: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      // ─── Hero animations ─────────────────────────────────────────────────
      animation: {
        "zoom-in": "zoom-in 0.95s cubic-bezier(0.4,0,0.2,1) forwards",
        "fade-out": "fade-out 0.95s ease forwards",
        prog: "prog 6s linear forwards",
        "slide-up-1": "slide-up 0.5s ease 0.05s both",
        "slide-up-2": "slide-up 0.5s ease 0.13s both",
        "slide-up-3": "slide-up 0.55s ease 0.2s both",
        "slide-up-4": "slide-up 0.55s ease 0.28s both",
        "slide-up-5": "slide-up 0.6s ease 0.35s both",
        "fade-up": "fade-up 0.5s ease both",
        "fade-in": "fade-in 0.4s ease both",
        "slide-right": "slide-right 0.45s ease both",
        "scale-in": "scale-in 0.35s ease both",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
