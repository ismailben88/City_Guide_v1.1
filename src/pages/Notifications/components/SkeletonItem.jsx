export default function SkeletonItem() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 mb-2 animate-pulse">
      <div className="mt-1 h-2 w-2 rounded-full bg-gray-200 shrink-0" />
      <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-2.5 w-1/4 rounded bg-gray-100" />
      </div>
      <div className="h-5 w-16 rounded-full bg-gray-100 shrink-0" />
    </div>
  );
}
