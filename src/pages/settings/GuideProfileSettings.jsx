import { useState } from "react";
import {
  RiImageAddLine, RiShieldCheckLine, RiUserLine, RiPencilLine,
  RiMapPinLine, RiTimeLine, RiAddLine, RiCloseLine, RiSparklingLine,
  RiEyeLine, RiDeleteBinLine, RiUploadLine, RiFileShieldLine,
  RiCameraLine, RiIdCardLine, RiHome3Line, RiStarLine,
} from "react-icons/ri";
import { IoStarSharp } from "react-icons/io5";
import { HiCheckBadge } from "react-icons/hi2";
import {
  PSCard, PSCardHead, Toggle, Chip, ProgressBar,
  BadgeMini, PSFieldLabel, PSInput, PSTextarea,
  PsBtnPrimary, PsBtnOutline, PsBtnGhost,
} from "../../components/settings/atoms";
import { SPECIALTIES, CITIES, LANGUAGES, DAYS, PROFICIENCY_LEVELS, MOCK_GUIDE_PROFILE } from "../../constants/guide";

// ── Completeness calculator ───────────────────────────────────────────────────
function calcCompleteness(p) {
  const checks = [
    p.avatarUrl,
    p.bannerUrl,
    p.tagline?.trim(),
    p.bio?.trim(),
    p.specialties?.length > 0,
    p.spokenLanguages?.length > 0,
    p.cities?.length > 0,
    p.pricePerHour > 0,
    p.schedule?.some((d) => d.isOpen),
    p.verificationStatus === "verified",
  ];
  const score = checks.filter(Boolean).length;
  const pct   = Math.round((score / checks.length) * 100);
  const missing = [];
  if (!p.avatarUrl)                          missing.push("profile photo");
  if (!p.bannerUrl)                          missing.push("cover banner");
  if (!p.tagline?.trim())                    missing.push("tagline");
  if (!p.bio?.trim())                        missing.push("bio");
  if (!p.specialties?.length)               missing.push("specialties");
  if (p.verificationStatus !== "verified")  missing.push("verification");
  return { pct, missing };
}

// ── HeroBanner card ───────────────────────────────────────────────────────────
function HeroBannerCard({ profile, update }) {
  const { pct, missing } = calcCompleteness(profile);
  const { verificationStatus } = profile;

  return (
    <PSCard>
      {/* Banner */}
      <div
        className="relative h-[220px] rounded-[10px] overflow-hidden mb-5 -mx-1"
        style={{
          background: profile.bannerUrl
            ? `url(${profile.bannerUrl}) center/cover`
            : "linear-gradient(135deg, #d4c4a0 0%, #b8a882 50%, #c8b896 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.30) 100%)" }}
        />
        {/* Controls */}
        <div className="absolute top-3 right-3 flex gap-2">
          <label className="cursor-pointer">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.9)", color: "var(--ps-ink-2)", backdropFilter: "blur(6px)" }}
            >
              <RiImageAddLine size={13} /> Replace banner
            </div>
            <input type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files[0] && update({ bannerUrl: URL.createObjectURL(e.target.files[0]) })} />
          </label>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(6px)", cursor: "pointer" }}
          >
            <RiEyeLine size={13} /> Preview
          </button>
        </div>
        {/* Hint */}
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          <RiImageAddLine size={12} /> 1600 × 600 recommended
        </div>
      </div>

      {/* Completeness + verification meta */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Completeness */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className="text-[18px] font-semibold"
              style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
            >
              {pct}%
            </span>
            <span className="text-[12px]" style={{ color: "var(--ps-ink-3)" }}>profile complete</span>
          </div>
          <ProgressBar value={pct} />
          {missing.length > 0 && (
            <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: "var(--ps-ink-3)" }}>
              Add your <strong style={{ color: "var(--ps-ink-2)" }}>{missing.slice(0, 3).join(", ")}</strong>
              {missing.length > 3 ? ` and ${missing.length - 3} more` : ""} to reach 100%.
            </p>
          )}
        </div>

        {/* Verification pill */}
        <div className="flex-shrink-0">
          {verificationStatus === "verified" && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: "var(--ps-green-soft)", color: "var(--ps-green-2)", border: "1px solid var(--ps-green-soft)" }}
            >
              <RiShieldCheckLine size={14} /> Verified guide · Manage documents
            </span>
          )}
          {verificationStatus === "pending" && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: "var(--ps-orange-soft)", color: "var(--ps-orange)", border: "1px solid var(--ps-orange-soft)" }}
            >
              <RiTimeLine size={14} /> Under review · 1–2 days
            </span>
          )}
          {verificationStatus === "unverified" && (
            <PsBtnPrimary onClick={() => update({ verificationStatus: "pending" })}>
              <RiShieldCheckLine size={14} /> Start verification
            </PsBtnPrimary>
          )}
        </div>
      </div>
    </PSCard>
  );
}

// ── Verification steps card ───────────────────────────────────────────────────
const VERIFY_STEPS = [
  { id: "id",      icon: <RiIdCardLine size={15} />,      label: "Government ID",        desc: "Passport or national ID card"               },
  { id: "selfie",  icon: <RiCameraLine size={15} />,      label: "Selfie check",          desc: "A photo holding your ID"                    },
  { id: "licence", icon: <RiFileShieldLine size={15} />,  label: "Tour-guide licence",    desc: "Official ministry-issued licence"           },
  { id: "address", icon: <RiHome3Line size={15} />,       label: "Proof of address",      desc: "Utility bill or bank statement < 3 months"  },
];

function VerificationCard({ status }) {
  const [submitted, setSubmitted] = useState([]);
  if (status === "verified") return null;

  const submit = (id) => setSubmitted((s) => (s.includes(id) ? s : [...s, id]));

  return (
    <PSCard>
      <PSCardHead
        eyebrow="Identity verification"
        eyebrowIcon={<RiShieldCheckLine size={12} />}
        title="Become a verified guide"
        subtitle="Verified guides get 3× more bookings and a badge on their public profile."
      />

      <div className="flex flex-col gap-2 mb-5">
        {VERIFY_STEPS.map(({ id, icon, label, desc }, i) => {
          const done = submitted.includes(id);
          return (
            <div
              key={id}
              className="flex items-center gap-4 px-4 py-3 rounded-[10px] border transition-all"
              style={{
                borderColor: done ? "var(--ps-green-soft)" : "var(--ps-line)",
                background:  done ? "var(--ps-green-soft)" : "var(--ps-bg)",
              }}
            >
              {/* Step number */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                style={{
                  background: done ? "var(--ps-green)"      : "var(--ps-line)",
                  color:      done ? "#fff"                  : "var(--ps-ink-3)",
                }}
              >
                {done ? <HiCheckBadge size={14} /> : i + 1}
              </div>
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
                style={{
                  background: done ? "rgba(125,166,53,0.15)" : "var(--ps-card)",
                  color:      done ? "var(--ps-green-2)"     : "var(--ps-ink-3)",
                  border: `1px solid ${done ? "var(--ps-green-soft)" : "var(--ps-line)"}`,
                }}
              >
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: "var(--ps-ink)" }}>{label}</div>
                <div className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>{desc}</div>
              </div>
              {done ? (
                <BadgeMini>Submitted</BadgeMini>
              ) : (
                <label className="cursor-pointer">
                  <div
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all"
                    style={{ borderColor: "var(--ps-line)", background: "#fff", color: "var(--ps-ink-2)" }}
                  >
                    <RiUploadLine size={12} /> Upload
                  </div>
                  <input type="file" className="hidden" onChange={() => submit(id)} />
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer notice */}
      <div
        className="flex items-start gap-2 px-4 py-3 rounded-[10px] text-[11px]"
        style={{ background: "var(--ps-bg)", color: "var(--ps-ink-3)" }}
      >
        <RiShieldCheckLine size={14} className="flex-shrink-0 mt-0.5" style={{ color: "var(--ps-green-2)" }} />
        All documents are encrypted and reviewed by our trust team within 1–2 business days.
      </div>
    </PSCard>
  );
}

// ── About card ────────────────────────────────────────────────────────────────
function AboutCard({ profile, update }) {
  return (
    <PSCard>
      <PSCardHead
        eyebrow="✦ Public profile"
        title="Your story"
        subtitle="This is the first thing travellers read on your public profile."
      />
      <div className="flex flex-col gap-4">
        <div>
          <PSFieldLabel>Display name</PSFieldLabel>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold select-none"
              style={{ color: "var(--ps-ink-3)" }}
            >
              @
            </span>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => update({ username: e.target.value })}
              className="ps-field-input"
              style={{ paddingLeft: 28 }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <PSFieldLabel>Tagline</PSFieldLabel>
            <span className="text-[11px]" style={{ color: profile.tagline.length > 54 ? "var(--ps-orange)" : "var(--ps-ink-3)" }}>
              {profile.tagline.length}/60
            </span>
          </div>
          <PSInput
            value={profile.tagline}
            onChange={(e) => update({ tagline: e.target.value.slice(0, 60) })}
            placeholder="One punchy line that describes your tours…"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <PSFieldLabel>Bio</PSFieldLabel>
            <span className="text-[11px]" style={{ color: profile.bio.length > 560 ? "var(--ps-orange)" : "var(--ps-ink-3)" }}>
              {profile.bio.length}/600
            </span>
          </div>
          <PSTextarea
            value={profile.bio}
            onChange={(e) => update({ bio: e.target.value.slice(0, 600) })}
            placeholder="Tell travellers who you are, what you love about your city and what makes a tour with you special…"
            rows={5}
          />
          <button
            className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-colors"
            style={{ background: "none", border: "none", color: "var(--ps-green-2)", cursor: "pointer" }}
          >
            <RiSparklingLine size={13} /> Polish with AI
          </button>
        </div>
      </div>
    </PSCard>
  );
}

// ── Expertise card ────────────────────────────────────────────────────────────
function ExpertiseCard({ profile, update }) {
  const toggleSpecialty = (id) => {
    const has = profile.specialties.includes(id);
    if (!has && profile.specialties.length >= 5) return;
    update({ specialties: has ? profile.specialties.filter((s) => s !== id) : [...profile.specialties, id] });
  };

  const cycleProficiency = (code) => {
    const levels   = ["native", "fluent", "conversational"];
    const existing = profile.spokenLanguages.find((l) => l.code === code);
    if (!existing) {
      update({ spokenLanguages: [...profile.spokenLanguages, { code, level: "fluent" }] });
    } else {
      const idx  = levels.indexOf(existing.level);
      const next = levels[(idx + 1) % levels.length];
      update({ spokenLanguages: profile.spokenLanguages.map((l) => l.code === code ? { ...l, level: next } : l) });
    }
  };

  const removeLang = (code) =>
    update({ spokenLanguages: profile.spokenLanguages.filter((l) => l.code !== code) });

  return (
    <PSCard>
      <PSCardHead
        eyebrow="Expertise"
        eyebrowIcon={<RiStarLine size={12} />}
        title="What you do best"
        subtitle="Pick up to 5 specialties. Click a language to toggle proficiency."
      />

      {/* Specialties */}
      <div className="mb-5">
        <PSFieldLabel>Specialties <span style={{ color: "var(--ps-ink-3)" }}>({profile.specialties.length}/5)</span></PSFieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {SPECIALTIES.map(({ id, label }) => (
            <Chip
              key={id}
              selected={profile.specialties.includes(id)}
              onClick={() => toggleSpecialty(id)}
            >
              {label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <PSFieldLabel>Languages spoken</PSFieldLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {LANGUAGES.map(({ code, label, flag }) => {
            const entry    = profile.spokenLanguages.find((l) => l.code === code);
            const selected = !!entry;
            return (
              <div key={code} className="flex items-center gap-1">
                <Chip selected={selected} onClick={() => selected ? removeLang(code) : cycleProficiency(code)}>
                  {flag} {label}
                </Chip>
                {selected && (
                  <button
                    onClick={() => cycleProficiency(code)}
                    className="text-[10px] font-bold px-2 py-1 rounded-full border transition-all capitalize"
                    style={{
                      background:  "var(--ps-green-soft)",
                      borderColor: "var(--ps-green-soft)",
                      color:       "var(--ps-green-2)",
                      cursor:      "pointer",
                    }}
                  >
                    {entry.level}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PSCard>
  );
}

// ── Cities card ───────────────────────────────────────────────────────────────
function CitiesCard({ profile, update }) {
  const toggle = (id) => {
    const has = profile.cities.includes(id);
    update({ cities: has ? profile.cities.filter((c) => c !== id) : [...profile.cities, id] });
  };

  const CITY_GRADIENTS = {
    marrakech:   "linear-gradient(135deg, #c4853a 0%, #8b5e27 100%)",
    fes:         "linear-gradient(135deg, #4a7a6e 0%, #2d5248 100%)",
    casablanca:  "linear-gradient(135deg, #5b7fa6 0%, #2d4d6e 100%)",
    chefchaouen: "linear-gradient(135deg, #5a82b8 0%, #2d4f7a 100%)",
    essaouira:   "linear-gradient(135deg, #6e9e8a 0%, #3d6457 100%)",
    rabat:       "linear-gradient(135deg, #8b6e4a 0%, #5a4230 100%)",
  };

  return (
    <PSCard>
      <PSCardHead
        eyebrow="Coverage"
        eyebrowIcon={<RiMapPinLine size={12} />}
        title="Cities you guide in"
        subtitle="Select all cities where you offer tours."
      />
      <div className="grid grid-cols-3 gap-3 max-[640px]:grid-cols-1">
        {CITIES.map(({ id, label, region }) => {
          const selected = profile.cities.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="relative overflow-hidden rounded-[12px] border-2 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: selected ? "var(--ps-green)" : "var(--ps-line)",
                background:  "transparent",
              }}
            >
              {/* Gradient header */}
              <div
                className="h-20 flex items-end px-3 pb-2"
                style={{ background: CITY_GRADIENTS[id] || "linear-gradient(135deg, #888 0%, #555 100%)" }}
              >
                {selected && (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px]"
                    style={{ background: "var(--ps-green)", color: "#fff" }}
                  >
                    ✓
                  </span>
                )}
              </div>
              <div className="px-3 py-2.5" style={{ background: selected ? "var(--ps-green-soft)" : "var(--ps-bg)" }}>
                <div
                  className="text-[14px] font-semibold"
                  style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
                >
                  {label}
                </div>
                <div className="text-[10px] mt-0.5 leading-tight" style={{ color: "var(--ps-ink-3)" }}>{region}</div>
              </div>
            </button>
          );
        })}
      </div>
    </PSCard>
  );
}

// ── Availability card ─────────────────────────────────────────────────────────
function AvailabilityCard({ profile, update }) {
  const [addingSlot, setAddingSlot] = useState({});
  const [slotDraft,  setSlotDraft]  = useState({});
  const [newDate,    setNewDate]    = useState("");

  const toggleDay = (day) => {
    update({
      schedule: profile.schedule.map((d) =>
        d.day === day ? { ...d, isOpen: !d.isOpen } : d
      ),
    });
  };

  const removeSlot = (day, idx) => {
    update({
      schedule: profile.schedule.map((d) =>
        d.day === day ? { ...d, slots: d.slots.filter((_, i) => i !== idx) } : d
      ),
    });
  };

  const confirmSlot = (day) => {
    const draft = slotDraft[day];
    if (!draft?.start || !draft?.end) return;
    update({
      schedule: profile.schedule.map((d) =>
        d.day === day ? { ...d, slots: [...d.slots, { start: draft.start, end: draft.end }] } : d
      ),
    });
    setAddingSlot((s) => ({ ...s, [day]: false }));
    setSlotDraft((s) => ({ ...s, [day]: undefined }));
  };

  const addUnavailable = () => {
    if (!newDate || profile.unavailableDates.includes(newDate)) return;
    update({ unavailableDates: [...profile.unavailableDates, newDate].sort() });
    setNewDate("");
  };

  const removeUnavailable = (d) =>
    update({ unavailableDates: profile.unavailableDates.filter((x) => x !== d) });

  const DAY_LABEL = Object.fromEntries(DAYS.map(({ id, label }) => [id, label]));

  return (
    <PSCard>
      <PSCardHead
        eyebrow="Availability"
        eyebrowIcon={<RiTimeLine size={12} />}
        title="When you guide"
        right={
          <div className="flex items-center gap-2.5">
            {profile.isCurrentlyAvailable && (
              <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--ps-green-2)" }}>
                <span className="ps-pulse" /> Live
              </span>
            )}
            <Toggle
              isOn={profile.isCurrentlyAvailable}
              onChange={() => update({ isCurrentlyAvailable: !profile.isCurrentlyAvailable })}
              label="Currently accepting bookings"
            />
          </div>
        }
      />

      {/* Day rows */}
      <div className="flex flex-col gap-2 mb-5">
        {profile.schedule.map(({ day, isOpen, slots }) => (
          <div key={day}>
            <div
              className="grid items-start gap-3 py-2"
              style={{ gridTemplateColumns: "110px 44px 1fr" }}
            >
              {/* Day label */}
              <span
                className="text-[13px] font-medium pt-0.5"
                style={{ fontFamily: "var(--ps-font-display)", color: isOpen ? "var(--ps-ink)" : "var(--ps-ink-3)" }}
              >
                {DAY_LABEL[day]}
              </span>

              {/* Day toggle */}
              <Toggle isOn={isOpen} onChange={() => toggleDay(day)} label={`Enable ${day}`} />

              {/* Slots */}
              <div className="flex flex-wrap gap-1.5 items-center min-h-[28px]">
                {isOpen && slots.map((slot, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                    style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)", color: "var(--ps-ink-2)" }}
                  >
                    {slot.start} — {slot.end}
                    <button
                      onClick={() => removeSlot(day, i)}
                      className="ml-0.5 transition-colors"
                      style={{ background: "none", border: "none", color: "var(--ps-ink-3)", cursor: "pointer", lineHeight: 1, padding: 0 }}
                    >
                      <RiCloseLine size={12} />
                    </button>
                  </span>
                ))}

                {isOpen && (
                  addingSlot[day] ? (
                    <span className="inline-flex items-center gap-1.5">
                      <input
                        type="time"
                        defaultValue="09:00"
                        onChange={(e) => setSlotDraft((s) => ({ ...s, [day]: { ...s[day], start: e.target.value } }))}
                        className="ps-field-input"
                        style={{ width: 100, padding: "4px 8px", fontSize: 12 }}
                      />
                      <span style={{ color: "var(--ps-ink-3)" }}>—</span>
                      <input
                        type="time"
                        defaultValue="13:00"
                        onChange={(e) => setSlotDraft((s) => ({ ...s, [day]: { ...s[day], end: e.target.value } }))}
                        className="ps-field-input"
                        style={{ width: 100, padding: "4px 8px", fontSize: 12 }}
                      />
                      <button
                        onClick={() => confirmSlot(day)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full transition-all"
                        style={{ background: "var(--ps-green)", color: "#fff", border: "none", cursor: "pointer" }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddingSlot((s) => ({ ...s, [day]: false }))}
                        className="text-[11px] px-2 py-1 rounded-full transition-all"
                        style={{ background: "transparent", border: "1px solid var(--ps-line)", color: "var(--ps-ink-3)", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setAddingSlot((s) => ({ ...s, [day]: true }))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border-dashed border transition-all"
                      style={{ borderColor: "var(--ps-line-2)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
                    >
                      <RiAddLine size={12} /> Add slot
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Block dates */}
      <div className="border-t pt-4" style={{ borderColor: "var(--ps-line)" }}>
        <PSFieldLabel>Unavailable dates</PSFieldLabel>
        <div className="flex items-center gap-2 mt-2 mb-3">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="ps-field-input"
            style={{ width: 160 }}
          />
          <PsBtnPrimary onClick={addUnavailable} disabled={!newDate}>
            <RiAddLine size={14} /> Add date
          </PsBtnPrimary>
        </div>
        {profile.unavailableDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.unavailableDates.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: "var(--ps-orange-soft)", color: "var(--ps-orange)" }}
              >
                {d}
                <button
                  onClick={() => removeUnavailable(d)}
                  style={{ background: "none", border: "none", color: "var(--ps-orange)", cursor: "pointer", padding: 0, lineHeight: 1 }}
                >
                  <RiCloseLine size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </PSCard>
  );
}

// ── Pricing card ──────────────────────────────────────────────────────────────
const QUICK_PRICES = [250, 350, 500, 750];
const MAD_TO_EUR   = 0.093;
const MAD_TO_USD   = 0.10;

function PricingCard({ profile, update }) {
  return (
    <PSCard>
      <PSCardHead
        eyebrow="Pricing"
        eyebrowIcon={<RiPencilLine size={12} />}
        title="Set your rate"
        subtitle="What travellers pay per hour of guided experience."
      />

      {/* Price input */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <input
            type="number"
            min={0}
            value={profile.pricePerHour}
            onChange={(e) => update({ pricePerHour: Number(e.target.value) })}
            className="ps-field-input text-right font-semibold"
            style={{
              fontFamily: "var(--ps-font-display)",
              fontSize: 36,
              width: 160,
              paddingRight: 56,
              paddingTop: 12,
              paddingBottom: 12,
            }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[16px] font-semibold"
            style={{ color: "var(--ps-ink-3)", fontFamily: "var(--ps-font-display)" }}
          >
            MAD
          </span>
        </div>
        <span className="text-[16px]" style={{ color: "var(--ps-ink-3)" }}>/ hour</span>
      </div>

      {/* Conversion hint */}
      <p className="text-[12px] mb-4" style={{ color: "var(--ps-ink-3)" }}>
        ≈ <strong style={{ color: "var(--ps-ink-2)" }}>€{(profile.pricePerHour * MAD_TO_EUR).toFixed(0)}</strong>
        {" · "}
        <strong style={{ color: "var(--ps-ink-2)" }}>${(profile.pricePerHour * MAD_TO_USD).toFixed(0)}</strong> USD
      </p>

      {/* Quick-set chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PRICES.map((p) => (
          <button
            key={p}
            onClick={() => update({ pricePerHour: p })}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all"
            style={{
              background:  profile.pricePerHour === p ? "var(--ps-green-soft)" : "transparent",
              borderColor: profile.pricePerHour === p ? "var(--ps-green-2)"    : "var(--ps-line)",
              color:       profile.pricePerHour === p ? "var(--ps-green-2)"    : "var(--ps-ink-3)",
              cursor: "pointer",
            }}
          >
            {p} MAD
          </button>
        ))}
      </div>
    </PSCard>
  );
}

// ── Public preview rail ───────────────────────────────────────────────────────
function PublicPreview({ profile }) {
  const topSpecialties = SPECIALTIES.filter((s) => profile.specialties.includes(s.id)).slice(0, 3);
  const primaryCity    = CITIES.find((c) => c.id === profile.cities[0]);
  const avatarSrc      = profile.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.firstName)}&background=7DA635&color=fff&size=128`;

  return (
    <div
      className="sticky top-[88px] rounded-[18px] overflow-hidden"
      style={{ width: 320, flexShrink: 0, border: "1px solid var(--ps-line)", boxShadow: "var(--ps-shadow)" }}
    >
      {/* Banner */}
      <div
        className="h-[100px]"
        style={{
          background: profile.bannerUrl
            ? `url(${profile.bannerUrl}) center/cover`
            : "linear-gradient(135deg, #c4853a 0%, #8b5e27 100%)",
        }}
      />

      {/* Avatar overlap */}
      <div className="relative px-5 pb-5" style={{ background: "var(--ps-card)" }}>
        <div className="flex items-end justify-between -mt-7 mb-3">
          <img
            src={avatarSrc}
            alt={profile.firstName}
            className="w-14 h-14 rounded-full object-cover border-[3px] block"
            style={{ borderColor: "var(--ps-card)" }}
          />
          {profile.verificationStatus === "verified" && (
            <BadgeMini><RiShieldCheckLine size={10} /> Verified</BadgeMini>
          )}
        </div>

        <div
          className="text-[17px] font-semibold leading-tight mb-0.5"
          style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
        >
          {profile.firstName}
        </div>
        {profile.tagline && (
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--ps-ink-3)" }}>
            {profile.tagline}
          </p>
        )}

        {/* Specialties */}
        {topSpecialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {topSpecialties.map(({ id, label }) => (
              <span
                key={id}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "var(--ps-green-soft)", color: "var(--ps-green-2)" }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--ps-ink-3)" }}>
            <RiMapPinLine size={13} />
            <span>{primaryCity?.label || "Morocco"}</span>
          </div>
          <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--ps-ink-2)" }}>
            <IoStarSharp size={12} style={{ color: "#f4b942" }} />
            <strong>{profile.averageRating.toFixed(1)}</strong>
          </div>
          <div className="text-[12px]" style={{ color: "var(--ps-ink-2)" }}>
            <strong style={{ fontFamily: "var(--ps-font-display)", fontSize: 14 }}>
              {profile.pricePerHour}
            </strong>
            <span style={{ color: "var(--ps-ink-3)" }}> MAD/hr</span>
          </div>
        </div>

        <button
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-semibold transition-all"
          style={{ background: "var(--ps-green)", color: "#fff", border: "none", cursor: "pointer" }}
        >
          <RiEyeLine size={14} /> View public profile
        </button>
      </div>
    </div>
  );
}

// ── Action bar ────────────────────────────────────────────────────────────────
function ActionBar({ isDirty, onDiscard, onSave }) {
  if (!isDirty) return null;
  return (
    <div className="ps-action-bar" role="region" aria-label="Save changes">
      <span className="ps-pulse" />
      <span className="text-[12px] font-medium flex-1 min-w-0 truncate" style={{ color: "var(--ps-ink-3)" }}>
        Unsaved changes
      </span>
      <PsBtnGhost onClick={onDiscard}>Discard</PsBtnGhost>
      <PsBtnOutline>
        <RiEyeLine size={13} /> Preview public
      </PsBtnOutline>
      <PsBtnPrimary onClick={onSave}>Save changes</PsBtnPrimary>
    </div>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function GuideProfileSettings() {
  const [profile, setProfile] = useState({ ...MOCK_GUIDE_PROFILE });
  const [isDirty, setIsDirty] = useState(false);

  const update = (patch) => {
    setProfile((p) => ({ ...p, ...patch }));
    setIsDirty(true);
  };

  const handleSave = () => {
    console.log("[GuideProfileSettings] saved", profile);
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setProfile({ ...MOCK_GUIDE_PROFILE });
    setIsDirty(false);
  };

  return (
    <>
      {/* Two-column: cards + preview */}
      <div className="flex gap-6 items-start max-[1180px]:flex-col">
        {/* Card stack */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <HeroBannerCard      profile={profile} update={update} />
          <VerificationCard    status={profile.verificationStatus} />
          <AboutCard           profile={profile} update={update} />
          <ExpertiseCard       profile={profile} update={update} />
          <CitiesCard          profile={profile} update={update} />
          <AvailabilityCard    profile={profile} update={update} />
          <PricingCard         profile={profile} update={update} />
        </div>

        {/* Public preview rail — hidden below 1180px */}
        <div className="max-[1180px]:hidden">
          <PublicPreview profile={profile} />
        </div>
      </div>

      <ActionBar isDirty={isDirty} onDiscard={handleDiscard} onSave={handleSave} />
    </>
  );
}
