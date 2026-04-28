import { useState } from "react";
import {
  RiBellLine, RiCalendarCheckLine, RiMessage2Line, RiStarLine,
  RiBankCardLine, RiLightbulbLine, RiBarChartLine, RiTimeLine,
  RiTranslate2, RiGlobeLine,
} from "react-icons/ri";
import { PSCard, PSCardHead, Toggle, PSFieldLabel, PSSelect, PsBtnPrimary, PsBtnGhost } from "../../components/settings/atoms";

const CHANNELS = [
  {
    id: "bookings",
    icon: <RiCalendarCheckLine size={15} />,
    iconBg: "#EEF4DC",
    iconColor: "#6A8E2A",
    label: "Bookings",
    desc: "New requests, confirmations, cancellations",
  },
  {
    id: "messages",
    icon: <RiMessage2Line size={15} />,
    iconBg: "#E0F0FF",
    iconColor: "#2876CC",
    label: "Messages",
    desc: "Traveller messages and replies",
  },
  {
    id: "reviews",
    icon: <RiStarLine size={15} />,
    iconBg: "#FFF4DC",
    iconColor: "#C8761A",
    label: "Reviews",
    desc: "New reviews on your profile",
  },
  {
    id: "payouts",
    icon: <RiBankCardLine size={15} />,
    iconBg: "#EEF4DC",
    iconColor: "#6A8E2A",
    label: "Payouts",
    desc: "Payment confirmations and transfers",
  },
  {
    id: "tips",
    icon: <RiLightbulbLine size={15} />,
    iconBg: "#FBF7EF",
    iconColor: "#8A7B66",
    label: "Tips & promos",
    desc: "Platform tips, seasonal offers, features",
  },
  {
    id: "digest",
    icon: <RiBarChartLine size={15} />,
    iconBg: "#F0E8F8",
    iconColor: "#7B52AB",
    label: "Weekly digest",
    desc: "Profile views, earnings and stats summary",
  },
];

const INIT_PREFS = Object.fromEntries(
  CHANNELS.map(({ id }) => [id, { email: true, push: true, sms: id === "bookings" || id === "messages" }])
);

export default function NotificationsPanel() {
  const [prefs,    setPrefs]    = useState(INIT_PREFS);
  const [quietOn,  setQuietOn]  = useState(false);
  const [quietFrom,setQuietFrom]= useState("22:00");
  const [quietTo,  setQuietTo]  = useState("08:00");
  const [lang,     setLang]     = useState("en");
  const [tz,       setTz]       = useState("Africa/Casablanca");

  const togglePref = (id, channel) =>
    setPrefs((p) => ({ ...p, [id]: { ...p[id], [channel]: !p[id][channel] } }));

  const handleSave = () => console.log("[NotificationsPanel] save", { prefs, quietOn, quietFrom, quietTo, lang, tz });

  return (
    <div className="flex flex-col gap-5">

      {/* ── Channels matrix ─────────────────────────────────── */}
      <PSCard>
        <PSCardHead
          eyebrow="Notification preferences"
          eyebrowIcon={<RiBellLine size={12} />}
          title="Choose your channels"
          subtitle="Pick how you receive each type of notification."
        />

        {/* Header row */}
        <div
          className="grid gap-3 px-3 pb-2 mb-1 border-b"
          style={{
            gridTemplateColumns: "1fr 52px 52px 52px",
            borderColor: "var(--ps-line)",
          }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: "var(--ps-ink-3)" }}>
            Notification
          </span>
          {["Email", "Push", "SMS"].map((c) => (
            <span key={c} className="text-[11px] font-bold uppercase tracking-[0.06em] text-center" style={{ color: "var(--ps-ink-3)" }}>
              {c}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {CHANNELS.map(({ id, icon, iconBg, iconColor, label, desc }) => (
            <div
              key={id}
              className="grid items-center gap-3 px-3 py-3 rounded-[10px] transition-colors"
              style={{ gridTemplateColumns: "1fr 52px 52px 52px" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                  style={{ background: iconBg, color: iconColor }}
                >
                  {icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold" style={{ color: "var(--ps-ink)" }}>{label}</div>
                  <div className="text-[11px] truncate" style={{ color: "var(--ps-ink-3)" }}>{desc}</div>
                </div>
              </div>
              {["email", "push", "sms"].map((ch) => (
                <div key={ch} className="flex items-center justify-center">
                  <Toggle
                    isOn={prefs[id][ch]}
                    onChange={() => togglePref(id, ch)}
                    label={`${label} via ${ch}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </PSCard>

      {/* ── Quiet hours ──────────────────────────────────────── */}
      <PSCard>
        <PSCardHead
          eyebrow="Quiet hours"
          eyebrowIcon={<RiTimeLine size={12} />}
          title="Do not disturb"
          subtitle="Pause all push notifications during these hours."
          right={
            <Toggle isOn={quietOn} onChange={() => setQuietOn((v) => !v)} label="Enable quiet hours" />
          }
        />
        <div
          className="flex items-center gap-4 flex-wrap transition-opacity duration-200"
          style={{ opacity: quietOn ? 1 : 0.4, pointerEvents: quietOn ? "auto" : "none" }}
        >
          <div className="flex flex-col gap-1.5">
            <PSFieldLabel>From</PSFieldLabel>
            <input
              type="time"
              value={quietFrom}
              onChange={(e) => setQuietFrom(e.target.value)}
              className="ps-field-input"
              style={{ width: 140 }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <PSFieldLabel>Until</PSFieldLabel>
            <input
              type="time"
              value={quietTo}
              onChange={(e) => setQuietTo(e.target.value)}
              className="ps-field-input"
              style={{ width: 140 }}
            />
          </div>
        </div>
      </PSCard>

      {/* ── Language & timezone ──────────────────────────────── */}
      <PSCard>
        <PSCardHead
          eyebrow="Language & timezone"
          eyebrowIcon={<RiGlobeLine size={12} />}
          title="Localisation"
          subtitle="Affects notification language and displayed times."
        />
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <PSFieldLabel>Notification language</PSFieldLabel>
            <PSSelect value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
            </PSSelect>
          </div>
          <div className="flex flex-col gap-1.5">
            <PSFieldLabel>Timezone</PSFieldLabel>
            <PSSelect value={tz} onChange={(e) => setTz(e.target.value)}>
              <option value="Africa/Casablanca">Africa/Casablanca (UTC+1)</option>
              <option value="Europe/Paris">Europe/Paris (UTC+2)</option>
              <option value="Europe/London">Europe/London (UTC+1)</option>
              <option value="America/New_York">America/New_York (UTC-4)</option>
            </PSSelect>
          </div>
        </div>
      </PSCard>

      {/* Save */}
      <div className="flex justify-end gap-2.5 pt-1">
        <PsBtnGhost>Discard</PsBtnGhost>
        <PsBtnPrimary onClick={handleSave}>Save changes</PsBtnPrimary>
      </div>
    </div>
  );
}
