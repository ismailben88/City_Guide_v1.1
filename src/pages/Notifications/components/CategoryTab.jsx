export default function CategoryTab({ cat, active, unreadCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5
        text-sm transition-all duration-150
        ${
          active
            ? "bg-[#5b8523] font-semibold text-white shadow-md shadow-[#5b8523]/20"
            : "font-medium text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <span className="text-base leading-none">{cat.icon}</span>
      <span className="flex-1 text-left">{cat.label}</span>
      {cat.key !== "all" && unreadCount > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active ? "bg-white/25 text-white" : "bg-[#d57a2a]/10 text-[#d57a2a]"
          }`}
        >
          {unreadCount}
        </span>
      )}
    </button>
  );
}
