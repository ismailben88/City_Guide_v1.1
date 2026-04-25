export default function SectionDivider({ label, count, action, onAction }) {
  return (
    <div className="flex items-center gap-3 py-3 mb-1">
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
        {count}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
      {action && (
        <button
          onClick={onAction}
          className="shrink-0 text-[11px] text-[#5b8523] hover:underline font-medium"
        >
          {action}
        </button>
      )}
    </div>
  );
}
