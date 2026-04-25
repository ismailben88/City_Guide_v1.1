export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[20px] border-[1.5px] border-[#ede8e0]
                    overflow-hidden animate-pulse">
      <div className="w-full h-[180px] bg-[#f0ebe4]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-[#ede8e0] rounded-full" />
        <div className="h-4 w-2/3 bg-[#e8e0d4] rounded-full" />
        <div className="h-3 w-full bg-[#f0ebe4] rounded-full" />
        <div className="h-3 w-4/5 bg-[#f0ebe4] rounded-full" />
      </div>
    </div>
  );
}
