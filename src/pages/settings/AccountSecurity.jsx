// pages/settings/AccountSecurity.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import {
  RiShieldLine, RiLinksLine, RiUserLine, RiDeleteBinLine,
  RiCameraLine, RiLockPasswordLine, RiMailLine, RiPhoneLine,
  RiMapPinLine, RiGlobeLine, RiCalendarLine, RiAddLine,
  RiAlertLine, RiCheckLine, RiUserHeartLine,
} from "react-icons/ri";
import { HiCheck, HiXMark } from "react-icons/hi2";
import {
  selectUser, selectAuthLoading,
  updateUser, clearError,
} from "../../store/slices/authSlice";
import { PSCardHead, PsBtnPrimary, PsBtnGhost, BadgeMini, Toggle } from "../../components/settings/atoms";

// ── Helpers ───────────────────────────────────────────────────────────────────
const toDisplayName = (u) =>
  u?.name || [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "User";

const toAvatar = (u) =>
  u?.avatar || u?.avatarUrl ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(toDisplayName(u))}&background=7DA635&color=fff&size=128`;

const toInitDraft = (u) => ({
  firstName:   u?.firstName  || (u?.name?.split(" ")[0]                   ?? ""),
  lastName:    u?.lastName   || (u?.name?.split(" ").slice(1).join(" ")   ?? ""),
  email:       u?.email       ?? "",
  phone:       u?.phone       ?? "",
  city:        u?.city        ?? "",
  nationality: u?.nationality ?? "",
  gender:      u?.gender      ?? "",
  dob:         u?.dob         ?? "",
  avatar:      u?.avatar || u?.avatarUrl || "",
});

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ icon, label, value, onChange, type = "text", hint, readOnly = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[11px] font-bold uppercase tracking-[0.06em]"
        style={{ color: "var(--ps-ink-3)" }}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
            style={{ color: "var(--ps-ink-3)" }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-[10px] border text-[13px] font-medium outline-none transition-all duration-200`}
          style={{
            borderColor:   "var(--ps-line)",
            background:    readOnly ? "var(--ps-bg)" : "#fff",
            color:         "var(--ps-ink)",
            fontFamily:    "var(--ps-font-ui)",
            boxSizing:     "border-box",
          }}
          onFocus={(e) => {
            if (!readOnly) {
              e.target.style.borderColor = "var(--ps-green)";
              e.target.style.boxShadow   = "0 0 0 3px rgba(125,166,53,0.12)";
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--ps-line)";
            e.target.style.boxShadow   = "none";
          }}
        />
      </div>
      {hint && (
        <span className="text-[11px] font-semibold" style={{ color: "var(--ps-green-2)" }}>
          {hint}
        </span>
      )}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-[13px] font-semibold animate-slide-up"
      style={{
        background:  toast.type === "success" ? "var(--ps-green)"  : "var(--ps-danger)",
        color:       "#fff",
        fontFamily:  "var(--ps-font-ui)",
        whiteSpace:  "nowrap",
      }}
    >
      {toast.type === "success" ? <HiCheck size={16} /> : <RiAlertLine size={16} />}
      {toast.msg}
    </div>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ children, danger = false }) {
  return (
    <div
      className="rounded-[18px] border"
      style={{
        background:   "var(--ps-card)",
        borderColor:  danger ? "rgba(184,84,51,0.22)" : "var(--ps-line)",
        boxShadow:    "var(--ps-shadow-sm)",
        padding:      "var(--ps-pad)",
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AccountSecurity() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);
  const loading  = useSelector(selectAuthLoading);

  // ── Draft state (all editable fields) ────────────────────────────────────────
  const [draft,           setDraft]           = useState(() => toInitDraft(user));
  const [twoFA,           setTwoFA]           = useState(true);
  const [toast,           setToast]           = useState(null);
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  // ── Connected accounts ────────────────────────────────────────────────────────
  const [providers, setProviders] = useState(() => {
    const linked      = user?.linkedAccounts || [];
    const googleLink  = linked.find((a) => a.provider === "google");
    const appleLink   = linked.find((a) => a.provider === "apple");
    const fbLink      = linked.find((a) => a.provider === "facebook");
    return [
      {
        name: "Google", icon: <FcGoogle size={18} />,
        connected: !!googleLink || user?.provider === "google",
        email: googleLink?.email || (user?.provider === "google" ? user.email : ""),
      },
      {
        name: "Apple", icon: <span className="text-[15px] font-bold leading-none"></span>,
        connected: !!appleLink, email: appleLink?.email || "",
      },
      {
        name: "Facebook", icon: <span className="text-[14px] font-bold text-[#1877F2]">f</span>,
        connected: !!fbLink, email: fbLink?.email || "",
      },
    ];
  });

  // ── Derived ───────────────────────────────────────────────────────────────────
  const currentAvatar = draft.avatar || toAvatar(user);
  const fullName      = [draft.firstName, draft.lastName].filter(Boolean).join(" ") || toDisplayName(user);
  const hasChanges    = JSON.stringify(draft) !== JSON.stringify(toInitDraft(user));

  const joinedDate = (() => {
    const raw = user?.joinedAt || user?.createdAt;
    if (!raw) return null;
    return new Date(raw).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })();

  const roleBadge = user?.role === "admin"
    ? <BadgeMini color="orange">Admin</BadgeMini>
    : user?.isGuide || user?.role === "guide"
    ? <BadgeMini color="green">Guide</BadgeMini>
    : <BadgeMini color="orange">Member</BadgeMini>;

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3200);
  };

  const handleSave = async () => {
    dispatch(clearError());
    const updates = {
      ...draft,
      name:      [draft.firstName, draft.lastName].filter(Boolean).join(" "),
      avatar:    draft.avatar || undefined,
      avatarUrl: draft.avatar || undefined,
    };
    const result = await dispatch(updateUser(updates));
    if (updateUser.fulfilled.match(result)) {
      showToast("success", "Profile saved successfully!");
    } else {
      showToast("error", "Failed to save. Please try again.");
    }
  };

  const handleDiscard = () => setDraft(toInitDraft(user));

  const toggleProvider = (name) =>
    setProviders((p) =>
      p.map((pr) => pr.name === name ? { ...pr, connected: !pr.connected } : pr)
    );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 pb-28">

      {/* ── Profile hero ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-[18px] border overflow-hidden"
        style={{ background: "var(--ps-card)", borderColor: "var(--ps-line)", boxShadow: "var(--ps-shadow-sm)" }}
      >
        {/* Cover banner */}
        <div
          className="h-[88px]"
          style={{ background: "linear-gradient(135deg, var(--ps-dark) 0%, var(--ps-dark-2) 100%)" }}
        />

        <div className="px-6 pb-6">
          <div className="flex items-end gap-5 -mt-9 mb-4 flex-wrap">

            {/* Avatar with edit overlay */}
            <div className="relative flex-shrink-0">
              <img
                src={currentAvatar}
                alt={fullName}
                className="w-[76px] h-[76px] rounded-full object-cover border-4"
                style={{ borderColor: "var(--ps-card)", boxShadow: "0 2px 14px rgba(0,0,0,0.2)" }}
              />
              <button
                onClick={() => setShowAvatarInput((v) => !v)}
                className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ background: "var(--ps-green)", borderColor: "var(--ps-card)", color: "#fff", cursor: "pointer" }}
                title="Change photo"
              >
                <RiCameraLine size={12} />
              </button>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-9">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className="text-[18px] font-semibold leading-tight m-0"
                  style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
                >
                  {fullName}
                </h2>
                {roleBadge}
                {user?.isVerified && (
                  <BadgeMini color="green">
                    <RiCheckLine size={9} /> Verified
                  </BadgeMini>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-[12px]" style={{ color: "var(--ps-ink-3)" }}>
                  {user?.email}
                </span>
                {joinedDate && (
                  <span className="text-[12px]" style={{ color: "var(--ps-ink-3)" }}>
                    · Member since {joinedDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Avatar URL input */}
          {showAvatarInput && (
            <div
              className="p-4 rounded-[12px] border mt-1"
              style={{ background: "var(--ps-bg)", borderColor: "var(--ps-line)" }}
            >
              <p className="text-[12px] mb-2.5" style={{ color: "var(--ps-ink-3)", fontFamily: "var(--ps-font-ui)" }}>
                Enter a photo URL to update your profile picture
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={draft.avatar}
                  onChange={(e) => set("avatar")(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-[10px] border text-[13px] outline-none"
                  style={{
                    borderColor: "var(--ps-line)", background: "#fff",
                    color: "var(--ps-ink)", fontFamily: "var(--ps-font-ui)",
                  }}
                />
                <button
                  onClick={() => setShowAvatarInput(false)}
                  className="px-4 py-2 rounded-[10px] text-[12px] font-semibold transition-colors flex-shrink-0"
                  style={{ background: "var(--ps-green)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
                >
                  Apply
                </button>
                <button
                  onClick={() => { set("avatar")(""); setShowAvatarInput(false); }}
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center transition-colors flex-shrink-0"
                  style={{ background: "var(--ps-bg)", border: "1px solid var(--ps-line)", color: "var(--ps-ink-3)", cursor: "pointer" }}
                >
                  <HiXMark size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Personal information ──────────────────────────────────────────────── */}
      <SectionCard>
        <PSCardHead
          eyebrow="Personal information"
          eyebrowIcon={<RiUserLine size={12} />}
          title="Your profile details"
          subtitle="Used for receipts, payouts and ID verification — never shown publicly."
        />
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">

          <Field
            icon={<RiUserHeartLine size={14} />}
            label="First name"
            value={draft.firstName}
            onChange={set("firstName")}
          />
          <Field
            icon={<RiUserHeartLine size={14} />}
            label="Last name"
            value={draft.lastName}
            onChange={set("lastName")}
          />
          <Field
            icon={<RiMailLine size={14} />}
            label="Email address"
            value={draft.email}
            onChange={set("email")}
            type="email"
            hint="✓ Verified"
          />
          <Field
            icon={<RiPhoneLine size={14} />}
            label="Phone number"
            value={draft.phone}
            onChange={set("phone")}
            type="tel"
          />
          <Field
            icon={<RiMapPinLine size={14} />}
            label="City of residence"
            value={draft.city}
            onChange={set("city")}
          />
          <Field
            icon={<RiGlobeLine size={14} />}
            label="Nationality"
            value={draft.nationality}
            onChange={set("nationality")}
          />
          <Field
            icon={<RiCalendarLine size={14} />}
            label="Date of birth"
            value={draft.dob}
            onChange={set("dob")}
            type="date"
          />

          {/* Gender select */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{ color: "var(--ps-ink-3)" }}
            >
              Gender
            </label>
            <select
              value={draft.gender}
              onChange={(e) => set("gender")(e.target.value)}
              className="ps-field-select"
            >
              <option value="">Prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

        </div>
      </SectionCard>

      {/* ── Sign-in & security ────────────────────────────────────────────────── */}
      <SectionCard>
        <PSCardHead
          eyebrow="Sign-in & security"
          eyebrowIcon={<RiShieldLine size={12} />}
          title="Keep your account safe"
          subtitle="Manage your password and enable extra layers of protection."
        />
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
              Password
            </label>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center gap-2.5 px-3.5 rounded-[10px] border h-[42px]"
                style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
              >
                <RiLockPasswordLine size={14} style={{ color: "var(--ps-ink-3)", flexShrink: 0 }} />
                <span
                  className="text-[17px] tracking-[0.22em] mt-0.5"
                  style={{ color: "var(--ps-ink-3)", letterSpacing: "0.22em" }}
                >
                  ••••••••
                </span>
              </div>
              <button
                className="px-3.5 py-2.5 rounded-[10px] border text-[12px] font-semibold transition-all flex-shrink-0 hover:bg-sand2"
                style={{
                  borderColor: "var(--ps-line)", color: "var(--ps-ink-2)",
                  background: "#fff", cursor: "pointer", fontFamily: "var(--ps-font-ui)",
                }}
              >
                Change
              </button>
            </div>
            <span className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>
              Last changed 2 months ago
            </span>
          </div>

          {/* 2FA */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
                Two-factor auth
              </label>
              <BadgeMini color={twoFA ? "green" : "orange"}>
                {twoFA ? "Enabled" : "Disabled"}
              </BadgeMini>
            </div>
            <div
              className="flex items-center justify-between px-3.5 py-3 rounded-[10px] border"
              style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
            >
              <div>
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--ps-ink-2)", fontFamily: "var(--ps-font-ui)" }}
                >
                  Authenticator app
                </div>
                <div className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>
                  {twoFA ? "Protected via TOTP" : "Add an extra layer of security"}
                </div>
              </div>
              <Toggle
                isOn={twoFA}
                onChange={() => setTwoFA((v) => !v)}
                label="Two-factor authentication"
              />
            </div>
          </div>

        </div>
      </SectionCard>

      {/* ── Connected accounts ────────────────────────────────────────────────── */}
      <SectionCard>
        <PSCardHead
          eyebrow="Linked accounts"
          eyebrowIcon={<RiLinksLine size={12} />}
          title="Sign-in providers"
          subtitle="Connect alternative ways to sign in to your account."
        />
        <div className="flex flex-col gap-2.5">
          {providers.map((pr) => (
            <div
              key={pr.name}
              className="flex items-center gap-4 px-4 py-3.5 rounded-[12px] border transition-all duration-200"
              style={{
                borderColor: pr.connected ? "rgba(125,166,53,0.3)" : "var(--ps-line)",
                background:  pr.connected ? "var(--ps-green-soft)"  : "var(--ps-bg)",
              }}
            >
              {/* Provider icon */}
              <div
                className="w-10 h-10 rounded-[10px] border flex items-center justify-center flex-shrink-0 bg-white"
                style={{ borderColor: "var(--ps-line)" }}
              >
                {pr.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--ps-ink-2)", fontFamily: "var(--ps-font-ui)" }}
                >
                  {pr.name}
                </div>
                <div className="text-[11px] truncate" style={{ color: "var(--ps-ink-3)" }}>
                  {pr.connected ? (pr.email || "Connected") : "Not connected"}
                </div>
              </div>

              {/* Status badge */}
              {pr.connected && (
                <BadgeMini color="green">
                  <RiCheckLine size={9} /> Active
                </BadgeMini>
              )}

              {/* Action button */}
              <button
                onClick={() => toggleProvider(pr.name)}
                className="px-3.5 py-1.5 rounded-[10px] border text-[12px] font-semibold transition-all flex-shrink-0 flex items-center gap-1"
                style={{
                  borderColor: pr.connected ? "rgba(184,84,51,0.3)" : "var(--ps-line)",
                  color:       pr.connected ? "var(--ps-danger)"     : "var(--ps-ink-3)",
                  background:  "#fff",
                  cursor:      "pointer",
                  fontFamily:  "var(--ps-font-ui)",
                }}
              >
                {pr.connected
                  ? "Disconnect"
                  : <><RiAddLine size={11} /> Connect</>}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Danger zone ───────────────────────────────────────────────────────── */}
      <SectionCard danger>
        <PSCardHead
          eyebrow="Danger zone"
          eyebrowIcon={<RiAlertLine size={12} />}
          title="Pause or delete account"
          subtitle="Pausing hides your profile but keeps your history. Deletion is permanent and cannot be undone."
        />
        <div
          className="flex gap-3 flex-wrap p-4 rounded-[12px] border"
          style={{ borderColor: "rgba(184,84,51,0.18)", background: "rgba(184,84,51,0.03)" }}
        >
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all hover:bg-sand2"
            style={{
              borderColor: "var(--ps-line)", background: "transparent",
              color: "var(--ps-ink-3)", cursor: "pointer", fontFamily: "var(--ps-font-ui)",
            }}
          >
            Pause account
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all hover:bg-red-50"
            style={{
              borderColor: "rgba(184,84,51,0.4)", background: "transparent",
              color: "var(--ps-danger)", cursor: "pointer", fontFamily: "var(--ps-font-ui)",
            }}
          >
            <RiDeleteBinLine size={14} /> Delete account
          </button>
        </div>
      </SectionCard>

      {/* ── Floating save bar (appears only when there are changes) ──────────── */}
      {hasChanges && (
        <div className="ps-action-bar">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "var(--ps-orange)", boxShadow: "0 0 0 3px var(--ps-orange-soft)" }}
          />
          <span
            className="flex-1 text-[13px] font-medium"
            style={{ color: "var(--ps-ink-2)", fontFamily: "var(--ps-font-ui)" }}
          >
            Unsaved changes
          </span>
          <PsBtnGhost onClick={handleDiscard}>Discard</PsBtnGhost>
          <PsBtnPrimary onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : "Save changes"}
          </PsBtnPrimary>
        </div>
      )}

      {/* ── Toast notification ────────────────────────────────────────────────── */}
      <Toast toast={toast} />

    </div>
  );
}
