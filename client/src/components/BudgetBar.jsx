export default function BudgetBar({ category, used, total, showLabel = true }) {
  const percent = Math.round((used / total) * 100);

  const barColor =
    percent > 90
      ? "#ef4444"
      : percent > 60
      ? "#facc15"
      : "#22c55e"; //emerald-500

  const glow =
    percent > 90
      ? "0 0 16px rgba(239,68,68,0.35)"
      : "none";

  return (
    <div className="space-y-3">
      {/* Optional label */}
      {showLabel && (
        <div className="flex justify-between text-sm font-medium text-gray-900">
          <span>{category}</span>
          <span className="text-xs text-gray-400">
            ₹{used} / ₹{total}
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(percent, 100)}%`,
            backgroundColor: barColor,
            boxShadow: glow,
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[11px] text-gray-400">
        <span>{percent}% used</span>
        {percent > 90 && (
          <span className="text-red-500 font-medium">
            Over budget
          </span>
        )}
      </div>
    </div>
  );
}