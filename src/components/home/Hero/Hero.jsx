import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  TbMapPin,
  TbCalendarEvent,
  TbUsers,
  TbHome,
  TbSearch,
  TbToolsKitchen2,
  TbTent,
  TbBuilding,
  TbX,
} from "react-icons/tb";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import img1 from "../../../images/heroSlider/1.png";
import img2 from "../../../images/heroSlider/2.png";
import img3 from "../../../images/heroSlider/3.png";
import img4 from "../../../images/heroSlider/4.png";
import img5 from "../../../images/heroSlider/5.png";

// ─── Static data ──────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    city: "Marrakech",
    label: "The Red City",
    tag: "Culture & History",
    img: img1,
  },
  {
    id: 2,
    city: "Chefchaouen",
    label: "The Blue Pearl",
    tag: "Photography & Art",
    img: img2,
  },
  {
    id: 3,
    city: "Sahara",
    label: "Desert Adventure",
    tag: "Adventure & Nature",
    img: img3,
  },
  {
    id: 4,
    city: "Essaouira",
    label: "Coastal Escape",
    tag: "Beach & Wind",
    img: img4,
  },
  {
    id: 5,
    city: "Fès",
    label: "Imperial City",
    tag: "UNESCO Heritage",
    img: img5,
  },
];

const DESTINATIONS = [
  { label: "Marrakech", emoji: "🏯" },
  { label: "Chefchaouen", emoji: "🔵" },
  { label: "Sahara", emoji: "🏜️" },
  { label: "Essaouira", emoji: "⛵" },
  { label: "Fès", emoji: "🕌" },
  { label: "Agadir", emoji: "🏖️" },
  { label: "Ouarzazate", emoji: "🎬" },
  { label: "Casablanca", emoji: "🌆" },
];

const TYPES = [
  { label: "Places", icon: <TbBuilding size={15} /> },
  { label: "Guides", icon: <TbUsers size={15} /> },
  { label: "Events", icon: <TbCalendarEvent size={15} /> },
  { label: "Restaurants", icon: <TbToolsKitchen2 size={15} /> },
  { label: "Riads", icon: <TbHome size={15} /> },
  { label: "Desert tours", icon: <TbTent size={15} /> },
];

const PERIODS = [
  "Ce weekend",
  "Cette semaine",
  "Ce mois",
  "Printemps",
  "Été",
  "Automne",
  "Hiver",
];
const TRENDS = ["Riads", "Hammam", "Désert", "Médina", "Surf"];

const DURATION = 6000;
const TRANSITION = 950;

// ─── ClearBtn — declared OUTSIDE any component ───────────────────────────────
function ClearBtn({ onClear }) {
  return (
    <button
      onMouseDown={onClear}
      className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center flex-shrink-0 transition-colors ml-1"
    >
      <TbX size={11} className="text-white/60" />
    </button>
  );
}

// ─── Opt — reusable option button, declared OUTSIDE ──────────────────────────
function Opt({ selected, onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={[
        "ring-1 transition-all duration-150 cursor-pointer",
        selected
          ? "bg-[#5b8523]/20 ring-[#5b8523]/50 text-[#c8d98a]"
          : "bg-white/[.06] ring-white/[.08] text-white/60 hover:bg-white/[.12] hover:ring-white/[.2] hover:text-white",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── useSlider hook ───────────────────────────────────────────────────────────
function useSlider() {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (busy || idx === cur) return;
      setBusy(true);
      setPrev(cur);
      setCur(idx);
      setTimeout(() => {
        setPrev(null);
        setBusy(false);
      }, TRANSITION);
    },
    [busy, cur],
  );

  const goNext = useCallback(
    () => goTo((cur + 1) % SLIDES.length),
    [cur, goTo],
  );
  const goPrev = useCallback(
    () => goTo((cur - 1 + SLIDES.length) % SLIDES.length),
    [cur, goTo],
  );

  const reset = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(goNext, DURATION);
  }, [goNext]);

  useEffect(() => {
    timer.current = setInterval(goNext, DURATION);
    return () => clearInterval(timer.current);
  }, [goNext]);

  return { cur, prev, goTo, goNext, goPrev, reset };
}

// ─── DropdownPortal — renders in document.body to escape overflow:clip ────────
function DropdownPortal({ anchorRef, children, onClose }) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const update = () => {
      if (!anchorRef.current) return;
      const r = anchorRef.current.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 8,
        left: r.left + window.scrollX,
        width: r.width,
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const fn = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 9999,
      }}
      className="animate-fade-in"
    >
      {children}
    </div>,
    document.body,
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const barRef = useRef(null);

  const [activeSlot, setActiveSlot] = useState(null);
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");
  const [when, setWhen] = useState("");
  const [destQuery, setDestQuery] = useState("");

  const closePanel = useCallback(() => setActiveSlot(null), []);
  const toggle = (slot) =>
    setActiveSlot((prev) => (prev === slot ? null : slot));

  const filteredDest = DESTINATIONS.filter(
    (d) =>
      !destQuery.trim() ||
      d.label.toLowerCase().includes(destQuery.toLowerCase()),
  );

  const selectDest = (label) => {
    setDestination(label);
    setDestQuery("");
    setTimeout(
      () => setActiveSlot(!type ? "type" : !when ? "when" : null),
      220,
    );
  };

  const selectType = (label) => {
    setType(label);
    setTimeout(() => setActiveSlot(!when ? "when" : null), 220);
  };

  const selectWhen = (label) => {
    setWhen(label);
    setActiveSlot(null);
  };

  const clearSlot = (slot, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (slot === "destination") {
      setDestination("");
      setDestQuery("");
    }
    if (slot === "type") setType("");
    if (slot === "when") setWhen("");
  };

  const handleSubmit = () => {
    setActiveSlot(null);
    // Pass a structured object so HomePage can filter by both type AND destination
    onSearch?.({
      type:        type        || null,
      destination: destination || null,
      when:        when        || null,
    });
    // Navigate to a dedicated page for types that have one
    if (type === "Guides") navigate("/guides");
    else if (type === "Events") navigate("/events");
  };

  // Shared slot wrapper classes
  const slotCls = (id) =>
    [
      "relative flex-1 flex flex-col justify-center px-5 py-4 cursor-pointer select-none min-w-0 transition-colors duration-150",
      activeSlot === id ? "bg-white/[.09]" : "hover:bg-white/[.05]",
    ].join(" ");

  const slotLabelCls =
    "text-[9px] font-black tracking-[.2em] uppercase text-[#8fbe3f] mb-[3px]";
  const slotPhCls = "text-[13px] font-medium text-white/35";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[720px] mx-auto">
      {/* ── Segmented bar ─────────────────────────────────────────────────── */}
      <div
        ref={barRef}
        className={[
          "w-full flex items-stretch rounded-2xl bg-white/[.10] backdrop-blur-2xl",
          "shadow-[0_8px_48px_rgba(0,0,0,.5)] transition-all duration-300",
          activeSlot
            ? "ring-1 ring-white/[.28] shadow-[0_16px_64px_rgba(0,0,0,.65)]"
            : "ring-1 ring-white/[.15]",
        ].join(" ")}
      >
        {/* Destination slot */}
        <div
          className={slotCls("destination")}
          style={{ borderRadius: "1rem 0 0 1rem" }}
          onClick={() => toggle("destination")}
        >
          {activeSlot === "destination" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8d48a] rounded-t" />
          )}
          <span className={slotLabelCls}>Destination</span>
          {destination ? (
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-white truncate flex-1">
                {destination}
              </span>
              <ClearBtn onClear={(e) => clearSlot("destination", e)} />
            </div>
          ) : (
            <span className={slotPhCls}>Où aller ?</span>
          )}
        </div>

        <div className="w-px bg-white/[.1] self-stretch my-3" />

        {/* Type slot */}
        <div className={slotCls("type")} onClick={() => toggle("type")}>
          {activeSlot === "type" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8d48a] rounded-t" />
          )}
          <span className={slotLabelCls}>Type</span>
          {type ? (
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-white truncate flex-1">
                {type}
              </span>
              <ClearBtn onClear={(e) => clearSlot("type", e)} />
            </div>
          ) : (
            <span className={slotPhCls}>Que chercher ?</span>
          )}
        </div>

        <div className="w-px bg-white/[.1] self-stretch my-3" />

        {/* Période slot */}
        <div className={slotCls("when")} onClick={() => toggle("when")}>
          {activeSlot === "when" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8d48a] rounded-t" />
          )}
          <span className={slotLabelCls}>Période</span>
          {when ? (
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-white truncate flex-1">
                {when}
              </span>
              <ClearBtn onClear={(e) => clearSlot("when", e)} />
            </div>
          ) : (
            <span className={slotPhCls}>Ajouter dates</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center p-1.5 flex-shrink-0">
          <button
            onClick={handleSubmit}
            className="
              h-full px-7 rounded-[14px] flex items-center gap-2.5
              text-white text-[13px] font-bold tracking-wide whitespace-nowrap
              bg-[#5b8523] hover:bg-[#d57a2a]
              shadow-[0_2px_16px_rgba(91,133,35,.5)]
              hover:shadow-[0_4px_24px_rgba(213,122,42,.45)]
              transition-all duration-200
              hover:scale-[1.02] active:scale-[.97]
            "
          >
            <TbSearch size={16} />
            Explorer
          </button>
        </div>
      </div>

      {/* ── Portal dropdown ──────────────────────────────────────────────── */}
      {activeSlot && (
        <DropdownPortal anchorRef={barRef} onClose={closePanel}>
          <div className="rounded-2xl overflow-hidden bg-[#18110a] border border-white/[.12] shadow-[0_24px_80px_rgba(0,0,0,.75)]">
            {/* Destination panel */}
            {activeSlot === "destination" && (
              <div className="p-5">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[.07] ring-1 ring-white/[.1] focus-within:ring-[#5b8523]/50 transition-all mb-4">
                  <TbSearch size={13} className="text-white/30 flex-shrink-0" />
                  <input
                    autoFocus
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="Rechercher une ville…"
                    className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-white placeholder:text-white/25"
                  />
                  {destQuery && (
                    <button
                      onClick={() => setDestQuery("")}
                      className="text-white/25 hover:text-white/60 transition-colors"
                    >
                      <TbX size={13} />
                    </button>
                  )}
                </div>
                <p className="text-[9px] font-black tracking-[.18em] uppercase text-white/20 mb-3">
                  {destQuery.trim()
                    ? `${filteredDest.length} résultat${filteredDest.length !== 1 ? "s" : ""}`
                    : "Populaires au Maroc"}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {filteredDest.map((d) => (
                    <Opt
                      key={d.label}
                      selected={destination === d.label}
                      onClick={() => selectDest(d.label)}
                      className="flex flex-col items-center gap-2 px-2 py-3.5 rounded-xl text-center"
                    >
                      <span className="text-2xl leading-none">{d.emoji}</span>
                      <span className="text-[11px] font-semibold leading-tight">
                        {d.label}
                      </span>
                    </Opt>
                  ))}
                </div>
              </div>
            )}

            {/* Type panel */}
            {activeSlot === "type" && (
              <div className="p-5">
                <p className="text-[9px] font-black tracking-[.18em] uppercase text-white/20 mb-3">
                  Que cherchez-vous ?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map((t) => (
                    <Opt
                      key={t.label}
                      selected={type === t.label}
                      onClick={() => selectType(t.label)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                    >
                      <span
                        className={`flex-shrink-0 ${type === t.label ? "text-[#b8d48a]" : "text-white/35"}`}
                      >
                        {t.icon}
                      </span>
                      <span className="text-[13px] font-semibold text-left">
                        {t.label}
                      </span>
                    </Opt>
                  ))}
                </div>
              </div>
            )}

            {/* Period panel */}
            {activeSlot === "when" && (
              <div className="p-5">
                <p className="text-[9px] font-black tracking-[.18em] uppercase text-white/20 mb-3">
                  Quand partez-vous ?
                </p>
                <div className="flex flex-wrap gap-2">
                  {PERIODS.map((p) => (
                    <Opt
                      key={p}
                      selected={when === p}
                      onClick={() => selectWhen(p)}
                      className="px-4 py-2 rounded-full text-[13px] font-semibold"
                    >
                      {p}
                    </Opt>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DropdownPortal>
      )}

      {/* ── Trends chips ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-[11px] font-semibold text-white/25">
          Tendances :
        </span>
        {TRENDS.map((t) => (
          <button
            key={t}
            onClick={() => {
              setType(t);
              onSearch?.({ type: t, destination: null });
            }}
            className="
              text-[11px] font-semibold px-3.5 py-1.5 rounded-full
              bg-white/[.07] ring-1 ring-white/[.1] text-white/50
              hover:bg-[#5b8523]/20 hover:ring-[#5b8523]/35 hover:text-[#c8d98a]
              transition-all duration-200
            "
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero({ onSearch, allData }) {
  const { cur, prev, goTo, goNext, goPrev, reset } = useSlider();
  const slide = SLIDES[cur];

  return (
    <section
      className="relative w-full h-screen min-h-[640px] bg-[#0d0903]"
      style={{ overflow: "clip" }}
    >
      {/* Progress bar */}
      <div
        key={`prog-${cur}`}
        className="absolute top-0 left-0 h-[2px] z-30 bg-[#b8d48a] animate-prog"
      />

      {/* Background slides */}
      {prev !== null && (
        <div
          className="absolute inset-0 bg-cover bg-center z-[1] animate-fade-out"
          style={{ backgroundImage: `url(${SLIDES[prev].img})` }}
        />
      )}
      <div
        key={`slide-${cur}`}
        className="absolute inset-0 bg-cover bg-center z-[2] animate-zoom-in"
        style={{ backgroundImage: `url(${slide.img})` }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-t from-[#090603]/95 via-black/30 to-black/10" />
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-[#090603]/40 to-transparent" />

      {/* Slide counter */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
        <span className="text-[13px] font-bold text-white tabular-nums">
          {String(cur + 1).padStart(2, "0")}
        </span>
        <div className="w-8 h-px bg-white/25" />
        <span className="text-[13px] text-white/35 tabular-nums">
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Centered content ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pb-8">
        {/* Text block */}
        <div
          key={`txt-${cur}`}
          className="flex flex-col items-center text-center gap-3 mb-8"
        >
          <span
            className="
            inline-flex items-center gap-1.5
            px-3 py-[6px] rounded-full
            text-[10px] font-bold tracking-[.18em] uppercase
            text-[#c8d98a] bg-[#5b8523]/18 ring-1 ring-[#5b8523]/28
            backdrop-blur-md animate-slide-up-1
          "
          >
            <TbMapPin size={11} /> {slide.tag}
          </span>

          <div className="flex items-center gap-3 animate-slide-up-2">
            <span className="w-8 h-px bg-white/25" />
            <span className="text-[10px] font-semibold tracking-[.28em] uppercase text-white/40">
              {slide.label}
            </span>
            <span className="w-8 h-px bg-white/25" />
          </div>

          <h1
            className="
            text-[clamp(52px,9vw,110px)] font-bold leading-[.88]
            text-white tracking-tight font-display
            animate-slide-up-3
          "
          >
            {slide.city}
          </h1>

          <p className="text-[15px] text-white/40 font-medium max-w-sm animate-slide-up-4 mt-1">
            Découvrez le Maroc authentique — guides, lieux et expériences
            uniques.
          </p>
        </div>

        {/* Search */}
        <div className="w-full animate-slide-up-5">
          <SearchBar onSearch={onSearch} allData={allData} />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i);
              reset();
            }}
            aria-label={`Slide ${i + 1}`}
            className={[
              "h-[2px] rounded-full transition-all duration-300",
              i === cur
                ? "w-8 bg-[#b8d48a]"
                : "w-5 bg-white/20 hover:bg-white/45",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => {
          goPrev();
          reset();
        }}
        aria-label="Slide précédent"
        className="
          absolute top-1/2 -translate-y-1/2 left-5 z-20
          w-10 h-10 rounded-full flex items-center justify-center
          text-white bg-white/[.07] ring-1 ring-white/[.14]
          backdrop-blur-md hover:bg-[#5b8523]/30
          transition-all duration-200 max-sm:hidden
        "
      >
        <HiChevronLeft size={20} />
      </button>
      <button
        onClick={() => {
          goNext();
          reset();
        }}
        aria-label="Slide suivant"
        className="
          absolute top-1/2 -translate-y-1/2 right-5 z-20
          w-10 h-10 rounded-full flex items-center justify-center
          text-white bg-white/[.07] ring-1 ring-white/[.14]
          backdrop-blur-md hover:bg-[#5b8523]/30
          transition-all duration-200 max-sm:hidden
        "
      >
        <HiChevronRight size={20} />
      </button>
    </section>
  );
}
