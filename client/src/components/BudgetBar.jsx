export default function BudgetBar({ category, used, total }) {
  const percent = Math.round((used / total) * 100);

  const color =
    percent > 90
      ? "bg-red-500"
      : percent > 70
      ? "bg-yellow-400"
      : "bg-emerald-500";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-800">
          {category}
        </span>
        <span className="text-xs text-gray-400">
          ₹{used} / ₹{total}
        </span>
      </div>

      <div className="mt-4 h-[6px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`${color} h-full transition-[width] duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-[11px] text-gray-400">
        {percent}% of budget used
      </p>
    </div>
  );
}