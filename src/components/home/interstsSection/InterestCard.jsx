import { RiCompassLine } from "react-icons/ri";

export default function InterestCard({ category, index, onClick }) {
  const title = category.name || "Catégorie";
  const img = category.img || `https://picsum.photos/seed/${category.id}/400/400`;

  return (
    <div
      className="relative w-[160px] rounded-[18px] overflow-hidden cursor-pointer
                 bg-[#1e1a14] shadow-[0_4px_14px_rgba(0,0,0,0.1)] flex-shrink-0
                 scroll-snap-align-start flex flex-col
                 transition-all duration-[280ms] ease-[cubic-bezier(.25,.8,.25,1)]
                 hover:-translate-y-[5px] hover:shadow-[0_14px_32px_rgba(61,43,26,0.18)]
                 animate-fade-up"
      style={{ animationDelay: `${index * 55}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* ── Image ── */}
      <div className="relative w-full h-[160px] overflow-hidden flex-shrink-0">
        <img
          src={img}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-[450ms] ease-in-out
                     hover:scale-108"
        />
        {/* Ajout de l'icône au centre de l'image pour un look plus "App" */}
        <div className="absolute inset-0 flex items-center justify-center text-[40px] z-10">
           {category.icon}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(30,26,20,0.82)]" />
      </div>

      {/* ── Body ── */}
      <div className="px-3 py-2.5 pb-3.5 flex flex-col items-center gap-1.5
                      bg-[#1e1a14] text-center">
        <p className="font-[Playfair_Display,Georgia,serif] text-[13px] font-bold
                      text-[#f5ede0] m-0 leading-[1.3]">
          {title}
        </p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          className="flex items-center gap-1 bg-transparent text-[#c8d98a]
                     border border-[rgba(200,217,138,0.3)] rounded-full
                     px-3 py-1 font-[Nunito,sans-serif] text-[10px] font-bold
                     tracking-[0.05em] cursor-pointer
                     transition-all duration-[180ms] ease-in-out
                     hover:bg-[rgba(107,156,62,0.22)] hover:border-[rgba(107,156,62,0.6)]
                     hover:text-white"
        >
          <RiCompassLine size={10} />
          Explorer
        </button>
      </div>
    </div>
  );
}
