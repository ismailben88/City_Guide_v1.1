// components/layout/navBar/components/CityGuideLogo.jsx
import LogoCityg from "../../../../images/logoCityGuide";

export default function CityGuideLogo({ onClick, size = "md" }) {
  const isLg = size === "lg";

  return (
    <button
      onClick={onClick}
      aria-label="City Guide — Go to home"
      className="
        flex items-center gap-2.5 flex-shrink-0 group
        bg-transparent border-none cursor-pointer p-0
        outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg
      "
    >
      {/* Logo mark */}
      <div
        className={[
          "relative flex items-center justify-center flex-shrink-0",
          "transition-transform duration-200 group-hover:scale-105",
          isLg ? "w-10 h-10" : "w-8 h-8",
        ].join(" ")}
      >
        <LogoCityg />
        <span className="absolute inset-0 rounded-full ring-1 ring-primary/0 group-hover:ring-primary/20 transition-all duration-200" />
      </div>

      {/* Wordmark */}
      <div className="flex items-center gap-1.5 select-none leading-none">
        <span
          className={[
            "font-display font-bold tracking-tight text-white",
            isLg ? "text-[21px]" : "text-[17px]",
          ].join(" ")}
        >
          City
        </span>
       
        <span
          className={[
            "font-display font-bold tracking-tight text-primary",
            isLg ? "text-[21px]" : "text-[17px]",
          ].join(" ")}
        >
          Guide
        </span>
      </div>
    </button>
  );
}
