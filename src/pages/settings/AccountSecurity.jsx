// pages/settings/AccountSecurity.jsx
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import {
  RiShieldLine, RiLinksLine, RiUserLine, RiDeleteBinLine,
  RiCameraLine, RiLockPasswordLine, RiMailLine, RiPhoneLine,
  RiMapPinLine, RiGlobeLine, RiCalendarLine, RiAddLine,
  RiAlertLine, RiCheckLine, RiUserHeartLine, RiFileTextLine,
  RiUploadCloud2Line,
} from "react-icons/ri";
import { HiCheck, HiXMark } from "react-icons/hi2";
import {
  selectUser, selectAuthLoading,
  updateUser, clearError, uploadAvatarThunk,
} from "../../store/slices/authSlice";
import { PSCardHead, PsBtnPrimary, PsBtnGhost, BadgeMini, Toggle } from "../../components/settings/atoms";

// ── Helpers ───────────────────────────────────────────────────────────────────
const toDisplayName = (u) =>
  u?.name || [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "User";

const toAvatar = (u) =>
  u?.avatar || u?.avatarUrl ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(toDisplayName(u))}&background=7DA635&color=fff&size=128`;

const toInitDraft = (u) => ({
  firstName:   u?.firstName   || (u?.name?.split(" ")[0]                 ?? ""),
  lastName:    u?.lastName    || (u?.name?.split(" ").slice(1).join(" ") ?? ""),
  email:       u?.email       ?? "",
  phone:       u?.phone       ?? "",
  city:        u?.city        ?? "",
  nationality: u?.nationality ?? "",
  gender:      u?.gender      ?? "",
  dob:         u?.dob ? new Date(u.dob).toISOString().split("T")[0] : "",
  bio:         u?.bio         ?? "",
});

// ── Profile-completion checks ─────────────────────────────────────────────────
const CHECKS = [
  { key: "photo",       label: "Photo",       fn: (u)    => !!(u?.avatarUrl && !u.avatarUrl.includes("ui-avatars")) },
  { key: "firstName",   label: "First name",  fn: (_, d) => !!d.firstName },
  { key: "lastName",    label: "Last name",   fn: (_, d) => !!d.lastName },
  { key: "bio",         label: "Bio",         fn: (_, d) => (d.bio || "").length >= 15 },
  { key: "phone",       label: "Phone",       fn: (_, d) => !!d.phone },
  { key: "city",        label: "City",        fn: (_, d) => !!d.city },
  { key: "nationality", label: "Nationality", fn: (_, d) => !!d.nationality },
  { key: "dob",         label: "Birthday",    fn: (_, d) => !!d.dob },
];

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-[13px] font-semibold animate-slide-up"
      style={{
        background:  toast.type === "success" ? "var(--ps-green)" : "var(--ps-danger)",
        color:       "#fff",
        fontFamily:  "var(--ps-font-ui)",
        whiteSpace:  "nowrap",
        backdropFilter: "blur(8px)",
      }}
    >
      {toast.type === "success" ? <HiCheck size={16} /> : <RiAlertLine size={16} />}
      {toast.msg}
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({ children, danger = false }) {
  return (
    <div
      className="rounded-[18px] border"
      style={{
        background:  "var(--ps-card)",
        borderColor: danger ? "rgba(184,84,51,0.22)" : "var(--ps-line)",
        boxShadow:   "var(--ps-shadow-sm)",
        padding:     "var(--ps-pad)",
      }}
    >
      {children}
    </div>
  );
}

// ── Avatar zone (gradient ring + hover overlay + camera badge) ────────────────
function AvatarZone({ src, onFileChange, uploading }) {
  const ref = useRef(null);
  return (
    <div className="relative flex-shrink-0 group" style={{ marginTop: "-40px" }}>
      {/* Gradient ring */}
      <div
        className="p-[3px] rounded-full shadow-xl"
        style={{
          background: uploading
            ? "var(--ps-line)"
            : "linear-gradient(135deg, #7DA635 0%, #c3e05a 50%, #5a8a20 100%)",
        }}
      >
        <div className="rounded-full overflow-hidden" style={{ border: "3px solid var(--ps-card)" }}>
          <img src={src} alt="Profile" className="w-[88px] h-[88px] block object-cover" />
          {/* Hover overlay */}
          <div
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            style={{ background: "rgba(0,0,0,0.48)" }}
            onClick={() => ref.current?.click()}
          >
            <RiCameraLine size={22} className="text-white" />
            <span className="text-white text-[10px] font-bold tracking-wide mt-1 uppercase">Change</span>
          </div>
        </div>
      </div>
      {/* Badge button */}
      <button
        onClick={() => ref.current?.click()}
        className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full border-[2.5px] flex items-center justify-center shadow-md transition-transform hover:scale-110 active:scale-95"
        style={{ background: "var(--ps-green)", borderColor: "var(--ps-card)", color: "#fff", cursor: "pointer" }}
        title="Change profile photo"
      >
        {uploading
          ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
          : <RiCameraLine size={13} />}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}

// ── Completion bar (inside hero white area) ───────────────────────────────────
function CompletionBar({ user, draft }) {
  const items  = CHECKS.map((c) => ({ ...c, done: c.fn(user, draft) }));
  const done   = items.filter((c) => c.done).length;
  const pct    = Math.round((done / items.length) * 100);
  const missing = items.filter((c) => !c.done).map((c) => c.label);

  const color = pct >= 80 ? "var(--ps-green)" : pct >= 50 ? "var(--ps-orange)" : "var(--ps-danger)";

  return (
    <div
      className="px-5 py-4 mx-[-1px] mb-[-1px] rounded-b-[18px]"
      style={{ background: "var(--ps-bg)", borderTop: "1px solid var(--ps-line)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
          Profile completion
        </span>
        <span className="text-[13px] font-bold" style={{ color, fontFamily: "var(--ps-font-ui)" }}>
          {pct}%
        </span>
      </div>
      {/* Bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--ps-line)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color} 0%, #a8d440 100%)` }}
        />
      </div>
      {/* Missing chips */}
      {missing.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
          {missing.slice(0, 5).map((label) => (
            <span
              key={label}
              className="flex items-center gap-1 text-[11px] font-medium"
              style={{ color: "var(--ps-ink-3)" }}
            >
              <span className="w-3 h-3 rounded-full border inline-flex flex-shrink-0" style={{ borderColor: "var(--ps-line-2)" }} />
              {label}
            </span>
          ))}
          {missing.length > 5 && (
            <span className="text-[11px] font-medium" style={{ color: "var(--ps-ink-3)" }}>
              +{missing.length - 5} more
            </span>
          )}
        </div>
      )}
      {pct === 100 && (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold" style={{ color: "var(--ps-green-2)" }}>
          <HiCheck size={13} /> Profile complete — great job!
        </div>
      )}
    </div>
  );
}

// ── Upload preview card ───────────────────────────────────────────────────────
function UploadPreviewCard({ file, previewUrl, uploading, onUpload, onCancel }) {
  return (
    <div
      className="rounded-[18px] border overflow-hidden"
      style={{
        background:  "var(--ps-card)",
        borderColor: "rgba(125,166,53,0.35)",
        boxShadow:   "0 4px 24px rgba(125,166,53,0.12)",
      }}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Preview thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            src={previewUrl}
            alt="New photo"
            className="w-[56px] h-[56px] rounded-full object-cover ring-2 ring-offset-2"
            style={{ "--tw-ring-color": "var(--ps-green)" }}
          />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{ background: "var(--ps-green)", borderColor: "#fff" }}
          >
            <RiCheckLine size={10} className="text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--ps-ink)", fontFamily: "var(--ps-font-ui)" }}>
            New profile photo ready
          </div>
          <div className="text-[11px] truncate max-w-[200px]" style={{ color: "var(--ps-ink-3)" }}>
            {file.name}
          </div>
          <div className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>
            {(file.size / 1024).toFixed(0)} KB · {file.type.split("/")[1]?.toUpperCase() ?? "IMG"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onCancel}
            disabled={uploading}
            className="h-9 px-4 rounded-[10px] border text-[12px] font-semibold flex items-center gap-1.5 transition-all hover:bg-sand2"
            style={{ borderColor: "var(--ps-line)", background: "#fff", color: "var(--ps-ink-3)", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
          >
            <HiXMark size={13} /> Discard
          </button>
          <button
            onClick={onUpload}
            disabled={uploading}
            className="h-9 px-5 rounded-[10px] text-[12px] font-bold flex items-center gap-1.5 transition-all hover:opacity-90"
            style={{
              background:  uploading ? "var(--ps-line)" : "var(--ps-green)",
              color:       uploading ? "var(--ps-ink-3)" : "#fff",
              border:      "none",
              cursor:      uploading ? "not-allowed" : "pointer",
              fontFamily:  "var(--ps-font-ui)",
            }}
          >
            {uploading
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block flex-shrink-0" /> Uploading…</>
              : <><RiUploadCloud2Line size={14} /> Save photo</>}
          </button>
        </div>
      </div>

      {/* Progress animation bar */}
      {uploading && (
        <div className="h-[3px]" style={{ background: "var(--ps-line)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: "60%", background: "var(--ps-green)", animation: "prog 1.2s ease-in-out infinite" }}
          />
        </div>
      )}
    </div>
  );
}

// ── Inline form field ─────────────────────────────────────────────────────────
function Field({ icon, label, value, onChange, type = "text", hint, readOnly = false }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" style={{ color: "var(--ps-ink-3)" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-[10px] border text-[13px] font-medium outline-none transition-all duration-150`}
          style={{
            borderColor: "var(--ps-line)",
            background:  readOnly ? "var(--ps-bg)" : "#fff",
            color:       "var(--ps-ink)",
            fontFamily:  "var(--ps-font-ui)",
          }}
          onFocus={(e) => { if (!readOnly) { e.target.style.borderColor = "var(--ps-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(125,166,53,0.12)"; } }}
          onBlur={(e)  => { e.target.style.borderColor = "var(--ps-line)";  e.target.style.boxShadow = "none"; }}
        />
      </div>
      {hint && <span className="text-[11px] font-semibold" style={{ color: "var(--ps-green-2)" }}>{hint}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AccountSecurity() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);
  const loading  = useSelector(selectAuthLoading);

  const [draft, setDraft] = useState(() => toInitDraft(user));
  const [twoFA, setTwoFA] = useState(true);
  const [toast, setToast] = useState(null);

  // ── Avatar upload ─────────────────────────────────────────────────────────
  const [previewFile,     setPreviewFile]     = useState(null);
  const [previewUrl,      setPreviewUrl]      = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // ── Connected accounts ────────────────────────────────────────────────────
  const [providers, setProviders] = useState(() => {
    const linked = user?.linkedAccounts || [];
    const find   = (p) => linked.find((a) => a.provider === p);
    return [
      { name: "Google",   icon: <FcGoogle size={18} />,
        connected: !!find("google")   || user?.provider === "google",
        email: find("google")?.email  || (user?.provider === "google" ? user.email : "") },
      { name: "Apple",    icon: <span className="text-[15px] font-bold"></span>,
        connected: !!find("apple"),   email: find("apple")?.email    || "" },
      { name: "Facebook", icon: <span className="text-[14px] font-bold text-[#1877F2]">f</span>,
        connected: !!find("facebook"), email: find("facebook")?.email || "" },
    ];
  });

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentAvatar = previewUrl || toAvatar(user);
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

  // ── Handlers ──────────────────────────────────────────────────────────────
  const set = (key) => (val) => setDraft((d) => ({ ...d, [key]: val }));

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleAvatarUpload = async () => {
    if (!previewFile) return;
    setAvatarUploading(true);
    const result = await dispatch(uploadAvatarThunk(previewFile));
    setAvatarUploading(false);
    if (uploadAvatarThunk.fulfilled.match(result)) {
      URL.revokeObjectURL(previewUrl);
      setPreviewFile(null);
      setPreviewUrl(null);
      showToast("success", "Profile photo updated!");
    } else {
      showToast("error", result.payload || "Upload failed — please try again.");
    }
  };

  const handleAvatarCancel = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const handleSave = async () => {
    dispatch(clearError());
    const result = await dispatch(updateUser({
      ...draft,
      name: [draft.firstName, draft.lastName].filter(Boolean).join(" "),
    }));
    if (updateUser.fulfilled.match(result)) {
      showToast("success", "Changes saved!");
    } else {
      showToast("error", "Could not save. Please try again.");
    }
  };

  const handleDiscard = () => setDraft(toInitDraft(user));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5 pb-28">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <div
        className="rounded-[18px] border overflow-hidden"
        style={{ background: "var(--ps-card)", borderColor: "var(--ps-line)", boxShadow: "var(--ps-shadow-sm)" }}
      >
        {/* Cover */}
        <div
          className="h-[96px] relative"
          style={{ background: "linear-gradient(135deg, #1a2e18 0%, #2d4a20 55%, #1c3a18 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff'/%3E%3C/svg%3E\")", backgroundSize: "20px 20px" }}
          />
        </div>

        {/* Identity row */}
        <div className="px-6 pt-0 pb-5">
          <div className="flex items-start gap-5 flex-wrap">
            <AvatarZone src={currentAvatar} onFileChange={handleFileChange} uploading={avatarUploading} />

            <div className="flex-1 min-w-0" style={{ paddingTop: "14px" }}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2
                  className="text-[19px] font-semibold leading-tight m-0"
                  style={{ fontFamily: "var(--ps-font-display)", color: "var(--ps-ink)" }}
                >
                  {fullName}
                </h2>
                {roleBadge}
                {user?.isVerified && <BadgeMini color="green"><RiCheckLine size={9} /> Verified</BadgeMini>}
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[12px]" style={{ color: "var(--ps-ink-3)" }}>
                {user?.email && <span>{user.email}</span>}
                {joinedDate  && <span>· Member since {joinedDate}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Completion bar */}
        <CompletionBar user={user} draft={draft} />
      </div>

      {/* ══ UPLOAD PREVIEW ════════════════════════════════════════════════════ */}
      {previewFile && (
        <UploadPreviewCard
          file={previewFile}
          previewUrl={previewUrl}
          uploading={avatarUploading}
          onUpload={handleAvatarUpload}
          onCancel={handleAvatarCancel}
        />
      )}

      {/* ══ PERSONAL INFO ═════════════════════════════════════════════════════ */}
      <SectionCard>
        <PSCardHead
          eyebrow="Personal information"
          eyebrowIcon={<RiUserLine size={12} />}
          title="Your profile details"
          subtitle="Used for receipts and ID verification — never shown publicly without your consent."
        />

        <div className="flex flex-col gap-4 mt-1">
          {/* Bio — full width */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
              Bio
            </label>
            <div className="relative">
              <RiFileTextLine size={15} className="absolute left-3.5 top-3 pointer-events-none" style={{ color: "var(--ps-ink-3)" }} />
              <textarea
                value={draft.bio}
                onChange={(e) => set("bio")(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Write a few words about yourself…"
                className="w-full pl-10 pr-4 pt-2.5 pb-2 rounded-[10px] border text-[13px] font-medium outline-none transition-all duration-150 resize-none"
                style={{
                  borderColor: "var(--ps-line)", background: "#fff",
                  color: "var(--ps-ink)", fontFamily: "var(--ps-font-ui)", lineHeight: "1.5",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--ps-green)"; e.target.style.boxShadow = "0 0 0 3px rgba(125,166,53,0.12)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "var(--ps-line)";  e.target.style.boxShadow = "none"; }}
              />
            </div>
            <span className="text-[11px] self-end" style={{ color: "var(--ps-ink-3)" }}>
              {draft.bio.length}/200
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 max-[640px]:grid-cols-1">
            <Field icon={<RiUserHeartLine size={14} />} label="First name"        value={draft.firstName}   onChange={set("firstName")} />
            <Field icon={<RiUserHeartLine size={14} />} label="Last name"         value={draft.lastName}    onChange={set("lastName")} />
            <Field icon={<RiMailLine      size={14} />} label="Email address"     value={draft.email}       onChange={set("email")}       type="email" hint="✓ Verified" />
            <Field icon={<RiPhoneLine     size={14} />} label="Phone number"      value={draft.phone}       onChange={set("phone")}       type="tel" />
            <Field icon={<RiMapPinLine    size={14} />} label="City of residence" value={draft.city}        onChange={set("city")} />
            <Field icon={<RiGlobeLine     size={14} />} label="Nationality"       value={draft.nationality} onChange={set("nationality")} />
            <Field icon={<RiCalendarLine  size={14} />} label="Date of birth"     value={draft.dob}         onChange={set("dob")}         type="date" />

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
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
        </div>
      </SectionCard>

      {/* ══ SECURITY ══════════════════════════════════════════════════════════ */}
      <SectionCard>
        <PSCardHead
          eyebrow="Sign-in & security"
          eyebrowIcon={<RiShieldLine size={12} />}
          title="Keep your account safe"
          subtitle="Manage your password and two-factor authentication."
        />
        <div className="grid grid-cols-2 gap-4 mt-1 max-[640px]:grid-cols-1">

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>Password</label>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center gap-2.5 px-3.5 rounded-[10px] border h-[42px]"
                style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
              >
                <RiLockPasswordLine size={14} style={{ color: "var(--ps-ink-3)", flexShrink: 0 }} />
                <span className="text-[18px] tracking-[0.2em] mt-0.5" style={{ color: "var(--ps-ink-3)" }}>••••••••</span>
              </div>
              <button
                className="px-3.5 py-2.5 rounded-[10px] border text-[12px] font-semibold transition-all flex-shrink-0 hover:bg-sand2"
                style={{ borderColor: "var(--ps-line)", color: "var(--ps-ink-2)", background: "#fff", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
              >
                Change
              </button>
            </div>
          </div>

          {/* 2FA */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>Two-factor auth</label>
              <BadgeMini color={twoFA ? "green" : "orange"}>{twoFA ? "Enabled" : "Disabled"}</BadgeMini>
            </div>
            <div
              className="flex items-center justify-between px-3.5 py-3 rounded-[10px] border h-[42px]"
              style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
            >
              <div>
                <div className="text-[13px] font-semibold leading-none" style={{ color: "var(--ps-ink-2)", fontFamily: "var(--ps-font-ui)" }}>
                  Authenticator app
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--ps-ink-3)" }}>
                  {twoFA ? "Protected via TOTP" : "Add extra protection"}
                </div>
              </div>
              <Toggle isOn={twoFA} onChange={() => setTwoFA((v) => !v)} label="2FA" />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ══ LINKED ACCOUNTS ══════════════════════════════════════════════════ */}
      <SectionCard>
        <PSCardHead
          eyebrow="Linked accounts"
          eyebrowIcon={<RiLinksLine size={12} />}
          title="Sign-in providers"
          subtitle="Alternative ways to sign in to your account."
        />
        <div className="flex flex-col gap-2.5 mt-1">
          {providers.map((pr) => (
            <div
              key={pr.name}
              className="flex items-center gap-3.5 px-4 py-3 rounded-[12px] border transition-all duration-200"
              style={{
                borderColor: pr.connected ? "rgba(125,166,53,0.28)" : "var(--ps-line)",
                background:  pr.connected ? "var(--ps-green-soft)"  : "var(--ps-bg)",
              }}
            >
              <div className="w-9 h-9 rounded-[9px] border flex items-center justify-center flex-shrink-0 bg-white" style={{ borderColor: "var(--ps-line)" }}>
                {pr.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: "var(--ps-ink-2)", fontFamily: "var(--ps-font-ui)" }}>{pr.name}</div>
                <div className="text-[11px] truncate" style={{ color: "var(--ps-ink-3)" }}>
                  {pr.connected ? (pr.email || "Connected") : "Not connected"}
                </div>
              </div>
              {pr.connected && <BadgeMini color="green"><RiCheckLine size={9} /> Active</BadgeMini>}
              <button
                onClick={() => setProviders((p) => p.map((x) => x.name === pr.name ? { ...x, connected: !x.connected } : x))}
                className="px-3.5 py-1.5 rounded-[9px] border text-[12px] font-semibold transition-all flex-shrink-0 flex items-center gap-1 hover:opacity-80"
                style={{
                  borderColor: pr.connected ? "rgba(184,84,51,0.28)" : "var(--ps-line)",
                  color:       pr.connected ? "var(--ps-danger)"      : "var(--ps-ink-3)",
                  background:  "#fff", cursor: "pointer", fontFamily: "var(--ps-font-ui)",
                }}
              >
                {pr.connected ? "Disconnect" : <><RiAddLine size={11} /> Connect</>}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ══ DANGER ZONE ══════════════════════════════════════════════════════ */}
      <SectionCard danger>
        <PSCardHead
          eyebrow="Danger zone"
          eyebrowIcon={<RiAlertLine size={12} />}
          title="Pause or delete account"
          subtitle="Pausing hides your profile but keeps your history. Deletion is permanent."
        />
        <div
          className="flex gap-3 flex-wrap p-4 rounded-[12px] border mt-1"
          style={{ borderColor: "rgba(184,84,51,0.18)", background: "rgba(184,84,51,0.03)" }}
        >
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all hover:bg-sand2"
            style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
          >
            Pause account
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] border text-[13px] font-semibold transition-all hover:bg-red-50"
            style={{ borderColor: "rgba(184,84,51,0.4)", background: "transparent", color: "var(--ps-danger)", cursor: "pointer", fontFamily: "var(--ps-font-ui)" }}
          >
            <RiDeleteBinLine size={14} /> Delete account
          </button>
        </div>
      </SectionCard>

      {/* ══ FLOATING SAVE BAR ════════════════════════════════════════════════ */}
      {hasChanges && (
        <div className="ps-action-bar">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--ps-orange)", boxShadow: "0 0 0 3px var(--ps-orange-soft)" }} />
          <span className="flex-1 text-[13px] font-medium" style={{ color: "var(--ps-ink-2)", fontFamily: "var(--ps-font-ui)" }}>
            Unsaved changes
          </span>
          <PsBtnGhost onClick={handleDiscard}>Discard</PsBtnGhost>
          <PsBtnPrimary onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : "Save changes"}
          </PsBtnPrimary>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
