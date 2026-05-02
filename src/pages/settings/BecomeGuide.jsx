// pages/settings/BecomeGuide.jsx
// Shown at /settings/profile/guide when user.isGuide === false
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RiCompassLine, RiArrowRightLine, RiArrowLeftLine,
  RiUserHeartLine, RiGlobalLine, RiMapPinLine,
  RiMoneyDollarCircleLine, RiShieldCheckLine, RiCheckLine,
  RiStarLine, RiCalendarCheckLine, RiGroupLine,
} from "react-icons/ri";
import { HiCheck, HiSparkles } from "react-icons/hi2";
import { SPECIALTIES, CITIES, LANGUAGES } from "../../constants/guide";
import { selectToken, updateUser } from "../../store/slices/authSlice";
import { BadgeMini } from "../../components/settings/atoms";

// ── API helper ────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL;
async function apiPost(path, body, token) {
  const res  = await fetch(`${BASE_URL}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// ── Wizard steps meta ─────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: "Presentation", icon: <RiUserHeartLine size={14} /> },
  { n: 2, label: "Expertise",    icon: <RiGlobalLine    size={14} /> },
  { n: 3, label: "Cities & Rate",icon: <RiMapPinLine    size={14} /> },
];

// ── Benefits shown on the landing screen ─────────────────────────────────────
const BENEFITS = [
  { icon: <RiGroupLine size={20} />,         label: "2 400+",   sub: "bookings / month" },
  { icon: <RiMoneyDollarCircleLine size={20}/>,label: "350 MAD", sub: "avg. earnings/hour" },
  { icon: <RiStarLine size={20} />,          label: "4.8 ★",    sub: "avg. guide rating" },
  { icon: <RiCalendarCheckLine size={20} />, label: "24 h",     sub: "verification time" },
];

// ── Small chip used in step 2 & 3 ────────────────────────────────────────────
function ToggleChip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[12.5px] font-semibold transition-all duration-150"
      style={{
        background:  selected ? "var(--ps-green-soft)" : "#fff",
        borderColor: selected ? "var(--ps-green-2)"    : "var(--ps-line)",
        color:       selected ? "var(--ps-green-2)"    : "var(--ps-ink-3)",
        cursor: "pointer", fontFamily: "var(--ps-font-ui)",
      }}
    >
      {selected && <RiCheckLine size={11} />}
      {children}
    </button>
  );
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2 flex-1">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all"
            style={{
              background: s.n === step ? "var(--ps-green)" : s.n < step ? "var(--ps-green-soft)" : "var(--ps-line)",
              color:      s.n === step ? "#fff"            : s.n < step ? "var(--ps-green-2)"     : "var(--ps-ink-3)",
              fontFamily: "var(--ps-font-ui)",
            }}
          >
            {s.n < step ? <RiCheckLine size={11} /> : s.icon}
            <span className="max-[480px]:hidden">{s.label}</span>
            <span className="hidden max-[480px]:inline">{s.n}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="flex-1 h-px"
              style={{ background: s.n < step ? "var(--ps-green-2)" : "var(--ps-line)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BecomeGuide() {
  const dispatch = useDispatch();
  const token    = useSelector(selectToken);

  const [phase,   setPhase]   = useState("landing"); // "landing" | "wizard" | "done"
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Form state
  const [tagline, setTagline] = useState("");
  const [bio,     setBio]     = useState("");
  const [specs,   setSpecs]   = useState([]);
  const [langs,   setLangs]   = useState([]);
  const [cities,  setCities]  = useState([]);
  const [price,   setPrice]   = useState(350);

  const toggleSpec = (id)   => setSpecs((p) => p.includes(id) ? p.filter((s) => s !== id) : p.length < 5 ? [...p, id] : p);
  const toggleLang = (code) => setLangs((p) => p.includes(code) ? p.filter((l) => l !== code) : [...p, code]);
  const toggleCity = (id)   => setCities((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id]);

  const canAdvance = () => {
    if (step === 1) return tagline.trim().length >= 10 && bio.trim().length >= 30;
    if (step === 2) return specs.length > 0 && langs.length > 0;
    return price >= 50 && cities.length > 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await apiPost("/guides", {
        bio,
        tagline,
        specialties:     specs,
        spokenLanguages: langs,
        cityIds:         cities,
        pricePerHour:    price,
      }, token);
      await dispatch(updateUser({ isGuide: true }));
      setPhase("done");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Done screen ─────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div
        className="rounded-[18px] border flex flex-col items-center text-center gap-6 py-16 px-8"
        style={{ background: "var(--ps-card)", borderColor: "var(--ps-line)", boxShadow: "var(--ps-shadow-sm)" }}
      >
        <div
          className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
          style={{ background: "var(--ps-green-soft)", border: "2px solid var(--ps-green-2)", color: "var(--ps-green)" }}
        >
          <HiCheck size={38} />
        </div>
        <div>
          <h2
            className="text-[1.6rem] font-semibold mb-2"
            style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
          >
            Application submitted!
          </h2>
          <p className="text-[14px] max-w-sm mx-auto" style={{ color: "var(--ps-ink-3)", fontFamily: "var(--ps-font-ui)" }}>
            Your guide profile is under review. We'll notify you once verified — usually within 24 hours.
          </p>
        </div>
        <BadgeMini color="orange">⏳ Pending verification</BadgeMini>
        <p className="text-[12px]" style={{ color: "var(--ps-ink-3)", fontFamily: "var(--ps-font-ui)" }}>
          You can close this page — we'll email you at your registered address.
        </p>
      </div>
    );
  }

  // ── Landing screen ──────────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div className="flex flex-col gap-5">

        {/* Hero card */}
        <div
          className="rounded-[18px] overflow-hidden border"
          style={{ borderColor: "var(--ps-line)", boxShadow: "var(--ps-shadow-sm)" }}
        >
          {/* Gradient banner */}
          <div
            className="px-8 py-10 flex flex-col gap-4"
            style={{ background: "linear-gradient(135deg, var(--ps-dark) 0%, #3A4A20 100%)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                style={{ background: "rgba(125,166,53,0.25)", color: "var(--ps-green)" }}
              >
                <HiSparkles size={11} /> New opportunity
              </span>
            </div>
            <h1
              className="text-[2rem] font-semibold leading-tight max-w-lg"
              style={{ fontFamily: "var(--ps-font-display)", color: "#fff" }}
            >
              Become a CityGuide<br />
              <span style={{ color: "var(--ps-green)" }}>certified guide</span>
            </h1>
            <p className="text-[14px] max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "var(--ps-font-ui)" }}>
              Share your local knowledge, meet travelers from around the world and earn on your own schedule.
            </p>
            <button
              onClick={() => setPhase("wizard")}
              className="self-start flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold transition-all hover:scale-[1.02] mt-2"
              style={{ background: "var(--ps-green)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
            >
              Get started <RiArrowRightLine size={16} />
            </button>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-4 divide-x max-[640px]:grid-cols-2 max-[640px]:divide-x-0 max-[640px]:gap-y-0"
            style={{ background: "var(--ps-card)", borderTop: "1px solid var(--ps-line)", divideColor: "var(--ps-line)" }}
          >
            {BENEFITS.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1 py-5 px-4" style={{ borderColor: "var(--ps-line)" }}>
                <span style={{ color: "var(--ps-green)" }}>{b.icon}</span>
                <span className="text-[20px] font-bold" style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}>
                  {b.label}
                </span>
                <span className="text-[11px] text-center" style={{ color: "var(--ps-ink-3)", fontFamily: "var(--ps-font-ui)" }}>
                  {b.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div
          className="rounded-[18px] border p-6"
          style={{ background: "var(--ps-card)", borderColor: "var(--ps-line)", boxShadow: "var(--ps-shadow-sm)" }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mb-4" style={{ color: "var(--ps-ink-3)" }}>
            How it works
          </div>
          <div className="grid grid-cols-3 gap-6 max-[640px]:grid-cols-1">
            {[
              { step: "01", icon: <RiUserHeartLine size={22} />, title: "Build your profile", desc: "Add your bio, specialties and the cities you know best." },
              { step: "02", icon: <RiShieldCheckLine size={22} />, title: "Get verified", desc: "Our team reviews your profile and issues your certified badge." },
              { step: "03", icon: <RiMoneyDollarCircleLine size={22} />, title: "Start earning", desc: "Travelers discover you, book tours, and you get paid." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold opacity-40" style={{ color: "var(--ps-green)", fontFamily: "var(--ps-font-ui)" }}>{s.step}</span>
                  <span style={{ color: "var(--ps-green)" }}>{s.icon}</span>
                </div>
                <div>
                  <div className="text-[14px] font-semibold mb-1" style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}>
                    {s.title}
                  </div>
                  <div className="text-[12px] leading-relaxed" style={{ color: "var(--ps-ink-3)", fontFamily: "var(--ps-font-ui)" }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 flex justify-end" style={{ borderTop: "1px solid var(--ps-line)" }}>
            <button
              onClick={() => setPhase("wizard")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all"
              style={{ background: "var(--ps-green)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
            >
              Apply now <RiArrowRightLine size={14} />
            </button>
          </div>
        </div>

      </div>
    );
  }

  // ── Wizard ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-[18px] border"
      style={{
        background: "var(--ps-card)",
        borderColor: "var(--ps-line)",
        boxShadow: "var(--ps-shadow-sm)",
        padding: "var(--ps-pad)",
      }}
    >
      <StepBar step={step} />

      {/* ── Step 1 : Presentation ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3
              className="text-[18px] font-semibold m-0 mb-1"
              style={{
                fontFamily: "var(--ps-font-display)",
                color: "var(--ps-ink)",
              }}
            >
              Introduce yourself
            </h3>
            <p
              className="text-[12px] m-0"
              style={{
                color: "var(--ps-ink-3)",
                fontFamily: "var(--ps-font-ui)",
              }}
            >
              This is the first thing travelers will read — make it memorable.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{ color: "var(--ps-ink-3)" }}
            >
              Tagline{" "}
              <span style={{ color: "var(--ps-ink-3)", fontWeight: 400 }}>
                (10–60 chars)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={60}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={`e.g. "Uncover Marrakech's hidden gems with a local's eye"`}
                className="ps-field-input"
                style={{ paddingRight: 48 }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px]"
                style={{
                  color:
                    tagline.length >= 10
                      ? "var(--ps-green-2)"
                      : "var(--ps-ink-3)",
                }}
              >
                {tagline.length}/60
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{ color: "var(--ps-ink-3)" }}
            >
              Bio{" "}
              <span style={{ color: "var(--ps-ink-3)", fontWeight: 400 }}>
                (min 30 chars)
              </span>
            </label>
            <div className="relative">
              <textarea
                maxLength={600}
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell travelers who you are, your background and what makes your tours unique…"
                className="ps-field-textarea"
                style={{ paddingBottom: 28 }}
              />
              <span
                className="absolute bottom-2.5 right-3 text-[11px]"
                style={{ color: "var(--ps-ink-3)" }}
              >
                {bio.length}/600
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2 : Expertise ────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <h3
              className="text-[18px] font-semibold m-0 mb-1"
              style={{
                fontFamily: "var(--ps-font-display)",
                color: "var(--ps-ink)",
              }}
            >
              Your expertise
            </h3>
            <p
              className="text-[12px] m-0"
              style={{
                color: "var(--ps-ink-3)",
                fontFamily: "var(--ps-font-ui)",
              }}
            >
              Help travelers find you based on what you do best.
            </p>
          </div>

          {/* Specialties */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label
                className="text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ color: "var(--ps-ink-3)" }}
              >
                Specialties
              </label>
              <span
                className="text-[11px]"
                style={{
                  color:
                    specs.length === 5 ? "var(--ps-orange)" : "var(--ps-ink-3)",
                  fontFamily: "var(--ps-font-ui)",
                }}
              >
                {specs.length}/5 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => (
                <ToggleChip
                  key={s.id}
                  selected={specs.includes(s.id)}
                  onClick={() => toggleSpec(s.id)}
                >
                  {s.label}
                </ToggleChip>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label
              className="text-[11px] font-bold uppercase tracking-[0.06em] block mb-2.5"
              style={{ color: "var(--ps-ink-3)" }}
            >
              Languages you guide in
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <ToggleChip
                  key={l.code}
                  selected={langs.includes(l.code)}
                  onClick={() => toggleLang(l.code)}
                >
                  {l.flag} {l.label}
                </ToggleChip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3 : Cities & Rate ────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <h3
              className="text-[18px] font-semibold m-0 mb-1"
              style={{
                fontFamily: "var(--ps-font-display)",
                color: "var(--ps-ink)",
              }}
            >
              Cities & pricing
            </h3>
            <p
              className="text-[12px] m-0"
              style={{
                color: "var(--ps-ink-3)",
                fontFamily: "var(--ps-font-ui)",
              }}
            >
              Where do you guide? Set your hourly rate in MAD.
            </p>
          </div>

          {/* Cities */}
          <div>
            <label
              className="text-[11px] font-bold uppercase tracking-[0.06em] block mb-2.5"
              style={{ color: "var(--ps-ink-3)" }}
            >
              Cities you operate in
            </label>
            <div className="grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
              {CITIES.map((c) => {
                const active = cities.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCity(c.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-[12px] border text-left transition-all duration-150"
                    style={{
                      background: active
                        ? "var(--ps-green-soft)"
                        : "var(--ps-bg)",
                      borderColor: active
                        ? "var(--ps-green-2)"
                        : "var(--ps-line)",
                      cursor: "pointer",
                    }}
                  >
                    <RiMapPinLine
                      size={15}
                      style={{
                        color: active ? "var(--ps-green-2)" : "var(--ps-ink-3)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        className="text-[13px] font-semibold"
                        style={{
                          color: active
                            ? "var(--ps-green-2)"
                            : "var(--ps-ink-2)",
                          fontFamily: "var(--ps-font-ui)",
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        className="text-[10px]"
                        style={{ color: "var(--ps-ink-3)" }}
                      >
                        {c.region}
                      </div>
                    </div>
                    {active && (
                      <RiCheckLine
                        size={14}
                        className="ml-auto flex-shrink-0"
                        style={{ color: "var(--ps-green-2)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div>
            <label
              className="text-[11px] font-bold uppercase tracking-[0.06em] block mb-2.5"
              style={{ color: "var(--ps-ink-3)" }}
            >
              Rate per hour (MAD)
            </label>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {[200, 350, 500, 750].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrice(p)}
                  className="px-4 py-2 rounded-full border text-[12.5px] font-semibold transition-all"
                  style={{
                    background: price === p ? "var(--ps-ink)" : "transparent",
                    borderColor:
                      price === p ? "var(--ps-ink)" : "var(--ps-line)",
                    color: price === p ? "#fff" : "var(--ps-ink-3)",
                    cursor: "pointer",
                    fontFamily: "var(--ps-font-ui)",
                  }}
                >
                  {p} MAD
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="flex-1 accent-[--ps-green]"
                style={{ accentColor: "var(--ps-green)" }}
              />
              <div
                className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] border text-[15px] font-bold flex-shrink-0"
                style={{
                  borderColor: "var(--ps-green)",
                  color: "var(--ps-green-2)",
                  background: "var(--ps-green-soft)",
                  fontFamily: "var(--ps-font-display)",
                  minWidth: 100,
                }}
              >
                {price}{" "}
                <span
                  className="text-[11px] font-semibold mt-0.5"
                  style={{ color: "var(--ps-ink-3)" }}
                >
                  MAD/hr
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div
          className="mt-5 px-4 py-3 rounded-[10px] border text-[12px] font-semibold"
          style={{
            background: "#fde8e0",
            borderColor: "rgba(184,84,51,0.3)",
            color: "var(--ps-danger)",
            fontFamily: "var(--ps-font-ui)",
          }}
        >
          {error}
        </div>
      )}

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between mt-8 pt-6"
        style={{ borderTop: "1px solid var(--ps-line)" }}
      >
        <button
          type="button"
          onClick={() =>
            step === 1 ? setPhase("landing") : setStep((s) => s - 1)
          }
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all"
          style={{
            background: "transparent",
            border: "1px solid var(--ps-line)",
            color: "var(--ps-ink-3)",
            cursor: "pointer",
            fontFamily: "var(--ps-font-ui)",
          }}
        >
          <RiArrowLeftLine size={14} /> {step === 1 ? "Back" : "Previous"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all"
            style={{
              background: canAdvance() ? "var(--ps-green)" : "var(--ps-line)",
              color: canAdvance() ? "#fff" : "var(--ps-ink-3)",
              border: "none",
              cursor: canAdvance() ? "pointer" : "not-allowed",
              fontFamily: "var(--ps-font-ui)",
            }}
          >
            Continue <RiArrowRightLine size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance() || loading}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all"
            style={{
              background:
                canAdvance() && !loading ? "var(--ps-green)" : "var(--ps-line)",
              color: canAdvance() && !loading ? "#fff" : "var(--ps-ink-3)",
              border: "none",
              cursor: canAdvance() && !loading ? "pointer" : "not-allowed",
              fontFamily: "var(--ps-font-ui)",
            }}
          >
            {loading ? (
              "Submitting…"
            ) : (
              <>
                <RiCheckLine size={14} /> Submit application
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
