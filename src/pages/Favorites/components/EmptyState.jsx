import { HiArrowRight } from "react-icons/hi2";

const config = {
  places: {
    emoji: "🗺️",
    title: "No saved places yet",
    sub:   "Explore the map and tap ❤ on any place that catches your eye.",
    cta:   "Explore Places",
    href:  "/places",
  },
  guides: {
    emoji: "🧭",
    title: "No saved guides yet",
    sub:   "Find a local guide and save them for your next trip.",
    cta:   "Browse Guides",
    href:  "/guides",
  },
};

export default function EmptyState({ tab }) {
  const c = config[tab];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">{c.emoji}</span>
      <h3 className="font-[Playfair_Display,Georgia,serif] text-xl font-bold
                     text-[#3d2b1a] mb-2">
        {c.title}
      </h3>
      <p className="font-[Nunito,sans-serif] text-sm text-[#9e8e80] max-w-xs mb-6">
        {c.sub}
      </p>
      <a
        href={c.href}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full
                   bg-[#6b9c3e] text-white font-[Nunito,sans-serif] text-sm font-bold
                   hover:bg-[#c8761a] transition-colors duration-200"
      >
        {c.cta} <HiArrowRight size={14} />
      </a>
    </div>
  );
}
