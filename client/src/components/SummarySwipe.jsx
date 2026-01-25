export default function SummarySwipe({ income, expenses }) {
  const items = [
    { label: "Income", value: income },
    { label: "Spent", value: expenses },
    { label: "Used", value: `${Math.round((expenses / income) * 100)}%` },
  ];

  return (
    <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory">
      {items.map((i) => (
        <div
          key={i.label}
          className="snap-center min-w-[150px] rounded-2xl bg-white/70 backdrop-blur-md px-5 py-4 shadow-sm"
        >
          <p className="text-[11px] tracking-widest uppercase text-gray-400">
            {i.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {typeof i.value === "number"
              ? `₹${i.value.toLocaleString()}`
              : i.value}
          </p>
        </div>
      ))}
    </div>
  );
}