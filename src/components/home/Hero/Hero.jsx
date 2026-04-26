import { TbMapPin } from "react-icons/tb";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { SLIDES } from "./heroData";
import { useSlider } from "./hooks/useSlider";
import SearchBar from "./components/SearchBar";

export default function Hero({ onSearch }) {
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
        className="absolute top-0 left-0 h-[2px] z-30 bg-[#C9974A] animate-prog"
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

      {/* Gradient overlays — warm dark vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-t from-[#0d0903]/92 via-black/25 to-black/15" />
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-[#0d0903]/35 to-transparent" />

      {/* Slide counter */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
        <span className="text-[13px] font-bold text-white/80 tabular-nums">
          {String(cur + 1).padStart(2, "0")}
        </span>
        <div className="w-8 h-px bg-white/20" />
        <span className="text-[13px] text-white/30 tabular-nums">
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Main content — pushed toward top so dropdown has room below ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[11vh] px-6">

        {/* Text block */}
        <div
          key={`txt-${cur}`}
          className="flex flex-col items-center text-center gap-3 mb-9 w-full"
        >
          {/* Category badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-[6px] rounded-full
                           text-[10px] font-bold tracking-[.18em] uppercase
                           text-[#F2E4C8] bg-[#C9974A]/18 ring-1 ring-[#C9974A]/30
                           backdrop-blur-md animate-slide-up-1">
            <TbMapPin size={11} /> {slide.tag}
          </span>

          {/* Label */}
          <div className="flex items-center gap-3 animate-slide-up-2">
            <span className="w-8 h-px bg-white/20" />
            <span className="text-[10px] font-semibold tracking-[.28em] uppercase text-white/35">
              {slide.label}
            </span>
            <span className="w-8 h-px bg-white/20" />
          </div>

          {/* City title */}
          <h1 className="text-[clamp(48px,8.5vw,104px)] font-bold leading-[.88]
                         text-white tracking-tight font-display animate-slide-up-3">
            {slide.city}
          </h1>

          {/* Subtitle */}
          <p className="text-[14.5px] text-white/35 font-medium max-w-md animate-slide-up-4 mt-1">
            Discover authentic Morocco — guides, places & unique experiences.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full animate-slide-up-5">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); reset(); }}
            aria-label={`Slide ${i + 1}`}
            className={[
              "h-[2px] rounded-full transition-all duration-300",
              i === cur ? "w-8 bg-[#C9974A]" : "w-5 bg-white/20 hover:bg-white/40",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Arrow — left */}
      <button
        onClick={() => { goPrev(); reset(); }}
        aria-label="Previous slide"
        className="absolute top-1/2 -translate-y-1/2 left-5 z-20
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-white/70 bg-white/[.07] ring-1 ring-white/[.12]
                   backdrop-blur-md hover:bg-[#C9974A]/25 hover:text-white
                   transition-all duration-200 max-sm:hidden"
      >
        <HiChevronLeft size={20} />
      </button>

      {/* Arrow — right */}
      <button
        onClick={() => { goNext(); reset(); }}
        aria-label="Next slide"
        className="absolute top-1/2 -translate-y-1/2 right-5 z-20
                   w-10 h-10 rounded-full flex items-center justify-center
                   text-white/70 bg-white/[.07] ring-1 ring-white/[.12]
                   backdrop-blur-md hover:bg-[#C9974A]/25 hover:text-white
                   transition-all duration-200 max-sm:hidden"
      >
        <HiChevronRight size={20} />
      </button>
    </section>
  );
}
