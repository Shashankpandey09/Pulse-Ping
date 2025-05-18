const MonitorCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-600/30 bg-gray-800/70 backdrop-blur-lg shadow-xl p-4 w-full animate-pulse">
      {/* Title & Status Area */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 w-32 bg-gray-600 rounded-lg" />
        <div className="flex gap-3 items-center">
          <div className="w-5 h-5 bg-gray-600 rounded-full" />
          <div className="w-3 h-3 bg-gray-600 rounded-full" />
        </div>
      </div>

      {/* URL */}
      <div className="h-4 w-48 bg-gray-600 rounded-lg mb-1" />

      {/* Interval Label */}
      <div className="mt-4 h-4 w-36 bg-gray-600 rounded-lg" />
    </div>
  );
};
export default MonitorCardSkeleton