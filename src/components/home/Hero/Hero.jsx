// components/home/Hero/Hero.jsx
// ─── Tailwind CSS only — zero styled-components ───────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { RiSearchLine } from "react-icons/ri";
import { TbMapPin } from "react-icons/tb";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import img1 from "../../../images/heroSlider/1.png";
import img2 from "../../../images/heroSlider/2.png";
import img3 from "../../../images/heroSlider/3.png";
import img4 from "../../../images/heroSlider/4.png";
import img5 from "../../../images/heroSlider/5.png";

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

const DURATION = 6000;
const TRANSITION_MS = 950;
const QUICK_TERMS = [
  "Guides",
  "Restaurants",
  "Riads",
  "Desert tours",
  "Hammam",
];

export default function Hero({ onSearch }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const autoRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      if (busy || idx === cur) return;
      setBusy(true);
      setPrev(cur);
      setCur(idx);
      setTimeout(() => {
        setPrev(null);
        setBusy(false);
      }, TRANSITION_MS);
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

  const resetAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(goNext, DURATION);
  }, [goNext]);

  useEffect(() => {
    autoRef.current = setInterval(goNext, DURATION);
    return () => clearInterval(autoRef.current);
  }, []); // eslint-disable-line

  const handlePrev = () => {
    goPrev();
    resetAuto();
  };
  const handleNext = () => {
    goNext();
    resetAuto();
  };
  const handleDot = (i) => {
    goTo(i);
    resetAuto();
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch?.(query.trim());
  };
  const handleQuick = (t) => {
    setQuery(t);
    onSearch?.(t);
  };

  const slide = SLIDES[cur];

  return (
    <section className="relative w-full h-screen min-h-[580px] overflow-hidden bg-[#1a1206]">
      {/* ── Progress bar ── */}
      <div
        key={`prog-${cur}`}
        className="absolute top-0 left-0 h-[3px] bg-[#6b9c3e] z-30 animate-prog"
      />

      {/* ── Leaving slide ── */}
      {prev !== null && (
        <div
          key={`leave-${prev}`}
          className="absolute inset-0 bg-cover bg-center z-[1] animate-fade-out"
          style={{ backgroundImage: `url(${SLIDES[prev].img})` }}
        />
      )}

      {/* ── Entering slide ── */}
      <div
        key={`enter-${cur}`}
        className="absolute inset-0 bg-cover bg-center z-[2] animate-zoom-in"
        style={{ backgroundImage: `url(${slide.img})` }}
      />

      {/* ── Overlay bottom ── */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(61,43,26,0.88) 0%, rgba(0,0,0,0.32) 45%, transparent 72%)",
        }}
      />
      {/* ── Overlay side ── */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.38) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.28) 100%)",
        }}
      />

      {/* ── Main content ── */}
      <div className="absolute bottom-[110px] left-14 right-14 z-20 flex flex-col gap-7 max-sm:left-5 max-sm:right-5 max-sm:bottom-[90px]">
        {/* Text block */}
        <div key={`txt-${cur}`} className="flex flex-col gap-2">
          {/* Tag pill */}
          <span
            className="inline-flex items-center gap-1.5 w-fit px-3 py-[5px] rounded-full text-[11px] font-bold tracking-widest uppercase animate-slide-up-1"
            style={{
              color: "#c8d98a",
              background: "rgba(107,156,62,0.22)",
              border: "1px solid rgba(107,156,62,0.45)",
              backdropFilter: "blur(6px)",
            }}
          >
            <TbMapPin size={13} />
            {slide.tag}
          </span>

          {/* Label row */}
          <div className="flex items-center gap-2.5 animate-slide-up-2">
            <span
              className="w-9 h-px"
              style={{ background: "rgba(255,255,255,0.45)" }}
            />
            <span
              className="text-[11px] font-semibold tracking-[0.26em] uppercase"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {slide.label}
            </span>
          </div>

          {/* City name */}
          <h1
            className="text-[clamp(52px,9vw,112px)] font-bold leading-[0.92] text-white tracking-[-0.02em] m-0 animate-slide-up-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {slide.city}
          </h1>

          {/* Subtitle */}
          <p
            className="text-[15px] mt-1 animate-slide-up-4 max-sm:hidden"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Discover the best places, guides & experiences
          </p>
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 max-w-[580px] animate-slide-up-5"
        >
          {/* Search box */}
          <div
            className="flex items-center rounded-[14px] py-1.5 pl-4 pr-1.5 gap-2.5 transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.97)",
              boxShadow: focused
                ? "0 8px 32px rgba(107,156,62,0.28)"
                : "0 8px 32px rgba(0,0,0,0.28)",
              border: focused ? "2px solid #6b9c3e" : "2px solid transparent",
            }}
          >
            <span
              className="flex items-center flex-shrink-0"
              style={{ color: "#6b9c3e" }}
            >
              <RiSearchLine size={18} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search a place, guide, event…"
              aria-label="Search"
              className="flex-1 border-none outline-none bg-transparent text-[15px] font-medium min-w-0"
              style={{ fontFamily: "'Nunito', sans-serif", color: "#3d2b1a" }}
            />
            <button
              type="submit"
              className="flex-shrink-0 px-[22px] py-2.5 rounded-[10px] text-white text-sm font-bold cursor-pointer transition-all duration-200 border-none hover:scale-[1.03]"
              style={{
                fontFamily: "'Nunito', sans-serif",
                background: "#6b9c3e",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c8761a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#6b9c3e")
              }
            >
              Explore
            </button>
          </div>

          {/* Quick chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-semibold"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Popular :
            </span>
            {QUICK_TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleQuick(t)}
                className="text-xs font-semibold px-[13px] py-1 rounded-full cursor-pointer transition-all duration-[180ms] border"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  background: "rgba(255,255,255,0.12)",
                  borderColor: "rgba(255,255,255,0.22)",
                  color: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(6px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(107,156,62,0.3)";
                  e.currentTarget.style.borderColor = "rgba(107,156,62,0.6)";
                  e.currentTarget.style.color = "#c8d98a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ── Arrow Left ── */}
      <button
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute top-1/2 -translate-y-1/2 left-6 z-20 w-[50px] h-[50px] rounded-full text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 border max-sm:w-10 max-sm:h-10"
        style={{
          background: "rgba(255,255,255,0.10)",
          borderColor: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(107,156,62,0.38)";
          e.currentTarget.style.borderColor = "rgba(107,156,62,0.65)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.10)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
        }}
      >
        <HiChevronLeft size={22} />
      </button>

      {/* ── Arrow Right ── */}
      <button
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute top-1/2 -translate-y-1/2 right-6 z-20 w-[50px] h-[50px] rounded-full text-white flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 border max-sm:w-10 max-sm:h-10"
        style={{
          background: "rgba(255,255,255,0.10)",
          borderColor: "rgba(255,255,255,0.22)",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(107,156,62,0.38)";
          e.currentTarget.style.borderColor = "rgba(107,156,62,0.65)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.10)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
        }}
      >
        <HiChevronRight size={22} />
      </button>

      {/* ── Thumbnails (desktop only) ── */}
      <div className="absolute bottom-6 right-7 z-20 hidden md:flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleDot(i)}
            title={s.city}
            className="relative w-[58px] h-[58px] rounded-[10px] overflow-hidden p-0 cursor-pointer flex-shrink-0 transition-all duration-300 hover:scale-[1.08]"
            style={{
              border:
                i === cur
                  ? "2.5px solid rgba(107,156,62,0.9)"
                  : "2.5px solid transparent",
            }}
          >
            <img
              src={s.img}
              alt={s.city}
              loading="lazy"
              className="w-full h-full object-cover block transition-all duration-300"
              style={{
                opacity: i === cur ? 1 : 0.5,
                filter: i === cur ? "none" : "grayscale(0.4)",
              }}
            />
            <span
              className="absolute bottom-[3px] left-0 right-0 text-center text-[8px] font-bold tracking-[0.04em]"
              style={{
                fontFamily: "'Nunito', sans-serif",
                color: i === cur ? "#fff" : "rgba(255,255,255,0.65)",
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}
            >
              {s.city}
            </span>
          </button>
        ))}
      </div>

      {/* ── Dots ── */}
      <div className="absolute bottom-8 left-14 z-20 flex gap-2 items-center max-md:left-1/2 max-md:-translate-x-1/2 max-md:bottom-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-[7px] rounded-full border-none p-0 cursor-pointer transition-all duration-[350ms]"
            style={{
              width: i === cur ? "26px" : "7px",
              background: i === cur ? "#6b9c3e" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
