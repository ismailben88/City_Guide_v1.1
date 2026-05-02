import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoStarSharp, IoStarOutline } from "react-icons/io5";
import {
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiMapPin2Line,
  RiCompassLine,
  RiMailLine,
  RiPhoneLine,
  RiWhatsappLine,
  RiInstagramLine,
  RiGlobalLine,
} from "react-icons/ri";
import {
  TbLanguage,
  TbClock,
  TbRoute,
  TbCalendarEvent,
  TbCheck,
  TbX,
  TbMoodSmile,
} from "react-icons/tb";
import { HiArrowRight } from "react-icons/hi2";

import { api } from "../services/api";
import FavoriteButton from "../components/FavoriteButton/FavoriteButton";
import CommentSection from "../components/comentSection/CommentSection";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

// ─── Section wrappers ─────────────────────────────────────────────────────────
function Section({ title, icon, children }) {
  return (
    <div
      className="bg-white rounded-[20px] border border-[#ede8e0]
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6"
    >
      <h3
        className="flex items-center gap-2 text-[11px] font-black uppercase
                     tracking-widest text-[#9e8e80] font-[Nunito,sans-serif] mb-4"
      >
        {icon && <span className="text-[#6b9c3e]">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
}

function SideCard({ title, icon, children }) {
  return (
    <div
      className="bg-white rounded-[20px] border border-[#ede8e0]
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5"
    >
      <h3
        className="flex items-center gap-1.5 text-[11px] font-black uppercase
                     tracking-widest text-[#9e8e80] font-[Nunito,sans-serif] mb-3"
      >
        {icon && <span className="text-[#6b9c3e]">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Contact card ─────────────────────────────────────────────────────────────
const CONTACT_ITEMS = [
  {
    key: "email",
    icon: <RiMailLine size={15} />,
    label: "Email",
    href: (v) => `mailto:${v}`,
    color: "#6b9c3e",
    bg: "#edf7e4",
  },
  {
    key: "phone",
    icon: <RiPhoneLine size={15} />,
    label: "Phone",
    href: (v) => `tel:${v.replace(/\s/g, "")}`,
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    key: "whatsapp",
    icon: <RiWhatsappLine size={15} />,
    label: "WhatsApp",
    href: (v) => `https://wa.me/${v.replace(/[^0-9]/g, "")}`,
    color: "#25d366",
    bg: "#f0fdf4",
  },
  {
    key: "instagram",
    icon: <RiInstagramLine size={15} />,
    label: "Instagram",
    href: (v) => `https://instagram.com/${v.replace("@", "")}`,
    color: "#e1306c",
    bg: "#fff0f5",
  },
  {
    key: "website",
    icon: <RiGlobalLine size={15} />,
    label: "Website",
    href: (v) => v,
    color: "#c8761a",
    bg: "#fdf6ec",
  },
];

function ContactCard({ contact }) {
  const items = CONTACT_ITEMS.filter(({ key }) => contact[key]);

  if (!items.length) return null;

  return (
    <div
      className="bg-white rounded-[20px] border border-[#ede8e0]
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5"
    >
      <h3
        className="flex items-center gap-1.5 text-[11px] font-black uppercase
                     tracking-widest text-[#9e8e80] font-[Nunito,sans-serif] mb-4"
      >
        <span className="text-[#6b9c3e]">
          <RiPhoneLine size={13} />
        </span>
        Contact
      </h3>

      <div className="flex flex-col gap-2.5">
        {items.map(({ key, icon, label, href, color, bg }) => {
          const value = contact[key];
          return (
            <a
              key={key}
              href={href(value)}
              target={key === "email" || key === "phone" ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 rounded-[12px]
                         border border-[#ede8e0] hover:border-transparent
                         transition-all duration-200 hover:-translate-y-px
                         hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
              style={{ "--hover-bg": bg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "";
              }}
            >
              {/* Icon bubble */}
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center
                           shrink-0 transition-transform duration-200
                           group-hover:scale-110"
                style={{ background: bg, color }}
              >
                {icon}
              </span>

              {/* Text */}
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className="text-[10px] font-black uppercase tracking-wider
                                 text-[#c4b8a8] font-[Nunito,sans-serif] leading-none mb-0.5"
                >
                  {label}
                </span>
                <span
                  className="text-[12px] font-semibold text-[#3d2b1a]
                                 font-[Nunito,sans-serif] truncate"
                >
                  {value}
                </span>
              </div>

              {/* Arrow */}
              <HiArrowRight
                size={13}
                className="shrink-0 text-[#c4b8a8] group-hover:text-[#3d2b1a]
                           transition-colors duration-200"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── Booking modal ────────────────────────────────────────────────────────────
function BookingModal({ guide, onClose }) {
  const name = guide.name || "the guide";
  const contact = guide.contact || {};

  const waNumber = (contact.whatsapp || contact.phone || "").replace(
    /[^0-9]/g,
    "",
  );

  const waMsg = encodeURIComponent(
    `Hello ${name.split(" ")[0]}, I found your profile on City Guide and I'd like to book a guided tour with you. Could you share your availability?`,
  );
  const emailSubject = encodeURIComponent("Booking Request — City Guide");
  const emailBody = encodeURIComponent(
    `Hello ${name.split(" ")[0]},\n\nI found your profile on City Guide and I'd like to book a guided tour with you.\n\nCould you please share your availability and rates?\n\nThank you!`,
  );

  const options = [
    waNumber && {
      key: "whatsapp",
      icon: <RiWhatsappLine size={20} />,
      label: "Chat on WhatsApp",
      sub: "Fastest response",
      href: `https://wa.me/${waNumber}?text=${waMsg}`,
      color: "#25d366",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    contact.email && {
      key: "email",
      icon: <RiMailLine size={20} />,
      label: "Send an Email",
      sub: "Reply within 24h",
      href: `mailto:${contact.email}?subject=${emailSubject}&body=${emailBody}`,
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    contact.phone && {
      key: "phone",
      icon: <RiPhoneLine size={20} />,
      label: "Call Directly",
      sub: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
      color: "#c8761a",
      bg: "#fdf6ec",
      border: "#fde68a",
    },
  ].filter(Boolean);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center
                 justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]
                   animate-[fadeIn_0.2s_ease]"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full sm:max-w-[420px] bg-white
                   rounded-t-[28px] sm:rounded-[28px]
                   shadow-[0_24px_80px_rgba(0,0,0,0.22)]
                   animate-[slideUp_0.3s_cubic-bezier(.25,.8,.25,1)]
                   overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full
                     bg-[#f5f0ea] flex items-center justify-center
                     text-[#9e8e80] hover:bg-[#ede8e0] hover:text-[#3d2b1a]
                     transition-colors"
        >
          <TbX size={15} />
        </button>

        {/* Guide header */}
        <div
          className="flex items-center gap-4 p-6 pb-5
                        border-b border-[#f0ebe4]"
        >
          <div
            className="w-14 h-14 rounded-[14px] overflow-hidden
                          border-2 border-[#ede8e0] shrink-0"
          >
            <img
              src={guide.avatar}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://i.pravatar.cc/150?u=${guide.id}`;
              }}
            />
          </div>
          <div className="min-w-0">
            <h2
              className="font-[Playfair_Display,Georgia,serif] text-[18px]
                           font-bold text-[#3d2b1a] leading-tight mb-0.5 truncate"
            >
              {name}
            </h2>
            {guide.cityNames?.length > 0 && (
              <p
                className="flex items-center gap-1 text-[12px] text-[#9e8e80]
                            font-[Nunito,sans-serif]"
              >
                <RiMapPin2Line size={11} className="text-[#6b9c3e] shrink-0" />
                {guide.cityNames.slice(0, 2).join(" · ")}
              </p>
            )}
            <p
              className="text-[11px] font-bold text-[#6b9c3e]
                          font-[Nunito,sans-serif] mt-0.5"
            >
              {guide.pricePerHour} MAD / hour
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="p-5">
          <p
            className="text-[12px] font-black uppercase tracking-widest
                        text-[#9e8e80] font-[Nunito,sans-serif] mb-3"
          >
            How would you like to reach out?
          </p>

          <div className="flex flex-col gap-2.5">
            {options.map(
              ({ key, icon, label, sub, href, color, bg, border }) => (
                <a
                  key={key}
                  href={href}
                  target={key === "phone" ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group flex items-center gap-4 p-4 rounded-[16px]
                           border-[1.5px] transition-all duration-200
                           hover:-translate-y-px
                           hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                  style={{ borderColor: border, backgroundColor: bg }}
                >
                  {/* Icon */}
                  <span
                    className="w-10 h-10 rounded-[12px] flex items-center
                             justify-center shrink-0 transition-transform
                             duration-200 group-hover:scale-110"
                    style={{ background: color + "1a", color }}
                  >
                    {icon}
                  </span>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-[Nunito,sans-serif] text-[14px] font-bold
                                text-[#3d2b1a] leading-none mb-0.5"
                    >
                      {label}
                    </p>
                    <p
                      className="font-[Nunito,sans-serif] text-[11px]
                                text-[#9e8e80]"
                    >
                      {sub}
                    </p>
                  </div>

                  <HiArrowRight
                    size={15}
                    className="shrink-0 transition-all duration-200
                             group-hover:translate-x-1"
                    style={{ color }}
                  />
                </a>
              ),
            )}
          </div>

          <p
            className="text-center text-[11px] text-[#c4b8a8]
                        font-[Nunito,sans-serif] mt-4"
          >
            Your request goes directly to the guide — no middleman.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#faf7f2] animate-pulse">
      <div className="w-full h-[420px] bg-[#e8e0d4]" />
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="h-[88px] bg-white rounded-[20px] border border-[#ede8e0]" />
      </div>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1
                      lg:grid-cols-[1fr_320px] gap-6"
      >
        <div className="space-y-5">
          {[180, 120, 200].map((h) => (
            <div
              key={h}
              style={{ height: h }}
              className="bg-white rounded-[20px] border border-[#ede8e0]"
            />
          ))}
        </div>
        <div className="space-y-5 hidden lg:block">
          {[160, 120, 110].map((h) => (
            <div
              key={h}
              style={{ height: h }}
              className="bg-white rounded-[20px] border border-[#ede8e0]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GuideProfilePage ─────────────────────────────────────────────────────────
export default function GuideProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getGuideById(id)
      .then((data) => {
        if (!cancelled) {
          setGuide(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingSkeleton />;

  if (!guide)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center
                    gap-4 bg-[#faf7f2]"
      >
        <div className="w-16 h-16 rounded-full bg-[#f0ebe4] flex items-center justify-center">
          <RiCompassLine size={28} className="text-[#c4b8a8]" />
        </div>
        <p className="font-[Playfair_Display,Georgia,serif] text-lg font-bold text-[#3d2b1a]">
          Guide not found
        </p>
        <button
          onClick={() => navigate("/guides")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full
                   bg-[#6b9c3e] text-white font-[Nunito,sans-serif] text-sm font-bold
                   hover:bg-[#c8761a] transition-colors"
        >
          Back to Guides <HiArrowRight size={14} />
        </button>
      </div>
    );

  const g = guide;
  const fullStars = Math.round(g.averageRating || 0);
  const emptyStars = 5 - fullStars;
  const isVerified = g.verificationStatus === "verified";
  const isAvailable = g.availability?.isCurrentlyAvailable;
  const schedule = g.availability?.schedule || [];

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* ── Hero banner ── */}
      <div className="relative w-full h-[420px] overflow-hidden">
        <img
          src={g.bannerImage || `https://picsum.photos/seed/${g.id}/1200/400`}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://picsum.photos/seed/${g.id}/1200/400`;
          }}
        />
        {/* Gradient: light top for buttons, heavy bottom for text */}
        <div
          className="absolute inset-0 bg-gradient-to-b
                        from-black/40 via-black/10 to-black/80"
        />

        {/* ── Top controls ── */}
        <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-white/15 backdrop-blur-md border border-white/25
                       text-white text-[13px] font-bold font-[Nunito,sans-serif]
                       hover:bg-white/28 transition-all"
          >
            <RiArrowLeftLine size={14} /> Back
          </button>

          <FavoriteButton targetId={g.id} targetType="GuideProfile" size="md" />
        </div>

        {/* ── Bottom info panel ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6 pt-10">
          <div
            className="max-w-6xl mx-auto flex flex-col sm:flex-row
                          sm:items-end gap-4"
          >
            {/* Left: avatar + identity */}
            <div className="flex items-end gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-[90px] h-[90px] rounded-[18px] border-[3px] border-white/80
                                shadow-xl overflow-hidden bg-[#f0ebe4]"
                >
                  <img
                    src={g.avatar}
                    alt={g.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://i.pravatar.cc/150?u=${g.id}`;
                    }}
                  />
                </div>
                {/* Availability dot */}
                <span
                  className={`absolute -bottom-[3px] -right-[3px] w-5 h-5
                              rounded-full border-[3px] border-white
                              ${isAvailable ? "bg-[#6b9c3e]" : "bg-[#9e8e80]"}`}
                />
              </div>

              {/* Name + meta */}
              <div className="min-w-0 pb-1">
                {/* Name + verified */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1
                    className="font-[Playfair_Display,Georgia,serif] text-[26px]
                                 font-bold text-white leading-tight drop-shadow-sm"
                  >
                    {g.name}
                  </h1>
                  {isVerified && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-[3px]
                                     rounded-full bg-white/20 backdrop-blur-sm
                                     border border-white/30
                                     text-white text-[10px] font-bold
                                     font-[Nunito,sans-serif]"
                    >
                      <RiShieldCheckLine size={10} /> Verified
                    </span>
                  )}
                </div>

                {/* Cities */}
                {g.cityNames?.length > 0 && (
                  <p
                    className="flex items-center gap-1 text-white/75 text-[13px]
                                font-[Nunito,sans-serif] mb-1.5"
                  >
                    <RiMapPin2Line size={12} className="shrink-0" />
                    {g.cityNames.join(" · ")}
                  </p>
                )}

                {/* Rating + availability row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-px text-[#f4b942]">
                      {[...Array(fullStars)].map((_, i) => (
                        <IoStarSharp key={`f${i}`} size={13} />
                      ))}
                      {[...Array(emptyStars)].map((_, i) => (
                        <IoStarOutline
                          key={`e${i}`}
                          size={13}
                          className="opacity-50"
                        />
                      ))}
                    </span>
                    <span
                      className="text-white font-bold text-[13px]
                                     font-[Nunito,sans-serif]"
                    >
                      {g.averageRating?.toFixed(1)}
                    </span>
                    <span className="text-white/60 text-[12px] font-[Nunito,sans-serif]">
                      ({g.reviewCount?.toLocaleString()})
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-[3px]
                                    rounded-full text-[10px] font-bold font-[Nunito,sans-serif]
                                    border
                                    ${
                                      isAvailable
                                        ? "bg-[#6b9c3e]/80 border-[#6b9c3e]/50 text-white"
                                        : "bg-white/10 border-white/20 text-white/60"
                                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full
                                     ${isAvailable ? "bg-white" : "bg-white/40"}`}
                    />
                    {isAvailable ? "Available now" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: price + CTA */}
            <div className="flex items-center gap-3 sm:pb-1 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-white/60 text-[11px] font-[Nunito,sans-serif]">
                  Starting from
                </p>
                <p
                  className="text-white font-[Playfair_Display,Georgia,serif]
                              text-[22px] font-bold leading-none"
                >
                  {g.pricePerHour}
                  <span
                    className="text-[13px] font-normal text-white/70
                                   font-[Nunito,sans-serif] ml-1"
                  >
                    MAD/hr
                  </span>
                </p>
              </div>
              <button
                className="flex items-center gap-2 px-6 py-[11px] rounded-[14px]
                           bg-[#6b9c3e] text-white font-bold font-[Nunito,sans-serif]
                           text-[13px] whitespace-nowrap
                           shadow-[0_4px_16px_rgba(107,156,62,0.45)]
                           hover:bg-[#c8761a] hover:-translate-y-0.5
                           transition-all duration-200"
                onClick={() => setShowBooking(true)}
              >
                <TbCalendarEvent size={15} />
                Book This Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div
          className="bg-white rounded-[20px] border border-[#ede8e0]
                        shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="grid grid-cols-4 divide-x divide-[#ede8e0]">
            {[
              {
                value: g.averageRating?.toFixed(1),
                label: "Rating",
                note: "/ 5.0",
              },
              { value: g.totalTours, label: "Tours", note: "done" },
              { value: g.pricePerHour, label: "MAD / hr", note: "" },
              {
                value: g.spokenLanguages?.length || 0,
                label: "Languages",
                note: "",
              },
            ].map(({ value, label, note }) => (
              <div
                key={label}
                className="flex flex-col items-center py-4 gap-0.5"
              >
                <span
                  className="font-[Playfair_Display,Georgia,serif] text-[20px]
                                 font-bold text-[#3d2b1a] leading-none"
                >
                  {value}
                </span>
                {note && (
                  <span className="text-[10px] text-[#c4b8a8] font-[Nunito,sans-serif]">
                    {note}
                  </span>
                )}
                <span
                  className="text-[10px] font-black uppercase tracking-wider
                                 text-[#9e8e80] font-[Nunito,sans-serif] mt-0.5"
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2-column content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* ── Left: main content ── */}
          <div className="space-y-5">
            {/* About */}
            <Section title="About" icon={<RiCompassLine size={13} />}>
              <p className="font-[Nunito,sans-serif] text-[14px] text-[#7a6a58] leading-[1.8]">
                {g.bio ||
                  "Expert local guide ready to show you the best of Morocco."}
              </p>
            </Section>

            {/* Specialties */}
            {g.specialties?.length > 0 && (
              <Section title="Specialties" icon={<TbMoodSmile size={13} />}>
                <div className="flex flex-wrap gap-2">
                  {g.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full bg-[#edf7e4] text-[#6b9c3e]
                                 border border-[#c8d98a] text-[12px] font-bold
                                 font-[Nunito,sans-serif]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Weekly schedule */}
            {schedule.length > 0 && (
              <Section title="Weekly Schedule" icon={<TbClock size={13} />}>
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map((day) => {
                    const slot = schedule.find((s) => s.day === day);
                    const isOpen = slot?.isOpen;
                    return (
                      <div
                        key={day}
                        className={`flex flex-col items-center gap-1.5 px-1 py-3
                                    rounded-[14px] border transition-colors
                                    ${
                                      isOpen
                                        ? "bg-[#edf7e4] border-[#c8d98a]"
                                        : "bg-[#f5f0ea] border-[#ede8e0]"
                                    }`}
                      >
                        <span
                          className={`text-[10px] font-black uppercase tracking-wide
                                      font-[Nunito,sans-serif]
                                      ${isOpen ? "text-[#6b9c3e]" : "text-[#c4b8a8]"}`}
                        >
                          {DAY_SHORT[day]}
                        </span>
                        {isOpen ? (
                          <TbCheck size={14} className="text-[#6b9c3e]" />
                        ) : (
                          <TbX size={14} className="text-[#c4b8a8]" />
                        )}
                        {isOpen && slot.slots?.[0] && (
                          <span
                            className="text-[8px] text-[#6b9c3e] font-bold
                                       font-[Nunito,sans-serif] leading-tight text-center"
                          >
                            {slot.slots[0].start}
                            <br />
                            {slot.slots[0].end}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Reviews */}
            <Section
              title="Reviews & Community"
              icon={<IoStarSharp size={13} />}
            >
              <CommentSection targetId={id} targetType="Guide" />
            </Section>
          </div>

          {/* ── Right: sidebar ── */}
          <aside className="space-y-5">
            {/* Booking card */}
            <div
              className="bg-white rounded-[20px] border border-[#ede8e0]
                            shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6"
            >
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="font-[Playfair_Display,Georgia,serif] text-[28px]
                                 font-bold text-[#3d2b1a]"
                >
                  {g.pricePerHour}
                </span>
                <span className="text-[13px] text-[#9e8e80] font-[Nunito,sans-serif]">
                  MAD / hour
                </span>
              </div>
              <p className="text-[12px] text-[#9e8e80] font-[Nunito,sans-serif] mb-4">
                Full-day &amp; custom packages available upon request.
              </p>
              <button
                className="w-full flex items-center justify-center gap-2 py-[11px]
                           rounded-[12px] bg-[#6b9c3e] text-white font-bold
                           font-[Nunito,sans-serif] text-[13px]
                           hover:bg-[#c8761a] hover:-translate-y-px
                           transition-all duration-200"
                onClick={() => setShowBooking(true)}
              >
                <TbCalendarEvent size={15} /> Book Now
                <HiArrowRight size={13} />
              </button>
              <div className="mt-3 pt-3 border-t border-[#f0ebe4] text-center">
                <span
                  className={`text-[12px] font-bold font-[Nunito,sans-serif]
                              ${isAvailable ? "text-[#6b9c3e]" : "text-[#9e8e80]"}`}
                >
                  {isAvailable ? "✓ Available now" : "Currently unavailable"}
                </span>
              </div>
            </div>

            {/* Languages */}
            {g.spokenLanguages?.length > 0 && (
              <SideCard title="Languages" icon={<TbLanguage size={13} />}>
                <div className="flex flex-wrap gap-2">
                  {g.spokenLanguages.map((l) => (
                    <span
                      key={l}
                      className="px-3 py-1.5 rounded-full bg-[#f5f0ea] border border-[#ede8e0]
                                 text-[12px] font-bold text-[#3d2b1a] font-[Nunito,sans-serif]"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </SideCard>
            )}

            {/* Cities covered */}
            {g.cityNames?.length > 0 && (
              <SideCard
                title="Cities Covered"
                icon={<RiMapPin2Line size={13} />}
              >
                <div className="flex flex-col gap-2.5">
                  {g.cityNames.map((city) => (
                    <span
                      key={city}
                      className="flex items-center gap-2 text-[13px] font-semibold
                                 text-[#3d2b1a] font-[Nunito,sans-serif]"
                    >
                      <span className="w-[6px] h-[6px] rounded-full bg-[#6b9c3e] shrink-0" />
                      {city}
                    </span>
                  ))}
                </div>
              </SideCard>
            )}

            {/* Experience */}
            <SideCard title="Experience" icon={<TbRoute size={13} />}>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="font-[Playfair_Display,Georgia,serif] text-[26px]
                                 font-bold text-[#3d2b1a]"
                >
                  {g.totalTours}
                </span>
                <span className="text-[13px] text-[#9e8e80] font-[Nunito,sans-serif]">
                  tours completed
                </span>
              </div>
            </SideCard>

            {/* Contact */}
            {g.contact && <ContactCard contact={g.contact} />}
          </aside>
        </div>
      </div>

      {/* ── Booking modal ── */}
      {showBooking && (
        <BookingModal guide={g} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
