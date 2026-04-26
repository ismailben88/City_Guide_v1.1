import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TbSearch, TbX, TbMapPin, TbLayoutGrid, TbCalendar,
} from "react-icons/tb";
import { DESTINATIONS, TYPES, PERIODS, TRENDS } from "../heroData";
import DropdownPortal from "./DropdownPortal";

// ─── Design tokens ─────────────────────────────────────────────────────────
// #C9974A  Moroccan amber  — accent, icons, active
// #F2E4C8  Sand white      — primary text (warm, readable on dark)
// #1C1208  Deep warm black — panel background (fully opaque)

const SOON    = ["This Weekend", "This Week", "This Month"];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];
const S_ICON  = { Spring: "🌸", Summer: "☀️", Autumn: "🍂", Winter: "❄️" };

const toSlug = (s = "") =>
  s.toLowerCase().replace(/\p{Diacritic}/gu, "").replace(/\s+/g, "-");

// ─── Atoms ──────────────────────────────────────────────────────────────────

function ClearBtn({ onClear }) {
  return (
    <button
      onMouseDown={onClear}
      className="w-4 h-4 rounded-full bg-white/10 hover:bg-[#C9974A]/35
                 flex items-center justify-center flex-shrink-0 ml-1.5 transition-colors"
    >
      <TbX size={9} className="text-white/45" />
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[7.5px] font-black tracking-[.28em] uppercase text-[#C9974A]/50 mb-2.5">
      {children}
    </p>
  );
}

// ─── City card — compact square tile ────────────────────────────────────────

function CityCard({ city, selected, onSelect }) {
  const Icon = city.Icon;
  return (
    <button
      onMouseDown={onSelect}
      className={[
        "group flex flex-col items-center gap-[6px] py-[11px] px-1 rounded-xl",
        "ring-1 cursor-pointer transition-all duration-150",
        selected
          ? "bg-[#C9974A]/20 ring-[#C9974A]/55"
          : "bg-white/[.04] ring-white/[.06] hover:bg-[#C9974A]/12 hover:ring-[#C9974A]/30 hover:-translate-y-[1px]",
      ].join(" ")}
    >
      <Icon
        size={17}
        className={[
          "transition-colors duration-150",
          selected ? "text-[#C9974A]" : "text-white/28 group-hover:text-[#C9974A]/80",
        ].join(" ")}
      />
      <span
        className={[
          "text-[10px] font-semibold leading-none text-center w-full truncate px-0.5",
          selected ? "text-[#F2E4C8]" : "text-[#F2E4C8]/50 group-hover:text-[#F2E4C8]/90",
        ].join(" ")}
      >
        {city.label}
      </span>
    </button>
  );
}

// ─── Type card ───────────────────────────────────────────────────────────────

function TypeCard({ t, selected, onSelect }) {
  const Icon = t.Icon;
  return (
    <button
      onMouseDown={onSelect}
      className={[
        "group flex items-center gap-2.5 px-3 py-[11px] rounded-xl",
        "ring-1 cursor-pointer transition-all duration-150",
        selected
          ? "bg-[#C9974A]/20 ring-[#C9974A]/55"
          : "bg-white/[.04] ring-white/[.06] hover:bg-[#C9974A]/12 hover:ring-[#C9974A]/30",
      ].join(" ")}
    >
      <Icon
        size={15}
        className={[
          "flex-shrink-0 transition-colors",
          selected ? "text-[#C9974A]" : "text-white/25 group-hover:text-[#C9974A]/80",
        ].join(" ")}
      />
      <div className="flex flex-col min-w-0">
        <span className={[
          "text-[11.5px] font-semibold leading-none",
          selected ? "text-[#F2E4C8]" : "text-[#F2E4C8]/58 group-hover:text-[#F2E4C8]/90",
        ].join(" ")}>
          {t.label}
        </span>
        <span className="text-[9px] text-[#F2E4C8]/25 mt-[3px]">{t.desc}</span>
      </div>
    </button>
  );
}

// ─── Period chip ─────────────────────────────────────────────────────────────

function PeriodChip({ label, selected, onSelect, prefix }) {
  return (
    <button
      onMouseDown={onSelect}
      className={[
        "px-3.5 py-[8px] rounded-full text-[11px] font-semibold ring-1 cursor-pointer transition-all duration-150",
        selected
          ? "bg-[#C9974A]/20 ring-[#C9974A]/55 text-[#F2E4C8]"
          : "bg-white/[.04] ring-white/[.06] text-[#F2E4C8]/42 hover:bg-[#C9974A]/12 hover:ring-[#C9974A]/30 hover:text-[#F2E4C8]/90",
      ].join(" ")}
    >
      {prefix && <span className="mr-1">{prefix}</span>}
      {label}
    </button>
  );
}

// ─── SearchBar ───────────────────────────────────────────────────────────────

export default function SearchBar({ onSearch }) {
  const navigate  = useNavigate();
  const barRef    = useRef(null);

  const [activeSlot,  setActiveSlot]  = useState(null);
  const [destination, setDestination] = useState("");
  const [type,        setType]        = useState("");
  const [when,        setWhen]        = useState("");
  const [destQuery,   setDestQuery]   = useState("");

  // Max height for the dropdown panel — recalculated each time a slot opens
  const [panelMaxH, setPanelMaxH] = useState(480);

  const closePanel = useCallback(() => setActiveSlot(null), []);
  const toggle     = (slot) => setActiveSlot((p) => (p === slot ? null : slot));

  // When a slot opens, measure available space below the bar
  useEffect(() => {
    if (activeSlot && barRef.current) {
      const r = barRef.current.getBoundingClientRect();
      setPanelMaxH(Math.max(240, window.innerHeight - r.bottom - 16));
    }
  }, [activeSlot]);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") closePanel(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [closePanel]);

  const filteredDest = DESTINATIONS.filter(
    (d) => !destQuery.trim() || d.label.toLowerCase().includes(destQuery.toLowerCase()),
  );

  const selectDest = (label) => {
    setDestination(label);
    setDestQuery("");
    setActiveSlot(!type ? "type" : !when ? "when" : null);
  };
  const selectType = (label) => { setType(label); setActiveSlot(!when ? "when" : null); };
  const selectWhen = (label) => { setWhen(label); setActiveSlot(null); };

  const clearSlot = (slot, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (slot === "destination") { setDestination(""); setDestQuery(""); }
    if (slot === "type") setType("");
    if (slot === "when") setWhen("");
  };

  const handleSubmit = () => {
    setActiveSlot(null);
    if (destination) { navigate(`/city/${toSlug(destination)}`); return; }
    onSearch?.({ type: type || null, destination: null, when: when || null });
    if (type === "Guides") navigate("/guides");
    else if (type === "Events") navigate("/events");
  };

  const slotCls = (id) => [
    "relative flex-1 flex flex-col justify-center px-5 py-[17px]",
    "cursor-pointer select-none min-w-0 transition-colors duration-150",
    activeSlot === id ? "bg-[#C9974A]/[.07]" : "hover:bg-white/[.03]",
  ].join(" ");

  const SlotMeta = ({ Icon: Ic, text }) => (
    <div className="flex items-center gap-[5px] mb-[4px]">
      <Ic size={9} className="text-[#C9974A]" />
      <span className="text-[7.5px] font-black tracking-[.26em] uppercase text-[#C9974A]">
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2.5 w-full max-w-[740px] mx-auto">

      {/* ── Search bar ─────────────────────────────────────────────────── */}
      <div
        ref={barRef}
        className={[
          "w-full flex items-stretch rounded-2xl overflow-hidden",
          "bg-[#0d0903]/78 backdrop-blur-2xl transition-all duration-300",
          activeSlot
            ? "ring-1 ring-[#C9974A]/40 shadow-[0_20px_60px_rgba(0,0,0,.75)]"
            : "ring-1 ring-white/[.12] shadow-[0_8px_40px_rgba(0,0,0,.5)]",
        ].join(" ")}
      >
        {/* Destination */}
        <div className={slotCls("destination")} onMouseDown={() => toggle("destination")}>
          {activeSlot === "destination" && (
            <span className="absolute top-0 inset-x-4 h-[2px] rounded-b
                             bg-gradient-to-r from-transparent via-[#C9974A]/60 to-transparent" />
          )}
          <SlotMeta Icon={TbMapPin} text="Destination" />
          {destination ? (
            <div className="flex items-center">
              <span className="text-[13px] font-semibold text-[#F2E4C8] truncate flex-1">{destination}</span>
              <ClearBtn onClear={(e) => clearSlot("destination", e)} />
            </div>
          ) : (
            <span className="text-[13px] font-medium text-[#F2E4C8]/30">Where to go?</span>
          )}
        </div>

        <div className="w-px bg-white/[.08] self-stretch my-3" />

        {/* Category */}
        <div className={slotCls("type")} onMouseDown={() => toggle("type")}>
          {activeSlot === "type" && (
            <span className="absolute top-0 inset-x-4 h-[2px] rounded-b
                             bg-gradient-to-r from-transparent via-[#C9974A]/60 to-transparent" />
          )}
          <SlotMeta Icon={TbLayoutGrid} text="Category" />
          {type ? (
            <div className="flex items-center">
              <span className="text-[13px] font-semibold text-[#F2E4C8] truncate flex-1">{type}</span>
              <ClearBtn onClear={(e) => clearSlot("type", e)} />
            </div>
          ) : (
            <span className="text-[13px] font-medium text-[#F2E4C8]/30">What to explore?</span>
          )}
        </div>

        <div className="w-px bg-white/[.08] self-stretch my-3" />

        {/* When */}
        <div className={slotCls("when")} onMouseDown={() => toggle("when")}>
          {activeSlot === "when" && (
            <span className="absolute top-0 inset-x-4 h-[2px] rounded-b
                             bg-gradient-to-r from-transparent via-[#C9974A]/60 to-transparent" />
          )}
          <SlotMeta Icon={TbCalendar} text="When" />
          {when ? (
            <div className="flex items-center">
              <span className="text-[13px] font-semibold text-[#F2E4C8] truncate flex-1">{when}</span>
              <ClearBtn onClear={(e) => clearSlot("when", e)} />
            </div>
          ) : (
            <span className="text-[13px] font-medium text-[#F2E4C8]/30">Any time</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center p-2 flex-shrink-0">
          <button
            onMouseDown={handleSubmit}
            className="h-full px-7 rounded-[14px] flex items-center gap-2
                       text-white text-[13px] font-bold tracking-wide whitespace-nowrap
                       bg-[#4E7A1E] hover:bg-[#C9974A]
                       shadow-[0_2px_14px_rgba(78,122,30,.4)]
                       hover:shadow-[0_4px_20px_rgba(201,151,74,.38)]
                       transition-all duration-200 hover:scale-[1.02] active:scale-[.97]"
          >
            <TbSearch size={14} />
            Explore
          </button>
        </div>
      </div>

      {/* ── Dropdown — height capped to available viewport space ─────────── */}
      {activeSlot && (
        <DropdownPortal anchorRef={barRef} onClose={closePanel}>
          {/*
            panelMaxH = window.innerHeight - bar.bottom - 16px.
            overflow-y-auto lets content scroll instead of overflowing the hero.
            bg is fully opaque so background images never bleed through.
          */}
          <div
            style={{ maxHeight: panelMaxH }}
            className="overflow-y-auto rounded-2xl
                       bg-[#1C1208] border border-white/[.07]
                       shadow-[0_24px_70px_rgba(0,0,0,.88)]
                       scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          >

            {/* ── Destination ── */}
            {activeSlot === "destination" && (
              <div className="p-4">
                {/* Search input */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 mb-4 rounded-xl
                                bg-white/[.05] ring-1 ring-white/[.07]
                                focus-within:ring-[#C9974A]/40 focus-within:bg-[#C9974A]/[.03]
                                transition-all">
                  <TbSearch size={13} className="text-[#C9974A]/45 flex-shrink-0" />
                  <input
                    autoFocus
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="Search a city in Morocco…"
                    className="flex-1 bg-transparent border-none outline-none
                               text-[12.5px] font-medium text-[#F2E4C8]
                               placeholder:text-[#F2E4C8]/22"
                  />
                  {destQuery && (
                    <button
                      onMouseDown={() => setDestQuery("")}
                      className="text-[#F2E4C8]/22 hover:text-[#C9974A] transition-colors"
                    >
                      <TbX size={12} />
                    </button>
                  )}
                </div>

                <SectionLabel>
                  {destQuery.trim()
                    ? `${filteredDest.length} result${filteredDest.length !== 1 ? "s" : ""}`
                    : "Popular in Morocco"}
                </SectionLabel>

                {/* 4-col compact grid */}
                <div className="grid grid-cols-4 gap-1.5">
                  {filteredDest.map((d) => (
                    <CityCard
                      key={d.label}
                      city={d}
                      selected={destination === d.label}
                      onSelect={() => selectDest(d.label)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Category ── */}
            {activeSlot === "type" && (
              <div className="p-4">
                <SectionLabel>What are you looking for?</SectionLabel>
                <div className="grid grid-cols-3 gap-1.5">
                  {TYPES.map((t) => (
                    <TypeCard
                      key={t.label}
                      t={t}
                      selected={type === t.label}
                      onSelect={() => selectType(t.label)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── When ── */}
            {activeSlot === "when" && (
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <SectionLabel>Coming up</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {SOON.map((p) => (
                      <PeriodChip key={p} label={p} selected={when === p} onSelect={() => selectWhen(p)} />
                    ))}
                  </div>
                </div>
                <div className="h-px bg-white/[.05]" />
                <div>
                  <SectionLabel>By Season</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {SEASONS.map((p) => (
                      <PeriodChip key={p} label={p} selected={when === p} onSelect={() => selectWhen(p)} prefix={S_ICON[p]} />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </DropdownPortal>
      )}

      {/* ── Trend chips ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <span className="text-[10px] font-semibold text-[#F2E4C8]/20">Trending:</span>
        {TRENDS.map((t) => (
          <button
            key={t}
            onMouseDown={() => { setType(t); onSearch?.({ type: t, destination: null }); }}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-full
                       bg-white/[.04] ring-1 ring-white/[.06] text-[#F2E4C8]/30
                       hover:bg-[#C9974A]/12 hover:ring-[#C9974A]/25 hover:text-[#F2E4C8]/90
                       transition-all duration-150"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
