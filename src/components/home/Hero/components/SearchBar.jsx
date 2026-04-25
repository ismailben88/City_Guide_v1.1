import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TbSearch, TbX } from "react-icons/tb";
import { DESTINATIONS, TYPES, PERIODS, TRENDS } from "../heroData";
import DropdownPortal from "./DropdownPortal";

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

function Opt({ selected, onMouseDown, children, className = "" }) {
  return (
    <button
      onMouseDown={onMouseDown}
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

const toSlug = (str = "") =>
  str
    .toLowerCase()
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-");

export default function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const barRef = useRef(null);

  const [activeSlot, setActiveSlot] = useState(null);
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");
  const [when, setWhen] = useState("");
  const [destQuery, setDestQuery] = useState("");

  const closePanel = useCallback(() => setActiveSlot(null), []);

  const toggle = (slot) => setActiveSlot((p) => (p === slot ? null : slot));

  const filteredDest = DESTINATIONS.filter(
    (d) =>
      !destQuery.trim() ||
      d.label.toLowerCase().includes(destQuery.toLowerCase()),
  );

  // ── Fixes: use onMouseDown on every option so the pick fires
  // before the slot's onMouseDown can toggle the panel closed. ──

  const selectDest = (label) => {
    setDestination(label);
    setDestQuery("");
    setActiveSlot(!type ? "type" : !when ? "when" : null);
  };

  const selectType = (label) => {
    setType(label);
    setActiveSlot(!when ? "when" : null);
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
    if (destination) {
      navigate(`/city/${toSlug(destination)}`);
      return;
    }
    onSearch?.({ type: type || null, destination: null, when: when || null });
    if (type === "Guides") navigate("/guides");
    else if (type === "Events") navigate("/events");
  };

  const slotCls = (id) =>
    [
      "relative flex-1 flex flex-col justify-center px-5 py-4 cursor-pointer select-none min-w-0 transition-colors duration-150",
      activeSlot === id ? "bg-white/[.09]" : "hover:bg-white/[.05]",
    ].join(" ");

  const labelCls =
    "text-[9px] font-black tracking-[.2em] uppercase text-[#8fbe3f] mb-[3px]";
  const phCls = "text-[13px] font-medium text-white/35";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[720px] mx-auto">
      {/* Segmented bar */}
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
        {/* Destination */}
        <div
          className={slotCls("destination")}
          style={{ borderRadius: "1rem 0 0 1rem" }}
          onMouseDown={() => toggle("destination")}
        >
          {activeSlot === "destination" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8d48a] rounded-t" />
          )}
          <span className={labelCls}>Destination</span>
          {destination ? (
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-white truncate flex-1">
                {destination}
              </span>
              <ClearBtn onClear={(e) => clearSlot("destination", e)} />
            </div>
          ) : (
            <span className={phCls}>Où aller ?</span>
          )}
        </div>

        <div className="w-px bg-white/[.1] self-stretch my-3" />

        {/* Type */}
        <div className={slotCls("type")} onMouseDown={() => toggle("type")}>
          {activeSlot === "type" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8d48a] rounded-t" />
          )}
          <span className={labelCls}>Type</span>
          {type ? (
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-white truncate flex-1">
                {type}
              </span>
              <ClearBtn onClear={(e) => clearSlot("type", e)} />
            </div>
          ) : (
            <span className={phCls}>Que chercher ?</span>
          )}
        </div>

        <div className="w-px bg-white/[.1] self-stretch my-3" />

        {/* Période */}
        <div className={slotCls("when")} onMouseDown={() => toggle("when")}>
          {activeSlot === "when" && (
            <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8d48a] rounded-t" />
          )}
          <span className={labelCls}>Période</span>
          {when ? (
            <div className="flex items-center">
              <span className="text-[14px] font-semibold text-white truncate flex-1">
                {when}
              </span>
              <ClearBtn onClear={(e) => clearSlot("when", e)} />
            </div>
          ) : (
            <span className={phCls}>Ajouter dates</span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center p-1.5 flex-shrink-0">
          <button
            onMouseDown={handleSubmit}
            className="
              h-full px-7 rounded-[14px] flex items-center gap-2.5
              text-white text-[13px] font-bold tracking-wide whitespace-nowrap
              bg-[#5b8523] hover:bg-[#d57a2a]
              shadow-[0_2px_16px_rgba(91,133,35,.5)]
              hover:shadow-[0_4px_24px_rgba(213,122,42,.45)]
              transition-all duration-200 hover:scale-[1.02] active:scale-[.97]
            "
          >
            <TbSearch size={16} />
            Explorer
          </button>
        </div>
      </div>

      {/* Dropdown portal */}
      {activeSlot && (
        <DropdownPortal anchorRef={barRef} onClose={closePanel}>
          <div className="rounded-2xl overflow-hidden bg-[#18110a] border border-white/[.12] shadow-[0_24px_80px_rgba(0,0,0,.75)]">
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
                      onMouseDown={() => setDestQuery("")}
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
                      onMouseDown={() => selectDest(d.label)}
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
                      onMouseDown={() => selectType(t.label)}
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
                      onMouseDown={() => selectWhen(p)}
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

      {/* Trends chips */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="text-[11px] font-semibold text-white/25">
          Tendances :
        </span>
        {TRENDS.map((t) => (
          <button
            key={t}
            onMouseDown={() => {
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
