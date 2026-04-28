import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/slices/authSlice";
import {
  RiShieldLine, RiLinksLine, RiUserLine, RiDeleteBinLine,
  RiPencilLine, RiCheckLine, RiAddLine, RiAlertLine,
} from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import {
  PSCard, PSCardHead, PSFieldLabel, PSInput, PSSelect,
  PsBtnPrimary, PsBtnOutline, PsBtnGhost, BadgeMini,
} from "../../components/settings/atoms";

// ── Shared field row ──────────────────────────────────────────────────────────
function EditableRow({ label, value, type = "text", hint, hintColor }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal]         = useState(value || "");
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <PSFieldLabel>{label}</PSFieldLabel>
        {hint && (
          <span className="text-[11px] font-semibold" style={{ color: hintColor || "var(--ps-green)" }}>
            {hint}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type={type}
          value={val}
          disabled={!editing}
          onChange={(e) => setVal(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-[10px] border font-body text-[13px] font-semibold
            text-ink2 outline-none transition-all duration-200 min-w-0
            placeholder:text-ink3/50 focus:ring-2 focus:ring-primary/10
            disabled:bg-sand disabled:text-ink3 disabled:cursor-default"
          style={{
            borderColor: editing ? "var(--ps-green)" : "var(--ps-line)",
            background:  editing ? "#fff" : "transparent",
          }}
        />
        <button
          onClick={() => setEditing((v) => !v)}
          className="w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center flex-shrink-0 transition-all duration-150"
          style={{
            borderColor: editing ? "var(--ps-green)"      : "var(--ps-line)",
            background:  editing ? "var(--ps-green-soft)" : "transparent",
            color:       editing ? "var(--ps-green-2)"    : "var(--ps-ink-3)",
            cursor: "pointer",
          }}
        >
          {editing ? <RiCheckLine size={14} /> : <RiPencilLine size={14} />}
        </button>
      </div>
    </div>
  );
}

// ── Sign-in & Security card ───────────────────────────────────────────────────
function SignInCard({ user }) {
  return (
    <PSCard>
      <PSCardHead
        eyebrow="Sign-in & security"
        eyebrowIcon={<RiShieldLine size={12} />}
        title="Keep your account safe"
        subtitle="Update credentials and add extra protection."
      />
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <EditableRow label="Email address" value={user?.email || "tarik@cityguide.ma"} type="email" hint="Verified" />
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <PSFieldLabel>Phone number</PSFieldLabel>
            <span className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>+212 ····· 47</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              value="+212 6 ·· ·· ·· 47"
              disabled
              readOnly
              className="flex-1 px-3.5 py-2.5 rounded-[10px] border font-body text-[13px] text-ink2 outline-none bg-sand disabled:cursor-default"
              style={{ borderColor: "var(--ps-line)" }}
            />
            <button
              className="w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center flex-shrink-0 transition-all duration-150"
              style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
            >
              <RiPencilLine size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <PSFieldLabel>Password</PSFieldLabel>
          <div className="flex items-center gap-2">
            <input
              type="password"
              value="············"
              disabled
              readOnly
              className="flex-1 px-3.5 py-2.5 rounded-[10px] border font-body text-[13px] text-ink2 outline-none bg-sand disabled:cursor-default"
              style={{ borderColor: "var(--ps-line)" }}
            />
            <button
              className="w-[34px] h-[34px] rounded-[9px] border flex items-center justify-center flex-shrink-0"
              style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
            >
              <RiPencilLine size={14} />
            </button>
          </div>
          <span className="text-[11px]" style={{ color: "var(--ps-ink-3)" }}>Last changed 2 months ago</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <PSFieldLabel>Two-factor auth</PSFieldLabel>
            <BadgeMini>Enabled</BadgeMini>
          </div>
          <div
            className="flex items-center justify-between px-3.5 py-2.5 rounded-[10px] border"
            style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
          >
            <span className="font-body text-[13px] font-semibold" style={{ color: "var(--ps-ink-2)" }}>
              Authenticator app
            </span>
            <button
              className="font-body text-[12px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
              style={{ color: "var(--ps-ink-3)", background: "transparent", border: "none", cursor: "pointer" }}
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </PSCard>
  );
}

// ── Linked accounts card ──────────────────────────────────────────────────────
function LinkedAccountsCard({ user }) {
  const [providers, setProviders] = useState([
    { name: "Google",   icon: <FcGoogle size={18} />,  desc: user?.email || "tarik@gmail.com", connected: true  },
    { name: "Apple",    icon: <span className="font-bold text-[15px]"></span>,               desc: "Not connected",              connected: false },
    { name: "Facebook", icon: <span className="font-bold text-[14px] text-[#1877F2]">f</span>, desc: "Not connected",            connected: false },
  ]);

  const toggle = (name) =>
    setProviders((p) =>
      p.map((pr) =>
        pr.name === name
          ? { ...pr, connected: !pr.connected, desc: !pr.connected ? (user?.email || "connected") : "Not connected" }
          : pr
      )
    );

  return (
    <PSCard>
      <PSCardHead
        eyebrow="Linked accounts"
        eyebrowIcon={<RiLinksLine size={12} />}
        title="Sign-in providers"
        subtitle="Connect alternative ways to sign in."
      />
      <div className="flex flex-col gap-2">
        {providers.map((pr) => (
          <div
            key={pr.name}
            className="flex items-center gap-3.5 px-3.5 py-3 border rounded-[10px] transition-colors"
            style={{ borderColor: "var(--ps-line)", background: "var(--ps-bg)" }}
          >
            <div
              className="w-9 h-9 rounded-[9px] border flex items-center justify-center flex-shrink-0 bg-white"
              style={{ borderColor: "var(--ps-line)" }}
            >
              {pr.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-[13px] font-semibold" style={{ color: "var(--ps-ink-2)" }}>{pr.name}</div>
              <div className="font-body text-[11px]" style={{ color: "var(--ps-ink-3)" }}>{pr.desc}</div>
            </div>
            {pr.connected ? (
              <button
                onClick={() => toggle(pr.name)}
                className="px-3 py-1.5 rounded-[10px] border font-body text-[12px] font-semibold transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                style={{ borderColor: "var(--ps-line)", background: "#fff", color: "var(--ps-ink-3)", cursor: "pointer" }}
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={() => toggle(pr.name)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[10px] border font-body text-[12px] font-semibold transition-all"
                style={{ borderColor: "var(--ps-line)", background: "#fff", color: "var(--ps-ink-3)", cursor: "pointer" }}
              >
                <RiAddLine size={12} /> Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </PSCard>
  );
}

// ── Personal information card ─────────────────────────────────────────────────
function PersonalInfoCard({ user }) {
  const [fullName,    setFullName]    = useState(user?.name || "Tarik Amrani");
  const [gender,      setGender]      = useState("male");
  const [city,        setCity]        = useState(user?.city || "Marrakech");
  const [nationality, setNationality] = useState("Moroccan");
  const [dob,         setDob]         = useState("1988-03-14");

  return (
    <PSCard id="personal-info">
      <PSCardHead
        eyebrow="Personal information"
        eyebrowIcon={<RiUserLine size={12} />}
        title="How you appear off-profile"
        subtitle="Used for receipts, payouts and ID verification — never shown publicly."
      />
      <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <PSFieldLabel>Full legal name</PSFieldLabel>
          <PSInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <PSFieldLabel>Gender</PSFieldLabel>
          <PSSelect value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="nb">Non-binary</option>
            <option value="other">Prefer not to say</option>
          </PSSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <PSFieldLabel>City of residence</PSFieldLabel>
          <PSInput value={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <PSFieldLabel>Nationality</PSFieldLabel>
          <PSInput value={nationality} onChange={(e) => setNationality(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <PSFieldLabel>Date of birth</PSFieldLabel>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="ps-field-input"
          />
        </div>
      </div>
    </PSCard>
  );
}

// ── Danger zone card ──────────────────────────────────────────────────────────
function DangerZoneCard() {
  return (
    <PSCard>
      <PSCardHead
        eyebrow="Danger zone"
        eyebrowIcon={<RiAlertLine size={12} />}
        title="Pause or delete your account"
        subtitle="Pausing hides your profile but keeps your history. Deleting is permanent and cannot be undone."
      />
      <div
        className="p-4 rounded-[10px] border"
        style={{ borderColor: "rgba(184,84,51,0.25)", background: "rgba(184,84,51,0.04)" }}
      >
        <div className="flex gap-2.5 flex-wrap">
          <button
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] border font-body text-sm font-semibold transition-all"
            style={{ borderColor: "var(--ps-line)", background: "transparent", color: "var(--ps-ink-3)", cursor: "pointer" }}
          >
            Pause account
          </button>
          <button
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] border font-body text-sm font-semibold transition-all hover:bg-red-50"
            style={{ borderColor: "rgba(184,84,51,0.4)", background: "transparent", color: "var(--ps-danger)", cursor: "pointer" }}
          >
            <RiDeleteBinLine size={14} /> Delete account
          </button>
        </div>
      </div>
    </PSCard>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function AccountSecurity() {
  const user     = useSelector(selectUser);
  const location = useLocation();

  const handleSave = () => {
    console.log("[AccountSecurity] save triggered", { pathname: location.pathname });
  };

  return (
    <div className="flex flex-col gap-5">
      <SignInCard user={user} />
      <LinkedAccountsCard user={user} />
      <PersonalInfoCard user={user} />
      <DangerZoneCard />

      {/* Save bar */}
      <div className="flex justify-end gap-2.5 pt-1">
        <PsBtnGhost>Discard</PsBtnGhost>
        <PsBtnPrimary onClick={handleSave}>Save changes</PsBtnPrimary>
      </div>
    </div>
  );
}
